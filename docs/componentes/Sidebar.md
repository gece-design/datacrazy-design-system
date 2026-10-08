# Componente: Sidebar

## Responsabilidade

Navegação principal do CRM: marca, grupos de itens com ícone e rótulo,
favoritos, interruptor de tema, atalhos e usuário — plana, direto no fundo da
aplicação, expandida em 220px ou recolhida em 48.

## Quando usar

- **Use** uma vez por tela, pela prop `navegacao` da `TelaBase`: é a navegação principal do CRM.
- **Use** `SidebarGrupo rotulo="Favoritos" ocultarRecolhida` para os atalhos que a pessoa fixou.
- **Não use** para as seções de um registro: é `DrawerMenu` ou `Tabs`.
- **Não use** junto de um menu superior: a navegação é uma só.
- **Não use** montada à mão ao lado do conteúdo.

## Família

`navegacao` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `270:15429` (painel) · Marca: `270:7595` · Lote: `1`.

**O código saiu do desenho de propósito.** O arquivo traz um painel de 282px em
cartão, com moldura de 16px, item de 36, ícone de 20, marca d'água e um disco
flutuante para recolher. Desde 2026-10-01 a navegação é plana — sem cartão,
220px aberta e 48 recolhida, item de 32, ícone de 16 — e o botão de recolher
fica na linha da marca (ADR-052 e ADR-054). É a proposta visual que aproxima o
CRM do Twenty e do Attio, aplicada por partes; o Figma acompanha na remedição
(AUD-210). O script que media o desenho antigo (`medir-sidebar.mjs`) saiu.

## Props

`Sidebar` — a navegação. Fornece o contexto de colapso aos filhos.

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `colapsada` | `boolean` | `false` | não | 220px viram 48 e todo rótulo sai de cena; o `title` sobe para a raiz do item (D12). |
| `onColapsarChange` | `(colapsada: boolean) => void` | — | não | Passe para ganhar o botão de recolher na linha da marca (`SidebarBrand`). Recolhida, o botão de expandir fica embaixo do símbolo, sempre à vista. |
| `rotulos` | `Partial<RotulosDaSidebar>` | `ROTULOS_DA_SIDEBAR` | não | `recolher` e `expandir`: os nomes do botão (i18n). |
| `rotulo` | `string` | — | não | Rótulo acessível da região de navegação. |
| `children` | `ReactNode` | — | sim | `SidebarTopo` e `SidebarRodape`. |

Peças:

| Peça | Props | O que é |
|------|-------|---------|
| `SidebarTopo` · `SidebarRodape` | `children` | Bloco de cima (marca, destinos, favoritos; 16px entre filhos) e de baixo (tema, atalhos, usuário; 8px) |
| `SidebarBrand` | — | `LogoDataCrazy` e, quando a Sidebar pode recolher, o `SidebarToggle` à direita. Recolhida, o símbolo encolhe para 20px (o tamanho de um ícone de item) e o `SidebarToggle` fica embaixo dele, sempre à vista — o símbolo de 32 que virava botão sob o cursor era grande e escondia o controle (cliente, 2026-10-02, ADR-072) |
| `SidebarGrupo` | `rotulo?`, `ocultarRecolhida?`, `children` | `<ul>` com 2px entre linhas. Com `rotulo`, é uma seção com nome ("Favoritos"): o nome some quando recolhe. `ocultarRecolhida` tira o grupo inteiro do painel recolhido. `recuo` não tem mais efeito |
| `SidebarItem` | `icone` (Phosphor, 16px, obrigatório; `fill` no selecionado), `children` (o rótulo), `selecionado?`, `href?`, `componente?`, `disabled?` | Raiz `a` com `href`, `span` sem; passe `Link` em `componente` para navegação client-side |
| `SidebarToggle` | `colapsada?`, `rotulos?` + props de botão | O botão de recolher: 28px, quadrado, sem relevo, com o ícone do painel; `aria-expanded`. A `SidebarBrand` já o traz — exportado para quem monta o topo de outro jeito. O arquivo desenha um disco flutuando na borda; saiu a pedido do cliente (ADR-052) |
| `SidebarThemeSwitch` | `tema`, `onTemaChange`, `className?` | Trilho claro/escuro; colapsada vira um botão só que alterna |
| `SidebarUser` | `nome`, `email`, `avatar?` | Rodapé com disco `sidebar-avatar` (sem foto: círculo cheio, como o arquivo) |

