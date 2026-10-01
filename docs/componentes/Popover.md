# Componente: Popover

## Responsabilidade

A casca de todo painel flutuante do DS — lista do Select, calendário, hora,
seletor de tags, lista de notificações: camada, superfície, traço e sombra
em um lugar só. O papel, o foco e o teclado são de quem usa.

## Quando usar

- **Use** `PainelFlutuante` como casca de um painel ancorado que você está construindo: lista, calendário, seletor.
- **Não use** direto numa tela para menu de ações (`Menu`) ou escolha de valor (`Select`): eles já trazem casca, foco e teclado.
- **Não use** para conteúdo que exige decisão: é `Modal`.
- **Não use** com `card`, `border` ou sombra própria: a superfície flutuante é `overlay-*`.

## Família

`overlay` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Não tem desenho próprio: é a derivação do Select aberto (2026-09-04) que os
outros painéis copiavam, agora extraída (lote B5 da auditoria de
consistência). O Select Menu do arquivo (`544:81`) ainda não foi
reconciliado — está no backlog, lote `figma`.

## Props

`PainelFlutuante`

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `acima` | `boolean` | `false` | não | Abre para cima do gatilho. Vem de `usePosicao`. |
| `aDireita` | `boolean` | `false` | não | Alinha pela borda direita do gatilho. Vem de `usePosicao`. |
| `fixo` | `boolean` | `false` | não | `fixed` em portal com coordenadas em `style` (seletor de tags, que vive numa coluna que rola). Ignora `acima`/`aDireita`. |
| `saindo` | `boolean` | `false` | não | Fechando: `fade-out`, sem clique, `aria-hidden`. Vem de `useSaida(aberto)`. |
| demais | `HTMLAttributes<HTMLDivElement>` | — | não | `role`, `aria-label`, `onKeyDown`, `className`… |

Hooks que andam com ele, em `lib/`:

| Hook | O que faz |
|------|-----------|
| `usePosicao(aberto)` | Mede o lado: `{ gatilho, painel, acima, aDireita }`. Remede em resize e rolagem (E3: com zoom o viewport encolhe). |
| `useCliqueFora(ativo, [refs], aoClicarFora)` | `pointerdown` em captura fora das caixas fecha. |

## Variantes

| Variante | Quando |
|----------|--------|
| absoluto (padrão) | Painel ancorado no gatilho, dentro do mesmo contêiner `relative` |
| `fixo` | Portal no `body`, coordenadas medidas — quando o contêiner corta ou rola |

## Estados

<!-- kfe:estados:start -->
_Sem estado registrado — o componente não tem estados de interação._
<!-- kfe:estados:end -->

O painel não tem estado próprio: abre e fecha por quem o usa. Entra em
`fade-in-fast` e, com `saindo`, sai em `fade-out` sem clique e escondido do
leitor de tela — quem usa mantém o painel montado com `useSaida` (lote B7,
precedente Modal/Tooltip).

## Tokens consumidos

`overlay-bg` · `overlay-border` · `shadow-lg` · `z-index/popover` · `radius/lg`

## Composição

Usa: nenhum componente do DS — é primitivo ·
Usado por: [Select](Select.md), [TimePicker](TimePicker.md) (hora e data-hora),
[DatePicker](DatePicker.md), [Tag](Tag.md) (seletor). A lista de notificações
da página do Header ainda é markup próprio (lote B8).

## Exemplo de uso

```tsx
const { gatilho, painel, acima, aDireita } = usePosicao(aberto);
useCliqueFora(aberto, [painel, gatilho], () => setAberto(false));

<div className="relative">
  <Button ref={gatilho} variant="tertiary" onClick={() => setAberto((a) => !a)} aria-expanded={aberto}>
    {t("filtros")}
  </Button>
  {aberto ? (
    <PainelFlutuante ref={painel} role="dialog" aria-label={t("filtros")} acima={acima} aDireita={aDireita} className="w-72 p-3">
      {children}
    </PainelFlutuante>
  ) : null}
</div>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | Quem usa passa `role="listbox"` (Select) ou `role="dialog"` (calendário, hora, tags) e o nome |
| Foco | Quem usa leva o foco para dentro ao abrir e devolve ao gatilho ao fechar; Escape fecha só o painel (não a camada de trás) |
| Cabe na tela | `usePosicao` vira o painel para cima ou para a direita quando não cabe — inclusive com zoom |
| Clique fora | `useCliqueFora` fecha sem devolver o foco (a pessoa clicou em outro lugar) |

## Divergências abertas (para o gate)

Nenhuma própria. O Select Menu do arquivo (`544:81`) segue no backlog.
