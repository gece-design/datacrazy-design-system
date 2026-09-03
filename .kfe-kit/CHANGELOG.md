# Changelog — Kill Front-End (kit)

## v3.2
- ARQUITETURA DA DOCUMENTAÇÃO: a `docs/` do produto deixa de ser uma pasta e
  vira contrato — SOLID aplicado a documento (SRP, OCP, LSP, ISP, DIP), com
  árvore fixa, donos por arquivo e seções obrigatórias por tipo. Novo
  contrato herdado por todas as skills:
  `skills/kill-front-end/doc-architecture.md`, irmão do protocols.md.
  Inspirado em github.com/Guilherme-Calesco/claude-doc-sample, com a
  disciplina manual trocada por verificação automática.
- ROTEADOR: `docs/README.md` passa a trazer a árvore e a tabela "pra fazer X,
  leia Y". A IA abre um arquivo, não a pasta inteira — menos token, menos
  alucinação.
- PRODUTO vs. PROCESSO: a raiz do docs/ é a verdade do produto
  (00-visao-geral → 05-contratos, objetos/, features/, componentes/); o
  maquinário do KFE migra para `docs/processo/` (kfe-state, metrics,
  interactions, components-registry, calibration, checklists, audit,
  onboard-plan, adr, qa-release, handoff-backend, kfe-retro).
- RENOMEAÇÕES: docs/prd.md → docs/00-visao-geral.md · docs/stack.md →
  docs/01-arquitetura.md · docs/specs/ → docs/features/ · docs/flows.md →
  seção de docs/04-navegacao.md · docs/escopo-v1.md → seção de
  docs/00-visao-geral.md · docs/direcao-visual.md → seção de
  docs/02-design-system.md. Novos: 03-contrato-api.md, 05-contratos.md.
- NOVA PASTA `docs/componentes/`: um arquivo por componente (props,
  variantes, estados com origem, tokens, composição, exemplo, a11y) — a face
  legível do components-registry.json e a doc de uso da entrega new-ds.
- NOVO SCRIPT `scripts/kfe-docs.mjs`: `init` monta a árvore e MIGRA produto de
  layout antigo via git mv (idempotente, com `--dry`); `index` regenera os
  índices lendo os arquivos reais (índice à mão mente); `audit` reprova link
  quebrado, arquivo fora do template do seu tipo, órfão de índice, atributo
  duplicado fora de objetos/ e conteúdo aguardando fusão — exit 1.
- NOVOS TEMPLATES em `templates/docs/` (16): roteador, os 6 núcleos numerados,
  regras, glossário, e os pares README+item de objetos/, features/,
  componentes/ e processo/.
- CI: `templates/ci-kfe.yml` ganha o passo "Doc audit" — PR que quebra a
  arquitetura da doc não mergeia, igual lint/tipos/build/golden.
- SKILLS: fw-doc reescrita como dona da arquitetura (C2 escreve
  componentes/, C7 roda index+audit, gate exige audit verde); fw-onboard roda
  o init como primeiro passo e usa a saída do audit como lista de trabalho
  retroativa (o caminho de produto existente); fw-srs, fw-stacks, fw-install,
  fw-ux, fw-ui, fw-audit, fw-qa, fw-github e a orquestradora atualizadas para
  os caminhos e donos novos.
- SEM DUPLICATA ENTRE AS DUAS FACES: a seção Estados de
  docs/componentes/<X>.md passa a ser GERADA pelo `kfe-docs index` a partir
  do components-registry.json (o JSON é o dono do fato; o markdown é a vista),
  e o audit reprova componente que existe num lado e não no outro.
- COMPATIBILIDADE: kfe-dashboard, kfe-interactions e lote-report leem
  docs/processo/ com fallback para o caminho antigo — produto ainda não
  migrado continua funcionando.

## v3.1
- DUAS CAMADAS DE VERDADE: o Figma passa a ser a verdade absoluta do ESTADO
  DE REPOUSO (camada 1, pixel-diff ≤1%); estados de interação viram camada 2
  — declarados, não desenhados. Regra não-negociável reescrita na
  orquestradora e no protocols.md.
