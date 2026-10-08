# Componente: Pagination

## Responsabilidade

Os controles de página de uma lista de registros, com o resumo do que está
à vista e, se a tela quiser, o tamanho da página. As regras de quando
aparece e como se comporta estão em [../regras.md](../regras.md) § Paginação
(ADR-079); o estado mora na tela, no `usePaginacao` de `lib/paginacao.ts`.

## Quando usar

- **Use** em toda lista de registros em tabela (leads, negócios na visão de lista, bases, servidores): 20 por página, com `usePaginacao` e a `chave` com busca, filtros e ordenação.
- **Use** no pé do bloco da tabela, fixa (`shrink-0 border-t`), com o resumo "Mostrando 21–40 de 84 leads" e `tamanhos` quando a tela deixa escolher 20, 50 ou 100.
- **Não use** no `Quadro`, na `ListaDeConversas`, na grade de `CartaoDeCatalogo` nem no `Calendario`: cada um tem a própria forma de andar.
- **Não use** rolagem infinita no lugar: esconde o rodapé, tira o "onde estou" e some com a `BarraDeSelecao`.
- **Não use** no topo da lista nem flutuando: uma barra por lista, no pé.

## Família

`navegacao` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node `261:790` (rodapé da Data Table) · Lote: `2` · Última verificação: ver
[processo/kfe-state.md](../processo/kfe-state.md), entrada de 2026-09-04. A
janela com reticências, o tamanho da página e a versão de celular (ADR-079)
não estão no arquivo: AUD-215, lote `figma`.

## Props

### `Pagination`

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `paginas` | `number` | — | sim | Quantas páginas existem. Com uma só, a barra não desenha nada (regra P2). |
| `atual` | `number` | — | sim | Página atual, começando em 1. |
| `onIr` | `(p: number) => void` | — | não | Chamado ao trocar de página. A tela rola a lista de volta ao topo. |
| `resumo` | `string` | — | não | Texto à esquerda, `aria-live`. Sem ele, os controles vão sozinhos para a direita. |
| `tamanhos` | `number[]` | — | não | As opções do menu "N por página" (20, 50, 100). Sem elas, não há o botão. |
| `porPagina` | `number` | — | não | O tamanho atual, no botão. |
| `aoMudarTamanho` | `(n: number) => void` | — | não | Escolhido no menu. |
| `rotulos` | `Partial<RotulosDaPaginacao>` | `ROTULOS_DA_PAGINACAO` | não | `navegacao`, `anterior`, `proxima`, `pagina(n)`, `posicao(atual, total)`, `porPagina(n)`, `tamanho`. |
| `compacta` | `boolean` | `false` | não | A versão de celular em qualquer largura: para um rodapé estreito, como o de um painel lateral. |
| `textoAnterior` | `string` | — | não | Obsoleta: use `rotulos.anterior`. |
| `textoProxima` | `string` | — | não | Obsoleta: use `rotulos.proxima`. |
| `className` | `string` | — | não | Aceita o resto de `HTMLAttributes<HTMLElement>`. |

`janelaDePaginas(total, atual)` devolve os números que aparecem: todos até 7
páginas; acima, a primeira, a última, a atual com uma vizinha de cada lado e
`"…"` onde pulou.

### `usePaginacao(total, opções)` (`lib/paginacao.ts`)

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `porPagina` | `number` | `POR_PAGINA` (20) | O tamanho inicial. |
| `tamanhos` | `number[]` | `TAMANHOS_DE_PAGINA` (20, 50, 100) | O tamanho lembrado só vale se estiver entre estes. |
| `memoria` | `string` | — | Chave da memória do tamanho no navegador (`ds:paginacao:<memoria>`). A página nunca é lembrada. |
| `chave` | `string` | — | O que define a lista (busca, filtros, ordenação): quando muda, volta à primeira. |

