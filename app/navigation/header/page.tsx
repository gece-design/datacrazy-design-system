"use client";

import * as React from "react";
import {
  BellSimple, ChartBar, ChartPieSlice, ClipboardText, Handshake,
  Plus, Table, UserPlus, WarningCircle, type Icon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Breadcrumb, type ItemBreadcrumb } from "@/components/ui/breadcrumb";
import { Header, HeaderBusca, HeaderDivisor, HeaderFiltros, HeaderNotificacoes, Notificacoes, type Notificacao } from "@/components/ui/header";
import {
  SegmentedControl,
  ViewSwitcher,
  type OpcaoDeVisualizacao,
  type OpcaoSegmentada,
} from "@/components/ui/segmented-control";
import { DateRangePicker, type IntervaloDeDatas, type RotulosDoDatePicker } from "@/components/ui/date-picker";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";

import { foco } from "@/lib/estados";
import { useSaida } from "@/lib/use-saida";
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
 * O arquivo desenha o sino e o selo, não o painel. O painel virou peça do DS
 * em 2026-09-23 (`Notificacoes`): toda tela tem o sino e ele precisa abrir.
 * O que continua da página é o conteúdo — quem decide o que é uma
 * notificação é a tela, não o Header.
 */
function Sino() {
  const [itens, setItens] = React.useState(notificacoes);
  return (
    <Notificacoes
      itens={itens}
      aoMarcarLida={(id) => setItens((l) => l.map((n) => (n.id === id ? { ...n, lida: true } : n)))}
      aoMarcarTodas={() => setItens((l) => l.map((n) => ({ ...n, lida: true })))}
    />
  );
}

/* --- peças da doc: cada instância guarda o próprio estado ---------------- */

/** O Header como ele aparece na tela: sobre a superfície da TelaBase (`card`,
 *  marcada com `data-superficie`), que é o que deixa os controles de apoio
 *  cinza. Vários exemplos na mesma seção se separam por traço. */
function NaTela({ children }: { children: React.ReactNode }) {
  return (
    <div data-superficie className="divide-y divide-border overflow-hidden rounded-2xl bg-card">
      {children}
    </div>
  );
}

function Trilha({ itens = trilhaDoArquivo }: { itens?: ItemBreadcrumb[] }) {
  return (
    // `ancestrais`: a trilha traz os níveis acima; a página é o título, logo depois dela
    <Breadcrumb ancestrais rotulo="Trilha de navegação" rotuloRecolhidos={(n) => `Mostrar ${n} níveis ocultos`} itens={itens} />
  );
}

/* A busca é sempre a HeaderBusca. Aberta quando a fileira só tem botões;
   `recolhida` (só a lupa) quando entra troca-visão, período ou data. */
function Busca({ recolhida }: { recolhida?: boolean }) {
  const [valor, setValor] = React.useState("");
  return (
    <HeaderBusca
      recolhida={recolhida}
      rotulo="Pesquisar leads"
      placeholder="Pesquisar"
      value={valor}
      onChange={(e) => setValor(e.target.value)}
    />
  );
}

/* Os filtros seguem a busca: com rótulo quando a fileira só tem botões,
   `recolhido` (só o ícone) quando entra troca-visão, período ou data. */
function Filtros({ recolhido }: { recolhido?: boolean }) {
  return <HeaderFiltros recolhido={recolhido} rotulo="Filtros" />;
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
          <Busca recolhida />
          <Filtros recolhido />
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
      ancestrais
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
      {/* recolhidos: a fileira tem troca-visão e período */}
      <HeaderBusca recolhida rotulo="Pesquisar leads" placeholder="Pesquisar" value={busca} onChange={(e) => setBusca(e.target.value)} />
      <HeaderFiltros recolhido rotulo="Filtros" />
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
    <HeaderBusca recolhida rotulo="Pesquisar leads" placeholder="Pesquisar" value={busca} onChange={(e) => setBusca(e.target.value)} />
    <DateRangePicker valor={periodo} onValorChange={setPeriodo} rotulos={rotulos} locale={locale} />
    <HeaderDivisor />
    <Button><Plus size={16} weight="regular" />Novo lead</Button>
  </>
}`;

const codigoBusca = `// Só botões na fileira: busca aberta (184px), filtros com rótulo, sem divisor.
// Com troca-visão, período ou data: \`recolhida\` e \`recolhido\` — só os ícones; a lupa abre ao clicar.
<Header
  titulo="Dashboard"
  trilha={trilha}
  utilitarios={sino}
  acoes={
    <>
      <HeaderBusca recolhida rotulo="Pesquisar leads" placeholder="Pesquisar" value={busca} onChange={(e) => setBusca(e.target.value)} />
      <HeaderFiltros recolhido rotulo="Filtros" />
      <ViewSwitcher rotulo="Visualização" itens={visoes} atual={visao} aoEscolher={setVisao} />
      <HeaderDivisor />
      <Button><Plus size={16} weight="regular" />Novo lead</Button>
    </>
  }
