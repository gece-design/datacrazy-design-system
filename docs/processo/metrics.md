# Métricas — DataCrazy
<!-- Template do kit. Preencher é obrigação do gate de cada lote (fw-ui); a
     consolidação é passo da retro (fw-github). A rodada de auditoria de
     consistência (2026-09-19) foi uma sessão contínua: o tempo por lote não
     foi cronometrado — está declarado como não medido, não estimado. -->

## Por lote

Lotes da auditoria de consistência (2026-09-19). "Diff" aqui é a regressão
visual do repouso contra a base (contrato da rodada: 0%), não o diff contra o
Figma — a remedição contra o arquivo fica para a rodada seguinte.

| Lote | Itens | Tempo (h) | Diff médio | Ciclos médios | Correções humanas | Data |
|------|-------|-----------|------------|----------------|-------------------|------|
| A · varredura e guarda-corpos | 85 achados · 6 scripts | não medido | — (base criada) | 1 | 0 | 2026-09-19 |
| B0 · regras | 4 | não medido | — | 1 | 3 decisões de gate | 2026-09-19 |
| B1 · docs e registry | 14 | não medido | 0% | 1 | 1 decisão de gate | 2026-09-19 |
| B2 · tokens de movimento | 12 | não medido | 0% (declarado: sidebar e home) | 1 | 0 | 2026-09-19 |
| B3 · foco e disabled | 8 | não medido | 0% | 2 (codemod refeito na página de ícones) | 0 | 2026-09-19 |
| B4 · família Button | 4 | não medido | 0% | 1 | 0 | 2026-09-19 |
| B5 · camada e popover | 6 | não medido | 0% | 3 (piscar do Drawer, foco de volta) | 2 decisões de gate | 2026-09-19 |
| B6 · campo e card | 4 | não medido | 0% | 1 | 0 | 2026-09-19 |
| B7 · movimento | 8 | não medido | 0% | 2 (traço das abas) | 2 decisões de gate | 2026-09-19 |
| B8 · páginas | 10 | não medido | 0% (declarado: sidebar, home, ícones) | 2 | 3 decisões de gate | 2026-09-19 |
| B9 · processo | 9 | não medido | — | 1 | 0 | 2026-09-19 |

## Por ciclo (consolidado na retro)

Achados: 198 (85 da varredura + 113 divergências migradas das docs) · fechados
na rodada: 172 corrigidos ou aceitos · adiados para a remedição contra o
Figma: 120 (lote `figma`) · fora desta rodada: 2 (`depois`).
Guarda-corpos: `check:tokens` 176 → 44 ocorrências · `check:doc-codigo`
55 → 0 erros · `check:exemplos` 54 → 0 · `check:rotas` 5 → 0 ·
`kfe-interactions audit` 7 → 0 divergências.
Baseline de fidelidade contra o Figma: não medida nesta rodada (ponte fechada).

## Notas de medição
- Tempo = relógio de trabalho no lote (gerar+verificar+gate), não calendário.
  Nesta rodada não foi cronometrado: registrar a partir da próxima.
- "Ciclos" = quantas vezes o lote voltou da verificação antes do gate.
