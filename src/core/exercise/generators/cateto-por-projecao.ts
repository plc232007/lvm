import { poolHipotenusaParaCateto } from '@/core/exercise/catalogo';
import { criarExercicio } from '@/core/exercise/exercicio';
import type { ExerciseGenerator } from '@/core/exercise/tipos';
import { latexNumero } from '@/core/math/formato';
import { escolher, mulberry32 } from '@/core/math/prng';

export const catetoPorProjecao: ExerciseGenerator = {
  id: 'cateto-por-projecao',
  titulo: 'Cateto a partir da hipotenusa e da projeção',
  descricao: 'Dados a hipotenusa a e a projeção m, encontrar o cateto b.',

  generate(seed) {
    const config = escolher(mulberry32(seed), poolHipotenusaParaCateto());
    const { a, m, b } = config;

    return criarExercicio({
      generatorId: this.id,
      seed,
      config,
      statement:
        `Em um triângulo retângulo, a hipotenusa mede $a = ${latexNumero(a)}$ e a projeção ` +
        `do cateto $b$ sobre ela mede $m = ${latexNumero(m)}$. ` +
        'Determine a medida do cateto $b$.',
      givens: { a, m },
      resposta: { simbolo: 'b', valor: b },
      dicaGeral:
        'Use $b^2 = a \\cdot m$: multiplique a hipotenusa pela projeção do próprio cateto e extraia a raiz quadrada.',
      diagnosticos: [
        {
          valorErrado: (c) => c.a * c.m,
          dica: 'Você parou em $a \\cdot m$. A relação é $b^2 = a \\cdot m$, então falta extrair a raiz quadrada.',
        },
        {
          valorErrado: (c) => c.a - c.m,
          dica: '$a - m$ é a outra projeção, o $n$. O cateto vem de $b^2 = a \\cdot m$.',
        },
        {
          valorErrado: (c) => c.c,
          dica: 'Esse é o outro cateto: você usou $n$ no lugar de $m$. A projeção que pertence a $b$ é $m$.',
        },
        {
          valorErrado: (c) => c.h,
          dica: 'Essa é a altura relativa à hipotenusa, que vem de $h^2 = m \\cdot n$. O cateto vem de $b^2 = a \\cdot m$.',
        },
      ],
    });
  },
};
