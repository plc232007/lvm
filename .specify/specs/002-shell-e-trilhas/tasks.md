# 002 — Tarefas

> Lista preliminar. Refinada na abertura da feature, depois da 001 aprovada.

## Fase 4 — Runtime, registry e progresso

- [ ] Revisar o plan contra o que a 001 realmente construiu; reportar
      divergências antes de escrever código
- [ ] `core/activity/tipos.ts`: `Activity`, `ActivityKind`, `ActivityConfig`
- [ ] `core/activity/parse.ts`: validação de config com erro localizado
- [ ] `core/progress/`: funções puras de conclusão e contagem
- [ ] `components/activity/registry.ts` + renderers de `simulator` e `exercise`
- [ ] `lib/progresso-storage.ts`: borda com `localStorage`, tolerante a falha
- [ ] Testes: parse inválido, registry sem renderer, progresso puro
- [ ] commit `feat: runtime de atividades com registry e progresso local`

## Fase 5 — Conteúdo e shell

- [ ] Decidir YAML vs JSON (plan D4)
- [ ] Loader de `content/trilhas` com validação no build
- [ ] Renderers `reading` (MDX + KaTeX), `video`, `external`
- [ ] Migrar inventário do site antigo, conferindo cada URL
- [ ] Home, página de trilha, página de atividade
- [ ] Tema mobile-first, contraste AA, foco visível
- [ ] Passada de acessibilidade: teclado ponta a ponta em 360 px
- [ ] commit `feat: shell, trilhas e migração do conteúdo legado`
