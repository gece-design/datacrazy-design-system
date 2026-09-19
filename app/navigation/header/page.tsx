"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  BellSimple, ChartBar, ChartPieSlice, ClipboardText, FunnelSimple, Handshake,
  MagnifyingGlass, Plus, Table, UserPlus, WarningCircle, type Icon,
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

import { foco, focoInterno } from "@/lib/estados";
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

/* --- o painel de notificações -------------------------------------------- */

type Notificacao = { id: string; icone: Icon; titulo: string; detalhe: string; quando: string; lida: boolean };

const notificacoes: Notificacao[] = [
  { id: "1", icone: UserPlus, titulo: "Novo lead atribuído", detalhe: "Construtora Horizonte entrou no seu funil pela campanha de setembro.", quando: "agora", lida: false },
  { id: "2", icone: ClipboardText, titulo: "Tarefa vence hoje", detalhe: "Ligar para Marina Albuquerque sobre a proposta enviada na sexta.", quando: "há 20 min", lida: false },
  { id: "3", icone: WarningCircle, titulo: "Negócio parado há 14 dias", detalhe: "Norte Logística segue em Proposta sem nenhuma interação registrada.", quando: "há 2 h", lida: false },
  { id: "4", icone: Handshake, titulo: "Negócio ganho", detalhe: "Joel Jota assinou o contrato anual — R$ 48.000.", quando: "ontem", lida: false },
  { id: "5", icone: UserPlus, titulo: "Lead respondeu no WhatsApp", detalhe: "Helena Moraes pediu uma segunda proposta com prazo maior.", quando: "ontem", lida: false },
  { id: "6", icone: ClipboardText, titulo: "Relatório da semana pronto", detalhe: "O fechamento de 8 a 14 de setembro já está no painel do time.", quando: "há 3 dias", lida: true },
];

/**
 * Cenário do sino: clicar abre a lista de não lidas.
 *
 * O arquivo desenha o sino e o selo, não o painel — este é derivado dos tokens
 * `overlay/*` e do degrau `shadow-lg`, o mesmo caminho da lista aberta do
 * Select. Mora na página porque é cenário do produto, não peça do DS: quem
 * decide o que é uma notificação é a tela, não o Header.
 */
