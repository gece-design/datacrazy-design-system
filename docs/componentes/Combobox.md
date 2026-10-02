# Componente: Combobox

## Responsabilidade

Escolher uma ou várias opções numa lista com busca — o Select para lista longa, com grupos ou com várias escolhas.

## Quando usar

- **Use** `Combobox` para uma escolha numa lista longa (mais de ~10 opções) ou que cresce com o uso: cidade, produto, responsável, origem.
- **Use** `ComboboxMultiplo` para várias escolhas com caixa de marcar: tags, canais, segmentos.
- **Use** `ComboboxPainel` quando o gatilho já existe: o chip da `BarraDeFiltros`, a `CelulaEscolha` da tabela.
- **Use** `detalhe` quando o nome sozinho não distingue (duas empresas parecidas: o domínio desempata); `aoCriar` quando a lista cresce com o uso (empresa, cidade, segmento); `acao` para o caminho de quem quer editar a lista ("Gerenciar etapas") — uma só, nunca um menu de ações.
- **Use** `conteudo` quando a opção aparece na tela como uma `Tag` (atendente com foto, tag com cor): a lista e o gatilho mostram a mesma Tag, não o nome escrito. É regra do DS inteiro.
- **Não use** `Menu` para escolher atendente ou tag: `Menu` é para ações; a lista de Tags é `ComboboxPainel`.
- **Não use** para lista curta e fechada (até ~10 opções, sem busca): é `Select`.
- **Não use** para ações sobre um item: é `Menu`.
- **Não use** para as etiquetas do lead no drawer: é `SeletorTags`, que cria tag e separa por aba.
- **Não use** vários Combobox empilhados num modal para filtrar uma lista: é `BarraDeFiltros`.

## Família

