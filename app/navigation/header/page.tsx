"use client";

import { useState } from "react";
import {
  BellSimple, ChartBar, ChartPieSlice, FunnelSimple, Handshake, MagnifyingGlass, Plus, Table,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Breadcrumb, type ItemBreadcrumb } from "@/components/ui/breadcrumb";
import { Header, HeaderBusca, HeaderDivisor, HeaderNotificacoes } from "@/components/ui/header";
import {
  SegmentedControl,
  ViewSwitcher,
  type OpcaoDeVisualizacao,
  type OpcaoSegmentada,
} from "@/components/ui/segmented-control";
import { DateRangePicker, type IntervaloDeDatas, type RotulosDoDatePicker } from "@/components/ui/date-picker";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";

/* Na doc os textos são literais porque a doc é escrita em português. No CRM
   cada um vem do next-intl — nenhum componente do Header tem texto embutido. */

const trilhaDoArquivo: ItemBreadcrumb[] = [
  { rotulo: "Board team", href: "#", avatar: { destaque: true } },
  { rotulo: "Mertcan", href: "#", avatar: {} },
  { rotulo: "Marketing", icone: BellSimple },
];

const trilhaLonga: ItemBreadcrumb[] = [
  { rotulo: "DataCrazy", href: "#", avatar: { destaque: true } },
  { rotulo: "Comercial", href: "#" },
  { rotulo: "Pipelines", href: "#" },
  { rotulo: "Vendas B2B", href: "#" },
  { rotulo: "Proposta", href: "#" },
  { rotulo: "Construtora Horizonte Ltda.", href: "#", avatar: {} },
  { rotulo: "Negócio #4821", icone: Handshake },
];

const trilhaEspanhol: ItemBreadcrumb[] = [
  { rotulo: "Equipo comercial Latinoamérica", href: "#", avatar: { destaque: true } },
  { rotulo: "María Fernanda Castañeda", href: "#", avatar: {} },
  { rotulo: "Campañas de reactivación", icone: BellSimple },
];

const periodos: OpcaoSegmentada[] = [
  { valor: "semana", rotulo: "Semana" },
  { valor: "mes", rotulo: "Mês" },
  { valor: "ano", rotulo: "Ano" },
];

const visoes: OpcaoDeVisualizacao[] = [
  { valor: "grafico", rotulo: "Gráfico", icone: ChartBar },
  { valor: "tabela", rotulo: "Tabela", icone: Table },
  { valor: "rosca", rotulo: "Rosca", icone: ChartPieSlice },
];

const rotulosData: RotulosDoDatePicker = {
  vazio: "Selecione uma data",
  atalhos: "Selecione",
  mes: "Mês",
  ano: "Ano",
  mesAnterior: "Mês anterior",
  proximoMes: "Próximo mês",
  aplicar: "Aplicar",
  cancelar: "Cancelar",
};

/* --- peças da doc: cada instância guarda o próprio estado ---------------- */

function Trilha({ itens = trilhaDoArquivo }: { itens?: ItemBreadcrumb[] }) {
  return (
    <Breadcrumb rotulo="Trilha de navegação" rotuloRecolhidos={(n) => `Mostrar ${n} níveis ocultos`} itens={itens} />
  );
}

const sino = <HeaderNotificacoes rotulo="Notificações: 5 não lidas" contagem={5} />;

function Pesquisar() {
  return (
    <Button variant="tertiary">
      <MagnifyingGlass size={16} weight="regular" />
      Pesquisar
    </Button>
  );
}

function Filtros() {
  return (
    <Button variant="tertiary">
      <FunnelSimple size={16} weight="regular" />
      Filtros
    </Button>
  );
}

function NovoLead({ variant }: { variant: "soft" | "primary" }) {
  return (
    <Button variant={variant}>
      <Plus size={16} weight="regular" />
      Novo lead
    </Button>
  );
}

function Visao() {
  const [visao, setVisao] = useState("grafico");
  return <ViewSwitcher rotulo="Visualização" itens={visoes} atual={visao} aoEscolher={setVisao} />;
}

