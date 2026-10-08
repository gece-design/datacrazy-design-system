# Componente: Upload

## Responsabilidade

Receber arquivos num formulário: a zona de soltar (ou clicar para escolher) e
a lista do que entrou, com tamanho, progresso, erro e remover. Quem envia e
quem guarda é a tela.

## Quando usar

- **Use** quando o registro guarda arquivos: a base de conhecimento do agente, os documentos de um negócio, a importação de uma planilha.
- **Use** `aceita` e `rotulos.apoio` juntos: o seletor filtra e a zona diz o que entra ("PDF, DOCX ou TXT até 10 MB").
- **Não use** para a foto de uma pessoa: é o `Avatar` com um botão de trocar.
- **Não use** para anexar numa mensagem: é o clipe do `Compositor` da `Conversa`, que abre o seletor direto.
- **Não use** `<input type="file">` cru: a zona, o foco, o arrastar e a lista já estão aqui.

## Família

`entrada` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Não há: nasceu do pedido do cliente na reunião de 2026-10-02 ("falta um
componente de upload de arquivo", para a base de conhecimento dos agentes) e
entrou em 2026-10-08 (ADR-074). O arquivo passa a acompanhar o código na
remedição (AUD-203, lote `figma`).

## Props

### `Upload`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `rotulo` | `string` | sim | Texto do rótulo, visível. |
| `rotuloOculto` | `boolean` | não | Tira o rótulo da tela e o mantém para o leitor de tela. |
| `ajuda` | `string` | não | Texto de apoio sob o campo. Some enquanto há `erro`. |
| `obrigatorio` | `boolean` | não | Asterisco e `aria-required`. |
| `erro` | `string` | não | Erro do campo inteiro: sob a lista, com a zona em traço de erro. |
| `arquivos` | `ArquivoDoUpload[]` | sim | O que já entrou, na ordem. Quem guarda e quem envia é a tela. |
| `aoAdicionar` | `(arquivos: File[]) => void` | sim | Os arquivos escolhidos ou soltos. A tela filtra, envia e põe em `arquivos`. |
| `aoRemover` | `(id: string) => void` | não | Sem ela, a linha não tem o botão de remover. |
| `aceita` | `string` | não | O `accept` do seletor do sistema. Ex.: `".pdf,.docx,.txt"`. |
| `multiplo` | `boolean` | não | Vários de uma vez. Padrão: um. |
| `locale` | `string` | não | Tamanhos no idioma de quem lê. Padrão `pt-BR`. |
| `disabled` | `boolean` | não | Zona apagada, sem clique nem soltar. |
| `rotulos` | `Partial<RotulosDoUpload>` | não | `chamada`, `apoio?`, `remover(nome)`, `enviando(progresso)`. Fábrica: `ROTULOS_DO_UPLOAD`. |
| `className` | `string` | não | — |

### `ArquivoDoUpload`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `id` | `string` | sim | — |
| `nome` | `string` | sim | Corta com reticências; o nome inteiro fica no `title`. |
| `tamanho` | `number` | não | Em bytes. Sai como "1,2 MB" por `tamanhoLegivel`. |
| `progresso` | `number` | não | 0 a 99 enquanto sobe: a barra aparece. 100 ou ausente = pronto. |
| `erro` | `string` | não | A linha fica em erro e mostra a mensagem. |

`tamanhoLegivel(bytes, locale?)` devolve "340 KB", "1,2 MB".

## Variantes

| Variante | Quando usar |
|----------|-------------|
| um arquivo | Importar uma planilha, anexar um contrato: sem `multiplo`. |
| vários | A base de conhecimento: `multiplo`, cada um numa linha. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `traço input/border-hover na zona` | banco | L2 |
| focus | `outline 2px com respiro na zona, lendo o foco do input (focoPeer)` | banco | D6 |
| arrastando por cima | `traço primary + fundo accent; o ícone fica primary` | humano | — |
| erro | `zona e linha em input/border-error; mensagem em destructive` | banco | E6 |
| enviando | `barra de 4px em primary, width anima em base` | humano | ADR-068 |
| desabilitado | `fundo input/bg-disabled, cursor not-allowed, sem soltar` | banco | I5 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`input/bg` · `input/bg-disabled` · `input/border` · `input/border-hover` ·
`input/border-error` · `input/label` · `input/text-disabled` · `card` · `border` ·
`muted` · `accent` · `primary` · `destructive` · `foreground` ·
`muted-foreground` · `radius/md` · `radius/full` · `text/label-md` ·
`text/label-lg` · `text/body-md` · `text/caption` · `duration/base` ·
`ease/enter`

## Composição

Usa: `lib/campo.ts` (`rotuloDeCampo`, `ajudaDeCampo`, `erroDeCampo`,
`asteriscoDeCampo`) · `lib/estados.ts` (`focoPeer`) · [Button](Button.md)
`ghost` `icon-xs` no remover · Phosphor (`UploadSimple`, `File`, `X`).
Usado por: tela de Agentes de IA (`/exemplos/agentes`, a base de conhecimento)

## Exemplo de uso

```tsx
const [arquivos, setArquivos] = useState<ArquivoDoUpload[]>([]);

<Upload
  rotulo="Arquivos da base"
  ajuda="O agente lê estes arquivos para responder."
  aceita=".pdf,.docx,.txt"
  multiplo
  rotulos={{ apoio: "PDF, DOCX ou TXT até 10 MB" }}
  arquivos={arquivos}
  aoAdicionar={(novos) => novos.forEach((f) => enviar(f))}
  aoRemover={(id) => setArquivos((lista) => lista.filter((a) => a.id !== id))}
/>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel/rótulo | `<label htmlFor>` no rótulo e na zona; o `<input type="file">` real está escondido só da vista |
| Teclado | Tab leva à zona; Enter e Espaço abrem o seletor do sistema; o remover é botão com nome |
| Foco visível | Outline de 2px com respiro na zona, lendo o foco do input (`peer`) |
| Arrastar | Alternativa sempre presente: o clique abre o seletor |
| Progresso | `role="progressbar"` com `aria-valuenow` e o texto de `rotulos.enviando` |
| Erro | `aria-invalid` e `aria-describedby` apontando a mensagem; o erro de um arquivo fica na linha dele |
| Idioma | Nada escrito à mão: textos por `rotulos`, tamanho por `Intl.NumberFormat` |

## Divergências abertas (para o gate)

AUD-203 (`adiado`, lote `figma`): sem par no arquivo. Desenhar a zona e a
linha no Figma a partir do código, na remedição.
