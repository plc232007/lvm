'use client';

import { concluirAtividade, estadoDe } from '@/core/progress';
import { atualizarProgresso } from '@/lib/progresso-store';
import { useProgressoGeral } from '@/lib/use-progresso';

/** Exercício se conclui sozinho ao acertar; leitura, vídeo e link dependem do aluno. */
export function BotaoConcluir({ atividadeId }: { atividadeId: string }) {
  const concluida = estadoDe(useProgressoGeral(), atividadeId).concluida;

  if (concluida) {
    return <p className="meta">Atividade concluída ✓</p>;
  }

  return (
    <button
      type="button"
      className="botao botao-secundario"
      onClick={() => atualizarProgresso((progresso) => concluirAtividade(progresso, atividadeId))}
    >
      Marcar como concluída
    </button>
  );
}
