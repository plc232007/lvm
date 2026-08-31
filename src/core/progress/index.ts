/**
 * Progresso do aluno. Constituição, regra 4: nada aqui identifica ninguém —
 * só o que foi concluído e a contagem de acertos, para o próprio aluno ver.
 */
export const CHAVE_PROGRESSO = 'lvm.progresso.v1';

export interface EstadoAtividade {
  readonly concluida: boolean;
  readonly tentativas: number;
  readonly acertos: number;
}

export interface Progresso {
  readonly atividades: Readonly<Record<string, EstadoAtividade>>;
}

export const ESTADO_INICIAL: EstadoAtividade = { concluida: false, tentativas: 0, acertos: 0 };

export const PROGRESSO_VAZIO: Progresso = { atividades: {} };

export function estadoDe(progresso: Progresso, atividadeId: string): EstadoAtividade {
  return progresso.atividades[atividadeId] ?? ESTADO_INICIAL;
}

function comEstado(
  progresso: Progresso,
  atividadeId: string,
  estado: EstadoAtividade,
): Progresso {
  return { atividades: { ...progresso.atividades, [atividadeId]: estado } };
}

export function registrarTentativa(
  progresso: Progresso,
  atividadeId: string,
  acertou: boolean,
): Progresso {
  const atual = estadoDe(progresso, atividadeId);
  return comEstado(progresso, atividadeId, {
    concluida: atual.concluida,
    tentativas: atual.tentativas + 1,
    acertos: atual.acertos + (acertou ? 1 : 0),
  });
}

export function concluirAtividade(progresso: Progresso, atividadeId: string): Progresso {
  return comEstado(progresso, atividadeId, { ...estadoDe(progresso, atividadeId), concluida: true });
}

export function contarConcluidas(progresso: Progresso, ids: readonly string[]): number {
  return ids.filter((id) => estadoDe(progresso, id).concluida).length;
}

export function serializar(progresso: Progresso): string {
  return JSON.stringify(progresso);
}

function ehEstadoValido(valor: unknown): valor is EstadoAtividade {
  if (typeof valor !== 'object' || valor === null) return false;
  const registro = valor as Record<string, unknown>;
  return (
    typeof registro.concluida === 'boolean' &&
    typeof registro.tentativas === 'number' &&
    typeof registro.acertos === 'number'
  );
}

/** Nunca lança: dado corrompido vira progresso vazio, não uma página quebrada. */
export function desserializar(texto: string | null | undefined): Progresso {
  if (!texto) return PROGRESSO_VAZIO;
  try {
    const bruto: unknown = JSON.parse(texto);
    if (typeof bruto !== 'object' || bruto === null) return PROGRESSO_VAZIO;
    const atividades = (bruto as { atividades?: unknown }).atividades;
    if (typeof atividades !== 'object' || atividades === null) return PROGRESSO_VAZIO;

    const limpo: Record<string, EstadoAtividade> = {};
    for (const [id, estado] of Object.entries(atividades)) {
      if (ehEstadoValido(estado)) {
        limpo[id] = {
          concluida: estado.concluida,
          tentativas: Math.max(0, Math.trunc(estado.tentativas)),
          acertos: Math.max(0, Math.trunc(estado.acertos)),
        };
      }
    }
    return { atividades: limpo };
  } catch {
    return PROGRESSO_VAZIO;
  }
}
