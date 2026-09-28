# Componente: Drawer

## Responsabilidade

Abrir um lead pela direita, com o perfil fixo e o conteúdo da seção escolhida.

## Família

`overlay` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Canvas `533:3809` ("↳ Drawer") · component set `565:5959` · Lote: `3` ·
Peças: Profile section `565:6448`, Drawer / Menu `556:3331`, Menu Item
`556:428`, Card info `563:4737`, Row `563:4363`, header info `563:4772`,
menu close `551:4186`, Hierarchy Node `597:2929`.

Última verificação: typecheck e build; cores de ícone lidas dos SVGs exportados
pela ponte local do Figma. Diff de pixels **não medido** (`figma-console` fora
do ar).

## Props

O eixo `Menu` do component set (Histórico, Perfil, Campos adicionais, Negócios,
Hierarquia) **não é prop**: é o item escolhido no menu, e cada valor é só o
conteúdo da coluna direita.

### `Drawer` (camada)

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `aberto` | `boolean` | sim | Mostra a camada. |
| `aoFechar` | `() => void` | sim | Escape, clique no scrim. |
| `rotulo` | `string` | sim | Nome do diálogo para leitor de tela. |
| `children` | `ReactNode` | sim | Normalmente um `DrawerPainel`. |

### `DrawerPainel` e `DrawerBotaoCanto`

`DrawerPainel` é a caixa que a camada mostra — perfil à esquerda, conteúdo à direita. Abre com `LARGURA_DO_PAINEL` (840px; o arquivo desenha 1080 — cliente pediu menos tela ocupada, ADR-040) e a pessoa arrasta a borda esquerda: sob o cursor aparece um traço de 3px em `divider`, e o arrasto vai de `LARGURA_MINIMA_DO_PAINEL` (720) a `LARGURA_MAXIMA_DO_PAINEL` (1080, o desenho do arquivo), nunca mais que a janela menos 48. O conteúdo acompanha: os cartões dos campos ficam em `gradeDeCartoes` (lib/campo.ts), quantas colunas de 220px couberem. Props (`DrawerPainelProps`): `largura` (inicial), `memoria` (chave do navegador que lembra a largura arrastada), `rotuloRedimensionar` (nome da alça; padrão `ROTULO_DE_REDIMENSIONAR`, "Redimensionar painel") e `fixo` (sem alça). Teclado: alça focável, setas ±16px, Shift ±64. `DrawerBotaoCanto` (`rotulo`, mais props de botão) é o botão de 29px do canto do perfil, usado para fechar e para recolher.

### `DrawerPerfil`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `nome` | `string` | sim | Nome, inicial do avatar e rótulo da coluna. |
| `tipo` | `"pessoa" \| "empresa"` | sim | Ícone da tag sobre o avatar. |
| `rotuloTipo` | `string` | sim | Texto dessa tag (i18n). |
| `telefone`, `email` | `string` | não | Linhas sob o nome. |
| `estilo` | `"outline" \| "fill"` | não | Padrão `outline`. Desce por contexto aos blocos. |
| `tom` | `"azul" \| "roxo" \| "rosa" \| "laranja" \| "verde" \| "ciano" \| "ambar" \| "vermelho"` | não | Anel e letra do avatar, tag de tipo e brilho. Padrão: azul para pessoa, roxo para empresa. |
| `tags`, `acoes` | `ReactNode` | não | Fileira de tags e os dois botões. |
| `aoFechar`, `aoRecolher` | `() => void` | não | Sem eles, o botão do canto não aparece. |
| `rotuloFechar`, `rotuloRecolher` | `string` | não | Nome acessível de cada botão do canto (i18n). |
| `rotulosRolagem` | `RotulosDeRolagem` | não | `{ subir, descer }` das setas da coluna — só o plano B, quando nem o mínimo cabe; no uso normal quem rola é o bloco do menu (`DrawerBloco rolagem`). Sem eles, `ROTULOS_DE_ROLAGEM`. |
| `className` | `string` | não | — |

### Peças do perfil e do conteúdo

