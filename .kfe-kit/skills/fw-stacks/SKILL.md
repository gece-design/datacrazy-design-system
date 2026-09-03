---
name: fw-stacks
description: Etapa 1 do Kill Front-End — STACKS. Define as tecnologias do front e do back e a fronteira entre eles (contrato de API). Use quando o orquestrador (skill kill-front-end) indicar a etapa 1, ou quando o usuário pedir para definir/revisar a stack de um produto do framework.
---

# Etapa 1 — STACKS

Objetivo: eliminar decisões futuras. Cada coisa definida aqui é uma pergunta
que a IA nunca vai precisar alucinar nas etapas seguintes.

## Base padrão (desviar exige motivo de PRODUTO, não gosto)

Front: Vite · React · TypeScript strict + zod nas bordas · Tailwind + tokens
· shadcn/Radix · mocks realistas + hooks/contexts.
Back (decisão agora, construção manual depois): a stack que O TIME QUE VAI
IMPLEMENTAR domina — como API pura, auth por token, contrato OpenAPI e
envelope padrão. Default atual do operador: Laravel + Sanctum. Em cliente
externo, pergunte quem implementa o back ANTES de fixar a stack dele.
Desvio conhecido e aprovado: produto mobile → Expo + React Native + NativeWind.

## Pré-voo
Nome do produto e contexto de uma frase confirmados com o humano; cenário A ativo no estado (B/C usam fw-onboard em modo retroativo).

## Processo

1. **S1–S4 · Base front.** Pergunte: algo neste produto exige desviar da base?
   Se não, registre a base. Se sim, exija o motivo de produto por escrito e
   registre como desvio aprovado (vira ADR na etapa 7).
2. **S2 · Rigor.** Confirme: TypeScript strict; zod em API, forms e storage.
3. **S5 · Dados.** Liste as entidades principais (nomes apenas — a modelagem
   é da SRS) e defina que o front nasce 100% sobre mocks.
4. **S6 · Lista negativa.** Escreva a lista do que é PROIBIDO (mínimo:
   styled-components, Redux, CSS solto fora do padrão, libs fora da base sem
   aprovação). Adicione proibições específicas do produto se houver.
5. **S7 · Fronteira.** Escreva os padrões em `docs/03-contrato-api.md`: auth
   (Sanctum token), envelope { data, meta, errors }, paginação, erros,
   idioma dos campos (decidir PT ou EN — nunca acidental). Crie o esqueleto
   `docs/api-contract.yaml` ao lado. Rotas ficam vazias; a SRS e os mocks
   preenchem.

## Definição de pronto (artefatos) (obrigatórios para concluir)

- `docs/01-arquitetura.md` — base, desvios com motivo, lista negativa,
  fronteira do back (template `<kit>/templates/docs/01-arquitetura.md`)
- `docs/03-contrato-api.md` — padrões · `docs/api-contract.yaml` — esqueleto OpenAPI

## Gate (humano)

Apresente: base confirmada, desvios propostos com motivos, lista negativa,
decisões de fronteira (auth/envelope/idioma). O humano aprova ou ajusta.

## Regras

- Stack estável = skills valiosas: não proponha troca por novidade.
- O back não se implementa aqui nem em etapa nenhuma — só se decide.

Protocolos comuns: `.claude/skills/kill-front-end/protocols.md`.
