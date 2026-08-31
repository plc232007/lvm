'use client';

import type { ComponentType } from 'react';
import type { PropsRenderer } from '@/components/activity/registry';
import { SimuladorRelacoesMetricas } from '@/components/math/SimuladorRelacoesMetricas';

const SIMULADORES: Record<string, ComponentType> = {
  'relacoes-metricas': SimuladorRelacoesMetricas,
};

export function SimuladorRenderer({ atividade }: PropsRenderer<'simulator'>) {
  const Simulador = SIMULADORES[atividade.config.simuladorId];

  if (!Simulador) {
    return (
      <p role="alert">
        Simulador desconhecido: <code>{atividade.config.simuladorId}</code>
      </p>
    );
  }

  return <Simulador />;
}
