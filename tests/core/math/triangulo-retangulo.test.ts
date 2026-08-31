import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  medidas as medidasDe,
  relacaoVale,
  relacoesMetricas,
  substituirSimbolos,
  type RelacaoId,
} from '@/core/math/relacoes';
import { EPS, quaseIgual } from '@/core/math/tolerancia';
import {
  construirDeCatetos,
  construirTriangulo,
  type TrianguloRetangulo,
} from '@/core/math/triangulo-retangulo';
import { produtoEscalar, subtrair } from '@/core/math/vetor';

const coordenada = fc.double({ min: -100, max: 100, noNaN: true });
const ponto2d = fc.record({ x: coordenada, y: coordenada });

/**
 * Triângulos quase degenerados são excluídos por limitação do ponto flutuante,
 * não do modelo: quando h/a → 0 o pé da altura encosta em um vértice e medir a
 * projeção curta vira cancelamento catastrófico. O teste
 * "limites de precisão" abaixo documenta esse regime explicitamente.
 */
function trianguloUtilizavel(t: TrianguloRetangulo): boolean {
  return t.a >= 1 && t.h >= 0.01 * t.a;
}

function comTriangulo(executar: (t: TrianguloRetangulo) => void, numRuns = 1000): void {
  fc.assert(
    fc.property(ponto2d, ponto2d, ponto2d, (B, C, P) => {
      const resultado = construirTriangulo({ B, C, P });
      if (!resultado.ok) return fc.pre(false);
      const t = resultado.valor;
      fc.pre(trianguloUtilizavel(t));
      executar(t);
    }),
    { numRuns },
  );
}

describe('construção', () => {
  it('mantém o ângulo reto em A para qualquer posição de P', () => {
    comTriangulo((t) => {
      const cosseno =
        produtoEscalar(subtrair(t.B, t.A), subtrair(t.C, t.A)) / (t.c * t.b);
      expect(Math.abs(cosseno)).toBeLessThan(1e-9);
    });
  });

  it('produz seis medidas finitas e estritamente positivas', () => {
    comTriangulo((t) => {
      for (const valor of [t.a, t.b, t.c, t.h, t.m, t.n]) {
        expect(Number.isFinite(valor)).toBe(true);
        expect(valor).toBeGreaterThan(0);
      }
    });
  });

  it('mantém o pé da altura entre B e C', () => {
    comTriangulo((t) => {
      expect(t.m).toBeLessThan(t.a);
      expect(t.n).toBeLessThan(t.a);
    });
  });
});

describe('relações métricas', () => {
  const ids: RelacaoId[] = [
    'pitagoras',
    'cateto-b',
    'cateto-c',
    'altura',
    'area-dupla',
    'decomposicao',
  ];

  for (const id of ids) {
    it(`vale para 1000 triângulos aleatórios: ${id}`, () => {
      comTriangulo((t) => {
        const relacao = relacoesMetricas(t).find((r) => r.id === id);
        expect(relacao).toBeDefined();
        if (!relacao) return;
        expect(
          relacaoVale(relacao),
          `${relacao.latex} falhou: ${relacao.esquerda.valor} vs ${relacao.direita.valor}`,
        ).toBe(true);
      });
    });
  }

  it('reprova um triângulo forjado com medidas inconsistentes', () => {
    const falso: TrianguloRetangulo = {
      A: { x: 0, y: 0 },
      B: { x: 0, y: 0 },
      C: { x: 0, y: 0 },
      H: { x: 0, y: 0 },
      a: 5,
      b: 3,
      c: 4,
      h: 2.4,
      m: 1.8,
      n: 3.3,
    };
    const reprovadas = relacoesMetricas(falso).filter((r) => !relacaoVale(r));
    expect(reprovadas.map((r) => r.id)).toEqual(['cateto-c', 'altura', 'decomposicao']);
  });
});

