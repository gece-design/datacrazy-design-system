# Componente: EstadoVazio

## Responsabilidade

A tela, ou a área, quando não há nada para mostrar: o que não há, por que, e
a ação que tira do vazio. Duas variações — com ícone (a área inteira vazia) e
sem ícone (o "nada" dentro de uma lista, coluna ou cartão). Quem escreve o
texto é a tela.

## Quando usar

- **Use** com `icone` quando a área inteira da tela está vazia: a conta nova, a busca que não achou, o período sem negócio.
- **Use** sem ícone e com `tamanho="sm"` dentro de uma lista, aba, coluna ou cartão, onde a tela em volta já situa a pessoa.
- **Use** `acao` para o que tira do vazio: criar o primeiro, importar, limpar a busca. `primary` quando é o caminho principal da tela; `tertiary` quando só desfaz um filtro.
- **Não use** enquanto os dados ainda estão chegando: é o `Skeleton`.
- **Não use** para erro (a API falhou): é o `Toast`, ou o erro do campo.
- **Não use** um `<p>` solto com "Nada encontrado": o título precisa dizer o porquê, e a região é `status`.

## Família

`feedback` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Não há: nasceu do pedido do cliente em 2026-10-08 ("variações de telas sem
nada — ícone e nada"), juntando as frases soltas que as telas já tinham
(ADR-077). O arquivo passa a acompanhar o código na remedição (AUD-213,
lote `figma`).

## Props

### `EstadoVazio`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `icone` | `Icon` (Phosphor) | não | Com ele, a área inteira está vazia: disco de 48 em `muted`. Sem ele, é o "nada" de dentro. |
| `titulo` | `string` | sim | O que não há, em uma linha: "Nenhum lead ainda". |
| `descricao` | `string` | não | Por que está vazio, ou o que fazer. Até 40 caracteres por linha. |
| `acao` | `ReactNode` | não | O que tira do vazio: um `Button`. |
| `tamanho` | `"md" \| "sm"` | não | `md` (padrão) para a área da tela; `sm` dentro de coluna, lista ou cartão. |
| `className` | `string` | não | `flex-1` para ocupar a área do bloco que está vazio. |

Aceita o resto de `HTMLAttributes<HTMLDivElement>`.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| com ícone | A área inteira vazia: a tabela de leads, a coluna da conversa, a grade de agentes. |
| sem ícone ("nada") | Dentro de um bloco: a aba da lista de conversas, a tabela de bases, o cartão do gráfico. |
| `sm` | O tamanho de dentro: disco de 32, o título vira a frase apagada em `body-md`. |

## Estados

<!-- kfe:estados:start -->
_Sem estado registrado — o componente não tem estados de interação._
<!-- kfe:estados:end -->

Não há estado interativo: a peça é estática. O único estado é o anúncio —
`role="status"` faz o leitor de tela ouvir o título quando a área passa a
estar vazia (a busca que deixou de achar).

## Tokens consumidos

`muted` · `muted-foreground` · `foreground` · `radius/full` · `text/h4` ·
`text/body-md` · `text/body-sm`

## Composição

Usa: Phosphor (o ícone que a tela passa) · [Button](Button.md) na `acao` (a
tela passa).
Usado por: [ListaDeConversas](ListaDeConversas.md) (o vazio de uma aba) · as
telas do protótipo (`vazio` em cada uma: Início, Pipeline, Leads,
Atendimento, Automações, Agentes).

## Exemplo de uso

```tsx
{leads.length === 0 ? (
  <EstadoVazio
    icone={UsersThree}
    titulo="Nenhum lead ainda"
    descricao="Os leads que chegam pelos canais conectados aparecem aqui. Crie o primeiro ou importe uma planilha."
    acao={
      <Button onClick={abrirNovoLead}>
        <Plus size={16} weight="regular" />
        Novo lead
      </Button>
    }
  />
) : visiveis.length === 0 ? (
  <EstadoVazio icone={MagnifyingGlass} titulo="Nenhum lead com essa busca" descricao="Confira a grafia ou tire um filtro." acao={<Button variant="tertiary" onClick={limpar}>Limpar busca</Button>} />
) : null}

// dentro de um bloco
<EstadoVazio tamanho="sm" titulo="Nenhuma base de conhecimento ainda." />
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | `role="status"`: a mudança para vazio é anunciada sem roubar o foco |
| Ícone | Decorativo (`aria-hidden`): o título já diz o que não há |
| Texto | Nada escrito à mão: título, descrição e ação vêm da tela, no idioma de quem lê |
| Ação | Um `Button` comum: foco, teclado e nome dele |

## Divergências abertas (para o gate)

AUD-213 (`adiado`, lote `figma`): sem par no arquivo. Desenhar as duas
variações no Figma a partir do código, na remedição.
