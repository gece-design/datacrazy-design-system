# Componente: Button

## Responsabilidade

Ação do usuário: sete variantes de peso visual e quatro tamanhos, com o mesmo
foco, o mesmo disabled e a mesma fonte em todas.

## Quando usar

- **Use** `primary` para a única ação principal da tela ou do modal; `secondary` ou `outline` para a de apoio; `tertiary` nas barras (Header, tabela); `ghost` para ação discreta; `soft` para destaque secundário; `destructive` só para apagar sem volta.
- **Use** `size="icon"` com `aria-label` quando for só ícone; o X de fechar é `BotaoFechar`.
- **Não use** dois `primary` na mesma fileira.
- **Não use** para trocar de visualização (`ViewSwitcher`), escolher uma opção (`SegmentedControl`) ou ligar e desligar (`Switch`).
- **Não use** `<button>` cru: se o caso não cabe em variante nenhuma, use a constante `foco` de `lib/estados`.

## Família

`acao` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `269:32` (redesenho de 2026-09-14: texto 12px, gap 6, sombra interna,
"Secondary" azul-claro e "Ghost" com traço) · Lote: `0` (escrito em
2026-09-01, antes do registro existir) · O código segue **13px e gap 8** do
desenho original: divergência aberta (pendência 6 de
[../02-design-system.md](../02-design-system.md)). As variantes do redesenho
entraram com nome próprio (`soft`, `outline`, `tertiary`) para não mudar o que
`secondary` e `ghost` já significavam nas telas prontas. Diff de pixels: 5,18%
nas ações do Header (2026-09-15), o excesso é este.

## Props

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `variant` | `"primary" \| "secondary" \| "ghost" \| "destructive" \| "soft" \| "outline" \| "tertiary"` | `"primary"` | não | Ver Variantes. |
| `size` | `"sm" \| "md" \| "lg" \| "icon-xs" \| "icon-sm" \| "icon" \| "icon-lg"` | `"md"` | não | 28 · 32 · 36px de altura. Os `icon-*` são quadrados só de ícone (24 · 28 · 32 · 36) e **exigem `aria-label`**. Dentro do `Header`, `md` e `icon` medem 28 sozinhos (ADR-057): não troque o `size` para encolher. |
| `asChild` | `boolean` | `false` | não | Renderiza o filho (`Slot` do Radix) com as classes do botão — para `Link`. |
| demais | `ButtonHTMLAttributes` | — | não | `type`, `disabled`, `onClick`… vão para o `<button>`. |

`buttonVariants` é exportado para quem precisa das classes sem o elemento.

### `BotaoFechar`

O X de fechar de Modal, Toast e painéis: Button `ghost` quadrado com o glifo `X` do Phosphor. Hover no token de "item sob o cursor" do overlay (D22).

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `rotulo` | `string` | — | sim | Nome para leitor de tela e `title`. Ex.: "Fechar". |
| `size` | `"icon-xs" \| "icon-sm" \| "icon"` | `"icon-sm"` | não | 24 (Toast, glifo 14), 28 (Modal) ou 32. |
| demais | `ButtonHTMLAttributes` | — | não | `onClick`, `className`… |

## Variantes

| Variante | Quando usar | Superfície |
|----------|-------------|------------|
| `primary` | A ação principal da tela, uma por vez | `primary` + `primary-foreground`, plano (ADR-037) |
| `secondary` | Ação de apoio com traço | `card` + `border`, hover `accent` |
| `ghost` | Ação discreta, sem caixa | texto `muted-foreground`, hover `accent` |
| `destructive` | Apagar, cancelar sem volta (Modal) | `destructive`, hover `destructive-hover`, plano (ADR-037) |
| `soft` | "Secondary" do redesenho: azul-claro | `button-soft-*` (par escuro próprio, ADR-015) |
| `outline` | "Ghost" do redesenho: só o traço | traço `background`, texto `surface-inverse` |
| `tertiary` | Barra de ferramentas (Pesquisar, Filtros no Header, gatilho do Date Picker) | A superfície oposta à de onde está: `card` sobre o fundo da aplicação, `background` dentro do painel da tela (`data-superficie`, a TelaBase — ADR-055). `muted-foreground`, sombra interna, hover `accent` Texto e ícone em `foreground`; hover branco a 50% (`hoverDeApoio`) — ADR-067. |

Ícone dentro do botão: 16px, `weight="regular"`, `gap-2` (regra A8).

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `primary→primary-hover · destructive→destructive-hover · soft→button-soft-hover · secondary/ghost→bg-accent · tertiary→branco a 50% (hoverDeApoio) · outline→bg-background` | banco | L3 |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | D6 |
| disabled | `opacity-50 pointer-events-none` | banco | I5 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. `active` ausente
por decisão (interactions.md L5).

## Tokens consumidos

`primary` · `primary-foreground` · `primary-hover` · `card` · `border` ·
`foreground` · `muted-foreground` · `accent` · `destructive` ·
`destructive-hover` · `button-soft-bg` · `button-soft-foreground` ·
`button-soft-hover` · `background` · `surface-inverse` · `ring` · `radius/md` ·
`text/button` · `shadow-button-inner` (só `soft` e `tertiary`)

## Composição

Usa: `Slot` do Radix (`asChild`) ·
Usado por: [Header](Header.md) (sino, `tertiary` `icon`), [DatePicker](DatePicker.md)
(gatilho e rodapé), [TimePicker](TimePicker.md), [Modal](Modal.md) e [Drawer](Drawer.md)
pelos exemplos. O X de fechar do [Modal](Modal.md) e do [Toast](Toast.md) é o
`BotaoFechar` daqui (lote B4). O botão do canto do [Drawer](Drawer.md) fica
próprio: é um quadrado de 29px com fundo `card` medido no arquivo.

## Exemplo de uso

```tsx
<Button variant="primary">
  <Plus size={16} weight="regular" />
  {t("novaCampanha")}
</Button>

<Button variant="tertiary" size="icon" aria-label={t("notificacoes")}>
  <Bell size={16} weight="regular" />
</Button>

<Button asChild variant="secondary">
  <Link href="/leads">{t("verLeads")}</Link>
</Button>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Foco visível | Outline de 2px com respiro transparente (D6) — foi aqui que a regra nasceu |
| Botão só de ícone | `size="icon"` exige `aria-label`; sem texto o botão não tem nome |
| Disabled | `opacity-50` + `pointer-events-none`; muda para I5 (eventos mantidos) no lote B3 |
| Contraste | `destructive` usa `primary-foreground`, não branco: branco sobre o `destructive` claro do escuro dá 2,6:1 |
| Alvo de toque | 28–36px, abaixo dos 44 da I15 — adiado para a remedição |

## Divergências abertas (para o gate)

Em [../processo/consistencia.json](../processo/consistencia.json): AUD-089
(13px/gap 8 contra 12px/gap 6 do redesenho), lote `figma`.
