"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarBlank,
  ChatCircleDots,
  FlowArrow,
  Gear,
  House,
  Kanban,
  SlidersHorizontal,
  FunnelSimple,
  Handshake,
  Headset,
  ShareNetwork,
  Tag as IconeDeTag,
  WarningCircle,
  Clock,
  Lightning,
  Plus,
  Question,
  Robot,
  Rows,
  UsersThree,
} from "@phosphor-icons/react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BarraDeFiltros, contarFiltros, type CampoDeFiltro, type FiltrosAtivos } from "@/components/ui/barra-de-filtros";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Header, HeaderBusca, HeaderDivisor, HeaderFiltros, Notificacoes, type Notificacao } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ViewSwitcher } from "@/components/ui/segmented-control";
import { Select } from "@/components/ui/select";
import {
  Sidebar,
  SidebarBrand,
  SidebarGrupo,
  SidebarItem,
  SidebarRodape,
  SidebarThemeSwitch,
  SidebarTopo,
  SidebarUser,
} from "@/components/ui/sidebar";
import { Toaster, toast } from "@/components/ui/toast";
import { useTema } from "@/lib/tema";
import { cn } from "@/lib/utils";
import {
  CORES_COLUNA,
  ETAPAS,
  GRUPOS_TAGS,
  LEADS,
  etapaPor,
  moeda,
  tagsDe,
  type Canal,
  type CorColuna,
  type Etapa,
  type EtapaId,
  type Lead,
} from "./dados";
import { Lista, COLUNAS_DA_LISTA } from "./lista";
import { BotaoAgrupar, BotaoColunas, useAjustesDaTabela } from "@/components/ui/data-table";
import { Calendario } from "@/components/ui/calendario";
import { TelaBase } from "@/components/ui/tela-base";
import { PainelLead } from "./painel-lead";
import { Quadro, IconeDoCanal, agrupar, CAMPOS_DO_CARTAO, ROTULOS_DOS_CAMPOS, type CampoDoCartao, type Colunas } from "./quadro";
import { Tag } from "@/components/ui/tag";
import { Menu } from "@/components/ui/menu";

import { foco, rolagemDiscreta } from "@/lib/estados";
/* ---------------------------------------------------------------------------
   Tela de exemplo — NÃO é componente do design system.

   O funil do CRM montado só com o que já está pronto em `components/ui/`:
   Sidebar, Header, Breadcrumb, Segmented Control, Select, Input, Modal, Tag,
   Table, Drawer, Toast e Button. Nenhuma peça nova foi desenhada para ela — o
   que existe de próprio aqui é o arranjo e o cartão do lead, que conhece
   domínio e por isso mora na tela, nunca na biblioteca.

   Serve para o cliente testar de verdade: arrastar, criar, editar, salvar,
   trocar tag, filtrar, buscar e trocar o tema.
--------------------------------------------------------------------------- */

const PRINCIPAIS = [
  { rotulo: "Início", icone: House },
  { rotulo: "Pipelines", icone: Kanban },
  { rotulo: "Leads", icone: UsersThree },
  { rotulo: "Impulso", icone: Lightning },
  { rotulo: "Automações", icone: FlowArrow },
  { rotulo: "Chat ao vivo", icone: ChatCircleDots },
  { rotulo: "Agentes de IA", icone: Robot },
];

const APOIO = [
  { rotulo: "Calendar", icone: CalendarBlank },
  { rotulo: "Ajuda", icone: Question },
  { rotulo: "Configurações", icone: Gear },
];

const ATENDENTES = ["Esther", "Liam", "Marina"];
const CANAIS: Canal[] = ["WhatsApp", "Instagram", "Site", "Indicação"];

/* Filtro é uma lista por campo: campo fora do objeto significa "tudo". Dentro
   do mesmo campo soma (ou), entre campos corta (e) — é o que o comercial
   espera ao marcar dois atendentes e uma origem. O formato é o da
   `BarraDeFiltros`: cada campo ativo vira um chip. */
