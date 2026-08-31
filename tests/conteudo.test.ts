import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';
import '@/components/activity/renderers';
import { renderizarAtividade, temRenderer, tiposRegistrados } from '@/components/activity/registry';
import { parseTrilha } from '@/core/activity/parse';
import { TIPOS_DE_ATIVIDADE, type Activity, type Trilha } from '@/core/activity/tipos';
import { obterGerador } from '@/core/exercise/generators';

const PASTA = join(process.cwd(), 'content', 'trilhas');

const trilhas: Trilha[] = readdirSync(PASTA)
  .filter((nome) => nome.endsWith('.yaml'))
  .map((nome) => {
    const bruto: unknown = parseYaml(readFileSync(join(PASTA, nome), 'utf8'));
    const resultado = parseTrilha(bruto, `content/trilhas/${nome}`);
    if (!resultado.ok) {
      throw new Error(`${nome} inválida: ${JSON.stringify(resultado.erro, null, 2)}`);
    }
    return resultado.valor;
  });

const atividades: Activity[] = trilhas.flatMap((trilha) => [...trilha.atividades]);

describe('conteúdo do repositório', () => {
  it('tem ao menos uma trilha com atividades', () => {
    expect(trilhas.length).toBeGreaterThan(0);
    expect(atividades.length).toBeGreaterThan(0);
  });

  it('toda atividade declarada tem renderer registrado (constituição, regra 3)', () => {
    const semRenderer = atividades
      .filter((atividade) => !temRenderer(atividade.kind))
      .map((atividade) => `${atividade.id} (${atividade.kind})`);
    expect(semRenderer, `tipos registrados: ${tiposRegistrados().join(', ')}`).toEqual([]);
  });

  it('toda atividade de exercício aponta para um gerador existente', () => {
    const quebradas = atividades
      .filter((atividade) => atividade.kind === 'exercise')
      .filter((atividade) => !obterGerador(atividade.config.generatorId))
      .map((atividade) => atividade.id);
    expect(quebradas).toEqual([]);
  });

  it('a trilha injeta o próprio id como moduleId das atividades', () => {
    for (const trilha of trilhas) {
      for (const atividade of trilha.atividades) {
        expect(atividade.moduleId).toBe(trilha.id);
      }
    }
  });

  it('não há id de atividade repetido entre trilhas', () => {
    const ids = atividades.map((atividade) => atividade.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('todo link externo é absoluto e https', () => {
    for (const atividade of atividades) {
      if (atividade.kind !== 'external') continue;
      expect(atividade.config.url).toMatch(/^https:\/\//);
      expect(atividade.config.descricao.length).toBeGreaterThan(10);
    }
  });
});

describe('registry', () => {
  it('cobre todos os tipos de atividade da v1', () => {
    expect([...tiposRegistrados()].sort()).toEqual([...TIPOS_DE_ATIVIDADE].sort());
  });

  it('devolve undefined para tipo sem renderer, em vez de quebrar', () => {
    const desconhecida = { ...atividades[0], kind: 'quiz' } as unknown as Activity;
    expect(renderizarAtividade(desconhecida)).toBeUndefined();
  });
});

describe('parseTrilha', () => {
  const base = {
    id: 'geometria',
    slug: 'geometria',
    titulo: 'Geometria',
    resumo: 'Resumo',
    atividades: [
      { id: 'x', kind: 'simulator', title: 'Lab', config: { simuladorId: 'relacoes-metricas' } },
    ],
  };

  it('aceita trilha bem formada', () => {
    expect(parseTrilha(base, 'teste.yaml').ok).toBe(true);
  });

  it('recusa slug com maiúscula ou espaço', () => {
    const resultado = parseTrilha({ ...base, slug: 'Geometria Plana' }, 'teste.yaml');
    expect(resultado.ok).toBe(false);
    if (resultado.ok) return;
    expect(resultado.erro[0]?.campo).toBe('slug');
  });

  it('recusa trilha sem atividades', () => {
    const resultado = parseTrilha({ ...base, atividades: [] }, 'teste.yaml');
    expect(resultado.ok).toBe(false);
    if (resultado.ok) return;
    expect(resultado.erro[0]?.campo).toBe('atividades');
  });

  it('recusa raiz que não é objeto', () => {
    expect(parseTrilha([base], 'teste.yaml').ok).toBe(false);
  });
});
