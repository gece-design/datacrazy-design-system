# Fontes — <produto>
<!-- Resolver ANTES da tela piloto. Fallback silencioso de fonte é o inimigo
     nº 1 do pixel-perfect: o olho quase não vê, o diff acusa em tudo. -->

## Inventário (do Figma)
| Família | Pesos usados | Licença ok? | Fonte do arquivo (Google/Adobe/compra) |
|---------|--------------|-------------|----------------------------------------|

## Instalação no produto
- [ ] Todas as famílias+pesos acima carregadas no app (self-host preferido a CDN)
- [ ] `font-display` definido conscientemente (swap causa flash; block trava — decidir)
- [ ] Pesos intermediários NÃO sintetizados pelo browser (faux bold/italic = reprovação)

## Checagem anti-fallback (obrigatória antes de cada diff)
No render de verificação, confirme via DevTools/Playwright que o
`font-family` computado é a família esperada — se o fallback do sistema
assumiu, o diff é inválido: conserte a fonte, não o componente.

## Exceções aprovadas
- <caso> · <motivo> · <aprovado por>
