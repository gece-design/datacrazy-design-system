# Retro — DataCrazy · backlog de melhoria do kit
<!-- O que este produto aprendeu e que serve a qualquer produto. A fw-github
     sobe o que for genérico para .kfe-kit/ (calibration-global.md,
     interactions-global.md, scripts/, templates/). Escrito na auditoria de
     consistência, 2026-09-19. -->

## Regras do banco que o produto contradisse (decidir no kit)

| # | Regra do kit | O que o produto fez | Proposta |
|---|---|---|---|
| R1 | I10: fast 120 · base 200 · slow 320 | fast 150 (Tooltip aprovado e default de todo hover) · slow 280 (Drawer aprovado) — ADR-021 | A escala é do produto; o kit dá o padrão e o template pede o valor. `templates/interactions.md` não deve fixar 120/200/320 no vocabulário |
| R2 | I5: disabled com eventos mantidos | Ação e navegação bloqueavam eventos por 14 dias; virou I5 no gate B0 | Manter I5; o template de componente deve trazer `desabilitado` pronto (lib/estados) |
| R3 | I11: nunca animar width | Sidebar anima a largura com ADR-022; Toast já animava altura por grid | A regra vale; o precedente de "container que colapsa" merece uma linha própria no banco (animar por grid/transform quando der, ADR quando não) |
| R4 | I12 por `motion-safe:` em cada classe | 5 de 40 arquivos cumpriam. Redução global no CSS (D20) | Subir para o kit: a regra global no `globals.css` é o padrão; `motion-safe:` vira redundância aceitável |

## Ferramentas que faltavam no kit (candidatas a `scripts/`)

| # | Script | O que pega que o kit não pegava |
|---|---|---|
| F1 | `check-doc-codigo.mjs` | `kfe-docs audit` compara `.md` ↔ registro e nunca lê `components/ui/`: seis componentes sem doc passavam. Props, variantes e exports do TypeScript × tabela da doc; `--rascunho` escreve a tabela lendo o código |
| F2 | `check-exemplos.mjs` | Todo exemplo publicado compila (TS em memória), cita só componentes que existem e declara o que exige instalar |
| F3 | `check-tokens.mjs` com catraca | Valor fora do token por regra nomeada; a catraca (`scripts/baseline/`) deixa o check nascer verde sobre um repo que ainda o viola e só reprova o que piora |
| F4 | `regressao-visual.mjs` | Repouso a 0% por rota × tema, com relógio fixo e movimento reduzido; rota nova entra na base sem falhar |
| F5 | `consistencia.mjs` | Backlog com id estável (JSON dono, `.md` vista), checklist por lote e `verificar` que roda os checks |
| F6 | `lib/fonte.mjs` | Os parsers do gerador do registry compartilhados com os checks — um olho só sobre o código |

## Padrões de código que viraram regra local (candidatos ao banco global)

- D19 foco em contêiner que corta usa `ring-inset` · D20 movimento só pela escala, redução global · D21 helper de classe mora em `lib/`, nunca exportado de componente (o registry deriva dependências dos imports) · D22 painel flutuante usa `overlay-*` · D23 saída animada com estado derivado no render (efeito pisca) · D24 mudança visual declarada vira base nova só depois do gate.
- `useSaida`/`useMontado`, `useCliqueFora`, `usePosicao`, `PainelFlutuante`, `Scrim`, `BotaoFechar`: primitivos que todo produto com overlay precisa; candidatos a template.

## Processo

- **Gate por lote funcionou**: 12 decisões humanas em 9 lotes, nenhuma reaberta. As decisões antecipadas (perguntar no gate anterior o que o próximo lote precisa) pouparam uma rodada por lote.
- **Divergências abertas nas docs não são ADR**: 113 blocos migraram para o backlog como `adiado`. O template de componente deveria apontar para o backlog, não guardar a lista.
- **Deploy conferido por status, não por curl**: o CDN devolve a versão anterior; dois deploys falharam em silêncio por `.vercelignore` (pasta excluída por glob não se re-inclui) — memória do produto.
- **CI**: `.github/workflows/kfe.yml` foi escrito, mas o token OAuth do `gh` neste Mac não tem o escopo `workflow` e o GitHub recusa o push de arquivo de workflow. Fica no working tree até um `gh auth refresh -s workflow` seguido de `git add .github && git commit && git push` — ou subir o arquivo pela interface do GitHub.
- **Lint**: o repo não tem ESLint e a definição de pronto exige "lint verde". Decisão da rodada: não introduzir (centenas de avisos alheios numa rodada de repouso congelado). Próximo passo: `next lint` com `no-restricted-syntax` espelhando as regras do `check-tokens` — feedback no editor, que script não dá.
- **Tempo não cronometrado**: a rodada foi uma sessão contínua; `metrics.md` diz "não medido" em vez de estimar. Cronometrar a partir do próximo lote.

## Fora desta rodada (fica aqui para não sumir)

- Remedição contra o Figma (120 achados `adiado`): Button 13→12px, alvos de toque de 44, ícones fora da escala, pílulas do KPI, HeaderBusca, Select Menu do arquivo, os 113 blocos das docs.
- `ItemDoMenu` do Drawer duplica `SidebarItem`; snippet do preview derivado do JSX real; golden por estado (`tests/golden/`).
