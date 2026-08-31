'use client';

import Link from 'next/link';
import { contarConcluidas, estadoDe } from '@/core/progress';
import type { Activity } from '@/core/activity/tipos';
import { useProgressoGeral } from '@/lib/use-progresso';

const ROTULO: Record<Activity['kind'], string> = {
  reading: 'Leitura',
  video: 'Vídeo',
  simulator: 'Laboratório',
  exercise: 'Exercícios',
  external: 'Fora do LVM',
};

export function Trilho({ atividades }: { atividades: readonly Activity[] }) {
  const progresso = useProgressoGeral();
  const feitas = contarConcluidas(progresso, atividades.map((a) => a.id));
  const proximaId = atividades.find((a) => !estadoDe(progresso, a.id).concluida)?.id;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div
          className="barra"
          style={{ flex: 1 }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={atividades.length}
          aria-valuenow={feitas}
          aria-label="Progresso nesta trilha"
        >
          <div
            className="barra__preenchido"
            style={{ width: `${(feitas / atividades.length) * 100}%` }}
          />
        </div>
        <span className="meta medida">
          {feitas}/{atividades.length}
        </span>
      </div>

      <ol className="trilho">
        {atividades.map((atividade, indice) => {
          const estado = estadoDe(progresso, atividade.id);
          const atual = atividade.id === proximaId;
          const classes = [
            'trilho__passo',
            estado.concluida ? 'trilho__passo--feito' : '',
            atual ? 'trilho__passo--atual' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <li key={atividade.id} className={classes}>
              <span className="trilho__marca" aria-hidden="true">
                {estado.concluida ? '✓' : indice + 1}
              </span>
              <div className="cartao cartao--acionavel">
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="selo selo--neutro">{ROTULO[atividade.kind]}</span>
                  {atual ? <span className="selo selo--destaque">você está aqui</span> : null}
                  {estado.concluida ? <span className="selo selo--feito">concluída</span> : null}
                </div>
                <h3 style={{ fontSize: '1.05rem' }}>
                  <Link href={`/lab/${atividade.id}`}>{atividade.title}</Link>
                </h3>
                {atividade.kind === 'exercise' && estado.tentativas > 0 ? (
                  <p className="meta medida">
                    {estado.acertos} {estado.acertos === 1 ? 'acerto' : 'acertos'} em{' '}
                    {estado.tentativas} {estado.tentativas === 1 ? 'tentativa' : 'tentativas'}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
