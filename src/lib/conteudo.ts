import { ATIVIDADES } from '@content/atividades';
import { descreverErros, parseAtividades } from '@/core/activity/parse';
import type { Activity } from '@/core/activity/tipos';

/**
 * Conteúdo malformado derruba o build, não a página do aluno: este módulo é
 * importado pelas rotas, então o erro aparece em `next build`.
 */
function carregar(): readonly Activity[] {
  const resultado = parseAtividades(ATIVIDADES, 'content/atividades.ts');
  if (!resultado.ok) {
    throw new Error(`Conteúdo inválido:\n${descreverErros(resultado.erro)}`);
  }
  return resultado.valor;
}

export const ATIVIDADES_VALIDADAS = carregar();

export function obterAtividade(id: string): Activity | undefined {
  return ATIVIDADES_VALIDADAS.find((atividade) => atividade.id === id);
}
