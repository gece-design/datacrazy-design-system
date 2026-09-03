# Interações — <produto>
Kit: v3.2 · Banco herdado: `<kit>/interactions-global.md` (regras I1–I15)

<!-- ONDE OS ESTADOS SÃO DECLARADOS. O Figma manda no estado de repouso; aqui
     se declara o resto, SEM desenhar. Uma linha por componente. A IA lê este
     arquivo antes de gerar (fw-ui) e grava o resultado no registro
     docs/processo/components-registry.json (fw-doc). Preencher leva segundos: só o
     que o componente TEM, não como ele fica. -->

## 1. Declaração por componente

| Componente | Família | Variants | Estados | Motion | Observação |
|---|---|---|---|---|---|
| Button | acao | primary, secondary, ghost | hover, active, focus, disabled, loading | fast | — |
| Input | entrada | default | hover, focus, disabled, error | fast | erro vem da spec |
| <exemplo acima — substitua> | | | | | |

Vocabulário fechado (não invente termo):
- **Estados**: `hover` `active` `focus` `disabled` `loading` `selected` `empty` `error` `skeleton`
- **Famílias**: `acao` `entrada` `navegacao` `superficie` `feedback` `overlay` `midia`
- **Motion**: `fast` (120ms) · `base` (200ms) · `slow` (320ms) · `none`

Estado NÃO declarado e NÃO desenhado no Figma = o componente não tem aquele
estado. Ausência é uma decisão válida e explícita — o que não vale é a IA
supor que tem.

## 2. Regras locais do produto (sobrescrevem o banco global)

| # | Estado / situação | Regra neste produto | Por quê | Data |
|---|---|---|---|---|
| L1 | <ex.: hover em card> | <ex.: eleva 1 nível de sombra, sem mudar fundo> | <decisão do gate> | <data> |

Regra local nasce de: (a) decisão do humano num gate, ou (b) inferência
aprovada 2x para a mesma família. Nunca de opinião da IA.

## 3. Decisões inferidas (aguardando gate)

<!-- A IA escreve aqui, a cada lote, toda decisão de nível 4 (analogia).
     O humano aprova em bloco no gate da UI. Aprovada → some daqui e vira
     linha `inferido→aprovado` no registro. Corrigida → vira regra local. -->

| Componente | Estado | O que foi aplicado | Precedente citado | Lote |
|---|---|---|---|---|
| <Card> | <hover> | <elevação +1, 120ms> | <ListItem/hover, família superficie, lote 2> | <3> |

## 4. Estados desenhados no Figma (exceções que voltam pra camada 1)

Quando um estado É desenhado, ele volta a valer como verdade absoluta e é
medido por pixel-diff, não derivado. Liste-os aqui para a fw-ui não derivar
por engano:

| Componente | Estado | Node do Figma |
|---|---|---|
