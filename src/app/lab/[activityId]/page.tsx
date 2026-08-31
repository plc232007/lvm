import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BotaoConcluir } from '@/components/activity/BotaoConcluir';
import { RuntimeAtividade } from '@/components/activity/RuntimeAtividade';
import type { RecursosAtividade } from '@/components/activity/registry';
import { RegistrarContexto } from '@/components/fermat/RegistrarContexto';
import type { Activity } from '@/core/activity/tipos';
import { lerTexto, obterAtividade, todasAtividades, trilhaDaAtividade } from '@/lib/conteudo';

const ROTULO: Record<Activity['kind'], string> = {
  reading: 'Leitura',
  video: 'Vídeo',
  simulator: 'Laboratório',
  exercise: 'Exercícios',
  external: 'Fora do LVM',
};

export function generateStaticParams() {
  return todasAtividades().map((atividade) => ({ activityId: atividade.id }));
}

export async function generateMetadata({
  params,
}: PageProps<'/lab/[activityId]'>): Promise<Metadata> {
  const { activityId } = await params;
  return { title: obterAtividade(activityId)?.title ?? 'Atividade' };
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
  const paradas = trilha?.atividades ?? [];
  const indice = paradas.findIndex((parada) => parada.id === atividade.id);
  const anterior = indice > 0 ? paradas[indice - 1] : undefined;
  const proxima = indice >= 0 && indice < paradas.length - 1 ? paradas[indice + 1] : undefined;

  return (
    <div className="envolucro envolucro--estreito">
      <RegistrarContexto
        titulo={atividade.title}
        tipo={atividade.kind}
        trilha={trilha?.titulo}
      />

      {trilha ? (
        <nav aria-label="Trilha" style={{ margin: '1rem 0 1.25rem' }}>
          <Link href={`/trilhas/${trilha.slug}`} className="meta">
            ← {trilha.titulo}
          </Link>
        </nav>
      ) : null}

      <header style={{ marginBottom: '1.5rem' }}>
        <p style={{ marginBottom: '0.6rem' }}>
          <span className="selo selo--neutro">{ROTULO[atividade.kind]}</span>
          {indice >= 0 ? (
            <span className="meta medida" style={{ marginLeft: '0.5rem' }}>
              parada {indice + 1} de {paradas.length}
            </span>
          ) : null}
        </p>
        <h1 className="titulo-pagina">{atividade.title}</h1>
      </header>

      <RuntimeAtividade atividade={atividade} recursos={carregarRecursos(atividade)} />

      {atividade.kind === 'exercise' ? null : (
        <div style={{ marginTop: '1.5rem' }}>
          <BotaoConcluir atividadeId={atividade.id} />
        </div>
      )}

      <nav className="navegacao-paradas" aria-label="Outras paradas da trilha">
        {anterior ? (
          <Link className="navegacao-paradas__item" href={`/lab/${anterior.id}`}>
            <span className="meta">← Anterior</span>
            <span>{anterior.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {proxima ? (
          <Link
            className="navegacao-paradas__item navegacao-paradas__item--fim"
            href={`/lab/${proxima.id}`}
          >
            <span className="meta">Próxima →</span>
            <span>{proxima.title}</span>
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
