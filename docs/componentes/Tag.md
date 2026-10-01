# Componente: Tag

## Responsabilidade

Mostrar uma etiqueta que o usuário pôs no lead.

## Quando usar

- **Use** para etiqueta do lead, status com bolinha (`status`), tipo do registro (`tipo`) e atendente (`foto`).
- **Use** neutra por padrão; `tom` só quando o produto define a cor daquele dado (etapa do funil, perfil).
- **Não use** para selo de situação do sistema (beta, novo): é `Badge`.
- **Não use** `tom` sorteado para colorir a lista: cor só quando carrega significado.
- **Não use** como botão: adicionar é `TagAdicionar` ou `SeletorTags`.

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
| `tom` | `Tom` | não | Um dos oito tons de `[data-tom]` (`TONS`): `azul` `roxo` `rosa` `laranja` `verde` `ciano` `ambar` `vermelho`. Sem tom, a tag é cinza — o atendente. `tomDe(chave)` dá um tom estável para um texto (verde e vermelho ficam fora do sorteio). |
| `icone` | `ComponentType` | não | Ícone de 12px antes do texto, para quem não distingue as cores. |
| `children` | `ReactNode` | sim | O texto. A caixa alta é CSS. |

Mais larga que o lugar (`max-w-full`), a tag trunca o texto com reticências —
é o que evita a invasão da coluna vizinha na grade densa; ponha `title` quando
o rótulo inteiro importar.

### `TagAdicionar`

`rotulo` (obrigatório) e os atributos de `<button>`.

### `SeletorTags`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `grupos` | `GrupoTags[]` | sim | Uma aba por grupo: `id`, `rotulo`, `tags` (`OpcaoTag`: `id`, `rotulo`, `status?`, `foto?`, `tom?`, `icone?`) e `corLivre?` — nesta aba a cor é escolha de quem cria (Listas); nas outras é regra. |
| `selecionadas` | `string[]` | sim | Ids das tags do lead. |
| `aoAlternar` | `(tag) => void` | sim | Põe ou tira a tag. |
| `aoCriar` | `(rotulo, grupoId, tom?) => void` | não | Sem ela, a busca só filtra. O `tom` só vem quando a aba tem `corLivre`. |
| `rotulos` | `{ gatilho, busca, vazio, criar, cor }` | sim | Textos (i18n), **os cinco obrigatórios**. `criar(texto, grupo)` devolve a frase da opção; `cor` é o rótulo da fileira de cores. |
| `className` | `string` | não | — |

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
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | D6 |
| selecionada | `bg-overlay-item-selected + Check overlay-item-text-selected` | figma | Select Item 544:99 |
| aberto | `painel em portal fixo + foco na busca + Escape so no painel` | humano | L11 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

A `Tag` é leitura. Só o `TagAdicionar` é interativo.

## Tokens consumidos

`input/bg-disabled` · `foreground` · `primary` · `primary-hover` ·
`destructive` · `info` · `success` · `background` · `radius/full` ·
`text/label-sm` · no seletor: `overlay/bg` ·
`overlay/border` · `overlay/item-hover` · `overlay/item-selected` ·
`overlay/item-text-selected` · `elevation/lg` · `radius/lg` · `text/body-md`

## Composição

Usa: `caixaDeCampo` do [Input](Input.md) na busca, [Tabs](Tabs.md) nas abas do seletor, `PainelFlutuante` do [Popover](Popover.md) em modo `fixo` (portal) e `useCliqueFora` (lib); ícones Phosphor (`User`, `Buildings`, `Plus`, `Check`, `MagnifyingGlass`) ·
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

O `SeletorTags` não sabe o que é tag: `grupos`, opções e `rotulos` são conteúdo.
A página monta três outros cenários com o mesmo componente — produtos de uma
proposta (planos com cor por degrau; serviços e add-ons com `corLivre` e criar),
responsáveis por um negócio (foto no lugar da cor, sem `aoCriar`: a busca só
filtra) e origem do lead (canal com logo e cor fixa; campanha com cor livre).

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Cor | A bolinha é `aria-hidden`: o sentido está no texto, não na cor |
| Caixa alta | `uppercase` no CSS — o leitor de tela lê a string original |
| Adicionar | `<button>` com `aria-label` e `title` (regra E7) |
| Seletor | Painel `role="dialog"`; abas do `Tabs`; busca `role="combobox"` com `aria-activedescendant` numa `listbox` multisseleção |
| Teclado | Setas andam na lista, Enter põe/tira ou cria, Escape fecha só o painel e devolve o foco ao + |
| Alvo de toque | `TagAdicionar` tem 22px — **abaixo dos 44 da regra I15** |
| Movimento | O seletor entra em `fade-in-fast` e sai em `fade-out` (casca do Popover + `useSaida`) |

## Divergências abertas (para o gate)

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-174, AUD-175, AUD-176, AUD-177, AUD-178 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
