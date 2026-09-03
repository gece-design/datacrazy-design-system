"use client";

import type { Icon } from "@phosphor-icons/react";
import { ChartBar, Plus, TrendDown, TrendUp, Tray, X } from "@phosphor-icons/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";

type Parte = { nome: string; classes: string; papel: string };

const anatomia: Parte[] = [
  {
    nome: "Card",
    classes: "rounded-lg border border-border bg-card",
    papel: "A moldura, e nada além disso. Não tem padding próprio — quem espaça é o header e o content.",
  },
  {
    nome: "CardHeader",
    classes: "flex items-start justify-between gap-3 p-4",
    papel: "Rótulo à esquerda, ícone ou ação à direita. O justify-between já vem embutido: não recrie a linha.",
  },
  {
    nome: "CardTitle",
    classes: "text-label-lg text-muted-foreground",
    papel: "Rótulo, não manchete: é o texto mais apagado do card de propósito, e o valor é que tem o contraste. Renderiza um h3, então entra na hierarquia de cabeçalhos da tela — seis KPIs são seis h3.",
  },
  {
    nome: "CardContent",
    classes: "px-4 pb-4",
    papel: "Não tem padding em cima: o espaço vertical já veio do header. Sem header, o conteúdo encosta na borda.",
  },
];

type Kpi = {
  titulo: string;
  valor: string;
  contagem: string;
  variante: "success" | "destructive" | "neutral";
  Icone: Icon;
};

const kpis: Kpi[] = [
  { titulo: "Total ganhos",   valor: "R$ 0,00",  contagem: "0 negócios",  variante: "success",     Icone: TrendUp },
  { titulo: "Total perdidos", valor: "R$ 0,00",  contagem: "0 negócios",  variante: "destructive", Icone: TrendDown },
  { titulo: "Total criados",  valor: "R$ 3,00K", contagem: "37 negócios", variante: "neutral",     Icone: Plus },
];

const regras: React.ReactNode[] = [
  <>
    <span className="text-foreground">Não pinte o corpo do card.</span> Marcar &ldquo;ganho&rdquo; com{" "}
    <Chip>bg-success/10</Chip> no <Chip>&lt;Card&gt;</Chip> é a anti-referência nº 3 na letra. O sinal vai na borda ou
    no <Chip>&lt;Badge variant=&quot;success&quot;&gt;</Chip>.
  </>,
  <>
    <span className="text-foreground">Não simule elevação com efeito.</span> <Chip>backdrop-blur</Chip> é glass, a
    anti-referência nº 7; <Chip>bg-gradient-*</Chip> é a nº 6; e <Chip>shadow-*</Chip> não aparece em classe nenhuma
    do <Chip>Card</Chip> porque a regra A3 fecha a superfície em borda e tom. Efeito pesado para quem fica o dia
    inteiro na tela.
  </>,
  <>
    <span className="text-foreground">Não troque o raio.</span> <Chip>rounded-lg</Chip> é o mesmo do botão e do input.
    Card com forma própria junta as anti-referências nº 1 e nº 2 num item só.
  </>,
  <>
    <span className="text-foreground">Não use <Chip>bg-background</Chip> dentro do card.</span> Reproduz à mão a
    inversão de elevação que a reestruturação de tokens corrigiu. Agrupamento interno é borda.
  </>,
  <>
    <span className="text-foreground">Não escreva texto dentro do componente.</span> Rótulo, valor e mensagem de vazio
    vêm de fora via <Chip>next-intl</Chip> (regra 4 de i18n) — e rótulo que pode truncar carrega tooltip com o
    conteúdo completo, que é a regra E1, nascida dos tickets #83283 e #83274.
  </>,
  <>
    <span className="text-foreground">Não faça o título competir com o valor.</span> Aumentar o{" "}
    <Chip>CardTitle</Chip> é hierarquia por tamanho, e aqui a hierarquia é por contraste — anti-referência nº 8, fonte
    exagerada em título.
  </>,
];