function Periodo() {
  const [periodo, setPeriodo] = useState("mes");
  return <SegmentedControl rotulo="Período" itens={periodos} atual={periodo} aoEscolher={setPeriodo} />;
}

function Data() {
  const [valor, setValor] = useState<IntervaloDeDatas>({ inicio: null, fim: null });
  return <DateRangePicker valor={valor} onValorChange={setValor} rotulos={rotulosData} locale="pt-BR" />;
}

function HeaderDefault() {
  return (
    <Header
      titulo="Dashboard"
      subtitulo="Acompanhe os principais indicadores do time"
      trilha={<Trilha />}
      utilitarios={sino}
      acoes={
        <>
          <Pesquisar />
          <Filtros />
          <Visao />
          <Periodo />
          <HeaderDivisor />
          <NovoLead variant="soft" />
          <NovoLead variant="primary" />
        </>
      }
    />
  );
}

const codigoDefault = `<Header
  titulo="Dashboard"
  subtitulo="Acompanhe os principais indicadores do time"
  trilha={
    <Breadcrumb
      rotulo="Trilha de navegação"
      rotuloRecolhidos={(n) => \`Mostrar \${n} níveis ocultos\`}
      itens={[
        { rotulo: "Board team", href: "/times/board", avatar: { destaque: true } },
        { rotulo: "Mertcan", href: "/pessoas/mertcan", avatar: {} },
        { rotulo: "Marketing", icone: BellSimple },
      ]}
      link={Link}
    />
  }
  utilitarios={<HeaderNotificacoes rotulo="Notificações: 5 não lidas" contagem={5} />}
  acoes={
    <>
      <Button variant="tertiary"><MagnifyingGlass size={16} weight="regular" />Pesquisar</Button>
      <Button variant="tertiary"><FunnelSimple size={16} weight="regular" />Filtros</Button>
      <ViewSwitcher rotulo="Visualização" itens={visoes} atual={visao} aoEscolher={setVisao} />
      <SegmentedControl rotulo="Período" itens={periodos} atual={periodo} aoEscolher={setPeriodo} />
      <HeaderDivisor />
      <Button variant="soft"><Plus size={16} weight="regular" />Novo lead</Button>
      <Button variant="primary"><Plus size={16} weight="regular" />Novo lead</Button>
    </>
  }
/>`;

const codigoData = `acoes={
  <>
    …
    <DateRangePicker valor={periodo} onValorChange={setPeriodo} rotulos={rotulos} locale={locale} />
    <HeaderDivisor />
    …
  </>
}`;

const codigoBusca = `<Header
  titulo="Dashboard"
  subtitulo="Acompanhe os principais indicadores do time"
  trilha={trilha}
  utilitarios={sino}
  acoes={<HeaderBusca rotulo="Pesquisar leads" placeholder="Pesquisar" />}
/>`;

const codigoControles = `<ViewSwitcher rotulo="Visualização" itens={visoes} atual={visao} aoEscolher={setVisao} />

<SegmentedControl rotulo="Período" itens={periodos} atual={periodo} aoEscolher={setPeriodo} />

// visoes: { valor, rotulo, icone }[] — o rótulo vira nome acessível e tooltip
// periodos: { valor, rotulo, disabled? }[] — de 2 a 4; acima disso, Select`;

