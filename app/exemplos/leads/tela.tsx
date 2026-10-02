"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Buildings,
  CalendarBlank,
  ChatCircleDots,
  EnvelopeSimple,
  FlowArrow,
  Gear,
  Globe,
  Handshake,
  House,
  IdentificationCard,
  Kanban,
  Lightning,
  Phone,
  Plus,
  Question,
  Robot,
  ShareNetwork,
  Star,
  Tag as IconeDeTag,
  User,
  UserPlus,
  UsersThree,
} from "@phosphor-icons/react";
import { BarraDeFiltros, contarFiltros, type CampoDeFiltro, type FiltrosAtivos } from "@/components/ui/barra-de-filtros";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ComboboxPainel } from "@/components/ui/combobox";
import {
  BarraDeSelecao,
  BotaoAgrupar,
  BotaoColunas,
  CelulaEscolha,
  CelulaLead,
  CelulaTags,
  DataTable,
  DataTableCell,
  DataTableGrupo,
  DataTableRow,
  DataTableToolbar,
  agruparPor,
  ordenarPor,
  useAjustesDaTabela,
  useSelecaoDaTabela,
  type ColunaTabela,
} from "@/components/ui/data-table";
import { Drawer } from "@/components/ui/drawer";
import { HeaderBusca, HeaderFiltros, Notificacoes, type Notificacao } from "@/components/ui/header";
import { IconeDeMarca } from "@/components/ui/icone-de-marca";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { SidebarBrand, SidebarGrupo, SidebarItem, SidebarRodape, SidebarThemeSwitch, SidebarTopo, SidebarUser } from "@/components/ui/sidebar";
import { SeletorDeTom, Tag } from "@/components/ui/tag";
import { TelaBase } from "@/components/ui/tela-base";
import { Toaster, toast } from "@/components/ui/toast";
import { rotuloDeCampo } from "@/lib/campo";
import { rolagemDiscreta } from "@/lib/estados";
import { useTema } from "@/lib/tema";
import type { Tom } from "@/lib/tons";
import { cn } from "@/lib/utils";
import { LEADS, NOMES_DAS_CORES, ORIGENS, TAGS, dataCurta, etiquetaDe, tagsDe, type Lead, type Origem, type TagDaConta } from "./dados";
import { PainelLead } from "./painel-lead";

/* ---------------------------------------------------------------------------
   Tela de exemplo — NÃO é componente do design system.

   A lista de contatos do CRM, só com peças do DS. É a tela de referência para
   LISTA DE REGISTROS: grade densa com ícone por coluna, a pessoa com as
   iniciais coloridas, tags e origem editadas na própria célula, filtros em
   chips, agrupar, seleção em massa e o lead aberto no Drawer. Criar tag é
   um modal curto com as quinze cores do DS.
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

const FAVORITOS = ["Pipeline comercial", "Leads quentes", "Propostas da semana"];

const APOIO = [
  { rotulo: "Ajuda", icone: Question },
  { rotulo: "Configurações", icone: Gear },
];

const NOTIFICACOES: Notificacao[] = [
  { id: "1", icone: UserPlus, titulo: "Novo lead pelo site", detalhe: "Vinícius Araújo preencheu o formulário de contato.", quando: "agora", lida: false },
  { id: "2", icone: IconeDeTag, titulo: "Tag aplicada em massa", detalhe: "12 leads receberam a tag Carrinho abandonado.", quando: "há 3 h", lida: true },
];

/* `minimo` é o piso de cada coluna: abaixo da soma deles a lista rola na
   horizontal em vez de cortar tudo em reticências. */
const COLUNAS: ColunaTabela[] = [
  { chave: "nome", rotulo: "Nome", icone: User, peso: 2.2, minimo: 190 },
  { chave: "telefone", rotulo: "Telefone", icone: Phone, peso: 1.4, minimo: 130 },
  { chave: "email", rotulo: "E-mail", icone: EnvelopeSimple, peso: 2, minimo: 170 },
  { chave: "empresa", rotulo: "Empresa", icone: Buildings, peso: 1.7, minimo: 140 },
  { chave: "documento", rotulo: "Documento", icone: IdentificationCard, peso: 1.5, minimo: 132 },
  { chave: "tags", rotulo: "Tags", icone: IconeDeTag, peso: 2.4, minimo: 190 },
  { chave: "origem", rotulo: "Origem", icone: ShareNetwork, peso: 1.2, minimo: 120, agrupavel: true },
  { chave: "criado", rotulo: "Criado em", icone: CalendarBlank, peso: 1.3, minimo: 116 },
];

