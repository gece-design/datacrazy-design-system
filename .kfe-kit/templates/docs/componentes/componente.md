# Componente: <Nome>

## Responsabilidade

<uma frase: o que este componente faz. Se precisar de "e", provavelmente são dois.>

## Família

`<acao | entrada | navegacao | superficie | feedback | overlay | midia>`
— define a regra de estado herdada ([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `<id>` · Lote: `<N>` · Última verificação: `<diff N,N%>`

## Props

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| <nome> | <tipo> | <valor> | <sim/não> | <uma linha> |

## Variantes

| Variante | Quando usar |
|----------|-------------|
| <primary> | <ação principal da tela — uma por tela> |

## Estados

<!-- kfe:estados:start -->
<!-- GERADO por `kfe-docs index` a partir de ../processo/components-registry.json.
     Não edite à mão: o dono do fato é o registro; esta tabela é a vista dele. -->
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher. Errado aqui = errado no registro: corrija
lá (fw-doc C6) e rode `kfe-docs index`.

## Tokens consumidos

`<color/brand/500>` · `<radius/md>` · `<space/3>`

## Composição

Usa: <componentes filhos com link> · Usado por: <componentes/telas com link>

## Exemplo de uso

```tsx
<exemplo mínimo e real — copiado do código, não inventado>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Foco visível | <focus-visible ring — I4> |
| Papel/rótulo | <role/aria-label> |
| Alvo de toque | <≥44px — I15> |
| Movimento | <respeita prefers-reduced-motion — I12> |
| Contraste | <AA nos textos> |
