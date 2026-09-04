# Componentes

Um arquivo por componente do design system. É a **face legível** do
`../processo/components-registry.json`: mesma verdade, dois formatos —
markdown para humano e IA lerem, JSON para o script auditar. Divergir os
dois é bug.

Escrito pela `fw-doc` ao fim de cada lote, **lendo o código gerado** —
nunca à mão, nunca de memória. A seção **Estados** de cada arquivo é gerada
pelo `kfe-docs index` a partir do registro: o JSON é o dono do fato, o
markdown é a vista dele.

> **Estado hoje (2026-09-02): vazio, com dívida declarada.** O showcase já tem
> `Button`, `Badge` e `Card` em código (`components/ui/`), e nenhum deles tem
> arquivo aqui nem entrada no registro — a `fw-doc` nunca rodou sobre eles.
> Enquanto isso não for feito, **a verdade sobre esses três está no código**,
> não aqui. Ausência de arquivo não significa ausência de componente.

## Inventário

<!-- kfe:index:start -->
| Arquivo | Responsabilidade |
|---------|------------------|
| [Card.md](Card.md) | Superfície que carrega um bloco de dados do dashboard. |
| [DataTable.md](DataTable.md) | Lista os negócios do CRM em colunas, com filtros e paginação. |
| [KpiCard.md](KpiCard.md) | Exibe uma métrica única — número em destaque, rótulo do que ele mede e uma |
| [SelectTrigger.md](SelectTrigger.md) | O gatilho de um seletor: rótulo, caret e nada mais. |
<!-- kfe:index:end -->

## Como ler a coluna "origem" dos estados

| Origem | Significa |
|--------|-----------|
| `figma` | Variante desenhada — verdade absoluta, medida por pixel-diff |
| `declarado` | Declarado em [../processo/interactions.md](../processo/interactions.md) |
| `banco` | Regra herdada (local do produto > global I1–I15 do kit) |
| `inferido` | Analogia com precedente citado — provisório até o gate |
| `humano` | Decisão tomada num gate; virou regra local |

`inferido` sem precedente citado não existe: é bloqueio, não estimativa.

## Como adicionar um componente

Não se adiciona à mão. Gere o componente pela `fw-ui` e rode a `fw-doc` do
lote — ela escreve o arquivo, grava o registro e roda
`node .kfe-kit/scripts/kfe-docs.mjs index`.
