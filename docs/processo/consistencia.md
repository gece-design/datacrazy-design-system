# Consistência do design system — backlog da auditoria

<!-- GERADO por scripts/consistencia.mjs render a partir de consistencia.json. Não edite à mão. -->

Varredura de 2026-09-19 · 198 achados · 59 abertos · atualizado em 2026-09-19.
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
| tokens | · | · | · | 6 | 5 | · | 2 | · | · | · | 3 | · | · | 16 |
| movimento | · | · | · | 6 | · | · | · | · | 8 | · | · | · | · | 14 |
| composicao | · | · | · | · | 2 | 4 | 4 | 4 | · | · | 2 | · | 1 | 17 |
| paginas | · | · | · | · | · | · | · | · | · | 9 | · | · | · | 9 |
| instalacao | · | · | · | · | · | · | · | · | · | 1 | 2 | · | · | 3 |
| **total** | · | · | · | 12 | 7 | 4 | 6 | 4 | 8 | 10 | 7 | · | 1 | 59 |

## Por status

aberto 59 · corrigido 19 · aceito 0 · adiado 120

## Abertos que bloqueiam ou descumprem regra

| id | achado | onde | gravidade | lote |
|---|---|---|---|---|
| AUD-001 | Sem escala de duração e curva: 8 durações e 4 curvas literais nos keyframes | tailwind.config.ts:181-191 | alta | B2 |
| AUD-002 | duration-*/delay-* literais em componente | components/ui/toast.tsx:264 (+3) | alta | B2 |
| AUD-003 | Curva de transição literal em componente | components/ui/toast.tsx:264 (+2) | alta | B2 |
| AUD-004 | Tempo de animação em número solto no JS (setTimeout, *_MS) | components/ui/toast.tsx:147-148 (+2) | alta | B2 |
| AUD-005 | I12 não é sistêmico: motion-safe em 5 de 40 arquivos, motion-reduce em 1 | app/globals.css (+3) | alta | B2 |
| AUD-018 | disabled por opacity-50 literal em 14 lugares; não há token de opacidade | components/ui/button.tsx:14 (+6) | alta | B3 |
| AUD-019 | Scrim com alfa literal (/40) e um scrim em cor crua (neutral-900/50) | components/ui/modal.tsx:154 (+3) | alta | B5 |
| AUD-024 | z-index cru no Drawer | components/ui/drawer.tsx:300 | alta | B5 |
| AUD-025 | Foco em dois dialetos: outline (D6, 26×) e ring (20×, todo components/ds + páginas) | components/ds/shell.tsx:58 (+5) | alta | B3 |
| AUD-027 | A constante `foco` copiada em 4 arquivos | components/ui/drawer.tsx:50 (+3) | alta | B3 |
| AUD-035 | Pagination copia byte a byte a base do Button | components/ui/pagination.tsx:16-24 | alta | B3 |
| AUD-036 | Botão X de fechar em 4 cópias, 3 tamanhos de glifo, 2 tokens de hover | components/ui/modal.tsx:90 (+3) | alta | B4 |
| AUD-037 | Button size=icon cobre só 32px; 11 tamanhos de botão de ícone crus | components/ui/drawer.tsx:183 (+8) | alta | B4 |
| AUD-043 | Popover em 5 painéis, 4 posicionamentos e 3 click-fora | components/ui/select.tsx:204 (+4) | alta | B5 |
| AUD-046 | Drawer reimplementa a camada que vive em lib/use-camada.ts | components/ui/drawer.tsx:83-132 | alta | B5 |
| AUD-055 | Página de ícones inlina 3 botões e publica o snippet: ensina o antipadrão | app/foundations/icons/page.tsx:16-40 (+1) | alta | B8 |
| AUD-058 | /forms/select não existe: 6 consumidores e nav com pronto:false | components/ds/nav.ts:45 (+1) | alta | B8 |
| AUD-062 | Pseudocódigo (…) em 6 trechos publicados na aba Código | app/forms/date-picker/page.tsx (+5) | alta | B8 |

Mais 41 abertos de gravidade média/baixa, listados no JSON. `node scripts/consistencia.mjs lote <B>` imprime o checklist de um lote.

