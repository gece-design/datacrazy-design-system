# Componente: Conversa

## Responsabilidade

Mostrar uma conversa do atendimento e deixar responder: o contato no cabeçalho, as mensagens em balões (recebida, enviada, nota interna), os eventos do sistema e o compositor com mensagem ou nota — sete peças que a tela monta.

## Quando usar

- **Use** para o chat de um atendimento: `Conversa` é a casca, `ConversaCabecalho` o contato e as ações, `Mensagens` o log, `Balao` cada fala, `EventoDaConversa` o que o sistema registrou, `DivisorDeDia` a troca de dia e `Compositor` o rodapé que escreve.
- **Use** `Compositor` sozinho onde se responde em linha — a nota de um lead no `Drawer`, um comentário.
- **Não use** para a lista de conversas ao lado: é `ListaDeConversas`.
- **Não use** para o histórico de um lead (ligações, e-mails, etapas): é a linha do tempo do `Drawer`, não um chat.
- **Não use** `<textarea>` cru nem `<button>` cru no rodapé: o `Compositor` já traz `Textarea`, `SegmentedControl` e `Button`.

## Família

`superficie` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Não há: nasceu da tela de Atendimento (2026-09-29); componentizado em
2026-10-07 a pedido do cliente na reunião de 02/10. As classes da tela são a
verdade — o componente é a mesma coluna, pixel a pixel, sem conhecer o domínio.
O Figma acompanha na remedição.

## Props

### `Conversa`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `rotulo` | `string` | sim | Nome da região (`<section>`). Ex.: "Conversa com Marina Alvarenga". |
| `cabecalho` | `ReactNode` | não | O `ConversaCabecalho`. |
| `children` | `ReactNode` | sim | As mensagens: o `Mensagens` com os balões dentro. |
| `rodape` | `ReactNode` | não | O `Compositor`. |
| `className`… | nativos | não | Repassados ao `<section>`. |

### `ConversaCabecalho`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `avatar` | `{ nome; src? }` | sim | Quem está do outro lado: o nome dá a inicial e, com `src`, a foto. |
| `titulo` | `string` | sim | O nome do contato. Trunca com `title`. |
| `subtitulo` | `ReactNode` | não | A linha de apoio: o ícone do canal, o canal e o telefone. |
| `acoes` | `ReactNode` | não | Os botões à direita: assumir, transferir, finalizar, mostrar o lead. |
| `aoVoltar` | `() => void` | não | Com ela, o botão de voltar aparece abaixo de 768px. |
| `rotulos` | `Partial<RotulosDaConversa>` | não | `voltar`. |

### `Mensagens`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `chave` | `string \| number` | sim | Muda quando chega mensagem ou a conversa troca: o log rola até o fim. Ex.: `` `${conversa.id}:${mensagens.length}` ``. |
| `rotulos` | `Partial<RotulosDaConversa>` | não | `mensagens`, o nome do log. |
| `children` | `ReactNode` | sim | `Balao`, `EventoDaConversa` e `DivisorDeDia`, na ordem. |

### `Balao`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `de` | `"contato" \| "atendente" \| "nota"` | sim | Quem escreveu. `contato` à esquerda; `atendente` e `nota` à direita. A nota é do time: o contato não vê. |
| `children` | `ReactNode` | sim | O texto. Quebras de linha ficam. |
| `hora` | `string` | sim | Sob o balão. |
| `autor` | `string` | não | Antes da hora. Só aparece em `atendente` e `nota`. |
| `situacao` | `"enviada" \| "lida"` | não | Só em `atendente`: um tique (saiu) ou dois em azul (o contato leu). |
| `rotulos` | `Partial<RotulosDaConversa>` | não | `notaInterna`, `enviada`, `lida`. |

### `EventoDaConversa` e `DivisorDeDia`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `children` | `ReactNode` | sim | O que aconteceu ("Esther assumiu o atendimento") ou o dia ("Hoje", "20/09"). |
| `hora` | `string` | sim | Só no evento: depois do texto, com um ponto no meio. |

### `Compositor`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `valor` | `string` | sim | O rascunho. Estado da tela: trocar de conversa zera. |
| `aoMudar` | `(valor: string) => void` | sim | — |
| `modo` | `ModoDoCompositor` | sim | `"mensagem"` ou `"nota"`. Estado da tela. |
| `aoMudarModo` | `(modo) => void` | sim | O grupo mensagem/nota. |
| `aoEnviar` | `(texto: string) => void` | sim | Enter ou o botão, com texto: recebe o texto sem os espaços das pontas e o campo esvazia. |
| `acoes` | `ReactNode` | não | Botões entre o campo e o de enviar: respostas rápidas, anexar. |
| `rotulos` | `Partial<RotulosDaConversa>` | não | Os textos do compositor (abaixo). |
| `desabilitado` | `boolean` | não | Trava o grupo, o campo e o botão. |
| `finalizado` | `ReactNode` | não | Com ele, o compositor some e esta frase fica no lugar: a conversa finalizada. |

### `RotulosDaConversa`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `voltar`, `mensagens` | `string` | sim | O botão de voltar e o nome do log. |
| `notaInterna`, `enviada`, `lida` | `string` | sim | O selo da nota e os nomes dos dois tiques. |
| `modo`, `mensagem`, `nota` | `string` | sim | O nome do grupo e as duas opções (também o rótulo do campo). |
| `escreverMensagem`, `escreverNota` | `string` | sim | O placeholder do campo em cada modo. |
| `enviar`, `salvarNota` | `string` | sim | O nome do botão de enviar em cada modo. |
| `dica` | `string` | sim | Ao lado do grupo, de 640px para cima: "Enter envia · Shift + Enter quebra a linha". |

