---
name: datacrazy-frontend
description: Regras operacionais para gerar código do DataCrazy — CRM existente em Next.js + Tailwind + Radix + next-intl, recebendo um design system retroativo (cenário C, ciclo new-ds). Use SEMPRE que for escrever, revisar ou refatorar qualquer código deste projeto.
---

# DataCrazy — skill do projeto (v3)

O DataCrazy é um **CRM em produção**. Ciclo atual: `new-ds` em **cenário C** —
a entrega é um **design system retroativo**, não telas e não fundação nova.
Estado vivo: `docs/processo/kfe-state.md`. Esta skill é operacional: regras, não prosa.

## Antes de abrir qualquer doc

A `docs/` segue a arquitetura do kit v3.2: **abra o arquivo que o roteador
manda, não a pasta**. Roteador: `docs/README.md`. Contrato (donos, seções,
regras): `.claude/skills/kill-front-end/doc-architecture.md`.

- Raiz do `docs/` = verdade do **produto**. `docs/processo/` = maquinário do
  KFE (estado, medição, plano, evidência). Nunca escreva um no lugar do outro.
- **Um fato, um dono.** Token → `docs/02-design-system.md`. Rota do site →
  `components/ds/nav.ts`. Estado de componente → `docs/processo/components-registry.json`.
  Achou o mesmo fato em dois lugares: um é cópia velha.
- `docs/objetos/` e `docs/features/` estão **vazios de propósito** — este
  ciclo não tem domínio nem fluxo. Não preencha por completude.
- Arquivo novo em `docs/` só nas pastas que já existem, e sempre pelo template
  do kit. Depois: `node .kfe-kit/scripts/kfe-docs.mjs index && node .kfe-kit/scripts/kfe-docs.mjs audit`.

## Stack (RETRATO do que existe — não é escolha minha)

**Next.js** · React · TypeScript · **Tailwind** + variáveis CSS em HSL no
`globals.css` + `tailwind.config.ts` (estilo shadcn/ui) · **Radix UI** ·
**next-intl** (`en`, `es`, `pt-br`) · fonte: **Inter** hoje no código, **Geist** no Figma (migração pendente) ·
dados por **`fetch` nativo com hook próprio do time**.

Evidência secundária (PDF de 18/08/2026) — nada verificado no repo por esta
sessão. Detalhes e o que falta confirmar: `docs/01-arquitetura.md`.

- `@tanstack/react-query` está nas dependências mas **não é o padrão real**.
  Não adotar.
- Escrevo código novo no idioma da casa: se o repo já tem convenção, ela vence
  a minha preferência.

## Lista negativa (rejeite na hora)

- CSS-in-JS (`styled-components` e similares)
- Redux e derivados — estado em hooks/contexts
- CSS solto fora do padrão de tokens/Tailwind
- Valor de estilo mágico: hex, px, sombra ou fonte fora dos tokens
- Lib fora da base sem desvio aprovado e registrado
- Ícone/imagem redesenhado à mão — assets saem exportados do Figma
- Componente que duplica outro já existente no showcase
- Componente do DS que conhece domínio (`<LeadCard>`, `<PipelineTable>`)

### Específicas do DataCrazy — cada uma nasce de bug real

- **Truncar texto sem tooltip** — #83283, #83274, #59567
- **`z-index` cru** — use a escala de camadas do DS — #86338, #86178
- **Dimensão que só fecha em zoom 100%** — #83285, #80170, #79852, #53179
- **Variável de tema com valor idêntico em `:root` e `.dark`** — #80174
- **Texto hardcoded na UI** — multi-idioma é requisito; tudo via `next-intl`
- **Migração big-bang** — o DS cobre as telas-alvo do lote, nunca o CRM inteiro

## Regras de geração (herdadas da calibração global)

| # | No Figma | No código |
|---|---|---|
| G1 | line-height em px | `leading-[Npx]` — nunca `leading-*` nomeado |
| G2 | letter-spacing em % | `tracking-[N em]` (% ÷ 100) — nunca `tracking-wide` |
| G3 | Fill / Hug | Fill → `w-full` ou `flex-1` conforme o eixo · Hug → `w-fit` |
| G4 | Sombra multi-camada | `shadow-[...]` com TODAS as camadas |
| G5 | Cor com alpha | `token/NN` (ex.: `bg-surface/40`) — nunca `rgba()` |
| G6 | Gap de auto-layout | `gap-*` no container — nunca margin nos filhos |
| G7 | Hover | sob `hoverOnlyWhenSupported`; equivalente touch decidido na spec |

