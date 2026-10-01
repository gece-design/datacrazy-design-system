# Componente: DataTable

## Responsabilidade

Lista os negócios do CRM em colunas, com filtros e paginação — e, com
`ajustes`, deixa a pessoa ordenar, esconder, reordenar e redimensionar as
colunas e selecionar a linha (T1, pedido do cliente em 2026-09-18).

## Quando usar

- **Use** para lista de registros (leads, contatos, negócios). Ela nasce `densa`; `confortavel` é só para leitura com respiro; `compacta` é a de dentro do Drawer.
- **Use** `ajustes`, `selecao` e `CelulaEditavel` em vez de abrir modal para ordenar, agir em massa ou editar um valor.
- **Use** `icone` em cada coluna quando a grade tem mais de cinco: ajuda a achar o campo sem ler o rótulo.
- **Não use** para menos de cinco itens com dois campos: é `CardList` dentro de um Card.
- **Use** `CelulaEscolha` para trocar na própria linha um valor que vem de lista (tags, etapa, origem), sem modal.
- **Não use** `Select` na barra da tabela para filtrar: a busca fica no Header e os filtros na `BarraDeFiltros`; Agrupar e Colunas também sobem para o Header.
- **Não use** `<table>` cru nem tabela dentro de Card.

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
| `colunas` | `ColunaTabela[]` | `chave`, `rotulo`, `peso`, `alinharFim`, `ordenavel?`, `ocultavel?`, `minimo?`, `agrupavel?`, `icone?` (ícone Phosphor de 14px antes do rótulo, como nas grades do Attio e do Twenty). Na `densa`, a soma dos `minimo` (112 para quem não declara) é o piso da tabela: abaixo dele ela rola na horizontal. |
| `layout` | `"densa" \| "confortavel" \| "compacta"` | Padrão **`densa`** (ADR-043): a grade de lista à la Twenty — linha de 36px, recuo 8, traço entre colunas e linhas, cada célula numa linha só. `confortavel` é o desenho do arquivo, com linha alta, para leitura com respiro (`padrao` é o nome antigo e continua aceito). `compacta` é o Compact do drawer. |
| `ajustes` | `AjustesDaTabela` | Liga os comportamentos. Vem de `useAjustesDaTabela`. |
| `ordem`, `aoOrdenar` | `OrdemTabela`, `(ordem) => void` | Só ordenar, sem o resto; `ajustes` já traz os dois. |
| `rotulos` | `Partial<RotulosDaTabela>` | Textos dos controles (i18n). Fábrica: `ROTULOS_DA_TABELA`. |
| `selecao` | `SelecaoDaTabela` | Seleção em massa: a caixa no cabeçalho e nas linhas com `chave`. Vem de `useSelecaoDaTabela`. |

`peso` é largura **relativa**. Os números do arquivo (230 · 170 · 160 · 150 ·
200 · 180 · 42) entram direto como peso. Pixel só entra quando a pessoa
redimensiona: aí `larguras` guarda a medida dela.

### `DataTableRow`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `selecionada` | `boolean` | A linha escolhida (`aria-selected`, fundo `overlay/item-selected`). |
| `aoSelecionar` | `() => void` | Liga a seleção: clique fora de botão e campo, Enter, Espaço; setas andam entre as linhas. |
| `chave` | `string` | O id da linha para a seleção em massa: com `selecao` na tabela, a caixa entra sozinha antes da primeira célula. |
| `nome` | `string` | O nome do registro, para a caixa ter nome ("Selecionar Giovanna Alves"). |

### `DataTableCell`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `coluna` | `string` | A `chave` da coluna, para seguir a ordem e a visibilidade. Sem ela, vale a posição. |
| `primeira`, `ultima` | `boolean` | Recuo da ponta. Com `ajustes` a linha calcula sozinha. |

Na `densa` a célula corta o que passa (`overflow-hidden`): uma Tag mais larga
que a coluna trunca com reticências em vez de invadir a vizinha.

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
| `agrupar`, `semGrupos` | `string` | O botão da barra: "Agrupar por" e a opção vazia. |
| `agruparPor`, `desagrupar` | `(coluna) => string`, `string` | Item do menu da coluna e a opção do seletor. |
| `recolherGrupo`, `expandirGrupo` | `(grupo) => string` | Nome do caret da linha do grupo. |
| `selecionarTodos` | `string` | Nome da caixa do cabeçalho. |
| `selecionarLinha` | `(nome) => string` | Nome da caixa da linha. "Selecionar Giovanna Alves". |
| `selecionados` | `(n) => string` | A barra: "3 selecionados". |
| `limparSelecao` | `string` | O X da barra. |

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
| `recolhido` | `boolean` | Só o ícone (32px) com tooltip, `soft` com coluna escondida: é como o botão entra na fileira do Header, ao lado da lupa e do troca-visão (a tela do pipeline). |

### `BotaoAgrupar`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `ajustes` | `AjustesDaTabela` | O botão "Agrupar por": menu de rádio com "Sem grupos" e as colunas `agrupavel`; `soft` com grupo ativo. |
| `recolhido` | `boolean` | Só o ícone (32px) com tooltip, para a fileira do Header. |

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

