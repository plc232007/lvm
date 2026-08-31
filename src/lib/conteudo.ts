import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { descreverErros, parseTrilha } from '@/core/activity/parse';
import type { Activity, Trilha } from '@/core/activity/tipos';

const PASTA_TRILHAS = join(process.cwd(), 'content', 'trilhas');
const PASTA_TEXTOS = join(process.cwd(), 'content', 'textos');

/**
 * Conteúdo malformado derruba o build, não a página do aluno: este módulo é
 * importado pelas rotas, então o erro aparece em `next build`.
 */
function carregarTrilhas(): readonly Trilha[] {
  const arquivos = readdirSync(PASTA_TRILHAS).filter((nome) => nome.endsWith('.yaml')).sort();

  return arquivos.map((nome) => {
    const origem = `content/trilhas/${nome}`;
    const bruto: unknown = parseYaml(readFileSync(join(PASTA_TRILHAS, nome), 'utf8'));
    const resultado = parseTrilha(bruto, origem);
    if (!resultado.ok) {
      throw new Error(`Conteúdo inválido:\n${descreverErros(resultado.erro)}`);
    }
    return resultado.valor;
  });
}

export const TRILHAS = carregarTrilhas();

export function obterTrilha(slug: string): Trilha | undefined {
  return TRILHAS.find((trilha) => trilha.slug === slug);
}

export function todasAtividades(): readonly Activity[] {
  return TRILHAS.flatMap((trilha) => trilha.atividades);
}

export function obterAtividade(id: string): Activity | undefined {
  return todasAtividades().find((atividade) => atividade.id === id);
}

export function trilhaDaAtividade(atividadeId: string): Trilha | undefined {
  return TRILHAS.find((trilha) => trilha.atividades.some((a) => a.id === atividadeId));
}

export function lerTexto(arquivo: string): string {
  return readFileSync(join(PASTA_TEXTOS, arquivo), 'utf8');
}
