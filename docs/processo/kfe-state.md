# Kill Front-End — estado
Produto: DataCrazy (CRM) · Cenário: **C — confirmado pelo humano em 2026-09-01** · Modo: new-ds
Kit: **v3.2** (atualizado em 2026-09-02) · Início: 2026-09-01 · Baseline de fidelidade: —

<!-- NOTA 2026-09-02: a docs/ foi migrada para a arquitetura de documentação do
     kit v3.2 (produto na raiz, maquinário do KFE em docs/processo/). O LOG
     abaixo é histórico e cita os caminhos que valiam na data de cada linha —
     não o corrija: mapa de equivalência no fim do arquivo. As tabelas e regras
     ACIMA do log já apontam para os caminhos novos. -->

<!-- REVISÃO 2026-09-01: o ciclo começou como cenário A (produto novo) e foi
     reclassificado ao receber o PRD com evidência (Artefato-01 Ponto Zero.pdf):
     o DataCrazy é um CRM em produção, front em Next.js, com base de tokens
     existente porém não governada. Rota B/C: AUDIT → ONBOARD → produção.
     A entrega continua sendo o design system (modo new-ds); telas ficam para
     ciclos new-screens futuros. -->

| # | Etapa (B/C) | Status | Gate | Aprovado em |
|---|-------------|--------|------|-------------|
| 0a | AUDIT | **parcial · bloqueada** (sem acesso ao repo · sem MCP do Figma) | humano (cenário) | cenário confirmado 2026-09-01 · métricas e telas-alvo pendentes |
| 0b | ONBOARD | pendente | humano (tokens/fonte) | — |

| # | Etapa | Status | Gate | Aprovado em |
|---|-------|--------|------|-------------|
| 1 | STACKS | **concluída** (v3) | humano | 2026-09-01 |
| 2 | SRS (brief do DS) | aguardando-gate | humano | — |
| 3 | INSTALL | **concluída** | técnico | 2026-09-01 |
| 4 | MCP | pendente | humano | — |
| 5 | UX (direção visual + inventário) | pendente | humano (forte) | — |
| 6 | UI (fundações + componentes + showcase) | pendente | humano por lote | — |
| 7 | DOC | pendente | técnico | — |
| 8 | QA (reduzido: golden + a11y) | pendente | humano | — |
| 9 | GITHUB (DS instalável + doc de uso) | pendente | humano (final) | — |

## Bloqueios ativos
| # | O quê | Trava |
|---|-------|-------|
| B1 | Sem acesso ao repositório `datacrazy-front-end` — humano informou que **não consegue fornecer agora**; segue como **dívida declarada** | Fechar a AUDIT · mineração de tokens da ONBOARD · confirmar a stack · escrever o DS (que mora nesse repo) |
| ~~B2~~ | **RESOLVIDO** · o Figma Dev Mode MCP Server está rodando em `127.0.0.1:3845/mcp` e foi registrado em `.mcp.json` (6 ferramentas: get_design_context, get_figjam, get_metadata, get_motion_context, get_screenshot, get_variable_defs). Requer reiniciar a sessão para uso nativo | — |
| ~~B3~~ | **RESOLVIDO** · anti-referências lidas do FigJam via MCP: 15 stickies em "O que MENOS gosta" + 15 em "O que MAIS gosta" (PASSO 3 · DEFINE) | — |
| ~~B6~~ | **RESOLVIDO** · a fonte é **Geist** (+ Geist Mono), decidida pelo humano e verificada nas 72 variáveis `text/*` do Figma | — |
| B7 | **Migração Inter → Geist** no app: o código roda Inter, o Figma define Geist. Enquanto não migrar, todo diff falha por motivo errado | Tela piloto · qualquer medição de fidelidade |
| B8 | **Estrutura de tema da cor**: `Bg`/`Surface escura`/`Surface elevada` são variáveis separadas, não modes claro/escuro. Se não houver modes, os dois temas exigem duplicar componente | Etapa 6 · requisito R1 |
| ~~B4~~ | **RESOLVIDO** · a home é a tela de **dashboard** do Figma, confirmada pelo humano | — |
| B9 | **O Figma inteiro é rascunho** (humano, 2026-09-01). A regra "Figma é a verdade absoluta" não tem onde se apoiar ainda: o arquivo precisa ser construído antes de gerar código | Etapa 6 · qualquer medição de fidelidade |
| B5 | Casa do DS **decidida**: dentro do repo `datacrazy-front-end` — o que torna o acesso (B1) ainda mais crítico | INSTALL sobre repo existente |

## Lotes (modo new-screens)
| Lote | Telas/Componentes | Tempo (h) | Diff médio | Gate em |
|------|-------------------|-----------|-----------|---------|

## Rascunhos fora de gate
<!-- Produzidos sem pedido do humano e sem passar por gate. NÃO contam como
     entrega de etapa e não avançam o fluxo. Ficam parados até ordem explícita. -->
| Artefato | Etapa a que pertenceria | Status |
|---|---|---|
| `docs/processo/tokens-migracao.md` (era `tokens-figma.md`) | ONBOARD (extração) | rascunho · leitura de fonte, não aprovada |
| `docs/processo/inventario-componentes.md` | 5 · UX | rascunho · passou por cima do gate forte |
| `docs/processo/ux-direcao-visual.md` | 5 · UX | rascunho · anti-referências são leitura de fonte; a interpretação não foi aprovada |

