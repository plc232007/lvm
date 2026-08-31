# 001 — Laboratório de Relações Métricas no Triângulo Retângulo

> Cobre as Fases 1, 2 e 3 do plano de execução: domínio puro, geradores de
> exercício e simulador interativo. É a primeira fatia vertical do LVM.

## Problema

O aluno de ensino médio chega às relações métricas com cinco fórmulas para
decorar e nenhum modelo mental por trás delas. Os erros típicos não são de
conta, são de significado:

- troca `m` por `n`, porque nunca ficou claro que cada projeção pertence a um
  cateto específico (a que "encosta" nele);
- aplica `h² = m·n` em triângulo qualquer, porque nunca viu a relação falhar;
- não percebe que `a`, `b`, `c`, `h`, `m`, `n` são seis grandezas amarradas: mexer
  numa muda as outras cinco;
- acerta a lista do livro e erra a mesma questão com números diferentes, porque
  memorizou o resultado, não o procedimento.

O que falta é ver as seis quantidades variando juntas e continuar valendo, e
depois praticar com exercícios que mudam a cada tentativa. Esta feature entrega
essas duas coisas: um triângulo manipulável em que as relações são exibidas com
os valores substituídos ao vivo, e exercícios gerados por semente.

## Fora de escopo

- Qualquer navegação, header, tema visual, home ou página de trilha.
- Registry de atividades, tipos `Activity`, renderers genéricos (isso é 002).
- Persistência de progresso, mesmo em localStorage (isso é 002).
- Triângulos não retângulos, semelhança de triângulos como conteúdo formal,
  trigonometria, círculo trigonométrico.
- Demonstração formal das relações. O laboratório dá evidência e intuição; a
  prova continua sendo trabalho de sala de aula.
- Enunciados em linguagem natural gerados por IA. Os enunciados são gabaritos
  de texto com lacunas numéricas.
- Kahoot, vídeo, MDX, conteúdo textual.

## Comportamento

### Convenção (fixa, não negociável)

Triângulo retângulo com o ângulo reto no vértice **A**:

| Símbolo | Significado |
|---|---|
| `a` | hipotenusa (lado `BC`, oposto a `A`) |
| `b` | cateto `AC` |
| `c` | cateto `AB` |
| `h` | altura relativa à hipotenusa (de `A` até o pé `H` em `BC`) |
| `m` | projeção de `b` sobre a hipotenusa (segmento `HC`) |
| `n` | projeção de `c` sobre a hipotenusa (segmento `HB`) |

Relações: `a² = b² + c²`, `b² = a·m`, `c² = a·n`, `h² = m·n`, `a·h = b·c`,
`a = m + n`.

### Domínio (Fase 1)

Um triângulo é construído a partir de dois vértices da hipotenusa (`B` e `C`) e
de um ponto solto `P`. O ângulo reto é **garantido por construção**, não
verificado: `A` é a projeção de `P` sobre o círculo de diâmetro `BC` (lugar
geométrico dos pontos que enxergam `BC` sob 90°). Assim, qualquer posição de `P`
produz um triângulo retângulo válido — não existe estado inválido intermediário
enquanto o aluno arrasta.

Um triângulo é **degenerado** quando `A` cai sobre `B` ou `C` (cateto nulo) ou
quando `B = C`. Nesse caso a construção devolve um resultado explícito de erro,
nunca `NaN` silencioso.

Comparação de ponto flutuante nunca usa `===`. Existe um único helper em
`core/math` com tolerância explícita, relativa à magnitude dos operandos.

### Exercícios (Fase 2)

Cada gerador recebe uma semente inteira e devolve sempre o mesmo exercício para
a mesma semente. A aleatoriedade vem de um PRNG determinístico próprio
(mulberry32) em `core/math` — `Math.random()` não é usado em lugar nenhum.

Três geradores mínimos:

1. **`h-por-projecoes`** — dados `m` e `n`, encontrar `h`.
2. **`cateto-por-projecao`** — dados `a` e `m`, encontrar `b`.
3. **`altura-por-catetos`** — dados `b` e `c`, encontrar `h`.

O enunciado pode conter LaTeX. A checagem da resposta usa tolerância
**pedagógica** (o aluno digita `4,8`, não `4.7999999`), distinta da tolerância
de domínio. Resposta errada devolve uma dica que aponta a relação a usar, sem
entregar o número.

