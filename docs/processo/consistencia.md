# Consistência do design system — backlog da auditoria

<!-- GERADO por scripts/consistencia.mjs render a partir de consistencia.json. Não edite à mão. -->

Varredura de 2026-09-19 · 198 achados · 19 abertos · atualizado em 2026-09-19.
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
| tokens | · | · | · | · | · | · | · | · | · | · | 3 | · | · | 3 |
| composicao | · | · | · | · | · | · | · | · | · | 1 | 2 | · | 1 | 4 |
| paginas | · | · | · | · | · | · | · | · | · | 9 | · | · | · | 9 |
| instalacao | · | · | · | · | · | · | · | · | · | 1 | 2 | · | · | 3 |
| **total** | · | · | · | · | · | · | · | · | · | 11 | 7 | · | 1 | 19 |

## Por status

aberto 19 · corrigido 57 · aceito 1 · adiado 121

## Abertos que bloqueiam ou descumprem regra

| id | achado | onde | gravidade | lote |
|---|---|---|---|---|
| AUD-055 | Página de ícones inlina 3 botões e publica o snippet: ensina o antipadrão | app/foundations/icons/page.tsx:16-40 (+1) | alta | B8 |
| AUD-058 | /forms/select não existe: 6 consumidores e nav com pronto:false | components/ds/nav.ts:45 (+1) | alta | B8 |
| AUD-062 | Pseudocódigo (…) em 6 trechos publicados na aba Código | app/forms/date-picker/page.tsx (+5) | alta | B8 |

Mais 16 abertos de gravidade média/baixa, listados no JSON. `node scripts/consistencia.mjs lote <B>` imprime o checklist de um lote.

