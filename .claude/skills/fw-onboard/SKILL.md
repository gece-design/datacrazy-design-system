---
name: fw-onboard
description: Onboarding de produto existente no Kill Front-End — modo pareamento (cenário B, com design system) ou engenharia reversa (cenário C, sem DS ou incerto). Prepara tokens, paridade, docs retroativas e infraestrutura até o produto ficar pronto para o modo new-screens. Use após fw-audit, quando o orquestrador rotear cenários B ou C.
---

# fw-onboard — Onboarding de produto existente

Entrada obrigatória: `docs/processo/audit.md` aprovado. O modo vem do cenário
confirmado no gate da auditoria.

**Primeiro comando, antes de qualquer passo dos dois modos:**
```bash
node <kit>/scripts/kfe-docs.mjs init      # veja antes com --dry
```
Ele cria a árvore de documentação do produto e **migra o layout antigo**
(prd/stack/specs soltos, maquinário na raiz) para o formato canônico, via
`git mv` — histórico preservado. É idempotente: nada é sobrescrito. A partir
daí toda doc retroativa é escrita NO template do seu tipo, nunca em formato
livre. Contrato: `.claude/skills/kill-front-end/doc-architecture.md`.

## Modo B — pareamento (existe DS de verdade)

1. **Tokens**: gere o mapa Figma variable → token do config, 1:1 por nome.
   Divergência de nome → renomear (preferindo o Figma como canônico) e
   registrar no glossário. Zero token sem par.
2. **Componentes**: transforme as 3 listas da auditoria em plano: pareados
   (ok) · só-código (criar par no Figma OU marcar interno sem par visual —
   decisão humana) · só-Figma (backlog de implementação).
3. **Docs retroativas NA arquitetura**: rode `kfe-docs audit` — a saída É a
   lista de trabalho ("fora do template de features/", "órfão de índice",
   "aguardando fusão manual"). Preencha, em modo retroativo (retratar o que
   existe, **não decidir** o que deveria existir):
   - `docs/01-arquitetura.md` — a stack real, a lista negativa real
   - `docs/02-design-system.md` — as fundações que o código já usa
   - `docs/03-contrato-api.md` — os padrões que a API já pratica
   - `docs/04-navegacao.md` — as rotas que existem hoje
   - `docs/objetos/*` e `docs/features/*` das áreas ativas, cada um no
     template do seu tipo
   - `docs/glossario.md` — os nomes que o produto já usa (e os proibidos:
     os sinônimos que você encontrou espalhados)
   `docs/00-visao-geral.md` (PRD) só se o humano quiser. Feche com
   `kfe-docs index` e `kfe-docs audit` — audit vermelho barra o gate.
4. **Infraestrutura**: skill do projeto + CLAUDE.md + checklist Figma +
   hooks + CI guardião (com o passo Doc audit), via fw-install em modo
   "sobre repo existente" (não recriar o que existe; completar o que falta).
5. **Interações retroativas (camada 2)**: minere os estados que o código JÁ
   tem — classes `hover:`, `focus-visible:`, `disabled:`, `aria-busy`,
   transições — e popule `docs/processo/components-registry.json` com origem
   `declarado` (é o que o produto faz hoje, não invenção). Rode
   `node <kit>/scripts/kfe-interactions.mjs audit`: as divergências que
   aparecerem são o débito de consistência do produto — leve a lista pro
   gate, o humano escolhe o padrão vencedor por família e ele vira regra
   local em `docs/processo/interactions.md`. A partir daí o produto passa a ter
   memória de interação, e todo componente novo herda dela.
6. **Piloto de calibração**: rode a tela piloto da fw-mcp numa tela nova
   pequena para medir a baseline de fidelidade deste produto.

## Modo C — engenharia reversa (sem DS ou incerto)

1. **Extração de fato**: minere o código: paletas usadas (por frequência),
   escalas de tipo e espaçamento reais, raios, sombras. Cruze com o Figma.
   Saída: proposta de conjunto canônico de tokens (o menor conjunto que
   cobre 90%+ do que existe) + lista do que vira exceção a migrar.
2. **Fonte canônica**: GATE imediato — o humano decide onde o DS mora
   (regra do framework: Figma). Criam-se as variables no Figma a partir do
   conjunto aprovado.
3. **DS retroativo mínimo**: NUNCA big-bang. Construa só o necessário para
   as telas-alvo do primeiro lote: primitivos + componentes que elas usam,
   com par no Figma, migrando os valores soltos dessas rotas para tokens.
   O resto do produto migra lote a lote, guiado por demanda.
4. **Docs + infraestrutura**: como no modo B (passos 3–4).
5. **Interações retroativas**: idem modo B (passo 5) — em C isso costuma
   render mais divergência que token solto; é normal, e é justamente o que
   o registro passa a segurar.
6. **Piloto de calibração**: idem modo B.

## Definição de pronto
Mapa de tokens 1:1 · plano de paridade com donos · **`kfe-docs audit` sem
erro** (árvore no formato, índices gerados, nada aguardando fusão) · skill +
CLAUDE.md + checklist + `docs/processo/interactions.md` e
`docs/processo/components-registry.json` populados no repo ·
`docs/processo/onboard-plan.md` (o que foi feito, o que ficou de backlog) ·
baseline de fidelidade registrada no estado.

## Gate (humano)
Modo B: aprova o mapa de tokens e as decisões de paridade. Modo C: aprova o
conjunto canônico + fonte + escopo do DS mínimo. Nos dois: apresente a saída
final do `kfe-docs audit` — é o comprovante de que a doc do produto entrou
num formato que a IA sabe navegar sem abrir a pasta inteira. Depois disso o produto
entra no modo new-screens. Protocolos: `.claude/skills/kill-front-end/protocols.md`.