function Sino() {
  const [aberto, setAberto] = React.useState(false);
  const [itens, setItens] = React.useState(notificacoes);
  const [pos, setPos] = React.useState<{ top: number; right: number } | null>(null);
  const gatilho = React.useRef<HTMLButtonElement>(null);
  const painel = React.useRef<HTMLDivElement>(null);
  const naoLidas = itens.filter((n) => !n.lida).length;

  const posicionar = React.useCallback(() => {
    const r = gatilho.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ top: r.bottom + 8, right: Math.max(16, window.innerWidth - r.right) });
  }, []);

  React.useEffect(() => {
    if (!aberto) return;
    posicionar();
    painel.current?.focus();
    const fora = (e: MouseEvent) => {
      const alvo = e.target as Node;
      if (!painel.current?.contains(alvo) && !gatilho.current?.contains(alvo)) setAberto(false);
    };
    document.addEventListener("mousedown", fora);
    window.addEventListener("resize", posicionar);
    // `true`: a página rola atrás do painel, e o painel acompanha o sino
    window.addEventListener("scroll", posicionar, true);
    return () => {
      document.removeEventListener("mousedown", fora);
      window.removeEventListener("resize", posicionar);
      window.removeEventListener("scroll", posicionar, true);
    };
  }, [aberto, posicionar]);

  function fechar(devolverFoco = true) {
    setAberto(false);
    if (devolverFoco) gatilho.current?.focus();
  }

  return (
    <>
      <HeaderNotificacoes
        ref={gatilho}
        rotulo={naoLidas ? `Notificações: ${naoLidas} não lidas` : "Notificações: nenhuma não lida"}
        contagem={naoLidas}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        onClick={() => (aberto ? fechar() : setAberto(true))}
      />
      {aberto && pos
        ? createPortal(
            <div
              ref={painel}
              role="dialog"
              aria-label="Notificações"
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key !== "Escape") return;
                e.preventDefault();
                fechar();
              }}
              style={{ top: pos.top, right: pos.right }}
              className="fixed z-popover flex w-[360px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-lg border border-overlay-border bg-overlay-bg shadow-lg outline-none motion-safe:animate-fade-in-fast"
            >
              <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
                <p className="text-h4 text-foreground">Notificações</p>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!naoLidas}
                  onClick={() => setItens((l) => l.map((n) => ({ ...n, lida: true })))}
                >
                  Marcar todas como lidas
                </Button>
              </div>

              <ul className="flex max-h-[320px] flex-col overflow-y-auto overscroll-contain [scrollbar-width:thin]">
                {itens.map((n) => {
                  const Icone = n.icone;
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => setItens((l) => l.map((x) => (x.id === n.id ? { ...x, lida: true } : x)))}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-overlay-item-hover
                                   outline-none ${focoInterno}`}
                      >
                        <span
                          aria-hidden="true"
                          className={
                            n.lida
                              ? "grid size-8 shrink-0 place-items-center rounded-full bg-background text-subtle-foreground"
                              : "grid size-8 shrink-0 place-items-center rounded-full bg-accent text-primary"
                          }
                        >
                          <Icone size={16} weight="regular" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline gap-2">
                            <span className={n.lida ? "truncate text-label-lg text-muted-foreground" : "truncate text-label-lg text-foreground"}>
                              {n.titulo}
                            </span>
                            <span className="ml-auto shrink-0 text-caption text-subtle-foreground">{n.quando}</span>
                          </span>
                          <span className="mt-0.5 line-clamp-2 block text-body-sm text-muted-foreground">{n.detalhe}</span>
                        </span>
                        {n.lida ? null : <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-border p-1.5">
                <Button variant="ghost" size="sm" className="w-full">
                  Ver todas
                </Button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/* --- peças da doc: cada instância guarda o próprio estado ---------------- */

function Trilha({ itens = trilhaDoArquivo }: { itens?: ItemBreadcrumb[] }) {
  return (
    <Breadcrumb rotulo="Trilha de navegação" rotuloRecolhidos={(n) => `Mostrar ${n} níveis ocultos`} itens={itens} />
  );
}

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
  const [visao, setVisao] = React.useState("grafico");
  return <ViewSwitcher rotulo="Visualização" itens={visoes} atual={visao} aoEscolher={setVisao} />;
}

function Periodo() {
  const [periodo, setPeriodo] = React.useState("mes");
  return <SegmentedControl rotulo="Período" itens={periodos} atual={periodo} aoEscolher={setPeriodo} />;
}

function Data() {
  const [valor, setValor] = React.useState<IntervaloDeDatas>({ inicio: null, fim: null });
  return <DateRangePicker valor={valor} onValorChange={setValor} rotulos={rotulosData} locale="pt-BR" />;
}

function HeaderDefault() {
  return (
    <Header
      titulo="Dashboard"
      trilha={<Trilha />}
      utilitarios={<Sino />}
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
  utilitarios={<HeaderNotificacoes rotulo="Notificações: 5 não lidas" contagem={5} onClick={abrirPainel} />}
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
  trilha={trilha}
  utilitarios={sino}
  acoes={<HeaderBusca rotulo="Pesquisar leads" placeholder="Pesquisar" />}
/>`;

const codigoSino = `const [aberto, setAberto] = useState(false);

<HeaderNotificacoes
  ref={gatilho}
  rotulo={t("notificacoes", { n: naoLidas })}
  contagem={naoLidas}
  aria-haspopup="dialog"
  aria-expanded={aberto}
  onClick={() => setAberto((a) => !a)}
/>

// o painel é da tela, não do DS: portal no body, ancorado no sino,
// em overlay/bg com shadow-lg — o mesmo caminho da lista do Select`;

const codigoControles = `<ViewSwitcher rotulo="Visualização" itens={visoes} atual={visao} aoEscolher={setVisao} />

<SegmentedControl rotulo="Período" itens={periodos} atual={periodo} aoEscolher={setPeriodo} />

// visoes: { valor, rotulo, icone }[] — o rótulo vira nome acessível e tooltip
// periodos: { valor, rotulo, disabled? }[] — de 2 a 4; acima disso, Select`;

export default function HeaderPage() {
  return (
    <PaginaDS
      titulo="Header"
      descricao="O topo de cada página: 111px, recuo 32×16, trilha e sino numa linha de 32px, título h1 e a fileira de ações com vão de 8. Seis combinações no arquivo, nenhuma prop de variante — o conteúdo entra por três encaixes."
      secoes={[
        "Como funciona",
        "Default",
        "Com data",
        "Menos ações",
        "Busca inline",
        "Notificações",
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
          <Chip>utilitarios</Chip> e <Chip>acoes</Chip>, mais o título — e guarda só a geometria do arquivo.
        </p>
        <p>
          O subtítulo continua existindo como prop (<Chip>subtitulo</Chip>), mas fora por padrão: título e descrição
          decorativos em toda tela são anti-referência deste produto, e a trilha acima já diz onde a pessoa está. Passe{" "}
          <Chip>subtitulo</Chip> só quando a frase disser algo que o título não diz.
        </p>
        <p>
          O que entra nos encaixes são peças que já existem: <Chip>Breadcrumb</Chip>, <Chip>Button</Chip> (com a
          variante <Chip>tertiary</Chip>, que nasceu daqui) e <Chip>DateRangePicker</Chip>. Três são novas:{" "}
          <Chip>SegmentedControl</Chip>, <Chip>ViewSwitcher</Chip> e <Chip>HeaderDivisor</Chip>, este em{" "}
          <Chip>divider</Chip>, token que o arquivo tinha e o código não.
        </p>
        <p>
          Quando não cabe, nada vaza. A fileira de ações desce para a linha de baixo, à direita, e quebra entre si;
          título e cada nível da trilha truncam com o texto inteiro no <Chip>title</Chip> (D12). Nesta coluna de leitura
          as ações do Default já não cabem ao lado do título — é o comportamento real, não defeito do preview.
        </p>
        <p>
          O escuro não tem desenho no arquivo e não ganha seção aqui: troque o tema no menu e a página inteira vira,
          porque todo valor é token. Três coisas precisaram de par próprio para isso funcionar de verdade. A{" "}
          <span className="text-foreground">sombra interna</span> do arquivo é um brilho claro: no escuro ela lava a
          superfície, então <Chip>--shadow-button-inner</Chip> vira <Chip>none</Chip> e só o <Chip>primary</Chip>,
          que tem azul cheio embaixo, mantém o relevo. O <Chip>soft</Chip> saía branco-azulado nos dois temas — agora
          usa <Chip>--button-soft-*</Chip>, com <Chip>accent</Chip> e <Chip>blue-300</Chip> no escuro. E a opção
          selecionada dos seletores, em <Chip>accent</Chip>, era quase idêntica ao <Chip>card</Chip> da trilha:{" "}
          <Chip>--segmented-item-selected</Chip> passa a <Chip>background</Chip> no escuro, e a seleção volta a
          aparecer.
        </p>
        <p>
          A outra armadilha estava no selo do sino. O arquivo pinta o número com <Chip>destructive-foreground</Chip>,
          que é branco nos dois modos — reprova a D8 e, no escuro, dá 2,6:1 sobre o vermelho claro. O número usa{" "}
          <Chip>primary-foreground</Chip>, a mesma escolha do Button destructive.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Default"
        spec="601:12"
        descricao="O conjunto completo do arquivo: busca, filtros, visualização, período, divisor, as duas ações e o sino. Tudo vivo — troque a visualização e o período, clique no sino."
        codigo={codigoDefault}
        semCaixa
      >
        <HeaderDefault />
      </Secao>

      <Secao
        titulo="Com data"
        spec="610:13761"
        descricao="O período por data em vez do segmentado. É o DateRangePicker inteiro: clique e o painel de dois meses abre por cima da página."
        codigo={codigoData}
        semCaixa
        nota={
          <>
            O gatilho do Date Picker fecha em 29px de altura, e o arquivo o desenha com 32 dentro do Header. A fileira
            centraliza, então nada desalinha; os 3px ficam como divergência.
          </>
        }
      >
        <Header
          titulo="Dashboard"
          trilha={<Trilha />}
          utilitarios={<Sino />}
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
      >
        <Header
          titulo="Dashboard"
          trilha={<Trilha />}
          utilitarios={<Sino />}
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
          trilha={<Trilha />}
          utilitarios={<Sino />}
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
          trilha={<Trilha />}
          utilitarios={<Sino />}
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
      >
        <Header
          titulo="Dashboard"
          trilha={<Trilha />}
          utilitarios={<Sino />}
          acoes={<HeaderBusca rotulo="Pesquisar leads" placeholder="Pesquisar" />}
          className="border-b-0"
        />
      </Secao>

      <Secao
        titulo="Notificações"
        spec="painel derivado"
        descricao="Clique no sino: a lista abre ancorada nele. Clicar numa notificação marca como lida e o selo desconta na hora; Escape fecha e devolve o foco ao sino."
        codigo={codigoSino}
        semCaixa
        nota={
          <>
            O arquivo desenha o sino e o selo, não o painel. Ele é derivado dos tokens <Chip>overlay/*</Chip> e do
            degrau <Chip>shadow-lg</Chip> — o mesmo caminho da lista aberta do Select — e mora na página, não no DS:
            o que conta como notificação é decisão da tela.
          </>
        }
      >
        <Header
          titulo="Dashboard"
          trilha={<Trilha />}
          utilitarios={<Sino />}
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
        titulo="Trilha longa"
        spec="7 níveis · 3 à vista"
        descricao="Sete níveis do CRM real. Passando de três, os do meio recolhem em reticências; clique nelas para abrir a trilha inteira no lugar."
        semCaixa
      >
        <Header
          titulo="Construtora Horizonte Ltda."
          trilha={<Trilha itens={trilhaLonga} />}
          utilitarios={<Sino />}
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
        descricao="Espanhol, que é 20–30% mais longo, numa coluna de celular. As ações descem e quebram; o título trunca. Passe o cursor num texto cortado para ler inteiro."
      >
        <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-md">
          <Header
            titulo="Panel de indicadores comerciales"
            trilha={<Trilha itens={trilhaEspanhol} />}
            utilitarios={<Sino />}
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
            Segmented: trilha <Chip>card</Chip> com recuo 4, opção de 28px, selecionada em{" "}
            <Chip>segmented-item-selected</Chip> + <Chip>overlay/item-text-selected</Chip>. View Switcher: recuo 2,
            116px divididos, raio 4, selecionada com <Chip>primary</Chip> no ícone. A sombra interna vale só no claro.
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
