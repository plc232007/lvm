# LVM — Laboratório Virtual de Matemática

Laboratório de matemática do IFB. O aluno arrasta o triângulo, vê as relações
métricas continuarem valendo em qualquer posição e pratica com exercícios que
mudam de número a cada tentativa — não há gabarito para decorar.

Reescrita de um site que era um mural de links estático. Autoria do conteúdo
original: Victor Hugo Theodoro / IFB.

## Como rodar

```bash
npm install
cp .env.example .env.local          # preencha GROQ_API_KEY
git config core.hooksPath .githooks # trava que barra segredo no commit
npm run dev
```

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm test` | suíte completa (Vitest + fast-check) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | build de produção |

## Como está organizado

```
content/            conteúdo como dado: trilhas em YAML, textos em MDX
src/core/           domínio puro — zero React, testável com node
  math/             triângulo retângulo, tolerâncias, PRNG, relações
  exercise/         geradores determinísticos por semente
  activity/         tipos e validação de atividade
  progress/         progresso como funções puras
src/components/     UI: renderers por tipo de atividade, simulador, Fermat
src/app/            rotas — uma para trilha, uma para atividade
.specify/           constituição do projeto e specs das features
```

Três regras estruturais que o repositório mantém à força, com teste que quebra
o build se forem violadas:

1. **`src/core/**` não importa React, Next nem DOM.** É domínio puro.
2. **Nenhuma comparação de float com `===`.** Existe um helper de tolerância.
3. **Atividade é dado, não rota.** Adicionar um laboratório é editar
   `content/trilhas/*.yaml` — nenhum arquivo em `src/app/` muda.

As demais regras estão em [`.specify/constitution.md`](.specify/constitution.md).

## Assistente

O Fermat responde dúvidas dentro do contexto da atividade aberta. A chave da API
fica no servidor, atrás de `src/app/api/fermat/route.ts` — nunca no navegador. O
enunciado em aberto vai no contexto do assistente; a resposta esperada, não, para
que ele não consiga entregar o número.

### Onde a chave mora

| Ambiente | Lugar | Versionado? |
|---|---|---|
| Desenvolvimento | `.env.local` | não, está no `.gitignore` |
| Produção | Variáveis de ambiente do projeto na Vercel | não, nunca sai do painel |
| Código | em lugar nenhum | — |

A chave é lida só em `src/app/api/fermat/route.ts`, que roda no servidor. Como o
nome da variável não começa com `NEXT_PUBLIC_`, o Next nem a inclui no pacote
que vai para o navegador.

O hook em `.githooks/pre-commit` recusa o commit se um arquivo de ambiente ou
algo com cara de credencial entrar no índice. Ative com
`git config core.hooksPath .githooks`.

## Privacidade

O progresso do aluno vive apenas no `localStorage` do próprio navegador: nada de
login, banco ou identificador. O que é digitado no chat vai para o modelo que
gera a resposta, e o aviso disso aparece dentro do painel.
