import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const CORE_DIR = join(process.cwd(), 'src', 'core');

// Regra 1 da constituição: core é domínio puro. Este teste é o guarda automático.
const IMPORTS_PROIBIDOS = [/^react$/, /^react-dom/, /^next(\/|$)/, /^mafs$/, /\.css$/];

function arquivosTs(dir: string): string[] {
  return readdirSync(dir).flatMap((entrada) => {
    const caminho = join(dir, entrada);
    if (statSync(caminho).isDirectory()) return arquivosTs(caminho);
    return /\.tsx?$/.test(entrada) ? [caminho] : [];
  });
}

function especificadoresImportados(codigo: string): string[] {
  const padrao = /(?:from\s+|import\s+|require\()\s*['"]([^'"]+)['"]/g;
  return [...codigo.matchAll(padrao)].map((m) => m[1]!);
}

describe('constituição', () => {
  it('src/core não importa React, Next nem nada de UI', () => {
    const violacoes = arquivosTs(CORE_DIR).flatMap((arquivo) =>
      especificadoresImportados(readFileSync(arquivo, 'utf8'))
        .filter((spec) => IMPORTS_PROIBIDOS.some((proibido) => proibido.test(spec)))
        .map((spec) => `${arquivo} importa ${spec}`),
    );

    expect(violacoes).toEqual([]);
  });

  it('src/core não usa .tsx', () => {
    expect(arquivosTs(CORE_DIR).filter((a) => a.endsWith('.tsx'))).toEqual([]);
  });

  // Pega o caso que de fato aparece na prática — comparar com literal numérico.
  // Comparação entre duas variáveis numéricas exigiria tipos, não regex; a
  // única exata autorizada é o atalho dentro do próprio helper de tolerância.
  it('src/core não compara float com literal numérico via === ou !==', () => {
    const comparacaoComLiteral = /(?:[=!]==\s*-?\d|-?\d(?:\.\d+)?(?:e-?\d+)?\s*[=!]==)/;

    const violacoes = arquivosTs(CORE_DIR)
      .filter((arquivo) => !arquivo.endsWith('tolerancia.ts'))
      .flatMap((arquivo) => {
        const linhas = readFileSync(arquivo, 'utf8').split('\n');
        return linhas
          .map((linha, i) => ({ linha: linha.trim(), numero: i + 1 }))
          .filter(({ linha }) => comparacaoComLiteral.test(linha))
          .map(({ linha, numero }) => `${arquivo}:${numero} → ${linha}`);
      });

    expect(violacoes).toEqual([]);
  });
});
