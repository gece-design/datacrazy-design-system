# Processo — maquinário do Kill Front-End

Nada aqui descreve o **produto**: descreve como o produto está sendo
construído. A IA que gera código lê a raiz do `docs/`; a IA que conduz o
pipeline lê esta pasta.

| Arquivo | O que é | Quem escreve |
|---------|---------|--------------|
| [kfe-state.md](kfe-state.md) | Estado do pipeline: etapas, gates, exceções, log | orquestrador |
| [metrics.md](metrics.md) | Números por lote e por ciclo | `fw-ui` (lote) · `fw-github` (ciclo) |
| [interactions.md](interactions.md) | Declaração da camada 2 + regras locais + inferências pendentes | humano declara · `fw-ui` propõe |
| [components-registry.json](components-registry.json) | Memória de estados — fonte da inferência por analogia | `fw-doc`, lendo o código |
| [calibration.md](calibration.md) | Livro-razão da fidelidade: divergência recorrente vira regra | `fw-ui` |
| [figma-checklist.md](figma-checklist.md) | Prontidão de frame — bloqueante | `fw-mcp` |
| [fonts-checklist.md](fonts-checklist.md) | Inventário de fontes e checagem anti-fallback | humano · `fw-mcp` |
| [audit.md](audit.md) | Diagnóstico de entrada (cenários B/C) | `fw-audit` |
| [onboard-plan.md](onboard-plan.md) | O que foi feito no onboarding, o que ficou de backlog | `fw-onboard` |
| [adr.md](adr.md) | Desvios de padrão aprovados: o quê, por quê, quem | `fw-doc` |
| [qa-release.md](qa-release.md) | Checklist de release assinado | `fw-qa` |
| [handoff-backend.md](handoff-backend.md) | Mapa mock → endpoint para o time de back | `fw-github` |
| [kfe-retro.md](kfe-retro.md) | Backlog de melhoria do próprio kit | `fw-github` |

Contrato da arquitetura de docs:
`.claude/skills/kill-front-end/doc-architecture.md`.