Regra viva: divergência corrigida 2x vira linha em `docs/processo/calibration.md`.

## Tokens

- O conjunto canônico **deste repo** está em `docs/02-design-system.md`,
  espelhado do Figma e aplicado em `app/globals.css` + `tailwind.config.ts`.
  **Não invente nome de token** — nem os "óbvios". Não está na tabela: não
  existe, e a resposta é perguntar, não criar.
- O conjunto do **CRM** (repo `datacrazy-front-end`) continua não minerado —
  depende do bloqueio B1. Não presuma que os dois são iguais.
- Token de cor **nunca** carrega nome de cor. `--red` no código e `Branco`,
  `Gelo`, `Neve` no Figma são os contraexemplos — só se renomeiam com plano
  de migração.
- Tipografia: use os tokens `text/*` do Figma (`docs/02-design-system.md`), família
  **Geist**. Line-height está em px → `leading-[Npx]` (G1); tracking em px →
  converter para `em` dividindo pelo tamanho (G2).
- Toda variável de tema precisa **mudar de valor** entre `:root` e `.dark`,
  salvo intenção declarada — rode `npm run check:temas` (regra D8). Desde
  2026-09-04 passa verde: os 8 tokens de estado ganharam par escuro no Figma.
  No CRM eram 13 de ~30: bug #80174.
- Valor de token vem do Figma via MCP. Sem o dado → pergunte. Jamais estime.
- Nomes: `docs/glossario.md`.

## Padrão de componente

Um componente do DS: tipado, sem estado de domínio, variantes vindas do Figma,
todos os estados cobertos, acessível por Radix.

```tsx
// components/ui/button.tsx — PADRÃO ilustrativo.
// Tokens e variantes reais vêm da mineração + do Figma; não copie os valores.
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // base: estados sempre explícitos, foco sempre visível
  'inline-flex items-center justify-center whitespace-nowrap transition-colors \
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent \
   disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-on-accent hover:bg-accent-hover',
        ghost: 'text-text hover:bg-surface-hover',
      },
      size: {
        // G1: line-height em px vem exato do Figma
        md: 'h-10 px-4 text-sm leading-[20px] rounded-md',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
```

O que esse exemplo ensina: token semântico em vez de cor · `focus-visible`
sempre · `disabled` tratado · variantes fechadas por `cva` · `cn` para
composição · zero conhecimento de domínio.

## Convenções fixadas pela auditoria de consistência (2026-09-19)

Backlog e regras: `docs/processo/consistencia.md` · `interactions.md` (L1–L14) ·
`calibration.md` (D19–D24) · `adr.md` (ADR-001…024).

- **Foco e disabled** vêm de `lib/estados.ts`: `foco` (outline 2px, D6), `focoAnel`
  (contêiner que rola, D19), `focoInterno`, `focoPeer`, `focoDentro`, `desabilitado`
  (I5: opacidade por token + cursor, eventos mantidos; hover sob `enabled:`),
  `desabilitadoLink`. Nunca escreva o anel à mão; `<button>` sem `foco` reprova.
- **Campo** vem de `lib/campo.ts`: `caixaDeCampo`, `blocoDeCampo`, `rotuloDeCampo`,
  `caixaNoCartao`, `erroDeCampo`. Helper de classe mora em `lib/`, nunca exportado
  de componente (D21: o registry deriva dependências dos imports).
- **Movimento** vem de `lib/movimento.ts` (`DURACAO` fast 150 · base 200 · slow 280,
  `CURVA`, `PERMANENCIA`, `reduzido()`): `duration-*`, `ease-*`, `animate-*` — nunca
  `duration-200` nem `setTimeout(…, 200)`. Redução é global no `globals.css`.
  Saída animada: `useSaida` (lib/use-saida.ts), estado derivado no render (D23).
- **Camada e painel**: `useCamada` (foco preso, Escape, pilha), `Scrim` do Modal,
  `PainelFlutuante` do Popover (`overlay-*` + `shadow-lg`, D22) com `usePosicao` e
  `useCliqueFora`. Botão de ícone: `Button size="icon-xs|icon-sm|icon|icon-lg"`;
  X de fechar: `BotaoFechar`. Ação de 16px em campo/célula: `AcaoCampo`.
