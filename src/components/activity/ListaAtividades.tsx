'use client';

import Link from 'next/link';
import { estadoDe } from '@/core/progress';
import type { Activity } from '@/core/activity/tipos';
import { useProgressoGeral } from '@/lib/use-progresso';

const ROTULO: Record<Activity['kind'], string> = {
  reading: 'Leitura',
  video: 'Vídeo',
  simulator: 'Laboratório',
  exercise: 'Exercícios',
  external: 'Link externo',
};

export function ListaAtividades({ atividades }: { atividades: readonly Activity[] }) {
  const progresso = useProgressoGeral();

  return (
    <ol className="flex flex-col gap-3">
      {atividades.map((atividade, indice) => {
        const estado = estadoDe(progresso, atividade.id);

        return (
          <li key={atividade.id} className="cartao">
            <p className="meta">
              {indice + 1}. {ROTULO[atividade.kind]}
              {estado.concluida ? ' · concluída ✓' : ''}
            </p>
            <Link href={`/lab/${atividade.id}`} className="font-medium underline">
              {atividade.title}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
