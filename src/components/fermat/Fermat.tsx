'use client';

import { useState, useSyncExternalStore } from 'react';
import { PainelFermat } from '@/components/fermat/PainelFermat';
import { RostoFermat } from '@/components/fermat/RostoFermat';
import { assinarContexto, lerContexto } from '@/lib/fermat-contexto';

export function Fermat() {
  const [aberto, setAberto] = useState(false);
  const contexto = useSyncExternalStore(assinarContexto, lerContexto, () => null);

  if (aberto) {
    return <PainelFermat contexto={contexto} aoFechar={() => setAberto(false)} />;
  }

  return (
    <button
      type="button"
      className="fermat-lancador"
      onClick={() => setAberto(true)}
      aria-label="Abrir conversa com Fermat, o assistente de matemática"
    >
      <span className="fermat-lancador__rosto">
        <RostoFermat tamanho={34} />
      </span>
      <span className="fermat-lancador__texto">Fermat</span>
    </button>
  );
}