- **Caixa de preview**: nunca `bg-*` no `className` da `Secao` — a cor é do seletor
  de amostras e a classe venceria (check `fundo-da-caixa`). Fundo inicial: `fundo=`.
  Conteúdo que cobre a caixa inteira: `semSeletorDeFundo`.
- **Tabela com comportamentos**: `useAjustesDaTabela(colunas, { memoria })` → `DataTable ajustes=` +
  `BotaoColunas` na barra; a tabela só emite a ordenação, a tela ordena os dados
  (`ordenarPor`); cada célula leva `coluna="chave"`; linha com `aoSelecionar` (ADR-025/026).
  Grupos: `agrupavel` na coluna, `SelectAgrupar`, `agruparPor` + `DataTableGrupo` na tela.
- **Tela nova**: `TelaBase` (navegacao, cabecalho = props do Header, subcabecalho, children;
  breakpoints e memória da sidebar por dentro). Nunca monte Sidebar + Header à mão numa tela;
  o bloco `@datacrazy/tela` publica `/exemplos/tela-base` como página pronta.
- **Calendário**: `Calendario` (eventos `{ id, data, rotulo }`, `referencia` e `visao` são estado da
  tela, `locale` do next-intl). Contas de data em `lib/datas.ts` — nunca copiar do DatePicker.
- **Antes de commitar**: `npm run check` (rápido) — e `npm run check:completo` com o
  site no ar antes de fechar um lote (páginas, exemplos compilando, regressão a 0%).
  Mudança visual só entra declarada no gate (D24). Os checks têm catraca em
  `scripts/baseline/`: `--estrito` mostra tudo, `--atualizar-base` abaixa a base.

## Definição de pronto (todo componente)

1. `npm run check` · `tsc --noEmit` · `build` verdes (o repo não tem lint: decisão em `kfe-retro.md`)
2. Todos os estados: default, hover, focus-visible, active, disabled (+
   loading/empty/error quando aplicável)
3. Funciona em claro **e** escuro sem ramificação de código, e nenhuma
   variável usada repete valor entre os temas sem intenção declarada
4. Aguenta string longa (`es`/`pt-br` são ~20–30% maiores que `en`) sem
   truncar mudo — truncou, tem tooltip
5. Responde a viewport **e** a zoom acima de 100%
6. Diff de pixels ≤ 1% contra o Figma e geometria sem divergência
7. Presente no showcase, em todas as variantes
8. Foco visível, navegação por teclado e contraste AA

## Referências (leia antes de decidir)

| Assunto | Caminho |
|---|---|
| **Por onde começar** | `docs/README.md` (roteador) |
| Estado do ciclo | `docs/processo/kfe-state.md` |
| Stack e lista negativa | `docs/01-arquitetura.md` |
| Brief do DS e não-escopo | `docs/00-visao-geral.md` |
| Auditoria (parcial) e bloqueios | `docs/processo/audit.md` |
| Links: Figma, FigJam, referências | `docs/processo/referencias.md` |
| Tokens, tipografia, direção visual | `docs/02-design-system.md` |
| Ordem de construção e escopo negativo | `docs/processo/roadmap-componentes.md` |
| Direção visual e anti-referências | `docs/processo/ux-direcao-visual.md` |
| Regras de uso do DS | `docs/regras.md` |
| Nomes canônicos | `docs/glossario.md` |
| Calibração de fidelidade | `docs/processo/calibration.md` (criada na etapa 3) |
| Checklist do Figma | `docs/processo/figma-checklist.md` (criada na etapa 4) |
| Estados de interação (exceção E-01) | `docs/processo/interactions.md` |
| Padrão de página do showcase | `docs/04-navegacao.md` |
| Protocolos do kit | `.claude/skills/kill-front-end/protocols.md` |
| Arquitetura da doc | `.claude/skills/kill-front-end/doc-architecture.md` |

## Não faça

- Não escreva código de produto antes da ONBOARD concluída (cenário C).
- Não crie tela: telas estão no não-escopo deste ciclo (`docs/00-visao-geral.md` · 5).
- Não preencha valor que o Figma não deu. Bloqueio visível > gambiarra silenciosa.
- Não trate o PDF de 18/08/2026 como verdade sobre o código de hoje: é
  evidência secundária de outra data. Confirme antes de agir sobre ela.
