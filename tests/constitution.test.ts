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
});
