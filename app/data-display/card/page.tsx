"use client";

import {
  Card,
  CardHeader,
  CardList,
  CardDonut,
  CardChart,
  type LinhaDaLista,
  type FatiaDaRosca,
  type BarraDoGrafico,
} from "@/components/ui/card";
import { SelectTrigger } from "@/components/ui/select-trigger";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";

/* Dados do próprio arquivo (node 304:5313). Não são inventados: é o mesmo
   recorte que o Figma desenha, para o preview bater com o desenho. */
const pessoas: LinhaDaLista[] = [
  {
    nome: "Breno Ramos",
    detalhe: "breno.ramos@datacrazy.io",
    metricas: [
      { rotulo: "Negócios", valor: "1" },
      { rotulo: "Ticket médio", valor: "R$ 1,00K" },
      { rotulo: "Total", valor: "R$ 1,00K" },
    ],
  },
  {
    nome: "Millena Aragão",
    detalhe: "millena_suporte@datacrazy.io",
    metricas: [
      { rotulo: "Negócios", valor: "6" },
      { rotulo: "Ticket médio", valor: "R$ 0,00" },
      { rotulo: "Total", valor: "R$ 0,00" },
    ],
  },
  {
    nome: "Junior Santos",
    detalhe: "junior_santos@datacrazy.com.br",
    metricas: [
      { rotulo: "Negócios", valor: "1" },
      { rotulo: "Ticket médio", valor: "R$ 0,00" },
      { rotulo: "Total", valor: "R$ 0,00" },
    ],
  },
  {
    nome: "Kali Suporte Datacrazy (AR)",
    detalhe: "kaline.pereira@arsmartautomation.com.br",
    metricas: [
      { rotulo: "Negócios", valor: "5" },
      { rotulo: "Ticket médio", valor: "R$ 0,00" },
      { rotulo: "Total", valor: "R$ 0,00" },
    ],
  },
  {
    nome: "[DC] Allan Kipfer",
    detalhe: "allan_tech@datacrazy.io",
    metricas: [
      { rotulo: "Negócios", valor: "1" },
      { rotulo: "Ticket médio", valor: "R$ 0,00" },
      { rotulo: "Total", valor: "R$ 0,00" },
    ],
  },
];

const fatias: FatiaDaRosca[] = [
  { nome: "Breno Ramos", percentual: 100 },
  { nome: "Millena Aragão", percentual: 0 },
  { nome: "Junior Santos", percentual: 0 },
  { nome: "Kali Suporte Datacrazy (AR)", percentual: 0 },
  { nome: "[DC] Allan Kipfer", percentual: 0 },
];

const dias: BarraDoGrafico[] = [
  { rotulo: "10/08", valor: 1000 },
  { rotulo: "11/08", valor: 0 },
  { rotulo: "12/08", valor: 1000 },
  { rotulo: "13/08", valor: 1000 },
  { rotulo: "14/08", valor: 0 },
  { rotulo: "15/08", valor: 0 },
  { rotulo: "16/08", valor: 0 },
  { rotulo: "17/08", valor: 0 },
];

const eixoY = ["R$ 1,00K", "R$ 750,00", "R$ 500,00", "R$ 250,00", "R$ 0,00"];

type Parte = { nome: string; medida: string; papel: string };