const codigoSimples = `<Card className="max-w-xs">
  <CardHeader>
    <CardTitle>Total em aberto</CardTitle>
    <ChartBar size={16} weight="regular" className="text-primary" />
  </CardHeader>
  <CardContent>
    <p className="text-metric tabular-nums text-foreground">R$ 3,00K</p>
    <Badge className="mt-2">37 negócios</Badge>
  </CardContent>
</Card>`;

const codigoSerie = `<div className="grid gap-3 sm:grid-cols-3">
  <Card>
    <CardHeader>
      <CardTitle>Total ganhos</CardTitle>
      <TrendUp size={16} weight="regular" className="text-primary" />
    </CardHeader>
    <CardContent>
      <p className="text-metric tabular-nums text-foreground">R$ 0,00</p>
      <Badge variant="success" className="mt-2">0 negócios</Badge>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>Total perdidos</CardTitle>
      <TrendDown size={16} weight="regular" className="text-primary" />
    </CardHeader>
    <CardContent>
      <p className="text-metric tabular-nums text-foreground">R$ 0,00</p>
      <Badge variant="destructive" className="mt-2">0 negócios</Badge>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>Total criados</CardTitle>
      <Plus size={16} weight="regular" className="text-primary" />
    </CardHeader>
    <CardContent>
      <p className="text-metric tabular-nums text-foreground">R$ 3,00K</p>
      <Badge variant="neutral" className="mt-2">37 negócios</Badge>
    </CardContent>
  </Card>
</div>`;

const codigoVazio = `<Card className="max-w-xs">
  <CardHeader>
    <CardTitle>Total ganhos</CardTitle>
    <TrendUp size={16} weight="regular" className="text-primary" />
  </CardHeader>
  <CardContent>
    <div className="flex flex-col items-center gap-1.5 rounded-md
                    border border-dashed border-border py-6">
      <Tray size={20} weight="regular" className="text-subtle-foreground" />
      <p className="text-body-md text-muted-foreground">Sem negócios no período</p>
      <p className="text-caption text-subtle-foreground">Ajuste o filtro de datas</p>
    </div>
  </CardContent>
</Card>`;

