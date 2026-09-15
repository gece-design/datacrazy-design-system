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

### `DrawerPerfil`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `nome` | `string` | sim | Nome, inicial do avatar e rótulo da coluna. |
| `tipo` | `"pessoa" \| "empresa"` | sim | Ícone da tag sobre o avatar. |
| `rotuloTipo` | `string` | sim | Texto dessa tag (i18n). |
| `telefone`, `email` | `string` | não | Linhas sob o nome. |
| `estilo` | `"outline" \| "fill"` | não | Padrão `outline`. Desce por contexto aos blocos. |
| `tom` | `"azul" \| "roxo" \| "rosa" \| "laranja"` | não | Anel e letra do avatar, tag de tipo e brilho. Padrão: azul para pessoa, roxo para empresa. |
| `tags`, `acoes` | `ReactNode` | não | Fileira de tags e os dois botões. |
| `aoFechar`, `aoRecolher` | `() => void` | não | Sem eles, o botão do canto não aparece. |

### Peças do perfil e do conteúdo

`DrawerBloco` (`titulo`, `inicialAberto`) · `DrawerMetricas` (`itens`,
`colunas` 2 ou 4, `estilo`) · `DrawerContato` (`linhas` com `texto`, `icone`,
`rotulo`) · `DrawerMenu` (`itens`, `atual`, `aoEscolher`, `rotulo`) ·
`DrawerConteudo` (`titulo`, `descricao`, `acoes`, `antesDoTitulo`) ·
`DrawerSecao` (`titulo`) · `LinhaDoTempo` (`eventos`) · `HierarquiaNo`
(`nome`, `subtitulo`, `tipo`, `atual`, `recolher`) · `HierarquiaCanvas`
(`rotulos` do zoom).

## Variantes

| Variante | Quando usar |
|----------|-------------|
| `estilo="outline"` | Padrão. Caixas com traço de 2px em `background`. |
| `estilo="fill"` | Caixas com fundo `background`, sem traço. |
| `tom` | Azul e roxo são do arquivo; rosa e laranja giram o matiz do azul (330° e 24°). |

Com altura definida (a tela inteira, na camada), perfil e conteúdo **rolam
cada um por conta própria**.

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `bg-nav-item-hover no item do menu` | figma | — |
| selecionado | `bg-nav-item-selected + texto e icone nav-item-selected + CaretRight` | figma | — |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | I4 |
| aberto | `scrim overlay/scrim 40% + foco preso + Escape` | inferido | Select (lista aberta) |
| recolhido | `bloco com hidden + caret -90°` | inferido | Select (caret girado) |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`card` · `background` · `border` · `foreground` · `muted-foreground` ·
`accent` · `primary` · `nav/item/*` · `overlay/scrim` ·
`--tom-anel` · `--tom-texto` · `--tom-tag` · `--tom-brilho` · `base/blue/200` · `radius/xl` · `radius/lg` ·
`radius/md` · `radius/sm` · `shadow-xl` · `text/heading-1` · `text/heading-4` ·
`text/metric` · `text/label-lg` · `text/label-sm` · `text/body-sm` ·
`text/caption`

## Composição

Usa: [Avatar](Avatar.md) · [Tag](Tag.md) (com `SeletorTags`) · [Input](Input.md) ·
[Select](Select.md) · [DataTable](DataTable.md) (layout compacto) · `Button`
(`soft` e `outline`) · Phosphor ·
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
| Blocos | Título do bloco é botão com `aria-expanded` e `aria-controls` |
| Ícones | Todos `aria-hidden`; os do contato ganham o nome do dado em texto só para leitor de tela |
| Botões só de ícone | Fechar, recolher, zoom e recolher nó têm `aria-label` e `title` |
| Alvo de toque | Botão do canto 29px, item do menu 36px — **abaixo dos 44 da regra I15** |

## Divergências abertas (para o gate)

1. **Tons do perfil sem variável no Figma.** Os quatro roxos do arquivo
   (`#F2E8FF`, `#6C12E2`, `#8B33FF`, `#EEE0FF`) são o azul do sistema com o
   matiz em 266°. Entraram como `[data-tom]` no CSS por decisão do humano
   (2026-09-15), com rosa e laranja pela mesma conta. Os escuros são derivados.
2. **Brilho do topo no escuro é derivado.** O gradiente vai a
   `base/blue/100`, primitivo sem modo; no escuro aponta para `accent`.
3. **A camada não está no arquivo.** Scrim a 40%, foco preso e Escape são
   derivação — o Figma desenha só o painel.
4. **Button do arquivo mudou.** Os botões do drawer no Figma têm texto 12px e
   gap 6; o `Button` do código segue 13px e gap 8.
5. **Botão do canto direito sem função no arquivo.** Aqui ele recolhe o perfil
   e o conteúdo ganha um botão para reabrir. Raio 9,67 (instância escalada)
   virou o degrau `lg`.
6. **Hover invisível no `fill` claro.** `nav/item/bg-hover` é `background`, a
   mesma cor do fundo do menu nesse estilo.
7. **Título do bloco mistura estilos.** Tamanho do `body-sm` com peso e
   entrelinha do `heading-4`, como no arquivo.
8. **Hierarquia.** O pontilhado do canvas aparece só na imagem, não no
   contexto, e ficou de fora. Zoom e recolher são derivados. O "–" do nó não
   atual fica 7px acima no arquivo; aqui está em linha.
9. **Sete seções do menu sem desenho** (Atividades, Atendimentos, Pessoas,
   Empresas, Endereços, Arquivos, Notas).
10. **Tab e Accordion Header** não aparecem no drawer e não foram construídos.
