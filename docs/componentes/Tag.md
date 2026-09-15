# Componente: Tag

## Responsabilidade

Mostrar uma etiqueta que o usuário pôs no lead.

## Família

`superficie` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `538:197` ("Tag", canvas do Drawer) · Lote: `3` · Oito temas: Text,
Status, theme8, Status 2, Atendente, Empresa, Pessoa, Adicionar. O painel do
seletor parte do Select Menu `544:122` e do Select Item `544:99`.

Diff de pixels **não medido** (`figma-console` fora do ar).

## Props

### `Tag`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `status` | `"destructive" \| "info" \| "success"` | não | Bolinha de 6px antes do texto. |
| `tipo` | `"pessoa" \| "empresa"` | não | Ícone de 12px e texto em `primary`. |
| `foto` | `string` | não | Foto de 22px encostada à esquerda (atendente). |
| `children` | `ReactNode` | sim | O texto. A caixa alta é CSS. |

### `TagAdicionar`

`rotulo` (obrigatório) e os atributos de `<button>`.

### `SeletorTags`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `grupos` | `GrupoTags[]` | sim | Uma aba por grupo: `id`, `rotulo`, `tags`. |
| `selecionadas` | `string[]` | sim | Ids das tags do lead. |
| `aoAlternar` | `(tag) => void` | sim | Põe ou tira a tag. |
| `aoCriar` | `(rotulo, grupoId) => void` | não | Sem ela, a busca só filtra. |
| `rotulos` | `{ gatilho, busca, vazio, criar }` | sim | Textos (i18n). `criar` recebe texto e aba. |

## Variantes

| Arquivo | Código |
|---------|--------|
| Text | `<Tag>` |
| Status · theme8 · Status 2 | `status="destructive"` · `"info"` · `"success"` |
| Pessoa · Empresa | `tipo="pessoa"` · `"empresa"` |
| Atendente | `foto` |
| Adicionar | `<TagAdicionar>` |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `bg-primary-hover no TagAdicionar; bg-overlay-item-hover no item do seletor` | figma | Select Item 544:99 |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | I4 |
| selecionada | `bg-overlay-item-selected + Check overlay-item-text-selected` | figma | Select Item 544:99 |
| aberto | `painel em portal fixo + foco na busca + Escape so no painel` | humano | Select (lista aberta) |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

A `Tag` é leitura. Só o `TagAdicionar` é interativo.

## Tokens consumidos

`input/bg-disabled` · `foreground` · `primary` · `primary-hover` ·
`destructive` · `info` · `success` · `background` · `radius/full` ·
`text/label-sm` · `shadow-button-inner` · no seletor: `overlay/bg` ·
`overlay/border` · `overlay/item-hover` · `overlay/item-selected` ·
`overlay/item-text-selected` · `elevation/lg` · `radius/lg` · `text/body-md`

## Composição

Usa: [Tabs](Tabs.md) e a caixa do [Input](Input.md) no seletor · Phosphor
(`User`, `Buildings`, `Plus`, `Check`, `MagnifyingGlass`) ·
Usado por: [Drawer](Drawer.md) (perfil, tabela de negócios, nó da hierarquia)

## Exemplo de uso

```tsx
<div className="flex flex-wrap justify-center gap-1">
  <Tag foto="/fotos/esther.png">Esther</Tag>
  <Tag>Lista de leads</Tag>
  <Tag status="destructive">Abandonou</Tag>
  <TagAdicionar rotulo="Adicionar tag" onClick={abrirSeletor} />
</div>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Cor | A bolinha é `aria-hidden`: o sentido está no texto, não na cor |
| Caixa alta | `uppercase` no CSS — o leitor de tela lê a string original |
| Adicionar | `<button>` com `aria-label` e `title` (regra E7) |
| Seletor | Painel `role="dialog"`; abas do `Tabs`; busca `role="combobox"` com `aria-activedescendant` numa `listbox` multisseleção |
| Teclado | Setas andam na lista, Enter põe/tira ou cria, Escape fecha só o painel e devolve o foco ao + |
| Alvo de toque | `TagAdicionar` tem 22px — **abaixo dos 44 da regra I15** |

## Divergências abertas (para o gate)

1. **Tag de tipo no perfil tem override do arquivo.** O componente usa fundo
   `input/bg-disabled` e recuo 6px; a instância sobre o avatar usa `background`
   e 4px em volta. O Drawer repete o override por `className`.
2. **Ícone do "+" em `background`.** O SVG vem em `#EBEDEF`. No escuro,
   `background` é quase preto sobre o azul claro — confere com o
   `primary-foreground` escuro, mas não é o mesmo token.
3. **Empresa roxa.** No perfil, a cor da tag de tipo vem do tom
   (`--tom-tag`) — ver [Drawer](Drawer.md). A Tag solta segue em `primary`.
4. **Abas e busca do seletor não estão no arquivo.** Pedido do humano
   (2026-09-15), montado com a Tab (535:21) e a caixa do Input sobre o Select
   Menu. A contagem por aba vai no rótulo da aba.
5. **Painel em portal com posição fixa.** Necessário porque o perfil do drawer
   rola; o painel vira para cima quando não cabe embaixo.
