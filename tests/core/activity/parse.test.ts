import { describe, expect, it } from 'vitest';
import { descreverErros, parseAtividades } from '@/core/activity/parse';

const valida = {
  id: 'lab-1',
  moduleId: 'geometria',
  kind: 'simulator',
  title: 'Laboratório',
  config: { simuladorId: 'relacoes-metricas' },
};

function erros(bruto: unknown) {
  const resultado = parseAtividades(bruto, 'teste.ts');
  return resultado.ok ? [] : resultado.erro;
}

describe('parseAtividades', () => {
  it('aceita conteúdo bem formado', () => {
    const resultado = parseAtividades([valida], 'teste.ts');
    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.valor).toHaveLength(1);
    expect(resultado.valor[0]?.kind).toBe('simulator');
  });

  it('recusa raiz que não é lista', () => {
    expect(erros({ atividades: [] })[0]?.mensagem).toMatch(/lista/);
  });

  it('aponta arquivo, atividade e campo no erro', () => {
    const [erro] = erros([{ ...valida, config: {} }]);
    expect(erro?.origem).toBe('teste.ts');
    expect(erro?.atividade).toBe('lab-1');
    expect(erro?.campo).toBe('config.simuladorId');
  });

  it('recusa kind desconhecido', () => {
    expect(erros([{ ...valida, kind: 'quiz' }])[0]?.campo).toBe('kind');
  });

  it('recusa id repetido', () => {
    const repetidos = erros([valida, valida]);
    expect(repetidos.some((erro) => erro.mensagem === 'id repetido')).toBe(true);
  });

  it('exige quantidade inteira e positiva em exercise', () => {
    const base = { ...valida, kind: 'exercise', config: { generatorId: 'g', quantidade: 0 } };
    expect(erros([base])[0]?.campo).toBe('config.quantidade');
    expect(erros([{ ...base, config: { generatorId: 'g', quantidade: 2.5 } }])[0]?.campo).toBe(
      'config.quantidade',
    );
    expect(erros([{ ...base, config: { generatorId: 'g', quantidade: 3 } }])).toEqual([]);
  });

  it('exige url absoluta em external', () => {
    const base = { ...valida, kind: 'external' };
    expect(
      erros([{ ...base, config: { url: 'kahoot.it/x', descricao: 'Kahoot' } }])[0]?.mensagem,
    ).toMatch(/http/);
    expect(erros([{ ...base, config: { url: 'https://kahoot.it/x', descricao: 'Kahoot' } }])).toEqual(
      [],
    );
  });

  it('acumula todos os problemas em vez de parar no primeiro', () => {
    const lista = erros([{ id: '', moduleId: '', kind: 'video', title: '', config: {} }]);
    expect(lista.length).toBeGreaterThanOrEqual(5);
    expect(descreverErros(lista)).toContain('teste.ts');
  });
});