Devolve `pagina` (já recuada quando a lista encolheu), `porPagina`,
`totalDePaginas`, `total`, `inicio`, `fim`, `ir`, `mudarTamanho` e
`fatiar(lista)`. `resumoDaPaginacao(paginacao, { um, varios })` escreve
"Mostrando 21–40 de 84 leads" em pt-BR.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| com resumo | O padrão: "Mostrando 21–40 de 84 leads" à esquerda. |
| sem resumo | Um rodapé apertado: só os controles, à direita. |
| com tamanho | `tamanhos` + `porPagina` + `aoMudarTamanho`: o botão "20 por página" com o Menu. |
| muitas páginas | Acima de 7: `1 … 5 6 7 … 12`. Automática. |
| celular | Abaixo de 640px: Anterior · "3 de 5" · Próxima, sem o tamanho. Automática; `compacta` força em qualquer largura. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `bg-overlay-item-hover text-foreground` | humano | L2 |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | D6 |
| disabled | `opacity-50 pointer-events-none` | banco | I5 |
| atual | `bg-accent text-primary border-accent + aria-current` | humano | — |
| muitas páginas | `janela de 7 posições: 1 … 5 6 7 … 12, reticências aria-hidden` | humano | ADR-079 |
| celular | `abaixo de 640px: Anterior · '3 de 5' · Próxima; o tamanho some` | humano | ADR-079 |
| uma página | `não desenha nada: o total está na toolbar` | humano | ADR-079 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`accent` · `background` · `card` · `primary` · `foreground` ·
`muted-foreground` · `overlay/item-hover` · `ring` · `radius/md` ·
`text/label-lg` · `text/body-md`

## Composição

Usa: `CaretLeft`, `CaretRight` e `CaretDown` do Phosphor · [Button](Button.md)
`tertiary` `sm` no tamanho · [Menu](Menu.md) de rádio nas opções ·
`lib/estados.ts` (`foco`, `desabilitado`) · `lib/paginacao.ts` na tela.
Usado por: a tela de Leads (`/prototipo?tela=leads`), a visão de lista do
Pipeline e a página da [DataTable](DataTable.md).

## Exemplo de uso

```tsx
const paginacao = usePaginacao(linhas.length, { memoria: "leads", tamanhos: TAMANHOS_DE_PAGINA, chave: busca });
const daPagina = paginacao.fatiar(linhas);

<Pagination
  className="shrink-0 border-t border-border px-3 py-2.5"
  resumo={resumoDaPaginacao(paginacao, { um: "lead", varios: "leads" })}
  paginas={paginacao.totalDePaginas}
  atual={paginacao.pagina}
  onIr={(p) => { paginacao.ir(p); rolagem.current?.scrollTo({ top: 0 }); }}
  tamanhos={TAMANHOS_DE_PAGINA}
  porPagina={paginacao.porPagina}
  aoMudarTamanho={paginacao.mudarTamanho}
/>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | `<nav aria-label>` (`rotulos.navegacao`) com botões de verdade |
| Página atual | `aria-current="page"` no número ativo, e `rotulos.pagina(n)` em todos — "3" sozinho não diz que é uma página |
| Troca de página | O resumo é `aria-live="polite"`: o leitor de tela ouve "Mostrando 21–40 de 84 leads" |
| Cor não é o único sinal | O ativo tem fundo `accent` **e** texto `primary`; o hover tem o mesmo fundo com texto `foreground` |
| Desabilitado | Anterior e Próxima ficam no lugar nas pontas, com opacidade e cursor de "não dá" |
| Reticências | `aria-hidden`: não são alvo nem leitura |
| Tamanho | Botão com `aria-haspopup="menu"` e nome "Itens por página: 20 por página"; o Menu é de rádio |
| Foco visível | `outline` com offset (regra D6) |
| Alvo de toque | 28px de altura — **abaixo dos 44 da regra I15** |
| Números | `tabular-nums`, para o `1` não estreitar o botão em relação ao `8` |

## Divergências abertas (para o gate)

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-145, AUD-146, AUD-147, AUD-148, AUD-149 — status
`adiado`, lote `figma`. AUD-215 (2026-10-08): janela com reticências, tamanho e
celular sem par no arquivo. Reabrem na remedição contra o arquivo.
