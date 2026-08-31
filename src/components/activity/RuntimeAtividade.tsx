// Server component de propósito: só faz lookup e delega. Assim um renderer pode
// ser servidor (leitura, vídeo, link) ou cliente (simulador, exercício) conforme
// a necessidade, em vez de arrastar tudo para o cliente.
import '@/components/activity/renderers';
import { renderizarAtividade, type RecursosAtividade } from '@/components/activity/registry';
import type { Activity } from '@/core/activity/tipos';

export function RuntimeAtividade({
  atividade,
  recursos = {},
}: {
  atividade: Activity;
  recursos?: RecursosAtividade;
}) {
  const conteudo = renderizarAtividade(atividade, recursos);

  if (conteudo === undefined) {
    return (
      <p role="alert">
        Ainda não sei exibir atividades do tipo <code>{atividade.kind}</code>.
      </p>
    );
  }

  return conteudo;
}
