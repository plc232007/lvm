# 002 — Runtime de Atividades, Trilhas e Shell

> Cobre as Fases 4 e 5 do plano de execução. Só começa depois que a 001 estiver
> aprovada: esta feature generaliza o que aquela construiu, e generalizar antes
> de ter um caso concreto é como se erra esse tipo de arquitetura.

## Problema

O site atual é um mural de links: o aluno clica em "Kahoot", cai fora do site,
volta (ou não), e nada do que ele fez fica registrado. Não há ordem sugerida,
não há noção de "o que eu já fiz" e não há relação visível entre o vídeo, o
texto e o exercício — são três caixas soltas na mesma página.

O aluno precisa de um caminho: uma trilha com começo e fim, em que cada parada
tem um tipo (ler, assistir, manipular, praticar, jogar fora do site) e em que o
que já foi concluído fica marcado, para que ele consiga retomar depois de uma
semana sem recomeçar do zero. E o professor precisa poder acrescentar uma
parada nova escrevendo conteúdo, não código.

## Fora de escopo

- Login, cadastro, turma, painel de professor, nota, ranking.
- Qualquer backend: banco, API route, server action, telemetria.
- Progresso sincronizado entre dispositivos. O aluno que trocar de celular
  perde o progresso, e isso é aceito na v1.
- Reimplementar Kahoot, YouTube ou GeoGebra. Link externo continua externo.
- Editor de conteúdo, preview ao vivo, autoria dentro do app.
- Novos simuladores além do de relações métricas.

## Comportamento

### Modelo de atividade (Fase 4)

```ts
type ActivityKind = 'reading' | 'video' | 'simulator' | 'exercise' | 'external';
```

Uma `Activity` é dado puro: `id`, `moduleId`, `kind`, `title`, `config`. O
runtime olha o `kind`, busca o renderer registrado e delega. Nenhum `switch`
sobre `kind` espalhado pela UI: existe **um** registry, e adicionar um tipo novo
é registrar um renderer, não editar um `if`.

O `config` é tipado por `kind` (união discriminada) e **validado na carga**. Uma
trilha com config malformado falha alto no build, não silenciosamente em runtime
na frente do aluno.

`external` cobre os links legados: renderiza um cartão com título, descrição, o
domínio de destino visível e aviso de que abre fora do LVM.

### Progresso (Fase 4)

Guardado em `localStorage`, sob uma única chave versionada
(`lvm.progresso.v1`). Registra, por atividade: concluída ou não, e para
exercícios, quantos foram acertados e quantos tentados. Nada mais — sem
timestamps de sessão, sem identificador de aluno, sem nada que permita
reconstruir comportamento individual (Constituição, regra 4).

A leitura acontece só no cliente, depois da hidratação, e a ausência de
`localStorage` (modo privado, storage cheio, navegador antigo) degrada para
"nenhum progresso" sem quebrar a página.

### Conteúdo (Fase 5)

Trilhas em `content/trilhas/*.yaml`; textos em `content/textos/*.mdx` com
`remark-math` + `rehype-katex`. O inventário do site antigo migra assim:

| Origem | Vira |
|---|---|
| Kahoot de Relações Métricas | atividade `external` |
| Vídeos | atividades `video` |
| Textos e trabalhos | atividades `reading` (MDX) |
| — (novo) | atividade `simulator` da 001 |
| — (novo) | atividade `exercise` da 001 |

### Shell (Fase 5)

Home com a lista de trilhas, página de trilha com as atividades em ordem e
estado de conclusão, e a página de atividade. Tema visual mobile-first,
contraste AA. Só aqui o design entra.

## Critérios de aceite

**Runtime e registry**

- [ ] DADO uma `Activity` de `kind` sem renderer registrado QUANDO o runtime a
      recebe ENTÃO exibe um aviso de tipo desconhecido e não derruba a página.
- [ ] DADO um arquivo de trilha com `config` inválido para o `kind` declarado
      QUANDO o conteúdo é carregado ENTÃO o erro aponta arquivo, atividade e
      campo, e o build falha.
- [ ] DADO que quero acrescentar um laboratório novo QUANDO edito apenas
      `content/` ENTÃO ele aparece na trilha sem nenhuma alteração em
      `src/app/` (Constituição, regra 3, verificado por teste que percorre as
      trilhas e confere que toda atividade tem renderer).

**Progresso**

- [ ] DADO que concluí uma atividade QUANDO recarrego a página ENTÃO ela
      continua marcada como concluída.
- [ ] DADO `localStorage` indisponível ou com JSON corrompido QUANDO abro a
      trilha ENTÃO a página carrega com progresso vazio e sem erro no console.
- [ ] DADO qualquer uso do app QUANDO inspeciono a rede ENTÃO nenhuma
      requisição carrega dado de progresso ou identificador de aluno.
- [ ] DADO progresso salvo na versão `v1` QUANDO o formato mudar no futuro
      ENTÃO a chave versionada permite descartar o antigo sem quebrar a leitura.

**Conteúdo e shell**

- [ ] DADO um `.mdx` com `$h^2 = m \cdot n$` QUANDO abro a leitura ENTÃO a
      fórmula aparece renderizada pelo KaTeX, não como texto cru.
- [ ] DADO uma atividade `external` QUANDO a vejo na trilha ENTÃO o destino
      externo está visível antes do clique e o link abre em nova aba com
      `rel="noopener noreferrer"`.
- [ ] DADO viewport de 360 px QUANDO navego home → trilha → atividade ENTÃO não
      há rolagem horizontal em nenhuma das três.
- [ ] DADO navegação só por teclado QUANDO percorro home → trilha → atividade →
      voltar ENTÃO todo alvo interativo é alcançável e o foco é visível.
- [ ] DADO o tema aplicado QUANDO meço o contraste de texto e de controles
      ENTÃO todos passam em AA (4,5:1 para texto normal, 3:1 para texto grande
      e componentes).

## Não-objetivos técnicos

- Não introduzir CMS headless, banco, ORM nem autenticação.
- Não usar server action nem API route.
- Não colocar `switch (kind)` fora do registry.
- Não fazer o progresso virar estado global. Um hook lendo `core/progress` basta.
- Não construir design system genérico. Componentes nascem do que as páginas
  precisam.
- Não migrar conteúdo do site antigo por scraping automático; a curadoria é
  manual e revisada.
