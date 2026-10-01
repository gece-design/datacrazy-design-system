# Componente: Sidebar

## Responsabilidade

Navegação principal do CRM: marca, grupos de itens com ícone e rótulo,
interruptor de tema, atalhos e usuário — expandida em 282px ou colapsada em 88.

## Quando usar

- **Use** uma vez por tela, pela prop `navegacao` da `TelaBase`: é a navegação principal do CRM.
- **Não use** para as seções de um registro: é `DrawerMenu` ou `Tabs`.
- **Não use** junto de um menu superior: a navegação é uma só.
- **Não use** montada à mão ao lado do conteúdo.

## Família

`navegacao` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `270:15429` (painel, stroke INSIDE de 16px em `background` — regra
D9) · Marca: `270:7595` · Medição contra `124:2114` por
`scripts/medir-sidebar.mjs` (17 campos de geometria + contraste + anel de
foco, nos dois temas) · Lote: `1` · Escrita em 2026-09-03, antes do registro
existir. Diff de pixels não medido.

## Props

`Sidebar` — o painel. Fornece o contexto de colapso aos filhos.

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `colapsada` | `boolean` | `false` | não | 282px viram 88 e todo rótulo sai de cena; o `title` sobe para a raiz do item (D12). |
| `onColapsarChange` | `(colapsada: boolean) => void` | — | não | Passe para ganhar o `SidebarToggle` pendurado na borda direita (3px da borda, 59px do topo — coordenadas do arquivo, iguais nas duas larguras). |
| `rotulo` | `string` | — | não | Rótulo acessível da região de navegação. |
| `children` | `ReactNode` | — | sim | `SidebarTopo` e `SidebarRodape`. |

Peças:

| Peça | Props | O que é |
|------|-------|---------|
| `SidebarTopo` · `SidebarRodape` | `children` | Bloco de cima (marca + navegação) e de baixo (tema, atalhos, usuário), 8px entre filhos |
| `SidebarBrand` | — | `LogoDataCrazy`; vira só o símbolo quando colapsa |
| `SidebarGrupo` | `recuo?`, `children` | `<ul>` com 4px entre linhas; `recuo` é a folga de 2px do grupo principal |
| `SidebarItem` | `icone` (Phosphor, 20px, obrigatório), `children` (o rótulo), `selecionado?`, `href?`, `componente?`, `disabled?` | Raiz `a` com `href`, `span` sem; passe `Link` em `componente` para navegação client-side |
| `SidebarToggle` | `colapsada?` + props de botão | O botão da borda; `aria-expanded` |
| `SidebarThemeSwitch` | `tema`, `onTemaChange`, `className?` | Trilho claro/escuro; colapsada vira um botão só que alterna |
| `SidebarUser` | `nome`, `email`, `avatar?` | Rodapé com disco `sidebar-avatar` (sem foto: círculo cheio, como o arquivo) |

## Variantes

| Variante | Quando |
|----------|--------|
| expandida | Padrão |
| colapsada | Heavy user recupera 15–20% da tela (padrão G4 do FigJam) |
| item `selecionado` | Rota atual: `nav-item-selected` no fundo, ícone e texto |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `bg-nav-item-hover no item` | figma | L2 |
| selected | `bg-nav-item-selected + texto nav-item-selected-foreground + ícone nav-item-selected-icon` | figma | L7 |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | D6 |
| disabled | `aria-disabled:opacity-50 aria-disabled:pointer-events-none no item` | banco | I5 |
| recolhida | `282→88px, rótulos somem, title/aria-label sobem para a raiz (D12), toggle com aria-expanded` | humano | padrão G4 do FigJam |
<!-- kfe:estados:end -->

## Tokens consumidos

`sidebar-surface` (gradiente, D10) · `background` · `card` · `nav-item-hover` ·
`nav-item-selected` · `nav-item-selected-icon` · `nav-item-selected-foreground` ·
`nav-item-text` · `sidebar-avatar` · `muted-foreground` · `foreground` ·
`surface-inverse` · `primary` · `ring` · `shadow-highlight` · `shadow-float` ·
`radius/xl` · `radius/md` · `radius/full` · `text/button` · `text/body-lg`

## Composição

Usa: [LogoDataCrazy](LogoDatacrazy.md) ·
Usado por: a moldura do site de docs reaproveita só o `SidebarToggle`. O disco
do usuário **não** é o [Avatar](Avatar.md) (AUD-047, lote B6); os quatro
botões internos não são Button (AUD-035, lote B4).

## Exemplo de uso

```tsx
<Sidebar colapsada={colapsada} onColapsarChange={setColapsada} rotulo={t("navegacao")}>
  <SidebarTopo>
    <SidebarBrand />
    <SidebarGrupo recuo>
      <SidebarItem icone={House} componente={Link} href="/inicio" selecionado={rota === "/inicio"}>
        {t("inicio")}
      </SidebarItem>
      <SidebarItem icone={Kanban} componente={Link} href="/pipelines">{t("pipelines")}</SidebarItem>
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
| Toggle | `aria-expanded` no botão da borda |
| Chevrons | `muted-foreground`, não `subtle-foreground`: 2,4:1 reprova a WCAG 1.4.11 (D13) |
| Item sem destino | `span`, não `a` — um `a` dentro de outro é HTML inválido |
| Texto longo | 160px de rótulo, `truncate` + `title` (D12) |
| Movimento | A largura desliza em `base` (ADR-022, exceção declarada à I11); os rótulos somem na hora ao colapsar e dissolvem ao voltar. Com redução de movimento, nada anima |

## Divergências abertas (para o gate)

Nenhuma registrada além das da auditoria (AUD-011, AUD-035, AUD-047).
