# Componente: Tabs

## Responsabilidade

Alternar entre as seções de um mesmo registro.

## Família

`navegacao` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `535:21` (set "Tab", 4 variantes: State × theme) · Lote: `2` ·
Última verificação: `diff 3,79%` (Selected claro) e `3,59%` (Default claro) —
**acima do limite de 1%**, todo na linha do rótulo (ver divergência 6).
Medido no render, nos dois temas: altura 34, rótulo em (4,8), vão 8, traço de
2px em y 32; cores `primary` e `muted-foreground` iguais às do arquivo.

O arquivo desenha **uma aba**, não a fileira. Tema não virou prop: é token.

**Estava no escopo negativo do roadmap** ("Tabs como navegação", anti-referência
nº 11: abas crescem e viram duas linhas). Entrou por decisão do humano em
2026-09-15, com a resposta à anti-referência embutida: a fileira nunca quebra
linha, rola na horizontal.

## Props

`Tabs` — a fileira.

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `itens` | `ItemTab[]` | — | sim | `valor`, `rotulo` e `disabled` opcional. |
| `atual` | `string` | — | sim | O `valor` da aba selecionada. |
| `aoEscolher` | `(valor: string) => void` | — | sim | Chamado no clique e nas setas. |
| `rotulo` | `string` | — | sim | Nome da fileira para leitor de tela. |
| `id` | `string` | — | sim | Base dos ids que ligam aba e painel. |

`TabPanel` — o conteúdo de uma aba. Recebe o mesmo `id`, o `valor` dela e o
`atual`; só renderiza quando é a atual.

## Variantes

Não tem. Os dois estados do arquivo (Default e Selected) são estado, não variante.

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| selecionada | `text-primary + traço bg-primary h-0.5 + aria-selected` | figma | State=Selected (535:20) |
| hover | `text-foreground (sem traço)` | inferido | L2 |
| focus | `ring-2 ring-inset ring-ring (D19: a fileira rola e cortaria o offset)` | declarado | D6 |
| disabled | `opacity-50 pointer-events-none, pulada pelas setas` | banco | I5 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`primary` · `muted-foreground` · `foreground` · `ring` · `radius/sm` ·
`space/component/gap-sm` · `space/component/gap-md` · `text/label-lg`

## Composição

Usa: — · Usado por: —

## Exemplo de uso

```tsx
<Tabs id="lead" rotulo="Seções do lead" itens={secoes} atual={secao} aoEscolher={setSecao} />

<TabPanel id="lead" valor="historico" atual={secao}>…</TabPanel>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | `role="tablist"` com `aria-label`; abas `role="tab"` com `aria-selected` e `aria-controls`; painel `role="tabpanel"` com `aria-labelledby` |
| Teclado | Tab entra só na selecionada; setas movem e selecionam; Home e End vão às pontas; desabilitada é pulada. O Tab seguinte vai ao painel, que é focável |
| Foco visível | Anel **por dentro** (`ring-inset`), não o `outline` com folga da D6: a fileira rola e cortaria o contorno de fora |
| Cor não é o único sinal | Selecionada tem cor **e** traço de 2px |
| Texto longo | Rótulo não trunca nem quebra; a aba cresce e a fileira rola |
| Alvo de toque | 34px de altura — **abaixo dos 44 da regra I15** |
| Movimento | Só troca de cor (`transition-colors`) |

## Divergências abertas (para o gate)

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-168, AUD-169, AUD-170, AUD-171, AUD-172, AUD-173 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