export default function CardPage() {
  return (
    <PaginaDS
      titulo="Card"
      descricao="Quatro partes — Card, CardHeader, CardTitle, CardContent — em raio de 8px, traço de 1px e padding de 16px. Zero sombra: a separação é borda e tom, e existe um único nível de elevação."
      secoes={["Como funciona", "Anatomia", "Simples", "Em série", "Com estado vazio", "Regras"]}
    >
      <ComoFunciona>
        <p>
          O card inteiro são três utilitários: <Chip>rounded-lg</Chip>, <Chip>border border-border</Chip> e{" "}
          <Chip>bg-card</Chip>. Não há sombra, gradiente nem desfoque em lugar nenhum do componente, e isso não é
          economia — são duas anti-referências registradas do time. A nº 3 diz que{" "}
          <span className="text-foreground">card inteiro colorido está fora: cor entra só em borda e em tag</span>. A
          nº 7 tira glass e liquid glass da mesa, com a justificativa de quem usa o produto: efeito pesado para quem
          fica o dia inteiro na tela. Sobram exatamente dois recursos para separar uma superfície da outra —{" "}
          <span className="text-foreground">borda e tom</span>.
        </p>
        <p>
          O tom é uma diferença mínima e proposital entre dois tokens. No tema claro, <Chip>card</Chip> é{" "}
          <Chip>#FFFFFF</Chip> sobre um <Chip>background</Chip> <Chip>#F4F5F6</Chip>. No escuro, <Chip>card</Chip> é{" "}
          <Chip>#1E1E24</Chip> sobre <Chip>#1C1C25</Chip>. No HSL que o <Chip>globals.css</Chip> guarda, isso é{" "}
          <span className="text-foreground">0,2 ponto de luminosidade</span> — 12,9% contra 12,7%. É pouco de
          propósito, e é pouco demais para monitor ruim ou sala clara: quando o olho não resolve o tom, o traço de 1px
          resolve. Por isso a borda nunca é opcional no card — ela é o mecanismo, não o acabamento.
        </p>
        <p>
          Essa relação estava invertida e foi corrigida na reestruturação de tokens. No tema escuro o{" "}
          <Chip>card</Chip> era <span className="text-foreground">mais escuro</span> que o fundo, e superfície mais
          escura que o fundo inverte a lógica de profundidade: em vez de subir, o card afundava — lia como buraco na
          página, não como painel sobre ela. A correção foi trocar os valores de lugar, e hoje{" "}
          <Chip>#1E1E24</Chip> é um passo mais claro que <Chip>#1C1C25</Chip>. É o item 3 da lista de correções em{" "}
          <Chip>docs/02-design-system.md</Chip>.
        </p>
        <p>
          A armadilha vem daí e aparece quando você aninha. A coleção tem{" "}
          <span className="text-foreground">um único token de superfície acima do fundo</span> — a rampa neutra só
          tem <Chip>base/neutral/900</Chip>, pendência nº 2 do documento de tokens. Então dois <Chip>bg-card</Chip>
          {" "}encostados não se separam, e o reflexo de alcançar <Chip>bg-background</Chip> para o bloco de dentro
          refaz à mão exatamente a inversão que acabou de ser consertada: o miolo fica mais escuro que a moldura.
          Bloco dentro de card se delimita com <Chip>border-border</Chip> — sólida quando é conteúdo, tracejada
          quando é ausência de conteúdo.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Anatomia"
        spec="4 partes"
        descricao="O card completo, montado com as quatro partes. Cada uma carrega uma decisão de espaçamento, e trocar uma por uma div solta perde a decisão junto."
        nota={
          <div className="space-y-3">
            <ul className="divide-y divide-border">
              {anatomia.map((p) => (
                <li key={p.nome} className="py-2.5 first:pt-0 last:pb-0">
                  <p className="font-mono text-body-md text-foreground">{p.nome}</p>
                  <p className="mt-0.5 font-mono text-caption text-subtle-foreground">{p.classes}</p>
                  <p className="mt-1 text-body-md text-muted-foreground">{p.papel}</p>
                </li>
              ))}
            </ul>
            <p>
              O <Chip>CardContent</Chip> sem <Chip>pt</Chip> é a pegadinha silenciosa: use o content sozinho, sem
              header, e o conteúdo cola no topo da borda.
            </p>
          </div>
        }
      >
        <div className="flex items-center justify-center py-4">
          <Card className="w-full max-w-xs">
            <CardHeader>
              <CardTitle>Total em aberto</CardTitle>
              <ChartBar size={16} weight="regular" className="text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-metric tabular-nums text-foreground">R$ 3,00K</p>
              <Badge className="mt-2">37 negócios</Badge>
            </CardContent>
          </Card>
        </div>
      </Secao>

      <Secao
        titulo="Simples"
        spec="1 KPI"
        descricao="Um card, um número. Rótulo de 12px apagado em cima, valor de 16px em text-metric, contagem em badge neutro."
        codigo={codigoSimples}
        nota={
          <p>
            O valor usa <Chip>text-metric</Chip> — o papel <Chip>text/metric</Chip>, 16/21 em SemiBold, que a escala
            tipográfica criou para métrica de BI. Não é <Chip>text-display</Chip>: display são os 26px do título da
            página, e número de card do tamanho do título da página é hierarquia por tamanho, que a regra A4 rejeita.
            O degrau para o rótulo de 12px é de 4px e um peso; o resto é contraste — valor em{" "}
            <Chip>text-foreground</Chip>, rótulo em <Chip>text-muted-foreground</Chip>, contagem dentro de uma borda.
          </p>
        }
      >
        <Card className="max-w-xs">
          <CardHeader>
            <CardTitle>Total em aberto</CardTitle>
            <ChartBar size={16} weight="regular" className="text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-metric tabular-nums text-foreground">R$ 3,00K</p>
            <Badge className="mt-2">37 negócios</Badge>
          </CardContent>
        </Card>
      </Secao>

      <Secao
        titulo="Em série"
        spec="3 × KPI"
        descricao="A fileira de indicadores da home do CRM. Mesma moldura três vezes; o que varia é o ícone e o badge."
        codigo={codigoSerie}
        nota={
          <p>
            Os três repetem o <Chip>text-metric</Chip> do card único: virar fileira não muda a importância do número,
            então não muda o papel tipográfico. O que a fileira acrescenta é um problema de alinhamento — três colunas
            de moeda com larguras diferentes de dígito dançam entre si. A tentação é trocar para <Chip>font-mono</Chip>,
            e seria errado: <Chip>text/metric</Chip> declara <Chip>Geist</Chip> no Figma, e trocar a família aqui seria
            o código decidindo o que o arquivo não decidiu. A solução que não mexe na fonte é <Chip>tabular-nums</Chip>
            {" "}— a Geist tem dígito de largura fixa, e essa classe o liga. Mesma família, mesmo peso, colunas
            alinhadas. A cor de estado vive só no badge: ganho em <Chip>success</Chip>, perdido em{" "}
            <Chip>destructive</Chip>, criado em <Chip>neutral</Chip>. Se a diferença fosse fundo colorido, a fileira
            viraria semáforo — anti-referência nº 3.
          </p>
        }
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {kpis.map(({ titulo, valor, contagem, variante, Icone }) => (
            <Card key={titulo}>
              <CardHeader>
                <CardTitle>{titulo}</CardTitle>
                <Icone size={16} weight="regular" className="text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-metric tabular-nums text-foreground">{valor}</p>
                <Badge variant={variante} className="mt-2">{contagem}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Com estado vazio"
        spec="empty"
        descricao="Zero é dado; vazio é ausência de dado. São coisas diferentes e não se representam igual."
        codigo={codigoVazio}
        nota={
          <p>
            <Chip>R$ 0,00</Chip> com badge <Chip>0 negócios</Chip>, como na seção acima, é resposta apurada: houve
            consulta e o resultado é zero. Aqui não houve o que apurar — filtro sem período, integração desconectada —
            e a área ganha borda tracejada em vez de uma segunda superfície, porque segunda superfície não existe na
            coleção. Estado vazio é critério de pronto pela regra 9, ao lado de hover, focus-visible e loading.
          </p>
        }
      >
        <Card className="max-w-xs">
          <CardHeader>
            <CardTitle>Total ganhos</CardTitle>
            <TrendUp size={16} weight="regular" className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-1.5 rounded-md border border-dashed border-border py-6">
              <Tray size={20} weight="regular" className="text-subtle-foreground" />
              <p className="text-body-md text-muted-foreground">Sem negócios no período</p>
              <p className="text-caption text-subtle-foreground">Ajuste o filtro de datas</p>
            </div>
          </CardContent>
        </Card>
      </Secao>

      <Secao
        titulo="Regras"
        descricao="Seis coisas que já foram tentadas em card e não passam. Cada uma tem origem registrada."
        nota={
          <p>
            Variante nova de card só existe se existir no Figma primeiro — regra 6 de composição. E card que conhece
            domínio, tipo <Chip>&lt;LeadCard&gt;</Chip>, é componente de produto pela regra 8: mora no CRM, não aqui.
          </p>
        }
      >
        <ul className="space-y-3">
          {regras.map((r, i) => (
            <li key={i} className="flex gap-2.5">
              <X size={14} weight="regular" className="mt-1 shrink-0 text-destructive" />
              <p className="text-body-lg text-muted-foreground">{r}</p>
            </li>
          ))}
        </ul>
      </Secao>
    </PaginaDS>
  );
}
