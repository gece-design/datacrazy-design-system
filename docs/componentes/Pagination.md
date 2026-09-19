# Componente: Pagination

## Responsabilidade

Navegar entre as páginas de uma lista longa.

## Família

`navegacao` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `261:790` (rodapé da Data Table) · Lote: `2`.

Nasceu dentro da tabela e saiu de lá: qualquer lista que não cabe numa tela
pagina, e o roadmap já reservava um slot próprio.

## Props

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `paginas` | `number` | — | sim | Quantas páginas existem. |
| `atual` | `number` | — | sim | Página atual, começando em 1. |
| `onIr` | `(p: number) => void` | — | não | Chamado ao trocar de página. |
| `resumo` | `string` | — | não | Texto à esquerda. Sem ele, os controles vão sozinhos para a direita. |
| `textoAnterior` | `string` | `"Anterior"` | não | Rótulo do botão de voltar. |
| `textoProxima` | `string` | `"Próxima"` | não | Rótulo do botão de avançar. |

Os rótulos são props porque a UI é multi-idioma: texto fixo dentro de
componente some do arquivo de tradução sem ninguém perceber.

## Variantes

Não tem. O que muda é a presença do `resumo`.

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `bg-overlay-item-hover text-foreground` | humano | L2 |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | D6 |
| disabled | `opacity-50 pointer-events-none` | banco | I5 |
| atual | `bg-accent text-primary border-accent + aria-current` | humano | — |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`accent` · `background` · `card` · `primary` · `foreground` ·
`muted-foreground` · `overlay/item-hover` · `ring` · `radius/md` ·
`text/label-lg` · `text/body-md`

## Composição

Usa: `CaretLeft` e `CaretRight` do Phosphor ·
Usado por: [DataTable](DataTable.md)

## Exemplo de uso

```tsx
<Pagination
  resumo="Mostrando 10 de 37 negócios"
  paginas={4}
  atual={pagina}
  onIr={setPagina}
/>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | `<nav aria-label="Paginação">` com botões de verdade |
| Página atual | `aria-current="page"` no número ativo, e `aria-label="Página N"` em todos — "3" sozinho não diz que é uma página |
| Cor não é o único sinal | O ativo tem fundo `accent` **e** texto `primary`; o hover tem o mesmo fundo com texto `foreground`. Dois sinais, como a WCAG pede quando a cor carrega informação |
| Desabilitado | Perde contraste e perde o cursor junto (`pointer-events-none`), para ninguém clicar num alvo que não responde |
| Foco visível | `outline` com offset (regra D6) |
| Alvo de toque | 28px de altura — **abaixo dos 44 da regra I15** |
| Números | `tabular-nums`, para o `1` não estreitar o botão em relação ao `8` |

## Divergências abertas (para o gate)

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-145, AUD-146, AUD-147, AUD-148, AUD-149 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