`DrawerBloco` (`titulo`, `inicialAberto`, `acoes`, `rolagem`) · `DrawerMetricas` (`itens` com
`rotulo`, `valor`, `icone` e `tom`; `colunas` 2 ou 4; `estilo`) · `DrawerContato` (`linhas` com `texto`, `icone`,
`rotulo`) · `DrawerMenu` (`itens` de `ItemMenuDrawer` — `id`, `rotulo`, `icone`; `atual`, `aoEscolher`, `rotulo`, `estilo`, `fixacao`) ·
`DrawerConteudo` (`titulo`, `descricao`, `acoes`, `antesDoTitulo`, `rotulosRolagem`) ·
`DrawerSecao` (`titulo`) · `LinhaDoTempo` (`eventos` de `EventoLinhaDoTempo` — `id`, `titulo`, `detalhes[]`, `icone`) · `HierarquiaNo`
(`nome`, `subtitulo`, `tipo`, `atual`, `recolher`) · `HierarquiaCanvas` (`largura`/`altura` do desenho, padrão 656 × 540; abre no zoom que cabe na largura da caixa, re-mede quando o painel é arrastado e "ajustar" volta a ele)
(`rotulos` do zoom). Todas aceitam `className`.

`fixacao` é `FixacaoDoMenu`: `fixados` (ids, na ordem do topo), `aoAlternar(id)`, `rotuloFixar(item)` e `rotuloDesafixar(item)` — os dois últimos devolvem o nome do alfinete. `rolagem` do `DrawerBloco` é `RotulosDeRolagem` (`subir`, `descer`): o bloco ocupa o que sobra da coluna e o conteúdo rola por dentro, com as setas na borda — é o bloco do menu.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| `estilo="outline"` | Padrão. Caixas com traço de 2px em `background`. |
| `estilo="fill"` | Caixas com fundo `background`, sem traço. |
| `tom` | Azul e roxo são do arquivo; rosa e laranja giram o matiz do azul (330° e 24°). Verde (142°), ciano (190°), âmbar (45°) e vermelho (356°) entraram em 2026-09-18; os três primeiros baixam a luminosidade da letra e da tag para empatar o contraste do azul. |

O cartão de métrica **não tem traço** (decisão do humano, 2026-09-17): o que o
separa do fundo é o gradiente `bg-metrica`, a mesma ideia do topo do perfil, e
cada cartão pode ter o próprio `tom` e um ícone de 16px na cor dele — mas o
lead do CRM **não usa**: cliente (reunião de 2026-09-18) tirou a variação
colorida de métricas e tags ("vibe code"); sem `tom`, o ícone herda a cor do
perfil e a tag fica cinza com a bolinha do status.

Com altura definida (a tela inteira, na camada), **quem rola no perfil é o
bloco do menu**, não a coluna: nome, telefone, métricas e contato ficam sempre
à vista e a lista de seções ocupa o que sobra (`DrawerBloco rolagem`, cliente
2026-09-18 — em notebook de tela baixa o nome não pode sumir). O conteúdo rola
por conta própria. O menu nunca fica com menos de 80px (dois itens); se nem
isso couber, rola a área dos blocos (métricas e contato), nunca o cabeçalho. Cada área que rola mostra uma seta na borda enquanto
houver conteúdo além dela. A seta sai da própria superfície: uma faixa de 48px
da cor do `card` atravessa a coluna inteira e some em degradê na direção do
conteúdo, para a seta nunca encostar no texto que passa por baixo. A faixa é
`pointer-events-none` — só a pastilha recebe clique, senão ela roubaria o
clique de tudo que passa embaixo. A pastilha é **sempre** um botão que rola 80%
da altura visível: seta que parece clicável e não é vira reclamação. O nome sai
de `ROTULOS_DE_ROLAGEM` ("Subir"/"Descer") e `rotulosRolagem` troca pelo texto
do contexto — botão sem nome não entra (regra E7).

O menu é **só lista**, uma coluna com o ícone ao lado. A grade de cards de
duas colunas e o interruptor lista/cards (`SeletorDeVisao`, ADR-018) saíram em
2026-09-22 a pedido do cliente: "parecia mobile, não ornou" (reunião de
2026-09-18).

O bloco "Contato principal" **só existe em lead empresa**: é a pessoa por trás
dela (nome, cargo, telefone, e-mail). Lead pessoa é o próprio contato e não tem
o bloco — nem no perfil da coluna nem na seção do conteúdo (cliente, 2026-09-18).

