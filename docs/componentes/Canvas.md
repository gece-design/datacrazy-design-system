# Componente: Canvas

## Responsabilidade

O editor visual de fluxo: blocos numa folha sem tamanho, ligados por curvas
da saída de um à entrada de outro. Mover a tela, dar zoom, arrastar bloco,
ligar por arrasto, marcar vários, menu no botão direito, desfazer, enquadrar,
organizar e mapa são do componente; o fluxo e o histórico são da tela.

## Quando usar

- **Use** para editar um fluxo com ramificações: automação, jornada do lead, árvore de decisão de um agente de IA.
- **Use** `tipos` para dizer o ícone e o rótulo de cada tipo de bloco e qual é o `inicio` (não se remove nem duplica; o organizar parte dele); `corpo` no bloco quando o tipo pede um resumo próprio no lugar da lista de itens.
- **Não use** para uma sequência sem ramificação: é uma lista ordenada, ou os passos de um formulário.
- **Não use** para mover registros entre estágios: é o `Quadro`.
- **Não use** para desenhar livremente (formas, texto solto): o canvas só conhece blocos e ligações.

## Família

`superficie` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Não há: nasceu da tela de Automações (2026-10-01, "canvas de verdade" em
2026-10-02, ADR-062) e foi componentizado em 2026-10-07 a pedido do cliente
na reunião de 02/10 — tudo o que o protótipo mostra é componente do design
system (ADR-073). O arquivo passa a acompanhar o código na remedição
(AUD-203, lote `figma`).

## Props

### `Canvas<B extends BlocoDoCanvas>`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `blocos` | `B[]` | sim | Os blocos do fluxo, com posição em px do canvas. |
| `tipos` | `Record<B["tipo"], TipoDoCanvas>` | sim | O rótulo e o ícone de cada `tipo`; `inicio` marca o começo do fluxo. |
| `opcoesParaAdicionar` | `{ valor, rotulo, icone? }[]` | sim | O que a lista de adicionar oferece (dois cliques no fundo, "adicionar aqui", saída solta no vazio). Sem `icone`, o do tipo. |
| `selecionados` | `string[]` | sim | Os blocos marcados. Com um só, a tela abre o painel dele. |
| `aoSelecionar` | `(ids: string[]) => void` | sim | Clique, laço, Ctrl/⌘ + A, Escape. |
| `aoMover` | `(posicoes: Record<string, { x; y }>) => void` | sim | A posição nova de cada bloco movido: arrasto, setas ou organizar. Já na grade de 8. |
| `aoLigar` | `(bloco, saida, para: string \| undefined) => void` | sim | Liga a saída de um bloco a outro; sem `para`, desfaz a ligação. |
| `aoAdicionar` | `(tipo, x, y, ligar?: { bloco; saida }) => void` | sim | Cria um bloco no ponto do canvas; com `ligar`, nasce como destino daquela saída. |
| `aoRemover` | `(ids: string[]) => void` | sim | Delete, ou o menu. A tela decide o que não se remove. |
| `aoDuplicar` | `(ids: string[]) => void` | sim | Ctrl/⌘ + D, ou o menu. |
| `aoDesfazer`, `aoRefazer` | `() => void` | sim | Ctrl/⌘ + Z e Ctrl/⌘ + Shift + Z, e os botões da barra. |
| `podeDesfazer`, `podeRefazer` | `boolean` | sim | Habilitam os botões e os atalhos. |
| `rotulos` | `Partial<RotulosDoCanvas>` | não | Os textos (i18n). Fábrica: `ROTULOS_DO_CANVAS`. |
| `className` | `string` | não | — |
| `ref` | `CanvasRef` | não | `centro()`: o ponto do canvas no meio da tela — onde um bloco pedido pelo Header deve nascer. |

### `BlocoDoCanvas`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `id` | `string` | sim | — |
| `tipo` | `string` | sim | A chave em `tipos`: dá o ícone e o rótulo do cabeçalho. |
| `titulo` | `string` | sim | — |
| `x`, `y` | `number` | sim | Posição no canvas, em px. |
| `itens` | `string[]` | sim | As linhas do corpo: cada uma vira um item da lista. |
| `saidas` | `SaidaDoCanvas[]` | sim | `id`, `rotulo`, `para?` (o id do destino) e `tom?` (`alerta` ou `erro`: a cor da bolinha e do conector). |
| `contagem` | `{ sucessos; alertas; erros }` | não | Quantas execuções passaram pelo bloco e como terminaram: o pé do cartão. |
| `corpo` | `ReactNode` | não | Um corpo pronto, no lugar da lista de `itens`: o resumo que o tipo pede (a mensagem com o canal, a espera com o tempo). |

### `TipoDoCanvas`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `rotulo` | `string` | sim | O nome do tipo, no cabeçalho do bloco. |
| `icone` | `Icon` | sim | Phosphor, 16px, no quadrado do cabeçalho (`IconeDoBloco`). |
| `inicio` | `boolean` | não | O começo do fluxo: sem entrada, não se remove nem duplica, e o organizar parte dele. |

