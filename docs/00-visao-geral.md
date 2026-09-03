# DataCrazy — Brief do Design System (etapa 2 · SRS em modo new-ds) — **v2**

> **v1 → v2:** a v1 tratava o DataCrazy como produto novo e deixava a seção 1
> vazia. O PRD recebido em 2026-09-01 (`Artefato-01 Ponto Zero.pdf`) mostra um
> **CRM em produção** com front-end existente. Reescrito: o DS é retroativo,
> não fundacional.

## 1 · O que é o DataCrazy

**Plataforma de CRM com IA para automação de vendas e atendimento multicanal.**
Posicionamento oficial da própria empresa (datacrazy.io): *"Não somos apenas um
CRM. Somos Datacrazy."*

- **Quem usa:** empresas que vendem e querem aumentar conversão — e-commerces,
  infoprodutores, agências, negócios locais, educação online, consultórios.
- **Para quê:** concentrar num sistema só o que hoje exige várias ferramentas —
  mensageria, automação comercial, inteligência de dados e funil.
- **Módulos:** Crazy IA (intenção de compra, sentimento, comportamento) ·
  Multiatendimento (WhatsApp, Instagram, Facebook) · Automações Inteligentes ·
  BI Interno (funil, LTV, CAC, conversão) · Kanbans Avançados · Integrações e API.
- **Onde vive:** repo `datacrazy-front-end` (branch `develop`), Next.js.
  Existe também aplicativo mobile.

## 2 · Por que existe este design system (o problema, com evidência)

Do PDF, sobre ~2.700 tickets varridos no Gleap, **22 confirmados** como
problema de interface. O diagnóstico é explícito: o problema é
**inconsistência visual entre telas** — não lentidão de desenvolvimento, não
retrabalho de processo.

| Padrão de falha | Evidência |
|---|---|
| Texto truncado sem tooltip | #83283 · #83274 · #59567 |
| Sobreposição por `z-index` | #86338 · #86178 |
| Comportamento muda conforme zoom/viewport | #83285 · #80170 · #79852 · #53179 |
| Dark mode pela metade | #80174 — 13 de ~30 variáveis com valor **idêntico** em `:root` e `.dark` (`--title` = `240 10% 4%` sobre `--background` = `0 0% 7%` ⇒ título quase invisível no escuro) |
| Interface poluída | #34395 — cliente não consegue ver a etapa do funil de tanta informação repetida |
| Erro que passa sensação de instabilidade | #39683 — erro ao criar lead sem nome; sugestão registrada: trocar mensagem por modal |
| Acessibilidade (mobile) | #62306 · #61699 · #85316 · #79729 |

**Áreas que mais doem:** Multiatendimento e Chat · Pipelines e Automações ·
card do lead e do negócio · app mobile.

## 2.1 · O objetivo, na palavra do humano

**Refazer o design system do CRM** — refazer e melhorar os componentes — e
**só depois** partir para as telas. Não é documentar o que existe: é
reconstruir, aproveitando a base que já está no `globals.css` sem começar do
zero e sem reinventar o que o time já usa.

O **Figma de hoje é rascunho** — inclusive a tela de dashboard, que é a home.
Ele vai ser construído ao longo do ciclo, variável a variável, junto com o
humano. Consequência de método: o Figma ainda **não** é fonte de verdade; vira
fonte de verdade à medida que for sendo montado.

## 3 · O que este ciclo entrega

Um **design system retroativo** para o CRM DataCrazy: conjunto canônico de
tokens (mineração do que já existe, não fundação nova) + componentes básicos
pareados com o Figma + **showcase** + doc de uso e extensão.

Decidido com o humano em 2026-09-01:

| Decisão | Valor | Consequência |
|---|---|---|
| Origem da marca | Figma **em andamento**, criado pelo Gabriel | Vai precisar de refinamento guiado pelo checklist de prontidão antes da etapa 6 |
| Consumidor do DS | Produto único (CRM DataCrazy) | DS opinativo e enxuto; sem camada white-label |
| Temas | **Claro e escuro** — requisito de produto confirmado pelo Davi | Tokens semânticos obrigatórios; corrigir as 13 variáveis é escopo, não risco |
| Cobertura do ciclo 1 | Fundações + componentes básicos | Organizados pelas **5 categorias já fechadas em contrato** (abaixo) |

### As 5 categorias de componentes (fechadas em contrato — FigJam · PASSO 1)

1. **Ações** · 2. **Formulários** · 3. **Navegação** · 4. **Exibição de dados** ·
5. **Feedback e sobreposições**

O inventário do primeiro lote se organiza por elas. Os padrões que o time quer
dentro de cada categoria estão em `docs/regras.md` (tabela G1–G11).

**Não existe brandbook versionado** (P5). O material de marca vive fora do
código: o logo já está no repo (`datacrazy.svg` e variações claro/escuro).
A tipografia **decidida é a Geist** (+ Geist Mono), declarada nas variáveis do
Figma — o app ainda roda Inter, então há uma migração de fonte no caminho.
Ver `docs/processo/fonts-checklist.md` e `docs/02-design-system.md`.

## 3.1 · Direção de marca (insights do FigJam · PASSO 1)

