import type { ConfiguracaoTriangulo } from '@/core/exercise/catalogo';
import type { Simbolo } from '@/core/math/relacoes';

/**
 * Tolerância pedagógica, não numérica: o aluno digita 4,8 para uma resposta que
 * o double guarda como 4,800000000000001. Nada a ver com EPS, que serve para
 * provar identidades do domínio.
 */
export const TOLERANCIA_RESPOSTA = 0.005;

export interface Verificacao {
  readonly correct: boolean;
  readonly hint?: string;
}

export interface RespostaEsperada {
  readonly simbolo: Simbolo;
  readonly valor: number;
}

export interface Exercicio {
  readonly generatorId: string;
  readonly seed: number;
  readonly statement: string;
  readonly givens: Readonly<Record<string, number>>;
  readonly resposta: RespostaEsperada;
  readonly triangulo: ConfiguracaoTriangulo;
  check(answer: number): Verificacao;
}

export interface ExerciseGenerator {
  readonly id: string;
  readonly titulo: string;
  readonly descricao: string;
  generate(seed: number): Exercicio;
}
