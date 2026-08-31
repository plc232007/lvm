import { poolCatetosParaAltura } from '@/core/exercise/catalogo';
import { criarExercicio } from '@/core/exercise/exercicio';
import type { ExerciseGenerator } from '@/core/exercise/tipos';
import { latexNumero } from '@/core/math/formato';
import { escolher, mulberry32 } from '@/core/math/prng';

export const alturaPorCatetos: ExerciseGenerator = {
  id: 'altura-por-catetos',
  titulo: 'Altura a partir dos catetos',
  descricao: 'Dados os catetos b e c, encontrar a altura relativa à hipotenusa.',

  generate(seed) {
    const config = escolher(mulberry32(seed), poolCatetosParaAltura());
    const { b, c, h } = config;

    return criarExercicio({
      generatorId: this.id,
      seed,
      config,
      statement:
        `Os catetos de um triângulo retângulo medem $b = ${latexNumero(b)}$ e ` +
        `$c = ${latexNumero(c)}$. Determine a altura $h$ relativa à hipotenusa.`,
      givens: { b, c },
      resposta: { simbolo: 'h', valor: h },
      dicaGeral:
        'Ache primeiro a hipotenusa com $a^2 = b^2 + c^2$ e depois use $a \\cdot h = b \\cdot c$.',
      diagnosticos: [
        {
          valorErrado: (cfg) => cfg.b * cfg.c,
          dica: 'Você parou em $b \\cdot c$. A relação é $a \\cdot h = b \\cdot c$, então falta dividir pela hipotenusa.',
        },
        {
          valorErrado: (cfg) => cfg.a,
          dica: 'Esse é o valor da hipotenusa. Com ela em mãos, use $a \\cdot h = b \\cdot c$ para chegar na altura.',
        },
        {
          valorErrado: (cfg) => (cfg.b + cfg.c) / 2,
          dica: 'A altura não é a média dos catetos. Use $a \\cdot h = b \\cdot c$.',
        },
      ],
    });
  },
};
