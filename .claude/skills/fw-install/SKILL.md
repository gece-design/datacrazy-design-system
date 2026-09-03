---
name: fw-install
description: Etapa 3 do Kill Front-End — INSTALL. Prepara o repositório antes de qualquer código de produto — CLAUDE.md, skills auxiliares, hooks, templates, lint e CI. Use quando o orquestrador indicar a etapa 3, ou quando o usuário pedir o setup/preparo de um repo do framework.
---

# Etapa 3 — INSTALL

Transforma artesanato em linha de produção. NENHUM código de produto antes
desta etapa terminar.

## Pré-voo
SRS concluída (o CLAUDE.md referencia docs/ que precisam existir); permissão pra criar o repo/branch; npm disponível.

## Processo

1. **I6 · Repo**: init, Vite + React + TS strict, Tailwind com os tokens
   (placeholder até a etapa 6), ESLint + Prettier, CI mínimo (lint + build).
2. **I4 · Estrutura + templates**: pastas (`components/ui`, `components/<produto>`,
   `pages`, `hooks`, `contexts`, `lib`, `mocks`) e a árvore de documentação
   inteira via `node <kit>/scripts/kfe-docs.mjs init` (idempotente; migra
   layout antigo em repo existente). Registre a estrutura de pastas em
   `docs/01-arquitetura.md`. Mais um template
   exemplar de cada tipo: componente, página, hook, mock. O modelo imita o
   que existe — o template É a instrução.
3. **I1 · CLAUDE.md**: regras não-negociáveis do projeto. Mínimo: stack
   travada + lista negativa (da STACKS), fidelidade ao Figma, glossário
   obrigatório, referências por caminho pra docs/, "repetiu 2x vira regra".
4. **I2 · Skills auxiliares**: instale/adapte o kit transversal do framework
   (ds-update, figma-sync, qa-browser, rename-cascade) pro contexto do
   produto.
5. **I3 · Hooks**: UserPromptSubmit injetando lembrete curto (skill do
   projeto + CLAUDE.md); Stop limpando artefatos temporários.
6. **Calibração + interações herdadas + CI guardião**: crie
   docs/processo/calibration.md a partir de `templates/calibration.md` e IMPORTE as
   regras de `calibration-global.md` do kit (o produto nasce com as
   cicatrizes dos projetos anteriores curadas). Crie também
   docs/processo/interactions.md a partir de `templates/interactions.md` (importando
   as regras I1–I15 de `interactions-global.md`) e
   docs/processo/components-registry.json a partir de
   `templates/components-registry.json` com a lista de componentes VAZIA —
   é a memória que vai alimentar a camada 2.
   Copie `templates/ci-kfe.yml` para .github/workflows/kfe.yml — lint, tipos,
   build, **doc audit** e golden screen bloqueando merge desde o commit 0.
7. **I5 · Anti-token**: confira que CLAUDE.md e skills usam referência por
   caminho, não conteúdo colado; exemplos mínimos; uma fonte por assunto.
   Aponte o CLAUDE.md para o roteador `docs/README.md` — é ele que diz o que
   abrir para cada tarefa, em vez de a IA varrer a pasta.

## Definição de pronto (artefatos)

- Repo esqueleto com lint + build verdes ("commit 0")
- `CLAUDE.md` na raiz · templates nas pastas · hooks configurados
- Árvore `docs/` completa (`kfe-docs audit` sem erro) · `docs/processo/calibration.md`
  · `docs/processo/interactions.md` · `docs/processo/components-registry.json` criados
- Kit de skills auxiliares instalado

## Gate (técnico)

`npm run lint && npm run build` verdes + checklist dos artefatos. Apresente
o resumo ao humano; aprovação rápida, sem revisão profunda.

## Regras

- Skill = conhecimento (como fazer). Hook = disciplina (quando lembrar).
- Cada instrução que o humano repetir 2x daqui em diante volta pra cá.

Protocolos comuns: `.claude/skills/kill-front-end/protocols.md`. Modo "sobre repo existente" (cenários B/C): nunca recriar o que existe — auditar, completar e atualizar por diff.
