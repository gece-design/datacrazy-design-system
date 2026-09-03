# Processo — maquinário do Kill Front-End

Nada aqui descreve o **produto**: descreve como o produto está sendo
construído. A IA que gera código lê a raiz do `docs/`; a IA que conduz o
pipeline lê esta pasta.

## Canônicos do kit

| Arquivo | O que é | Quem escreve |
|---------|---------|--------------|
| [kfe-state.md](kfe-state.md) | Estado do pipeline: etapas, gates, exceções, log | orquestrador |
| [interactions.md](interactions.md) | Declaração da camada 2 (estados derivados por regra — exceção E-01) | humano declara · `fw-ui` propõe |
| [calibration.md](calibration.md) | Livro-razão da fidelidade: divergência recorrente vira regra | `fw-ui` |
| [figma-checklist.md](figma-checklist.md) | Prontidão de frame — bloqueante | `fw-mcp` |
| [fonts-checklist.md](fonts-checklist.md) | Inventário de fontes e checagem anti-fallback | humano · `fw-mcp` |
| [audit.md](audit.md) | Diagnóstico de entrada (cenário C) | `fw-audit` |
| [metrics.md](metrics.md) | Números por lote e por ciclo | `fw-ui` (lote) · `fw-github` (ciclo) |
| [components-registry.json](components-registry.json) | Memória de estados — fonte da inferência por analogia | `fw-doc`, lendo o código |
| [onboard-plan.md](onboard-plan.md) | O que foi feito no onboarding, o que ficou de backlog | `fw-onboard` |
| [adr.md](adr.md) | Desvios de padrão aprovados: o quê, por quê, quem | `fw-doc` |
| [qa-release.md](qa-release.md) | Checklist de release assinado | `fw-qa` |
| [handoff-backend.md](handoff-backend.md) | Mapa mock → endpoint para o time de back | `fw-github` |
| [kfe-retro.md](kfe-retro.md) | Backlog de melhoria do próprio kit | `fw-github` |

Os que ainda não existem nascem na etapa dona — **ausência é estado, não
buraco a preencher**. Molde de cada um: `.kfe-kit/templates/`.

## Deste produto

Artefatos que o kit não prevê, mas que este ciclo produziu. Todos são
**processo**: evidência, plano ou pendência — nunca a verdade do produto, que
mora na raiz do `docs/`.

| Arquivo | O que é | Dono |
|---------|---------|------|
| [roadmap-componentes.md](roadmap-componentes.md) | Plano de construção do DS: catálogo deduplicado, ordem dos lotes, escopo negativo | `fw-ux` · humano no gate |
| [inventario-componentes.md](inventario-componentes.md) | Inventário do lote 1, derivado da home no Figma, por categoria | `fw-ux` |
| [ux-direcao-visual.md](ux-direcao-visual.md) | Evidência da direção visual: 30 stickies do FigJam, tensões, análises do board | `fw-ux` |
| [tokens-migracao.md](tokens-migracao.md) | Método da medição e as correções aplicadas na coleção `Cor` do Figma | `fw-onboard` |
| [tokens-estados-escuro.md](tokens-estados-escuro.md) | Proposta (não aplicada) para os 8 tokens de estado sem versão escura | `fw-ui` · pendente de gate |
| [referencias.md](referencias.md) | Índice das fontes: Figma, FigJam, PDF, repositórios, acessos | orquestrador |

## Regra da pasta

`processo/` é **fronteira, não gaveta**. Antes de criar arquivo aqui,
pergunte: isto serve a quem CONSTRÓI (fica aqui) ou a quem USA o produto
(vai para a raiz)? Contrato da arquitetura:
`.claude/skills/kill-front-end/doc-architecture.md`.
