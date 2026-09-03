"use client";

import { Check, X } from "@phosphor-icons/react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";

type Variante = NonNullable<BadgeProps["variant"]>;

type Amostra = { variante: Variante; rotulo: string; tokens: string };

const variantes: Amostra[] = [
  {
    variante: "neutral",
    rotulo: "37 negócios",
    tokens: "border-border · bg-background · padrão",
  },
  {
    variante: "primary",
    rotulo: "Frio",
    tokens: "border-primary/25 · bg-accent · o único par com token",
  },
  {
    variante: "success",
    rotulo: "Ganho",
    tokens: "border-success/25 · bg-success/10 · alpha, não token",
  },
  {
    variante: "warning",
    rotulo: "Atrasado",
    tokens: "border-warning/25 · bg-warning/10 · alpha, não token",
  },
  {
    variante: "destructive",
    rotulo: "Perdido",
    tokens: "border-destructive/25 · bg-destructive/10 · alpha, não token",
  },
  {
    variante: "info",
    rotulo: "Sinal",
    tokens: "border-info/25 · bg-info/10 · alpha, não token",
  },
];

type Tag = { rotulo: string; variante: Variante };
type Lead = { nome: string; empresa: string; tags: Tag[]; resto: number };

const leads: Lead[] = [
  {
    nome: "Marina Albuquerque",
    empresa: "Norte Logística",
    tags: [
      { rotulo: "Frio", variante: "primary" },
      { rotulo: "sinal", variante: "info" },
    ],
    resto: 1,
  },
  {
    nome: "Eduardo Prates",
    empresa: "Prates Consultoria",
    tags: [{ rotulo: "Ganho", variante: "success" }],
    resto: 0,
  },
  {
    nome: "Cláudia Ferraz",
    empresa: "Ferraz Odontologia",
    tags: [
      { rotulo: "Frio", variante: "primary" },
      { rotulo: "Atrasado", variante: "warning" },
    ],
    resto: 3,
  },
];

type Decisao = { ok: boolean; titulo: string; texto: React.ReactNode };

const decisoes: Decisao[] = [
  {
    ok: true,
    titulo: "Rótulo de estado que o sistema calcula.",
    texto: (
      <>
        Etapa do funil, temperatura do lead, resultado do negócio, contagem — o <Chip>37 negócios</Chip> que aparece
        sob o valor de cada KPI. O usuário <span className="text-foreground">lê</span> o badge; ele não opera o badge.
      </>
    ),
  },
  {
    ok: false,
    titulo: "Se clica, não é badge.",
    texto: (
      <>
        O componente é um <Chip>&lt;span&gt;</Chip>: não tem <Chip>type</Chip>, <Chip>href</Chip>,{" "}
        <Chip>tabIndex</Chip> nem anel de foco. Pendurar <Chip>onClick</Chip> nele cria um controle que o teclado não
        alcança — exatamente o que os tickets #62306, #61699, #85316 e #79729 descrevem e que virou a regra E7. Filtro
        que aplica ao clicar é <Chip>&lt;Button variant=&quot;secondary&quot; size=&quot;sm&quot;&gt;</Chip>; chip
        removível com X é outro componente, e ainda não existe aqui.
      </>
    ),
  },
  {
    ok: true,
    titulo: "Uma cor, um significado, no produto inteiro.",
    texto: (
      <>
        <Chip>success</Chip> é ganho, <Chip>destructive</Chip> é perdido, <Chip>warning</Chip> é atrasado,{" "}
        <Chip>info</Chip> é sinal automático, <Chip>primary</Chip> é temperatura ou seleção e <Chip>neutral</Chip> é
        contagem sem juízo de valor. A mesma cor com dois sentidos em duas telas transforma o badge em enfeite — e
        enfeite ninguém lê.
      </>
    ),
  },
  {
    ok: false,
    titulo: "Badge não substitui mensagem.",
    texto: (
      <>
        São 10px numa linha só. Se o texto precisa explicar <span className="text-foreground">por que</span> algo
        aconteceu, o padrão é o de validação da regra E6 — inline, ou modal quando bloqueante —, nunca uma tag
        comprida.
      </>
    ),
  },
  {
    ok: false,
    titulo: "Não empilhe.",
    texto: (
      <>
        Duas tags visíveis, o resto no marcador de excedente. Densidade é decisão, não acúmulo (regra E5): o ticket
        #34395 é um cliente que não achava a etapa do funil no meio de informação repetida.
      </>
    ),
  },
  {
    ok: false,
    titulo: "Não escreva o texto dentro do componente.",
    texto: (
      <>
        A string vem de fora, via <Chip>next-intl</Chip> (regra 4 de i18n), e não é transformada — não há{" "}
        <Chip>uppercase</Chip> na base. <Chip>Ganho</Chip> em <Chip>es</Chip> ou <Chip>de</Chip> cresce 20–30%, e
        rótulo que vira duas linhas estoura a altura de 20px.
      </>
    ),
  },
];

