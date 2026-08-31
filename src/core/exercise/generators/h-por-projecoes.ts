import { poolProjecoesParaAltura } from '@/core/exercise/catalogo';
import { criarExercicio } from '@/core/exercise/exercicio';
import type { ExerciseGenerator } from '@/core/exercise/tipos';
import { latexNumero } from '@/core/math/formato';
import { escolher, mulberry32 } from '@/core/math/prng';

export const hPorProjecoes: ExerciseGenerator = {
  id: 'h-por-projecoes',
  titulo: 'Altura a partir das projeções',
  descricao: 'Dadas as projeções m e n, encontrar a altura relativa à hipotenusa.',

  generate(seed) {
    const config = escolher(mulberry32(seed), poolProjecoesParaAltura());
    const { m, n, h } = config;

    return criarExercicio({
      generatorId: this.id,
      seed,
      config,
      statement:
        'Em um triângulo retângulo, as projeções dos catetos sobre a hipotenusa medem ' +
        `$m = ${latexNumero(m)}$ e $n = ${latexNumero(n)}$. ` +
        'Determine a altura $h$ relativa à hipotenusa.',
      givens: { m, n },
      resposta: { simbolo: 'h', valor: h },
      dicaGeral:
        'Use $h^2 = m \\cdot n$: multiplique as projeções e extraia a raiz quadrada.',
      diagnosticos: [
        {
          valorErrado: (c) => c.m * c.n,
          dica: 'Você parou em $m \\cdot n$. A relação é $h^2 = m \\cdot n$, então falta extrair a raiz quadrada.',
        },
        {
          valorErrado: (c) => (c.m + c.n) / 2,
          dica: 'A altura não é a média das projeções. Ela satisfaz $h^2 = m \\cdot n$.',
        },
        {
          valorErrado: (c) => c.m + c.n,
          dica: '$m + n$ é a hipotenusa, não a altura. Para a altura, use $h^2 = m \\cdot n$.',
        },
      ],
    });
  },
};