Fábrica em pt-BR: `ROTULOS_DA_CONVERSA`. No CRM os textos vêm do next-intl.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| `Balao de="contato"` | O que o contato escreveu: à esquerda, em `muted`. |
| `Balao de="atendente"` | O que o time respondeu: à direita, em `button-soft`, com o tique de enviada ou lida. |
| `Balao de="nota"` | O que o time anotou para si: à direita, em `warning` com selo. O contato não vê. |
| `Compositor modo="mensagem"` / `"nota"` | O rótulo, o placeholder e o nome do botão trocam com o modo. |
| `Compositor finalizado` | A conversa acabou: a frase no lugar do campo; reabrir é ação do cabeçalho. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| balão chegando | `animate-surgir (base): entra subindo 4px` | humano | ADR-068 |
| enviada / lida | `Check 14 em muted-foreground; Checks 14 em primary` | humano | — |
| nota interna | `border warning/25 + bg warning/10, selo NOTA INTERNA em warning` | humano | — |
| finalizada | `o Compositor mostra `finalizado` no lugar do campo` | humano | — |
| enviar desabilitado | `Button primary disabled enquanto o texto está vazio` | banco | I5 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher. Não há hover no balão: ele não é clicável.

## Tokens consumidos

`card` · `border` · `muted` · `button-soft` · `warning` · `foreground` ·
`muted-foreground` · `primary` · `divider` · `radius/md` · `radius/lg` ·
`text/label-lg` · `text/caption` · `text/body-lg` · `text/label-sm` ·
`text/body-sm` · `duration/base` — mais os do [Button](Button.md), do
[SegmentedControl](SegmentedControl.md) e do [Textarea](Textarea.md).

## Composição

Usa: [Avatar](Avatar.md) no cabeçalho · [Button](Button.md) `ghost` no voltar e `primary` no enviar ·
[SegmentedControl](SegmentedControl.md) em mensagem/nota · [Textarea](Textarea.md) `rotuloOculto` de 1 a 6 linhas ·
`rolagemDiscreta` de `lib/estados.ts`.
Usado por: a tela de Atendimento (`/prototipo?tela=atendimento`), com [Tag](Tag.md), [Combobox](Combobox.md) (`ComboboxPainel`),
[Menu](Menu.md) e [Tooltip](Tooltip.md) nas ações.

## Exemplo de uso

```tsx
const [texto, setTexto] = useState("");
const [modo, setModo] = useState<"mensagem" | "nota">("mensagem");

<Conversa
  rotulo={`Conversa com ${conversa.nome}`}
  cabecalho={
    <ConversaCabecalho
      avatar={{ nome: conversa.nome }}
      titulo={conversa.nome}
      subtitulo={<span className="truncate">{conversa.canal} · {conversa.telefone}</span>}
      aoVoltar={() => setNaConversa(false)}
      acoes={<Button size="sm" onClick={finalizar}>Finalizar</Button>}
    />
  }
  rodape={
    <Compositor
      valor={texto}
      aoMudar={setTexto}
      modo={modo}
      aoMudarModo={setModo}
      aoEnviar={(t) => enviar(t, modo)}
      finalizado={conversa.situacao === "finalizada" ? "Atendimento finalizado. Reabra para responder." : undefined}
    />
  }
>
  <Mensagens chave={`${conversa.id}:${conversa.mensagens.length}`}>
    {conversa.mensagens.map((m) =>
      m.de === "sistema" ? (
        <EventoDaConversa key={m.id} hora={m.hora}>{m.texto}</EventoDaConversa>
      ) : (
        <Balao key={m.id} de={m.de} hora={m.hora} autor={m.autor} situacao={m.lida ? "lida" : "enviada"}>
          {m.texto}
        </Balao>
      ),
    )}
  </Mensagens>
</Conversa>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Estrutura | `<section>` nomeada pelo contato; `<header>`, `role="log"` nomeado e `<footer>` |
| Mensagens | `role="log"`: o leitor de tela anuncia o que chega sem tirar o foco do campo. Só o log rola, nunca a página |
| Tiques | Ícones com nome (`enviada`, `lida`); o selo da nota é texto |
| Teclado | Enter envia, Shift + Enter quebra a linha; Enter no meio de uma composição não envia. Tab passa pelo grupo, pelo campo, pelas ações e pelo enviar |
| Enviar | Desabilitado sem texto e em `desabilitado`; o nome troca com o modo (`enviar` / `salvarNota`) |
| Texto longo | Título do cabeçalho trunca com `title`; o balão quebra palavras longas; o campo cresce até 6 linhas e rola por dentro |
| Idioma | Nada escrito à mão: tudo em `rotulos`, com `ROTULOS_DA_CONVERSA` como fábrica |
| Movimento | O balão entra subindo (base); com `prefers-reduced-motion` não há (global) |

## Divergências abertas (para o gate)

Sem par no arquivo: desenhar a Conversa no Figma a partir do código, na
remedição. O `uppercase` do selo da nota é o único texto em caixa alta do DS
fora do título de seção — manteve-se por ser a aparência da tela aprovada.
