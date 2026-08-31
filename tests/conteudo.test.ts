import { describe, expect, it } from 'vitest';
import '@/components/activity/renderers';
import { temRenderer, tiposRegistrados } from '@/components/activity/registry';
import { parseAtividades } from '@/core/activity/parse';
import { obterGerador } from '@/core/exercise/generators';
import { ATIVIDADES } from '@content/atividades';

const resultado = parseAtividades(ATIVIDADES, 'content/atividades.ts');

describe('conteúdo do repositório', () => {
  it('é válido', () => {
    expect(resultado.ok, resultado.ok ? '' : JSON.stringify(resultado.erro, null, 2)).toBe(true);
  });

  it('toda atividade declarada tem renderer registrado (constituição, regra 3)', () => {
    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    const semRenderer = resultado.valor
      .filter((atividade) => !temRenderer(atividade.kind))
      .map((atividade) => `${atividade.id} (${atividade.kind})`);
    expect(semRenderer, `tipos registrados: ${tiposRegistrados().join(', ')}`).toEqual([]);
  });

  it('toda atividade de exercício aponta para um gerador existente', () => {
    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    const quebradas = resultado.valor
      .filter((atividade) => atividade.kind === 'exercise')
      .filter((atividade) => !obterGerador(atividade.config.generatorId))
      .map((atividade) => atividade.id);
    expect(quebradas).toEqual([]);
  });
});

describe('registry', () => {
  it('devolve undefined para tipo sem renderer, em vez de quebrar', () => {
    expect(temRenderer('reading')).toBe(false);
    expect(temRenderer('simulator')).toBe(true);
    expect(temRenderer('exercise')).toBe(true);
  });
});