`entrada` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Sem par no arquivo. Nasceu da crítica de design de 2026-09-28 ("o catálogo nem
lista um componente chamado Combobox separado do Select"). O gatilho é o
`SelectTrigger`; o painel é a casca de todo painel flutuante do DS
(`PainelFlutuante`, tokens `overlay/*`), com a busca do `SeletorTags` e a caixa
de marcar do `Menu`. Registrado no ADR-049; o Figma acompanha na remedição.

## Props

### Combobox

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `opcoes` | `OpcaoCombobox[]` | — | sim | `valor`, `rotulo`, `icone?`, `grupo?`, `conteudo?` (as do `OpcaoSelect`: `conteudo` é a opção como ela aparece na tela — a `Tag` do atendente com a foto, a tag com a cor —, na lista e no gatilho) e `detalhe?`: texto de apoio à direita, apagado (o domínio da empresa, o e-mail da pessoa). A busca procura no `rotulo` e no `detalhe`. |
| `rotulo` | `string` | — | sim | Nome do controle para leitor de tela. Ex.: "Origem do lead". |
| `rotulos` | `RotulosDoCombobox` | — | sim | `busca` (placeholder e nome da busca), `vazio` (busca sem resultado) e `criar?` — a frase da linha de criar, com o texto digitado: `(t) => \`Criar "${t}"\``. Texto nunca dentro do componente. |
| `aoCriar` | `(texto: string) => void` | — | não | Com ela, a busca que não acha oferece criar: uma linha no fim da lista. Numa escolha, criar fecha o painel; em várias, limpa a busca e a lista fica aberta. |
| `acao` | `AcaoDoCombobox` | — | não | Uma ação fixa no pé do painel, fora da lista: `{ rotulo, icone?, aoAtivar }`. Ex.: "Gerenciar etapas". Ativar fecha o painel. |
| `valor` | `string` | — | não | O valor escolhido. Sem ele, o gatilho mostra `textoVazio`. |
| `aoEscolher` | `(valor: string) => void` | — | não | Chamado ao escolher; o painel fecha. |
| `textoVazio` | `string` | `"Selecione"` | não | O que o gatilho mostra sem escolha. |
| `size` | `"md" \| "sm" \| "field"` | `"md"` | não | Os tamanhos do gatilho do Select. Ao lado de um Input é `field`. |
| `className` | `string` | — | não | — |

### ComboboxMultiplo

As mesmas de `Combobox`, trocando `valor` e `aoEscolher` por:

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `valores` | `string[]` | — | sim | Os valores escolhidos. O gatilho mostra o primeiro e quantos mais ("WhatsApp +2"). |
| `aoMudar` | `(valores: string[]) => void` | — | não | Chamado a cada marca ou desmarca; o painel fica aberto. |

### ComboboxPainel

Só o painel, controlado, ancorado em qualquer gatilho — como o `Menu`.

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `aberto` | `boolean` | — | sim | — |
| `aoFechar` | `(devolverFoco?: boolean) => void` | — | sim | `devolverFoco` falso quando quem fechou foi um clique fora ou o Tab. |
| `gatilho` | `RefObject<HTMLElement>` | — | sim | Quem abriu: dá a posição e recebe o foco de volta. |
| `rotulo` | `string` | — | sim | Nome do painel para leitor de tela. |
| `opcoes` | `OpcaoCombobox[]` | — | sim | — |
| `selecionados` | `string[]` | — | sim | Os valores escolhidos. |
| `aoAlternar` | `(valor: string) => void` | — | sim | Clique numa opção. Com `multiplo`, põe ou tira; sem, escolhe e o painel fecha. |
| `multiplo` | `boolean` | `false` | não | Caixa de marcar em cada opção, e o painel fica aberto. |
| `rotulos` | `RotulosDoCombobox` | — | sim | `busca`, `vazio` e `criar?`. |
| `aoCriar` | `(texto: string) => void` | — | não | A linha de criar no fim da lista (ver `Combobox`). |
| `acao` | `AcaoDoCombobox` | — | não | A ação fixa no pé do painel (ver `Combobox`). |
| `largura` | `number` | `256` | não | Largura mínima do painel, em px; nunca menor que o gatilho. |

## Variantes

| Variante | Quando usar |
|----------|-------------|
| `Combobox` | Uma escolha. Escolher fecha. A escolhida fica marcada com o check à direita. |
| `ComboboxMultiplo` | Várias escolhas. Caixa de marcar à esquerda; a lista fica aberta até o Escape ou o clique fora. |
| com `grupo` | Lista com mais de um assunto: "Redes sociais" / "Outras". O cabeçalho não é opção — o teclado passa direto. |
| com `icone` | Opção que tem marca ou símbolo: `IconeDeMarca` ou Phosphor de 16px. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `bg-overlay-item-hover na opção; text-foreground no gatilho` | banco | L2 |
| focus | `busca: traço e anel interno do campo; opção: o realce do hover, por aria-activedescendant; gatilho: outline 2px` | banco | D6 |
| selecionado | `uma escolha: bg-overlay-item-selected + Check 16; várias: caixa 16px primary com Check 12` | banco | — |
| aberto | `caret do gatilho girado 180 + text-foreground` | banco | L11 |
| vazio | `busca sem resultado: rotulos.vazio em muted-foreground` | banco | — |
| abrindo | `fade-in-fast; sai com fade-out` | banco | L10 |
| criar | `linha no fim da lista com Plus e a frase de rotulos.criar, em overlay-item-text-selected; último item das setas; Enter cria` | humano | SeletorTags (criar tag) |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`overlay/bg` · `overlay/border` · `overlay/item-hover` · `overlay/item-selected` ·
`overlay/item-text-selected` · `elevation/lg` · `z/popover` · `input/bg` ·
`input/border` · `input/border-focus` · `input/text` · `input/placeholder` ·
`primary` · `primary-foreground` · `card` · `foreground` · `muted-foreground` ·
`subtle-foreground` · `ring` · `radius/lg` · `radius/sm` · `text/label-lg` ·
`text/body-md` · `text/overline` · `duration/fast` · `duration/base`

## Composição

Usa: `SelectTrigger`, `GrupoDeOpcoes` e `agruparOpcoes` do Select, `PainelFlutuante` do Popover,
`buscaDoPainel` de `lib/campo.ts` (a busca sem caixa, com traço embaixo), `rolagemDiscreta` e `focoInterno` de `lib/estados.ts`, `useCliqueFora` e `useSaida` ·
Usado por: `BarraDeFiltros` (o chip e o "+ Filtro"), `CelulaEscolha` da Table e a tela do Pipeline.

## Exemplo de uso

```tsx
const origens = [
  { valor: "whatsapp", rotulo: "WhatsApp", grupo: "Redes sociais", icone: <IconeDeMarca marca="whatsapp" /> },
  { valor: "instagram", rotulo: "Instagram", grupo: "Redes sociais", icone: <IconeDeMarca marca="instagram" /> },
  { valor: "site", rotulo: "Site", grupo: "Outras" },
  { valor: "indicacao", rotulo: "Indicação", grupo: "Outras" },
];

<Combobox
  size="field"
  rotulo="Origem do lead"
  textoVazio="Selecione a origem"
  opcoes={origens}
  valor={origem}
  aoEscolher={setOrigem}
  rotulos={{ busca: "Buscar origem", vazio: "Nada encontrado" }}
/>
```

Várias escolhas, cada opção como a Tag que vai aparecer:

```tsx
<ComboboxMultiplo
  size="field"
  rotulo="Tags"
  textoVazio="Nenhuma tag"
  opcoes={tags.map((t) => ({ valor: t.id, rotulo: t.rotulo, conteudo: <Tag status={t.status}>{t.rotulo}</Tag> }))}
  valores={escolhidas}
  aoMudar={setEscolhidas}
  rotulos={{ busca: "Buscar tag", vazio: "Nenhuma tag encontrada" }}
/>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | Busca com `role="combobox"`, lista com `role="listbox"` (`aria-multiselectable` no múltiplo), opção com `role="option"` e `aria-selected`; grupo com `role="group"` e nome |
| Foco | Fica na busca o tempo todo; a opção sob o teclado anda por `aria-activedescendant` e rola para ficar à vista. Ao fechar, volta ao gatilho |
| Teclado | Setas andam (a linha de criar é o último item), Enter escolhe ou cria, Escape fecha só o painel (o Modal ou o Drawer de trás ficam), Tab fecha e segue — com `acao`, Tab vai da busca para ela e Shift+Tab volta |
| Foco na busca | A busca não tem caixa nem anel: o foco fica nela o tempo todo e o cursor do texto é o sinal; a opção sob o teclado tem fundo próprio |
| Busca | Ignora acento e caixa: "saude" acha "Saúde" |
| Rótulo | `rotulo` é o nome do gatilho e do painel; a busca tem `<label>` próprio (`sr-only`) |
| Texto longo | O rótulo da opção trunca com o texto inteiro no `title` |
| Zoom | Painel em portal `fixed`, medido a partir do gatilho: abre para cima quando não cabe embaixo e nunca vaza pela lateral |
