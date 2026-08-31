import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  CASAS_DADOS,
  CASAS_RESPOSTA,
  poolCatetosParaAltura,
  poolHipotenusaParaCateto,
  poolProjecoesParaAltura,
} from '@/core/exercise/catalogo';
import { GERADORES, obterGerador } from '@/core/exercise/generators';
import { TOLERANCIA_RESPOSTA, type ExerciseGenerator } from '@/core/exercise/tipos';
import { casasDecimais, formatarNumero } from '@/core/math/formato';
import { relacaoVale, relacoesMetricas, type Simbolo } from '@/core/math/relacoes';
import { quaseIgual } from '@/core/math/tolerancia';
import { construirDeCatetos } from '@/core/math/triangulo-retangulo';

const SEMENTES = Array.from({ length: 200 }, (_, i) => i);
const semente = fc.integer({ min: 0, max: 2 ** 31 - 1 });

/** Remove expoentes de LaTeX para que "h^2" não conte como o número 2 na dica. */
function semExpoentes(texto: string): string {
  return texto.replace(/\^\{?-?\d+\}?/g, '');
}

describe('pools do catálogo', () => {
  const pools = {
    'projeções → altura': poolProjecoesParaAltura(),
    'hipotenusa → cateto': poolHipotenusaParaCateto(),
    'catetos → altura': poolCatetosParaAltura(),
  };

  for (const [nome, pool] of Object.entries(pools)) {
    it(`${nome}: pool com pelo menos 50 configurações`, () => {
      expect(pool.length).toBeGreaterThanOrEqual(50);
    });

    it(`${nome}: toda configuração é um triângulo retângulo de verdade`, () => {
      for (const config of pool) {
        const resultado = construirDeCatetos(config.b, config.c);
        expect(resultado.ok).toBe(true);
        if (!resultado.ok) return;
        const t = resultado.valor;
        expect(quaseIgual(t.a, config.a), `a: ${t.a} vs ${config.a}`).toBe(true);
        expect(quaseIgual(t.h, config.h), `h: ${t.h} vs ${config.h}`).toBe(true);
        expect(quaseIgual(t.m, config.m), `m: ${t.m} vs ${config.m}`).toBe(true);
        expect(quaseIgual(t.n, config.n), `n: ${t.n} vs ${config.n}`).toBe(true);
      }
    });
  }
});

describe('registry de geradores', () => {
  it('expõe os três geradores da fatia vertical', () => {
    expect(GERADORES.map((g) => g.id)).toEqual([
      'h-por-projecoes',
      'cateto-por-projecao',
      'altura-por-catetos',
    ]);
  });

  it('busca por id e devolve undefined para id desconhecido', () => {
    expect(obterGerador('h-por-projecoes')?.titulo).toBeDefined();
    expect(obterGerador('nao-existe')).toBeUndefined();
  });
});

