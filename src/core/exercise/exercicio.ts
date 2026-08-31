import type { ConfiguracaoTriangulo } from '@/core/exercise/catalogo';
import {
  TOLERANCIA_RESPOSTA,
  type Exercicio,
  type RespostaEsperada,
  type Verificacao,
} from '@/core/exercise/tipos';

/**
 * Erro previsível de aluno, com a dica correspondente. Existe para que a dica
 * fale do erro cometido ("você parou em m·n") em vez de repetir a fórmula.
 */
export interface Diagnostico {
  readonly valorErrado: (config: ConfiguracaoTriangulo) => number;
  readonly dica: string;
}

export interface EspecificacaoExercicio {
  readonly generatorId: string;
  readonly seed: number;
  readonly config: ConfiguracaoTriangulo;
  readonly statement: string;
  readonly givens: Readonly<Record<string, number>>;
  readonly resposta: RespostaEsperada;
  readonly diagnosticos: readonly Diagnostico[];
  readonly dicaGeral: string;
}

export function criarExercicio(spec: EspecificacaoExercicio): Exercicio {
  const { config, resposta, diagnosticos, dicaGeral } = spec;

  function check(answer: number): Verificacao {
    if (!Number.isFinite(answer)) {
      return { correct: false, hint: dicaGeral };
    }
    if (Math.abs(answer - resposta.valor) <= TOLERANCIA_RESPOSTA) {
      return { correct: true };
    }
    const diagnostico = diagnosticos.find(
      (d) => Math.abs(answer - d.valorErrado(config)) <= TOLERANCIA_RESPOSTA,
    );
    return { correct: false, hint: diagnostico?.dica ?? dicaGeral };
  }

  return {
    generatorId: spec.generatorId,
    seed: spec.seed,
    statement: spec.statement,
    givens: spec.givens,
    resposta,
    triangulo: config,
    check,
  };
}
