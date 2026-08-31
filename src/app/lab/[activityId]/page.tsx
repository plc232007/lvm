import 'katex/dist/katex.min.css';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BotaoConcluir } from '@/components/activity/BotaoConcluir';
import { RuntimeAtividade } from '@/components/activity/RuntimeAtividade';
import type { RecursosAtividade } from '@/components/activity/registry';
import type { Activity } from '@/core/activity/tipos';
import { lerTexto, obterAtividade, todasAtividades, trilhaDaAtividade } from '@/lib/conteudo';

export function generateStaticParams() {
  return todasAtividades().map((atividade) => ({ activityId: atividade.id }));
}

function carregarRecursos(atividade: Activity): RecursosAtividade {
  return atividade.kind === 'reading' ? { textoMdx: lerTexto(atividade.config.arquivo) } : {};
}

// Rota única para toda atividade: adicionar um laboratório é editar `content/`.
export default async function PaginaAtividade({ params }: PageProps<'/lab/[activityId]'>) {
  const { activityId } = await params;
  const atividade = obterAtividade(activityId);

  if (!atividade) notFound();

  const trilha = trilhaDaAtividade(atividade.id);
  const recursos = carregarRecursos(atividade);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6">
      {trilha ? (
        <Link href={`/trilhas/${trilha.slug}`} className="meta underline">
          ← {trilha.titulo}
        </Link>
      ) : null}
      <h1 className="text-xl font-bold">{atividade.title}</h1>
      <RuntimeAtividade atividade={atividade} recursos={recursos} />
      {atividade.kind === 'exercise' ? null : <BotaoConcluir atividadeId={atividade.id} />}
    </main>
  );
}