const SINAIS: { id: string; rotulo: string; vale: (l: Lead) => boolean }[] = [
  { id: "parados", rotulo: "Parados há 7 dias ou mais", vale: (l) => l.dias >= 7 },
  { id: "sem-tag", rotulo: "Sem nenhuma tag", vale: (l) => l.tags.length === 0 },
  { id: "acima-50", rotulo: "Acima de R$ 50 mil", vale: (l) => l.valor >= 50000 },
  { id: "novos", rotulo: "Entraram nesta semana", vale: (l) => l.dias <= 7 },
];

/** As origens, em dois grupos — o mesmo recorte do Select de "Novo lead". */
const OPCOES_DE_ORIGEM = CANAIS.map((c) => ({
  valor: c,
  rotulo: c,
  grupo: c === "WhatsApp" || c === "Instagram" ? "Redes sociais" : "Outras",
  icone: <IconeDoCanal canal={c} tamanho={16} />,
}));

/** Os campos que a tela deixa filtrar. Etapa depende das etapas do funil, que a pessoa edita. */
const camposDeFiltro = (etapas: Etapa[]): CampoDeFiltro[] => [
  { id: "etapas", rotulo: "Etapa", icone: FunnelSimple, opcoes: etapas.map((e) => ({ valor: e.id, rotulo: e.rotulo })) },
  { id: "atendentes", rotulo: "Atendente", icone: Headset, opcoes: ATENDENTES.map((a) => ({ valor: a, rotulo: a })) },
  { id: "canais", rotulo: "Origem", icone: ShareNetwork, opcoes: OPCOES_DE_ORIGEM },
  {
    id: "tags",
    rotulo: "Tags",
    icone: IconeDeTag,
    opcoes: GRUPOS_TAGS.flatMap((g) =>
      g.tags.map((x) => ({ valor: x.id, rotulo: x.rotulo, grupo: g.rotulo, conteudo: <Tag status={x.status}>{x.rotulo}</Tag> })),
    ),
  },
  { id: "sinais", rotulo: "Situação", icone: WarningCircle, opcoes: SINAIS.map((s) => ({ valor: s.id, rotulo: s.rotulo })) },
];

const TONS = ["azul", "roxo", "verde", "ciano", "ambar", "rosa", "vermelho", "laranja"] as const;

/* Buscar "saude" tem que achar "Saúde": quem digita rápido não põe acento. */
function semAcento(texto: string) {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase();
}

const leadVazio = { nome: "", empresa: "", valor: "", atendente: ATENDENTES[0], etapa: "novo" as EtapaId, canal: "WhatsApp" as Canal };

const etapaVazia = { modo: "criar" as "criar" | "editar", id: "", rotulo: "", cor: "neutro" as CorColuna };

