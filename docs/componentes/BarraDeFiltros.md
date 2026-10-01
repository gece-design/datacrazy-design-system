# Componente: BarraDeFiltros

## Responsabilidade

Filtrar uma lista por vários campos: cada filtro ativo é um chip ("Etapa: Proposta"), e o "+ Filtro" lista os campos que ainda não entraram.

## Quando usar

- **Use** em tela de lista ou quadro com três campos de filtro ou mais: só o que está ativo ocupa espaço, e cada campo abre a própria lista com busca.
- **Use** com o `HeaderFiltros`: o botão do Header mostra e esconde a barra, e `contarFiltros` dá a conta que ele exibe.
- **Use** `unico` no campo que aceita um valor só (período, responsável único); sem ele o campo aceita vários, com caixa de marcar.
- **Não use** `Modal` com grupos de `Checkbox` empilhados para filtrar: é esta barra.
- **Não use** `Select` na barra da tabela para filtrar: é esta barra, sob o Header.
- **Não use** para a busca por texto: é `HeaderBusca`.
- **Não use** para as situações fixas de uma lista (Abertas · Pendentes · Finalizadas): é `Tabs`.

## Família

`navegacao` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Sem par no arquivo. Nasceu da crítica de design de 2026-09-28 ("filtro com
muitas opções não tem padrão": sete grupos de checkbox empilhados num modal,
sem busca e sem hierarquia entre filtro de um valor e de vários). O chip é o
Button `soft` — o mesmo sinal de "filtro ativo" do `HeaderFiltros` —, o
"+ Filtro" é o Button `ghost`, e a lista é o `ComboboxPainel`. Registrado no
ADR-050; o Figma acompanha na remedição.

## Props

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `campos` | `CampoDeFiltro[]` | — | sim | Os campos que a tela deixa filtrar: `id`, `rotulo`, `icone?` (Phosphor), `opcoes` (as do Combobox: `grupo`, `icone`, `conteudo`) e `unico?`. |
| `valor` | `FiltrosAtivos` | — | sim | `Record<string, string[]>`: campo → valores escolhidos. Campo fora do objeto não está na barra. A ordem das chaves é a ordem dos chips. |
| `aoMudar` | `(valor: FiltrosAtivos) => void` | — | sim | Chamado a cada escolha. Aplica na hora: não há botão de confirmar. |
| `rotulos` | `RotulosDaBarraDeFiltros` | — | sim | `adicionar` ("Filtro"), `limpar` ("Limpar"), `busca`, `vazio` e `remover: (campo) => string` (nome do X de cada chip). |
| `abrirAoMontar` | `boolean` | `false` | não | Sem nenhum filtro, já abre a lista de campos ao aparecer — para a barra que o `HeaderFiltros` mostra e esconde. |
| `className`, `aria-label`… | nativos | — | não | Repassados ao contêiner. |

`contarFiltros(valor)` devolve quantos campos estão filtrando de fato — é o
número do `HeaderFiltros`.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| campo de vários valores | Padrão. Caixa de marcar em cada opção; o chip resume: um ou dois por extenso, depois "primeiro +n". |
| campo `unico` | Um valor só: escolher troca e fecha. |
| com `abrirAoMontar` | A barra aparece pelo clique no `HeaderFiltros`: abrir já na lista de campos poupa um clique. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `o do Button: button-soft-hover no chip, accent no + Filtro e no Limpar` | banco | I1 |
| focus | `outline 2px nos dois botões do chip, no + Filtro e no Limpar` | banco | D6 |
| ativo | `chip soft com o resumo dos valores (um ou dois por extenso, depois primeiro +n)` | banco | — |
| aberto | `caret do chip girado 180 + aria-expanded` | banco | L11 |
| vazio | `chip fechado sem nenhum valor some` | inferido | — |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`button/soft-bg` · `button/soft-foreground` · `button/soft-hover` · `accent` ·
`muted-foreground` · `foreground` · `ring` · `radius/md` · `text/button` ·
mais os do `ComboboxPainel` (`overlay/*`, `input/*`).

## Composição

Usa: `Button` (`soft`, `ghost`, `icon-sm`) e `ComboboxPainel` ·
Usado por: a tela do Pipeline (bloco `pipeline`), sob o Header, valendo para o quadro e para a lista.

## Exemplo de uso

```tsx
// cada campo é um CampoDeFiltro: id, rotulo, icone, opcoes e, se aceita um valor só, unico
const campos = [
  { id: "etapa", rotulo: "Etapa", icone: FunnelSimple, opcoes: etapas },
  { id: "atendente", rotulo: "Atendente", icone: Headset, opcoes: atendentes },
  { id: "origem", rotulo: "Origem", icone: ShareNetwork, opcoes: origens },
];
const [filtros, setFiltros] = useState<FiltrosAtivos>({});

<BarraDeFiltros
  aria-label="Filtros"
  campos={campos}
  valor={filtros}
  aoMudar={setFiltros}
  rotulos={{
    adicionar: "Filtro",
    limpar: "Limpar",
    busca: "Buscar",
    vazio: "Nada encontrado",
    remover: (campo) => `Remover filtro ${campo}`,
  }}
/>
```

Com o botão do Header mostrando e escondendo a barra:

```tsx
<HeaderFiltros
  rotulo="Filtros"
  contagem={contarFiltros(filtros)}
  aria-expanded={barraAberta}
  onClick={() => setBarraAberta((v) => !v)}
/>

{barraAberta ? (
  <BarraDeFiltros abrirAoMontar aria-label="Filtros" campos={campos} valor={filtros} aoMudar={setFiltros} rotulos={rotulos} />
) : null}
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Chip | Dois botões colados: o que abre a lista (`aria-haspopup`, `aria-expanded`) e o X, com nome próprio por `rotulos.remover` — clicável dentro de clicável não existe |
| Foco | Visível nos dois botões (D6); ao fechar a lista, volta ao chip |
| Teclado | Tab anda pelos chips, pelo "+ Filtro" e pelo "Limpar"; a lista é a do Combobox (setas, Enter, Escape) |
| Texto longo | O resumo do chip trunca em 192px, com o texto inteiro no `title` |
| Estado vazio | Chip fechado sem nenhum valor some: filtro vazio não filtra nada |
| Zoom | A barra quebra linha (`flex-wrap`); nada tem largura fixa |