## Exceções aprovadas

**E-01 · O Figma não precisa desenhar todos os estados de interação**
*Aprovada pelo humano em 2026-09-01.*

O kit exige, como critério **bloqueante** do checklist, "variantes para TODOS
os estados que a spec exige (hover/focus/active/disabled/loading/empty/error)".
Fica suspenso.

- **O que o Figma passa a dever:** tokens/variáveis · estado de repouso ·
  variantes **estruturais** (tamanho, tipo, densidade) · layout e geometria.
- **O que sai do Figma:** estados de interação (hover, focus, active,
  disabled, loading). Passam a ser **derivados por regra** a partir de tokens
  existentes, documentados em `docs/processo/interactions.md`.
- **Motivo do humano:** não gastar tempo desenhando no Figma o que uma regra
  resolve uma vez; ganhar velocidade sem perder fidelidade.
- **Como a fidelidade se sustenta:** a regra derivada é sempre ancorada num
  token que existe. Onde não existe token, **não se inventa** — decide-se com
  o humano e o token passa a existir. Cada correção vira linha em
  `docs/processo/calibration.md` — é a "inteligência que vai sendo alimentada".
- **Risco assumido:** a verificação por diff de pixels passa a valer para o
  estado de repouso. Estado de interação é verificado por regra e revisão, não
  por comparação com o Figma.

