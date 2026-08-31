# 001 — Tarefas

## Fase 1 — Domínio puro (`core/math`)

- [ ] `core/math/tolerancia.ts`: `EPS`, `quaseIgual`, `ehPositivo`, `ehFinito`
- [ ] `core/math/vetor.ts`: ponto 2D, subtração, norma, produto escalar, projeção
- [ ] `core/math/triangulo-retangulo.ts`: `construirTriangulo({ B, C, P })` →
      `Resultado<TrianguloRetangulo, ErroDegenerado>` com `a, b, c, h, m, n`,
      vértices e pé da altura `H`
- [ ] `tests/core/math/tolerancia.test.ts`
- [ ] `tests/core/math/triangulo-retangulo.test.ts`: 3-4-5, casos degenerados,
      e property test das seis relações com 1000 runs
- [ ] `npx tsc --noEmit` + `npm test` limpos
- [ ] commit `feat: modelo do triângulo retângulo com relações métricas`

## Fase 2 — Geradores de exercício

- [ ] `core/math/prng.ts`: mulberry32 + helpers (`inteiroEntre`, `escolher`)
- [ ] `core/exercise/tipos.ts`: `ExerciseGenerator`, `Exercicio`, `Resultado`
- [ ] `core/exercise/generators/h-por-projecoes.ts`
- [ ] `core/exercise/generators/cateto-por-projecao.ts`
- [ ] `core/exercise/generators/altura-por-catetos.ts`
- [ ] `core/exercise/generators/index.ts`: registry por id
- [ ] `tests/core/math/prng.test.ts`: determinismo e distribuição
- [ ] `tests/core/exercise/generators.test.ts`: suíte compartilhada rodando os
      critérios de aceite contra **todos** os geradores registrados
- [ ] `npx tsc --noEmit` + `npm test` limpos
- [ ] commit `feat: geradores determinísticos de exercícios de relações métricas`

## Fase 3 — Simulador

- [ ] Verificar Mafs + React 19 antes de qualquer código; reportar se quebrar
- [ ] `npm i mafs` (aprovado em plan.md, D5)
- [ ] `components/math/Latex.tsx`: render KaTeX isolado
- [ ] `components/math/SimuladorRelacoesMetricas.tsx`: cena Mafs, vértice
      arrastável, altura e projeções desenhadas, marca de ângulo reto
- [ ] `components/math/PainelRelacoes.tsx`: seis relações com valores
      substituídos
- [ ] `app/lab/relacoes-metricas/page.tsx`: rota temporária, sem layout
- [ ] Teclado: setas e `Shift+setas`, `aria-label` no vértice
- [ ] Conferir em 360 px
- [ ] `npx tsc --noEmit` + `npm test` + `npm run build` limpos
- [ ] commit `feat: simulador interativo de relações métricas`
