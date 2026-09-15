# Componente: RadioGroup

## Responsabilidade

Escolher exatamente uma opção entre poucas, todas visíveis ao mesmo tempo.

## Família

`entrada` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `547:45` (component set "Radio", canvas `↳ Form controls`) · Lote: `3`
(antecipado: veio no mesmo canvas do Checkbox) · Última verificação:
**2026-09-14**, medição de valor computado — círculo, espessura e cor do traço,
fundo, cor do rótulo e gap nos 4 estados × 2 temas, em densidade 1× e 2×. Zero
divergência. Diff de pixels não medido (ponte `figma-console` fora do ar).

## Props

`RadioGroup`:

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `rotulo` | `string` | — | não* | Nome do grupo para leitor de tela. *Sem ele, use `aria-labelledby`. |
| `valor` | `string` | — | não | Valor escolhido (controlado). |
| `valorPadrao` | `string` | — | não | Valor inicial (solto). |
| `onValorChange` | `(v: string) => void` | — | não | Chamado ao escolher. |
| `name` | `string` | gerado | não | Nome do campo no `<form>`. |
| `disabled` | `boolean` | — | não | Desliga todos os itens. |
| `className` | `string` | — | não | Layout. Padrão: coluna com gap 20. |

`Radio`: `value` (obrigatório), `children` (rótulo) e os atributos nativos do
`<input>`. Fora de `RadioGroup` lança erro.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| vertical | Padrão. Uma opção por linha. |
| em linha | `className="flex-row flex-wrap"`. Opções curtas. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `ring-input-border-hover (desmarcado) · ring-primary-hover (marcado)` | banco | I1 |
| focus | `outline outline-2 outline-offset-2 outline-ring no circulo (peer-focus-visible)` | banco | I4 |
| marcado | `ring-inset 5px primary sobre input/bg (miolo de 8px)` | figma | — |
| disabled | `bg-input-bg-disabled · marcado ring-subtle-foreground · rotulo input-text-disabled` | figma | — |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`input/bg` · `input/border` · `input/border-hover` · `input/bg-disabled` ·
`input/text-disabled` · `primary` · `primary-hover` · `subtle-foreground` ·
`foreground` · `ring` · `radius/full` · `text/body-md`

## Composição

Usa: nenhum componente do DS — é primitivo ·
Usado por: nenhuma tela ainda. Destino: gatilho de automação, canal de origem,
motivo de perda.

## Exemplo de uso

```tsx
<RadioGroup rotulo={t("tipoDePessoa")} valor={tipo} onValorChange={setTipo}>
  <Radio value="fisica">{t("pessoaFisica")}</Radio>
  <Radio value="juridica">{t("pessoaJuridica")}</Radio>
</RadioGroup>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Foco visível | Outline de 2px com respiro transparente (D6), no círculo |
| Papel/rótulo | `role="radiogroup"` com nome; itens são radios nativos com o mesmo `name` |
| Teclado | Nativo: setas movem **e** selecionam, Tab entra pelo marcado e sai do grupo. Verificado com Playwright |
| Alvo de toque | 18px de círculo, estendido pelo `<label>`. Abaixo dos 44px da I15 |
| Movimento | A espessura 1.5 → 5 anima como sombra |
| Contraste | Contorno do desmarcado ~1,2:1 — ver divergência 1 |

## Divergências abertas (para o gate)

1. **Desmarcado com contorno fraco** — mesma do Checkbox: é o token
   `input/border` sobre `card`, abaixo dos 3:1 da WCAG 1.4.11.
2. **Gap de 20 entre itens** vem do espaçamento do component set no arquivo,
   não de uma spec de grupo. Se o grupo tiver desenho próprio, ele manda.
3. **Alvo de toque** 18px contra os 44 da I15.
4. **Hover derivado** (E-01), a mesma regra do Checkbox e do Switch.
