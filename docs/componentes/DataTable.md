# Componente: DataTable

## Responsabilidade

Lista os negócios do CRM em colunas, com filtros e paginação.

## Família

`superficie` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `331:1354` (frame "Data Table", símbolo `261:805`) · Lote: `2` ·
Última verificação: geometria medida no render — etiqueta de 20px e barra de
progresso de 5px com 44% preenchidos, os mesmos do arquivo; linha em 67 contra
os 66 do desenho (o 1px do traço, regra D14).

Diff de pixels **não medido**: depende da ponte de escrita do Figma
(`figma-console`), que segue fora do ar.

## Props

### `DataTable`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `colunas` | `ColunaTabela[]` | `chave`, `rotulo`, `peso` e `alinharFim`. |

`peso` é largura **relativa**. Os números do arquivo (230 · 170 · 160 · 150 ·
200 · 180 · 42) entram direto como peso.

### `DataTableToolbar`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `rotulo` | `string` | Linha pequena. Ex.: "Total de resultados". |
| `total` | `string` | Linha em destaque. Ex.: "37 negócios". |
| `children` | `ReactNode` | Os filtros à direita. |

### `DataTablePagination`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `resumo` | `string` | Ex.: "Mostrando 10 de 37 negócios". |
| `paginas` | `number` | Quantas páginas existem. |
| `atual` | `number` | Página atual, começando em 1. |
| `onIr` | `(p: number) => void` | Chamado ao trocar de página. |

### Células

`CelulaLead` (nome + etiquetas) · `CelulaDupla` (valor + apoio) ·
`CelulaTexto` (uma linha, com `enfase` para `primary`) · `CelulaProgresso`
(etapa + barra) · `CelulaEstatisticas` (pares número/rótulo) · `CelulaAcoes`.

## Variantes

Não tem. O arquivo desenha um layout só, com eixo apenas de tema.

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `text-foreground` | banco | I1 |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | I4 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

A tabela é leitura. Interativos são o botão de ações da linha, os controles de
paginação e os filtros (`SelectTrigger`) — todos com `hover` e
`focus-visible`. O arquivo **não desenha hover de linha**, então a linha não
tem: ausência é decisão.

## Tokens consumidos

`card` · `accent` · `background` · `primary` · `foreground` ·
`muted-foreground` · `radius/md` · `radius/sm` · `text/heading-3` ·
`text/heading-4` · `text/body-lg` · `text/body-md` · `text/body-sm` ·
`text/label-lg` · `text/label-md` · `text/label-sm` · `text/caption`

## Composição

Usa: `Badge` nas etiquetas (sem doc ainda — dívida registrada) · `SelectTrigger` nos filtros ·
Usado por: tela de negócios (ainda não construída)

## Exemplo de uso

```tsx
<DataTable colunas={colunas}>
  {negocios.map((n) => (
    <DataTableRow key={n.id}>
      <DataTableCell primeira>
        <CelulaLead nome={n.nome} etiquetas={n.etiquetas} />
      </DataTableCell>
      <DataTableCell>
        <CelulaProgresso etapa={n.etapa} percentual={n.percentual} />
      </DataTableCell>
      <DataTableCell ultima>
        <CelulaAcoes />
      </DataTableCell>
    </DataTableRow>
  ))}
</DataTable>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Estrutura | `<table>` real com `thead`, `th scope="col"` e `tbody`. O arquivo desenha com caixas; aqui o leitor de tela anuncia linha e coluna |
| Foco visível | `outline` com offset em todos os controles (regra D6) |
| Papel/rótulo | A barra de progresso é `role="progressbar"` com valor e rótulo. A coluna de ações tem rótulo só para leitor de tela. O botão `•••` tem `aria-label` |
| Página atual | `aria-current="page"` no número ativo |
| Alvo de toque | Botões de paginação medem 28px de altura — **abaixo dos 44 da regra I15** |
| Movimento | Só transição de cor |

## Divergências abertas (para o gate)

1. **Linhas sem separador visível.** O traço superior está ligado ao token
   `card` — a mesma cor do fundo. É o mesmo caso da lista do [Card](Card.md), e
   agora aparece duas vezes: ou é intenção do sistema, ou é um `border`
   apontando para o token errado nos dois lugares.
2. **Etiqueta com raio fora da escala.** O arquivo desenha 3px; a escala tem 2
   (`xs`) e 4 (`sm`). O código usa `sm`. Um pixel, mas é escala.
3. **Alvo de toque da paginação.** 28px contra os 44 da regra I15. O arquivo
   desenha 28.
4. **Sem hover de linha.** Numa tabela de 37 linhas o realce da linha sob o
   cursor é o que evita ler o dado da linha errada. O arquivo não desenha, e
   por isso não foi criado — mas vale decidir.
5. **A tabela pede 1160px.** Abaixo disso ela rola na horizontal em vez de
   espremer coluna. O showcase mostra isso porque a coluna de leitura tem 820.
