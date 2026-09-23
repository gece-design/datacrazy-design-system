# Componente: DataTable

## Responsabilidade

Lista os negócios do CRM em colunas, com filtros e paginação — e, com
`ajustes`, deixa a pessoa ordenar, esconder, reordenar e redimensionar as
colunas e selecionar a linha (T1, pedido do cliente em 2026-09-18).

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
| `colunas` | `ColunaTabela[]` | `chave`, `rotulo`, `peso`, `alinharFim`, `ordenavel?`, `ocultavel?`, `minimo?`, `agrupavel?`. |
| `layout` | `"padrao" \| "compacta"` | `compacta` é o Compact do drawer. |
| `ajustes` | `AjustesDaTabela` | Liga os comportamentos. Vem de `useAjustesDaTabela`. |
| `ordem`, `aoOrdenar` | `OrdemTabela`, `(ordem) => void` | Só ordenar, sem o resto; `ajustes` já traz os dois. |
| `rotulos` | `Partial<RotulosDaTabela>` | Textos dos controles (i18n). Fábrica: `ROTULOS_DA_TABELA`. |

`peso` é largura **relativa**. Os números do arquivo (230 · 170 · 160 · 150 ·
200 · 180 · 42) entram direto como peso. Pixel só entra quando a pessoa
redimensiona: aí `larguras` guarda a medida dela.

### `DataTableRow`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `selecionada` | `boolean` | A linha escolhida (`aria-selected`, fundo `overlay/item-selected`). |
| `aoSelecionar` | `() => void` | Liga a seleção: clique fora de botão e campo, Enter, Espaço; setas andam entre as linhas. |

### `DataTableCell`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `coluna` | `string` | A `chave` da coluna, para seguir a ordem e a visibilidade. Sem ela, vale a posição. |
| `primeira`, `ultima` | `boolean` | Recuo da ponta. Com `ajustes` a linha calcula sozinha. |

### `RotulosDaTabela`

Todo texto dos controles vem de fora (E1); `ROTULOS_DA_TABELA` é a fábrica em pt-BR.

| Prop | Tipo | Descrição |
|------|------|-----------|
| `menuDaColuna` | `(coluna) => string` | Nome do gatilho `⋮`. "Opções da coluna Lead". |
| `ordenar` | `(coluna) => string` | Nome do botão do cabeçalho. "Ordenar por Lead". |
| `crescente`, `decrescente`, `semOrdem` | `string` | Itens de ordenação do menu. |
| `moverEsquerda`, `moverDireita` | `string` | Itens de mover do menu. |
| `colunas` | `string` | O botão da barra e o título do menu. |
| `restaurar` | `string` | "Restaurar colunas". |
| `redimensionar` | `(coluna) => string` | Nome da alça. "Redimensionar coluna Lead". |
| `agrupar`, `semGrupos` | `string` | O seletor da barra: "Agrupar por" e a opção vazia. |
| `agruparPor`, `desagrupar` | `(coluna) => string`, `string` | Item do menu da coluna e a opção do seletor. |
| `recolherGrupo`, `expandirGrupo` | `(grupo) => string` | Nome do caret da linha do grupo. |

### `useAjustesDaTabela(colunas, { memoria?, ordemInicial?, grupoInicial?, rotulos? })`

Devolve `AjustesDaTabela`: `naTela` (colunas visíveis na ordem atual),
`ordem` + `ordenar`, `escondidas` + `alternarColuna`, `sequencia` + `mover` /
`deslocar`, `larguras` + `redimensionar`, `grupo` + `agrupar`, `recolhidos` +
`alternarGrupo`, `restaurar`, `mexido`, `rotulos`.
Com `memoria`, tudo fica salvo no navegador por essa chave (uma por tela),
lido depois de montar. A tabela só **emite** a ordenação — as linhas chegam
como filhos, então quem ordena os dados é a tela: `ordenarPor(itens, ordem,
valorDe)` compara número como número e texto em pt-BR.

### `BotaoColunas`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `ajustes` | `AjustesDaTabela` | Os mesmos da tabela. Abre a lista de colunas com check e "Restaurar colunas". |