export default function HeaderPage() {
  return (
    <PaginaDS
      titulo="Header"
      descricao="O topo de cada página: 111px, recuo 32×16, trilha e sino numa linha de 32px, título h1 com subtítulo body-sm a 2px e ações a 8px. Seis combinações no arquivo, nenhuma prop de variante — o conteúdo entra por três encaixes."
      secoes={[
        "Como funciona",
        "Default",
        "Com data",
        "Menos ações",
        "Busca inline",
        "Escuro",
        "Trilha longa",
        "Quando não cabe",
        "Segmented Control e View Switcher",
      ]}
    >
      <ComoFunciona>
        <p>
          O arquivo tem seis combinações de ações, e o CRM vai ter dezenas: trilha de um a sete níveis, título que é
          nome de empresa, botões que mudam por tela. Por isso o <Chip>Header</Chip> não tem prop de variante. Ele é a{" "}
          <span className="text-foreground">moldura</span> — três encaixes, <Chip>trilha</Chip>,{" "}
          <Chip>utilitarios</Chip> e <Chip>acoes</Chip>, mais título e subtítulo — e guarda só a geometria do arquivo.
        </p>
        <p>
          O que entra nos encaixes são peças que já existem: <Chip>Breadcrumb</Chip>, <Chip>Button</Chip> (com a
          variante <Chip>tertiary</Chip>, que nasceu daqui) e <Chip>DateRangePicker</Chip>. Três são novas:{" "}
          <Chip>SegmentedControl</Chip>, <Chip>ViewSwitcher</Chip> e <Chip>HeaderDivisor</Chip>, este em{" "}
          <Chip>divider</Chip>, token que o arquivo tinha e o código não.
        </p>
        <p>
          Quando não cabe, nada vaza. A fileira de ações desce para a linha de baixo, à direita, e quebra entre si;
          título, subtítulo e cada nível da trilha truncam com o texto inteiro no <Chip>title</Chip> (D12). Nesta coluna
          de leitura as ações do Default já não cabem ao lado do título — é o comportamento real, não defeito do preview.
        </p>
        <p>
          O escuro não tem desenho no arquivo, e não precisa: todo valor do Header é token, então <Chip>.dark</Chip>{" "}
          troca tudo sem uma linha de <Chip>dark:</Chip>. A armadilha estava no selo do sino. O arquivo pinta o número
          com <Chip>destructive-foreground</Chip>, que é branco nos dois modos — reprova a D8 e, no escuro, dá 2,6:1
          sobre o vermelho claro. O número usa <Chip>primary-foreground</Chip>, a mesma escolha do Button destructive.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Default"
        spec="601:12 · 111px"
        descricao="O conjunto completo do arquivo: busca, filtros, visualização, período, divisor, as duas ações e o sino. Tudo vivo — troque a visualização e o período, passe o cursor no sino."
        codigo={codigoDefault}
        semCaixa
        className="overflow-hidden"
      >
        <HeaderDefault />
      </Secao>

      <Secao
        titulo="Com data"
        spec="610:13761"
        descricao="O período por data em vez do segmentado. É o DateRangePicker inteiro, com painel, e não uma cópia do gatilho."
        codigo={codigoData}
        semCaixa
        className="overflow-hidden"
        nota={
          <>
            O gatilho do Date Picker fecha em 29px de altura, e o arquivo o desenha com 32 dentro do Header. A fileira
            centraliza, então nada desalinha; os 3px ficam como divergência.
          </>
        }
      >
        <Header
          titulo="Dashboard"
          subtitulo="Acompanhe os principais indicadores do time"
          trilha={<Trilha />}
          utilitarios={sino}
          acoes={
            <>
              <Pesquisar />
              <Filtros />
              <Visao />
              <Data />
              <HeaderDivisor />
              <NovoLead variant="soft" />
              <NovoLead variant="primary" />
            </>
          }
        />
      </Secao>

      <Secao
        titulo="Menos ações"
        spec="610:13838 · 13915 · 13982"
        descricao="Três recortes do arquivo, do mais cheio ao mais enxuto. Nenhum é variante: é o mesmo Header com menos filhos em acoes."
        semCaixa
        className="overflow-hidden"
      >
        <Header
          titulo="Dashboard"
          subtitulo="Acompanhe os principais indicadores do time"
          trilha={<Trilha />}
          utilitarios={sino}
          acoes={
            <>
              <Pesquisar />
              <Filtros />
              <Visao />
              <HeaderDivisor />
              <NovoLead variant="soft" />
              <NovoLead variant="primary" />
            </>
          }
        />
        <Header
          titulo="Dashboard"
          subtitulo="Acompanhe os principais indicadores do time"
          trilha={<Trilha />}
          utilitarios={sino}
          acoes={
            <>
              <Pesquisar />
              <Filtros />
              <HeaderDivisor />
              <NovoLead variant="soft" />
              <NovoLead variant="primary" />
            </>
          }
        />
        <Header
          titulo="Dashboard"
          subtitulo="Acompanhe os principais indicadores do time"
          trilha={<Trilha />}
          utilitarios={sino}
          acoes={
            <>
              <Pesquisar />
              <Filtros />
              <HeaderDivisor />
              <NovoLead variant="primary" />
            </>
          }
          className="border-b-0"
        />
      </Secao>

      <Secao
        titulo="Busca inline"
        spec="610:14049 · 184px"
        descricao="A variante Search: a caixa do Button tertiary virada campo de verdade. Digite — o foco ganha o anel com folga, igual ao do botão."
        codigo={codigoBusca}
        semCaixa
        className="overflow-hidden"
      >
        <Header
          titulo="Dashboard"
          subtitulo="Acompanhe os principais indicadores do time"
          trilha={<Trilha />}
          utilitarios={sino}
          acoes={<HeaderBusca rotulo="Pesquisar leads" placeholder="Pesquisar" />}
          className="border-b-0"
        />
      </Secao>

      <Secao
        titulo="Escuro"
        spec="tokens · sem dark:"
        descricao="O Default com .dark forçado nesta caixa, independente do tema do site. Os mesmos componentes, a mesma marcação — só as variáveis mudam."
        semCaixa
        className="overflow-hidden"
        nota={
          <>
            O que abre por cima (tooltip do sino, painel da data) vai para o <Chip>body</Chip> e segue o tema do site,
            não o desta caixa.
          </>
        }
      >
        <div className="dark">
          <HeaderDefault />
        </div>
      </Secao>

      <Secao
        titulo="Trilha longa"
        spec="7 níveis · 3 à vista"
        descricao="Sete níveis do CRM real. Passando de três, os do meio recolhem em reticências; clique nelas para abrir a trilha inteira no lugar."
        semCaixa
        className="overflow-hidden"
      >
        <Header
          titulo="Construtora Horizonte Ltda."
          subtitulo="Negócio #4821 · Proposta enviada há 2 dias"
          trilha={<Trilha itens={trilhaLonga} />}
          utilitarios={sino}
          acoes={
            <>
              <Filtros />
              <HeaderDivisor />
              <NovoLead variant="primary" />
            </>
          }
          className="border-b-0"
        />
      </Secao>

      <Secao
        titulo="Quando não cabe"
        spec="360px · es"
        descricao="Espanhol, que é 20–30% mais longo, numa coluna de celular. As ações descem e quebram; título, subtítulo e trilha truncam. Passe o cursor num texto cortado para ler inteiro."
      >
        <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-md">
          <Header
            titulo="Panel de indicadores comerciales"
            subtitulo="Sigue los principales indicadores del equipo en tiempo real"
            trilha={<Trilha itens={trilhaEspanhol} />}
            utilitarios={<HeaderNotificacoes rotulo="Notificaciones: 128 sin leer" contagem={128} />}
            acoes={
              <>
                <Button variant="tertiary">
                  <MagnifyingGlass size={16} weight="regular" />
                  Buscar
                </Button>
                <Button variant="tertiary">
                  <FunnelSimple size={16} weight="regular" />
                  Filtros
                </Button>
                <HeaderDivisor />
                <Button variant="primary">
                  <Plus size={16} weight="regular" />
                  Nuevo prospecto
                </Button>
              </>
            }
            className="border-b-0 px-4"
          />
        </div>
      </Secao>

      <Secao
        titulo="Segmented Control e View Switcher"
        spec="269:68 · 471:2947"
        descricao="As duas peças novas, soltas. Um grupo de rádio cada: Tab entra na opção selecionada, as setas trocam."
        codigo={codigoControles}
        nota={
          <>
            Segmented: trilha <Chip>card</Chip> com recuo 4, opção de 28px, selecionada em <Chip>accent</Chip> +{" "}
            <Chip>overlay/item-text-selected</Chip>. View Switcher: recuo 2, 116px divididos, raio 4, selecionada em{" "}
            <Chip>accent</Chip> + <Chip>primary</Chip> com a sombra interna do Button.
          </>
        }
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Visao />
          <Periodo />
        </div>
      </Secao>
    </PaginaDS>
  );
}