/>`;

const codigoSino = `const [aberto, setAberto] = useState(false);
  const { saindo, visivel } = useSaida(aberto);

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

const codigoControles = `// visoes: { valor, rotulo, icone }[] — o rótulo vira nome acessível e tooltip
// periodos: { valor, rotulo, disabled? }[] — de 2 a 4; acima disso, Select
<Header
  titulo="Dashboard"
  acoes={
    <>
      <ViewSwitcher rotulo="Visualização" itens={visoes} atual={visao} aoEscolher={setVisao} />
      <SegmentedControl rotulo="Período" itens={periodos} atual={periodo} aoEscolher={setPeriodo} />
    </>
  }
/>`;

export default function HeaderPage() {
  return (
    <PaginaDS
      titulo="Header"
      descricao="O topo de cada página, numa linha só: 64px sozinho, 48 como primeira faixa do painel da tela. À esquerda a trilha e o título, que é o último nível dela; à direita as ações e o sino, com 32px e vão de 8. Nenhuma prop de variante — o conteúdo entra por encaixes."
      secoes={[
        "Como funciona",
        "Default",
        "Com data",
        "Menos ações",
        "Busca e filtros",
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
          <Chip>acoes</Chip> e <Chip>utilitarios</Chip>, mais o título — e guarda só a geometria.
        </p>
        <p>
          Tudo cabe em <span className="text-foreground">uma linha</span>. O arquivo desenha duas — trilha e sino em
          cima, título grande e ações embaixo — e era isso que deixava um bloco de espaço em branco no topo de toda
          tela. Agora o título é o último nível da trilha: os níveis acima vêm apagados, o título vem em seguida, com
          peso. Por isso a trilha entra com <Chip>ancestrais</Chip> no <Chip>Breadcrumb</Chip> — ela traz só o caminho
          até a página, e a página é o título.
        </p>
        <p>
          O Header não tem fundo nem traço próprios: fica sobre a superfície de quem o hospeda. Na tela, ele é a
          primeira faixa do painel branco da <Chip>TelaBase</Chip> — por isso os exemplos desta página aparecem sobre
          branco, e por isso busca, filtros, sino e seletores são <span className="text-foreground">cinza</span> ali:
          o controle de apoio usa sempre a superfície oposta à de onde está. Fora do painel, sobre o fundo da
          aplicação, os mesmos controles são brancos.
        </p>
        <p>
          O subtítulo continua existindo como prop (<Chip>subtitulo</Chip>), mas fora por padrão: título e descrição
          decorativos em toda tela são anti-referência deste produto, e a trilha já diz onde a pessoa está. Passe{" "}
          <Chip>subtitulo</Chip> só quando a frase disser algo que o título não diz: ele vem depois do título, discreto,
          e só aparece quando há largura.
        </p>
        <p>
          O que entra nos encaixes são peças que já existem: <Chip>Breadcrumb</Chip>, <Chip>Button</Chip> (com a
          variante <Chip>tertiary</Chip>, que nasceu daqui) e <Chip>DateRangePicker</Chip>. Três são novas:{" "}
          <Chip>SegmentedControl</Chip>, <Chip>ViewSwitcher</Chip> e <Chip>HeaderDivisor</Chip>, este em{" "}
          <Chip>divider</Chip>, token que o arquivo tinha e o código não.
        </p>
        <p>
          Quando não cabe, nada vaza. A fileira de ações desce para a linha de baixo, à direita, e quebra entre si;
          abaixo de 640 da largura do Header (celular), a trilha sai, o título fica centrado entre o menu e o sino e as
          ações vão para a linha de baixo, centradas. Título e cada nível da trilha truncam com o texto inteiro no{" "}
          <Chip>title</Chip> (D12). Nesta coluna de leitura as ações do Default já não cabem ao lado do título — é o
          comportamento real, não defeito do preview.
        </p>
        <p>
          O escuro não tem desenho no arquivo e não ganha seção aqui: troque o tema no menu e a página inteira vira,
          porque todo valor é token. Três coisas precisaram de par próprio para isso funcionar de verdade. A{" "}
          <span className="text-foreground">sombra interna</span> do arquivo é um brilho claro: no escuro ela lava a
          superfície, então <Chip>--shadow-button-inner</Chip> vira <Chip>none</Chip>; o <Chip>primary</Chip> é plano
          nos dois temas (pedido do cliente, 2026-09-24). O <Chip>soft</Chip> saía branco-azulado nos dois temas — agora
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
        semSeletorDeFundo
      >
        <NaTela>
          <HeaderDefault />
        </NaTela>
      </Secao>

      <Secao
        titulo="Com data"
        spec="610:13761"
        descricao="O período por data em vez do segmentado. É o DateRangePicker inteiro: clique e o painel de dois meses abre por cima da página."
        codigo={codigoData}
        semCaixa
        semSeletorDeFundo
        nota={
          <>
            O gatilho do Date Picker tem 32px, como os outros botões da fileira — o arquivo o desenha com 29 fora
            do Header e com 32 dentro; ficou com 32 (humano, 2026-09-24).
          </>
        }
      >
        <NaTela>
          <Header
            titulo="Dashboard"
            trilha={<Trilha />}
            utilitarios={<Sino />}
            acoes={
              <>
                <Busca recolhida />
                <Filtros recolhido />
                <Visao />
                <Data />
                <HeaderDivisor />
                <NovoLead variant="soft" />
                <NovoLead variant="primary" />
              </>
            }
          />
        </NaTela>
      </Secao>

      <Secao
        titulo="Menos ações"
        spec="610:13838 · 13915 · 13982"
        descricao="Três recortes do arquivo, do mais cheio ao mais enxuto. Nenhum é variante: é o mesmo Header com menos filhos em acoes. Busca e filtros seguem a regra: com o troca-visão, só os ícones; só botões, aberta e com rótulo, e sem divisor."
        semCaixa
        semSeletorDeFundo
      >
        <NaTela>
          <Header
            titulo="Dashboard"
            trilha={<Trilha />}
            utilitarios={<Sino />}
            acoes={
              <>
                <Busca recolhida />
                <Filtros recolhido />
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
                <Busca />
                <Filtros />
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
                <Busca />
                <Filtros />
                <NovoLead variant="primary" />
              </>
            }
          />
        </NaTela>
      </Secao>

      <Secao
        titulo="Busca e filtros"
        spec="610:14049 · 184 ↔ 32px"
        descricao="Sempre HeaderBusca e HeaderFiltros, nunca um botão com texto no lugar. Só botões na fileira: busca aberta e filtros com rótulo. Com troca-visão, período ou data: só os ícones — a lupa abre a caixa até 184 com o foco dentro e, vazia, volta ao sair; os filtros ganham tooltip. O divisor só entra antes da ação principal quando há grupo de visão."
        codigo={codigoBusca}
        semCaixa
        semSeletorDeFundo
        nota={
          <>
            A escolha é por tela, não por largura: busca e filtros não mudam de estado quando a janela encolhe.
            Regra do humano (2026-09-23 e 24), ADR-028.
          </>
        }
      >
        <NaTela>
          <Header
            titulo="Dashboard"
            trilha={<Trilha />}
            utilitarios={<Sino />}
            acoes={
              <>
                <Busca />
                <Filtros />
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
                <Busca recolhida />
                <Filtros recolhido />
                <Visao />
                <HeaderDivisor />
                <NovoLead variant="primary" />
              </>
            }
          />
        </NaTela>
      </Secao>

      <Secao
        titulo="Notificações"
        spec="painel derivado"
        descricao="Clique no sino: a lista abre ancorada nele. Clicar numa notificação marca como lida e o selo desconta na hora; Escape fecha e devolve o foco ao sino."
        codigo={codigoSino}
        semCaixa
        semSeletorDeFundo
        nota={
          <>
            O arquivo desenha o sino e o selo, não o painel. Ele é derivado dos tokens <Chip>overlay/*</Chip> e do
            degrau <Chip>shadow-lg</Chip> — o mesmo caminho da lista aberta do Select — e mora na página, não no DS:
            o que conta como notificação é decisão da tela.
          </>
        }
      >
        <NaTela>
          <Header
            titulo="Dashboard"
            trilha={<Trilha />}
            utilitarios={<Sino />}
            acoes={
              <>
                <Filtros />
                <NovoLead variant="primary" />
              </>
            }
          />
        </NaTela>
      </Secao>

      <Secao
        titulo="Trilha longa"
        spec="7 níveis · 3 à vista"
        descricao="Seis níveis acima da página, do CRM real. Passando de três, os do meio recolhem em reticências; clique nelas para abrir a trilha inteira no lugar. O título continua sendo o último nível."
        semCaixa
        semSeletorDeFundo
      >
        <NaTela>
          <Header
            titulo="Negócio #4821"
            trilha={<Trilha itens={trilhaLonga.slice(0, -1)} />}
            utilitarios={<Sino />}
            acoes={
              <>
                <Filtros />
                <NovoLead variant="primary" />
              </>
            }
          />
        </NaTela>
      </Secao>

      <Secao
        titulo="Quando não cabe"
        spec="360px · es"
        descricao="Espanhol, que é 20–30% mais longo, numa coluna de celular. Abaixo de 640 da largura do próprio Header, a trilha sai, o título fica centrado ao lado do sino e as ações vão para a linha de baixo, centradas; o título trunca. Passe o cursor num texto cortado para ler inteiro."
      >
        <div data-superficie className="mx-auto w-full max-w-[360px] overflow-hidden rounded-md bg-card">
          <Header
            titulo="Panel de indicadores comerciales"
            trilha={<Trilha itens={trilhaEspanhol} />}
            utilitarios={<Sino />}
            acoes={
              <>
                <HeaderBusca rotulo="Buscar prospectos" placeholder="Buscar" />
                <HeaderFiltros rotulo="Filtros" />
                <Button variant="primary">
                  <Plus size={16} weight="regular" />
                  Nuevo prospecto
                </Button>
              </>
            }
            className="px-4"
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
