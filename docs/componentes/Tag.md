# Componente: Tag

## Responsabilidade

Mostrar uma etiqueta que o usuário pôs no lead.

## Quando usar

- **Use** para etiqueta do lead, status com bolinha (`status`), tipo do registro (`tipo`) e atendente (`foto`).
- **Use** neutra por padrão; `tom` só quando o produto define a cor daquele dado (etapa do funil, perfil).
- **Não use** para selo de situação do sistema (beta, novo): é `Badge`.
- **Não use** `tom` sorteado para colorir a lista: cor só quando carrega significado.
- **Não use** como botão: adicionar é `TagAdicionar` ou `SeletorTags`.
- **Use** `SeletorDeTom` quando a pessoa escolhe a cor de algo que ela cria (tag, etapa, lista): as quinze cores do DS, em amostras. Nunca um seletor de cor livre nem campo de hexadecimal.

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
| `tom` | `Tom` | não | Um dos catorze tons de `[data-tom]` (`TONS`, na ordem do círculo de cores): `azul` `indigo` `roxo` `fucsia` `rosa` `vermelho` `laranja` `ambar` `amarelo` `lima` `verde` `turquesa` `ciano` `marrom`. Sem tom, a tag é cinza — o atendente; com ela, são quinze cores (ADR-051). `tomDe(chave)` dá um tom estável para um texto, sempre entre os seis de antes (`azul` `roxo` `rosa` `laranja` `ciano` `ambar`): abrir a paleta não troca a cor de lista que já existe. |
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

### `SeletorDeTom`

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `valor` | `Tom \| null` | — | sim | O tom marcado. `null` é "sem cor": a tag cinza. |
| `aoEscolher` | `(tom: Tom \| null) => void` | — | sim | Clique numa amostra. |
| `rotulo` | `string` | — | sim | Nome do grupo para leitor de tela. Ex.: "Cor da tag". |
| `nomes` | `Partial<Record<Tom \| "neutro", string>>` | — | não | Nome de cada cor, para leitor de tela e tooltip (i18n). Sem ele, a chave do tom. |
| `comNeutro` | `boolean` | `false` | não | Abre a fileira com a amostra cinza: são as quinze cores. |
| `tamanho` | `"sm" \| "md"` | `"sm"` | não | 16px na fileira do seletor de tags; 24px, com o check na marcada, em formulário. |
| `className` | `string` | — | não | — |

Os tons (`TONS`, `Tom`, `tomDe`) moram em `lib/tons.ts` e a Tag os re-exporta.

## Variantes

| Arquivo | Código |
|---------|--------|
| Text | `<Tag>` |
| Status · theme8 · Status 2 | `status="destructive"` · `"info"` · `"success"` |
| Pessoa · Empresa | `tipo="pessoa"` · `"empresa"` |
| Atendente | `foto` |
| Adicionar | `<TagAdicionar>` |
| — (sem par) | `<SeletorDeTom>`: as amostras de cor, de 16 ou 24px |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `bg-primary-hover no TagAdicionar; bg-overlay-item-hover no item do seletor` | figma | Select Item 544:99 |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | D6 |
| selecionada | `bg-overlay-item-selected + Check overlay-item-text-selected` | figma | Select Item 544:99 |
| aberto | `painel em portal fixo + foco na busca + Escape so no painel` | humano | L11 |
| cor marcada | `amostra do SeletorDeTom: scale-110 + outline 2px foreground; no tamanho md, Check de 12 na cor da letra` | humano | fileira de cores do SeletorTags (2026-09-18) |
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
Usado por: [Drawer](Drawer.md) (perfil, tabela de negócios, nó da hierarquia); o `SeletorDeTom`, pelo `SeletorTags` e pelo modal de criar tag da tela de Leads

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
| Seletor de cor | `role="radiogroup"` com o `rotulo`; cada amostra é `role="radio"` com o nome da cor (`nomes`) e `aria-checked`; a marcada tem contorno e, no `md`, o check — não depende só da cor |
| Seletor | Painel `role="dialog"`; abas do `Tabs`; busca `role="combobox"` com `aria-activedescendant` numa `listbox` multisseleção |
| Teclado | Setas andam na lista, Enter põe/tira ou cria, Escape fecha só o painel e devolve o foco ao + |
| Alvo de toque | `TagAdicionar` tem 22px — **abaixo dos 44 da regra I15** |
| Movimento | O seletor entra em `fade-in-fast` e sai em `fade-out` (casca do Popover + `useSaida`) |

## Divergências abertas (para o gate)

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-174, AUD-175, AUD-176, AUD-177, AUD-178 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