`fixacao` liga o alfinete do menu: `fixados` (ids, na ordem em que sobem),
`aoAlternar` e os dois rótulos (`rotuloFixar`, `rotuloDesafixar`). Quem guarda
a lista é a tela — no CRM, por lead e por pessoa. Sem a prop, o menu é a lista
do arquivo.

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `bg-nav-item-hover no item do menu` | figma | — |
| selecionado | `bg-nav-item-selected + texto e icone nav-item-selected + CaretRight` | figma | — |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | D6 |
| aberto | `scrim overlay/scrim 40% + foco preso + Escape` | inferido | L10 |
| recolhido | `bloco com hidden + caret -90°` | inferido | Select (caret girado) |
| fixado | `item sobe para o topo do menu + PushPin fill em nav-item-icon-selected` | humano | — |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

Rolagem das colunas: barra fina que só aparece sob o cursor (`rolagemDiscreta`,
lib/estados.ts) — "visível no hover" (cliente, 2026-09-24).
É a mesma de toda área que rola no DS.

## Tokens consumidos

`card` · `background` · `border` · `foreground` · `muted-foreground` ·
`accent` · `primary` · `nav/item/*` · `overlay/scrim` ·
`--tom-anel` · `--tom-texto` · `--tom-tag` · `--tom-brilho` · `base/blue/200` · `radius/xl` · `radius/lg` ·
`radius/md` · `radius/sm` · `shadow-xl` · `text/heading-1` · `text/heading-4` ·
`text/metric` · `text/label-lg` · `text/label-sm` · `text/body-sm` ·
`text/caption`

## Composição

Usa: [Avatar](Avatar.md) · [Tag](Tag.md) (com `SeletorTags`) · [Input](Input.md) · [Select](Select.md) · [DataTable](DataTable.md) (layout compacto) · [Button](Button.md) (`soft` e `outline`) · Phosphor · `Scrim` do [Modal](Modal.md) · `useCamada` (lib/use-camada.ts — foco preso, Escape, rolagem travada, pilha com o Modal) · `useSaida` e `useMontado` (lib/use-saida.ts). O botão do canto é próprio: 29px com fundo `card`, medido no arquivo ·
Usado por: tela de leads (ainda não construída)

## Exemplo de uso

```tsx
<Drawer aberto={aberto} aoFechar={fechar} rotulo="Lead Rafael Pinto Pinheiro">
  <DrawerPainel>
    <DrawerPerfil nome="Rafael Pinto Pinheiro" tipo="pessoa" rotuloTipo="Pessoa" aoFechar={fechar}>
      <DrawerBloco titulo="Métricas"><DrawerMetricas itens={metricas} /></DrawerBloco>
      <DrawerBloco titulo="Menu">
        <DrawerMenu rotulo="Seções do lead" itens={menu} atual={secao} aoEscolher={setSecao} />
      </DrawerBloco>
    </DrawerPerfil>
    <DrawerConteudo titulo="Histórico" descricao="Veja o histórico do seu lead">
      <LinhaDoTempo eventos={eventos} />
    </DrawerConteudo>
  </DrawerPainel>
</Drawer>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | Camada com `role="dialog"` e `aria-modal`; perfil em `<aside>`; menu em `<nav>` com `aria-current` no item escolhido |
| Teclado | Foco entra no painel ao abrir, Tab fica preso dentro, Escape fecha e o foco volta para quem abriu |
| Saída | Enquanto desliza para fora o painel fica `aria-hidden` e sem clique; o foco já voltou. Com `prefers-reduced-motion` não há saída: some na hora (I12) |
| Bloco com ação | O caret vira botão próprio ao lado do título, com o nome do bloco — botão dentro de botão é inválido |
| Blocos | Título do bloco é botão com `aria-expanded` e `aria-controls` |
| Ícones | Todos `aria-hidden`; os do contato ganham o nome do dado em texto só para leitor de tela |
| Botões só de ícone | Fechar, recolher, zoom e recolher nó têm `aria-label` e `title` |
| Indicador de rolagem | Botão com nome, no Tab só enquanto visível (`tabIndex -1` quando some) |
| Fixar | Botão irmão do item (botão dentro de botão é inválido), com `aria-pressed` e rótulo que diz a ação — "Fixar Negócios no topo" |
| Alvo de toque | Botão do canto 29px, item do menu 36px, alfinete 22px — **abaixo dos 44 da regra I15** |

## Divergências abertas (para o gate)

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-108, AUD-109, AUD-110, AUD-111, AUD-112, AUD-113, AUD-114, AUD-115, AUD-116, AUD-117, AUD-118, AUD-119 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