const codigoVariantes = `{/* neutral é o padrão: <Badge> sem variant já vem neutral */}
<Badge>37 negócios</Badge>
<Badge variant="primary">Frio</Badge>
<Badge variant="success">Ganho</Badge>
<Badge variant="warning">Atrasado</Badge>
<Badge variant="destructive">Perdido</Badge>
<Badge variant="info">Sinal</Badge>`;

const codigoLead = `<div>
  <p className="text-body-lg text-foreground">Marina Albuquerque</p>
  <p className="text-caption text-subtle-foreground">Norte Logística</p>

  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
    <Badge variant="primary">Frio</Badge>
    <Badge variant="info">sinal</Badge>
    {/* excedente: contagem neutra, nunca a cor da tag escondida */}
    <Badge>+1</Badge>
  </div>
</div>`;

export default function BadgePage() {
  return (
    <PaginaDS
      titulo="Badge"
      descricao="Seis variantes de 20px de altura, tipografia de 10px e raio de 6px — o mesmo do botão. Nenhuma tem fundo cheio: cinco são traço da cor a 25% sobre um fundo sutil da mesma cor, e desse fundo só um é token desenhado — os outros quatro são alpha a 10%."
      secoes={["Como funciona", "Variantes", "No card do lead", "Quando usar"]}
    >
      <ComoFunciona>
        <p>
          O componente é um <Chip>&lt;span&gt;</Chip> e uma string. O <Chip>cva</Chip> guarda a base — que vale
          sempre: <Chip>inline-flex</Chip>, <Chip>rounded-md</Chip>, <Chip>px-1.5 py-0.5</Chip> e{" "}
          <Chip>text-label-sm</Chip> — e <span className="text-foreground">um eixo só</span>, <Chip>variant</Chip>.
          Não há tamanho: badge tem uma medida, 20px, e ela é consequência dos 14px de entrelinha do rótulo mais 2px
          de padding e 1px de traço de cada lado. Cada variante escreve três coisas ao mesmo tempo — borda, fundo e
          texto — e <span className="text-foreground">nunca a cor cheia</span>: nas cinco coloridas os três saem da
          mesma cor, e a sexta, <Chip>neutral</Chip>, fica só nos cinzas do sistema. É a anti-referência nº 3 na
          letra: cor entra em borda e em tag, não preenche superfície. O botão tem duas variantes de fundo cheio; o
          badge não tem nenhuma.
        </p>
        <p>
          Daí sai a consequência que organiza a paleta: cada estado precisa de um <span className="text-foreground">
          par</span> — a cor sólida, que vai no texto e na borda, e a versão sutil dela, que vai no fundo. Estado com
          um valor só não vira badge. Dos seis, só <Chip>primary</Chip> tem o par desenhado: <Chip>accent</Chip> é
          token do Figma (chamava-se <Chip>Neve</Chip>) e tem valor próprio nos dois temas, <Chip>#E8F1FF</Chip> no
          claro e <Chip>#232C3D</Chip> no escuro. Por isso a variante primária escreve <Chip>bg-accent</Chip>, e não{" "}
          <Chip>bg-primary/10</Chip>. Os quatro estados restantes não têm par nenhum na coleção, então o fundo é
          sintetizado com alpha: <Chip>bg-success/10</Chip> é cor calculada no navegador, não token.
        </p>
        <p>
          E a alpha esconde uma pendência maior. <Chip>success</Chip>, <Chip>warning</Chip>,{" "}
          <Chip>destructive</Chip> e <Chip>info</Chip> têm hoje{" "}
          <span className="text-foreground">o mesmo valor nos dois temas</span> — é a pendência nº 1 de{" "}
          <Chip>docs/02-design-system.md</Chip> e é literalmente o bug #80174, que virou a regra E4: nenhuma variável repete
          valor entre claro e escuro sem intenção declarada. <Chip>success</Chip> é <Chip>#267952</Chip>, um verde
          escuro desenhado para ler sobre branco; no tema escuro ele continua <Chip>#267952</Chip>, agora sobre o
          card <Chip>#1E1E24</Chip>, e os 10% de fundo quase somem junto com o contraste do texto. O componente está certo
          e o par é que falta — a correção é criar o valor escuro dos quatro estados no Figma, não remendar a
          instância com <Chip>className</Chip>. Onde não existe token, não se inventa valor.
        </p>
        <p>
          A armadilha do dia a dia é outra, e vale para as seis:{" "}
          <span className="text-foreground">nenhum desses fundos é opaco</span>. <Chip>bg-success/10</Chip> composita
          com o que estiver atrás, então o mesmo badge muda de cor conforme a superfície — dentro de um{" "}
          <Chip>card</Chip> branco ele clareia, sobre uma linha de tabela em hover ele escurece junto. O caso extremo
          é o <Chip>neutral</Chip>, que usa <Chip>bg-background</Chip> puro: dentro do card ele lê como pastilha
          rebaixada, mas apoiado direto no fundo da página ele fica{" "}
          <span className="text-foreground">exatamente da cor do fundo</span> e sobra só a borda. Não é bug do
          componente, é o componente fora da superfície para a qual foi desenhado. Badge mora sobre{" "}
          <Chip>card</Chip>: tabela, KPI, drawer. Precisar dele sobre <Chip>background</Chip> é decisão de token, não{" "}
          <Chip>className</Chip> na instância.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Variantes"
        spec="6 · variant"
        descricao="Seis, e nenhuma com fundo cheio. O que muda entre elas é só qual cor entra nos três lugares — traço, fundo e texto —, e em neutral esses três lugares são cinza. Abaixo, as seis lado a lado sobre card, com o rótulo que cada uma carrega de verdade no CRM."
        codigo={codigoVariantes}
        nota={
          <>
            <p>Na ordem em que aparecem:</p>
            <ul className="mt-2 space-y-1">
              {variantes.map((v) => (
                <li key={v.variante}>
                  <span className="font-mono text-foreground">variant=&quot;{v.variante}&quot;</span> — {v.rotulo} ·{" "}
                  {v.tokens}
                </li>
              ))}
            </ul>
            <p className="mt-2">
              <span className="text-foreground">neutral é o padrão</span>: <Chip>&lt;Badge&gt;</Chip> sem{" "}
              <Chip>variant</Chip> já sai neutral. Nenhuma delas responde a hover, foco ou clique — badge é{" "}
              <Chip>&lt;span&gt;</Chip>, e o único jeito de o estado dele mudar é o dado mudar.
            </p>
          </>
        }
      >
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {variantes.map((v) => (
            <Badge key={v.variante} variant={v.variante}>
              {v.rotulo}
            </Badge>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="No card do lead"
        spec="2 + N"
        descricao="O padrão real da tabela do CRM: duas tags sob o nome e o resto colapsado num marcador de contagem. Marina tem três tags, Cláudia tem cinco; as duas mostram duas."
        codigo={codigoLead}
        nota={
          <>
            O excedente é <Chip>neutral</Chip> de propósito: <Chip>+3</Chip> é contagem, não estado. Se herdasse a cor
            da tag escondida, o card ganharia um sinal que não corresponde a nada. E ele é um truncamento — pela regra
            E1 deveria carregar tooltip com a lista completa, só que <Chip>Tooltip</Chip> ainda é lacuna registrada no
            inventário. Até existir, <span className="text-foreground">esse marcador é truncamento mudo</span>: é a
            pendência do padrão, não um detalhe de estilo.
          </>
        }
      >
        <div className="divide-y divide-border">
          {leads.map((l) => (
            <div key={l.nome} className="py-4 first:pt-0 last:pb-0">
              <p className="text-body-lg text-foreground">{l.nome}</p>
              <p className="text-caption text-subtle-foreground">{l.empresa}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {l.tags.map((t) => (
                  <Badge key={t.rotulo} variant={t.variante}>
                    {t.rotulo}
                  </Badge>
                ))}
                {l.resto > 0 && <Badge>+{l.resto}</Badge>}
              </div>
            </div>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Quando usar"
        spec="<span>"
        descricao="Badge é rótulo de estado, não controle. Seis decisões — quatro delas saídas direto de ticket ou de regra registrada."
        nota={
          <>
            Badge não conhece domínio: quem sabe que &ldquo;Frio&rdquo; é temperatura de lead é a tela do CRM, não o
            componente (regra 8 de composição). E variante nova só existe se existir no Figma primeiro (regra 6) — a
            sétima cor se decide lá, não aqui.
          </>
        }
      >
        <ul className="space-y-3.5">
          {decisoes.map((d) => (
            <li key={d.titulo} className="flex gap-2.5">
              {d.ok ? (
                <Check size={14} weight="regular" className="mt-1 shrink-0 text-success" />
              ) : (
                <X size={14} weight="regular" className="mt-1 shrink-0 text-destructive" />
              )}
              <p className="text-body-lg text-muted-foreground">
                <span className="text-foreground">{d.titulo}</span> {d.texto}
              </p>
            </li>
          ))}
        </ul>
      </Secao>
    </PaginaDS>
  );
}
