# Protocolos comuns do Framework (v2)

Toda skill fw-* herda estes protocolos. A skill da etapa define O QUE; aqui
está o COMO padrão.

## Camadas de verdade (v3.1)

O KFE tem DUAS camadas de verdade, e elas são verificadas de formas
diferentes. Confundir as duas é o erro mais caro do pipeline.

| | Camada 1 — Repouso | Camada 2 — Interação |
|---|---|---|
| O que é | Layout, geometria, tokens, tipografia, espaçamento, o estado default de tela e componente | hover · active · focus · disabled · loading · selected · empty · error · skeleton · motion |
| Fonte | **Figma, verdade absoluta** | Declaração + banco de regras + analogia no registro |
| Onde mora | Arquivo do Figma | `docs/processo/interactions.md` · `<kit>/interactions-global.md` · `docs/processo/components-registry.json` |
| Como se mede | `scripts/pixel-diff.js` contra o export do frame — ≤1,0% e geometria zero-divergente | Golden por estado (`tests/golden/states/`) + `scripts/kfe-interactions.mjs audit` |
| Divergência = | Bug do código | Bug de consistência (regra divergente dentro da família) |

**Cadeia de precedência da camada 2** (obrigatória, por estado, por componente):

1. Variante desenhada no Figma → `figma` (volta a ser camada 1, pixel-diff)
2. Declaração em `docs/processo/interactions.md` → `declarado`
3. Regra do banco (local do produto > global do kit) → `banco`
4. Analogia no registro, **com precedente citado** → `inferido` (provisório, vai ao gate)
5. Nada acima resolve → **BLOQUEIO**, pergunte ao humano → `humano`

Nível 4 sem precedente citável não é inferência: é chute. Chute é bloqueio.
Rode `node <kit>/scripts/kfe-interactions.mjs precedent <Componente> <familia> <estado>`
— se a saída for `PRECEDENTE: NENHUM`, escale pelo protocolo de falha.

## Pré-voo (antes de executar qualquer etapa)

1. Os artefatos de entrada listados pela skill existem? (ex.: fw-ui exige
   tokens pareados + checklist Figma + skill do projeto)
2. O ambiente responde? (MCP do Figma quando a etapa lê design; Playwright
   quando testa; lint/build quando gera código)
3. O estado está coerente? (etapa anterior `concluída`)
Falhou qualquer item → status `bloqueada(<motivo>)`, reporte no formato de
falha, NÃO improvise contorno.

## Definição de pronto (para concluir qualquer etapa)

- Todos os artefatos da skill existem nos caminhos padrão.
- Checagens automáticas verdes quando houver código: `lint`, `tsc --noEmit`,
  `build` (e testes da etapa, quando existirem).
- Nada pendente marcado como "depois" sem registro em Exceções aprovadas.

## Protocolo de falha / escalada

Ao travar (3 tentativas no mesmo problema, pré-voo reprovado, ou decisão que
não é sua):
```
BLOQUEIO · <etapa> · <passo>
O que tentei: <1–3 linhas>
Causa provável: <hipótese>
Preciso de: <decisão humana | correção no Figma | acesso | informação>
Opções: (a) ... (b) ...
```
Nunca esconda um contorno: gambiarra silenciosa é pior que bloqueio visível.

## Resumo de gate (formato)

```
GATE · <etapa> · <produto>
Feito: <3–6 bullets>
Artefatos: <caminhos>
Para aprovar: <exatamente o que o humano precisa olhar/decidir>
Riscos/exceções: <ou "nenhum">
```

## Idempotência

Toda etapa pode ser re-executada com segurança: antes de criar, verifique se
existe; se existir, atualize por diff (nunca duplique arquivo, seção ou
componente). Re-rodar uma etapa concluída exige confirmação do humano.

## Caminhos padrão

A `docs/` do produto segue a **arquitetura de documentação** (SOLID aplicado
a docs) — contrato completo, com donos e seções obrigatórias por tipo, em
`.claude/skills/kill-front-end/doc-architecture.md`. Leia junto com este
arquivo, uma vez por sessão.

```
docs/
├── README.md              ← roteador (gerado: kfe-docs index)
├── 00-visao-geral.md      ← PRD, escopo v1, NÃO-ESCOPO
├── 01-arquitetura.md      ← stack, lista negativa, estrutura, fronteira do back
├── 02-design-system.md    ← direção visual + fundações (tokens, fontes, motion)
├── 03-contrato-api.md     ← padrões de API · api-contract.yaml ao lado
├── 04-navegacao.md        ← rotas + user flows
├── 05-contratos.md        ← catálogo de contratos (props, ports, estados)
├── regras.md · glossario.md · api-contract.yaml
├── objetos/     README.md (gerado) + 1 por entidade
├── features/    README.md (gerado) + 1 por feature
├── componentes/ README.md (gerado) + 1 por componente
└── processo/    maquinário do KFE (ver tabela abaixo)
```

**Regra de fronteira**: a raiz do `docs/` é a verdade do PRODUTO; `processo/`
é o maquinário do PIPELINE. Quem gera código lê a raiz; quem conduz o fluxo
lê o processo. Nunca misture.

| Artefato do processo | Caminho |
|---|---|
| Estado | docs/processo/kfe-state.md |
| Métricas | docs/processo/metrics.md |
| Declaração de interações | docs/processo/interactions.md |
| Registro de componentes | docs/processo/components-registry.json |
| Calibração de fidelidade | docs/processo/calibration.md |
| Checklist Figma / fontes | docs/processo/figma-checklist.md · docs/processo/fonts-checklist.md |
| Auditoria / onboarding | docs/processo/audit.md · docs/processo/onboard-plan.md |
| ADRs / retro | docs/processo/adr.md · docs/processo/kfe-retro.md |
| QA / handoff | docs/processo/qa-release.md · docs/processo/handoff-backend.md |
| Golden screens | tests/golden/ · tests/golden/states/ |
| Testes E2E | tests/e2e/ |
| Relatórios de lote | reports/ |
| CI do produto | .github/workflows/kfe.yml |
| Calibração global | <kit>/calibration-global.md |
| Banco global de interações | <kit>/interactions-global.md |

Comandos da arquitetura (idempotentes):

```bash
node <kit>/scripts/kfe-docs.mjs init    # cria a árvore e migra layout antigo
node <kit>/scripts/kfe-docs.mjs index   # regenera os índices lendo os arquivos reais
node <kit>/scripts/kfe-docs.mjs audit   # verifica — exit 1 em erro, bloqueia no CI
```

Índice NUNCA é escrito à mão. Doc que depende de alguém lembrar mente em 30
dias — por isso a estrutura é verificada por script, não por disciplina.
