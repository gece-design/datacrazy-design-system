# Documentação — DataCrazy · Design System

Cada arquivo aqui tem **responsabilidade única** e referencia os demais por
link, em vez de duplicar conteúdo. Se você é uma IA: abra o que a tabela
abaixo manda abrir, **não a pasta inteira**.

Ciclo atual: `new-ds` em cenário **C** — a entrega é o design system do CRM
DataCrazy, um produto já em produção. Telas ficam para ciclos `new-screens`.

## Como navegar

<!-- kfe:tree:start -->
```
docs/
├── README.md            → roteador — comece por aqui
├── 00-visao-geral.md    → o que é, pra quem, escopo v1, NÃO-ESCOPO
├── 01-arquitetura.md    → stack, lista negativa, estrutura, fronteira do back
├── 02-design-system.md  → direção visual + fundações (tokens, fontes, motion)
├── 03-contrato-api.md   → auth, envelope, paginação, erro
├── 04-navegacao.md      → rotas + user flows
├── 05-contratos.md      → catálogo de contratos (props, ports, estados)
├── api-contract.yaml    → OpenAPI — consumido pelo back
├── glossario.md         → nome canônico de cada coisa
├── regras.md            → regras de negócio transversais
├── objetos/             → 0 entidade(s) — atributos, invariantes, relações
├── features/            → 0 feature(s) — casos de uso e áreas
├── componentes/         → 32 componente(s) do design system
└── processo/            → maquinário do KFE (19 arquivo(s))
```
<!-- kfe:tree:end -->

## Para fazer X, leia Y

| Quero... | Comece por |
|----------|-----------|
| Entender o produto e o que está fora dele | [00-visao-geral.md](00-visao-geral.md) |
| Saber a stack, o que é proibido e por quê | [01-arquitetura.md](01-arquitetura.md) |
| Mexer em token, cor, tipografia ou raio | [02-design-system.md](02-design-system.md) |
| Criar/alterar um componente | [componentes/](componentes/) + [processo/interactions.md](processo/interactions.md) |
| Saber qual componente vem primeiro | [processo/roadmap-componentes.md](processo/roadmap-componentes.md) |
| Criar/alterar página do site do DS | [04-navegacao.md](04-navegacao.md) § Padrão de página |
| Saber um contrato compartilhado entre componentes | [05-contratos.md](05-contratos.md) |
| Saber como chamar as coisas | [glossario.md](glossario.md) |
| Saber uma regra de uso do DS | [regras.md](regras.md) |
| Entender a API do CRM | [03-contrato-api.md](03-contrato-api.md) — fora de escopo neste ciclo |
| Saber em que pé está o projeto | [processo/kfe-state.md](processo/kfe-state.md) |
| Achar o Figma, o FigJam ou o PDF | [processo/referencias.md](processo/referencias.md) |
| Entender por que o código diverge do Figma | [processo/calibration.md](processo/calibration.md) |

## Duas regras que evitam alucinação

1. **Ausência é decisão, não buraco.** `objetos/` e `features/` estão vazios
   porque este ciclo não tem domínio nem fluxo — não os preencha "por
   completude".
2. **Cada fato tem um dono.** Token vive em `02-design-system.md`; rota vive
   em `components/ds/nav.ts`; estado de componente vive em
   `processo/components-registry.json`. Encontrou o mesmo fato em dois
   lugares? Um dos dois é cópia velha — conserte no dono.

## Princípios (SOLID aplicado a docs)

- **SRP** — 1 arquivo, 1 assunto.
- **OCP** — feature/objeto/componente novo = arquivo novo; a estrutura não muda.
- **LSP** — todo arquivo do mesmo tipo segue o mesmo template, na mesma ordem.
- **ISP** — cada arquivo carrega só o seu escopo; o resto é link.
- **DIP** — documentos referenciam por link relativo, nunca duplicam.

Contrato completo (donos, seções obrigatórias, regras):
`.claude/skills/kill-front-end/doc-architecture.md`.
Verificação: `node .kfe-kit/scripts/kfe-docs.mjs audit`.
