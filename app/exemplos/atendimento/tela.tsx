"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChatCircleDots,
  ChatsCircle,
  ClipboardText,
  FlowArrow,
  Gear,
  House,
  Kanban,
  Lightning,
  Plus,
  Question,
  Robot,
  UserPlus,
  UsersThree,
  Star,
  Headset,
  ShareNetwork,
} from "@phosphor-icons/react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { BarraDeFiltros, contarFiltros, type CampoDeFiltro, type FiltrosAtivos } from "@/components/ui/barra-de-filtros";
import { HeaderBusca, HeaderFiltros, Notificacoes, type Notificacao } from "@/components/ui/header";
import { SidebarBrand, SidebarGrupo, SidebarItem, SidebarRodape, SidebarThemeSwitch, SidebarTopo, SidebarUser } from "@/components/ui/sidebar";
import { Drawer } from "@/components/ui/drawer";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { ICONES_DE_TAG, type IconeDeTag } from "@/components/ui/tag";
import { TelaBase } from "@/components/ui/tela-base";
import { Toaster, toast } from "@/components/ui/toast";
import { useTema } from "@/lib/tema";
import { cn } from "@/lib/utils";
import { ConversaAberta } from "./conversa";
import { CONVERSAS, EU, GRUPOS_TAGS, type Canal, type Conversa, type Mensagem, type Situacao } from "./dados";
import { IconeDoCanal, ListaDeConversas } from "./lista";
import { LeadCompleto } from "./lead-completo";
import { PainelDoLead } from "./painel";

/**
 * Atendimento — a tela que mais dói no CRM (FigJam, PASSO 1), montada só com
 * o design system. Três colunas numa superfície só, separadas por traço:
 * conversas, mensagens e o lead. A busca e os filtros ficam no Header; a
 * situação (abertas, pendentes, finalizadas) são abas da lista.
 *
 * Responde à largura: abaixo de 1280 o lead abre por cima, pelo botão do
 * cabeçalho da conversa; abaixo de 768 a tela mostra a lista OU a conversa.
 * Os dados são de exemplo (`dados.ts`) e vivem só na memória.
 */

const PRINCIPAIS = [
  { rotulo: "Início", icone: House },
  { rotulo: "Pipelines", icone: Kanban },
  { rotulo: "Leads", icone: UsersThree },
  { rotulo: "Impulso", icone: Lightning },
  { rotulo: "Automações", icone: FlowArrow },
  { rotulo: "Chat ao vivo", icone: ChatCircleDots },
  { rotulo: "Agentes de IA", icone: Robot },
];

const FAVORITOS = ["Conversas sem resposta", "Leads quentes", "Propostas da semana"];

const APOIO = [
  { rotulo: "Ajuda", icone: Question },
  { rotulo: "Configurações", icone: Gear },
];

const CANAIS: Canal[] = ["WhatsApp", "Instagram", "Site"];
const SEM_ATENDENTE = "sem-atendente";

/** Os campos que a tela deixa filtrar: cada um ativo vira um chip na barra. */
const CAMPOS_DE_FILTRO: CampoDeFiltro[] = [
  {
    id: "canal",
    rotulo: "Canal",
    icone: ShareNetwork,
    opcoes: CANAIS.map((c) => ({ valor: c, rotulo: c, icone: <IconeDoCanal canal={c} tamanho={16} /> })),
  },
  {
    id: "atendente",
    rotulo: "Atendente",
    icone: Headset,
    opcoes: [
      // a foto antes do nome, sem a pílula (ADR-069)
      ...["Esther", "Liam", "Marina"].map((a) => ({ valor: a, rotulo: a === EU ? `${a} (eu)` : a, foto: "/ds/atendente.png" })),
      { valor: SEM_ATENDENTE, rotulo: "Sem atendente" },
    ],
  },
];

