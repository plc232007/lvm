import { alturaPorCatetos } from '@/core/exercise/generators/altura-por-catetos';
import { catetoPorProjecao } from '@/core/exercise/generators/cateto-por-projecao';
import { hPorProjecoes } from '@/core/exercise/generators/h-por-projecoes';
import type { ExerciseGenerator } from '@/core/exercise/tipos';

export const GERADORES: readonly ExerciseGenerator[] = [
  hPorProjecoes,
  catetoPorProjecao,
  alturaPorCatetos,
];

export function obterGerador(id: string): ExerciseGenerator | undefined {
  return GERADORES.find((gerador) => gerador.id === id);
}
