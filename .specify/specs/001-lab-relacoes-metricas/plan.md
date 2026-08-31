# 001 — Plano técnico

## Decisões

### D1 — Ângulo reto por construção, não por validação

O estado do simulador é `{ B, C, P }`. O vértice `A` é derivado projetando `P`
no círculo de diâmetro `BC` (Tales: todo ponto do círculo enxerga o diâmetro sob
90°). Consequências:

- não existe posição do mouse que produza triângulo inválido;
- o arrasto nunca "trava" nem corrige o ponto de forma visível ao aluno;
- a garantia do ângulo reto é uma propriedade do modelo, testável sem UI.

Alternativa descartada: deixar `A` livre e recalcular `C` para forçar 90°. Isso
faz a hipotenusa mudar de tamanho enquanto o aluno arrasta a altura, o que
confunde a leitura das projeções.

### D2 — Duas tolerâncias, não uma

| Constante | Valor | Uso |
|---|---|---|
| `EPS` | `1e-9` | identidades do domínio, property tests |
| `TOLERANCIA_RESPOSTA` | `0.005` absoluto | conferência de resposta do aluno |

`EPS` é tolerância **relativa**: `quaseIgual(x, y)` compara
`|x − y| <= EPS * max(1, |x|, |y|)`. Comparação absoluta com `1e-9` quebra para
valores na casa das centenas ao quadrado (`a²` de um triângulo de lado 100 já
é 1e4, e o erro de arredondamento acompanha a magnitude). Isso não afrouxa nada:
`1e-9` relativo ainda é ~7 ordens de grandeza mais rígido que qualquer erro
matemático real.

`TOLERANCIA_RESPOSTA` é outra coisa: o aluno digita `4,8` para uma resposta
`4,8000000001`. Aceitar duas casas decimais é decisão pedagógica, não numérica.
Cada gerador pode apertá-la, nunca afrouxá-la.

### D3 — PRNG mulberry32 em `core/math/prng.ts`

32 bits de estado, uma função pura `(seed: number) => () => number`. Escolhido
por ser curto o bastante para caber em vinte linhas auditáveis e ter distribuição
boa o suficiente para gerar exercícios. Não é criptográfico e não precisa ser.

### D4 — Geradores produzem triângulo primeiro, enunciado depois

Cada gerador sorteia um **triângulo inteiro consistente** e só então esconde
parte das medidas para formar a pergunta. Isso torna impossível gerar um
exercício sem solução ou com dados contraditórios, e faz o property test ser
trivial: a resposta esperada é uma medida do triângulo que já satisfaz as
relações por construção.

Para os números ficarem amigáveis, sorteia-se `m` e `n` em uma grade de 0,5 e
derivam-se as demais medidas; o gerador rejeita e re-sorteia (com a mesma
semente avançando) quando a resposta esperada tem mais de duas casas decimais.
Limite de tentativas para garantir terminação.

### D5 — Mafs entra só na Fase 3

Fases 1 e 2 não têm dependência de UI nenhuma. A checagem de compatibilidade do
Mafs com React 19 acontece no início da Fase 3, isolada: se quebrar, o domínio e
os exercícios já estão prontos e testados, e a discussão é só sobre o desenho.

## Dependências novas (Constituição, regra 7)

| Pacote | Fase | Justificativa |
|---|---|---|
| `mafs` | 3 | Já fixado na stack. Geometria interativa declarativa em SVG e React; a alternativa seria escrever pan/zoom, coordenadas e arrasto à mão. |
| `katex` | 3 | Já fixado na stack. Render das relações em notação matemática de verdade. Só o pacote base; `remark-math`/`rehype-katex` são de MDX e ficam para a 002. |

Nenhuma outra dependência é necessária para esta feature. `fast-check` e
`vitest` já foram instalados na Fase 0. **Se o Mafs não suportar React 19, eu
paro e pergunto — não troco de biblioteca sozinho.**

## Riscos

| Risco | Mitigação |
|---|---|
| Mafs incompatível com React 19 | Verificar antes de escrever o componente; parar e reportar |
| Property test com tolerância errada gera falso verde | Teste negativo: um triângulo propositalmente errado deve falhar as relações |
| Arrasto do vértice inutilizável em toque | Alvo de toque ≥ 44 px e teste manual em 360 px |
| Números feios no enunciado ("encontre h = 3,872983") | D4: rejeição por casas decimais |

## Verificação da constituição

| Regra | Como esta feature cumpre |
|---|---|
| 1 — core puro | `tests/constitution.test.ts` já falha o build se `core/` importar React/Next/Mafs |
| 2 — 200 seeds | Property tests dos três geradores rodam `numRuns: 200` no mínimo |
| 5 — teclado e `aria-label` | Critério de aceite explícito do simulador |
| 6 — 360 px | Critério de aceite explícito do simulador |
| 8 — sem `any` | Tipos derivados do modelo; `strict` já ligado e `tsc --noEmit` no DoD |

Regra 3 (atividade como dado) **não se aplica ainda**: esta feature cria uma
rota temporária e assumidamente hardcoded em `/lab/relacoes-metricas`, que a
002 substitui pelo registry. Isso é dívida técnica declarada, com prazo.
