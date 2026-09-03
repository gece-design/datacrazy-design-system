# Navegação — site do design system

O "produto" deste ciclo é o site do DS: uma página por componente e por
fundação. **O dono das rotas é o código** — `components/ds/nav.ts` — e não
esta tabela: item novo entra lá, com `pronto: true` quando a página existe.

## Rotas

| Categoria | Prefixo | Páginas prontas | Total catalogado |
|---|---|---|---|
| Getting Started | `/` · `/getting-started/*` | 2 | 2 |
| Foundations | `/foundations/*` | 3 (color, typography, icons) | 3 |
| Actions | `/actions/*` | 1 (button) | 2 |
| Forms | `/forms/*` | 0 | 3 |
| Navigation | `/navigation/*` | 1 (sidebar) | 3 |
| Data Display | `/data-display/*` | 2 (card, badge) | 6 |
| Feedback & Overlays | `/feedback/*` | 0 | 4 |

Títulos em inglês — nomenclatura de front-end, decisão do humano em 2026-09-01.
As categorias seguem o contrato das 5 categorias de componente mais Getting
Started e Foundations: [02-design-system.md](02-design-system.md).
Ordem de construção: [processo/roadmap-componentes.md](processo/roadmap-componentes.md).

## Fluxos

Não há jornada de usuário a diagramar: o site é navegação por catálogo, sem
estado, sem autenticação e sem escrita. Ausência declarada, não pendência.
Os fluxos do CRM ficam para os ciclos `new-screens` — ver
[00-visao-geral.md](00-visao-geral.md) § NÃO-ESCOPO.

## Estados de navegação

| Situação | Comportamento |
|---|---|
| Rota de item ainda não construído | O item aparece na sidebar sem `pronto` e não navega |
| Anterior/próxima no rodapé | Só entre páginas prontas (`ordemDasPaginas` em `nav.ts`) |
| Rota inexistente | 404 padrão do Next.js — sem tela própria |

## Padrão de página

Derivado de `boardui.com/components/typography`, que o humano apontou como
referência. Toda página de componente ou fundação segue esta ordem.

## A ordem

1. **Título** — o nome do componente, em inglês.
2. **Descrição densa, com números.** Não "a paleta do produto", e sim
   "quinze papéis, de display (26px) a caption (10px)". Número dá escala e
   evita a frase decorativa.
3. **`Como funciona`** — o mecanismo, antes do resultado. É a seção que
   diferencia documentação de vitrine: explica por que o token existe, como
   nomeia, e **qual armadilha ele tem**. Trechos de código no meio do texto
   com `<Chip>`.
4. **Seções por item**, cada uma com:
   - título + **spec em mono** ao lado (ex.: `26 → 13px`)
   - uma linha de descrição
   - caixa de preview em `rounded-2xl` contendo **somente o componente**
   - abas **Preview / Código** — **só quando existe código a copiar**
5. **Índice "Nesta página"** no trilho da direita, listando as seções.

## A caixa de preview

**Dentro da caixa vai só o componente**, renderizado como apareceria no produto e
**interativo de verdade** onde ele é interativo. Nada de rótulo de anotação,
seta explicativa ou tabela de spec ali dentro.

A explicação tem dois lugares, os dois fora da caixa:
- **acima**, na `descricao` da seção — a frase que prepara o que se vai ver
- **abaixo**, na prop `nota` — o detalhe que só faz sentido depois de ver

Por quê: quem abre a página quer ver o componente como ele é. Anotação dentro do
preview transforma a demonstração em diagrama, e o leitor deixa de conseguir
julgar se aquilo é bonito, denso ou legível — que é exatamente o que ele veio
fazer.

## Regras do conteúdo

- **A caixa de preview mostra o nome do token**, em mono, à direita da amostra.
  Quem lê precisa saber o que copiar, não só como fica.
- **Aba de código só onde há código.** Uma seção que mostra a escala de cor, a
  grade de ícones ou explica um conceito é referência, não componente: ela não
  tem JSX para copiar, então não ganha aba nenhuma. Aba com placeholder, ou aba
  em bloco explicativo, é ruído — o leitor clica e não encontra nada.
  Regra prática: **passe `codigo` só quando a resposta a "o que eu copio daqui?"
  for um trecho de JSX.**
- **A aba Código, quando existe, tem código de verdade** — o JSX real do
  exemplo ao lado, não pseudocódigo.
- **Toda seção ganha descrição.** Se não há o que dizer sobre ela, ela
  provavelmente não é uma seção.
- **A armadilha vale mais que o elogio.** O bloco "Como funciona" da
  tipografia documenta o caso do `tailwind-merge` porque ele já quebrou de
  verdade aqui — é o tipo de coisa que economiza uma tarde de quem vier depois.

## Componentes que implementam o padrão

`components/ds/preview.tsx` — `PaginaDS`, `ComoFunciona`, `Secao`, `Chip`,
`Legenda`, `CardComponente`
`components/ds/colunas.tsx` — a grade de 3 colunas, compartilhada entre o
header e o conteúdo para que o breadcrumb caia sobre a coluna do meio.
