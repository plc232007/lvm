'use client';

import '@/components/activity/renderers';
import { renderizarAtividade } from '@/components/activity/registry';
import type { Activity } from '@/core/activity/tipos';

export function RuntimeAtividade({ atividade }: { atividade: Activity }) {
  const conteudo = renderizarAtividade(atividade);

  if (conteudo === undefined) {
    return (
      <p role="alert">
        Ainda não sei exibir atividades do tipo <code>{atividade.kind}</code>.
      </p>
    );
  }

  return conteudo;
}