### Simulador (Fase 3)

Triângulo desenhado com Mafs. O vértice `A` é arrastável com mouse, toque e
teclado (setas movem; `Shift+setas` move em passo fino). As seis medidas são
recalculadas a cada quadro e cada relação é exibida com os valores
substituídos, não só em símbolos:

```
h² = m · n   →   4,80² = 3,60 · 6,40   →   23,04 = 23,04  ✓
```

A altura e as duas projeções são desenhadas no triângulo, com rótulos, e o
ângulo reto tem marca visual. A página vive em `/lab/relacoes-metricas`, sem
layout, sem header, sem tema — feia de propósito.

## Critérios de aceite

**Domínio**

- [ ] DADO 1000 configurações aleatórias de `B`, `C` e `P` geradas por
      `fast-check` com coordenadas em `[-100, 100]` e triângulo não degenerado
      QUANDO derivo `a, b, c, h, m, n` ENTÃO as seis relações da convenção valem
      dentro da tolerância de domínio, todas as seis testadas separadamente.
- [ ] DADO qualquer configuração dessas QUANDO derivo as medidas ENTÃO todas as
      seis são finitas e estritamente positivas.
- [ ] DADO `B = C`, ou `P` sobre a reta `BC` QUANDO tento construir o triângulo
      ENTÃO recebo um erro de degeneração explícito e nenhum `NaN`.
- [ ] DADO um triângulo 3-4-5 (`b = 3`, `c = 4`, `a = 5`) QUANDO derivo as
      medidas ENTÃO `h = 2,4`, `m = 1,8` e `n = 3,2` dentro da tolerância.
- [ ] DADO dois floats iguais a menos de erro de arredondamento QUANDO comparo
      com o helper de tolerância ENTÃO o resultado é verdadeiro, e o código-fonte
      de `core/` não contém nenhuma comparação `===` entre números.

**Exercícios**

- [ ] DADO qualquer gerador e 200 sementes distintas QUANDO gero o exercício
      ENTÃO a resposta esperada satisfaz as relações do triângulo subjacente
      dentro da tolerância de domínio.
- [ ] DADO a mesma semente QUANDO gero o exercício duas vezes ENTÃO enunciado,
      dados e resposta são idênticos caractere a caractere.
- [ ] DADO 200 sementes QUANDO gero os exercícios ENTÃO os números apresentados
      ao aluno são "amigáveis" conforme regra declarada pelo gerador (no máximo
      uma casa decimal) e a resposta esperada é positiva.
- [ ] DADO a resposta exata arredondada para duas casas decimais QUANDO submeto
      ENTÃO `check` retorna `correct: true`.
- [ ] DADO uma resposta errada QUANDO submeto ENTÃO `check` retorna
      `correct: false` com uma dica não vazia que cita a relação relevante e não
      contém o valor numérico da resposta.
- [ ] DADO 200 sementes de um mesmo gerador QUANDO comparo os enunciados ENTÃO
      há pelo menos 50 conjuntos de dados distintos (o gerador não repete o
      mesmo exercício).

**Simulador**

- [ ] DADO o simulador aberto QUANDO arrasto o vértice `A` ENTÃO o ângulo em `A`
      permanece reto e as seis medidas exibidas mudam continuamente.
- [ ] DADO foco no vértice `A` via `Tab` QUANDO pressiono as setas ENTÃO o
      vértice se move, sem mouse em momento algum.
- [ ] DADO viewport de 360 px de largura QUANDO abro a página ENTÃO o triângulo
      e o painel de relações são legíveis sem rolagem horizontal.
- [ ] DADO qualquer posição do vértice QUANDO leio o painel ENTÃO cada relação
      aparece com os valores substituídos e o lado esquerdo bate com o direito.
- [ ] DADO um leitor de tela QUANDO foco o vértice ENTÃO existe `aria-label`
      descrevendo o controle e as medidas atuais são anunciáveis como texto.

## Não-objetivos técnicos

- Não usar `Math.random()` em lugar nenhum.
- Não colocar fórmula dentro de componente React. Componente lê de `core/`.
- Não usar `canvas`, GeoGebra ou MathJax.
- Não introduzir estado global (Redux, Zustand, Context) — o simulador é um
  componente com estado local.
- Não otimizar renderização antes de existir um problema medido.
- Não criar abstração de "atividade" ainda; isso é deliberadamente 002.
