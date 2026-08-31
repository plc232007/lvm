import { casasDecimais } from '@/core/math/formato';

/**
 * Um triângulo retângulo já resolvido, com as seis medidas exatas.
 * Os geradores sorteiam uma configuração inteira e só depois escondem parte
 * dela para formar a pergunta — assim é impossível gerar exercício sem solução
 * ou com dados contraditórios.
 */
export interface ConfiguracaoTriangulo {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly h: number;
  readonly m: number;
  readonly n: number;
}

const PASSO_GRADE = 0.1;
const MENOR_DADO = 0.5;
const MAIOR_DADO = 30;
const MAIOR_MEDIDA = 80;
const RAZAO_MAXIMA = 12;
export const CASAS_DADOS = 1;
export const CASAS_RESPOSTA = 2;

const CASAS_LIMPEZA = 4;

/**
 * Tira o ruído de ponto flutuante de quem é decimal curto (0,72000000001 → 0,72)
 * e deixa intacto quem é irracional: arredondar um cateto de medida √1,25 na
 * sexta casa quebraria as identidades do domínio na sétima.
 */
function arredondar(x: number): number {
  const casas = casasDecimais(x, CASAS_LIMPEZA);
  return casas < CASAS_LIMPEZA ? Number(x.toFixed(casas)) : x;
}

function grade(): readonly number[] {
  const valores: number[] = [];
  const passos = Math.round((MAIOR_DADO - MENOR_DADO) / PASSO_GRADE);
  for (let i = 0; i <= passos; i += 1) {
    valores.push(arredondar(MENOR_DADO + i * PASSO_GRADE));
  }
  return valores;
}

function montar(parcial: ConfiguracaoTriangulo): ConfiguracaoTriangulo {
  return {
    a: arredondar(parcial.a),
    b: arredondar(parcial.b),
    c: arredondar(parcial.c),
    h: arredondar(parcial.h),
    m: arredondar(parcial.m),
    n: arredondar(parcial.n),
  };
}

export function deProjecoes(m: number, n: number): ConfiguracaoTriangulo {
  const a = m + n;
  return montar({ a, b: Math.sqrt(a * m), c: Math.sqrt(a * n), h: Math.sqrt(m * n), m, n });
}

export function deCatetos(b: number, c: number): ConfiguracaoTriangulo {
  const a = Math.hypot(b, c);
  return montar({ a, b, c, h: (b * c) / a, m: (b * b) / a, n: (c * c) / a });
}

/** Descarta o que seria ruim de ler na tela, não o que seria matematicamente inválido. */
function ehApresentavel(config: ConfiguracaoTriangulo): boolean {
  const medidas = [config.a, config.b, config.c, config.h, config.m, config.n];
  const menor = Math.min(...medidas);
  const maior = Math.max(...medidas);
  return (
    medidas.every((x) => Number.isFinite(x) && x > 0) &&
    menor >= MENOR_DADO / 2 &&
    maior <= MAIOR_MEDIDA &&
    maior / menor <= RAZAO_MAXIMA
  );
}

function construirPool(
  aceitar: (config: ConfiguracaoTriangulo) => boolean,
  candidatos: (grade: readonly number[]) => Generator<ConfiguracaoTriangulo>,
): readonly ConfiguracaoTriangulo[] {
  const pool: ConfiguracaoTriangulo[] = [];
  for (const config of candidatos(grade())) {
    if (ehApresentavel(config) && aceitar(config)) pool.push(config);
  }
  return pool;
}

function* porProjecoes(valores: readonly number[]): Generator<ConfiguracaoTriangulo> {
  for (const m of valores) {
    for (const n of valores) {
      yield deProjecoes(m, n);
    }
  }
}

function* porCatetos(valores: readonly number[]): Generator<ConfiguracaoTriangulo> {
  for (const b of valores) {
    for (const c of valores) {
      yield deCatetos(b, c);
    }
  }
}

function memoizar(
  construir: () => readonly ConfiguracaoTriangulo[],
): () => readonly ConfiguracaoTriangulo[] {
  let cache: readonly ConfiguracaoTriangulo[] | null = null;
  return () => {
    cache ??= construir();
    return cache;
  };
}

const dadosOk = (config: ConfiguracaoTriangulo, chaves: readonly (keyof ConfiguracaoTriangulo)[]) =>
  chaves.every((chave) => casasDecimais(config[chave]) <= CASAS_DADOS);

const respostaOk = (config: ConfiguracaoTriangulo, chave: keyof ConfiguracaoTriangulo) =>
  casasDecimais(config[chave]) <= CASAS_RESPOSTA;

/** m e n com uma casa; h com no máximo duas. */
export const poolProjecoesParaAltura = memoizar(() =>
  construirPool((c) => dadosOk(c, ['m', 'n']) && respostaOk(c, 'h'), porProjecoes),
);

/** a e m com uma casa; b com no máximo duas. */
export const poolHipotenusaParaCateto = memoizar(() =>
  construirPool((c) => dadosOk(c, ['a', 'm']) && respostaOk(c, 'b'), porProjecoes),
);

/** b e c com uma casa; h com no máximo duas. */
export const poolCatetosParaAltura = memoizar(() =>
  construirPool((c) => dadosOk(c, ['b', 'c']) && respostaOk(c, 'h'), porCatetos),
);
