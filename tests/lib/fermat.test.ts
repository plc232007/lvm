import { describe, expect, it } from 'vitest';
import {
  LIMITE_HISTORICO,
  LIMITE_MENSAGEM,
  montarInstrucao,
  normalizarDelimitadores,
  paraFormatoOpenAI,
  type MensagemFermat,
} from '@/lib/fermat';

describe('normalizarDelimitadores', () => {
  it('converte os delimitadores que os modelos insistem em usar', () => {
    expect(normalizarDelimitadores('vale \\(h^2 = m n\\) sempre')).toBe('vale $h^2 = m n$ sempre');
    expect(normalizarDelimitadores('\\[ a^2 = b^2 + c^2 \\]')).toBe('$$a^2 = b^2 + c^2$$');
  });

  it('não mexe no que já está em cifrão', () => {
    expect(normalizarDelimitadores('$h^2$ e $$a = m + n$$')).toBe('$h^2$ e $$a = m + n$$');
  });
});

describe('montarInstrucao', () => {
  it('fixa a convenção do LVM para o assistente não inventar outra', () => {
    const instrucao = montarInstrucao(null);
    expect(instrucao).toContain('h^2=m \\cdot n');
    expect(instrucao).toContain('projeção de $b$');
  });

  it('injeta o lugar do aluno e avisa que não recebeu a resposta', () => {
    const instrucao = montarInstrucao({
      titulo: 'Praticar: altura',
      tipo: 'exercise',
      trilha: 'Geometria',
      enunciado: 'As projeções medem $m = 1{,}8$ e $n = 3{,}2$.',
    });
    expect(instrucao).toContain('Praticar: altura');
    expect(instrucao).toContain('Geometria');
    expect(instrucao).toContain('NÃO recebeu a resposta esperada');
  });
});

describe('paraFormatoOpenAI', () => {
  const mensagem = (papel: MensagemFermat['papel'], texto: string): MensagemFermat => ({
    papel,
    texto,
  });

  it('traduz os papéis do domínio para os da API', () => {
    expect(paraFormatoOpenAI([mensagem('aluno', 'oi'), mensagem('fermat', 'olá')])).toEqual([
      { role: 'user', content: 'oi' },
      { role: 'assistant', content: 'olá' },
    ]);
  });

  it('corta histórico e mensagem longos antes de sair do servidor', () => {
    const longas = Array.from({ length: 30 }, (_, i) => mensagem('aluno', `${i}`));
    expect(paraFormatoOpenAI(longas)).toHaveLength(LIMITE_HISTORICO);

    const gigante = paraFormatoOpenAI([mensagem('aluno', 'x'.repeat(5000))]);
    expect(gigante[0]?.content).toHaveLength(LIMITE_MENSAGEM);
  });
});
