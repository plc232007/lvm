import { describe, expect, it } from 'vitest';
import {
  concluirAtividade,
  contarConcluidas,
  desserializar,
  estadoDe,
  PROGRESSO_VAZIO,
  registrarTentativa,
  serializar,
} from '@/core/progress';

describe('progresso', () => {
  it('parte do zero para atividade desconhecida', () => {
    expect(estadoDe(PROGRESSO_VAZIO, 'x')).toEqual({
      concluida: false,
      tentativas: 0,
      acertos: 0,
    });
  });

  it('conta tentativas e acertos sem mutar o objeto anterior', () => {
    const primeiro = registrarTentativa(PROGRESSO_VAZIO, 'x', true);
    const segundo = registrarTentativa(primeiro, 'x', false);
    expect(estadoDe(primeiro, 'x')).toEqual({ concluida: false, tentativas: 1, acertos: 1 });
    expect(estadoDe(segundo, 'x')).toEqual({ concluida: false, tentativas: 2, acertos: 1 });
    expect(PROGRESSO_VAZIO.atividades).toEqual({});
  });

  it('conclui sem perder a contagem', () => {
    const progresso = concluirAtividade(registrarTentativa(PROGRESSO_VAZIO, 'x', true), 'x');
    expect(estadoDe(progresso, 'x')).toEqual({ concluida: true, tentativas: 1, acertos: 1 });
    expect(contarConcluidas(progresso, ['x', 'y'])).toBe(1);
  });

  it('sobrevive a ida e volta pelo JSON', () => {
    const progresso = concluirAtividade(registrarTentativa(PROGRESSO_VAZIO, 'x', true), 'x');
    expect(desserializar(serializar(progresso))).toEqual(progresso);
  });

  it('devolve progresso vazio para dado corrompido, sem lançar', () => {
    for (const entrada of [null, undefined, '', 'não é json', '[]', '{}', '{"atividades":3}']) {
      expect(desserializar(entrada)).toEqual(PROGRESSO_VAZIO);
    }
  });

  it('descarta entradas malformadas e saneia números negativos', () => {
    const bruto = JSON.stringify({
      atividades: {
        boa: { concluida: true, tentativas: -5, acertos: 2.7 },
        ruim: { concluida: 'sim' },
      },
    });
    expect(desserializar(bruto)).toEqual({
      atividades: { boa: { concluida: true, tentativas: 0, acertos: 2 } },
    });
  });

  it('não guarda nenhum campo além de conclusão e contagem', () => {
    const progresso = registrarTentativa(PROGRESSO_VAZIO, 'x', true);
    expect(Object.keys(progresso.atividades.x ?? {}).sort()).toEqual([
      'acertos',
      'concluida',
      'tentativas',
    ]);
  });
});