describe.each(GERADORES.map((g) => [g.id, g] as const))('gerador %s', (_id, gerador) => {
  const g: ExerciseGenerator = gerador;

  it('é determinístico: mesma semente, exercício idêntico', () => {
    fc.assert(
      fc.property(semente, (seed) => {
        const primeiro = g.generate(seed);
        const segundo = g.generate(seed);
        expect(primeiro.statement).toBe(segundo.statement);
        expect(primeiro.givens).toEqual(segundo.givens);
        expect(primeiro.resposta).toEqual(segundo.resposta);
      }),
      { numRuns: 200 },
    );
  });

  it('a resposta esperada satisfaz as seis relações métricas', () => {
    for (const seed of SEMENTES) {
      const exercicio = g.generate(seed);
      const { b, c } = exercicio.triangulo;
      const resultado = construirDeCatetos(b, c);
      expect(resultado.ok).toBe(true);
      if (!resultado.ok) return;

      const t = resultado.valor;
      const medida: Record<Simbolo, number> = {
        a: t.a,
        b: t.b,
        c: t.c,
        h: t.h,
        m: t.m,
        n: t.n,
      };
      expect(
        quaseIgual(exercicio.resposta.valor, medida[exercicio.resposta.simbolo]),
        `semente ${seed}: resposta ${exercicio.resposta.valor} não é a medida do triângulo`,
      ).toBe(true);

      for (const relacao of relacoesMetricas(t)) {
        expect(relacaoVale(relacao), `semente ${seed}: ${relacao.latex}`).toBe(true);
      }
    }
  });

  it('apresenta números amigáveis e resposta positiva', () => {
    for (const seed of SEMENTES) {
      const exercicio = g.generate(seed);
      for (const [nome, valor] of Object.entries(exercicio.givens)) {
        expect(casasDecimais(valor), `semente ${seed}: ${nome} = ${valor}`).toBeLessThanOrEqual(
          CASAS_DADOS,
        );
        expect(valor).toBeGreaterThan(0);
      }
      expect(casasDecimais(exercicio.resposta.valor)).toBeLessThanOrEqual(CASAS_RESPOSTA);
      expect(exercicio.resposta.valor).toBeGreaterThan(0);
    }
  });

  it('todo dado do enunciado aparece no texto', () => {
    for (const seed of SEMENTES.slice(0, 50)) {
      const exercicio = g.generate(seed);
      for (const valor of Object.values(exercicio.givens)) {
        const emLatex = formatarNumero(valor).replace(',', '{,}');
        expect(exercicio.statement, `semente ${seed}`).toContain(emLatex);
      }
    }
  });

  it('aceita a resposta exata e a resposta arredondada em duas casas', () => {
    for (const seed of SEMENTES) {
      const exercicio = g.generate(seed);
      const exata = exercicio.resposta.valor;
      expect(exercicio.check(exata).correct, `semente ${seed}: exata`).toBe(true);
      expect(
        exercicio.check(Number(exata.toFixed(2))).correct,
        `semente ${seed}: arredondada`,
      ).toBe(true);
    }
  });

  it('recusa resposta errada com dica que não entrega o número', () => {
    for (const seed of SEMENTES) {
      const exercicio = g.generate(seed);
      const errada = exercicio.resposta.valor + 1 + TOLERANCIA_RESPOSTA;
      const verificacao = exercicio.check(errada);
      expect(verificacao.correct, `semente ${seed}`).toBe(false);
      expect(verificacao.hint ?? '').not.toBe('');
      expect(semExpoentes(verificacao.hint ?? '')).not.toMatch(/\d/);
    }
  });

  it('recusa entrada não numérica sem quebrar', () => {
    const exercicio = g.generate(1);
    for (const entrada of [Number.NaN, Number.POSITIVE_INFINITY]) {
      const verificacao = exercicio.check(entrada);
      expect(verificacao.correct).toBe(false);
      expect(verificacao.hint).toBeTruthy();
    }
  });

  it('em 200 sementes produz pelo menos 50 conjuntos de dados distintos', () => {
    const vistos = new Set(
      SEMENTES.map((seed) => JSON.stringify(g.generate(seed).givens)),
    );
    expect(vistos.size).toBeGreaterThanOrEqual(50);
  });
});

describe('dicas por erro típico', () => {
  /**
   * Procura uma semente em que o erro típico realmente difere da resposta.
   * Existem configurações em que ele coincide — com a = 1, por exemplo,
   * b · c é igual a h — e ali a resposta está certa, não errada.
   */
  function primeiraSementeCom(
    gerador: ExerciseGenerator,
    errado: (t: { a: number; b: number; c: number; h: number; m: number; n: number }) => number,
  ) {
    for (const seed of SEMENTES) {
      const exercicio = gerador.generate(seed);
      const valor = errado(exercicio.triangulo);
      if (Math.abs(valor - exercicio.resposta.valor) > TOLERANCIA_RESPOSTA) {
        return { exercicio, valor };
      }
    }
    throw new Error('nenhuma semente produz esse erro típico');
  }

  it('reconhece quem esqueceu a raiz em h² = m · n', () => {
    const { exercicio, valor } = primeiraSementeCom(GERADORES[0]!, (t) => t.m * t.n);
    const verificacao = exercicio.check(valor);
    expect(verificacao.correct).toBe(false);
    expect(verificacao.hint).toMatch(/raiz quadrada/);
  });

  it('reconhece quem devolveu o produto dos catetos em vez da altura', () => {
    const { exercicio, valor } = primeiraSementeCom(GERADORES[2]!, (t) => t.b * t.c);
    const verificacao = exercicio.check(valor);
    expect(verificacao.correct).toBe(false);
    expect(verificacao.hint).toMatch(/dividir pela hipotenusa/);
  });

  it('reconhece quem trocou o cateto pela hipotenusa vezes a projeção', () => {
    const { exercicio, valor } = primeiraSementeCom(GERADORES[1]!, (t) => t.a * t.m);
    const verificacao = exercicio.check(valor);
    expect(verificacao.correct).toBe(false);
    expect(verificacao.hint).toMatch(/raiz quadrada/);
  });
});
