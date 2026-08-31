import { notFound } from 'next/navigation';
import { ListaAtividades } from '@/components/activity/ListaAtividades';
import { obterTrilha, TRILHAS } from '@/lib/conteudo';

export function generateStaticParams() {
  return TRILHAS.map((trilha) => ({ slug: trilha.slug }));
}

export default async function PaginaTrilha({ params }: PageProps<'/trilhas/[slug]'>) {
  const { slug } = await params;
  const trilha = obterTrilha(slug);

  if (!trilha) notFound();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{trilha.titulo}</h1>
        <p className="max-w-prose">{trilha.resumo}</p>
      </div>
      <ListaAtividades atividades={trilha.atividades} />
    </main>
  );
}
