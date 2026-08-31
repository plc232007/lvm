import { CHAVE_PROGRESSO, PROGRESSO_VAZIO, type Progresso } from '@/core/progress';
import { escreverProgresso, lerProgresso } from '@/lib/progresso-storage';

let cache: Progresso | null = null;
const ouvintes = new Set<() => void>();

function avisar(): void {
  for (const ouvinte of ouvintes) ouvinte();
}

export function assinar(ouvinte: () => void): () => void {
  ouvintes.add(ouvinte);
  // Progresso alterado em outra aba do mesmo aluno.
  const aoMudarStorage = (evento: StorageEvent) => {
    if (evento.key === CHAVE_PROGRESSO) {
      cache = null;
      avisar();
    }
  };
  window.addEventListener('storage', aoMudarStorage);

  return () => {
    ouvintes.delete(ouvinte);
    window.removeEventListener('storage', aoMudarStorage);
  };
}

/** Precisa devolver a mesma referência enquanto nada muda, senão o React relaça. */
export function lerSnapshot(): Progresso {
  cache ??= lerProgresso();
  return cache;
}

export function lerSnapshotDoServidor(): Progresso {
  return PROGRESSO_VAZIO;
}

export function atualizarProgresso(transformar: (progresso: Progresso) => Progresso): void {
  cache = transformar(lerSnapshot());
  escreverProgresso(cache);
  avisar();
}
