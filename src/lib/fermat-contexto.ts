export interface ContextoFermat {
  readonly titulo: string;
  readonly tipo: string;
  readonly trilha?: string;
  /** Enunciado do exercício em aberto. A resposta esperada nunca entra aqui. */
  readonly enunciado?: string;
}

const ouvintes = new Set<() => void>();

let base: { titulo: string; tipo: string; trilha?: string } | null = null;
let enunciado: string | undefined;
let instantaneo: ContextoFermat | null = null;

/** O snapshot precisa manter a mesma referência entre renders, senão o React relaça. */
function recompor(): void {
  instantaneo = base ? { ...base, ...(enunciado ? { enunciado } : {}) } : null;
  for (const ouvinte of ouvintes) ouvinte();
}

export function assinarContexto(ouvinte: () => void): () => void {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

export function lerContexto(): ContextoFermat | null {
  return instantaneo;
}

export function definirLugar(novo: { titulo: string; tipo: string; trilha?: string } | null): void {
  base = novo;
  if (!novo) enunciado = undefined;
  recompor();
}

export function definirEnunciado(texto: string | undefined): void {
  if (enunciado === texto) return;
  enunciado = texto;
  recompor();
}
