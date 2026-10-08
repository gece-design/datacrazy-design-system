# Componente: Quadro

## Responsabilidade

O kanban do produto: colunas num trilho que rola e cartões que se arrastam
entre elas — com o mouse ou pelo teclado, cada passo anunciado. O quadro não
sabe o que é um lead nem uma etapa: recebe colunas com itens de qualquer tipo,
desenha a casca e devolve o movimento; a tela é dona dos dados e das palavras.

## Quando usar

- **Use** para mover registros entre estágios de um fluxo — o funil de vendas, uma fila de atendimento, um pipeline de contratação — quando a pergunta é "em que etapa está".
- **Use** com `QuadroCartao` dentro de `renderizar`: é a única casca de cartão do quadro, e a tela só escolhe o que vai em cada bloco.
- **Não use** para ver muitos registros com várias colunas de dados: é a `Table` densa.
- **Não use** para a pergunta "quando": é o `Calendario`.
- **Não use** para um catálogo em cartões que não se arrastam (agentes, modelos): é o `CartaoDeCatalogo` numa grade.

## Família

`superficie` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Não há: nasceu da tela do Pipeline (cliente, 2026-09-28, "colunas de 220px,
cartões mais enxutos") e foi componentizado em 2026-10-07 a pedido do cliente
na reunião de 02/10 — tudo o que o protótipo mostra é componente do design
system. O arquivo passa a acompanhar o código na remedição (AUD-203, lote
`figma`).

## Props

### `Quadro<T>`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `colunas` | `ColunaDoQuadro<T>[]` | sim | As colunas, na ordem do trilho, cada uma com os próprios itens. |
| `chaveDe` | `(item: T) => string` | sim | O id de cada item: é o que `aoMover` devolve e o que `data-cartao` guarda. |
| `nomeDe` | `(item: T) => string` | sim | O nome do item, para o leitor de tela e para os anúncios do movimento. |
| `descricaoDe` | `(item: T) => string` | não | O que o leitor de tela ouve depois do nome (empresa, valor). |
| `renderizar` | `(item: T) => ReactNode` | sim | O conteúdo do cartão — um `QuadroCartao`. A casca (traço, foco, arrasto) é do quadro. |
| `aoMover` | `(id, colunaId, indice) => void` | sim | O item `id` vai para `colunaId`, na posição `indice` da lista **sem** ele. A tela grava. |
| `aoAbrir` | `(item: T) => void` | sim | Clique ou Enter no cartão. |
| `aoAdicionar` | `(colunaId) => void` | não | Com ele, o botão de adicionar aparece no pé de cada coluna. |
| `aoEditarColuna` | `(coluna) => void` | não | Com ele, o título da coluna vira botão. |
| `aoCriarColuna` | `() => void` | não | Com ele, o botão de criar coluna aparece no fim do trilho. |
| `rotulos` | `Partial<RotulosDoQuadro>` | não | As palavras do quadro (i18n). Fábrica: `ROTULOS_DO_QUADRO`. |
| `className` | `string` | não | — |

### `ColunaDoQuadro<T>`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `id` | `string` | sim | O que `aoMover` devolve como `colunaId`. |
| `rotulo` | `string` | sim | O título do cabeçalho. |
| `descricao` | `string` | não | Vai no tooltip do título, antes do convite para editar. |
| `cor` | `Tom \| "neutro"` | sim | Um dos catorze tons de `lib/tons.ts` pinta o painel (`tom-anel`), a bolinha e o título (`tom-texto`); `neutro` é `background`. |
| `itens` | `T[]` | sim | Os cartões, na ordem. |
| `resumo` | `string` | não | O número à direita do cabeçalho — a soma dos valores, por exemplo. Já formatado: o quadro não conhece moeda. |

### `QuadroCartao`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `titulo` | `string` | sim | Em `h4`, corta com reticências e guarda o texto inteiro no `title`. |
| `avatar` | `{ nome; src? }` | não | As iniciais na cor que o nome sorteia (`Avatar size="xs" iniciais="duas" tom="auto"`), ou a foto. |
| `valor` | `string` | não | Em `label-lg` tabular. Já formatado: o quadro não conhece moeda. |
| `sinais` | `ReactNode` | não | O canto direito da linha do valor: origem, dias parado. |
| `detalhes` | `DetalheDoCartao[]` | não | Linhas de 16px com o ícone do campo e o valor. Só as que têm valor. |
| `rodape` | `ReactNode` | não | O pé: as tags, em `flex-wrap` com vão de 4. |
| `className` | `string` | não | Só vale fora do quadro, onde o cartão desenha a própria casca. |

### `DetalheDoCartao`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `icone` | `Icon` (Phosphor) | sim | O que se vê, em 14px. |
| `rotulo` | `string` | sim | O nome do campo: vai no `title` e no leitor de tela. |
| `valor` | `string` | sim | Corta com reticências. |

### `RotulosDoQuadro`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `instrucoes` | `string` | sim | As instruções do cartão para o leitor de tela (`aria-describedby`). |
| `cartao` | `string` | sim | O papel do cartão, no lugar de "botão" (`aria-roledescription`). |
| `adicionar`, `adicionarEm` | `string`, `(coluna) => string` | sim | O botão do pé e o complemento só para o leitor de tela ("em Qualificação"). |
| `criarColuna` | `string` | sim | O botão estreito no fim do trilho. |
| `editarColuna` | `(descricao?) => string` | sim | O tooltip do título que edita: a descrição e o convite. |
| `resumo` | `(resumo, coluna) => string` | sim | O tooltip do resumo do cabeçalho. "R$ 12.000 em Proposta". |
| `vazio` | `string` | sim | A coluna sem cartão. |
| `anteriores`, `proximas` | `string` | sim | As setas nas bordas do trilho. |
| `pego`, `colunaEscolhida`, `posicao`, `movido`, `cancelado` | funções | sim | Os anúncios do movimento pelo teclado, na ordem em que acontecem. |

`Tom` são os catorze tons de `lib/tons.ts` (os da [Tag](Tag.md) e do
[Avatar](Avatar.md)); a coluna neutra fica em `background`.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| `cor="neutro"` | A coluna de entrada, sem cor própria: painel `background`, bolinha e título em `muted-foreground`. |
| `cor={tom}` | Uma etapa com identidade: painel em `tom-anel`, bolinha e título em `tom-texto`. |
| sem `aoEditarColuna` | Título como texto: o quadro só mostra. Com ele, o título é o botão de renomear e recolorir. |
| sem `aoAdicionar` / `aoCriarColuna` | Sem o botão do pé / sem o + do fim do trilho — um quadro só de leitura. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `cartão: traço input-border-hover + shadow-sm; título da coluna: text-primary` | humano | L2 |
| focus | `outline 2px com respiro (foco) no cartão, no título e nas setas` | banco | D6 |
| em movimento | `cartão de origem a opacity-40 enquanto o mouse arrasta` | humano | — |
| pego pelo teclado | `shadow-lg + outline 2px primary no cartão; anúncio em aria-live` | humano | WCAG 2.5.7 |
| linha de destino | `Linha de 4px em primary onde o cartão cai; a coluna alvo fica accent` | humano | — |
| coluna vazia | `caixa tracejada border com o texto vazio em subtle-foreground` | humano | — |
| cartão chegando | `animate-surgir (base): entra subindo 4px` | humano | ADR-068 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher. Não há seleção nem cartão "ativo": o quadro
mostra e devolve; o registro aberto é o [Drawer](Drawer.md) da tela.

## Tokens consumidos

`card` · `background` · `muted-foreground` · `subtle-foreground` ·
`foreground` · `border` · `input-border-hover` · `primary` · `accent` ·
`--tom-anel` · `--tom-texto` · `elevation/sm` · `elevation/lg` ·
`elevation/float` · `z/sticky` · `radius/md` · `radius/lg` · `radius/sm` ·
`radius/full` · `text/heading-4` · `text/label-lg` · `text/label-md` ·
`text/body-sm` · `text/caption` · `duration/base` (surgir)

## Composição

Usa: [Avatar](Avatar.md) `xs` com duas iniciais e `tom="auto"` no cartão ·
[Button](Button.md) `ghost` no pé da coluna e no + do fim do trilho ·
`foco` e `rolagemDiscreta` de `lib/estados.ts` · `Tom` de `lib/tons.ts`.
As [Tags](Tag.md) do pé do cartão são da tela, em `rodape`.
Usado por: tela do Pipeline (`app/exemplos/pipeline/quadro.tsx`, `QuadroDoFunil`:
etapa vira coluna, lead vira `QuadroCartao`; o protótipo em `/prototipo?tela=pipeline`).

## Exemplo de uso

```tsx
type Lead = { id: string; nome: string; empresa: string; cidade: string; valor: number; dias: number; tags: { id: string; rotulo: string; tom?: "ciano" | "laranja" | "vermelho" }[] };
const [colunas, setColunas] = useState(COLUNAS);

<Quadro
  colunas={colunas}
  chaveDe={(l: Lead) => l.id}
  nomeDe={(l) => l.nome}
  descricaoDe={(l) => `${l.empresa}, ${moeda(l.valor)}`}
  renderizar={(l) => (
    <QuadroCartao
      titulo={l.nome}
      avatar={{ nome: l.nome }}
      valor={moeda(l.valor)}
      sinais={<span className="flex items-center gap-1 text-caption tabular-nums"><Clock size={14} weight="regular" aria-hidden="true" />{l.dias}d</span>}
      detalhes={[{ icone: Buildings, rotulo: "Empresa", valor: `${l.empresa} · ${l.cidade}` }]}
      rodape={l.tags.map((t) => <Tag key={t.id} tom={t.tom}>{t.rotulo}</Tag>)}
    />
  )}
  aoMover={(id, colunaId, indice) => setColunas((atual) => mover(atual, id, colunaId, indice))}
  aoAbrir={(l) => abrirLead(l.id)}
  aoAdicionar={(etapa) => novoLead(etapa)}
  aoEditarColuna={(c) => editarEtapa(c.id)}
  aoCriarColuna={criarEtapa}
  rotulos={{ cartao: "Cartão do funil", adicionar: "Novo lead", criarColuna: "Nova etapa", vazio: "Nenhum lead nesta etapa. Arraste um cartão para cá." }}
/>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Cartão | `<article role="button" tabIndex=0>` com `aria-roledescription` (`rotulos.cartao`), nome = `nomeDe` + `descricaoDe`, `aria-describedby` nas instruções |
| Teclado | Enter abre; Espaço pega; com o cartão pego, ← → trocam de coluna, ↑ ↓ mudam a posição, Enter solta, Esc cancela; ao soltar, o foco volta ao cartão |
| Anúncios | `<p aria-live="polite">`: pego, coluna e posição escolhidas, movido, cancelado — todos de `rotulos` |
| Mouse | Arrasto HTML5 (`draggable`); a linha de destino é a mesma do teclado. Não é o único caminho (WCAG 2.5.7) |
| Coluna | `<section data-coluna>` com `<h2>`; o título que edita é um botão com `title` (descrição + convite); a contagem e o resumo são texto, o resumo com `title` |
| Trilho | As setas nas bordas têm `aria-label` e saem do Tab (`aria-hidden`, `tabIndex -1`) quando não há para onde rolar; arrastar o fundo não pega cartão, botão nem campo |
| Idioma | Nada escrito à mão: toda palavra vem de `rotulos` (`ROTULOS_DO_QUADRO` em pt-BR; no CRM, next-intl) |
| Movimento | `animate-surgir` no cartão que chega; com `prefers-reduced-motion` não há (I12, global) |

## Divergências abertas (para o gate)

AUD-203 (`adiado`, lote `figma`): sem par no arquivo. Desenhar o Quadro no
Figma a partir do código, na remedição.
