# Kill Front-End — Kit de Skills (v3.2)

O design vira código pixel-perfect, medido. Sistema de skills — agnóstico de empresa e
projeto: qualquer produto novo, produto existente ou design system de
cliente. Da definição de stack à entrega, com humano orquestrador nos gates e
geração **pixel-perfect medida** (diff de pixels com limiar, não "parecido").

## O que mudou na v3.2 — a arquitetura da documentação

A `docs/` do produto deixou de ser uma pasta e virou uma **arquitetura**:
SOLID aplicado a documento. 1 arquivo 1 assunto (SRP) · feature nova = arquivo
novo (OCP) · todo arquivo do mesmo tipo no mesmo template (LSP) · cada arquivo
carrega só o seu escopo (ISP) · referência por link, nunca cópia (DIP).

Três mudanças concretas:

- **Um roteador na entrada.** `docs/README.md` traz a árvore e a tabela
  *"pra fazer X, leia Y"*. A IA da próxima sessão abre um arquivo, não a pasta
  inteira — menos token e, sobretudo, menos alucinação.
- **Produto e processo separados.** A raiz do `docs/` é a verdade do produto
  (`00-visao-geral` … `05-contratos`, `objetos/`, `features/`, `componentes/`);
  `docs/processo/` guarda o maquinário do KFE (estado, métricas, calibração,
  registro, checklists). Quem gera código lê a raiz; quem conduz o fluxo lê o
  processo.
- **Estrutura verificada, não prometida.** `scripts/kfe-docs.mjs`:
  `init` monta a árvore e migra produto de layout antigo (via `git mv`),
  `index` regenera os índices lendo os arquivos reais (índice à mão mente),
  `audit` reprova link quebrado, arquivo fora do template do seu tipo, órfão
  de índice e atributo duplicado fora de `objetos/` — e bloqueia no CI.

`docs/componentes/<X>.md` é a face legível do `components-registry.json`:
mesma verdade, markdown pro humano e pra IA, JSON pro script — e sem
duplicata, porque a tabela de estados do markdown é gerada a partir do JSON.
É também o produto da entrega no modo `new-ds`.

Contrato completo: `skills/kill-front-end/doc-architecture.md`.
Inspirado em [claude-doc-sample](https://github.com/Guilherme-Calesco/claude-doc-sample),
com a disciplina trocada por verificação automática.

## O que mudou na v3.1 — as duas camadas de verdade

O Figma continua mandando no **estado de repouso** (camada 1, medida por
pixel-diff). Os **estados de interação** (hover, focus, disabled, loading,
error…) saem do Figma: viram camada 2 — **declarados** em
`docs/processo/interactions.md` (uma linha por componente, sem desenhar nada) e
**derivados** por uma cadeia de precedência: Figma desenhado → declaração →
banco de regras (`interactions-global.md`, I1–I15) → analogia com precedente
citado no `docs/processo/components-registry.json` → pergunta ao humano.

O registro de componentes é a memória: cada lote grava o que decidiu, e o
componente seguinte herda o precedente em vez de improvisar. Consistência
vira número (`scripts/kfe-interactions.mjs audit`) e os estados ganham
regressão própria (`tests/golden/states/`). Menos tempo no Figma, mesma
fidelidade — medida, não prometida.

## O que mudou na v2

- **3 cenários de entrada**: A produto novo · B produto existente com design
  system · C produto existente sem DS (ou incerto) — com `fw-audit`
  (diagnóstico por evidência) e `fw-onboard` (pareamento ou engenharia
  reversa) para B/C.
- **Pixel-perfect como protocolo**: extração exata via MCP (nunca estimar),
  assets exportados do Figma (nunca redesenhados), verificação por diff de
  pixels (aceite: ≤ 1% e geometria zero-divergente), fontes com checagem
  anti-fallback, e `docs/processo/calibration.md` — o livro-razão que converte cada
  divergência recorrente em regra, fazendo o ajuste humano tender a zero.
- **Protocolos comuns** (`skills/kill-front-end/protocols.md`): pré-voo, definição
  de pronto, protocolo de falha/escalada, formato de gate, idempotência e
  caminhos padrão — herdados por todas as etapas.
- **Estado v2**: cenário, baseline de fidelidade (da tela piloto) e registro
  de exceções aprovadas.

## Passo a passo

Guia prático de uso (por cenário, com quem-faz-o-quê): **GUIA.md**.

## Instalação

```bash
# no repo do produto (recomendado)
cp -r skills/* <repo>/.claude/skills/
cp commands/*  <repo>/.claude/commands/
# ou global: ~/.claude/skills/ e ~/.claude/commands/
```

## Uso

| Comando | O que faz |
|---|---|
| `/kfe-new-product` | Cenário A — etapas 1→9 |
| `/kfe-new-ds` | Design system como entrega (cliente novo: DS primeiro, telas depois) |
| `/kfe-onboard` | Cenários B/C — fw-audit → fw-onboard → pronto p/ new-screens |
| `/kfe-new-screens` | Telas novas em produto onboardado — 5-lite→9 |
| `/kfe-next` | Continua do ponto atual (o loop) |
| `/kfe-loop` | Loop contínuo — para só em gate humano, bloqueio ou fim |
| `/kfe-status` | Estado e próximo gate, sem executar |
| `/kfe-dashboard` | Painel visual gamificado do estado (localhost:4242, auto-atualiza) |

Estado em `docs/processo/kfe-state.md` — sobrevive entre sessões.

Arquitetura da doc (rodar na raiz do produto):

| Comando | O que faz |
|---|---|
| `node <kit>/scripts/kfe-docs.mjs init` | Monta a árvore `docs/` e migra layout antigo (`--dry` simula) |
| `node <kit>/scripts/kfe-docs.mjs index` | Regenera os índices lendo os arquivos reais |
| `node <kit>/scripts/kfe-docs.mjs audit` | Verifica a arquitetura — exit 1 em erro |

## Conteúdo do kit

`skills/` (12) · `commands/` (8) · `templates/` (esqueletos de todos os
artefatos docs/, com a árvore de doc em `templates/docs/`) ·
`scripts/` (pixel-diff · kfe-dashboard · lote-report · kfe-interactions · kfe-docs) ·
`calibration-global.md` · `interactions-global.md` · `install.sh` · CHANGELOG.md

## Mapa das skills

`framework` (orquestra + protocols.md) · `fw-audit` · `fw-onboard` ·
`fw-stacks` · `fw-srs` · `fw-install` · `fw-mcp` · `fw-ux` · `fw-ui` ·
`fw-doc` · `fw-qa` · `fw-github`
(o orquestrador herda dois contratos: `protocols.md` e `doc-architecture.md`)

## Gates

STACKS · SRS · AUDIT (cenário) · ONBOARD (tokens/fonte canônica) · MCP
(piloto + baseline) · **UX (o gate forte)** · UI (por lote, com % de diff) ·
QA (preview) · GITHUB (final). INSTALL e DOC: gate técnico.

## Princípios

Humano decide, IA executa · doc é arquitetura verificada, não pasta ·
Figma é a verdade absoluta do repouso (estados
seguem a cadeia de precedência da camada 2) · nunca inventar valor (sem dado
→ perguntar, jamais estimar; analogia só com precedente citado) · nada de código antes do
INSTALL/ONBOARD · repetiu 2x vira infraestrutura · back entregue pronto pra
implementação manual, nunca implementado · todo projeto alimenta o framework.