### `RotulosDoCanvas`

`canvas` (nome da região) · `aproximar` · `afastar` · `ajustar` · `organizar` ·
`desfazer` · `refazer` · `mapa` · `ajuda` · `sucessos` · `alertas` · `erros` ·
`adicionarBloco` · `buscarBloco` · `nenhumBloco` · `adicionarAqui` ·
`selecionarTudo` · `duplicar` · `desligar` · `remover` · `removerLigacao` ·
`maisAcoes` · `atalhos` (`{ gesto, efeito }[]`, a lista do cartão de ajuda).

`LARGURA_DO_BLOCO` (264) e `IconeDoBloco` (o quadrado do ícone do tipo, que a
tela reusa no painel do bloco) também são exportados.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| bloco com `itens` | O corpo é a lista de linhas do tipo (gatilhos, condições, ações). |
| bloco com `corpo` | O tipo pede um resumo próprio (mensagem com o canal e o texto; espera com o tempo). |
| saída com `tom` | `alerta` (warning) e `erro` (destructive) na bolinha e no conector; sem tom, o caminho feliz em `subtle-foreground`. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| bloco marcado | `outline 2px primary no cartão; os conectores dele em destaque` | humano | — |
| bloco em arrasto | `segue o ponteiro sem transição; assenta na grade de 8 ao soltar` | humano | — |
| ligando | `curva provisória da bolinha até o ponteiro; o destino acende ao passar` | humano | — |
| conector marcado | `traço mais grosso em primary; Delete remove` | humano | — |
| laço | `retângulo accent/30 com traço primary ao arrastar com Shift` | humano | — |
| zoom pedido por botão ou tecla | `a folha desliza em base · enter; conectores remedidos a cada quadro` | humano | ADR-068 |
| fundo | `bg-muted pontilhado em subtle-foreground, que anda e escala com a vista` | humano | ADR-062 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher. Não há "bloco com erro": a cor só entra na
saída, e o pé do bloco diz quantas execuções deram erro.

## Tokens consumidos

`muted` · `card` · `border` · `foreground` · `muted-foreground` ·
`subtle-foreground` · `primary` · `accent` · `warning` · `destructive` ·
`overlay/bg` · `overlay/border` · `elevation/lg` · `z/popover` · `radius/md` ·
`radius/lg` · `text/heading-4` · `text/label-md` · `text/caption` ·
`duration/base` · `ease/enter`

## Composição

Usa: [Button](Button.md) (barra, `ghost` e `tertiary`) · [Combobox](Combobox.md)
(`ComboboxPainel` para adicionar bloco, com busca) · [Menu](Menu.md) (botão
direito) · `lib/movimento.ts` (`DURACAO.base`) · `lib/estados.ts` (`foco`,
`focoInterno`).
Usado por: tela de Automações (`/exemplos/automacoes`, `CanvasDaAutomacao`)

## Exemplo de uso

```tsx
const canvas = useRef<CanvasRef>(null);
const [blocos, setBlocos] = useState<BlocoDoCanvas[]>(FLUXO);
const [selecionados, setSelecionados] = useState<string[]>([]);

<Canvas
  ref={canvas}
  blocos={blocos}
  tipos={{ inicio: { rotulo: "Início", icone: Play, inicio: true }, passo: { rotulo: "Passo", icone: Lightning } }}
  opcoesParaAdicionar={[{ valor: "passo", rotulo: "Passo" }]}
  selecionados={selecionados}
  aoSelecionar={setSelecionados}
  aoMover={(posicoes) => setBlocos((bs) => bs.map((b) => (posicoes[b.id] ? { ...b, ...posicoes[b.id] } : b)))}
  aoLigar={(bloco, saida, para) => ligar(bloco, saida, para)}
  aoAdicionar={(tipo, x, y, ligar) => adicionar(tipo, x, y, ligar)}
  aoRemover={remover}
  aoDuplicar={duplicar}
  aoDesfazer={historico.desfazer}
  aoRefazer={historico.refazer}
  podeDesfazer={historico.podeDesfazer}
  podeRefazer={historico.podeRefazer}
  rotulos={{ canvas: "Fluxo da automação" }}
/>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Região | `role="application"` nomeada por `rotulos.canvas`; os blocos são focáveis e o teclado move, duplica, remove e seleciona tudo |
| Teclado | Setas movem o bloco marcado na grade; Ctrl/⌘ + A, D, Z e Shift + Z; Delete remove bloco ou ligação; Escape desmarca; `1`, `+` e `−` na vista |
| Botões | Toda ação da barra é `Button` com nome; o cartão de ajuda lista os gestos e os atalhos |
| Menu | O botão direito abre o `Menu` do DS, com os mesmos itens por teclado |
| Movimento | Só o que a pessoa pede por botão ou tecla desliza (`base`); com `prefers-reduced-motion` não há (I12, global) |

## Divergências abertas (para o gate)

AUD-203 (`adiado`, lote `figma`): sem par no arquivo. Desenhar o canvas no
Figma a partir do código, na remedição.
