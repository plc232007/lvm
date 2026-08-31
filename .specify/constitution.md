# Constituição do LVM

## Invioláveis
1. `src/core/**` é domínio puro: não importa React, Next, DOM ou qualquer
   coisa de UI. É testável com `node` puro.
2. Todo gerador de exercício tem teste property-based com >= 200 seeds.
3. Toda atividade é declarada como dado em `content/`, nunca hardcoded
   em `src/app/`. Adicionar um laboratório = adicionar conteúdo, não rota.
4. Nenhum dado pessoal de aluno é coletado, transmitido ou persistido
   fora do localStorage do próprio navegador na v1.
5. Acessibilidade: tudo navegável por teclado, contraste AA, `aria-label`
   em controles de simulador. Simulador que só funciona com mouse é bug.
6. Mobile-first. Todo simulador precisa ser usável em tela de 360px.
7. Nenhuma dependência nova sem justificativa escrita no plan.md da feature.
8. TypeScript `strict`. `any` só com comentário explicando por quê.

## Estilo
- Componentes com mais de 150 linhas devem ser quebrados.
- Nomes de domínio em português (Trilha, Atividade, Exercicio);
  nomes técnicos em inglês (registry, renderer, generator).
- Sem comentário óbvio. Comentar só o não-trivial (fórmula, edge case).
