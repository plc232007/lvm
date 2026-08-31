import 'katex/dist/katex.min.css';
import { notFound } from 'next/navigation';
import { RuntimeAtividade } from '@/components/activity/RuntimeAtividade';
import { ATIVIDADES_VALIDADAS, obterAtividade } from '@/lib/conteudo';

export function generateStaticParams() {
  return ATIVIDADES_VALIDADAS.map((atividade) => ({ activityId: atividade.id }));
}

// Rota única para todo laboratório: adicionar atividade é editar `content/`.
export default async function PaginaAtividade({
  params,
}: {
  params: Promise<{ activityId: string }>;
}) {
  const { activityId } = await params;
  const atividade = obterAtividade(activityId);

  if (!atividade) notFound();

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-3">
      <h1 className="text-lg font-bold">{atividade.title}</h1>
      <RuntimeAtividade atividade={atividade} />
    </main>
  );
}