### `SelectAgrupar`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `ajustes` | `AjustesDaTabela` | O [Select](Select.md) "Agrupar por": "Sem grupos" e as colunas `agrupavel`. |

### `DataTableGrupo`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `rotulo` | `string` | O nome do grupo. |
| `quantidade` | `number` | Quantas linhas ele tem. |
| `resumo` | `string` | O total à direita, que a tela calcula. Ex.: "R$ 45.200,00". |
| `aberto`, `aoAlternar` | `boolean`, `() => void` | O caret recolhe; recolhido, a tela não desenha as linhas dele. |
| `rotulos` | `Partial<RotulosDaTabela>` | `recolherGrupo` / `expandirGrupo` (nome do caret). |

A linha ocupa todas as colunas visíveis. `agruparPor(itens, grupoDe,
ordemDosGrupos?)` monta os grupos (`GrupoTabela`: `id`, `rotulo`, `itens`) na
ordem em que aparecem — ordene as linhas antes — ou na ordem dada (a do funil).
Agrupar segue a regra da ordenação: os ajustes guardam a coluna do grupo e os
grupos recolhidos; quem monta e desenha é a tela.

### `DataTableToolbar`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `rotulo` | `string` | Linha pequena. Ex.: "Total de resultados". |
| `total` | `string` | Linha em destaque. Ex.: "37 negócios". |
| `children` | `ReactNode` | Os filtros à direita. |
| `layout` | `"padrao" \| "compacta"` | `compacta` (597:5983, Negócios no drawer): sem recuo próprio, rótulo em caption e total em h4. |

### Células

| Célula | Props | O que mostra |
|--------|-------|--------------|
| `CelulaLead` | `nome`, `etiquetas?` | Nome + Badges |
| `CelulaDupla` | `principal`, `apoio?` | Valor com linha de apoio |
| `CelulaTexto` | `children`, `enfase?` | Uma linha; `enfase` pinta em `primary` |
| `CelulaProgresso` | `etapa`, `percentual` | Etapa + barra de 5px |
| `CelulaEstatisticas` | `itens: { valor, rotulo }[]` | Pares número/rótulo |
| `CelulaAcoes` | `rotulo?` | Botão `DotsThree` |

## Variantes

O arquivo desenha um layout só, com eixo apenas de tema. `ajustes` não é
variante: é a mesma tabela com os controles ligados — sem ele, nada muda.

Os cinco comportamentos, com a referência do cliente (grid do ExtJS):

| Comportamento | Como | Teclado |
|---------------|------|---------|
| Ordenar | Clique no cabeçalho gira crescente → decrescente → nada; o menu da coluna tem Crescente e Decrescente | Enter no cabeçalho |
| Colunas visíveis | Menu da coluna e botão `Colunas` da barra, um check por coluna; a primeira e a de ações não saem | Espaço no item alterna e o menu fica aberto |
| Reordenar | Arrastar o cabeçalho (ghost segue o ponteiro, traço azul mostra onde cai); passou de 6px é arrasto, antes é clique | Menu: Mover para a esquerda / direita |
| Redimensionar | A alça na borda direita do cabeçalho, com o cursor `col-resize`; mínimo 64px | Alça focável: setas ±16px, Shift ±64 |
| Selecionar | Clique na linha (fora de botão e campo); `aria-selected`; a tela liga ao detalhe — no CRM, o Drawer | Enter/Espaço escolhe, setas andam |
| Agrupar (T2) | Seletor "Agrupar por" na barra ou item do menu da coluna; linha de grupo com caret, contagem e total; ordenar vale dentro do grupo | Caret é botão com `aria-expanded`; as setas da seleção pulam a linha do grupo |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `bg-overlay-item-hover na linha` | humano | L2 |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | D6 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

Sem `ajustes`, a tabela é leitura, com três exceções interativas: o botão de
ações da linha, os filtros ([Select](Select.md)) e a [paginação](Pagination.md).
Com `ajustes`, o cabeçalho vira controle: o gatilho `⋮` do menu só aparece sob
o cursor ou no foco (sete gatilhos fixos seriam ruído), e a alça só se desenha
sob o cursor da coluna.