const anatomia: Parte[] = [
  {
    nome: "Casca",
    medida: "border + p-[19px] · rounded-md",
    papel:
      "É só superfície: fundo card, traço da mesma cor e recuo de 20. Não conhece conteúdo — quem sabe desenhar barra é a barra, não o card.",
  },
  {
    nome: "Cabeçalho",
    medida: "gap-1.5 · h3 + display + body-md",
    papel:
      "Rótulo sempre; número e explicação quando existirem. A lista usa só o rótulo, a rosca e as barras usam os três. O canto direito é um slot.",
  },
  {
    nome: "Seletor",
    medida: "px-3 py-2 · rounded-md",
    papel:
      "Gatilho de recorte. É botão de verdade, com foco visível, mas ainda não abre menu: o Select do DS não existe. Quando existir, este vira o gatilho dele.",
  },
  {
    nome: "Linha da lista",
    medida: "py-[13px] · avatar 34",
    papel:
      "Avatar, identificação em duas linhas e métricas à direita. Nome e e-mail truncam com tooltip; as métricas usam tabular-nums para as colunas alinharem.",
  },
  {
    nome: "Anel",
    medida: "150px · raio 62,25 · traço 25,5",
    papel:
      "Desenhado com stroke, não com fatias recortadas: um círculo por fatia, com dasharray proporcional. O gradiente é vertical e vale para o anel inteiro.",
  },
  {
    nome: "Barra",
    medida: "flex-1 · rounded-t-sm · 218 no máximo",
    papel:
      "CSS puro, sem SVG. A barra cheia mede 218 num plot de 224 — os 6 que sobram são respiro. Barra zerada não some: vira um traço de 3px.",
  },
];

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Card"
      descricao="A superfície que carrega um bloco de dados no dashboard. A casca é uma só; o que muda é o que entra nela — uma lista com ranking, uma rosca de distribuição ou barras por período."
      secoes={["Lista", "Rosca", "Barras", "Anatomia", "Como funciona"]}
    >
      <Secao
        titulo="Lista"
        className="bg-background"
        spec="ranking"
        descricao="Cada linha traz avatar, identificação e métricas alinhadas à direita. É o formato para comparar pessoas ou categorias por mais de um número ao mesmo tempo."
        codigo={`<Card className="min-h-[382px] gap-4">
  <CardHeader title="Dados diários" />
  <CardList linhas={pessoas} />
</Card>`}
      >
        <Card className="min-h-[382px] w-full gap-4">
          <CardHeader title="Dados diários" />
          <CardList linhas={pessoas} />
        </Card>
        <Legenda>
          As linhas não têm traço visível: o separador do arquivo usa o token <Chip>card</Chip>, a
          mesma cor do fundo. Quem separa é o respiro de 13px.
        </Legenda>
      </Secao>

      <Secao
        titulo="Rosca"
        className="bg-background"
        spec="distribuição"
        descricao="Um número no centro, o anel em volta e a legenda embaixo. Serve para distribuição percentual entre poucas categorias — com muitas, a legenda vira uma lista e o anel para de informar."
        codigo={`<Card className="min-h-[452px] justify-between">
  <CardHeader
    title="Dados diários"
    value="R$ 0,00"
    subtitle="Visualização por valor dos negócios"
    action={<SelectTrigger>Valor</SelectTrigger>}
  />
  <CardDonut fatias={fatias} destaque="100.0%" rotulo="Breno Ramos" />
</Card>`}
        nota={
          <>
            O arquivo não entrega paleta categórica. Com uma fatia em 100% o anel bate exatamente com
            o desenho, mas duas fatias com valor sairiam da mesma cor — limite do desenho, não do
            código. É o bloqueio <Chip>B8</Chip> do roadmap.
          </>
        }
      >
        <div className="w-full max-w-[374px]">
          <Card className="min-h-[452px] w-full justify-between">
            <CardHeader
              title="Dados diários"
              value="R$ 0,00"
              subtitle="Visualização por valor dos negócios"
              action={<SelectTrigger>Valor</SelectTrigger>}
            />
            <CardDonut fatias={fatias} destaque="100.0%" rotulo="Breno Ramos" />
          </Card>
        </div>
      </Secao>

      <Secao
        titulo="Barras"
        className="bg-background"
        spec="por período"
        descricao="Uma barra por dia, com eixo Y à esquerda e datas embaixo. O gradiente desce de primary para accent, o que dá peso à base sem precisar de linha de grade."
        codigo={`<Card className="min-h-[452px] gap-5">
  <CardHeader
    title="Dados diários"
    value="R$ 3,00K"
    subtitle="Visualização por valor dos negócios"
    action={<SelectTrigger>Valor</SelectTrigger>}
  />
  <CardChart barras={dias} eixoY={eixoY} />
</Card>`}
      >
        <Card className="min-h-[452px] w-full gap-5">
          <CardHeader
            title="Dados diários"
            value="R$ 3,00K"
            subtitle="Visualização por valor dos negócios"
            action={<SelectTrigger>Valor</SelectTrigger>}
          />
          <CardChart barras={dias} eixoY={eixoY} />
        </Card>
        <Legenda>
          Quatro dos oito dias estão zerados. O traço de 3px é o que diferencia &quot;zero&quot; de
          &quot;não existe&quot;.
        </Legenda>
      </Secao>

      <Secao titulo="Anatomia" spec="6 partes" semCaixa>
        <div className="divide-y divide-border rounded-lg border border-border">
          {anatomia.map((p) => (
            <div key={p.nome} className="grid gap-1 p-4 sm:grid-cols-[180px_1fr] sm:gap-4">
              <div>
                <p className="text-h4 text-foreground">{p.nome}</p>
                <p className="mt-1 font-mono text-label-md text-subtle-foreground">{p.medida}</p>
              </div>
              <p className="text-body-lg text-muted-foreground">{p.papel}</p>
            </div>
          ))}
        </div>
      </Secao>

      <ComoFunciona>
        <p>
          No Figma isto é <em>um</em> componente com um eixo <Chip>Content</Chip> de três valores.
          Em código são quatro peças: a casca e os três conteúdos. A razão é simples — um{" "}
          <Chip>content=&quot;chart&quot;</Chip> obrigaria o card a receber dados de gráfico só para
          repassar, e casca que conhece conteúdo deixa de servir para o quarto caso.
        </p>
        <p>
          O gráfico de barras não tem SVG nem biblioteca. São <Chip>div</Chip>s com{" "}
          <Chip>flex-1</Chip> e altura proporcional, e o gradiente é o do Tailwind. Isso importa
          menos pelo peso e mais pelo controle: a barra herda os tokens do tema sem uma linha de
          ponte, e no escuro ela muda junto com o resto.
        </p>
        <p>
          A rosca é o oposto — precisa de SVG, porque arco não se faz com caixa. Cada fatia é um
          círculo com <Chip>stroke-dasharray</Chip> proporcional, todos girados −90° para começar no
          topo. O raio de 62,25 e o traço de 25,5 saem da conta entre os dois círculos do arquivo:
          externo 75, interno 49,5.
        </p>
        <p>
          Os três cards têm altura mínima, não fixa. O arquivo fixa 382 e 452 com corte; aqui a
          medida é a mesma na largura de desenho, mas se um nome longo quebrar em duas linhas o card
          cresce em vez de esconder. Cortar conteúdo em silêncio é justamente o que a regra de
          truncamento do DS existe para evitar.
        </p>
      </ComoFunciona>
    </PaginaDS>
  );
}
