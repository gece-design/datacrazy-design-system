# Guia passo a passo — Kill Front-End (v3.2)

O README é a referência; este guia é a receita. Siga na ordem. Legenda:
🧑 = você faz/decide · 🤖 = a IA executa · 🚪 = gate (o loop para e espera você).

---

## 0 · Preparação (uma vez por máquina/produto)

1. 🧑 Extraia o kit e instale: `./install.sh <pasta-do-produto>` (ou `--global`).
2. 🧑 Abra o produto no VS Code com Claude Code; confirme os MCPs: Figma
   (bridge/desktop) e Playwright respondendo.
3. 🧑 No produto: `npm i -D pixelmatch pngjs` (verificação de fidelidade).
4. 🧑 Tenha o arquivo Figma do projeto aberto no Desktop.

Pronto. Daqui em diante, tudo começa com um comando.

---

## Cenário A · Produto novo — `/kfe-new-product`

| # | Etapa | O que acontece | Você |
|---|-------|----------------|------|
| 1 | STACKS | 🤖 propõe a base (ou desvios com motivo), lista negativa, fronteira do back | 🚪 aprova stack + desvios. Cliente externo? Diga QUEM implementa o back |
| 2 | SRS | 🤖 te entrevista pro PRD, modela objetos, regras, specs, glossário, skill do projeto | 🚪 revisa PRD + não-escopo + regras |
| 3 | INSTALL | 🤖 monta repo, CLAUDE.md, templates, hooks, lint/CI | 🚪 técnico: lint+build verdes (aprovação rápida) |
| 4 | MCP | 🤖 conecta tudo, gera checklist do Figma, roda a TELA PILOTO com diff medido | 🧑 antes: preencha docs/processo/fonts-checklist.md e desenhe 1 tela simples no Figma · 🚪 aprova a piloto; correções viram regra |
| 5 | UX | 🤖 sintetiza sua pesquisa, desenha flows, propõe corte v1 | 🧑 forneça o material bruto (a IA NÃO inventa pesquisa) · 🚪 FORTE: aprova flows + escopo item a item |
| 6 | UI | 🤖 gera por lote: tokens → componentes → telas, cada item com % de diff | 🧑 desenhe no Figma passando no checklist · 🚪 por lote: screenshots + números |
| 7 | DOC | 🤖 escreve a doc dos componentes, sincroniza features/regras, regenera os índices e roda o `kfe-docs audit` a cada lote | — (técnico) |
| 8 | QA | 🤖 deriva roteiros das specs, testa, corrige em loop, publica preview | 🚪 teste na URL (celular incluso) e assine o checklist |
| 9 | GITHUB | 🤖 monta o pacote de entrega + handoff do back + retro | 🚪 final: confere pacote, agenda handoff, responde a retro |

Dica de ritmo: rode `/kfe-loop` — ele avança sozinho e só para nos 🚪.
`/kfe-status` a qualquer momento mostra onde você está.

---

## Cenário B/C · Produto existente — `/kfe-onboard`

1. 🤖 `fw-audit` mede: tokens vs. valores soltos, componentização, Figma,
   paridade, docs → `docs/processo/audit.md` com classificação proposta (B ou C).
2. 🚪 Você confirma o cenário e escolhe as telas-alvo do primeiro lote.
3. 🤖 `fw-onboard`:
   - **B (tem DS real)**: mapa de tokens 1:1, plano de paridade, docs
     retroativas, infraestrutura, piloto de calibração.
   - **C (sem DS/incerto)**: minera os tokens de fato do código, propõe o
     conjunto canônico → 🚪 você aprova conjunto + fonte canônica (Figma) →
     DS retroativo MÍNIMO só das telas-alvo (nunca big-bang).
4. 🚪 Gate do onboarding (mapa de tokens / decisões de paridade).
5. A partir daqui o produto está onboardado → use o dia a dia abaixo.

---

## Dia a dia · Telas novas — `/kfe-new-screens`

O modo que você mais vai usar:

1. 🧑 Desenhe as telas no Figma passando no checklist do produto.
2. 🧑 `/kfe-new-screens` → 🤖 valida pré-requisitos e roda UX-lite
   (flow do lote + specs das áreas novas se faltarem).
3. 🚪 Aprova o mini-escopo do lote.
4. 🤖 `/kfe-loop`: UI (com golden screen no início) → DOC → QA →
   entrega parcial. Você aparece nos gates de lote e no preview.

---

## Cliente novo · DS primeiro, telas depois — `/kfe-new-ds`

Para o caso "empresa quer o design system, telas vêm depois":

1. Etapas 1–4 normais (a SRS vira o **brief do DS**: marca, princípios,
   não-escopo; o glossário nasce do vocabulário do cliente).
2. UX = direção visual + **inventário de componentes** necessários → 🚪.
3. UI gera SÓ fundações + componentes + **showcase** (página com todo
   componente em todas as variantes — é o produto deste modo) → 🚪 por lote.
4. GITHUB entrega o DS instalável: tokens + componentes + showcase + doc de
   uso e extensão + checklist Figma do cliente.
5. Quando vierem as telas: o produto já é cenário B por construção —
   `/kfe-new-screens` direto.

---

## Painel visual (gamificado e automático)

`/kfe-dashboard` (ou `node <kit>/scripts/kfe-dashboard.mjs` na
raiz do produto) → http://localhost:4242. Mostra a jornada das etapas com
status ao vivo, a missão atual (o que o loop espera de você), conquistas
(piloto, fidelidade ≤1%, lotes, golden, retro, ciclo completo), lotes com
tempo/diff e os últimos eventos do log. Zero manutenção: ele só LÊ o
kfe-state.md e o metrics.md que as skills já mantêm — deixe aberto num
monitor enquanto o /kfe-loop roda.

