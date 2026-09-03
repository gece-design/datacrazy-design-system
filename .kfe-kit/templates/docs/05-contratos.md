# Catálogo de contratos — <produto>

O que uma parte do sistema promete à outra. Quem CONSOME lê aqui; quem
IMPLEMENTA linka pra cá. Assinatura mora neste arquivo e em mais nenhum.

<!-- Dono: fw-doc. Atualizado por lote, lendo o código. -->

## Contratos de dado (ports)

### `I<Nome>`

```ts
<assinatura>
```

| Método | Entrada | Saída | Erros |
|--------|---------|-------|-------|
| <nome> | <tipo> | <tipo> | <lista> |

Implementações conhecidas: <lista com link>.
Consumido por: <features com link>.

## Contratos de componente

Props de cada componente ficam no arquivo do componente — aqui fica só o que
é **compartilhado entre componentes**.

| Contrato | O que padroniza | Quem implementa |
|----------|-----------------|-----------------|
| <ex.: `Focusable`> | <ring, offset, ordem de tab> | <todo componente interativo> |
| <ex.: `Loadable`> | <aria-busy, skeleton, bloqueio de submit> | <lista> |

Catálogo por componente: [componentes/](componentes/).

## Contratos de estado (camada 2)

Vocabulário fechado de estados e famílias: [02-design-system.md](02-design-system.md).
Declaração por componente e regras locais: [processo/interactions.md](processo/interactions.md).
Banco global herdado (I1–I15): `<kit>/interactions-global.md`.

## Como adicionar um contrato

Arquivo novo se for um domínio novo; entrada nova aqui se for uma port do
domínio existente. **Adicionar implementação não muda o contrato** — só
acrescenta uma linha na lista de implementações (OCP).
