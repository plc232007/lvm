export type Tema = 'sistema' | 'claro' | 'escuro';

export const CHAVE_TEMA = 'lvm.tema.v1';

const ouvintes = new Set<() => void>();
let cache: Tema | null = null;

function ehTema(valor: unknown): valor is Tema {
  return valor === 'sistema' || valor === 'claro' || valor === 'escuro';
}

export function lerTema(): Tema {
  if (cache) return cache;
  try {
    const salvo = window.localStorage.getItem(CHAVE_TEMA);
    cache = ehTema(salvo) ? salvo : 'sistema';
  } catch {
    cache = 'sistema';
  }
  return cache;
}

export function assinarTema(ouvinte: () => void): () => void {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

export function trocarTema(tema: Tema): void {
  cache = tema;
  try {
    window.localStorage.setItem(CHAVE_TEMA, tema);
  } catch {
    // sem persistência: vale só para esta sessão
  }
  aplicarTema(tema);
  for (const ouvinte of ouvintes) ouvinte();
}

export function aplicarTema(tema: Tema): void {
  const raiz = document.documentElement;
  if (tema === 'sistema') raiz.removeAttribute('data-tema');
  else raiz.setAttribute('data-tema', tema);
}

/** Roda antes da primeira pintura, para não piscar branco em quem usa tema escuro. */
export const SCRIPT_TEMA = `(function(){try{var t=localStorage.getItem('${CHAVE_TEMA}');if(t==='claro'||t==='escuro')document.documentElement.setAttribute('data-tema',t);}catch(e){}})();`;