## Log
- 2026-09-01 · Kit KFE v3.0 instalado a partir de github.com/gabrielcorreadesign-rgb/kill-front-end (fonte: kill-front-end-v3.0.zip do branch main); kit vendorizado em .kfe-kit/, skills e commands em .claude/
- 2026-09-01 · Modo new-ds · Cenário A (presumido) · Etapa 1 (STACKS) iniciada
- 2026-09-01 · STACKS v1 · base Vite+React decidida sob o pressuposto de produto novo · GATE aprovado pelo humano
- 2026-09-01 · Etapa 2 (SRS · brief do DS) iniciada
- 2026-09-01 · SRS · decisões do humano: marca no Figma · DS para produto único · temas claro E escuro · cobertura = fundações + componentes básicos
- 2026-09-01 · **RECLASSIFICAÇÃO** · PRD com evidência recebido (Artefato-01 Ponto Zero.pdf, 18/08/2026): DataCrazy é CRM em produção, front Next.js + Tailwind + Radix + next-intl, tokens em globals.css, dark mode incompleto. Cenário A → **C proposto**. Rota passa a exigir AUDIT → ONBOARD
- 2026-09-01 · STACKS v2 · decisão de stack **revogada** e substituída por retrato da stack existente (Next.js, não Vite) · volta a aguardando-gate
- 2026-09-01 · SRS v2 · docs/prd.md reescrito com o produto real, o problema com evidência (22 tickets em ~2.700) e 6 requisitos confirmados (R1–R6)
- 2026-09-01 · AUDIT · docs/audit.md criado **parcial**, sobre evidência secundária · classificação proposta: cenário C · status bloqueada (B1, B2)
- 2026-09-01 · Artefatos novos: docs/referencias.md (Figma, FigJam, landing, referências de interface)
- 2026-09-01 · GATE 0a AUDIT (parcial) · humano confirmou: produto existente, **cenário C**. Falta do gate: telas-alvo do primeiro lote. Métricas seguem não medidas (B1, B2)
- 2026-09-01 · Antecipados (artefatos da etapa 4, a pedido do humano para refinar o Figma): docs/figma-checklist.md e docs/fonts-checklist.md
- 2026-09-01 · Decisão do humano: o DS mora **dentro do repo existente** (`datacrazy-front-end`), não em pacote separado
- 2026-09-01 · Decisão do humano: primeiro lote = **moodboard + home**. Moodboard é entrega da etapa 5 (direção visual); "home" a desambiguar
- 2026-09-01 · Decisão do humano: "home" = **tela inicial do CRM após login** → será a tela piloto da baseline de fidelidade
- 2026-09-01 · Humano não consegue fornecer acesso ao repo agora → B1 vira dívida declarada; ciclo segue pela direção visual
- 2026-09-01 · Tentativa de leitura do FigJam por fetch: **falhou** (retornou página vazia — confirma B2 na prática)
- 2026-09-01 · Artefatos criados: docs/calibration.md (semeado da calibração global do kit) · docs/direcao-visual.md (brief do moodboard: 8 eixos + papéis das referências)
- 2026-09-01 · **B2 RESOLVIDO** · descoberto que o Figma Dev Mode MCP Server já roda localmente (127.0.0.1:3845). Registrado em `.mcp.json`. Ferramentas disponíveis incluem get_variable_defs (tokens do Figma) e get_figjam
- 2026-09-01 · **B3 RESOLVIDO** · FigJam lido via MCP: 30 stickies de referência/anti-referência extraídos do PASSO 3 · DEFINE
- 2026-09-01 · Do FigJam: 5 categorias de componentes já fechadas em contrato (Ações, Formulários, Navegação, Exibição de dados, Feedback e sobreposições); benchmarks e DS de referência; contexto de empresa; 3 análises de desk research
- 2026-09-01 · **B6 NOVO** · tipografia deixa de ser dado resolvido: o board questiona a Inter. Licença ≠ escolha
- 2026-09-01 · Artefatos atualizados: direcao-visual.md (v2, com anti-referências), regras.md (A1–A9 e G1–G11), referencias.md, fonts-checklist.md, prd.md
- 2026-09-01 · **B6 RESOLVIDO** · humano confirmou: a fonte é a que está no Figma. Verificado: **Geist** (página TYPOGRAPHY = "Fonte Geist"; 72 variáveis text/* com family=Geist; font/family/mono=Geist Mono)
- 2026-09-01 · **MINERAÇÃO DE TOKENS pelo lado do Figma** · 92 variáveis extraídas via get_variable_defs em 5 páginas → docs/tokens-figma.md. Tipografia completa (15 papéis, escala 10–26px, hierarquia por peso); cor com 16 variáveis, 3 de componente (nav/item/*)
- 2026-09-01 · **B7 NOVO** · divergência Inter (código) vs. Geist (Figma) → migração de fonte no app
- 2026-09-01 · **B8 NOVO** · cor sem estrutura de modes claro/escuro no Figma (F3 em tokens-figma.md)
- 2026-09-01 · Problemas de token registrados: `Color`/`Color 2` sem nome · `Branco`/`Gelo`/`Neve` com nome literal · arquitetura inconsistente entre tipografia (agrupada) e cor (solta)
- 2026-09-01 · Etapa 5 · tela lida via MCP (get_screenshot em 135:2, "Dashboard — BoardUI style / Datacrazy") → docs/inventario-componentes.md com os componentes por categoria
- 2026-09-01 · Contradição aberta: os gráficos da tela têm eixo e legenda, o que contraria as anti-referências nº 13 e o gosto nº 12. Decisão humana
- 2026-09-01 · Prontidão do Figma: 18 frames nomeados só "Breakpoint // Desktop" e formas "Rectangle N" — reprovam o critério de nomes semânticos do checklist
- 2026-09-01 · Humano apontou excesso de escopo: o pedido era conferir a tipografia. tokens-figma.md e inventario-componentes.md ficam como RASCUNHO fora de gate; etapa 5 volta a pendente
- 2026-09-01 · Humano confirmou em definitivo: **produto já existente**; a entrega é **REFAZER** o design system (refazer e melhorar os componentes), e só depois as telas
- 2026-09-01 · Humano confirmou: a home é a tela de **dashboard** do Figma
- 2026-09-01 · **B9 NOVO** · humano informou que tudo no Figma é rascunho → o arquivo precisa ser construído (variáveis + componentes) ANTES de servir como fonte de verdade
- 2026-09-01 · Humano apontou que a stack do DS **é escolhível** neste projeto (biblioteca de componentes), não apenas retrato do que existe → gate 1 reaberto como decisão, não descrição
- 2026-09-01 · Direção do humano: montar as primeiras páginas como **biblioteca de componentes**, nas 5 categorias, com base no PRD e no contrato
- 2026-09-01 · STACKS v3 · decisões do humano: biblioteca nasce **aqui** (datacrazy-frontend) · entrega **estilo shadcn** (código no projeto, sem pacote) · showcase em **página única** (referência visual a ser enviada pelo humano)
- 2026-09-01 · STACKS v3 · decisões minhas, sujeitas ao gate: ambiente Next.js aqui (espelha o destino), base shadcn/ui sobre Radix, ícones Lucide (anti-referência nº 14), ferramental cva + tailwind-merge + clsx
- 2026-09-01 · STACKS v3 · risco novo registrado: **versão do Tailwind** do CRM desconhecida (v3 vs v4 declaram tokens de forma diferente) — depende de B1
- 2026-09-01 · **GATE 1 STACKS APROVADO** pelo humano · etapa 1 concluída na v3
- 2026-09-01 · **EXCEÇÃO E-01 aprovada**: Figma não desenha estados de interação; eles viram regra derivada de token (ver docs/estados-interacao.md). Suspende o critério bloqueante do checklist
- 2026-09-01 · Humano vai enviar link da **biblioteca de ícones** → Lucide fica PROVISÓRIO até o link chegar
- 2026-09-01 · Reforçado pelo humano: objetivo do projeto é criar o design system com componentes e SÓ DEPOIS as telas; o Figma hoje é rascunho e será construído junto, variável a variável, "sem inventar"
- 2026-09-01 · Biblioteca de ícones definida pelo humano: **Phosphor** (@phosphor-icons/react, 9.000+ ícones, 6 pesos, MIT). Substitui Lucide. Conflito com a anti-referência nº 14 registrado; mitigação = fixar um peso só
- 2026-09-01 · Tipografia auditada: **14 dos 15 papéis completos**. `text/heading-1` tem só line-height e tracking — faltam size, family e weight
- 2026-09-01 · A pedido do humano, auditada a cor do Figma e criada docs/tokens-proposta.md: 7 problemas (P1–P7) e estrutura proposta com modos Claro/Escuro. Destaques: não existe token de cor de texto nem de borda; tema escuro tem 3 valores e são incoerentes entre si
- 2026-09-01 · Bridge de escrita do Figma configurado: figma-console-mcp registrado em .mcp.json; servidor testado (121 ferramentas, incluindo escrita de variáveis). Plugin Desktop Bridge conectado ao Figma. **Falta reiniciar a sessão** para o MCP carregar aqui
- 2026-09-01 · tokens/color.figma.json criado: 18 tokens, modos Claro/Escuro, pronto para figma_setup_design_tokens (aplicar com dry-run antes). 9 tokens usam valor que já existia; 8 têm algum valor derivado
- 2026-09-01 · Deixados FORA do arquivo por não terem origem: warning, info, accent/active, success/subtle, danger/subtle — são matiz nova ou valor novo, decisão do humano
- 2026-09-01 · **CORREÇÃO IMPORTANTE** · leitura real das variáveis via figma-console: **112 variáveis em 2 coleções** ('Cor' 31 · 'Tipografia' 81). O MCP Dev Mode só devolvia as variáveis USADAS pelo nó consultado — por isso eu via 92 e concluí lacunas que não existem
- 2026-09-01 · Corrigido: `text/heading-1` está **completo** (family, weight, size) — não havia lacuna na tipografia. Existem também font/family/sans e font/weight/{regular,medium,semibold,bold}
- 2026-09-01 · Corrigido: **Warning, Warning hover, Info, Info hover, Success hover e Danger hover EXISTEM**. Eu havia afirmado que warning e info não existiam
- 2026-09-01 · Corrigido: escala Primary vai de 50 a 700 (50,100,200,300,400,500,600,700), não só 100–400. nav/item tem também bg-hover e text-default
- 2026-09-01 · **O problema real confirmado**: cada coleção tem UM único modo ('Mode 1' em Cor, 'Padrão' em Tipografia). Não há claro/escuro. É o P3/P7 — e agora é o único problema estrutural de fato
- 2026-09-01 · tokens/color.figma.json marcado OBSOLETO: criaria coleção duplicada. Plano correto = figma_add_mode na coleção 'Cor' existente + preencher valores do modo escuro
- 2026-09-01 · **COLEÇÃO `Cor` REESTRUTURADA NO FIGMA** (via figma-console): modos Claro/Escuro criados · 27 variáveis renomeadas por papel medido em 84.775 nós · inversão de alias primary/base-blue-500 corrigida · 3 tokens criados (border, primary-foreground, ring) · 21 textos religados a primary-foreground · sidebar religada aos semânticos no componente-mãe · 521 bordas soltas #E1E7EF ligadas ao token border
- 2026-09-01 · Verificado por render do dashboard (130:12522) nos dois modos; frame devolvido ao Claro
- 2026-09-01 · Único valor não originário do arquivo: border no Escuro (#2E2E38)
- 2026-09-01 · docs/tokens-cor.md criado; tokens-figma.md, tokens-proposta.md e tokens/color.figma.json apagados (eram especulativos)
- 2026-09-01 · **SITE DO DESIGN SYSTEM NO AR** em http://localhost:4321 · Next.js + Tailwind v3 + Geist + Phosphor · estrutura inspirada no boardui.com/components (referência do humano)
- 2026-09-01 · app/globals.css e tailwind.config.ts gerados como ESPELHO do Figma: 23 tokens semânticos nos dois temas, 8 primitivos da rampa azul, 15 papéis tipográficos. Regras G1 (leading em px) e G2 (tracking em em) aplicadas na exportação
- 2026-09-01 · Verificado no bundle: .text-display = 26px/32px/-0.0231em/600 — bate com o Figma. Bloco .dark presente. Todas as 7 rotas em 200, sem erro
- 2026-09-01 · Componentes implementados: Button (4 variantes, 3 tamanhos), Card, Badge (6 variantes). Fundações: Cor, Tipografia, Ícones
- 2026-09-01 · Nota: --border #E1E7EF convertido dá 214.3 30.4% 91.0%, praticamente idêntico ao border padrão do shadcn (214.3 31.8% 91.4%) — o design já seguia a convenção
- 2026-09-01 · Playwright instalado (+ pixelmatch, pngjs) · scripts/shot.mjs e scripts/medir.mjs criados · checagem anti-fallback de fonte passa: font-family computado = GeistSans
- 2026-09-01 · **BUG ENCONTRADO E CORRIGIDO POR MEDIÇÃO**: tailwind-merge descartava as classes da escala tipográfica (colidia com as de cor), fazendo componentes caírem nos 16px do navegador. Corrigido em lib/utils.ts com extendTailwindMerge. Virou regra D1 em docs/calibration.md
- 2026-09-01 · Site verificado nos dois temas por screenshot; tema escuro do Figma funciona no código
- 2026-09-01 · Site do DS reconstruído seguindo boardui.com/components como referência visual, medida com Playwright (não estimada): sidebar flutuante 260px com m-3, radius 24px e fundo `background`; itens de 32px com linha-guia; busca com ⌘K; categorias colapsáveis; header com trilha; abas Preview/Código; caixa de preview em radius 2xl; índice "Nesta página" à direita; home em grade de cards com preview ao vivo
- 2026-09-01 · Itens não implementados agora ficam **desabilitados** (sidebar e cards) a pedido do humano — não clicáveis, opacidade reduzida, com marcador "em breve"
- 2026-09-01 · Divergências deliberadas do Board UI: tipografia usa nossos tokens (item 13px contra 14px deles; h1 26px contra 24px) porque valor fora do token quebraria a regra do próprio DS; item ativo usa `accent` em vez do cinza deles
- 2026-09-01 · Verificado por screenshot nos dois temas (home e página de componente)
- 2026-09-01 · Humano trouxe o layout do Board UI para dentro do Figma (node 255:6493) → sidebar refeita com medidas EXTRAÍDAS, não estimadas: 260 de largura, padding 13, conteúdo 234, busca h36/p8/ícone 20/kbd 28x20, cabeçalho h28 px10 chevron 16, item h32 passo 34, ícone em x=32, texto em x=56, árvore em x=12,5 com cotovelos de 11px, grupos separados por 8
- 2026-09-01 · Logo Systemcrazy exportado do Figma (node 254:6270) para components/ds/logo.tsx com currentColor — um componente serve os dois temas (o humano tinha as duas versões, 254:6270 clara e 255:6483 escura)
- 2026-09-01 · Itens indisponíveis passaram a usar cadeado em vez do selo "EM BREVE", que virava uma parede visual
- 2026-09-01 · **AUDITORIA DA SIDEBAR** por medição dos dois lados: geometria já batia (largura, raio, padding, alturas, posições da árvore); divergiam tipografia, peso, raio e cor. 8 divergências corrigidas; 22 de 22 checagens passando
- 2026-09-01 · Criadas classes `.chrome-*` em globals.css para a moldura do site, separadas dos tokens do produto — decisão do humano de que layout do site ≠ design system. Vira regra D3 na calibração
- 2026-09-01 · scripts/auditar-sidebar.mjs criado: compara o render contra o spec do Figma campo a campo
- 2026-09-01 · Árvore da sidebar refeita a partir do SVG real do Figma (node 255:6522): curva de raio 5 no cotovelo e vertical terminando no centro do último item — antes era traço reto com linha até o fim do grupo. Vira regra D5 na calibração
- 2026-09-01 · Ajustes pedidos pelo humano, todos aplicados: árvore virou SVG de verdade (components/ds/tree.tsx, caminho gerado pela fórmula do Figma) · traço com o valor exato #D4D4D4 em vez de borda com alpha · logo centralizado · fundo da busca trocado de `border` (puxava para o azul) para cinza neutro · raio da sidebar 24→16 · texto dos itens de `muted-foreground` para `foreground` (mais contraste) · selo "new" em todo item com página pronta · títulos das categorias em inglês · seção Getting Started com Let's begin e Installation
- 2026-09-01 · Rotas migradas para inglês: /foundations, /actions, /forms, /navigation, /data-display, /feedback, /getting-started
- 2026-09-01 · Espaçamento do conteúdo medido no boardui.com e replicado: sidebar 12→272 · conteúdo 324→1132 (808) · índice 1180→1400 (220, colado à direita). Três de três batendo
- 2026-09-01 · Botão de fechar a sidebar adicionado no header (SidebarSimple), com aria-expanded
- 2026-09-01 · Grade de 3 colunas extraída para components/ds/colunas.tsx e compartilhada entre header e conteúdo: breadcrumb, botão de menu e seletor de tema agora acompanham a coluna do meio em qualquer largura (verificado em 1440/1920/2560)
- 2026-09-01 · Conteúdo passou a se CENTRALIZAR no espaço entre sidebar e trilho (antes ficava colado à esquerda com um vão no meio em tela larga). Índice preso à direita com 40 de margem. Vãos equilibrados nas 4 larguras testadas
- 2026-09-01 · Botão de tema flutuante adicionado: some no topo, aparece depois de 120px de scroll
- 2026-09-01 · **Padrão de página** definido a partir de boardui.com/components/typography → docs/padrao-de-pagina.md. Novos componentes: ComoFunciona, Chip, e Secao com spec + aba Código funcional
- 2026-09-01 · Página Typography reescrita no padrão: descrição com números, bloco "Como funciona" com 4 parágrafos (incluindo a armadilha real do tailwind-merge), e cada amostra com o nome do token em mono
- 2026-09-01 · **PADRÃO DE PÁGINA CORRIGIDO** a pedido do humano: aba Preview/Código só aparece onde existe JSX real a copiar. Seção de referência (paleta, escala, grade de ícones, explicação) não ganha aba — antes eu tinha posto em tudo, inclusive em bloco explicativo
- 2026-09-01 · "Let's begin" passou a apontar para a home (a própria página de componentes com os cards de preview e atalho); a página separada foi removida — duas URLs com o mesmo papel era erro
- 2026-09-01 · **7 páginas reescritas no padrão** por workflow (14 agentes: uma escreve, outra revisa contra 8 critérios). Resultado verificado: tsc limpo · 8 rotas em 200 · índice batendo com as seções em todas · fonte Geist · zero erro de console · zero cor inline fora de token
- 2026-09-01 · Abas de código na distribuição certa: 0 nas páginas de referência (home, installation, color, typography), 1 em icons (o import), 3 em button, 3 em card, 2 em badge
- 2026-09-01 · **Build de produção verde**: 11 páginas estáticas. E as afirmações medidas das páginas conferem — /foundations/icons = 69,7 kB (a página diz "passa de 69 kB"), /foundations/typography = 3,91 kB (diz "3,9 kB")
- 2026-09-01 · scripts/verificar-paginas.mjs criado: percorre as rotas conferindo status, erros de console, índice x seções, fonte computada e estilo inline com cor fora de token
- 2026-09-01 · **DEFEITO REAL ENCONTRADO E CORRIGIDO** (achado pela agente que escreveu a página do Button): o foco usava `ring-2` + `ring-offset-background`, e o offset do ring é pintado com COR SÓLIDA — dentro de card, modal ou linha de tabela virava halo cinza. Trocado por `outline` com `outline-offset`, cujo vão é transparente. Verificado: outline 2px solid #3385FF, offset 2px, box-shadow none. Vira regra D6 na calibração
- 2026-09-01 · **DIVERGÊNCIA DA FONTE DE VERDADE corrigida**: a página do Card aplicava `font-mono` nos valores de KPI. O raciocínio (alinhar dígitos) estava certo, mas `text/metric` declara Geist no Figma — trocar a família seria o código decidindo o que o arquivo não decidiu. Trocado por `tabular-nums`: mesma família, mesmo peso, colunas alinhadas. Verificado: GeistSans 16px/600 tabular-nums. Vira regra D7
- 2026-09-01 · Tema escuro verificado nas 8 páginas: nenhum texto escuro sobre fundo escuro
- 2026-09-01 · Verificação final: 8 de 8 páginas passando em todos os critérios
- 2026-09-01 · **ROADMAP DE COMPONENTES CONCLUÍDO** · docs/roadmap-componentes.md, 840 linhas · 296 itens brutos levantados por 4 ângulos independentes → 97 componentes, 27 primitivos e 3 verificações, em 9 lotes, com escopo negativo e mapa de cobertura
- 2026-09-01 · A crítica de completude achou e corrigiu: 1 componente catalogado que não estava em lote nenhum (Popover), **9 dependências apontando para lote posterior**, 3 regras dos docs sem item, 2 primitivos faltando (Pointer Drag, Token Bridge), 2 bloqueios novos (B7 de onde vem o desenho · B8 paleta categórica), 1 item sem evidência devolvido ao escopo negativo (Context Menu), e a divergência entre o roadmap e o NÃO-ESCOPO §5.4 do PRD
- 2026-09-01 · **A crítica estava certa sobre o E4**: scripts/check-temas.mjs criado e reprova com 8 tokens de estado repetindo valor entre Claro e Escuro. O DS reintroduziu o bug #80174 que existe para eliminar
- 2026-09-01 · Correção NÃO aplicada de propósito: o Figma é a origem e a ponte de escrita estava fora do ar. Editar globals.css direto quebraria o espelho. Proposta pronta em docs/tokens-estados-escuro.md + tokens/estados-escuro.json, com a derivação espelhando a relação já aprovada do primary (no claro o hover escurece, no escuro clareia)
- 2026-09-01 · npm scripts adicionados: check:temas, check:paginas e check (typecheck + os dois). Vira regra D8 na calibração
- 2026-09-02 · **KIT ATUALIZADO v3.0 → v3.2** a partir de github.com/gece-design/kill-front-end (repo novo, conteúdo descompactado — não mais o zip). Novidades herdadas: arquitetura de documentação (doc-architecture.md), banco global de interações I1–I15 (interactions-global.md), scripts kfe-docs.mjs e kfe-interactions.mjs, templates/docs/ e templates/components-registry.json
- 2026-09-02 · **DOCS MIGRADAS para a arquitetura v3.2** · `kfe-docs init` moveu prd→00-visao-geral, stack→01-arquitetura e o maquinário para docs/processo/. Reorganização manual do que o kit não prevê: tokens-cor + direcao-visual fundidos em 02-design-system (produto), com a evidência em processo/ux-direcao-visual e a procedência em processo/tokens-migracao; padrao-de-pagina virou seção de 04-navegacao; estados-interacao virou processo/interactions; roadmap, inventário, referências e tokens-estados-escuro foram para processo/. Nenhum conteúdo descartado
- 2026-09-02 · Criados do template e preenchidos sem inventar: 03-contrato-api (declara o que NÃO se sabe), 05-contratos (candidatos visíveis, não formalizados), 04-navegacao (rotas do site do DS, dono = components/ds/nav.ts). objetos/ e features/ ficam VAZIOS por decisão de escopo, com a razão escrita no README de cada um
- 2026-09-02 · Referências de caminho corrigidas em 45 arquivos (docs, README, app/**/page.tsx, globals.css, scripts) — nenhum caminho citado aponta mais para arquivo inexistente
- 2026-09-02 · `kfe-docs audit`: **0 erro**, 5 avisos (4 de tamanho >150 linhas, 1 de caminhos canônicos que nascem em etapas futuras)
- 2026-09-02 · **DÍVIDA NOVA** · `docs/componentes/` está vazio, mas Button, Badge e Card já existem em código, e `processo/components-registry.json` não existe. Enquanto a fw-doc não rodar sobre eles, a verdade desses três está no código. Registrado no README de docs/componentes/
- 2026-09-02 · **PENDENTE de reconciliação** · o kit v3.1 trouxe as duas camadas de verdade e o banco I1–I15; `processo/interactions.md` deste produto foi escrito antes disso e ainda não foi reconciliado com o formato do `templates/interactions.md` nem com o banco global
- 2026-09-03 · **ETAPA 6 · LOTE KPI CARD** · component set `269:53` (KPI Card) extraído via MCP Dev Mode e implementado em `components/ui/kpi-card.tsx` + showcase em `/data-display/kpi-card`. Eixos do Figma: Trend (Neutral/Up/Down) × Style (Fill/Outline) × theme (Light/Dark) — os dois primeiros viraram prop, `theme` NÃO (sai dos tokens sob `.dark`, senão é o bug #80174 de volta)
- 2026-09-03 · KPI Card · verificação por medição de valor computado: **37/37 campos batendo** (`scripts/medir-kpi-card.mjs`). Tema escuro conferido à parte: todos os tokens caem no valor escuro documentado, altura 148 nos dois temas, zero ramificação por tema no código
- 2026-09-03 · KPI Card · **diff de pixels NÃO medido**: exportar o PNG do frame depende da ponte `figma-console`, que está fora do ar (plugin Desktop Bridge não aberto). A metade objetiva do protocolo (geometria + cor, campo a campo) foi feita; a metade por imagem fica pendente
- 2026-09-03 · **REGRA D14 na calibração**: o Figma desenha `stroke` POR DENTRO, o CSS soma POR FORA. `border p-[18px]` engorda a caixa; o certo é **borda + padding = padding do Figma** (`border p-[17px]`). Achado por medição — o card fechava em 152 em vez de 148, somando 2px do card e 2px do chip
- 2026-09-03 · KPI Card · glifos EXPORTADOS do Figma (não redesenhados, não trocados por Phosphor equivalente); `#3385FF` fixo virou `currentColor` para o token mandar na cor
- 2026-09-03 · **DECISÃO DO HUMANO** · a descrição do componente no Figma promete success/destructive por tendência, mas os glifos do arquivo estão os dois em `primary`. Escolhido **seguir o arquivo** (tudo primary). Ou o arquivo se corrige, ou a descrição
- 2026-09-03 · KPI Card · **3 divergências abertas para o gate**: (1) cor do trend acima; (2) `Style=Outline` só está desenhado para `Trend=Down` — Neutral e Up saíram por derivação da regra das três superfícies, não por desenho; (3) no tema escuro a borda do Outline é `card` (#1E1E24) sobre `background` (#1C1C25) e some — provavelmente deveria ser o token `border`
- 2026-09-03 · Pré-voo da etapa 6 estava furado: criados `scripts/pixel-diff.js` (do kit) e `docs/processo/components-registry.json`. Continua faltando `tests/golden/` e a reconciliação do `interactions.md` com o formato v3.2
- 2026-09-03 · KPI Card · `docs/componentes/KpiCard.md` escrito no template; `kfe-docs audit` **0 erro**; build verde com 13 rotas; `check:paginas` todas passando. `check:temas` segue reprovando nos mesmos 8 tokens de estado (dívida antiga, nenhum usado por este componente)
- 2026-09-03 · Nota de ferramenta: o `rtk` devolveu saída corrompida de `git status`, `git stash` e `ls` nesta sessão (um "stash fantasma" e um falso "árvore limpa"). Conferir com `rtk proxy "<cmd>"` antes de concluir qualquer coisa a partir de saída de git
- 2026-09-03 · **Card REMOVIDO do DS** a pedido do humano: `app/data-display/card/` e `components/ui/card.tsx` apagados, o KPI Card fica no lugar. Religados: item do `nav.ts`, preview e descrição da home (`app/page.tsx`), rota do `verificar-paginas.mjs` e a nota de dívida do `components-registry.json`. Os dois arquivos estão no commit 25fce50, então dá para restaurar
- 2026-09-04 · **ETAPA 6 · LOTE FUNDAÇÕES** · página `↳ Tokens` do Figma (node 329:27586) extraída inteira: cinco seções — Cores (431:2524), Tipografia (431:2953), Espaçamento (431:2893), Elevação (431:3016) e Raio (431:2860)
- 2026-09-04 · **DÍVIDA DOS 8 TOKENS DE ESTADO QUITADA.** O Figma passou a dar o par escuro de `success`, `destructive`, `warning`, `info` e seus quatro `-hover`. `npm run check:temas` ficou **verde pela primeira vez**. A proposta em `processo/tokens-estados-escuro.md` foi marcada como resolvida — o valor veio do arquivo, não da derivação
- 2026-09-04 · Duas correções que o Figma trouxe junto: `subtle-foreground` no escuro deixa de espelhar o claro e vira `#8B95A3`; `primary-foreground` no escuro vira `#10131A` e sai da lista de intencionais do `check:temas` — branco sobre o azul claro do escuro dava ~2,5:1, abaixo de AA
- 2026-09-04 · Tokens novos: primitivo `base/neutral/800`, 11 de **formulário** (`input/*`) e 6 de **overlay**. Os 11 de formulário são alias exato de semânticos que já existiam nos DOIS modos, então vivem só no `:root` — `var()` acompanha o tema sem uma linha no `.dark`
- 2026-09-04 · **Raio** ganhou os 7 degraus (0 · 2 · 4 · 6 · 8 · 12 · 999), todos derivados de `--radius`. Encerra a pendência do eixo Forma. **Elevação** ganhou 4 níveis com todas as camadas (G4); os nomes `sm`–`xl` sobrescrevem os do Tailwind de propósito, para a sombra de fábrica deixar de ser alcançável
- 2026-09-04 · **Espaçamento não gerou código**: os 14 degraus do Figma caem exatos na escala do Tailwind. Documentado o mapa; nada a estender
- 2026-09-04 · Showcase: três páginas novas em `/foundations/` — Spacing, Radius e Elevation. Todas no `nav.ts` e no `verificar-paginas.mjs`
- 2026-09-04 · Bug meu corrigido em 4 páginas: `<ComoFunciona>` já cria a própria seção e o próprio `h2`, e eu vinha embrulhando em `<Secao titulo="Como funciona">` — saía título duplicado. Atingia também a página do KPI Card, feita ontem
- 2026-09-04 · Nota de ambiente: `npm run build` morria com `signal 9`, `PageNotFoundError` e `Cannot find module './611.js'`. Não era o código — era **falta de memória** somada a um `next dev` concorrente escrevendo no mesmo `.next`. Receita: matar o dev server e buildar com `NODE_OPTIONS=--max-old-space-size=4096`. Para verificar páginas nesta máquina, `npm run start` sobre o build pronto gasta uma fração do `npm run dev`
- 2026-09-04 · **REVISÃO DO KPI CARD** (node 329:27352, canvas `↳ Cards`). Três tokens mudaram no Figma: `background` claro `#F4F5F6`→`#EBEDEF`, `background` escuro `#1C1C25`→`#16161D` e `card` escuro `#1E1E24`→`#25252D`
- 2026-09-04 · **Divergência 3 do KPI Card RESOLVIDA por tabela**: com `card` e `background` separados no escuro, a borda do Outline deixou de ser invisível. Não precisou de código
- 2026-09-04 · KPI Card · Fill remedido: recuo 18→16 e gap 14→12, agora ligados a variável no arquivo (`space/16`, `space/12`). O slot do ícone deixou de ser quadrado fixo de 28 com glifo por cima e passou a abraçar o conteúdo — seta de 16 com recuo 6 dá 28, três barras de 13 com recuo 7 dão 27. É por isso que o card do Neutral fecha 1px mais baixo (139) que o de seta (140); numa fileira todos esticam para 140
- 2026-09-04 · KPI Card · slot e chip perderam o traço no Fill: o arquivo dá só preenchimento. Com a borda que havia, a caixa fechava em 30 em vez de 28. Medição: **38/38 campos batendo**
- 2026-09-04 · **BLOQUEIO ABERTO · Style=Outline foi redesenhado** e o código não acompanha. Virou outro card: traço 2px, pílula de percentual no header, linha divisória, rodapé de duas linhas, altura 172, e a tendência mudou de `Down` para `Up`. Implementar muda a API (props de variação, rodapé e legenda) — decisão do humano pendente
- 2026-09-04 · Não construídos, e vistos pela primeira vez neste nó: `Card` com Content=List/Donut/Chart (304:5313) e `Empty State` (331:1364). São componentes novos, não atualização
- 2026-09-04 · **Style=Outline IMPLEMENTADO** conforme o redesenho, por decisão do humano. Deixou de ser "o Fill sem fundo": traço de 2px, pílula de variação ao lado do rótulo, divisória e rodapé de duas linhas. Entram três props, só válidas nessa variante: `delta`, `footnote` e `hint`
- 2026-09-04 · KPI Card · a divisória do Outline é 2px que **não ocupam altura**: no arquivo é um nó de altura zero com o traço desenhado por fora, e no CSS a margem negativa devolve isso. Sem esse detalhe o card fecharia em 174 em vez de 172
- 2026-09-04 · KPI Card · os glifos do Outline não são `primary`: a seta da pílula é `muted-foreground` e a do rodapé é `foreground` — as duas herdam do texto ao lado. Medição final: **40/40 campos batendo**
- 2026-09-04 · Divergência 2 encolheu mas não fechou: o Outline continua desenhado para uma tendência só (agora `Up`, antes `Down`). As outras funcionam, sem desenho

## Mapa de equivalência (layout antigo → v3.2)

Para ler o log acima. `docs/prd.md`→`00-visao-geral.md` · `stack.md`→`01-arquitetura.md` ·
`tokens-cor.md` e `tokens-figma.md`→`02-design-system.md` (valores) + `processo/tokens-migracao.md` (método) ·
`direcao-visual.md`→`02-design-system.md` (decisões) + `processo/ux-direcao-visual.md` (evidência) ·
`padrao-de-pagina.md`→`04-navegacao.md` § Padrão de página ·
`estados-interacao.md`→`processo/interactions.md` ·
`kfe-state.md`, `calibration.md`, `audit.md`, `figma-checklist.md`, `fonts-checklist.md`,
`inventario-componentes.md`, `roadmap-componentes.md`, `referencias.md`,
`tokens-estados-escuro.md` → mesmos nomes dentro de `processo/`.
