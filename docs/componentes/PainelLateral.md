# Componente: PainelLateral

## Responsabilidade

Mostrar um registro aberto ao lado da lista, sem cobri-la: o lead, o negócio ou o contato num painel de 480px que empurra o conteúdo.

## Quando usar

- **Use** para editar, no encaixe `lateral` da `TelaBase`, algo que a pessoa precisa continuar vendo na tela de trás e que não é um registro com perfil: o bloco de uma automação, um item de configuração. A tela continua à vista e clicar em outro item troca o painel.
- **Use** `ListaDeCampos` com `LinhaDeCampo` para os dados do registro: rótulo à esquerda, valor à direita. Valor que edita no lugar é `CelulaEditavel` (texto) ou `CelulaEscolha` (lista).
- **Use** `Tabs` para separar as seções (visão geral, histórico, arquivos) e `aoAlternarTelaCheia` quando o registro merece a tela toda.
- **Não use** para decisão que bloqueia a tela (confirmar, criar com poucos campos): é `Modal`.
- **Não use** para o lead nem para outro registro do CRM com perfil (pessoa, empresa, negócio): ele abre no `Drawer` do lead, o mesmo em toda tela (ADR-061).
- **Não use** fora do encaixe `lateral`, solto no conteúdo: é a `TelaBase` que encolhe a lista e, abaixo de 1024px, dá a tela ao painel.

## Família

`overlay` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Sem par no arquivo. É a quinta parte da proposta visual que aproxima o CRM do
Twenty e do Attio (registro em painel lateral que empurra a lista, com campos
em linha), aprovada pelo humano em 2026-10-01 (ADR-056). O arquivo desenha o
registro no Drawer, por cima da lista. O Figma acompanha na remedição.

## Props

### PainelLateral

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `titulo` | `string` | — | sim | Nome do registro: o título (`h2`) e o nome da região. |
| `subtitulo` | `ReactNode` | — | não | Linha de apoio sob o título. Ex.: a empresa. |
| `inicio` | `ReactNode` | — | não | Antes do título: o avatar ou o ícone do registro. |
| `acoes` | `ReactNode` | — | não | Botões a mais no cabeçalho, antes de tela cheia e fechar. |
| `aoFechar` | `() => void` | — | sim | Chamado pelo X e pelo Escape com o foco dentro. |
| `telaCheia` | `boolean` | `false` | não | Ocupa a tela toda. Passe o mesmo valor em `lateralCheia` da `TelaBase`. |
| `aoAlternarTelaCheia` | `() => void` | — | não | Sem ela, o botão de tela cheia não aparece. |
| `rotulos` | `RotulosDoPainelLateral` | — | sim | `fechar`, `expandir` e `recolher`: os nomes dos botões (i18n). |
| `largura` | `number` | `480` | não | Largura ao lado da lista, em px. Abaixo de 1024px o painel ocupa a tela. |
| `children` | `ReactNode` | — | sim | Abaixo do cabeçalho: `Tabs` e `PainelLateralCorpo`. |
| `className`, `style`, `onKeyDown`… | nativos | — | não | Repassados ao `<aside>`. |

### Peças

| Peça | Props | O que é |
|------|-------|---------|
| `PainelLateralCorpo` | `children`, `className?` | A área que rola, com recuo de 12 e 16 entre blocos. Em tela cheia o conteúdo fica numa coluna de 720px, ao centro. |
| `ListaDeCampos` | `children` | `<dl>`: a lista de campos do registro, sem vão entre as linhas. |
| `LinhaDeCampo` | `rotulo`, `icone?`, `children` | Um campo em linha: rótulo à esquerda (144px, com ícone de 14), valor à direita, 32px de altura. |

## Variantes

| Variante | Quando usar |
|----------|-------------|
| ao lado | Padrão: 480px, traço à esquerda, a lista continua à vista. |
| `telaCheia` | O registro pede espaço: a lista sai e o conteúdo fica numa coluna de leitura. |
| abaixo de 1024px | O painel é a tela; o X volta para a lista. O botão de tela cheia some. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| aberto | `aside de 480px com traço à esquerda, dentro do painel da tela; a lista encolhe e continua à vista` | humano | — |
| tela cheia | `o painel ocupa a tela; a TelaBase esconde Header e conteúdo (lateralCheia); corpo em coluna de 720px` | humano | — |
| focus | `outline 2px nos botões do cabeçalho; o foco não é preso — região complementar, não diálogo` | banco | D6 |
| abrindo | `fade-in-fast; fecha na hora` | banco | L10 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`card` · `border` · `foreground` · `muted-foreground` · `ring` · `text/h4` ·
`text/caption` · `text/body-md` · `duration/fast` — mais os do Button `ghost`
(tela cheia e fechar).

## Composição

Usa: `Button` e `BotaoFechar`, `rolagemDiscreta` de `lib/estados.ts` ·
Usado por: a `TelaBase` (encaixe `lateral`) e a tela do Pipeline, com `Tabs`, `Tag`, `SeletorTags`, `CelulaEditavel`, `CelulaEscolha` e `LinhaDoTempo` por dentro.

## Exemplo de uso

```tsx
<TelaBase
  navegacao={navegacao}
  cabecalho={cabecalho}
  recuo={false}
  lateral={
    aberto ? (
      <PainelLateral
        titulo={aberto.nome}
        subtitulo={aberto.empresa}
        inicio={<Avatar nome={aberto.nome} size="sm" aria-hidden="true" />}
        telaCheia={telaCheia}
        aoAlternarTelaCheia={() => setTelaCheia((v) => !v)}
        aoFechar={() => setAbertoId(null)}
        rotulos={{ fechar: "Fechar o lead", expandir: "Abrir em tela cheia", recolher: "Voltar ao painel" }}
      >
        <PainelLateralCorpo>
          <ListaDeCampos>
            <LinhaDeCampo icone={CurrencyDollar} rotulo="Valor">
              <CelulaEditavel valor={aberto.valor} rotulo="Editar valor" aoSalvar={salvarValor} />
            </LinhaDeCampo>
            <LinhaDeCampo icone={Phone} rotulo="Telefone">
              {aberto.telefone}
            </LinhaDeCampo>
          </ListaDeCampos>
        </PainelLateralCorpo>
      </PainelLateral>
    ) : null
  }
  lateralCheia={Boolean(aberto) && telaCheia}
>
  <DataTable colunas={colunas}>{linhas}</DataTable>
</TelaBase>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | `<aside>` com o nome do registro: região complementar, não diálogo — não prende o foco nem escurece a tela |
| Foco | Continua na linha que abriu o registro; setas e Enter trocam de registro sem sair da lista. Tab entra no painel |
| Teclado | Escape com o foco dentro fecha, salvo quando um campo em edição ou uma lista aberta usa o Escape para si |
| Botões | Tela cheia com `aria-pressed` e nome que muda (`expandir` / `recolher`); o X tem nome próprio |
| Campos | `<dl>` com `<dt>` e `<dd>`: o leitor de tela anuncia o par rótulo e valor |
| Texto longo | Título e rótulo truncam com `title` |
| Tela pequena | Abaixo de 1024px o painel ocupa a tela e a lista sai da ordem de foco |
