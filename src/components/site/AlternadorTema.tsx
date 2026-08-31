'use client';

import { useSyncExternalStore } from 'react';
import { assinarTema, lerTema, trocarTema, type Tema } from '@/lib/tema';

const PROXIMO: Record<Tema, Tema> = { sistema: 'claro', claro: 'escuro', escuro: 'sistema' };
const ROTULO: Record<Tema, string> = {
  sistema: 'Tema do sistema',
  claro: 'Tema claro',
  escuro: 'Tema escuro',
};
const SIMBOLO: Record<Tema, string> = { sistema: '◐', claro: '☀', escuro: '☾' };

export function AlternadorTema() {
  const tema = useSyncExternalStore(assinarTema, lerTema, () => 'sistema' as Tema);

  return (
    <button
      type="button"
      className="botao botao--fantasma botao--compacto"
      onClick={() => trocarTema(PROXIMO[tema])}
      aria-label={`${ROTULO[tema]}. Trocar para ${ROTULO[PROXIMO[tema]].toLowerCase()}`}
      title={ROTULO[tema]}
    >
      <span aria-hidden="true" style={{ fontSize: '1rem', lineHeight: 1 }}>
        {SIMBOLO[tema]}
      </span>
    </button>
  );
}
