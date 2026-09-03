# Fontes — DataCrazy

<!-- Resolver ANTES da tela piloto. Fallback silencioso de fonte é o inimigo
     nº 1 do pixel-perfect: o olho quase não vê, o diff acusa em tudo. -->

## Família: **Geist** — decidida, e está no Figma

Confirmado pelo humano em 2026-09-01 e verificado na fonte: a página
**TYPOGRAPHY** do arquivo `DESIGN---DATA-CRAZY` chama-se "Fonte Geist", e as
72 variáveis de texto declaram `family = Geist`. Mono: **Geist Mono**
(`font/family/mono`).

A tensão T1 está encerrada: a escolha é Geist. Mas ela cria um trabalho novo.

## ⚠️ O código está em Inter, o Figma está em Geist

| Lado | Família | Evidência |
|---|---|---|
| Produção (`datacrazy-front-end`) | **Inter** | `next/font/google`, PRD P6 |
| Figma (fonte canônica) | **Geist** + Geist Mono | 72 variáveis `text/*/family` |

Não é divergência a ser "conciliada": pela regra do kit, **o Figma é a verdade
absoluta**, então trocar a família no app é item de migração — e é uma mudança
visível em todas as telas, não um detalhe de token.

Consequências práticas:
- Enquanto o app rodar Inter, **todo diff de pixel contra o Figma vai falhar**
  por motivo errado. Geist tem que estar instalada antes da tela piloto.
- A escala de `docs/02-design-system.md` foi desenhada nas métricas da Geist.
  Aplicá-la sobre Inter dá line-height visualmente errado.

## Inventário

| Família | Pesos usados | Licença | Carregamento |
|---|---|---|---|
| **Geist** | Regular · Medium · SemiBold (deduzidos das variáveis `text/*/weight`) | Open source (SIL OFL), da Vercel | **a decidir** — ver abaixo |
| **Geist Mono** | a confirmar | idem | idem |
| ~~Inter~~ | — | — | sai, quando a migração acontecer |

### Caminhos de carregamento (escolher um)

1. Pacote `geist` da Vercel — integra com `next/font`, self-host automático
2. Google Fonts via `next/font/google` — mesmo padrão que o app já usa hoje

Confirmar qual está disponível e qual o time prefere. Os dois fazem self-host;
nenhum exige licenciamento.

## Instalação no produto

- [ ] **Geist declarada** no `next/font`, substituindo Inter
- [ ] **Pesos Regular, Medium e SemiBold** carregados — são os três que as
      variáveis do Figma usam. Peso faltando = faux bold garantido no diff
- [ ] **Geist Mono** carregada, se houver uso de mono na interface
- [ ] `font-display` decidido conscientemente
- [ ] Pesos intermediários não sintetizados pelo browser

## Checagem anti-fallback (obrigatória antes de cada diff)

No render de verificação, confirme via DevTools/Playwright que o
`font-family` computado é **Geist** — não Inter, não `system-ui`. Se o
fallback assumiu, o diff é inválido: conserte a fonte, não o componente.

Cuidado específico do `next/font`: a família é aplicada por classe gerada
(`__className_xxxx`). Um componente do DS renderizado **fora** da árvore que
recebe essa classe cai no fallback silenciosamente — inclusive no showcase.
Verificar o showcase é obrigatório.

## Pendências

1. Escolher o caminho de carregamento (pacote `geist` vs. Google Fonts)
2. Confirmar `text/heading-1/weight` — não apareceu na extração
3. Confirmar se há uso real de Geist Mono na interface
4. Planejar a migração Inter → Geist no app (é mudança visível, não silenciosa)

## Exceções aprovadas

- —
