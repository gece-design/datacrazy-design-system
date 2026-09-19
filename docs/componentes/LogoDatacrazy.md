# Componente: LogoDatacrazy

## Responsabilidade

Símbolo e logotipo do DataCrazy (`LogoDataCrazy` no código), em `currentColor` para acompanhar o tema. É a
marca do **produto** — não confundir com `components/ds/logo.tsx`, a marca do
site de documentação (Systemcrazy).

## Família

`midia` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `270:7595` (component set `logo sidebar`) · Exportado do arquivo com os
fills trocados por `currentColor`. **Não redesenhar: reexportar de lá.** ·
Lote: `1`.

## Props

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `simbolo` | `boolean` | `false` | não | Só o símbolo de 32×32 — o estado colapsado da sidebar. |
| `className` | `string` | — | não | Posição e cor (`text-*`): quem posiciona escolhe o token. |

`SimboloDataCrazy` (`className`) é o símbolo isolado, `aria-hidden`.

## Variantes

| Variante | Medida |
|----------|--------|
| marca completa | 119×32: símbolo + assinatura de 87×17, separados por 1px — a folga do arquivo, intencional |
| `simbolo` | 32×32 |

## Estados

<!-- kfe:estados:start -->
_Sem estado registrado — o componente não tem estados de interação._
<!-- kfe:estados:end -->

É leitura: nenhum estado. Ausência é decisão.

## Tokens consumidos

Nenhum próprio: `currentColor`. Na sidebar recebe `surface-inverse`.

## Composição

Usa: nenhum componente do DS ·
Usado por: [Sidebar](Sidebar.md) (`SidebarBrand`). O mesmo path aparece
também em `components/ds/logo.tsx` e `components/ui/sidebar.tsx` (AUD-053,
lote B9).

## Exemplo de uso

```tsx
<LogoDataCrazy className="text-surface-inverse" />
<LogoDataCrazy simbolo className="text-surface-inverse" />
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Nome | `role="img"` + `aria-label="DataCrazy"` no `<span>`; os SVGs são `aria-hidden` e `focusable="false"` |
| Tema | `currentColor`: um componente serve os dois temas sem ramificação |

## Divergências abertas (para o gate)

Nenhuma.