## Variantes

| Variante | Quando |
|----------|--------|
| expandida | Padrão: 220px |
| colapsada | 48px: quem já conhece o produto devolve 172px à tela (padrão G4 do FigJam) |
| item `selecionado` | Rota atual: `nav-item-selected` no fundo, texto na cor do token e ícone em `fill` |
| grupo com `rotulo` | Favoritos: atalhos que a pessoa fixou, com o nome da seção em `caption` |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `bg-card/50 no item (branco a 50% sobre background); texto e ícone em foreground no repouso` | humano | L2 |
| selected | `bg-card (branco) + texto nav-item-selected-foreground + ícone fill em nav-item-selected-icon` | humano | L7 |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | D6 |
| disabled | `aria-disabled:opacity-50 aria-disabled:pointer-events-none no item` | banco | I5 |
| recolhida | `220→48px, rótulos e nome de grupo somem, title/aria-label sobem para a raiz (D12), grupo com ocultarRecolhida sai, o símbolo da marca vira o botão de expandir` | humano | padrão G4 do FigJam |
<!-- kfe:estados:end -->

## Tokens consumidos

`background` · `card` (item selecionado e, a 50%, o hover) · `foreground` (texto e ícone em repouso) ·
`nav-item-selected-icon` · `nav-item-selected-foreground` · `nav-item-text` ·
`sidebar-avatar` · `muted-foreground` · `foreground` · `surface-inverse` ·
`ring` · `radius/md` · `radius/sm` · `radius/full` · `text/body-lg` ·
`text/label-lg` · `text/caption`

## Composição

Usa: [LogoDataCrazy](LogoDatacrazy.md) ·
Usado por: a `TelaBase`; a moldura do site de docs reaproveita só o `SidebarToggle`. O disco
do usuário **não** é o [Avatar](Avatar.md) (AUD-047, lote B6); os quatro
botões internos não são Button (AUD-035, lote B4).

## Exemplo de uso

```tsx
<Sidebar colapsada={colapsada} onColapsarChange={setColapsada} rotulo={t("navegacao")}>
  <SidebarTopo>
    <SidebarBrand />
    <SidebarGrupo>
      <SidebarItem icone={House} componente={Link} href="/inicio" selecionado={rota === "/inicio"}>
        {t("inicio")}
      </SidebarItem>
      <SidebarItem icone={Kanban} componente={Link} href="/pipelines">{t("pipelines")}</SidebarItem>
    </SidebarGrupo>
    <SidebarGrupo rotulo={t("favoritos")} ocultarRecolhida>
      {favoritos.map((f) => (
        <SidebarItem key={f.href} icone={Star} componente={Link} href={f.href}>{f.rotulo}</SidebarItem>
      ))}
    </SidebarGrupo>
  </SidebarTopo>
  <SidebarRodape>
    <SidebarGrupo>
      <li><SidebarThemeSwitch tema={tema} onTemaChange={setTema} /></li>
    </SidebarGrupo>
    <SidebarUser nome={usuario.nome} email={usuario.email} />
  </SidebarRodape>
</Sidebar>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Foco visível | Outline de 2px (D6) em item, toggle, tema e usuário |
| Rótulo colapsado | `title` e `aria-label` sobem para a raiz do item — o ícone sozinho tem nome |
| Toggle | `aria-expanded` e nome próprio (`rotulos`) no botão de recolher; recolhida, o símbolo da marca é um botão com o nome "Expandir menu" e funciona no toque |
| Chevrons | `muted-foreground`, não `subtle-foreground`: 2,4:1 reprova a WCAG 1.4.11 (D13) |
| Item sem destino | `span`, não `a` — um `a` dentro de outro é HTML inválido |
| Texto longo | O rótulo ocupa o que sobra do item (~170px), `truncate` + `title` (D12) |
| Favoritos | O `rotulo` do grupo é o nome acessível da lista (`aria-label`); o texto visível é decorativo |
| Movimento | A largura desliza em `base` (ADR-022, exceção declarada à I11); os rótulos somem na hora ao colapsar e dissolvem ao voltar. Com redução de movimento, nada anima |

## Divergências abertas (para o gate)

Nenhuma registrada além das da auditoria (AUD-011, AUD-035, AUD-047).
