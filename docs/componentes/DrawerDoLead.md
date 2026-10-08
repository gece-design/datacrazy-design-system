# Componente: DrawerDoLead

## Responsabilidade

O lead do CRM inteiro, aberto por cima da tela: as peças do [Drawer](Drawer.md)
(perfil, métricas, menu, conteúdo) montadas nas cinco seções do arquivo —
Histórico, Perfil, Campos adicionais, Negócios e Hierarquia — com o seletor de
tags e os cartões editáveis. É UM em toda tela.

## Quando usar

- **Use** sempre que um lead abre: clique na linha da `Table`, no cartão do quadro do funil, no negócio parado do dashboard, no "abrir o lead completo" do Atendimento. Nunca monte um segundo drawer de lead.
- **Use** `dados`, `tags` e `secoes` para abrir o lead da tela: o nome, o telefone e as tags vêm de fora, e as seções que a tela sabe preencher (Histórico, Perfil) substituem as do arquivo.
- **Não use** para ver um registro ao lado da lista sem cobrir a tela: é o `PainelLateral` (bloco da Automação).
- **Não use** para criar um lead com poucos campos: é `Modal`.

## Família

`overlay` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

`565:5959` (component set "Drawer", canvas `533:3809`): as cinco seções do eixo
`Menu`, medidas em 2026-09-14. O arquivo vivia em `app/feedback/drawer/` como
composição do showcase e virou peça em 2026-10-07, a pedido do cliente na
reunião de 02/10 (ADR-073). Plano e compacto desde 2026-10-02 (ADR-065).

## Props

### `DrawerLead`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `lead` | `"rafael" \| "joel"` | não | Um dos dois leads do arquivo (`LEADS`), para o showcase. Padrão `rafael`. |
| `dados` | `LeadDoDrawer` | não | O lead a mostrar: `nome`, `tipo`, `telefone`, `email`, `tags` (ids), `metricas` (as quatro do perfil), `contatoPrincipal?` (`nome`, `cargo?`, `telefone?`, `email?`). Com ele, `lead` é ignorado. |
| `tags` | `ReactNode` | não | A fileira de tags do perfil. Sem ela, `TagsDoLead` com o catálogo do arquivo e o seletor. |
| `secoes` | `Partial<Record<string, SecaoDoDrawer>>` | não | Seções com conteúdo próprio, por id do menu (`historicos`, `perfil`…). As outras vêm do arquivo (`cabecalhos`). |
| `estilo` | `"outline" \| "fill"` | não | O estilo da coluna do perfil. Padrão `outline`. |
| `tom` | `TomPerfil` | não | A cor do perfil: anel do avatar e tag de tipo. |
| `menuInicial` | `string` | não | A seção aberta ao montar. Padrão `historicos`. |
| `aoFechar` | `() => void` | não | O X do perfil. Quem fecha a camada é a tela (`Drawer aberto`). |
| `memoria` | `string` | não | Chave do navegador que lembra a largura arrastada (`DrawerPainel`). Uma por tela. |
| `className` | `string` | não | — |

### Outros exports

| Export | O que é |
|--------|---------|
| `LeadDoDrawer`, `ContatoPrincipal`, `SecaoDoDrawer` | Os tipos do lead, da pessoa por trás de um lead empresa e de uma seção com conteúdo próprio (`titulo`, `descricao`, `Corpo`). |
| `cabecalhos` | As cinco seções do arquivo, por id do menu — a tela estende (`{ ...cabecalhos.perfil, Corpo }`). |
| `MENU_LEAD` | Os itens do menu do lead (`ItemMenuDrawer[]`), na ordem do arquivo. |
| `CATALOGO_TAGS`, `tagsEscolhidas` | O catálogo de tags do arquivo e as escolhidas por id, na ordem do perfil. |
| `TagsDoLead` | A fileira de tags do perfil com o `SeletorTags` no fim; recebe `iniciais` (os ids escolhidos) e o catálogo é estado. |
| `LEADS`, `linhasDoContato` | Os dois leads do arquivo e as linhas do bloco "Contato principal". |

## Variantes

| Variante | Quando usar |
|----------|-------------|
| showcase (`lead`) | A página do Drawer: os dois leads do arquivo. |
| da tela (`dados` + `secoes`) | Toda tela do CRM: o lead clicado, com o histórico e o perfil que a tela sabe montar. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| seção trocando | `o corpo entra com fade-in-fast` | humano | ADR-068 |
| perfil recolhido | `DrawerBotaoCanto recolhe a coluna; o conteúdo ocupa tudo` | figma | — |
| item fixado | `sobe ao topo do menu, alfinete cheio` | humano | — |
| largura arrastada | `720 a 1080, lembrada por memoria` | humano | ADR-040 |
<!-- kfe:estados:end -->

Os estados das peças (hover, foco, rolagem) são os do [Drawer](Drawer.md).

## Tokens consumidos

Os do [Drawer](Drawer.md), mais `--tom-*` (perfil, avatar e tag de tipo) e os
dos cartões ([Input](Input.md) `cartao`, [Select](Select.md) `cartao`).

## Composição

Usa: [Drawer](Drawer.md) (`DrawerPainel`, `DrawerPerfil`, `DrawerBloco`, `DrawerMetricas`, `DrawerContato`, `DrawerMenu`, `DrawerConteudo`, `DrawerSecao`, `DrawerBotaoCanto`, `LinhaDoTempo`, `HierarquiaNo`, `HierarquiaCanvas`) · [Tag](Tag.md) (`SeletorTags`) · [Avatar](Avatar.md) · [Input](Input.md) (`CampoEditavel`, `CartaoDeCampo`, `AcaoCopiar`) · [Telefone](Telefone.md) · [Rating](Rating.md) · [Select](Select.md) `cartao` · [Switch](Switch.md) · [Button](Button.md) · `gradeDeCartoes` (lib/campo).
Usado por: tela de Leads, Pipeline, Atendimento e Dashboard (`painel-lead.tsx`, `lead-completo.tsx`, `lead-parado.tsx`) · página do Drawer e do Drawer variações

## Exemplo de uso

```tsx
<Drawer aberto={Boolean(lead)} aoFechar={fechar} rotulo={`Lead ${lead?.nome ?? ""}`}>
  {lead ? (
    <DrawerLead
      dados={{ nome: lead.nome, tipo: "pessoa", telefone: lead.telefone, email: lead.email, tags: [], metricas: lead.metricas }}
      tags={<TagsDoLead iniciais={lead.tags} />}
      secoes={{ historicos: { ...cabecalhos.historicos, Corpo: () => <LinhaDoTempo eventos={lead.historico} /> } }}
      memoria="leads"
      aoFechar={fechar}
    />
  ) : null}
</Drawer>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Camada | A do [Drawer](Drawer.md): foco preso, Escape, rolagem travada, foco de volta |
| Perfil | Nome em `<h2>`; telefone e e-mail como texto, com copiar por `AcaoCopiar` |
| Menu | Itens com ícone e nome; o fixado é botão irmão do item |
| Seções | Cada corpo é uma região nomeada pelo título da seção |
| Idioma | Os textos do arquivo (seções, rótulos) estão em português no componente: a tela que os traduz passa `secoes` e `tags` próprias |

## Divergências abertas (para o gate)

Os textos das seções do arquivo (Histórico, Perfil…) moram no componente —
é a composição do showcase que virou peça. Quando o CRM instalar, as seções
vêm por `secoes` com o texto do next-intl; os rótulos fixos que sobram
(métricas, "Contato principal") pedem `rotulos` numa próxima rodada.