/** O ícone de cada origem. Marca é `IconeDeMarca`, na cor da marca; o que não é marca é Phosphor. */
function IconeDaOrigem({ origem, tamanho = 14 }: { origem: Origem; tamanho?: 14 | 16 }) {
  if (origem === "Instagram") return <IconeDeMarca marca="instagram" tamanho={tamanho} />;
  if (origem === "WhatsApp") return <IconeDeMarca marca="whatsapp" tamanho={tamanho} />;
  if (origem === "Google") return <IconeDeMarca marca="google" tamanho={tamanho} />;
  if (origem === "Meta") return <IconeDeMarca marca="meta" tamanho={tamanho} />;
  if (origem === "LinkedIn") return <IconeDeMarca marca="linkedin" tamanho={tamanho} />;
  const Glifo = origem === "Site" ? Globe : Handshake;
  return <Glifo size={tamanho} weight="regular" aria-hidden="true" className="shrink-0 text-muted-foreground" />;
}

/** As origens como opções: dois grupos com cabeçalho e ícone por item. Servem à célula, ao filtro e ao "Novo lead". */
const OPCOES_DE_ORIGEM = ORIGENS.map((o) => ({
  valor: o.valor,
  rotulo: o.valor,
  grupo: o.grupo,
  icone: <IconeDaOrigem origem={o.valor} tamanho={16} />,
}));

/** Quando o lead entrou, em faixas — filtro de um valor só. */
const PERIODOS: { id: string; rotulo: string; vale: (l: Lead) => boolean }[] = [
  { id: "2026", rotulo: "Em 2026", vale: (l) => l.criadoEm >= "2026-01-01" },
  { id: "2025", rotulo: "Em 2025", vale: (l) => l.criadoEm < "2026-01-01" },
];

/* Buscar "olivia" tem que achar "Olívia": quem digita rápido não põe acento. */
function semAcento(texto: string) {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase();
}

/* O que cada coluna lê do lead, para ordenar. */
function valorDe(lead: Lead, chave: string): string | number {
  switch (chave) {
    case "nome": return lead.nome;
    case "telefone": return lead.telefone;
    case "email": return lead.email;
    case "empresa": return lead.empresa;
    case "documento": return lead.documento;
    case "tags": return lead.tags.length;
    case "origem": return lead.origem;
    case "criado": return lead.criadoEm;
    default: return "";
  }
}

const tagVazia = { nome: "", descricao: "", tom: "azul" as Tom | null };
const leadVazio = { nome: "", telefone: "", email: "", origem: "WhatsApp" as Origem };

/** Sem valor na célula: um traço apagado, não um buraco. */
function Vazio() {
  return <span className="text-label-lg text-subtle-foreground">—</span>;
}