const NOTIFICACOES: Notificacao[] = [
  { id: "1", icone: ChatsCircle, titulo: "Conversa sem atendente", detalhe: "Rafael Pinto escreveu pelo WhatsApp e ninguém assumiu.", quando: "agora", lida: false },
  { id: "2", icone: UserPlus, titulo: "Conversa transferida para você", detalhe: "Liam passou o atendimento de Camila Ferraz.", quando: "há 10 min", lida: false },
  { id: "3", icone: ClipboardText, titulo: "Pendente há 9 dias", detalhe: "Pedro Nakamura não respondeu à proposta.", quando: "há 2 h", lida: true },
];

const agora = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
const semAcento = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function Tela({
  aoNavegar,
  memoria = "atendimento",
  vazio = false,
}: {
  /** Só no protótipo, que junta as telas: recebe o destino clicado na navegação e devolve `true` quando troca de tela. */
  aoNavegar?: (destino: string) => boolean;
  /** Chave da memória da sidebar. No protótipo é uma só, para ela não mudar de estado entre as telas. */
  memoria?: string;
  /** A variação sem nada: nenhuma conversa chegou ainda (ADR-077). */
  vazio?: boolean;
} = {}) {
  const { tema, mudar } = useTema();
  const [rota, setRota] = React.useState("Chat ao vivo");
  const [conversas, setConversas] = React.useState<Conversa[]>(vazio ? [] : CONVERSAS);
  const [abertaId, setAbertaId] = React.useState<string | null>(vazio ? null : "c1");
  const [aba, setAba] = React.useState<Situacao>("aberta");
  const [busca, setBusca] = React.useState("");
  const [filtro, setFiltro] = React.useState<FiltrosAtivos>({});
  const [filtros, setFiltros] = React.useState(false);
  // O catálogo de tags é estado da tela: dá para criar tag no seletor, e ela vale na coluna e no drawer.
  const [grupos, setGrupos] = React.useState(GRUPOS_TAGS);
  /** Cria a tag no catálogo e devolve o id. Na aba de listas ela leva o ícone escolhido. */
  function criarTag(rotulo: string, grupoId: string, icone: IconeDeTag = "lista") {
    const id = `${grupoId}-${Date.now()}`;
    const alvo = grupos.find((g) => g.id === grupoId);
    setGrupos((gs) => gs.map((g) => (g.id === grupoId ? { ...g, tags: [...g.tags, { id, rotulo, icone: alvo?.iconeLivre ? ICONES_DE_TAG[icone] : undefined }] } : g)));
    return id;
  }
  const [painelAberto, setPainelAberto] = React.useState(true);
  // o lead inteiro, no Drawer do design system
  const [leadCompleto, setLeadCompleto] = React.useState(false);
  // só no celular: a tela mostra a lista OU a conversa
  const [naConversa, setNaConversa] = React.useState(false);
  const [notificacoes, setNotificacoes] = React.useState(NOTIFICACOES);

  // abaixo de 1280 o lead nasce fechado: ele abre por cima da conversa
  React.useEffect(() => {
    if (window.innerWidth < 1280) setPainelAberto(false);
  }, []);

  const termo = semAcento(busca.trim());
  const canais = filtro.canal ?? [];
  const atendentes = filtro.atendente ?? [];
  const filtradas = conversas.filter(
    (c) =>
      (!canais.length || canais.includes(c.canal)) &&
      (!atendentes.length || atendentes.includes(c.atendente ?? SEM_ATENDENTE)) &&
      (!termo || [c.nome, c.empresa, c.telefone, ...c.mensagens.map((m) => m.texto)].some((t) => semAcento(t).includes(termo))),
  );
  const contagem = { aberta: 0, pendente: 0, finalizada: 0 } as Record<Situacao, number>;
  for (const c of filtradas) contagem[c.situacao]++;
  const aberta = conversas.find((c) => c.id === abertaId) ?? null;
  const quantosFiltros = contarFiltros(filtro);

  /** Muda uma conversa; com `subir`, ela vai para o topo da lista (acabou de ter movimento). */
  function mudar_(id: string, fazer: (c: Conversa) => Conversa, subir = false) {
    setConversas((lista) => {
      const nova = lista.map((c) => (c.id === id ? fazer(c) : c));
      if (!subir) return nova;
      const alvo = nova.find((c) => c.id === id);
      return alvo ? [alvo, ...nova.filter((c) => c.id !== id)] : nova;
    });
  }
  const evento = (c: Conversa, texto: string): Mensagem => ({ id: `${c.mensagens.length + 1}-${Date.now()}`, de: "sistema", texto, dia: "Hoje", hora: agora() });

  function abrir(id: string) {
    setAbertaId(id);
    setNaConversa(true);
    mudar_(id, (c) => ({ ...c, naoLidas: 0 }));
  }

  function enviar(texto: string, modo: "mensagem" | "nota") {
    if (!aberta) return;
    mudar_(
      aberta.id,
      (c) => {
        const assumiu = modo === "mensagem" && !c.atendente;
        const mensagens = assumiu ? [...c.mensagens, evento(c, `${EU} assumiu o atendimento`)] : c.mensagens;
        return {
          ...c,
          atendente: assumiu ? EU : c.atendente,
          // responder tira a conversa de pendente; nota interna não muda a situação
          situacao: modo === "mensagem" && c.situacao === "pendente" ? "aberta" : c.situacao,
          mensagens: [
            ...mensagens,
            { id: `${mensagens.length + 1}-${Date.now()}`, de: modo === "nota" ? "nota" : "atendente", texto, dia: "Hoje", hora: agora(), autor: EU, lida: false },
          ],
        };
      },
      true,
    );
  }

  function finalizar() {
    if (!aberta) return;
    mudar_(aberta.id, (c) => ({ ...c, situacao: "finalizada", mensagens: [...c.mensagens, evento(c, `${EU} finalizou o atendimento`)] }));
    toast({ variant: "success", titulo: "Atendimento finalizado", descricao: `${aberta.nome} foi para Finalizadas.` });
  }

  function reabrir() {
    if (!aberta) return;
    mudar_(aberta.id, (c) => ({ ...c, situacao: "aberta", atendente: c.atendente ?? EU, mensagens: [...c.mensagens, evento(c, `${EU} reabriu o atendimento`)] }), true);
    setAba("aberta");
  }

  function assumir() {
    if (!aberta) return;
    mudar_(aberta.id, (c) => ({ ...c, atendente: EU, mensagens: [...c.mensagens, evento(c, `${EU} assumiu o atendimento`)] }));
  }

  function transferir(para: string) {
    if (!aberta) return;
    mudar_(aberta.id, (c) => ({ ...c, atendente: para, mensagens: [...c.mensagens, evento(c, `${EU} transferiu para ${para}`)] }));
    toast({ variant: "info", titulo: "Conversa transferida", descricao: `${aberta.nome} agora está com ${para}.` });
  }

  return (
    <TelaBase
      memoria={memoria}
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
              {/* A tela é uma demonstração: a porta de volta para a biblioteca. */}
              <SidebarItem icone={ArrowLeft} componente={Link} href="/">
                Voltar ao design system
              </SidebarItem>
            </SidebarGrupo>
            <SidebarUser nome="Esther Lima" email="esther@datacrazy.com" />
          </SidebarRodape>
        </>
      }
      cabecalho={{
        titulo: "Atendimento",
        trilha: (
          <Breadcrumb ancestrais rotulo="Trilha" rotuloRecolhidos={(n) => `Mostrar mais ${n} níveis`} itens={[{ rotulo: "Início" }]} />
        ),
        utilitarios: (
          <Notificacoes
            itens={notificacoes}
            aoMarcarLida={(id) => setNotificacoes((l) => l.map((n) => (n.id === id ? { ...n, lida: true } : n)))}
            aoMarcarTodas={() => setNotificacoes((l) => l.map((n) => ({ ...n, lida: true })))}
          />
        ),
        // Fileira só com busca, filtros e a ação: busca aberta, filtros com rótulo, sem divisor (regra do Header).
        // No celular, com a conversa aberta, busca, filtros e a ação saem: a tela é a conversa.
        acoes: (
          <div className={naConversa ? "hidden md:contents" : "contents"}>
            <HeaderBusca rotulo="Pesquisar conversas" placeholder="Pesquisar" value={busca} onChange={(e) => setBusca(e.target.value)} />
            <HeaderFiltros rotulo="Filtros" contagem={quantosFiltros} rotuloComContagem={(n) => `Filtros: ${n} ativos`} aria-expanded={filtros} onClick={() => setFiltros((v) => !v)} />
            <Button onClick={() => toast({ variant: "info", titulo: "Nova conversa", descricao: "No CRM: escolhe o contato e a conexão de saída." })}>
              <Plus size={16} weight="regular" />
              Nova conversa
            </Button>
          </div>
        ),
      }}
    >
      {/* Filtros em chips, numa faixa do painel: valem para as três abas, na hora. */}
      {filtros ? (
        <BarraDeFiltros
          abrirAoMontar
          role="group"
          aria-label="Filtros"
          className="shrink-0 border-b border-border bg-card px-3 py-2"
          campos={CAMPOS_DE_FILTRO}
          valor={filtro}
          aoMudar={setFiltro}
          rotulos={{ adicionar: "Filtro", limpar: "Limpar", busca: "Buscar", vazio: "Nada encontrado", remover: (campo) => `Remover filtro ${campo}` }}
        />
      ) : null}
      {/* O padrão de fundo de toda tela: o conteúdo sobre o cinza claro e cada coluna num bloco branco com traço.
          No celular a coluna ocupa a tela, sem margem. */}
      <div className="flex min-h-0 flex-1 md:p-3">
        <div className="relative flex min-h-0 min-w-0 flex-1 md:gap-3">
          <ListaDeConversas
            conversas={filtradas.filter((c) => c.situacao === aba)}
            aba={aba}
            aoMudarAba={setAba}
            contagem={contagem}
            abertaId={abertaId}
            aoAbrir={abrir}
            className={cn("w-full shrink-0 md:w-[320px]", naConversa && "hidden md:flex")}
          />
          {aberta ? (
            <ConversaAberta
              conversa={aberta}
              aoEnviar={enviar}
              aoFinalizar={finalizar}
              aoReabrir={reabrir}
              aoAssumir={assumir}
              aoTransferir={transferir}
              painelAberto={painelAberto}
              aoAlternarPainel={() => setPainelAberto((a) => !a)}
              aoVoltar={() => setNaConversa(false)}
              className={cn(!naConversa && "hidden md:flex")}
            />
          ) : (
            // a coluna do meio sem conversa aberta: com ícone, porque a área inteira está vazia (ADR-077)
            <EstadoVazio
              icone={ChatCircleDots}
              titulo={conversas.length === 0 ? "Nenhuma conversa ainda" : "Escolha uma conversa na lista"}
              descricao={conversas.length === 0 ? "As mensagens dos canais conectados — WhatsApp, Instagram, site — chegam aqui." : "A conversa abre aqui; o lead, ao lado."}
              className="hidden flex-1 md:flex"
            />
          )}
          {aberta && painelAberto ? (
            <PainelDoLead
              conversa={aberta}
              grupos={grupos}
              aoCriarTag={criarTag}
              aoEditar={(campos) => mudar_(aberta.id, (c) => ({ ...c, ...campos }))}
              aoAbrirCompleto={() => setLeadCompleto(true)}
              aoFechar={() => setPainelAberto(false)}
              // abaixo de 1280 abre por cima da conversa; acima, é a terceira coluna
              className="absolute inset-y-0 right-0 z-dropdown w-[320px] max-w-full shadow-lg xl:static xl:z-auto xl:shadow-none"
            />
          ) : null}
        </div>
      </div>

      {/* O lead inteiro abre no Drawer do design system — o mesmo da página do Drawer. */}
      <Drawer aberto={Boolean(aberta) && leadCompleto} aoFechar={() => setLeadCompleto(false)} rotulo={`Lead ${aberta?.nome ?? ""}`}>
        {aberta ? (
          <LeadCompleto conversa={aberta} grupos={grupos} aoCriarTag={criarTag} aoEditar={(campos) => mudar_(aberta.id, (c) => ({ ...c, ...campos }))} aoFechar={() => setLeadCompleto(false)} />
        ) : null}
      </Drawer>
      <Toaster />
    </TelaBase>
  );
}