Desejo declarado: aproximar a marca do site à da plataforma, com *"mais cores,
mais ilustrações, mais motion, talvez o mascote **Eisten** como agente geral,
linguagem um pouco mais descontraída"* — e deixar o site mais clean,
acompanhando o padrão das empresas do nicho.

Isso convive com anti-referências que barram cor saturada, card colorido e
gradiente. A conciliação proposta: **a expansão de cor e personalidade vive em
ilustração, mascote e comunicação — não na estrutura da interface.**
Registrado como tensão T2 em `docs/processo/ux-direcao-visual.md`, a confirmar no gate.

## 3.2 · Contexto de empresa (desk research)

Fundada em 2023 por Andreone Ribeiro (Balneário Camboriú/SC) · seed,
bootstrapped, ~30% ao mês · 500+ empresas no Brasil e LatAm · provedora oficial
da Meta · preço fixo em real, R$197–707/mês, sem cobrança por mensagem ·
promessa de substituir 4 a 6 ferramentas.

As três análises que o board deriva disso — **densidade é estrutural**, **o
usuário não é analista**, **a escala já chegou** — são o argumento central a
favor do DS retroativo e incremental. Íntegras em `docs/processo/ux-direcao-visual.md`.

## 4 · Requisitos confirmados que moldam o DS

| # | Requisito | Quem confirmou | O que impõe ao DS |
|---|---|---|---|
| R1 | Dark mode é **requisito**, não ideia | Davi | Token semântico desde a fundação; nenhuma variável pode repetir valor entre temas sem intenção declarada |
| R2 | Produto precisa ser **responsivo** (não desktop-first) | Davi | Todo componente responde a viewport e zoom; os 4 tickets viram bug de regressão |
| R3 | **Multi-idioma** é requisito (`en`, `es`, `pt-br` via next-intl) | Davi | Componente nunca embute texto; e precisa aguentar string longa sem truncar mudo |
| R4 | Acessibilidade **sem exigência formal**, mas com reclamação real | PDF (P11) | Entra no escopo mesmo sem WCAG declarado: foco visível, contraste, teclado |
| R5 | Base de estilo é **Tailwind** | Gava | O DS estende o que existe; não substitui |
| R6 | Dados via `fetch` nativo com hook próprio | Gava | Vale sobre o `package.json` — react-query não é o padrão |

## 5 · NÃO-ESCOPO (explícito)

1. **Telas do produto** — nenhuma tela de aplicação neste ciclo; entram por
   `/kfe-new-screens` depois, lote a lote.
2. **Migração big-bang do CRM inteiro** — o kit proíbe. O DS retroativo cobre
   só as telas-alvo do primeiro lote.
3. **Back-end** — não é implementado por este fluxo. Repo do back nunca foi
   auditado; sua linguagem segue desconhecida e assim fica.
4. **Componentes de dados/visualização** — tabela avançada, filtros, gráficos e
   KPI do BI ficam para lote futuro, e só depois de desenhados no Figma.
5. **App mobile** — os tickets de a11y mobile são reais, mas o alvo deste ciclo
   é o front web. Portar é desvio novo com ADR.
6. **Multi-marca / white-label** — um produto só.
7. **Correção dos 22 tickets** — o DS cria a *condição* para corrigi-los; a
   correção de cada tela é trabalho de lote, não deste ciclo.
8. **Conteúdo, copy e traduções** — o DS entrega componentes, não textos.
9. **Adoção de react-query** — fora de escopo por decisão registrada.

## 6 · Perguntas abertas (pergunta aberta > suposição registrada)

| # | Pergunta | Bloqueia |
|---|---|---|
| Q1 | **Acesso ao repo `datacrazy-front-end`** — sem ele a auditoria é de segunda mão | Gate da auditoria |
| ~~Q2~~ | ~~Anti-referências~~ — **RESOLVIDA** em 2026-09-01: 15 stickies no FigJam · PASSO 3 · DEFINE, lidos via MCP. Ver `docs/processo/ux-direcao-visual.md` | — |
| ~~Q8~~ | ~~Tipografia~~ — **RESOLVIDA**: é **Geist**, conforme as variáveis do Figma. Gera migração Inter → Geist no app |
| Q9 | Os 30 stickies de gosta/não gosta são do time do cliente ou análise interna? (sem autor no arquivo) | Peso da decisão no gate |
| Q3 | Onde o DS mora: dentro do repo existente ou pacote separado? | Etapa 3 (INSTALL) |
| Q4 | O Figma tem **modes de variável** para claro e escuro, ou os tons escuros são variáveis separadas (`Bg`, `Surface escura`)? | Etapa 6 — sem modes, os dois temas exigem duplicar componente (ver F3 em `docs/processo/tokens-migracao.md`) |
| Q5 | Os locales `en`/`es`/`pt-br` cobrem a lista de idiomas do negócio? | Escopo de i18n |
| Q6 | Quais são as **telas-alvo do primeiro lote**? | Escopo do DS retroativo mínimo |
| Q7 | TypeScript `strict` está ligado no repo? | Etapa 3 |

Referências e links: `docs/processo/referencias.md`.
