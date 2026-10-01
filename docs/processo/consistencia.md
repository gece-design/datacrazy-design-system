# Consistência do design system — backlog da auditoria

<!-- GERADO por scripts/consistencia.mjs render a partir de consistencia.json. Não edite à mão. -->

Varredura de 2026-09-19 · 210 achados · 2 abertos · atualizado em 2026-10-01.
Dono: [consistencia.json](consistencia.json). Método e lotes: plano da rodada (~/.claude/plans/como-podemos-iniciar-uma-hazy-shamir.md).

## O que é

Os componentes foram medidos contra o Figma um a um, nunca entre si. Esta lista é o que diverge
**entre** eles — tokens, movimento, composição, páginas, instalação e docs — com id estável,
arquivo:linha, gravidade e o lote que resolve. `bloqueia` = erro garantido para quem instala ·
`alta` = regra escrita descumprida · `media` = duplicação sem bug visível · `baixa` = cosmético.
Status: `aberto` · `corrigido` (commit em fechadoEm) · `aceito` (exige ADR) · `adiado` (lote figma).

## Abertos por eixo × lote

| eixo | A | B0 | B1 | B2 | B3 | B4 | B5 | B6 | B7 | B8 | B9 | figma | depois | total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| composicao | · | · | · | · | · | · | · | · | · | · | · | · | 1 | 1 |
| instalacao | · | · | · | · | · | · | · | · | · | · | · | · | 1 | 1 |
| **total** | · | · | · | · | · | · | · | · | · | · | · | · | 2 | 2 |

## Por status

aberto 2 · corrigido 67 · aceito 12 · adiado 129

## Abertos que bloqueiam ou descumprem regra

| id | achado | onde | gravidade | lote |
|---|---|---|---|---|

Mais 2 abertos de gravidade média/baixa, listados no JSON. `node scripts/consistencia.mjs lote <B>` imprime o checklist de um lote.

