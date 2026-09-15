# Componentes

Um arquivo por componente do design system. É a **face legível** do
`../processo/components-registry.json`: mesma verdade, dois formatos —
markdown para humano e IA lerem, JSON para o script auditar. Divergir os
dois é bug.

Escrito pela `fw-doc` ao fim de cada lote, **lendo o código gerado** —
nunca à mão, nunca de memória. A seção **Estados** de cada arquivo é gerada
pelo `kfe-docs index` a partir do registro: o JSON é o dono do fato, o
markdown é a vista dele.

> **Estado hoje (2026-09-02): vazio, com dívida declarada.** O showcase já tem
> `Button`, `Badge` e `Card` em código (`components/ui/`), e nenhum deles tem
> arquivo aqui nem entrada no registro — a `fw-doc` nunca rodou sobre eles.
> Enquanto isso não for feito, **a verdade sobre esses três está no código**,
> não aqui. Ausência de arquivo não significa ausência de componente.

## Inventário

<!-- kfe:index:start -->
| Arquivo | Responsabilidade |
|---------|------------------|
| [Avatar.md](Avatar.md) | Identificar pessoa ou empresa pela inicial, ou pela foto. |
| [Card.md](Card.md) | Superfície que carrega um bloco de dados do dashboard. |
| [Checkbox.md](Checkbox.md) | Marcar ou desmarcar uma opção independente, inclusive o "parte marcada" de |
| [DataTable.md](DataTable.md) | Lista os negócios do CRM em colunas, com filtros e paginação. |
| [Drawer.md](Drawer.md) | Abrir um lead pela direita, com o perfil fixo e o conteúdo da seção escolhida. |
| [Input.md](Input.md) | Receber um valor curto digitado, com rótulo visível e erro inline. |
| [KpiCard.md](KpiCard.md) | Exibe uma métrica única — número em destaque, rótulo do que ele mede e uma |
| [Modal.md](Modal.md) | Pedir uma decisão bloqueando a tela até ela ser tomada. |
| [Pagination.md](Pagination.md) | Navegar entre as páginas de uma lista longa. |
| [RadioGroup.md](RadioGroup.md) | Escolher exatamente uma opção entre poucas, todas visíveis ao mesmo tempo. |
| [Select.md](Select.md) | Escolher uma opção numa lista curta. |
| [Switch.md](Switch.md) | Ligar ou desligar algo que passa a valer na hora, sem botão de salvar. |
| [Tabs.md](Tabs.md) | Alternar entre as seções de um mesmo registro. |
| [Tag.md](Tag.md) | Mostrar uma etiqueta que o usuário pôs no lead. |
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
