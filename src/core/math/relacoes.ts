import { quaseIgual } from '@/core/math/tolerancia';
import type { TrianguloRetangulo } from '@/core/math/triangulo-retangulo';

export type Simbolo = 'a' | 'b' | 'c' | 'h' | 'm' | 'n';

export type Medidas = Readonly<Record<Simbolo, number>>;

export type RelacaoId =
  | 'pitagoras'
  | 'cateto-b'
  | 'cateto-c'
  | 'altura'
  | 'area-dupla'
  | 'decomposicao';

export interface LadoRelacao {
  readonly latex: string;
  readonly valor: number;
}

export interface Relacao {
  readonly id: RelacaoId;
  readonly nome: string;
  readonly latex: string;
  readonly esquerda: LadoRelacao;
  readonly direita: LadoRelacao;
}

export function medidas(t: TrianguloRetangulo): Medidas {
  return { a: t.a, b: t.b, c: t.c, h: t.h, m: t.m, n: t.n };
}

/**
 * As seis relações como dado, não como código espalhado. Componente lê daqui:
 * nenhuma fórmula é reescrita na camada de UI, e o mesmo objeto que a tela
 * exibe é o que os testes verificam.
 */
export function relacoesMetricas(t: TrianguloRetangulo): readonly Relacao[] {
  const { a, b, c, h, m, n } = medidas(t);
  return [
    {
      id: 'pitagoras',
      nome: 'Teorema de Pitágoras',
      latex: 'a^2 = b^2 + c^2',
      esquerda: { latex: 'a^2', valor: a * a },
      direita: { latex: 'b^2 + c^2', valor: b * b + c * c },
    },
    {
      id: 'cateto-b',
      nome: 'Cateto b e sua projeção',
      latex: 'b^2 = a \\cdot m',
      esquerda: { latex: 'b^2', valor: b * b },
      direita: { latex: 'a \\cdot m', valor: a * m },
    },
    {
      id: 'cateto-c',
      nome: 'Cateto c e sua projeção',
      latex: 'c^2 = a \\cdot n',
      esquerda: { latex: 'c^2', valor: c * c },
      direita: { latex: 'a \\cdot n', valor: a * n },
    },
    {
      id: 'altura',
      nome: 'Altura e as projeções',
      latex: 'h^2 = m \\cdot n',
      esquerda: { latex: 'h^2', valor: h * h },
      direita: { latex: 'm \\cdot n', valor: m * n },
    },
    {
      id: 'area-dupla',
      nome: 'Dobro da área',
      latex: 'a \\cdot h = b \\cdot c',
      esquerda: { latex: 'a \\cdot h', valor: a * h },
      direita: { latex: 'b \\cdot c', valor: b * c },
    },
    {
      id: 'decomposicao',
      nome: 'Decomposição da hipotenusa',
      latex: 'a = m + n',
      esquerda: { latex: 'a', valor: a },
      direita: { latex: 'm + n', valor: m + n },
    },
  ];
}

export function relacaoVale(relacao: Relacao, eps?: number): boolean {
  return quaseIgual(relacao.esquerda.valor, relacao.direita.valor, eps);
}
