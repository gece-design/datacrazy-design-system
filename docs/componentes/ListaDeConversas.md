# Componente: ListaDeConversas

## Responsabilidade

Listar as conversas do atendimento numa coluna: abas de situação em cima e, embaixo, uma linha por conversa com avatar, nome, hora, canal, a última coisa dita e quantas não lidas — e devolver a clicada.

## Quando usar

- **Use** para a coluna de conversas de um chat: a tela filtra e ordena, o componente mostra e devolve o id.
- **Use** `contagem` em cada aba para dizer quantas conversas há nela, já com busca e filtros aplicados.
- **Não use** para a conversa aberta: é `Conversa`.
- **Não use** para lista de registros com colunas (leads, negócios): é `DataTable`.
- **Não use** para busca e filtros dentro da coluna: ficam no `Header` da tela (`HeaderBusca`, `HeaderFiltros`, `BarraDeFiltros`).

## Família

`superficie` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Não há: nasceu da tela de Atendimento (2026-09-29); componentizado em
2026-10-07 a pedido do cliente na reunião de 02/10. Uma superfície só, com
traço entre as linhas — sem cartão dentro de cartão (referência: Twenty e
Attio). O Figma acompanha na remedição.

## Props

### `ListaDeConversas`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `abas` | `AbaDeConversas[]` | sim | As abas de situação, na ordem. |
| `aba` | `string` | sim | O `valor` da aba atual. Estado da tela. |
| `aoMudarAba` | `(aba: string) => void` | sim | Clique ou setas na fileira. |
| `itens` | `ItemDeConversa[]` | sim | As conversas da aba atual, na ordem em que aparecem. A tela filtra. |
| `abertaId` | `string \| null` | sim | A conversa aberta ao lado: a linha fica em `accent`. |
| `aoAbrir` | `(id: string) => void` | sim | Clique numa linha. |
| `rotulos` | `Partial<RotulosDaListaDeConversas>` | não | Textos da coluna (i18n). Fábrica: `ROTULOS_DA_LISTA_DE_CONVERSAS`. |
| `className` | `string` | não | A largura vem daqui: `md:w-[320px]` na tela. |

### `AbaDeConversas`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `valor`, `rotulo` | `string` | sim | — |
| `contagem` | `number` | não | Quantas conversas nela: vai ao lado do rótulo ("Abertas · 5"). Zero não aparece. |

### `ItemDeConversa`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `id`, `nome` | `string` | sim | — |
| `avatar` | `string` | não | Foto. Sem ela, a inicial do nome. |
| `canal` | `ReactNode` | não | O ícone do canal, já pronto: `IconeDeMarca` ou um glifo Phosphor de 14. |
| `previa` | `string` | sim | A última coisa dita, como a lista mostra. Ex.: "Você: Mandei a proposta". Trunca com `title`. |
| `hora` | `string` | sim | Quando foi. Ex.: "09:13" ou "Ontem". |
| `naoLidas` | `number` | não | Com valor, a prévia escurece e o contador aparece. |

### `RotulosDaListaDeConversas`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `regiao`, `abas` | `string` | sim | O nome da região e o do grupo de abas. |
| `vazio` | `string` | sim | O que aparece quando a aba está sem conversa. |
| `naoLidas` | `(n) => string` | sim | Nome do contador. "3 não lidas". |

## Variantes

| Variante | Quando usar |
|----------|-------------|
| com conversas | O padrão: as linhas da aba, uma aberta em `accent`. |
| vazia | A aba sem conversa: a frase `vazio`, sem ilustração. |
| abaixo de 768px | A coluna ocupa a tela, sem traço nem raio; a tela mostra a lista OU a conversa. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `bg-muted na linha` | banco | L2 |
| focus | `outline 2px por dentro (focoInterno) na linha` | banco | D6 · D19 |
| aberta | `bg-accent + nome em primary + aria-current` | humano | — |
| não lidas | `contador primary de 16px e prévia em foreground` | humano | — |
| vazia | `texto vazio em muted-foreground` | humano | — |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher. Não há seleção em massa nem arrastar: a
linha abre a conversa e só.

## Tokens consumidos

`card` · `border` · `accent` · `muted` · `primary` · `primary-foreground` ·
`foreground` · `muted-foreground` · `ring` · `divider` · `radius/md` ·
`radius/full` · `text/label-lg` · `text/caption` · `text/body-sm` ·
`text/label-sm` — mais os do [Tabs](Tabs.md).

## Composição

Usa: [Tabs](Tabs.md) nas abas de situação · [Avatar](Avatar.md) `sm` na linha ·
[EstadoVazio](EstadoVazio.md) `sm` no vazio de uma aba (ADR-077) ·
`focoInterno` e `rolagemDiscreta` de `lib/estados.ts`.
Usado por: a tela de Atendimento (`/prototipo?tela=atendimento`), com o
[IconeDeMarca](IconeDeMarca.md) do canal em cada linha.

## Exemplo de uso

```tsx
const [aba, setAba] = useState("aberta");
const [abertaId, setAbertaId] = useState<string | null>(null);

<ListaDeConversas
  abas={[
    { valor: "aberta", rotulo: "Abertas", contagem: contagem.aberta },
    { valor: "pendente", rotulo: "Pendentes", contagem: contagem.pendente },
    { valor: "finalizada", rotulo: "Finalizadas", contagem: contagem.finalizada },
  ]}
  aba={aba}
  aoMudarAba={setAba}
  itens={conversas
    .filter((c) => c.situacao === aba)
    .map((c) => ({
      id: c.id,
      nome: c.nome,
      canal: <IconeDeMarca marca="whatsapp" tamanho={14} rotulo="WhatsApp" />,
      previa: c.ultimaMensagem,
      hora: c.hora,
      naoLidas: c.naoLidas,
    }))}
  abertaId={abertaId}
  aoAbrir={setAbertaId}
  rotulos={{ naoLidas: (n) => `${n} não lidas` }}
  className="w-full md:w-[320px]"
/>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Estrutura | `<section>` nomeada (`regiao`); abas em `role="tablist"` (Tabs); as conversas numa `<ul>` com um botão por linha |
| Aberta | `aria-current="true"` na linha da conversa aberta |
| Não lidas | O contador tem nome (`naoLidas(n)`); o ícone do canal leva o nome do canal quando aparece sem texto |
| Teclado | Tab entra na aba atual e, depois, em cada linha; setas trocam de aba; Enter e Espaço abrem a conversa |
| Foco visível | Outline de 2px por dentro da linha (`focoInterno`): as linhas são coladas e o contorno de fora pisaria na vizinha |
| Texto longo | Nome e prévia truncam com `title`; a hora e o contador não encolhem |
| Vazia | A frase fica no lugar da lista, lida como texto comum |
| Idioma | Nada escrito à mão: `rotulos`, com `ROTULOS_DA_LISTA_DE_CONVERSAS` como fábrica |

## Divergências abertas (para o gate)

Sem par no arquivo: desenhar a lista no Figma a partir do código, na
remedição.
