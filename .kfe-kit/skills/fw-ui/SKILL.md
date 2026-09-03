---
name: fw-ui
description: Etapa 6 do Kill Front-End (v2) — UI pixel-perfect. Motor de geração Figma→código com protocolo de extração exata, verificação por diff de pixels com limiar numérico e registro de calibração. Use quando o orquestrador indicar a etapa 6, ou quando o usuário pedir para gerar componentes ou telas a partir do Figma.
---

# Etapa 6 — UI e IA (pixel-perfect)

Meta: 1:1 com o Figma, medido — não "parecido". O ajuste humano tende a zero
porque (a) só entra frame aprovado no checklist, (b) a extração é exata,
(c) a verificação é objetiva, (d) cada erro vira regra de calibração.

## Pré-voo
Tokens pareados 1:1 · `docs/processo/figma-checklist.md` existente · skill do projeto
e CLAUDE.md no repo · MCP do Figma respondendo · `docs/processo/interactions.md` com
os componentes do lote declarados e `docs/processo/components-registry.json`
existente (camada 2 — sem eles não há de onde derivar estado) ·
`docs/processo/calibration.md` existente (crie a partir de `templates/calibration.md` no primeiro uso) ·
GOLDEN SCREEN verde no início do lote e após qualquer mudança de tokens/
dependência de UI (tests/golden/ — FAIL = bloqueio de pipeline, não do lote) · fontes do Figma instaladas no app
(família E pesos exatos — fallback de fonte = reprovação automática).

## Protocolo de extração (por frame — NUNCA estimar)

1. Rode o checklist de prontidão. Reprovou → BLOQUEIO, frame volta pro Figma.
2. Extraia via MCP os valores computados: dimensões, constraints, padding,
   gap, radius, strokes, sombras (x/y/blur/spread/cor/alpha), tipografia
   (família, peso, tamanho, line-height, letter-spacing), opacidades.
3. Cores e medidas SEMPRE resolvidas para o token (variable → token → classe).
   Valor sem variable no Figma = furo do checklist → volta pro Figma.
4. Assets (ícones, imagens, ilustrações): EXPORTE do Figma (SVG/PNG via MCP).
   Proibido redesenhar ou substituir por ícone "equivalente" de biblioteca.
5. Estados de interação: NÃO são extraídos do Figma por padrão (camada 2).
   Veja o protocolo próprio logo abaixo.

## Protocolo da camada 2 — estados (v3.1)

O Figma manda no repouso; os estados são declarados e derivados. Para CADA
estado de CADA componente do lote, percorra a cadeia de precedência do
`protocols.md` NESTA ordem e pare no primeiro que resolver:

1. **Desenhado no Figma?** (está na seção 4 do `docs/processo/interactions.md`) →
   extraia como camada 1 e meça com pixel-diff. Fim.
2. **Declarado?** (seção 1 do interactions.md) → implemente literal. Fim.
3. **Regra do banco?** → regras locais da seção 2 primeiro, depois I1–I15 de
   `<kit>/interactions-global.md`. Aplique a regra ao token do componente.
4. **Analogia** → `node <kit>/scripts/kfe-interactions.mjs precedent
   <Componente> <familia> <estado>`. Saída com precedente → aplique e
   registre a CITAÇÃO. Saída `PRECEDENTE: NENHUM` → passo 5.
5. **BLOQUEIO** → protocolo de falha, pergunta objetiva ao humano. A resposta
   vira regra local na seção 2 do interactions.md e nunca mais é perguntada.

Regras duras:
- Nunca invente um valor de estado. Copiar precedente citável é permitido;
  improvisar não é. Sem precedente = bloqueio, sempre.
- Toda decisão de nível 4 vai para a seção 3 do interactions.md (decisões
  inferidas) e para o gate. Provisória até o humano aprovar.
- Estado não declarado e não desenhado = o componente NÃO tem aquele estado.
  Ausência é decisão; não preencha buraco por conta própria.
- `focus-visible` (I4), `prefers-reduced-motion` (I12) e alvo de toque (I15)
  são obrigatórios em todo componente interativo: não dependem de declaração
  nem de precedente.

## Protocolo de verificação (por item — camada 1)

1. Renderize no viewport EXATO do frame (mesma largura; deviceScaleFactor 2;
   mesma fonte carregada — confirme que não houve fallback).
2. Screenshot via Playwright → diff contra o export do frame com
   `node scripts/pixel-diff.js <figma.png> <render.png>` (instale no produto:
   `npm i -D pixelmatch pngjs`). Geometria divergente = FAIL imediato.
3. Aceite: diff ≤ 1,0% dos pixels E zero divergência de geometria (posição/
   tamanho de qualquer elemento). O limiar do produto pode ser apertado em
   `docs/processo/calibration.md`, nunca afrouxado sem exceção aprovada.
