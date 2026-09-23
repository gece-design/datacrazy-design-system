# Componente: TelaBase

## Responsabilidade

A casca de toda tela do CRM: Sidebar, Header, subcabeçalho e conteúdo já
ligados, com os breakpoints e a memória da sidebar. A tela só preenche os
encaixes. Instala-se como bloco (`@datacrazy/tela`), que cria a página pronta.

## Família

`superficie` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Não há um frame de "tela base": o arquivo desenha telas inteiras (o funil, o
drawer) e cada uma repete Sidebar e Header. A casca é a regra que essas telas
seguem, escrita uma vez (pedido do humano, 2026-09-23). O comportamento abaixo
de 1024px — a sidebar vira um menu por cima — é decisão nova (ADR-027); o
arquivo acompanha na remedição (AUD-203).

## Props

### `TelaBase`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `navegacao` | `ReactNode` | sim | O miolo da Sidebar: `SidebarTopo` (marca e itens) e `SidebarRodape` (tema, atalhos, usuário). |
| `cabecalho` | `HeaderProps` | sim | As props do [Header](Header.md): `titulo`, `subtitulo`, `trilha`, `utilitarios`, `acoes`. O botão de menu entra sozinho antes da trilha. |
| `subcabecalho` | `ReactNode` | não | A segunda linha: filtros, abas, `SegmentedControl`, troca-visão. |
| `children` | `ReactNode` | sim | O conteúdo. Rola por dentro; o cabeçalho fica. |
| `memoria` | `string` | não | Chave da memória da sidebar (aberta ou recolhida) no navegador, uma por tela. Sem ela, começa pelo breakpoint. |
| `recuo` | `boolean` | não | Padrão `true`: 16 · 24 · 32px no conteúdo. Desligue quando o conteúdo traz o próprio (o quadro do pipeline). |
| `rotulos` | `Partial<RotulosDaTela>` | não | `abrirMenu`, `fecharMenu`, `navegacao`, `conteudo` (i18n). Fábrica: `ROTULOS_DA_TELA`. |
| `className` | `string` | não | — |

## Variantes

| Largura | O que a casca faz |
|---------|-------------------|
| ≥ 1280px (`xl`) | Sidebar aberta, 282px. A pessoa pode recolher; a escolha fica na memória. |
| 1024–1279px (`lg`) | Sidebar nasce recolhida em ícones, 88px. A pessoa pode abrir. |
| < 1024px | A sidebar some. O botão de menu no Header abre a mesma Sidebar num painel por cima, com o `Scrim` do Modal, foco preso, Escape e o foco de volta ao botão. |

Os recuos do Header e do conteúdo acompanham: 16px abaixo de 768, 24 até 1023,
32 de 1024 em diante. A memória é lida antes da primeira pintura, para a
sidebar não abrir e recolher na frente da pessoa.

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| sidebar recolhida | `88px, só ícones — memória por tela (localStorage)` | humano | — |
| menu aberto (< 1024) | `painel fixo com Scrim, role=dialog, foco preso, fade-in-fast; sai com fade-out` | humano | L10 |
| focus | `outline 2px (foco) nos botões da casca` | banco | D6 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`background` · `border` · `overlay/scrim` · `opacity/scrim` · `elevation/xl` ·
`z/modal` · `duration/fast` · `duration/base` — o resto é da Sidebar e do Header.

## Composição

Usa: [Sidebar](Sidebar.md) (a mesma, no lugar e no painel por cima) · [Header](Header.md) ·
[Button](Button.md) `tertiary` no botão de menu e `BotaoFechar` no painel · `Scrim` do
[Modal](Modal.md) · `useCamada` e `useSaida` (lib).
Usado por: tela de leads (`/exemplos/pipeline`) · a tela base (`/exemplos/tela-base`, publicada como bloco `@datacrazy/tela`)

## Exemplo de uso

```tsx
<TelaBase
  memoria="leads"
  navegacao={
    <>
      <SidebarTopo>
        <SidebarBrand />
        <SidebarGrupo recuo>
          <SidebarItem icone={House} componente={Link} href="/" selecionado>Início</SidebarItem>
        </SidebarGrupo>
      </SidebarTopo>
      <SidebarRodape>
        <SidebarUser nome="Ana Prado" email="ana@empresa.com" />
      </SidebarRodape>
    </>
  }
  cabecalho={{
    titulo: "Leads",
    trilha: <Breadcrumb rotulo="Trilha" rotuloRecolhidos={(n) => `Mostrar mais ${n} níveis`} itens={[{ rotulo: "Início" }, { rotulo: "Leads" }]} />,
    utilitarios: <HeaderNotificacoes rotulo="Notificações" contagem={3} />,
    acoes: <Button>Novo lead</Button>,
  }}
  subcabecalho={<SegmentedControl rotulo="Recorte" atual={visao} aoEscolher={setVisao} itens={recortes} />}
>
  <DataTable colunas={colunas}>{linhas}</DataTable>
</TelaBase>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Regiões | `<nav>` nomeado (a Sidebar), `<header>`, `<main>` nomeado por `rotulos.conteudo` |
| Menu (< 1024) | Botão com `aria-haspopup="dialog"` e `aria-expanded`; o painel é `role="dialog"` com `aria-modal`, foco preso, Escape fecha, foco volta ao botão; clique num item fecha |
| Teclado | Tab: menu → trilha → utilitários → ações → subcabeçalho → conteúdo. A Sidebar recolhida mantém os itens no Tab, com o nome no `aria-label` |
| Rolagem | Só o conteúdo rola; cabeçalho e navegação ficam |
| Movimento | Painel entra e sai com fade (fast · base); largura da sidebar em `base` (ADR-022); com `prefers-reduced-motion` não há |

## Divergências abertas (para o gate)

AUD-203 (`adiado`, lote `figma`): o menu por cima abaixo de 1024px e os
recuos por breakpoint não estão no arquivo. Desenhar a partir do código.