/** `visaoInicial`: a tela abre no quadro; a página de comparação visual abre direto na lista. */
export function Tela({ visaoInicial = "quadro" }: { visaoInicial?: "quadro" | "lista" | "calendario" } = {}) {
  const [etapas, setEtapas] = React.useState<Etapa[]>(ETAPAS);
  const [colunas, setColunas] = React.useState<Colunas>(() => agrupar(ETAPAS, LEADS));
  const [busca, setBusca] = React.useState("");
  const [filtro, setFiltro] = React.useState<FiltrosAtivos>({});
  const [visao, setVisao] = React.useState<string>(visaoInicial);
  // O mês do calendário: começa em setembro de 2026, o mês da carteira de exemplo.
  const [referencia, setReferencia] = React.useState(() => new Date(2026, 8, 1));
  const [visaoDoCalendario, setVisaoDoCalendario] = React.useState<"mes" | "semana">("mes");
  // O que o cartão mostra, campo a campo (tipo Notion): a escolha fica no navegador.
  const [campos, setCampos] = React.useState<CampoDoCartao[]>([...CAMPOS_DO_CARTAO]);
  const [personalizando, setPersonalizando] = React.useState(false);
  const botaoPersonalizar = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    try {
      const salvos = window.localStorage.getItem("ds:pipeline:cartao");
      if (salvos) {
        const lista = JSON.parse(salvos);
        if (Array.isArray(lista)) setCampos(CAMPOS_DO_CARTAO.filter((c) => lista.includes(c)));
      }
    } catch {
      /* sem memória */
    }
  }, []);
  function alternarCampo(c: CampoDoCartao) {
    setCampos((atual) => {
      const novo = atual.includes(c) ? atual.filter((x) => x !== c) : CAMPOS_DO_CARTAO.filter((x) => x === c || atual.includes(x));
      try {
        window.localStorage.setItem("ds:pipeline:cartao", JSON.stringify(novo));
      } catch {
        /* não poder salvar não quebra */
      }
      return novo;
    });
  }
  // Os ajustes da lista (ordem, colunas, grupo) vivem aqui: os botões ficam no Header.
  const ajustesDaLista = useAjustesDaTabela(COLUNAS_DA_LISTA, { memoria: "pipeline-lista" });
  const [notificacoes, setNotificacoes] = React.useState<Notificacao[]>([
    { id: "1", icone: UsersThree, titulo: "Novo lead atribuído", detalhe: "Construtora Horizonte entrou no seu funil pela campanha de setembro.", quando: "agora", lida: false },
    { id: "2", icone: Clock, titulo: "Lead parado há 9 dias", detalhe: "Pedro Nakamura segue em Qualificação sem interação registrada.", quando: "há 2 h", lida: false },
    { id: "3", icone: Handshake, titulo: "Negócio ganho", detalhe: "Rede Bom Dia assinou o plano anual — R$ 145.000.", quando: "ontem", lida: false },
  ]);
  const [abertoId, setAbertoId] = React.useState<string | null>(null);
  const [rota, setRota] = React.useState("Pipelines");
  const [novo, setNovo] = React.useState<typeof leadVazio | null>(null);
  const [filtros, setFiltros] = React.useState(false);
  const [erroNome, setErroNome] = React.useState<string>();
  const [etapaEmEdicao, setEtapaEmEdicao] = React.useState<typeof etapaVazia | null>(null);
  const [erroEtapa, setErroEtapa] = React.useState<string>();
  const { escuro, alternar } = useTema();

  const todos = React.useMemo(() => etapas.flatMap((e) => colunas[e.id] ?? []), [etapas, colunas]);
  const aberto = todos.find((l) => l.id === abertoId) ?? null;
  const total = todos.reduce((n, l) => n + l.valor, 0);

  const combina = React.useCallback(
    (l: Lead) => {
      const de = (campo: string) => filtro[campo] ?? [];
      if (de("atendentes").length && !de("atendentes").includes(l.responsavel)) return false;
      if (de("etapas").length && !de("etapas").includes(l.etapa)) return false;
      if (de("canais").length && !de("canais").includes(l.canal)) return false;
      if (de("tags").length && !de("tags").some((t) => l.tags.includes(t))) return false;
      if (de("sinais").length && !de("sinais").every((id) => SINAIS.find((x) => x.id === id)?.vale(l))) return false;
      const t = semAcento(busca);
      if (t === "") return true;
      const campos = [l.nome, l.empresa, l.responsavel, l.cidade, l.canal, ...tagsDe(GRUPOS_TAGS, l.tags).map((x) => x.rotulo)];
      return semAcento(campos.join(" ")).includes(t);
    },
    [busca, filtro],
  );

  const quantosFiltros = contarFiltros(filtro);

  const visiveis = React.useMemo(
    () => Object.fromEntries(etapas.map((e) => [e.id, (colunas[e.id] ?? []).filter(combina)])) as Colunas,
    [etapas, colunas, combina],
  );

  /* `indice` chega na contagem do que está À VISTA. Com busca ou filtro ativo,
     a lista real é maior: a posição se traduz pelo cartão que estava ali. */
  function mover(id: string, destino: EtapaId, indice: number) {
    const origem = etapas.map((e) => e.id).find((et) => colunas[et]?.some((l) => l.id === id));
    if (!origem) return;
    const lead = colunas[origem].find((l) => l.id === id)!;

    // A função do `setColunas` é PURA de propósito: o React a executa durante a
    // renderização, e um `toast()` lá dentro vira setState no meio do desenho
    // de outro componente — o aviso que o console deu na primeira versão.
    setColunas((atual) => {
      const sem = { ...atual, [origem]: atual[origem].filter((l) => l.id !== id) };
      const lista = [...sem[destino]];
      const seguinte = lista.filter(combina)[indice];
      const posicao = seguinte ? lista.findIndex((l) => l.id === seguinte.id) : lista.length;
      // etapa nova zera o relógio da etapa; reordenar dentro da mesma não mexe
      lista.splice(posicao, 0, origem === destino ? lead : { ...lead, etapa: destino, dias: 0 });
      return { ...sem, [destino]: lista };
    });

    if (origem !== destino) {
      toast({
        variant: "success",
        titulo: "Lead movido",
        descricao: `${lead.nome} saiu de ${etapaPor(etapas, origem).rotulo} e agora está em ${etapaPor(etapas, destino).rotulo}.`,
        duracao: 5000,
      });
    }
  }

  /* Ações em massa da lista (2026-09-24): mover várias de etapa e excluir
     várias. A função do setColunas continua pura; o toast vem depois. */
  function moverEmMassa(ids: string[], destino: EtapaId) {
    setColunas((atual) => {
      const movidos = etapas
        .flatMap((e) => (atual[e.id] ?? []).filter((l) => ids.includes(l.id)))
        .map((l) => (l.etapa === destino ? l : { ...l, etapa: destino, dias: 0 }));
      const sem = Object.fromEntries(Object.entries(atual).map(([k, lista]) => [k, lista.filter((l) => !ids.includes(l.id))])) as Colunas;
      return { ...sem, [destino]: [...movidos, ...(sem[destino] ?? [])] };
    });
    toast({
      variant: "success",
      titulo: "Leads movidos",
      descricao: `${ids.length} lead(s) agora em ${etapaPor(etapas, destino).rotulo}.`,
      duracao: 5000,
    });
  }
  function excluirEmMassa(ids: string[]) {
    setColunas((atual) => Object.fromEntries(Object.entries(atual).map(([k, lista]) => [k, lista.filter((l) => !ids.includes(l.id))])) as Colunas);
    toast({ variant: "success", titulo: "Leads excluídos", descricao: `${ids.length} lead(s) saíram do funil.`, duracao: 5000 });
  }

  /** Edição vinda do drawer. Toca só o lead alterado, na coluna onde ele está. */
  function editar(id: string, campos: Partial<Lead>) {
    setColunas((atual) => {
      const etapa = etapas.map((e) => e.id).find((et) => atual[et]?.some((l) => l.id === id));
      if (!etapa) return atual;
      return { ...atual, [etapa]: atual[etapa].map((l) => (l.id === id ? { ...l, ...campos } : l)) };
    });
  }

  function criarLead() {
    if (!novo) return;
    const nome = novo.nome.trim();
    if (!nome) {
      setErroNome("Escreva o nome do lead");
      return;
    }
    const valor = Number(novo.valor.replace(/[^\d]/g, "")) || 0;
    const lead: Lead = {
      id: `n${Date.now()}`,
      nome,
      empresa: novo.empresa.trim() || nome,
      tipo: "pessoa",
      telefone: "",
      email: "",
      cidade: "",
      canal: novo.canal,
      responsavel: novo.atendente,
      valor,
      dias: 0,
      proximaAcao: "",
      totalCompras: 0,
      cicloDias: 0,
      etapa: novo.etapa,
      tags: [],
      tom: TONS[todos.length % TONS.length],
      historico: [{ id: "h1", tipo: "nota", titulo: "Lead criado à mão no funil", detalhes: [novo.atendente, "agora"] }],
    };
    setColunas((atual) => ({ ...atual, [lead.etapa]: [lead, ...atual[lead.etapa]] }));
    setNovo(null);
    setErroNome(undefined);
    toast({ titulo: "Lead criado", descricao: `${nome} entrou em ${etapaPor(etapas, lead.etapa).rotulo}.`, duracao: 5000 });
  }

  /** Cria ou renomeia/recolore a etapa aberta no modal. */
  function salvarEtapa() {
    if (!etapaEmEdicao) return;
    const rotulo = etapaEmEdicao.rotulo.trim();
    if (!rotulo) {
      setErroEtapa("Escreva o nome da etapa");
      return;
    }
    if (etapaEmEdicao.modo === "criar") {
      const nova: Etapa = {
        id: `e${Date.now()}`,
        rotulo,
        descricao: "Etapa criada nesta simulação",
        cor: etapaEmEdicao.cor,
        // entra no fim do funil: a barra da visão em lista precisa de um valor
        percentual: 100,
      };
      setEtapas((atual) => [...atual, nova]);
      setColunas((atual) => ({ ...atual, [nova.id]: [] }));
      toast({ titulo: "Etapa criada", descricao: `${rotulo} entrou no fim do funil.`, duracao: 5000 });
    } else {
      setEtapas((atual) =>
        atual.map((e) => (e.id === etapaEmEdicao.id ? { ...e, rotulo, cor: etapaEmEdicao.cor } : e)),
      );
    }
    setEtapaEmEdicao(null);
    setErroEtapa(undefined);
  }

  /** Só apaga etapa vazia: mover lead é decisão de quem trabalha o funil. */
  function excluirEtapa() {
    if (!etapaEmEdicao || etapaEmEdicao.modo !== "editar") return;
    const id = etapaEmEdicao.id;
    setEtapas((atual) => atual.filter((e) => e.id !== id));
    setColunas((atual) => {
      const resto = { ...atual };
      delete resto[id];
      return resto;
    });
    setEtapaEmEdicao(null);
    toast({ variant: "info", titulo: "Etapa removida", descricao: `${etapaEmEdicao.rotulo} saiu do funil.`, duracao: 5000 });
  }

  const leadsDaEtapaEmEdicao =
    etapaEmEdicao?.modo === "editar" ? (colunas[etapaEmEdicao.id] ?? []).length : 0;

  return (
    <TelaBase
      memoria="pipeline"
      recuo={false}
      navegacao={
        <>
        <SidebarTopo>
          <SidebarBrand />
          <SidebarGrupo recuo>
            {PRINCIPAIS.map((r) => (
              <SidebarItem
                key={r.rotulo}
                icone={r.icone}
                componente="button"
                selecionado={r.rotulo === rota}
                onClick={() => setRota(r.rotulo)}
              >
                {r.rotulo}
              </SidebarItem>
            ))}
          </SidebarGrupo>
        </SidebarTopo>

        <SidebarRodape>
          <SidebarGrupo>
            <li>
              <SidebarThemeSwitch
                tema={escuro ? "escuro" : "claro"}
                onTemaChange={(t) => {
                  if ((t === "escuro") !== escuro) alternar();
                }}
              />
            </li>
            {APOIO.map((r) => (
              <SidebarItem
                key={r.rotulo}
                icone={r.icone}
                componente="button"
                selecionado={r.rotulo === rota}
                onClick={() => setRota(r.rotulo)}
              >
                {r.rotulo}
              </SidebarItem>
            ))}
            {/* A tela é uma demonstração: a porta de volta para a biblioteca
                fica visível, e é o único link de verdade da navegação. */}
            <SidebarItem icone={ArrowLeft} componente={Link} href="/">
              Voltar ao design system
            </SidebarItem>
          </SidebarGrupo>
          <SidebarUser nome="Gabriel Correa" email="gece@datacrazy.com" />
        </SidebarRodape>
        </>
      }
      cabecalho={{
        // Header de uma linha: a trilha traz os ancestrais e o título é a própria página.
        titulo: "Comercial",
        trilha: (
            <Breadcrumb
              ancestrais
              rotulo="Trilha"
              rotuloRecolhidos={(n) => `Mostrar mais ${n} níveis`}
              itens={[{ rotulo: "Início" }, { rotulo: "Pipelines", icone: Kanban }]}
            />
        ),
          // A ordem é a do arquivo (601:464): busca, filtros, visualização,
          // divisor e a ação principal. `utilitarios` é só o sino.
        utilitarios: (
            <Notificacoes
              itens={notificacoes}
              aoMarcarLida={(id) => setNotificacoes((l) => l.map((n) => (n.id === id ? { ...n, lida: true } : n)))}
              aoMarcarTodas={() => setNotificacoes((l) => l.map((n) => ({ ...n, lida: true })))}
            />
        ),
        acoes: (
            <>
              {/* Só a lupa: a fileira tem o troca-visão (regra da HeaderBusca,
                  Header.md · ADR-028). Clicar abre a caixa. */}
              <HeaderBusca
                recolhida
                rotulo="Pesquisar leads"
                placeholder="Pesquisar"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              {/* Só o ícone, como a busca (a fileira tem o troca-visão). Mostra e
                  esconde a barra de filtros; com filtro ativo vira soft e mostra a conta. */}
              <HeaderFiltros
                recolhido
                rotulo="Filtros"
                contagem={quantosFiltros}
                rotuloComContagem={(n) => `Filtros: ${n} ativos`}
                aria-expanded={filtros}
                onClick={() => setFiltros((v) => !v)}
              />
              <ViewSwitcher
                rotulo="Visualização"
                atual={visao}
                aoEscolher={setVisao}
                itens={[
                  { valor: "quadro", rotulo: "Quadro", icone: Kanban },
                  { valor: "lista", rotulo: "Lista", icone: Rows },
                  { valor: "calendario", rotulo: "Calendário", icone: CalendarBlank },
                ]}
              />
              {visao === "quadro" ? (
                // O que o cartão mostra, campo a campo — o botão de propriedades do Notion.
                <>
                  <Button
                    ref={botaoPersonalizar}
                    variant="tertiary"
                    size="icon"
                    aria-label="Personalizar cartão"
                    title="Personalizar cartão"
                    aria-haspopup="menu"
                    aria-expanded={personalizando}
                    onClick={() => setPersonalizando((v) => !v)}
                  >
                    <SlidersHorizontal size={16} weight="regular" aria-hidden="true" />
                  </Button>
                  <Menu
                    aberto={personalizando}
                    gatilho={botaoPersonalizar}
                    rotulo="Personalizar cartão"
                    itens={CAMPOS_DO_CARTAO.map((c) => ({
                      id: c,
                      rotulo: ROTULOS_DOS_CAMPOS[c],
                      tipo: "check" as const,
                      marcado: campos.includes(c),
                      aoAtivar: () => alternarCampo(c),
                    }))}
                    aoFechar={(devolver = true) => {
                      setPersonalizando(false);
                      if (devolver) botaoPersonalizar.current?.focus();
                    }}
                  />
                </>
              ) : null}
              {visao === "lista" ? (
                // Agrupar e Colunas na fileira do Header, só com o ícone, como a
                // busca e os filtros (humano, 2026-09-24: "e se eles ficarem no header?").
                <>
                  <BotaoAgrupar ajustes={ajustesDaLista} recolhido />
                  <BotaoColunas ajustes={ajustesDaLista} recolhido />
                </>
              ) : null}
              <HeaderDivisor />
              <Button onClick={() => setNovo({ ...leadVazio })}>
                <Plus size={16} weight="regular" />
                Novo lead
              </Button>
            </>
        ),
      }}
    >
        {/* Os filtros em chips: só o que está ativo ocupa espaço, e cada campo
            abre a própria lista com busca. Vale para o quadro, a lista e na hora. */}
        {filtros ? (
          <BarraDeFiltros
            abrirAoMontar
            aria-label="Filtros"
            role="group"
            className="shrink-0 pb-3 pl-4 pr-4 lg:pl-1"
            campos={camposDeFiltro(etapas)}
            valor={filtro}
            aoMudar={setFiltro}
            rotulos={{
              adicionar: "Filtro",
              limpar: "Limpar",
              busca: "Buscar",
              vazio: "Nada encontrado",
              remover: (campo) => `Remover filtro ${campo}`,
            }}
          />
        ) : null}

        {visao === "quadro" ? (
          <Quadro
            etapas={etapas}
            colunas={visiveis}
            campos={campos}
            aoMover={mover}
            aoAbrir={(l) => setAbertoId(l.id)}
            aoAdicionar={(etapa) => setNovo({ ...leadVazio, etapa })}
            aoEditarEtapa={(e) => setEtapaEmEdicao({ modo: "editar", id: e.id, rotulo: e.rotulo, cor: e.cor })}
            aoCriarEtapa={() => setEtapaEmEdicao({ ...etapaVazia })}
          />
        ) : visao === "lista" ? (
          <Lista
            etapas={etapas}
            leads={etapas.flatMap((e) => visiveis[e.id] ?? [])}
            aberto={abertoId}
            aoAbrir={(l) => setAbertoId(l.id)}
            aoMoverEmMassa={moverEmMassa}
            aoExcluirEmMassa={excluirEmMassa}
            aoEditar={editar}
            ajustes={ajustesDaLista}
          />
        ) : (
          // Calendário: os leads pela próxima ação; clicar abre o mesmo drawer.
          <div className={cn("min-w-0 min-h-0 flex-1 overflow-y-auto pl-4 pr-4 pb-4 lg:pl-1", rolagemDiscreta)}>
            <Calendario
              locale="pt-BR"
              eventos={todos.filter((l) => l.proximaAcao).map((l) => ({ id: l.id, data: l.proximaAcao, rotulo: l.nome, detalhe: l.empresa, tom: l.tom }))}
              referencia={referencia}
              aoMudarReferencia={setReferencia}
              visao={visaoDoCalendario}
              aoMudarVisao={setVisaoDoCalendario}
              aoAbrir={(e) => setAbertoId(e.id)}
            />
          </div>
        )}
      <Drawer aberto={Boolean(aberto)} aoFechar={() => setAbertoId(null)} rotulo={`Lead ${aberto?.nome ?? ""}`}>
        {aberto ? (
          <PainelLead
            etapas={etapas}
            lead={aberto}
            aoFechar={() => setAbertoId(null)}
            aoMudarEtapa={(etapa) => {
              if (etapa !== aberto.etapa) mover(aberto.id, etapa, 0);
            }}
            aoEditar={(campos) => editar(aberto.id, campos)}
            aoTrocarTags={(ids) => editar(aberto.id, { tags: ids })}
          />
        ) : null}
      </Drawer>

      <Modal
        aberto={Boolean(novo)}
        aoFechar={() => {
          setNovo(null);
          setErroNome(undefined);
        }}
        titulo="Novo lead"
        descricao="O cartão entra no topo da etapa escolhida."
        size="sm"
        acoes={
          <>
            <Button size="sm" variant="secondary" onClick={() => setNovo(null)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={criarLead}>Criar lead</Button>
          </>
        }
      >
        {novo ? (
          <div className="flex flex-col gap-4">
            <Input
              rotulo="Nome"
              value={novo.nome}
              erro={erroNome}
              placeholder="Nome de quem entrou no funil"
              onChange={(e) => {
                setErroNome(undefined);
                setNovo({ ...novo, nome: e.target.value });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") criarLead();
              }}
            />
            <Input
              rotulo="Empresa"
              value={novo.empresa}
              placeholder="Onde a pessoa trabalha"
              onChange={(e) => setNovo({ ...novo, empresa: e.target.value })}
            />
            <Input
              rotulo="Valor"
              value={novo.valor}
              inputMode="numeric"
              placeholder="R$ 0"
              onChange={(e) => setNovo({ ...novo, valor: e.target.value })}
            />
            <Select
              size="field"
              rotulo="Etapa"
              valor={novo.etapa}
              aoEscolher={(v) => setNovo({ ...novo, etapa: v as EtapaId })}
              opcoes={etapas.map((e) => ({ valor: e.id, rotulo: e.rotulo }))}
            />
            <Select
              size="field"
              rotulo="Atendente"
              valor={novo.atendente}
              aoEscolher={(v) => setNovo({ ...novo, atendente: v })}
              opcoes={ATENDENTES.map((a) => ({ valor: a, rotulo: a }))}
            />
            {/* grupos com cabeçalho e ícone por opção; marca é `IconeDeMarca` */}
            <Select
              size="field"
              rotulo="Origem"
              valor={novo.canal}
              aoEscolher={(v) => setNovo({ ...novo, canal: v as Canal })}
              opcoes={OPCOES_DE_ORIGEM}
            />
          </div>
        ) : null}
      </Modal>

      <Modal
        aberto={Boolean(etapaEmEdicao)}
        aoFechar={() => {
          setEtapaEmEdicao(null);
          setErroEtapa(undefined);
        }}
        titulo={etapaEmEdicao?.modo === "criar" ? "Nova etapa" : "Editar etapa"}
        descricao={
          etapaEmEdicao?.modo === "criar"
            ? "A coluna entra no fim do funil."
            : "O nome e a cor valem para o quadro e para a lista."
        }
        size="sm"
        acoes={
          <>
            {etapaEmEdicao?.modo === "editar" ? (
              <Button size="sm"
                variant="ghost"
                disabled={leadsDaEtapaEmEdicao > 0}
                title={
                  leadsDaEtapaEmEdicao > 0
                    ? `Mova os ${leadsDaEtapaEmEdicao} leads antes de excluir`
                    : "Excluir esta etapa"
                }
                onClick={excluirEtapa}
                className="mr-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                Excluir
              </Button>
            ) : null}
            <Button size="sm" variant="secondary" onClick={() => setEtapaEmEdicao(null)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={salvarEtapa}>Salvar</Button>
          </>
        }
      >
        {etapaEmEdicao ? (
          <div className="flex flex-col gap-4">
            <Input
              rotulo="Nome da etapa"
              value={etapaEmEdicao.rotulo}
              erro={erroEtapa}
              placeholder="Ex.: Reunião marcada"
              onChange={(e) => {
                setErroEtapa(undefined);
                setEtapaEmEdicao({ ...etapaEmEdicao, rotulo: e.target.value });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") salvarEtapa();
              }}
            />

            {/* As amostras são os catorze tons do DS no degrau mais claro, mais o
                neutro. Nenhuma cor nova: `data-tom` troca as variáveis. */}
            <div className="flex flex-col gap-2">
              <span className="text-label-md text-input-label">Cor da coluna</span>
              <div role="radiogroup" aria-label="Cor da coluna" className="flex flex-wrap gap-2">
                {CORES_COLUNA.map((c) => {
                  const escolhida = c.valor === etapaEmEdicao.cor;
                  return (
                    <button
                      key={c.valor}
                      type="button"
                      role="radio"
                      aria-checked={escolhida}
                      aria-label={c.rotulo}
                      title={c.rotulo}
                      data-tom={c.valor === "neutro" ? undefined : c.valor}
                      onClick={() => setEtapaEmEdicao({ ...etapaEmEdicao, cor: c.valor })}
                      className={cn(
                        "size-8 rounded-full border border-border transition-shadow",
                        `${foco}`,
                        c.valor === "neutro" ? "bg-card" : "bg-tom-anel",
                        // escolhida: contorno de 2 com respiro, como o foco (D6) — não ring com offset
                        escolhida && "outline outline-2 outline-offset-2 outline-primary",
                      )}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Toaster />
    </TelaBase>
  );
}