4. Reprovou → liste as maiores regiões divergentes com causa provável →
   corrija → repita. Máx. 3 ciclos; persistiu → classifique e escale:
   bug de código (corrigir) · furo do Figma (volta pro design) · limitação
   de render (fonte/subpixel — exceção aprovada, registrada com print).
5. Aprovou → registre o % no log do lote. Todo item entra no gate COM o
   número, não com adjetivo.

## Verificação da camada 2 (estados)

Pixel-diff não serve para hover: não há contra o que comparar. Quem mede:

1. **Golden por estado**: com o Playwright, force cada estado do componente
   (hover, focus, disabled, loading…) e capture
   `tests/golden/states/<componente>-<estado>.png`. A PRIMEIRA captura só
   vira golden depois do aceite humano no gate; daí em diante, regressão é
   medida com o mesmo `scripts/pixel-diff.js` contra o golden.
2. **Consistência**: `node <kit>/scripts/kfe-interactions.mjs audit` — dois
   componentes da mesma família aplicando REGRAS diferentes no mesmo estado é
   perda de fidelidade. Unifique ou registre a exceção como regra local.
3. **Pendências**: `node <kit>/scripts/kfe-interactions.mjs pending` gera a
   tabela de decisões inferidas que vai no gate.

## Calibração (o que faz o ajuste desaparecer)

`docs/processo/calibration.md` é o livro-razão: toda divergência recorrente vira
regra de geração (ex.: "line-height px do Figma → leading-[Npx], nunca
leading-relaxed"). Releia no início de cada lote; aplique ANTES de gerar.
Duas ocorrências do mesmo desvio sem regra registrada = falha de processo.

## Modo new-ds
Entrega termina nos componentes: fundações → primitivos → compostos →
showcase (página que exibe cada componente em todas as variantes/estados —
é o "produto" deste modo e o objeto do gate). Telas não são geradas.

## Paralelização (subagentes)
Lote com 3+ componentes SEM dependência entre si → despache 1 subagente por
componente (máx. 4 simultâneos), cada um recebendo o trio de contexto (frame
via MCP + skill do projeto + calibration.md) e rodando geração + auto-
verificação. Regras do paralelo:
- A verificação FINAL (pixel-diff) é sempre refeita pela sessão orquestradora
  — nunca aceite o "passou" do próprio gerador.
- Arquivos compartilhados (tokens, index, rotas) só o orquestrador edita —
  subagente que precisar de mudança neles reporta, não toca.
- Telas e componentes interdependentes ficam em série.
- Primeiro lote do produto: rode em série para calibrar; paralelize do
  segundo em diante.

## Relatório de lote (opcional, recomendado em cliente)
Após o gate aprovado: salve os pares <item>.figma.png / <item>.render.png
(+ <item>.diff.txt com o %) em reports/lote-<N>/ e rode
`node <kit>/scripts/lote-report.mjs <N>` → reports/lote-<N>.html, o
comprovante apresentável do lote (números + lado a lado).

## Ordem e lotes
Fundações (valores extraídos do Figma → seção Fundações de
`docs/02-design-system.md`) → componentes (primitivos → compostos) → telas
(só instâncias;
elemento sem componente = criar o par primeiro). Lotes de 1 tela ou 3–5
componentes; ao fim de cada lote: fw-doc + checagens (lint · tsc · build) +
gate.

## Definição de pronto
Itens do lote com diff ≤ limiar e geometria zero-divergente · estados
declarados implementados com origem registrada (`figma|declarado|banco|
inferido|humano`) e zero estado `inferido` sem precedente citado · golden de
estado capturado · `audit` sem divergência de regra (ou exceção registrada) ·
assets exportados (não recriados) · a11y básica
(foco visível, contraste AA nos textos, alt/aria nos assets) ·
`docs/componentes/<Componente>.md` escrito no template do tipo (a fw-doc
fecha e audita) · checagens verdes.

## Gate (humano, por lote)
Apresente por item: screenshot lado a lado + % de diff + exceções. Apresente
TAMBÉM, uma vez por lote, a tabela de **decisões inferidas** (saída do
`kfe-interactions.mjs pending`): cada linha com o precedente citado, para o
humano aprovar em bloco ou corrigir. Correção vira regra local na hora.
Mesma inferência aprovada 2x na mesma família → promova a regra local antes
do próximo lote (deixa de ser inferência). Registre
a linha do lote em `docs/processo/metrics.md` (tempo, itens, diff médio, ciclos,
correções humanas — template em `templates/metrics.md`). Fidelidade
o robô já mediu — o humano avalia o que máquina não vê: sensação, micro-
interação, adequação. Correção apontada 2x → calibration.md antes do próximo
lote. Protocolos: `.claude/skills/kill-front-end/protocols.md`.
