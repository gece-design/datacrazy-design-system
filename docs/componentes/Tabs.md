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
| hover | `text-foreground (sem traço)` | inferido | Select (hover:text-foreground) |
| focus | `ring-2 ring-inset ring-ring` | declarado | I4 |
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

1. **A fileira não está no arquivo.** O vão de 12px entre abas (`gap-md`), a
   ausência de linha de base embaixo da fileira e a rolagem horizontal são
   derivação.
2. **Hover não está desenhado.** O rótulo sobe para `foreground` (E-01), sem traço.
3. **Foco por anel interno** em vez da D6, pelo motivo acima.
4. **Barra de rolagem escondida.** Rola por trackpad, arrasto e teclado; com mouse
   de roda vertical, a pessoa pode não perceber que há mais abas.
5. **Escopo negativo do roadmap.** A linha "Tabs como navegação" em
   `processo/roadmap-componentes.md` continua dizendo que fica fora; a decisão
   do humano de 2026-09-15 está no log do ciclo.
6. **Diff acima de 1% é do texto.** Nenhum pixel diferente fora da linha do
   rótulo. "Histórico" mede 50,1px no navegador contra 51 no arquivo, a mesma
   diferença de métrica da Geist vista no Tooltip; a aba fecha em 58,1 contra 59.
