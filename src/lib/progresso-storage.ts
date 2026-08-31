import {
  CHAVE_PROGRESSO,
  desserializar,
  PROGRESSO_VAZIO,
  serializar,
  type Progresso,
} from '@/core/progress';

/**
 * Única fronteira com o navegador. Modo privado, cota cheia ou storage
 * desativado devolvem progresso vazio em vez de derrubar a página.
 */
export function lerProgresso(): Progresso {
  try {
    return desserializar(window.localStorage.getItem(CHAVE_PROGRESSO));
  } catch {
    return PROGRESSO_VAZIO;
  }
}

export function escreverProgresso(progresso: Progresso): void {
  try {
    window.localStorage.setItem(CHAVE_PROGRESSO, serializar(progresso));
  } catch {
    // Sem persistência disponível: a sessão continua funcionando em memória.
  }
}
