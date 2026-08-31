'use client';

import Link from 'next/link';
import { contarConcluidas, estadoDe } from '@/core/progress';
import type { Trilha } from '@/core/activity/tipos';
import { useProgressoGeral } from '@/lib/use-progresso';

export function CartaoTrilha({ trilha }: { trilha: Trilha }) {
  const progresso = useProgressoGeral();
  const ids = trilha.atividades.map((atividade) => atividade.id);
  const feitas = contarConcluidas(progresso, ids);
  const total = ids.length;
  const proxima = trilha.atividades.find((a) => !estadoDe(progresso, a.id).concluida);

  return (
    <article className="cartao cartao--acionavel">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
        <h3 style={{ fontSize: '1.15rem' }}>
          <Link href={`/trilhas/${trilha.slug}`}>{trilha.titulo}</Link>
        </h3>
        <span className={feitas === total ? 'selo selo--feito' : 'selo selo--neutro'}>
          {feitas} de {total}
        </span>
      </div>

      <p style={{ color: 'var(--tinta-media)' }}>{trilha.resumo}</p>

      <div
        className="barra"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={feitas}
        aria-label={`Progresso na trilha ${trilha.titulo}`}
      >
        <div className="barra__preenchido" style={{ width: `${(feitas / total) * 100}%` }} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
        {proxima ? (
          <Link className="botao" href={`/lab/${proxima.id}`}>
            {feitas === 0 ? 'Começar' : 'Continuar'}
          </Link>
        ) : (
          <Link className="botao botao--fantasma" href={`/trilhas/${trilha.slug}`}>
            Revisar trilha
          </Link>
        )}
        <Link className="botao botao--fantasma" href={`/trilhas/${trilha.slug}`}>
          Ver as {total} paradas
        </Link>
      </div>
    </article>
  );
}