### `BarraDeSelecao`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `selecao` | `SelecaoDaTabela` | Os ids marcados e quem os guarda: `useSelecaoDaTabela` devolve `selecionados`, `aoMudar` e `limpar`. |
| `rotulos` | `Partial<RotulosDaTabela>` | `selecionados(n)`, `limparSelecao`. |
| `children` | `ReactNode` | As ações em massa da tela: Buttons `size="sm"`. |

Sobe quando há linhas marcadas, em portal fixo embaixo e centrado, na
superfície do Menu; sai com fade. Escape e o X limpam — com menu ou diálogo
aberto, o Escape é deles. A caixa do cabeçalho marca as linhas que estão na
tela (parte marcada no meio do caminho); Shift+clique marca a faixa entre a
última caixa e esta, na ordem da tela. A tabela só sabe quais linhas estão na
tela; os ids são da tela, como na ordenação (ADR-031).

### `DataTableToolbar`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `rotulo` | `string` | Linha pequena. Ex.: "Total de resultados". |
| `total` | `string` | Linha em destaque. Ex.: "37 negócios". |
| `children` | `ReactNode` | Os filtros à direita. |
| `layout` | `"densa" \| "confortavel" \| "compacta"` | O mesmo da tabela que ela acompanha; padrão `densa`. `compacta` (597:5983, Negócios no drawer): sem recuo próprio, rótulo em caption e total em h4. |

### Células

| Célula | Props | O que mostra |
|--------|-------|--------------|
| `CelulaLead` | `nome`, `etiquetas?` | Nome + etiquetas em `Tag` (`EtiquetaDaCelula`: texto ou `{ rotulo, tom, status }`); quebram linha quando a coluna estreita |
| `CelulaEditavel` | `valor`, `aoSalvar`, `rotulo`, `formatar?`, `inputMode?`, `alinharFim?` | Edita no lugar: texto com lápis no hover; clicar vira campo de 32px na célula; Enter e sair salvam, Escape desfaz (cliente, 2026-09-26) |
| `CelulaEscolha` | `rotulo`, `opcoes`, `selecionados`, `aoAlternar`, `multiplo?`, `rotulos`, `children` | Escolhe no lugar: o valor em repouso (os filhos) é o gatilho e o clique abre a lista com busca do `ComboboxPainel` na própria célula, sem modal. Par da `CelulaEditavel` para valor que vem de lista — tags, etapa, origem (ADR-049) |
| `CelulaTags` | `etiquetas` | Só as etiquetas, numa linha: a coluna "Tags" da grade densa; a que não cabe some inteira (o title lista todas) |
| `CelulaDupla` | `principal`, `apoio?` | Valor com linha de apoio |
| `CelulaTexto` | `children`, `enfase?` | Uma linha; `enfase` pinta em `primary` |
| `CelulaProgresso` | `etapa`, `percentual`, `tom?` | Etapa + barra de 5px; com `tom` (um dos oito, ou `neutro`), bolinha e barra na cor da etapa — a mesma da coluna do quadro |
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
| Redimensionar | A alça na borda direita do cabeçalho, com o cursor `col-resize`; mínimo 64px; dois cliques na alça ajustam a coluna ao conteúdo | Alça focável: setas ±16px, Shift ±64, Enter ajusta ao conteúdo |
| Selecionar | Clique na linha (fora de botão e campo); `aria-selected`; a tela liga ao detalhe — no CRM, o `PainelLateral`, ao lado da lista | Enter/Espaço escolhe, setas andam |
| Agrupar (T2) | Seletor "Agrupar por" na barra ou item do menu da coluna; linha de grupo com caret, contagem e total; ordenar vale dentro do grupo | Caret é botão com `aria-expanded`; as setas da seleção pulam a linha do grupo |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| editando (célula) | `CelulaEditavel: botão com o valor e lápis no hover; clique vira input de 32px (caixaDeCampo) na célula; Enter/blur salvam, Escape desfaz e devolve o foco` | humano | ADR-035 |
| marcada (seleção em massa) | `caixa (Checkbox) no cabeçalho e na linha com chave; linha marcada em bg-overlay-item-selected + aria-selected; barra fixa embaixo em overlay/bg + shadow-lg, fade-in-fast; sai com fade-out` | humano | ADR-031 |
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

`card` · `accent` · `muted` · `background` · `divider` · `primary` · `foreground` ·
`muted-foreground` · `radius/md` · `radius/sm` · `text/heading-3` ·
`text/heading-4` · `text/body-lg` · `text/body-md` · `text/body-sm` ·
`text/label-lg` · `text/label-md` · `text/label-sm` · `text/caption` ·
`overlay/item-hover` · `overlay/item-selected` · `overlay/bg` · `overlay/border` ·
`elevation/lg` · `z/popover` · `z/dropdown` · `opacity/disabled` · `border` · `input/border`

## Composição

Usa: [Tag](Tag.md) nas etiquetas, [Checkbox](Checkbox.md) na seleção em massa, [Menu](Menu.md) no Agrupar e no menu da coluna, `AcaoCampo` do [Input](Input.md) no botão de ações da linha e no gatilho do menu da coluna (a mesma ação de 16px do campo), [Menu](Menu.md) no menu da coluna e no botão Colunas, [Button](Button.md) `tertiary` no botão Colunas.
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
