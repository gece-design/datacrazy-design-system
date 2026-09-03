# Arquitetura da documentação (v3.2)

Toda skill fw-* herda este contrato, junto com o `protocols.md`. Ele define
COMO a `docs/` do produto é organizada. O `protocols.md` diz como executar
uma etapa; este diz onde o que ela escreve mora.

Premissa: a doc não é para ler, é para a IA **abrir a coisa certa**. Doc que
obriga a abrir tudo queima token; doc que faz abrir o errado gera alucinação.
Por isso a estrutura é fixa, verificada por script e bloqueada no CI —
disciplina que depende de alguém lembrar mente em 30 dias.

## Os 5 princípios (SOLID aplicado a documento)

| | Princípio | Na prática |
|---|---|---|
| **SRP** | 1 arquivo, 1 assunto | Arquivo que precisa de "e" no título está pedindo pra virar dois |
| **OCP** | Feature/componente/objeto novo = arquivo novo | A estrutura nunca é reorganizada pra caber algo novo |
| **LSP** | Todo arquivo do mesmo tipo, o mesmo template | Quem leu um objeto sabe ler todos — as seções são as mesmas, na mesma ordem |
| **ISP** | Cada arquivo carrega só o seu escopo | O resto é link. Contexto sob demanda, não em bloco |
| **DIP** | Referência por link relativo, nunca cópia | Um fato tem UM dono. Duplicata é a origem de toda doc contraditória |

## A árvore (docs/ do produto)

```
docs/
├── README.md                ← ROTEADOR (gerado): árvore + "pra fazer X, leia Y"
├── 00-visao-geral.md        ← o que é, pra quem, escopo v1, NÃO-ESCOPO
├── 01-arquitetura.md        ← stack, lista negativa, estrutura, fronteira do back
├── 02-design-system.md      ← direção visual + fundações (tokens, escalas, fontes, motion)
├── 03-contrato-api.md       ← auth, envelope, paginação, erro → aponta pro yaml
├── 04-navegacao.md          ← rotas + user flows (Mermaid)
├── 05-contratos.md          ← catálogo de contratos (props, ports, estados)
├── regras.md                ← regras de negócio transversais
├── glossario.md             ← nome canônico de cada coisa
├── api-contract.yaml        ← OpenAPI (artefato de máquina, consumido pelo back)
├── objetos/                 ← README.md (gerado) + 1 arquivo por entidade
├── features/                ← README.md (gerado) + 1 arquivo por feature
├── componentes/             ← README.md (gerado) + 1 arquivo por componente
└── processo/                ← maquinário do KFE (ver abaixo)
```

**`processo/` é fronteira, não gaveta.** Ali mora o que serve ao PROCESSO
(estado, medição, calibração, checklists); na raiz mora o que serve ao
PRODUTO. A IA que gera código lê a raiz; a IA que conduz o pipeline lê o
processo. Misturar os dois foi o que fez a `docs/` inchar.

```
docs/processo/
├── README.md                ← o que é cada arquivo daqui
├── kfe-state.md             ← estado do pipeline (etapas, gates, log)
├── metrics.md               ← números por lote e por ciclo
├── interactions.md          ← declaração da camada 2 + regras locais
├── components-registry.json ← memória de estados (fonte da analogia)
├── calibration.md           ← livro-razão da fidelidade
├── figma-checklist.md       ← prontidão de frame (bloqueante)
├── fonts-checklist.md       ← anti-fallback de fonte
├── audit.md                 ← diagnóstico de entrada (cenários B/C)
├── onboard-plan.md          ← o que foi feito / o que ficou de backlog
├── adr.md                   ← desvios de padrão aprovados
├── qa-release.md            ← checklist de release assinado
├── handoff-backend.md       ← mapa mock → endpoint
└── kfe-retro.md             ← backlog de melhoria do próprio kit
```

## Mapa de donos (quem escreve o quê)

Arquivo sem dono é arquivo que apodrece. Toda linha da `docs/` tem uma etapa
responsável — e só ela escreve ali.