- Cadeia de precedência por estado: Figma desenhado → declaração
  (docs/interactions.md) → banco de regras → analogia com PRECEDENTE CITADO
  → bloqueio/pergunta ao humano. Analogia sem precedente citável é chute e
  bloqueia — o "nunca inventar valor" continua intacto.
- `interactions-global.md`: banco de regras de interação do kit (I1–I15 +
  famílias de componentes), herdado por todo produto novo; a retro promove
  regras locais genéricas de volta pro kit.
- `templates/interactions.md`: declaração por produto (variants, estados,
  motion, regras locais, decisões inferidas, exceções desenhadas no Figma).
- `templates/components-registry.json` + `scripts/kfe-interactions.mjs`
  (precedent · audit · pending · summary): o registro vivo que dá memória à
  IA — cada lote grava o que decidiu e o componente seguinte herda, com
  auditoria de divergência de regra dentro da família.
- Golden por estado (`tests/golden/states/`): hover/focus/disabled/loading
  ganham regressão medida no QA, aprovada uma vez pelo humano.
- fw-mcp/checklist: variante desenhada deixa de ser exigência — passa a ser
  exigida a linha de declaração. fw-doc grava o registro por lote; fw-onboard
  minera as interações do código existente (B/C nascem com memória);
  fw-github promove regras e mede a evolução das origens na retro.

## v3.0
- REBRAND: o framework agora se chama Kill Front-End (KFE). Skill
  orquestradora `kill-front-end`, comandos /kfe-*, estado em
  docs/kfe-state.md, dashboard kfe-dashboard.mjs, CI kfe-guardian.
- Rumo a produto: o kit passa a ser refinado para operação comercial —
  venda como serviço para empresas (kill-back-end virá na sequência,
  nascendo do contrato OpenAPI + testes E2E que o KFE já entrega).

## v2.5
- Paralelização com subagentes na fw-ui (até 4, verificação central única).
- CI guardião: templates/ci-kfe.yml instalado pela fw-install —
  lint, tipos, build e golden bloqueando merge.
- Relatório de lote pro cliente: scripts/lote-report.mjs (números + lado a
  lado a partir de metrics.md e dos pares de screenshot).
- Calibração global do kit (calibration-global.md): produtos novos herdam;
  a retro promove regras genéricas de volta — aprendizado composto.

## v2.4
- Painel visual gamificado (scripts/kfe-dashboard.mjs + /kfe-dashboard):
  jornada das etapas ao vivo, missão atual, conquistas, lotes e log —
  100% automático (lê kfe-state.md e metrics.md; zero manutenção).

## v2.3
- Kit agnóstico de empresa/projeto (removidas amarras à Alumy; back-end
  definido por quem implementa, com Laravel como default do operador).
- Modo new-ds: design system como entrega (cliente novo — DS primeiro,
  telas depois via new-screens sobre cenário B por construção).
- GUIA.md: passo a passo por cenário com papéis (você · IA · gate).

## v2.2
- Repositório-pronto: install.sh, .gitignore, histórico git iniciado.
- Fontes como pré-requisito da piloto (templates/fonts-checklist.md +
  checagem anti-fallback obrigatória antes de todo diff).
- Golden screen: piloto congelada como regressão do pipeline (tests/golden/),
  rodada no início de lote, em mudança de tokens/deps e em toda release.
- Métricas: docs/metrics.md por lote e por ciclo — o caminho pra trocar o
  "~40%" estimado por número medido.

## v2.1
- templates/ com esqueleto de todos os artefatos docs/ (estado, calibração,
  checklist Figma, auditoria, handoff, QA/release, ADR) — formato nunca mais
  é inventado na hora.
- scripts/pixel-diff.js: verificação objetiva (PASS/FAIL, % de pixels,
  geometria zero-tolerância) usada pela fw-ui e pela tela piloto.
- /kfe-loop: execução contínua que para apenas em gate humano,
  bloqueio ou fim de ciclo.
- Estado com tabela de lotes (new-screens) e trilha AUDIT/ONBOARD (B/C).

## v2
- Cenários A/B/C + fw-audit e fw-onboard · protocolo pixel-perfect na fw-ui
- protocols.md comum (pré-voo, definição de pronto, falha, gate, idempotência)

## v1
- Orquestradora + 9 skills de etapa + 4 comandos.
