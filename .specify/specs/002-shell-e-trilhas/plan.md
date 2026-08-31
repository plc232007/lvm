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

### D4 — YAML precisa de parser

Não existe leitor de YAML embutido no Node. Opções: trocar `content/trilhas`
para JSON (zero dependência, formato pior de escrever à mão para um professor) ou
adicionar `yaml`. **A decisão fica para a abertura da 002**, com recomendação de
`yaml` — o público que vai editar esses arquivos não é programador, e vírgula
faltando em JSON é um erro cruel.

## Dependências novas (Constituição, regra 7)

| Pacote | Fase | Justificativa | Status |
|---|---|---|---|
| `next-mdx-remote` | 5 | Já fixado na stack. Render de MDX vindo de arquivo, sem rota por texto. Verificar compatibilidade com Next 16 antes; alternativa é `@next/mdx`. | a aprovar |
| `remark-math` + `rehype-katex` | 5 | Já fixados na stack. Pipeline de matemática no MDX. | a aprovar |
| `yaml` | 5 | Ver D4. Alternativa sem dependência: usar JSON. | **a decidir** |

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