## A arquitetura da documentação (v3.2)

A `docs/` do produto tem forma fixa — e a forma é verificada, não combinada.

**Como fica organizada:**

```
docs/
├── README.md            ← roteador: "pra fazer X, leia Y". Comece sempre por aqui
├── 00-visao-geral.md    ← o que é, pra quem, escopo v1, NÃO-ESCOPO
├── 01-arquitetura.md    ← stack, lista negativa, fronteira do back
├── 02-design-system.md  ← direção visual + fundações (tokens, fontes, motion)
├── 03-contrato-api.md   ← auth, envelope, paginação, erro
├── 04-navegacao.md      ← rotas + user flows
├── 05-contratos.md      ← catálogo de contratos (props, ports, estados)
├── regras.md · glossario.md · api-contract.yaml
├── objetos/      ← 1 arquivo por entidade    (o atributo mora SÓ aqui)
├── features/     ← 1 arquivo por feature
├── componentes/  ← 1 arquivo por componente  (a doc de uso do seu DS)
└── processo/     ← o maquinário do KFE, fora do caminho de quem gera código
```

**Por que isso importa:** sem roteador, a IA da próxima sessão abre a pasta
inteira (queima token) ou abre o arquivo errado (alucina). Com roteador, ela
abre um arquivo. E como todo arquivo do mesmo tipo tem as mesmas seções, ela
sabe o que vai encontrar antes de abrir.

**As 3 regras que você precisa lembrar:**

1. **Um fato tem um dono.** Atributo de entidade mora em `objetos/`. Regra de
   um caso de uso mora na feature. Regra transversal mora em `regras.md`.
   Nunca nos três — os outros linkam.
2. **Índice ninguém escreve à mão.** `docs/README.md` e os READMEs das pastas
   são gerados. Índice à mão mente na segunda semana.
3. **Coisa nova = arquivo novo.** Nunca anexe uma feature no fim de outra
   porque "é pequena".

**Os 3 comandos** (na raiz do produto):

| Comando | Quando |
|---|---|
| `node <kit>/scripts/kfe-docs.mjs init` | Uma vez, no INSTALL ou no ONBOARD. Cria a árvore e **migra produto antigo** (`--dry` simula antes) |
| `node <kit>/scripts/kfe-docs.mjs index` | A cada lote — a fw-doc roda sozinha |
| `node <kit>/scripts/kfe-docs.mjs audit` | A cada lote e no CI. Vermelho = não fecha o gate |

**Onde isso entra no seu fluxo:** produto novo → a INSTALL cria a árvore e a
SRS preenche. Produto existente (o caso mais comum) → o `fw-onboard` roda o
`init`, e a saída do `audit` **é a sua lista de trabalho**: ele diz quais
arquivos estão fora do template e precisam ser reescritos.

## Estados sem desenhar no Figma (v3.1)

- Você declara, não desenha: uma linha por componente em
  `docs/processo/interactions.md` (variants, estados, motion). Segundos, não horas.
- A IA deriva pela cadeia: Figma desenhado → declaração → banco de regras →
  analogia com precedente citado → pergunta. Nunca improvisa valor.
- O `docs/processo/components-registry.json` é a memória: cada lote grava o que
  decidiu; o próximo componente herda. Fidelidade por consistência, medida
  com `node <kit>/scripts/kfe-interactions.mjs audit`.
- No gate da UI você aprova em bloco a tabela de **decisões inferidas** (cada
  linha cita de qual componente ela copiou). Corrigiu? Vira regra local. A
  mesma inferência aprovada 2x vira regra e some da lista.
- Quer um estado pixel-perfect mesmo? Desenhe a variante no Figma e liste na
  seção 4 do interactions.md — ela volta pra camada 1 e entra no pixel-diff.

## Velocidade e prova (v2.5)

- **Paralelo**: do 2º lote em diante, a UI despacha subagentes (até 4) para
  componentes independentes — a verificação central continua uma só.
- **CI guardião**: instalado pela INSTALL (.github/workflows/kfe.yml),
  bloqueia merge que quebre lint, tipos, build ou a golden screen.
- **Relatório pro cliente**: `node <kit>/scripts/lote-report.mjs <N>` gera
  reports/lote-<N>.html — números + lado a lado, pronto pra enviar.
- **Calibração global**: todo produto novo herda `calibration-global.md` do
  kit; a retro promove regras genéricas de volta pro kit.

## Quando algo trava

- A IA reporta `BLOQUEIO` no formato padrão → leia "Preciso de:" e responda.
- Golden screen FAIL → problema do PIPELINE (tokens/fontes/deps), não da
  tela. Trate antes de qualquer lote.
- Diff não converge em 3 ciclos → decida: bug de código, furo do Figma
  (volta pro design) ou exceção registrada com print.
- Corrigiu a mesma coisa 2x → exija a regra (calibration/CLAUDE.md) antes
  de continuar. É assim que o ajuste desaparece.
- `kfe-docs audit` vermelho → leia a linha: ela diz o arquivo, o defeito e o
  template a usar. "Órfão de índice" quase sempre se resolve rodando `index`.

## Os 5 comandos, decorados

`/kfe-new-product` · `/kfe-onboard` · `/kfe-new-screens`
· `/kfe-new-ds` · `/kfe-loop` (+ `/kfe-next` passo a
passo e `/kfe-status` pra se localizar).