export function Tela({
  aoNavegar,
  memoria = "leads",
}: {
  /** Só no protótipo, que junta as telas: recebe o destino clicado na navegação e devolve `true` quando troca de tela. */
  aoNavegar?: (destino: string) => boolean;
  /** Chave da memória da sidebar. No protótipo é uma só, para ela não mudar de estado entre as telas. */
  memoria?: string;
} = {}) {
  const [rota, setRota] = React.useState("Leads");
  const [leads, setLeads] = React.useState(LEADS);
  const [tags, setTags] = React.useState(TAGS);
  const [busca, setBusca] = React.useState("");
  const [filtro, setFiltro] = React.useState<FiltrosAtivos>({});
  const [filtros, setFiltros] = React.useState(false);
  const [abertoId, setAbertoId] = React.useState<string | null>(null);
  const [novaTag, setNovaTag] = React.useState<typeof tagVazia | null>(null);
  const [erroTag, setErroTag] = React.useState<string | undefined>();
  const [novoLead, setNovoLead] = React.useState<typeof leadVazio | null>(null);
  const [erroLead, setErroLead] = React.useState<string | undefined>();
  const [menuTags, setMenuTags] = React.useState(false);
  const botaoTags = React.useRef<HTMLButtonElement>(null);
  const [notificacoes, setNotificacoes] = React.useState(NOTIFICACOES);
  const { tema, mudar } = useTema();
  // Ordem, colunas à vista e grupo ficam lembrados no navegador; os botões estão no Header.
  const ajustes = useAjustesDaTabela(COLUNAS, { memoria: "leads" });
  // Seleção em massa: a tela guarda os ids; a tabela desenha as caixas.
  const selecao = useSelecaoDaTabela();

  /** O catálogo de tags como opções: cada uma como a Tag que vai aparecer. */
  const opcoesDeTag = tags.map((t) => {
    const e = etiquetaDe(t);
    return {
      valor: t.id,
      rotulo: t.rotulo,
      conteudo: (
<Tag tom={e.tom}>{t.rotulo}</Tag>
      ),
    };
  });

  const campos: CampoDeFiltro[] = [
    { id: "origens", rotulo: "Origem", icone: ShareNetwork, opcoes: OPCOES_DE_ORIGEM },
    { id: "tags", rotulo: "Tags", icone: IconeDeTag, opcoes: opcoesDeTag },
    { id: "periodo", rotulo: "Criado em", icone: CalendarBlank, unico: true, opcoes: PERIODOS.map((p) => ({ valor: p.id, rotulo: p.rotulo })) },
  ];

  /* Dentro do mesmo campo soma (ou), entre campos corta (e). */
  const visiveis = leads.filter((l) => {
    const de = (campo: string) => filtro[campo] ?? [];
    if (de("origens").length && !de("origens").includes(l.origem)) return false;
    if (de("tags").length && !de("tags").some((t) => l.tags.includes(t))) return false;
    if (de("periodo").length && !PERIODOS.some((p) => de("periodo").includes(p.id) && p.vale(l))) return false;
    const termo = semAcento(busca);
    if (!termo) return true;
    return semAcento([l.nome, l.email, l.telefone, l.empresa, l.documento].join(" ")).includes(termo);
  });
  const linhas = ordenarPor(visiveis, ajustes.ordem, valorDe);
  const grupos = ajustes.grupo ? agruparPor(linhas, (l) => ({ id: l.origem, rotulo: l.origem }), ORIGENS.map((o) => o.valor)) : null;
  const aberto = leads.find((l) => l.id === abertoId) ?? null;

  const editar = (id: string, campos: Partial<Lead>) => setLeads((lista) => lista.map((l) => (l.id === id ? { ...l, ...campos } : l)));
  const fechar = () => setAbertoId(null);

  function criarTag() {
    if (!novaTag) return;
    const nome = novaTag.nome.trim();
    if (!nome) return setErroTag("Dê um nome para a tag");
    if (tags.some((t) => semAcento(t.rotulo) === semAcento(nome))) return setErroTag("Já existe uma tag com esse nome");
    setTags((lista) => [...lista, { id: `tag-${Date.now()}`, rotulo: nome, descricao: novaTag.descricao.trim() || undefined, tom: novaTag.tom }]);
    setNovaTag(null);
    setErroTag(undefined);
    toast({ variant: "success", titulo: "Tag criada", descricao: `${nome} já aparece na coluna Tags e nos filtros.` });
  }

  function criarLead() {
    if (!novoLead) return;
    const nome = novoLead.nome.trim();
    if (!nome) return setErroLead("Informe o nome do lead");
    const id = `l-${Date.now()}`;
    setLeads((lista) => [
      { id, nome, telefone: novoLead.telefone.trim(), email: novoLead.email.trim(), empresa: "", documento: "", tags: [], origem: novoLead.origem, criadoEm: "2026-04-02" },
      ...lista,
    ]);
    setNovoLead(null);
    setErroLead(undefined);
    toast({ variant: "success", titulo: "Lead criado", descricao: `${nome} entrou no topo da lista.` });
  }

  const linha = (lead: Lead) => {
    const doLead = tagsDe(tags, lead.tags);
    return (
      // Selecionar a linha abre o lead no Drawer.
      <DataTableRow key={lead.id} chave={lead.id} nome={lead.nome} selecionada={lead.id === abertoId} aoSelecionar={() => setAbertoId(lead.id)}>
        <DataTableCell coluna="nome">
          {/* O nome é o botão que abre o lead; as iniciais vêm na cor que o nome sorteia. */}
          <CelulaLead nome={lead.nome} avatar aoAbrir={() => setAbertoId(lead.id)} />
        </DataTableCell>
        <DataTableCell coluna="telefone">
          <span className="block truncate text-label-lg tabular-nums text-foreground">{lead.telefone || <Vazio />}</span>
        </DataTableCell>
        <DataTableCell coluna="email">
          <span title={lead.email} className="block truncate text-label-lg text-foreground">
            {lead.email || <Vazio />}
          </span>
        </DataTableCell>
        <DataTableCell coluna="empresa">
          <span title={lead.empresa} className="block truncate text-label-lg text-foreground">
            {lead.empresa || <Vazio />}
          </span>
        </DataTableCell>
        <DataTableCell coluna="documento">
          <span className="block truncate text-label-lg tabular-nums text-foreground">{lead.documento || <Vazio />}</span>
        </DataTableCell>
        <DataTableCell coluna="tags">
          {/* Edita no lugar: o clique abre a lista com busca e caixa de marcar, sem modal. */}
          <CelulaEscolha
            multiplo
            rotulo={`Editar tags de ${lead.nome}`}
            opcoes={opcoesDeTag}
            selecionados={lead.tags}
            aoAlternar={(id) => editar(lead.id, { tags: lead.tags.includes(id) ? lead.tags.filter((t) => t !== id) : [...lead.tags, id] })}
            rotulos={{ busca: "Buscar tag", vazio: "Nenhuma tag encontrada" }}
          >
            {doLead.length ? <CelulaTags etiquetas={doLead.map(etiquetaDe)} /> : <Vazio />}
          </CelulaEscolha>
        </DataTableCell>
        <DataTableCell coluna="origem">
          {/* A origem troca na célula: lista em dois grupos, com o ícone de cada uma. */}
          <CelulaEscolha
            rotulo={`Mudar origem de ${lead.nome}`}
            opcoes={OPCOES_DE_ORIGEM}
            selecionados={[lead.origem]}
            aoAlternar={(v) => editar(lead.id, { origem: v as Origem })}
            rotulos={{ busca: "Buscar origem", vazio: "Nenhuma origem encontrada" }}
          >
            <span className="flex min-w-0 items-center gap-1.5 text-label-lg text-foreground">
              <IconeDaOrigem origem={lead.origem} />
              <span className="min-w-0 truncate">{lead.origem}</span>
            </span>
          </CelulaEscolha>
        </DataTableCell>
        <DataTableCell coluna="criado">
          <span className="block truncate text-label-lg tabular-nums text-muted-foreground">{dataCurta(lead.criadoEm)}</span>
        </DataTableCell>
      </DataTableRow>
    );
  };

  return (
    <>
      <TelaBase
        memoria={memoria}
        // a lista encosta nas bordas do painel: é a própria superfície, não um cartão dentro dela
        recuo={false}
        navegacao={
          <>
            <SidebarTopo>
              <SidebarBrand />
              <SidebarGrupo>
                {PRINCIPAIS.map((r) => (
                  <SidebarItem
                  key={r.rotulo}
                  icone={r.icone}
                  componente="button"
                  selecionado={r.rotulo === rota}
                  onClick={() => {
                    if (!aoNavegar?.(r.rotulo)) setRota(r.rotulo);
                  }}
                >
                    {r.rotulo}
                  </SidebarItem>
                ))}
              </SidebarGrupo>
              {/* Favoritos: atalhos que a pessoa fixou. Recolhida, o grupo some — estrela sem rótulo não diz nada. */}
              <SidebarGrupo rotulo="Favoritos" ocultarRecolhida>
                {FAVORITOS.map((f) => (
                  <SidebarItem key={f} icone={Star} componente="button" selecionado={f === rota} onClick={() => setRota(f)}>
                    {f}
                  </SidebarItem>
                ))}
              </SidebarGrupo>
            </SidebarTopo>
            <SidebarRodape>
              <SidebarGrupo>
                <li>
                  <SidebarThemeSwitch tema={tema} onTemaChange={mudar} />
                </li>
                {APOIO.map((r) => (
                  <SidebarItem key={r.rotulo} icone={r.icone} componente="button" selecionado={r.rotulo === rota} onClick={() => setRota(r.rotulo)}>
                    {r.rotulo}
                  </SidebarItem>
                ))}
                <SidebarItem icone={ArrowLeft} componente={Link} href="/">
                  Voltar ao design system
                </SidebarItem>
              </SidebarGrupo>
              <SidebarUser
                nome="Gabriel Correa"
                email="gece@datacrazy.com"
                onClick={() => toast({ variant: "info", titulo: "Menu do usuário", descricao: "No CRM: perfil, preferências e sair." })}
              />
            </SidebarRodape>
          </>
        }
        cabecalho={{
          titulo: "Leads",
          trilha: (
            <Breadcrumb
              ancestrais
              rotulo="Trilha de navegação"
              rotuloRecolhidos={(n) => `Mostrar ${n} níveis ocultos`}
              itens={[{ rotulo: "Início" }]}
            />
          ),
          utilitarios: (
            <Notificacoes
              itens={notificacoes}
              aoMarcarLida={(id) => setNotificacoes((l) => l.map((n) => (n.id === id ? { ...n, lida: true } : n)))}
              aoMarcarTodas={() => setNotificacoes((l) => l.map((n) => ({ ...n, lida: true })))}
            />
          ),
          acoes: (
            <>
              {/* A fileira só tem botões: busca aberta e filtros com rótulo (regra da HeaderBusca). */}
              <HeaderBusca rotulo="Pesquisar leads" placeholder="Pesquisar leads" value={busca} onChange={(e) => setBusca(e.target.value)} />
              <HeaderFiltros
                rotulo="Filtros"
                contagem={contarFiltros(filtro)}
                rotuloComContagem={(n) => `Filtros: ${n} ativos`}
                aria-expanded={filtros}
                onClick={() => setFiltros((v) => !v)}
              />
              <BotaoAgrupar ajustes={ajustes} recolhido />
              <BotaoColunas ajustes={ajustes} recolhido />
              <Button variant="tertiary" onClick={() => setNovaTag({ ...tagVazia })}>
                <IconeDeTag size={16} weight="regular" />
                Nova tag
              </Button>
              <Button onClick={() => setNovoLead({ ...leadVazio })}>
                <Plus size={16} weight="regular" />
                Novo lead
              </Button>
            </>
          ),
        }}
      >
        {/* Os filtros em chips: só o que está ativo ocupa espaço, e cada campo abre a própria lista com busca. */}
        {filtros ? (
          <BarraDeFiltros
            abrirAoMontar
            aria-label="Filtros"
            role="group"
            // uma faixa do painel, como o Header: recuo 12 e traço embaixo
            className="shrink-0 border-b border-border px-3 py-2"
            campos={campos}
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

        <div className={cn("min-h-0 flex-1 overflow-y-auto", rolagemDiscreta)}>
          <DataTableToolbar rotulo="Todos os leads" total={`${visiveis.length} ${visiveis.length === 1 ? "lead" : "leads"}`} />
          <DataTable colunas={COLUNAS} ajustes={ajustes} selecao={selecao} className="rounded-none border-0">
            {grupos
              ? grupos.map((g) => (
                  <React.Fragment key={g.id}>
                    <DataTableGrupo
                      rotulo={g.rotulo}
                      quantidade={g.itens.length}
                      aberto={!ajustes.recolhidos.includes(g.id)}
                      aoAlternar={() => ajustes.alternarGrupo(g.id)}
                    />
                    {ajustes.recolhidos.includes(g.id) ? null : g.itens.map(linha)}
                  </React.Fragment>
                ))
              : linhas.map(linha)}
          </DataTable>
          {visiveis.length === 0 ? (
            <p className="px-3 py-6 text-center text-body-md text-muted-foreground">Nenhum lead com essa busca e esses filtros.</p>
          ) : null}
          {/* A barra sobe quando há linha marcada: aplicar tag em todas, ou excluir. */}
          <BarraDeSelecao selecao={selecao}>
            <Button ref={botaoTags} variant="tertiary" size="sm" aria-haspopup="dialog" aria-expanded={menuTags} onClick={() => setMenuTags((a) => !a)}>
              Aplicar tag
            </Button>
            {/* a lista de tags mostra cada uma como ela aparece na coluna — não é menu de texto */}
            <ComboboxPainel
              aberto={menuTags}
              gatilho={botaoTags}
              rotulo="Aplicar tag"
              opcoes={opcoesDeTag}
              selecionados={[]}
              aoAlternar={(id) => {
                setLeads((lista) => lista.map((l) => (selecao.selecionados.includes(l.id) && !l.tags.includes(id) ? { ...l, tags: [...l.tags, id] } : l)));
                selecao.limpar();
              }}
              rotulos={{ busca: "Buscar tag", vazio: "Nenhuma tag encontrada" }}
              aoFechar={(devolver = true) => {
                setMenuTags(false);
                if (devolver) botaoTags.current?.focus();
              }}
            />
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setLeads((lista) => lista.filter((l) => !selecao.selecionados.includes(l.id)));
                if (abertoId && selecao.selecionados.includes(abertoId)) fechar();
                selecao.limpar();
              }}
            >
              Excluir
            </Button>
          </BarraDeSelecao>
        </div>
      </TelaBase>

      {/* O lead abre no Drawer do design system — o mesmo da página do Drawer, com o lead clicado na lista. */}
      <Drawer aberto={Boolean(aberto)} aoFechar={fechar} rotulo={`Lead ${aberto?.nome ?? ""}`}>
        {aberto ? (
          <PainelLead
            lead={aberto}
            tags={tags}
            opcoesDeOrigem={OPCOES_DE_ORIGEM}
            aoFechar={fechar}
            aoEditar={(campos) => editar(aberto.id, campos)}
            aoCriarTag={(rotulo, tom) => {
              const id = `tag-${Date.now()}`;
              setTags((lista) => [...lista, { id, rotulo, tom }]);
              return id;
            }}
          />
        ) : null}
      </Drawer>

      {/* Criar tag: nome, descrição e uma das quinze cores. Modal curto — é decisão de poucos campos. */}
      <Modal
        aberto={Boolean(novaTag)}
        aoFechar={() => {
          setNovaTag(null);
          setErroTag(undefined);
        }}
        titulo="Nova tag"
        descricao="Crie uma tag para organizar seus leads."
        size="sm"
        acoes={
          <>
            <Button size="sm" variant="secondary" onClick={() => setNovaTag(null)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={criarTag}>
              Criar tag
            </Button>
          </>
        }
      >
        {novaTag ? (
          <div className="flex flex-col gap-4">
            <Input
              rotulo="Nome"
              value={novaTag.nome}
              erro={erroTag}
              placeholder="Ex.: Cliente VIP"
              onChange={(e) => {
                setErroTag(undefined);
                setNovaTag({ ...novaTag, nome: e.target.value });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") criarTag();
              }}
            />
            <Input
              rotulo="Descrição"
              value={novaTag.descricao}
              placeholder="Quando usar esta tag"
              onChange={(e) => setNovaTag({ ...novaTag, descricao: e.target.value })}
            />
            <div className="flex flex-col gap-2">
              <p aria-hidden="true" className={rotuloDeCampo()}>
                Cor
              </p>
              <SeletorDeTom
                tamanho="md"
                comNeutro
                rotulo="Cor da tag"
                nomes={NOMES_DAS_CORES}
                valor={novaTag.tom}
                aoEscolher={(tom) => setNovaTag({ ...novaTag, tom })}
              />
              {/* prévia: a tag sai daqui exatamente assim */}
              <div className="flex min-h-[22px] items-center gap-2 text-caption text-muted-foreground">
                Como fica:
<Tag tom={novaTag.tom ?? undefined}>{novaTag.nome.trim() || "Nome da tag"}</Tag>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        aberto={Boolean(novoLead)}
        aoFechar={() => {
          setNovoLead(null);
          setErroLead(undefined);
        }}
        titulo="Novo lead"
        descricao="O contato entra no topo da lista."
        size="sm"
        acoes={
          <>
            <Button size="sm" variant="secondary" onClick={() => setNovoLead(null)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={criarLead}>
              Criar lead
            </Button>
          </>
        }
      >
        {novoLead ? (
          <div className="flex flex-col gap-4">
            <Input
              rotulo="Nome"
              value={novoLead.nome}
              erro={erroLead}
              placeholder="Nome de quem entrou em contato"
              onChange={(e) => {
                setErroLead(undefined);
                setNovoLead({ ...novoLead, nome: e.target.value });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") criarLead();
              }}
            />
            <Input
              rotulo="Telefone"
              value={novoLead.telefone}
              inputMode="tel"
              placeholder="(00) 00000-0000"
              onChange={(e) => setNovoLead({ ...novoLead, telefone: e.target.value })}
            />
            <Input
              rotulo="E-mail"
              value={novoLead.email}
              inputMode="email"
              placeholder="nome@empresa.com"
              onChange={(e) => setNovoLead({ ...novoLead, email: e.target.value })}
            />
            {/* grupos com cabeçalho e ícone por opção; marca é `IconeDeMarca` */}
            <Select
              size="field"
              rotulo="Origem"
              valor={novoLead.origem}
              aoEscolher={(v) => setNovoLead({ ...novoLead, origem: v as Origem })}
              opcoes={OPCOES_DE_ORIGEM}
            />
          </div>
        ) : null}
      </Modal>
      <Toaster />
    </>
  );
}
