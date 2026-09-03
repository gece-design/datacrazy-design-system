---
name: fw-qa
description: Etapa 8 do Kill Front-End — QA. Testes E2E autônomos via Playwright derivados das specs, preview na Vercel e loop de correção até o checklist de release ficar verde. Use quando o orquestrador indicar a etapa 8, ou quando o usuário pedir para testar fluxos de um produto do framework.
---

# Etapa 8 — QA

A IA testa a INTENÇÃO (spec), não a implementação. Robô e humano testam:
um pega regressão, o outro pega estranheza.

## Pré-voo
Specs das áreas em teste existentes e atuais (roteiro nasce da spec); Playwright MCP validado na etapa 4; build local rodando; acesso à Vercel.

## Processo

1. **Q2 · Roteiros**: para cada fluxo crítico do escopo (auth, monetização,
   o core do produto, onboarding), derive o roteiro E2E DA SPEC da SRS —
   nunca do código. Salve em `tests/e2e/` versionado.
2. **Q1 · Execução**: rode via Playwright MCP contra o ambiente local.
   Registre resultado por roteiro.
3. **Q4 · Loop de correção**: falhou → diagnostique → corrija → re-rode o
   roteiro → até verde. Máximo 3 ciclos por bug; travou → escale pro humano
   com o diagnóstico. Bug de fluxo crítico BLOQUEIA a entrega — sem exceção.
4. **Q3 · Preview**: publique na Vercel (deploy por branch). Gere
   `docs/processo/qa-release.md` (a partir de `templates/qa-release.md`): checklist com os fluxos testados (verde/vermelho),
   URL do preview e instruções de teste manual pro time.
5. **Q6 · Estados (camada 2)**: rode a suíte de golden por estado —
   `tests/golden/states/<componente>-<estado>.png`. O roteiro dirige o
   componente até o estado (hover, foco por teclado, disabled, loading,
   error, empty) e compara com o golden aprovado via
   `scripts/pixel-diff.js`. Sem golden ainda → capture e leve pro gate; o
   humano aprova UMA vez e a partir dali é regressão automática. Inclua
   sempre: foco visível na navegação por teclado (I4), motion reduzido com
   `prefers-reduced-motion` (I12) e alvo de toque de 44px (I15) — os três não
   dependem de declaração e falham como bug, não como pendência.
6. **Q5 · Critério de saída**: release pronta quando (a) fluxos críticos
   verdes, (b) humano testou no preview, (c) zero bug bloqueante aberto,
   (d) golden screen verde (regressão do pipeline — tests/golden/),
   (e) golden de estados verde e `kfe-interactions.mjs audit` sem divergência
   de regra não registrada.

## Definição de pronto (artefatos)

- `tests/e2e/` com os roteiros dos fluxos críticos
- `tests/golden/states/` com o golden de cada estado dos componentes tocados
- URL de preview na Vercel · `docs/processo/qa-release.md` com o checklist

## Gate (humano)

O humano testa no preview (celular incluso) e assina o checklist. Estranheza
apontada vira bug ou vira ADR — nunca fica no ar.

## Regras

- Roteiro nasce da spec. Teste que só confirma o que o código faz não testa nada.
- QA automatizado não substitui olho humano; preview não substitui a suíte.

Protocolos comuns: `.claude/skills/kill-front-end/protocols.md`.
