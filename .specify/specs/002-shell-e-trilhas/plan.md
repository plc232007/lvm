# 002 — Plano técnico

> Rascunho. Será revisado no fim da 001, quando existir código concreto para
> generalizar. Se o modelo abaixo não couber no que a Fase 3 construiu, a regra
> é avisar antes de refatorar.

## Decisões

### D1 — Registry como módulo, não como Context

O registry é um `Map<ActivityKind, Renderer>` preenchido em tempo de import por
`components/activity/index.ts`. Sem Context, sem provider, sem estado global. O
runtime é um componente que faz lookup e delega.

### D2 — `config` como união discriminada por `kind`

```ts
type ActivityConfig =
  | { kind: 'simulator'; simuladorId: string }
  | { kind: 'exercise'; generatorId: string; quantidade: number }
  | { kind: 'reading'; arquivo: string }
  | { kind: 'video'; provedor: 'youtube'; videoId: string }
  | { kind: 'external'; url: string; descricao: string };
```

Validação na carga do YAML por parser escrito à mão em `core/activity` — sem
Zod na v1, para não introduzir dependência que a Constituição me obrigaria a
justificar quando o formato tem cinco variantes. Se o número de variantes
crescer, reabro a discussão.

### D3 — Progresso: chave única versionada

`lvm.progresso.v1` guardando `{ atividades: Record<string, EstadoAtividade> }`.
A lógica de merge, conclusão e contagem vive em `core/progress` como funções
puras sobre um objeto — `localStorage` só aparece na borda, em `lib/`. Assim o
progresso é testável sem DOM (Constituição, regra 1).

### D4 — YAML, decidido

Adotado o pacote `yaml`. Quem vai editar `content/trilhas` é professor, não
programador: JSON cobraria aspas em toda chave e puniria uma vírgula sobrando com
erro de sintaxe. O YAML ainda permite comentário e bloco de texto (`>-`), que o
resumo da trilha usa. O parser fica isolado no loader — trocar de formato depois
não toca no runtime.

### D5 — MDX pelo caminho RSC, e runtime no servidor

A primeira montagem tinha `RuntimeAtividade` como client component, e o
`MDXRemote` cliente quebrou no prerender (`Cannot read properties of null
(reading 'useState')`). A correção não foi contornar o erro e sim corrigir a
divisão: **o runtime é server component** — ele só faz lookup e delega — e cada
renderer escolhe seu lado. Leitura, vídeo e link externo são servidor (zero JS no
cliente); simulador e exercício são cliente porque têm estado. O MDX passa a usar
`next-mdx-remote/rsc`, que compila no servidor com `remark-math` +
`rehype-katex`.

## Dependências novas (Constituição, regra 7)

| Pacote | Fase | Justificativa | Status |
|---|---|---|---|
| `next-mdx-remote` 6.0.0 | 5 | Já fixado na stack. Usado pelo entrypoint `/rsc`; o entrypoint cliente quebra no prerender (ver D5). | instalado |
| `remark-math` 6 + `rehype-katex` 7 | 5 | Já fixados na stack. Pipeline de matemática no MDX. | instalado |
| `yaml` 2.9 | 5 | Ver D4. | instalado |

## Riscos

| Risco | Mitigação |
|---|---|
| Modelo `Activity` não cobre o simulador da 001 | Revisar plan no fim da 001 e avisar antes de refatorar |
| `next-mdx-remote` sem suporte a Next 16 | Verificar cedo; cair para `@next/mdx` com aprovação |
| Progresso lido antes da hidratação causa mismatch | Ler em `useEffect`, renderizar "não concluído" no servidor |
| Conteúdo do site antigo com link morto | Conferir cada URL na migração e registrar no commit |

## Verificação da constituição

| Regra | Como esta feature cumpre |
|---|---|
| 3 — atividade como dado | É o objetivo central; teste percorre `content/` e valida |
| 4 — nenhum dado pessoal | Só `localStorage`, chave única, sem identificador; critério de aceite verifica a rede |
| 5 — acessibilidade | Critérios de teclado, foco visível e contraste AA |
| 6 — mobile-first | Critério de 360 px nas três páginas |
| 7 — dependências | Tabela acima; `yaml` explicitamente em aberto |
