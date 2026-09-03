# DataCrazy — Referências e fontes

> Fora dos caminhos padrão do kit, mas necessário: este ciclo tem material
> disperso em Figma, FigJam, Gleap e código. Aqui fica o índice.

## Fontes de verdade

| O quê | Onde | Status |
|---|---|---|
| **Figma do DS** (verdade absoluta do visual) | https://www.figma.com/design/LD0EAR1hUILlLvNi0Rkl7e/DESIGN---DATA-CRAZY?node-id=101-50 | **Em andamento** — criado por Gabriel, vai precisar de refinamento guiado pelo checklist de prontidão |
| FigJam · PRD destrinchado + design thinking | https://www.figma.com/board/lL301HOTFtRYnVak9o9dne/FIGJAM---DATA-CRAZY?node-id=0-1 | Existe |
| PRD com evidência (documento) | `Artefato-01 Ponto Zero.pdf` — anexado em 2026-09-01, datado de 18/08/2026 | Recebido |
| Figma da base visual atual do CRM | link compartilhado por Davi com o João | **Não fornecido a esta sessão** |
| Repo do front existente | `datacrazy-front-end`, branch `develop` | **Sem acesso** por esta sessão (ver docs/processo/audit.md) |
| Landing page | https://datacrazy.io | Público |
| Tickets | Gleap — pipelines BUG, FEATURE_REQUEST, CRASH, PARTNERS, ALLAN | Sem acesso direto; 22 tickets citados no PDF |

## Referências de interface

Fonte: FigJam · PASSO 3 · DEFINE, lido via MCP em 2026-09-01.

| Referência | Link | O que o time citou dela |
|---|---|---|
| **Twenty** | twenty.com | Drawer lateral do registro · accordion dentro do drawer · edição inline |
| **Linear** | linear.app | Sidebar com grupos colapsáveis · favoritos e últimos acessos · edição inline |
| **Attio** | attio.com | Resize de coluna com duplo clique · busca com atalhos visíveis · modal em 3 áreas |
| **respond.io** | respond.io | Card de conexão com cor sutil e marca d'água — **e** a anti-referência dos ícones arredondados |
| **Fillo** | dribbble.com (Filllo, agência de design SaaS) | Referência estética geral |
| **Board UI** | boardui.com | Design system React: 72 componentes, 17 gráficos, 400+ tokens, feito no Figma, Tailwind + React Aria. Referência de **arquitetura de DS**, mesma stack |

## Design systems de referência (do board, com prioridade)

| DS | Link | Prioridade |
|---|---|---|
| Twilio Paste | paste.twilio.design | Alta |
| Zendesk Garden | garden.zendesk.com | Alta |
| GitLab Pajamas | design.gitlab.com | Alta |
| Salesforce SLDS | lightningdesignsystem.com | Média |

## Benchmarks de concorrência (do board)

| Player | Camada | Origem | Acesso | Prioridade |
|---|---|---|---|---|
| Chatwoot | Multiatendimento | Global · open source | Código MIT | Alta |
| Kommo | CRM conversacional | Global · LatAm | Trial | Alta |
| Digisac | Multiatendimento | BR · Bauru/SP | Trial 7 dias | Alta |
| Clint | CRM conversacional | BR | Demo | Média |
| SocialHub | CRM conversacional | BR · São Paulo | Demo | Média |
| Poli Digital | Multiatendimento | BR | Demo | Média |
| Chatsac | Multiatendimento | BR | Trial 7 dias | Média |
| ChatGuru | Multiatendimento | BR | Demo | Baixa |

> Critério do board: Alta = roteiro completo de captura (conta de teste +
> extração de CSS) · Média = telas públicas e demos · Baixa = posicionamento.

## Contexto de empresa (desk research do board)

Fundada em 2023 por Andreone Ribeiro, sede em Balneário Camboriú/SC · estágio
seed, bootstrapped, ~30% de crescimento ao mês · 500+ empresas no Brasil e
LatAm · provedora oficial da Meta · base de clientes dobrou em um ano ·
AlwaysFit com 5% e até USD 500 mil comprometidos · preço fixo em real, faixa
R$197–707/mês, sem cobrança por mensagem e sem fidelidade · promessa: substituir
4 a 6 ferramentas desconectadas.

> Referência não é fonte de valor: dela sai direção, nunca token. Cor,
> espaçamento e tipografia continuam saindo só do Figma.

## Anti-referências

**ENCONTRADAS** em 2026-09-01, no FigJam · PASSO 3 · DEFINE — 15 stickies na
coluna "O que MENOS gosta" (e 15 em "O que MAIS gosta"). Transcritas e
interpretadas em `docs/processo/ux-direcao-visual.md`.

O P4 do PDF e o próprio PASSO 1 do board ainda registram esse item como
bloqueio aberto — **está desatualizado**: as anti-referências foram coletadas
depois. Vale corrigir no board.

## Pessoas citadas no PDF

| Nome | Papel observado no material |
|---|---|
| Davi | Confirma requisitos de produto (dark mode, responsivo, multi-idioma) |
| Gava | Confirma realidade técnica do front (Tailwind, fetch nativo via hook próprio) |
| João | Recebeu o link do Figma da base visual atual |