**A linha ganhou hover** por decisão do humano em 2026-09-04. O arquivo não
desenha, mas em 37 linhas o realce sob o cursor é o que evita ler o dado da
linha errada. Token: `overlay/item-hover`, que clareia nos dois temas.

## Tokens consumidos

`card` · `accent` · `background` · `primary` · `foreground` ·
`muted-foreground` · `radius/md` · `radius/sm` · `text/heading-3` ·
`text/heading-4` · `text/body-lg` · `text/body-md` · `text/body-sm` ·
`text/label-lg` · `text/label-md` · `text/label-sm` · `text/caption` ·
`overlay/item-hover` · `overlay/item-selected` · `overlay/bg` · `overlay/border` ·
`elevation/lg` · `z/popover` · `z/dropdown` · `opacity/disabled` · `border` · `input/border`

## Composição

Usa: [Badge](Badge.md) nas etiquetas, `AcaoCampo` do [Input](Input.md) no botão de ações da linha e no gatilho do menu da coluna (a mesma ação de 16px do campo), `PainelFlutuante` do [Popover](Popover.md) no menu (`useCliqueFora`, `useSaida`), [Button](Button.md) `tertiary` no botão Colunas.
[Select](Select.md) nos filtros e no "Agrupar por" · [Pagination](Pagination.md) no rodapé ·
Usado por: tela de leads (`/exemplos/pipeline`, visão em lista) · [Drawer](Drawer.md) (Negócios, layout compacto)

## Exemplo de uso

```tsx
const ajustes = useAjustesDaTabela(colunas, { memoria: "negocios" });
const linhas = ordenarPor(negocios, ajustes.ordem, valorDe);

<>
  <DataTableToolbar rotulo="Total de resultados" total="37 negócios">
    <BotaoColunas ajustes={ajustes} />
  </DataTableToolbar>
  <DataTable colunas={colunas} ajustes={ajustes}>
    {linhas.map((n) => (
      <DataTableRow key={n.id} selecionada={n.id === selecionado} aoSelecionar={() => setSelecionado(n.id)}>
        <DataTableCell coluna="lead">
          <CelulaLead nome={n.nome} etiquetas={n.etiquetas} />
        </DataTableCell>
        <DataTableCell coluna="etapa">
          <CelulaProgresso etapa={n.etapa} percentual={n.percentual} />
        </DataTableCell>
        <DataTableCell coluna="acoes">
          <CelulaAcoes />
        </DataTableCell>
      </DataTableRow>
    ))}
  </DataTable>
</>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Estrutura | `<table>` real com `thead`, `th scope="col"` e `tbody`. O arquivo desenha com caixas; aqui o leitor de tela anuncia linha e coluna |
| Foco visível | `outline` com offset em todos os controles (regra D6) |
| Papel/rótulo | A barra de progresso é `role="progressbar"` com valor e rótulo. A coluna de ações tem rótulo só para leitor de tela. O botão `•••` tem `aria-label` |
| Página atual | `aria-current="page"` no número ativo |
| Ordenação | `aria-sort` no `th`; o rótulo é botão com nome "Ordenar por X" |
| Menu da coluna | Gatilho com `aria-haspopup="menu"` e `aria-expanded`; painel `role="menu"` com `menuitem`/`menuitemcheckbox`, foco no painel e `aria-activedescendant`; Escape devolve o foco ao gatilho |
| Alça | `role="separator"` vertical, focável, com `aria-valuenow` e nome "Redimensionar coluna X" |
| Reordenar sem ponteiro | Menu: Mover para a esquerda / direita |
| Seleção | `aria-selected` na linha; uma linha sempre no Tab (a selecionada, senão a primeira); setas andam, Enter e Espaço escolhem |
| Grupo | Caret é botão com `aria-expanded` e nome "Recolher Proposta"; a linha ocupa todas as colunas (`colSpan`) |
| Alvo de toque | Botões de paginação medem 28px de altura — **abaixo dos 44 da regra I15** |
| Movimento | Transição de cor; o menu entra e sai com `fade` (fast) |

## Divergências abertas (para o gate)

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-103, AUD-104, AUD-105, AUD-106, AUD-107 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