| Caminho | Dono | Quando |
|---|---|---|
| `README.md` (raiz e das pastas) | **script** `kfe-docs index` | Nunca à mão |
| `componentes/*` seção Estados | **script** `kfe-docs index`, do registro | Nunca à mão |
| `00-visao-geral.md` | `fw-srs` D1 (produto, público, não-escopo) · `fw-ux` U5 (seção Escopo v1) | Etapas 2 e 5 |
| `01-arquitetura.md` | `fw-stacks` S1–S6 · `fw-install` (estrutura de pastas) | Etapas 1 e 3 |
| `02-design-system.md` | `fw-ux` U4 (seção Direção visual) · `fw-ui`/`fw-onboard` (Fundações) | Etapas 5 e 6 |
| `03-contrato-api.md` | `fw-stacks` S7 · `fw-srs` D5 (rotas) | Etapas 1 e 2 |
| `04-navegacao.md` | `fw-ux` U3 | Etapa 5 |
| `05-contratos.md` | `fw-doc` | Por lote |
| `regras.md` | `fw-srs` D3 · `fw-doc` C3 (sincroniza) | Etapa 2, depois por lote |
| `glossario.md` | `fw-srs` D6 | Etapa 2 |
| `objetos/*` | `fw-srs` D2 · `fw-onboard` (retroativo) | Etapa 2 / onboarding |
| `features/*` | `fw-srs` D4 · `fw-ux` lite · `fw-doc` C3 | Etapa 2, depois por lote |
| `componentes/*` | `fw-doc` C2 — **lendo o código**, nunca de memória | Por lote |
| `processo/*` | a etapa dona de cada artefato (ver `protocols.md`) | — |

## Seções obrigatórias por tipo (LSP — é isto que o audit cobra)

Ordem fixa. Seção sem conteúdo fica com `—`, nunca é removida: ausência
declarada é informação; seção sumida é dúvida.

**`objetos/<entidade>.md`**
`Responsabilidade` · `Atributos` · `Invariantes / Regras` · `Relacionamentos` · `Usado em`

**`features/<feature>.md`**
`Objetivo` · `Atores` · `Pré-condições` · `Fluxo principal` · `Estados e exceções` ·
`Regras de negócio` · `Objetos envolvidos` · `Componentes envolvidos` ·
`Rotas/telas` · `Contratos consumidos`

**`componentes/<Componente>.md`**
`Responsabilidade` · `Família` · `Par no Figma` · `Props` · `Variantes` ·
`Estados` · `Tokens consumidos` · `Composição` · `Exemplo de uso` · `Acessibilidade`

## Regras duras

- **Atributo mora só em `objetos/`.** Nenhum outro arquivo repete tabela de
  campos de entidade — linka. Feature descreve o que ACONTECE com o objeto,
  não o que ele TEM.
- **Índice nunca é escrito à mão.** `docs/README.md` e os READMEs das pastas
  saem do `kfe-docs index`, lendo os arquivos reais. Índice à mão mente na
  segunda semana.
- **Link relativo, sempre.** `[Venda](../objetos/venda.md)`. Link quebrado é
  erro de audit, não detalhe de formatação.
- **Arquivo novo = arquivo novo.** Nunca anexe uma feature no fim de outra
  porque "é pequena". OCP existe pra isso.
- **`componentes/*` é a face legível do `components-registry.json`** — mesma
  verdade, dois formatos: markdown pro humano e pra IA ler, JSON pro script
  auditar. Para isso não virar duplicata, a seção **Estados** do markdown é
  GERADA pelo `kfe-docs index` a partir do registro: o dono do fato é o JSON,
  o markdown é a vista. Errado no markdown = errado no registro; corrija lá.
  O `audit` reprova componente que existe num lado e não no outro.
- **150 linhas é o cheiro.** Passou disso, provavelmente são dois assuntos.
  O audit avisa; o humano decide.

## Comandos

```bash
node <kit>/scripts/kfe-docs.mjs init    # cria a árvore (idempotente) e migra layout antigo
node <kit>/scripts/kfe-docs.mjs index   # regenera os índices lendo os arquivos reais
node <kit>/scripts/kfe-docs.mjs audit   # verifica a arquitetura — exit 1 em erro
```

`init` roda na INSTALL (cenário A) e no ONBOARD (cenários B/C).
`index` + `audit` rodam ao fim de CADA lote, na `fw-doc`, e no CI do produto.

Templates de todos os arquivos acima: `<kit>/templates/docs/`.
Protocolos de execução: `.claude/skills/kill-front-end/protocols.md`.