describe('triângulo 3-4-5', () => {
  it('deriva h = 2,4, m = 1,8 e n = 3,2', () => {
    const resultado = construirDeCatetos(3, 4);
    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    const t = resultado.valor;
    expect(quaseIgual(t.a, 5)).toBe(true);
    expect(quaseIgual(t.b, 3)).toBe(true);
    expect(quaseIgual(t.c, 4)).toBe(true);
    expect(quaseIgual(t.h, 2.4)).toBe(true);
    expect(quaseIgual(t.m, 1.8)).toBe(true);
    expect(quaseIgual(t.n, 3.2)).toBe(true);
  });

  it('não depende da orientação em que os vértices são dados', () => {
    const direto = construirTriangulo({
      B: { x: 0, y: 0 },
      C: { x: 5, y: 0 },
      P: { x: 3.2, y: 2.4 },
    });
    const girado = construirTriangulo({
      B: { x: 1, y: 1 },
      C: { x: 1, y: 6 },
      P: { x: -1.4, y: 4.2 },
    });
    expect(direto.ok && girado.ok).toBe(true);
    if (!direto.ok || !girado.ok) return;
    expect(quaseIgual(direto.valor.h, girado.valor.h)).toBe(true);
    expect(quaseIgual(direto.valor.m, girado.valor.m)).toBe(true);
  });
});

describe('degenerações', () => {
  it('recusa B = C', () => {
    const r = construirTriangulo({ B: { x: 2, y: 2 }, C: { x: 2, y: 2 }, P: { x: 9, y: 9 } });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.erro.motivo).toBe('hipotenusa-nula');
  });

  it('recusa P no centro da hipotenusa', () => {
    const r = construirTriangulo({ B: { x: 0, y: 0 }, C: { x: 4, y: 0 }, P: { x: 2, y: 0 } });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.erro.motivo).toBe('ponto-no-centro');
  });

  it('recusa P sobre a reta BC', () => {
    const r = construirTriangulo({ B: { x: 0, y: 0 }, C: { x: 4, y: 0 }, P: { x: 30, y: 0 } });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.erro.motivo).toBe('altura-nula');
  });

  it('recusa coordenada não finita em vez de devolver NaN', () => {
    const r = construirTriangulo({
      B: { x: 0, y: 0 },
      C: { x: Number.NaN, y: 0 },
      P: { x: 1, y: 1 },
    });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.erro.motivo).toBe('entrada-nao-finita');
  });

  it('nunca devolve NaN, em nenhum caminho', () => {
    fc.assert(
      fc.property(ponto2d, ponto2d, ponto2d, (B, C, P) => {
        const r = construirTriangulo({ B, C, P });
        if (!r.ok) return;
        for (const valor of Object.values(r.valor)) {
          if (typeof valor === 'number') expect(Number.isNaN(valor)).toBe(false);
          else {
            expect(Number.isNaN(valor.x)).toBe(false);
            expect(Number.isNaN(valor.y)).toBe(false);
          }
        }
      }),
      { numRuns: 500 },
    );
  });
});

describe('limites de precisão', () => {
  it('em triângulos quase degenerados (h/a até 1e-4) as relações valem a 1e-6, não a 1e-9', () => {
    const B = { x: 0, y: 0 };
    const C = { x: 100, y: 0 };
    // P quase alinhado com BC empurra A para junto de C: h/a ~ 5e-6.
    const resultado = construirTriangulo({ B, C, P: { x: 1000, y: 1e-2 } });
    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    const t = resultado.valor;
    expect(t.h / t.a).toBeLessThan(1e-3);
    for (const relacao of relacoesMetricas(t)) {
      expect(relacaoVale(relacao, 1e-6), `${relacao.latex} a 1e-6`).toBe(true);
    }
    expect(EPS).toBe(1e-9);
  });
});

describe('substituição de símbolos', () => {
  const medidas = { a: 10, b: 6, c: 8, h: 4.8, m: 3.6, n: 6.4 };

  it('troca símbolo por valor em notação pt-BR', () => {
    expect(substituirSimbolos('h^2', medidas)).toBe('4{,}8^2');
    expect(substituirSimbolos('m + n', medidas)).toBe('3{,}6 + 6{,}4');
  });

  it('não confunde o cateto c com a macro \\cdot', () => {
    expect(substituirSimbolos('m \\cdot n', medidas)).toBe('3{,}6 \\cdot 6{,}4');
    expect(substituirSimbolos('b \\cdot c', medidas)).toBe('6 \\cdot 8');
  });

  it('produz uma igualdade legível para a relação inteira', () => {
    const resultado = construirDeCatetos(6, 8);
    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    const relacao = relacoesMetricas(resultado.valor).find((r) => r.id === 'altura');
    expect(relacao).toBeDefined();
    if (!relacao) return;
    const valores = medidasDe(resultado.valor);
    expect(substituirSimbolos(relacao.latex, valores)).toBe('4{,}8^2 = 3{,}6 \\cdot 6{,}4');
  });
});
