# Componentes

Um arquivo por componente do design system. É a **face legível** do
`../processo/components-registry.json`: mesma verdade, dois formatos —
markdown para humano e IA lerem, JSON para o script auditar. Divergir os
dois é bug.

Escrito pela `fw-doc` ao fim de cada lote, **lendo o código gerado** —
nunca à mão, nunca de memória. A seção **Estados** de cada arquivo é gerada
pelo `kfe-docs index` a partir do registro: o JSON é o dono do fato, o
markdown é a vista dele.

> **Estado (2026-09-19): completo.** Os 27 componentes de `components/ui/`
> têm arquivo aqui e entrada no registro. A dívida dos seis escritos antes do
> registro (Button, Badge, Sidebar, DatePicker, Rating, LogoDatacrazy) foi
> quitada no lote B1 da auditoria de consistência, lendo o código.
> `npm run check:doc-codigo` reprova doc que se afasta do TypeScript.

## Inventário

<!-- kfe:index:start -->
| Arquivo | Responsabilidade |
|---------|------------------|
| [Avatar.md](Avatar.md) | Identificar pessoa ou empresa pela inicial, ou pela foto. |
| [Badge.md](Badge.md) | Selo curto de status — a cor fica na borda e no texto, nunca preenchendo a |
| [BarraDeFiltros.md](BarraDeFiltros.md) | Filtrar uma lista por vários campos: cada filtro ativo é um chip ("Etapa: Proposta"), e o "+ Filtro" lista os  |
| [Breadcrumb.md](Breadcrumb.md) | Mostrar o caminho até a página atual e levar de volta a qualquer nível dele. |
| [Button.md](Button.md) | Ação do usuário: sete variantes de peso visual e quatro tamanhos, com o mesmo |
| [Calendario.md](Calendario.md) | Mostrar os negócios (ou qualquer evento datado) no mês ou na semana, pela |
| [Card.md](Card.md) | Superfície que carrega um bloco de dados do dashboard. |
| [Checkbox.md](Checkbox.md) | Marcar ou desmarcar uma opção independente, inclusive o "parte marcada" de |
| [Combobox.md](Combobox.md) | Escolher uma ou várias opções numa lista com busca — o Select para lista longa, com grupos ou com várias escol |
| [DataTable.md](DataTable.md) | Lista os negócios do CRM em colunas, com filtros e paginação — e, com |
| [DatePicker.md](DatePicker.md) | Período em dois meses, com atalhos: um gatilho no estilo do Button `tertiary` |
| [Drawer.md](Drawer.md) | Abrir um lead pela direita, com o perfil fixo e o conteúdo da seção escolhida. |
| [Header.md](Header.md) | O topo de uma página do CRM, numa linha só: onde a pessoa está, que página é e |
| [IconeDeMarca.md](IconeDeMarca.md) | Mostrar a marca de um canal ou integração — WhatsApp, Instagram, Google — num conjunto fechado, com o logo de  |
| [Input.md](Input.md) | Receber um valor curto digitado, com rótulo visível e erro inline. |
| [KpiCard.md](KpiCard.md) | Exibe uma métrica única — número em destaque, rótulo do que ele mede e uma |
| [LogoDatacrazy.md](LogoDatacrazy.md) | Símbolo e logotipo do DataCrazy (`LogoDataCrazy` no código), em `currentColor` para acompanhar o tema. É a |
| [Menu.md](Menu.md) | A lista de ações e opções que abre de um botão: o menu da coluna e o botão |
| [Modal.md](Modal.md) | Pedir uma decisão bloqueando a tela até ela ser tomada. |
| [Pagination.md](Pagination.md) | Navegar entre as páginas de uma lista longa. |
| [Popover.md](Popover.md) | A casca de todo painel flutuante do DS — lista do Select, calendário, hora, |
| [RadioGroup.md](RadioGroup.md) | Escolher exatamente uma opção entre poucas, todas visíveis ao mesmo tempo. |
| [Rating.md](Rating.md) | Avaliação de 0 a 10 estrelas (o máximo é prop): editável por clique e setas, |
| [SegmentedControl.md](SegmentedControl.md) | Escolha exclusiva à vista entre 2 e 4 opções — período, escopo, visualização. |
| [Select.md](Select.md) | Escolher uma opção numa lista curta. |
| [Sidebar.md](Sidebar.md) | Navegação principal do CRM: marca, grupos de itens com ícone e rótulo, |
| [Switch.md](Switch.md) | Ligar ou desligar algo que passa a valer na hora, sem botão de salvar. |
| [Tabs.md](Tabs.md) | Alternar entre as seções de um mesmo registro. |
| [Tag.md](Tag.md) | Mostrar uma etiqueta que o usuário pôs no lead. |
| [TelaBase.md](TelaBase.md) | A casca de toda tela do CRM: Sidebar, Header e conteúdo já ligados, com os |
| [Telefone.md](Telefone.md) | Receber um telefone com o país separado do número. |
| [Textarea.md](Textarea.md) | Receber um texto de várias linhas — observação, nota interna, a mensagem do chat — na mesma caixa do Input, cr |
| [TimePicker.md](TimePicker.md) | Escolher uma hora, e uma data com hora, sabendo de fuso. |
| [Toast.md](Toast.md) | Confirmar o resultado de uma ação sem bloquear a tela. |
| [Tooltip.md](Tooltip.md) | Mostrar um texto curto ancorado num gatilho, por cursor ou teclado. |
<!-- kfe:index:end -->

## Como ler a coluna "origem" dos estados

| Origem | Significa |
|--------|-----------|
| `figma` | Variante desenhada — verdade absoluta, medida por pixel-diff |
| `declarado` | Declarado em [../processo/interactions.md](../processo/interactions.md) |
| `banco` | Regra herdada (local do produto > global I1–I15 do kit) |
| `inferido` | Analogia com precedente citado — provisório até o gate |
| `humano` | Decisão tomada num gate; virou regra local |

`inferido` sem precedente citado não existe: é bloqueio, não estimativa.

## Como adicionar um componente

Não se adiciona à mão. Gere o componente pela `fw-ui` e rode a `fw-doc` do
lote — ela escreve o arquivo, grava o registro e roda
`node .kfe-kit/scripts/kfe-docs.mjs index`.
