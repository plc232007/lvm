import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Trilho } from '@/components/activity/Trilho';
import { obterTrilha, TRILHAS } from '@/lib/conteudo';

export function generateStaticParams() {
  return TRILHAS.map((trilha) => ({ slug: trilha.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/trilhas/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const trilha = obterTrilha(slug);
  return { title: trilha?.titulo ?? 'Trilha' };
}

export default async function PaginaTrilha({ params }: PageProps<'/trilhas/[slug]'>) {
  const { slug } = await params;
  const trilha = obterTrilha(slug);

  if (!trilha) notFound();

  return (
    <div className="envolucro envolucro--estreito">
      <header style={{ margin: '1.5rem 0 2rem', maxWidth: '38rem' }}>
        <p className="selo selo--neutro" style={{ marginBottom: '0.75rem' }}>
          Trilha
        </p>
        <h1 className="titulo-pagina" style={{ marginBottom: '0.5rem' }}>
          {trilha.titulo}
        </h1>
        <p style={{ color: 'var(--tinta-media)' }}>{trilha.resumo}</p>
      </header>

      <Trilho atividades={trilha.atividades} />
    </div>
  );
}
