# Componente: CartaoDeCatalogo

## Responsabilidade

Um registro num catálogo em cartões: quem é (iniciais na cor que o nome
sorteia, nome e uma descrição de até duas linhas), as ações dele no canto e,
embaixo do traço, o que se compara de um cartão para o outro — as métricas.

## Quando usar

- **Use** para um catálogo em que cada item tem nome, descrição e 2 a 3 números que se comparam entre itens: agentes de IA, modelos de mensagem, produtos.
- **Use** numa grade `gradeDeCartoes` (lib/campo): os cartões da mesma fileira ficam com a mesma altura e as métricas alinham no pé.
- **Não use** para listar muitos registros com várias colunas: é a `Table` densa.
- **Não use** para um número em destaque de um painel: é o `KpiCard`.
- **Não use** para o cartão do funil, que se arrasta: é o cartão do quadro do Pipeline.

## Família

`superficie` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Não há: nasceu como o cartão do agente de IA do protótipo (2026-10-02) e virou
peça em 2026-10-07, a pedido do cliente na reunião de 02/10 — tudo o que as
telas do protótipo mostram é componente do design system (ADR-073). O arquivo
passa a acompanhar o código na remedição (AUD-203, lote `figma`).

## Props

### `CartaoDeCatalogo`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `nome` | `string` | sim | O título do cartão e a origem das iniciais. Corta com reticências; o nome inteiro fica no `title`. |
| `descricao` | `string` | não | Até duas linhas (`line-clamp-2`); o texto inteiro fica no `title`. |
| `avatar` | `{ src?, tom?, iniciais? }` | não | A foto, ou a cor do disco de iniciais. Sem nada: duas iniciais na cor que o nome sorteia (`Avatar size="md" tom="auto"`). |
| `acoes` | `ReactNode` | não | O `BotaoDeAcoes` do item (ver [Menu](Menu.md)), no canto superior direito. |
| `metricas` | `MetricaDoCartao[]` | não | O pé, embaixo do traço. Sem métricas, não há pé. |
| `vazio` | `string` | não | O que vai no lugar do valor `null`. Padrão `"—"`, apagado. |
| `className`, demais | `HTMLAttributes<HTMLDivElement>` | não | Vão para o `Card`. |

### `MetricaDoCartao`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `rotulo` | `string` | sim | A legenda em `caption`, acima do valor. |
| `valor` | `ReactNode` | sim | Um número (sai em `text/heading-4` tabular), uma `Tag`, um texto — ou `null` para o traço apagado. |
| `cresce` | `boolean` | não | A que ocupa o que sobra na linha (as outras ficam no tamanho do conteúdo). Uma por cartão. |
| `titulo` | `string` | não | O `title` da célula: o valor inteiro quando o visível corta, ou o porquê do traço ("Ainda sem score"). |

## Variantes

| Variante | Quando usar |
|----------|-------------|
| sem `metricas` | Catálogo em que só o nome e a descrição importam: o cartão fecha logo abaixo do texto. |
| com `metricas` | Catálogo comparável: o pé com 2 a 3 métricas, alinhado entre os cartões da fileira. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| repouso | `Card: card + border, raio md, recuo 12, vão 12` | humano | — |
| valor vazio | `traço em subtle-foreground, com o porquê no title` | humano | — |
| entrando | `a grade da tela põe animate-surgir no item` | humano | ADR-068 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. O cartão não é
clicável: as ações ficam no `BotaoDeAcoes`, e o hover é do botão, não do
cartão. Ausência é decisão, não buraco a preencher.

## Tokens consumidos

`card` · `border` · `foreground` · `muted-foreground` · `subtle-foreground` ·
`--tom-brilho` · `--tom-texto` · `radius/md` · `text/heading-4` ·
`text/body-sm` · `text/caption`

## Composição

Usa: [Card](Card.md) (a casca) · [Avatar](Avatar.md) `md` com `tom="auto"` ·
[Menu](Menu.md) (`BotaoDeAcoes`, passado em `acoes`) · [Tag](Tag.md) nos
exemplos (o valor de uma métrica).
Usado por: tela de Agentes de IA (`/exemplos/agentes`, `cartao-agente.tsx`)

## Exemplo de uso

```tsx
<ul className={gradeDeCartoes}>
  {agentes.map((a) => (
    <li key={a.id} className="min-w-0">
      <CartaoDeCatalogo
        nome={a.nome}
        descricao={a.descricao}
        acoes={
          <BotaoDeAcoes
            rotulo={`Ações de ${a.nome}`}
            itens={[
              { id: "editar", rotulo: "Editar", icone: PencilSimple, aoAtivar: () => editar(a) },
              { id: "excluir", rotulo: "Excluir", icone: Trash, separadorAntes: true, aoAtivar: () => excluir(a) },
            ]}
          />
        }
        metricas={[
          { rotulo: "Score", valor: a.score, titulo: a.score === null ? "Ainda sem score" : undefined },
          { rotulo: "Modelo", valor: <Tag>{a.modelo}</Tag>, cresce: true },
          { rotulo: "Ferramentas", valor: a.ferramentas },
        ]}
      />
    </li>
  ))}
</ul>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Estrutura | O nome é `<h2>`; as métricas são `<dl>` com `dt`/`dd` — o leitor de tela lê "Score, 88" |
| Avatar | Decorativo (`aria-hidden`): o nome já está no título |
| Texto cortado | Nome e descrição levam o texto inteiro no `title` (regra do DS: truncou, tem tooltip) |
| Ações | No `BotaoDeAcoes`: botão com nome, `aria-haspopup="menu"`, foco de volta ao fechar |
| Vazio | O traço tem o porquê no `title` da célula |

## Divergências abertas (para o gate)

AUD-203 (`adiado`, lote `figma`): sem par no arquivo. Desenhar o cartão no
Figma a partir do código, na remedição.
