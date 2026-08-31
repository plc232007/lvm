'use client';

import { useSyncExternalStore } from 'react';
import { estadoDe, type EstadoAtividade, type Progresso } from '@/core/progress';
import {
  assinar,
  atualizarProgresso,
  lerSnapshot,
  lerSnapshotDoServidor,
} from '@/lib/progresso-store';

/**
 * `useSyncExternalStore` existe exatamente para isto: o servidor renderiza o
 * progresso vazio, o cliente troca pelo real logo após a hidratação, e não há
 * `setState` dentro de efeito nem divergência de marcação.
 */
export function useProgresso(atividadeId: string): {
  estado: EstadoAtividade;
  atualizar: (transformar: (progresso: Progresso) => Progresso) => void;
} {
  const progresso = useSyncExternalStore(assinar, lerSnapshot, lerSnapshotDoServidor);

  return { estado: estadoDe(progresso, atividadeId), atualizar: atualizarProgresso };
}
