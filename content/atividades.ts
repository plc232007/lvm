/**
 * Conteúdo, não código: dados crus validados por `core/activity/parse`.
 * Adicionar um laboratório é editar esta lista — nenhuma rota muda.
 * A Fase 5 troca este arquivo por YAML sem mexer no runtime.
 */
export const ATIVIDADES: unknown[] = [
  {
    id: 'relacoes-metricas-simulador',
    moduleId: 'geometria',
    kind: 'simulator',
    title: 'Laboratório: relações métricas no triângulo retângulo',
    config: { simuladorId: 'relacoes-metricas' },
  },
  {
    id: 'relacoes-metricas-altura',
    moduleId: 'geometria',
    kind: 'exercise',
    title: 'Praticar: altura a partir das projeções',
    config: { generatorId: 'h-por-projecoes', quantidade: 3 },
  },
  {
    id: 'relacoes-metricas-cateto',
    moduleId: 'geometria',
    kind: 'exercise',
    title: 'Praticar: cateto a partir da hipotenusa e da projeção',
    config: { generatorId: 'cateto-por-projecao', quantidade: 3 },
  },
  {
    id: 'relacoes-metricas-altura-catetos',
    moduleId: 'geometria',
    kind: 'exercise',
    title: 'Praticar: altura a partir dos catetos',
    config: { generatorId: 'altura-por-catetos', quantidade: 3 },
  },
];
