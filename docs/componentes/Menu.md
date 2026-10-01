# Componente: Menu

## Responsabilidade

A lista de ações e opções que abre de um botão: o menu da coluna e o botão
Colunas da [Table](DataTable.md), o "personalizar cartão" do pipeline, o menu
do usuário. Saiu da Table em 2026-09-23 para ser peça.

## Quando usar

- **Use** para ações sobre um item, uma linha ou uma coluna, aberto por um Button: o ⋮ da linha, "Mover para etapa", respostas rápidas.
- **Use** `tipo: "check"` para ligar e desligar várias coisas sem fechar; `tipo: "radio"` para escolher um modo (Agrupar por).
- **Não use** para escolher o valor de um campo: é `Select`.
- **Não use** para navegação principal: é a `Sidebar`.
- **Não use** com mais de ~10 itens ou com busca: é `Combobox`.

## Família

`overlay` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

O painel parte do Select Menu do arquivo (`544:122`): superfície `overlay/bg`,
traço `overlay/border`, `elevation/lg`, item com realce. Item com check e
separador não estão desenhados (AUD-203, lote `figma`).

## Props

### `Menu`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `aberto` | `boolean` | sim | Quem guarda é a tela. |
| `aoFechar` | `(devolverFoco?: boolean) => void` | sim | `devolverFoco` vem falso quando quem fechou foi um clique fora ou o Tab. |
| `gatilho` | `RefObject<HTMLElement>` | sim | O botão que abriu: dá a posição e recebe o foco de volta. |
| `rotulo` | `string` | sim | Nome do menu para leitor de tela. |
| `itens` | `ItemDoMenu[]` | sim | `id`, `rotulo`, `icone?`, `tipo` (`acao` fecha; `check` alterna e mantém aberto; `radio` escolhe um e fecha), `marcado?`, `desabilitado?`, `separadorAntes?`, `aoAtivar`. |

O gatilho leva `aria-haspopup="menu"` e `aria-expanded`; o painel tem 240px,
abre abaixo do gatilho em portal fixo e vira para cima quando não cabe.

## Variantes

| Item | Quando usar |
|------|-------------|
| `tipo="acao"` | Faz e fecha: ordenar, mover, restaurar. |
| `tipo="check"` | Liga e desliga sem fechar: colunas visíveis, campos do cartão. |
| `tipo="radio"` | Um entre vários, e fecha: agrupar por. Bolinha `primary` no marcado. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `bg-overlay-item-hover no item` | banco | L2 |
| focus | `o mesmo realce do hover, por aria-activedescendant` | banco | — |
| marcado | `caixa 16px primary com Check 12` | humano | — |
| desabilitado | `subtle-foreground + cursor not-allowed, fora do teclado` | banco | I5 |
| abrindo | `fade-in-fast; sai com fade-out` | humano | L10 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`overlay/bg` · `overlay/border` · `overlay/item-hover` · `elevation/lg` ·
`z/popover` · `primary` · `primary-foreground` · `input/border` · `card` ·
`foreground` · `muted-foreground` · `subtle-foreground` · `radius/lg` ·
`radius/sm` · `text/label-lg` · `duration/fast` · `duration/base`

## Composição

Usa: `PainelFlutuante` do [Popover](Popover.md) · `useCliqueFora` e `useSaida` (lib).
Usado por: [Table](DataTable.md) (menu da coluna, botões Colunas e Agrupar, ações da barra de seleção) · tela de leads (`/exemplos/pipeline`, personalizar cartão)

## Exemplo de uso

```tsx
const [aberto, setAberto] = useState(false);
const gatilho = useRef(null as HTMLButtonElement | null);

<>
  <Button ref={gatilho} variant="tertiary" size="sm" aria-haspopup="menu" aria-expanded={aberto} onClick={() => setAberto((v) => !v)}>
    Personalizar cartão
  </Button>
  <Menu
    aberto={aberto}
    gatilho={gatilho}
    rotulo="Personalizar cartão"
    itens={campos.map((c) => ({ id: c.id, rotulo: c.rotulo, tipo: "check", marcado: c.visivel, aoAtivar: () => alternar(c.id) }))}
    aoFechar={(devolver = true) => {
      setAberto(false);
      if (devolver) gatilho.current?.focus();
    }}
  />
</>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | `role="menu"` com `menuitem` e `menuitemcheckbox` (`aria-checked`); o gatilho diz `aria-haspopup="menu"` e `aria-expanded` |
| Teclado | Foco no painel e `aria-activedescendant` andando: setas, Home, End; Enter e Espaço ativam; Escape fecha e devolve o foco; Tab fecha |
| Clique fora | Fecha sem devolver o foco (`pointerdown` em captura) |
| Rolagem | Fecha: o painel é `fixed` e não acompanharia o gatilho |
| Movimento | Fade de entrada e saída; com `prefers-reduced-motion` não há (I12) |
