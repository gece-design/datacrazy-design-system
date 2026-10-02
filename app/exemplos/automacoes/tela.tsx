"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChatCircleDots,
  DotsThree,
  FlowArrow,
  Gear,
  House,
  Kanban,
  Lightning,
  Plus,
  Question,
  Robot,
  Star,
  UsersThree,
} from "@phosphor-icons/react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ComboboxPainel } from "@/components/ui/combobox";
import { HeaderDivisor, Notificacoes, type Notificacao } from "@/components/ui/header";
import { Menu } from "@/components/ui/menu";
import { SidebarBrand, SidebarGrupo, SidebarItem, SidebarRodape, SidebarThemeSwitch, SidebarTopo, SidebarUser } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { TelaBase } from "@/components/ui/tela-base";
import { Toaster, toast } from "@/components/ui/toast";
import { useTema } from "@/lib/tema";
import { Canvas, ICONES_DOS_BLOCOS, type CanvasRef, type RotulosDoCanvas } from "./canvas";
import { AUTOMACAO, LARGURA_DO_BLOCO, TIPOS, saidasDe, type Bloco, type TipoDeBloco } from "./dados";
import { PainelDoBloco } from "./painel-bloco";

/* ---------------------------------------------------------------------------
   Tela de exemplo — NÃO é componente do design system.

   O construtor de automações do CRM: os blocos do fluxo num canvas, ligados
   por conectores, e o bloco aberto num painel ao lado. A tela de hoje abre
   cada bloco por cima do fluxo; aqui o fluxo continua à vista enquanto a
   pessoa edita, e clicar em outro bloco troca o painel sem fechar nada.

   Peças do DS: TelaBase, Header de uma linha, PainelLateral, Input, Textarea,
   Select, ComboboxPainel, Menu, Switch, Button, IconeDeMarca. O canvas é o
   arranjo desta tela (./canvas), como o quadro é o do pipeline.

   Quem guarda o fluxo é esta tela: o canvas só pede (mover, ligar, adicionar,
   remover) e ela aplica — por isso o desfazer mora aqui, num histórico só.
--------------------------------------------------------------------------- */

/** Tudo o que o canvas escreve. No CRM, vem do next-intl. */
const ROTULOS_DO_CANVAS: RotulosDoCanvas = {
  canvas: "Fluxo da automação",
  aproximar: "Aproximar (+)",
  afastar: "Afastar (−)",
  ajustar: "Ver o fluxo inteiro (1)",
  organizar: "Organizar os blocos",
  desfazer: "Desfazer (Ctrl ou ⌘ + Z)",
  refazer: "Refazer (Ctrl ou ⌘ + Shift + Z)",
  mapa: "Mapa do fluxo",
  ajuda: "Gestos e atalhos",
  sucessos: "Sucessos",
  alertas: "Alertas",
  erros: "Erros",
  adicionarBloco: "Adicionar bloco",
  buscarBloco: "Buscar bloco",
  nenhumBloco: "Nenhum bloco encontrado",
  adicionarAqui: "Adicionar bloco aqui",
  selecionarTudo: "Selecionar tudo",
  duplicar: "Duplicar",
  desligar: "Desligar as saídas",
  remover: "Remover",
  removerLigacao: "Remover a ligação",
  maisAcoes: "Ações",
  atalhos: [
    { gesto: "Arrastar o fundo", efeito: "move a tela" },
    { gesto: "Rolar ou pinçar", efeito: "aproxima e afasta" },
    { gesto: "Arrastar um bloco", efeito: "muda de lugar" },
    { gesto: "Arrastar da bolinha de uma saída", efeito: "liga a outro bloco" },
    { gesto: "Clicar numa ligação + Delete", efeito: "desfaz a ligação" },
    { gesto: "Dois cliques no fundo", efeito: "adiciona um bloco ali" },
    { gesto: "Shift + arrastar", efeito: "marca vários" },
    { gesto: "Botão direito", efeito: "mais ações" },
    { gesto: "Setas", efeito: "movem o bloco marcado" },
    { gesto: "Ctrl ou ⌘ + D · Delete", efeito: "duplica · remove" },
  ],
};

/** Um histórico só para o fluxo: cada mudança guarda o estado anterior, até cinquenta. */
function useHistorico<T>(inicial: T) {
  const [estado, setEstado] = React.useState({ passado: [] as T[], atual: inicial, futuro: [] as T[] });
  // digitar no painel muda o bloco a cada tecla: mudanças seguidas com a mesma chave viram um passo só
  const ultima = React.useRef({ chave: "", quando: 0 });
  const mudar = React.useCallback((fn: (valor: T) => T, chave = "") => {
    const agora = Date.now();
    const junta = chave !== "" && chave === ultima.current.chave && agora - ultima.current.quando < 1000;
    ultima.current = { chave, quando: agora };
    setEstado((e) => {
      const novo = fn(e.atual);
      if (novo === e.atual) return e;
      return { passado: junta ? e.passado : [...e.passado.slice(-49), e.atual], atual: novo, futuro: [] };
    });
  }, []);
  const desfazer = React.useCallback(() => {
    ultima.current = { chave: "", quando: 0 };
    setEstado((e) => (e.passado.length ? { passado: e.passado.slice(0, -1), atual: e.passado[e.passado.length - 1], futuro: [e.atual, ...e.futuro] } : e));
  }, []);
  const refazer = React.useCallback(() => {
    ultima.current = { chave: "", quando: 0 };
    setEstado((e) => (e.futuro.length ? { passado: [...e.passado, e.atual], atual: e.futuro[0], futuro: e.futuro.slice(1) } : e));
  }, []);
  return { valor: estado.atual, mudar, desfazer, refazer, podeDesfazer: estado.passado.length > 0, podeRefazer: estado.futuro.length > 0 };
}

const PRINCIPAIS = [
  { rotulo: "Início", icone: House },
  { rotulo: "Pipelines", icone: Kanban },
  { rotulo: "Leads", icone: UsersThree },
  { rotulo: "Impulso", icone: Lightning },
  { rotulo: "Automações", icone: FlowArrow },
  { rotulo: "Chat ao vivo", icone: ChatCircleDots },
  { rotulo: "Agentes de IA", icone: Robot },
];

const FAVORITOS = ["Boas-vindas pelo WhatsApp", "Lembrete de proposta"];

const APOIO = [
  { rotulo: "Ajuda", icone: Question },
  { rotulo: "Configurações", icone: Gear },
];

const NOTIFICACOES: Notificacao[] = [
  { id: "1", icone: Lightning, titulo: "Automação com erro", detalhe: "Boas-vindas pelo WhatsApp: 3 mensagens não foram enviadas hoje.", quando: "há 20 min", lida: false },
];

/** Os blocos que dá para adicionar: o gatilho já existe e é um só. */
const BLOCOS_PARA_ADICIONAR = (Object.keys(TIPOS) as TipoDeBloco[])
  .filter((t) => t !== "gatilho")
  .map((t) => {
    const Icone = ICONES_DOS_BLOCOS[t];
    return { valor: t, rotulo: TIPOS[t].rotulo, icone: <Icone size={16} weight="regular" aria-hidden="true" className="shrink-0" /> };
  });

export function Tela({
  aoNavegar,
  memoria = "automacoes",
}: {
  /** Só no protótipo, que junta as telas: recebe o destino clicado na navegação e devolve `true` quando troca de tela. */
  aoNavegar?: (destino: string) => boolean;
  /** Chave da memória da sidebar. No protótipo é uma só, para ela não mudar de estado entre as telas. */
  memoria?: string;
} = {}) {
  const [rota, setRota] = React.useState("Automações");
  const fluxo = useHistorico<Bloco[]>(AUTOMACAO);
  const blocos = fluxo.valor;
  const [selecionados, setSelecionados] = React.useState<string[]>([]);
  const [ativa, setAtiva] = React.useState(true);
  const [adicionando, setAdicionando] = React.useState(false);
  const [maisAcoes, setMaisAcoes] = React.useState(false);
  const [notificacoes, setNotificacoes] = React.useState(NOTIFICACOES);
  const botaoAdicionar = React.useRef<HTMLButtonElement>(null);
  const botaoMais = React.useRef<HTMLButtonElement>(null);
  const canvas = React.useRef<CanvasRef>(null);
  const { tema, mudar } = useTema();

  // o painel abre com um bloco marcado; com vários, a tela é do canvas
  const aberto = selecionados.length === 1 ? (blocos.find((b) => b.id === selecionados[0]) ?? null) : null;
  // digitar no painel agrupa por bloco: um Ctrl+Z desfaz a frase, não a letra
  const editar = (id: string, campos: Partial<Bloco>) => fluxo.mudar((bs) => bs.map((b) => (b.id === id ? { ...b, ...campos } : b)), `editar:${id}`);

  function adicionar(tipo: TipoDeBloco, x: number, y: number, ligar?: { bloco: string; saida: string }) {
    const id = `${tipo}-${Date.now()}`;
    const itens = tipo === "randomizador" ? ["Oferta A", "Oferta B"] : [];
    const novo: Bloco = {
      id,
      tipo,
      titulo: TIPOS[tipo].rotulo,
      x,
      y,
      itens,
      saidas: saidasDe(tipo, itens),
      ...(tipo === "mensagem" ? { canal: "WhatsApp" as const, texto: "" } : {}),
      ...(tipo === "espera" ? { espera: { valor: 1, unidade: "horas" as const } } : {}),
    };
    fluxo.mudar((bs) => [
      // veio de uma saída arrastada até o vazio: ela já aponta para o bloco novo
      ...bs.map((b) => (ligar && b.id === ligar.bloco ? { ...b, saidas: b.saidas.map((s) => (s.id === ligar.saida ? { ...s, para: id } : s)) } : b)),
      novo,
    ]);
    setSelecionados([id]);
  }

  /** Pelo botão do Header: o bloco nasce no meio do que a pessoa está vendo. */
  function adicionarNoMeio(tipo: TipoDeBloco) {
    const c = canvas.current?.centro() ?? { x: 24, y: 24 };
    let x = Math.round((c.x - LARGURA_DO_BLOCO / 2) / 8) * 8;
    let y = Math.round((c.y - 80) / 8) * 8;
    // não nasce exatamente em cima de outro
    while (blocos.some((b) => Math.abs(b.x - x) < 16 && Math.abs(b.y - y) < 16)) {
      x += 24;
      y += 24;
    }
    adicionar(tipo, x, y);
  }

  function remover(ids: string[]) {
    // o gatilho é o começo do fluxo: não se remove
    const alvos = ids.filter((id) => blocos.find((b) => b.id === id)?.tipo !== "gatilho");
    if (!alvos.length) return;
    // quem apontava para um bloco removido fica sem destino
    fluxo.mudar((bs) => bs.filter((b) => !alvos.includes(b.id)).map((b) => ({ ...b, saidas: b.saidas.map((s) => (s.para && alvos.includes(s.para) ? { ...s, para: undefined } : s)) })));
    setSelecionados([]);
    toast({
      variant: "info",
      titulo: alvos.length === 1 ? "Bloco removido" : `${alvos.length} blocos removidos`,
      descricao: "As saídas que chegavam neles ficaram sem destino. Ctrl ou ⌘ + Z desfaz.",
    });
  }

  function duplicar(ids: string[]) {
    const originais = blocos.filter((b) => ids.includes(b.id) && b.tipo !== "gatilho");
    if (!originais.length) return;
    const agora = Date.now();
    // a cópia nasce um passo ao lado, com as saídas soltas: ligar é decisão de quem copia
    const copias = originais.map((b, i) => ({ ...b, id: `${b.tipo}-${agora}-${i}`, titulo: `${b.titulo} (cópia)`, x: b.x + 32, y: b.y + 32, contagem: undefined, saidas: b.saidas.map((s) => ({ ...s, para: undefined })) }));
    fluxo.mudar((bs) => [...bs, ...copias]);
    setSelecionados(copias.map((c) => c.id));
  }

  const mover = (posicoes: Record<string, { x: number; y: number }>) => fluxo.mudar((bs) => bs.map((b) => (posicoes[b.id] ? { ...b, ...posicoes[b.id] } : b)), "mover");
  const ligar = (bloco: string, saida: string, para: string | undefined) =>
    fluxo.mudar((bs) => bs.map((b) => (b.id === bloco ? { ...b, saidas: b.saidas.map((s) => (s.id === saida ? { ...s, para } : s)) } : b)));

  return (
    <TelaBase
      memoria={memoria}
      recuo={false}
      lateral={
        aberto ? (
          <PainelDoBloco
            bloco={aberto}
            blocos={blocos}
            aoEditar={(campos) => editar(aberto.id, campos)}
            aoRemover={() => remover([aberto.id])}
            aoFechar={() => setSelecionados([])}
          />
        ) : null
      }
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
            <SidebarUser nome="Gabriel Correa" email="gece@datacrazy.com" />
          </SidebarRodape>
        </>
      }
      cabecalho={{
        titulo: "Boas-vindas pelo WhatsApp",
        trilha: (
          <Breadcrumb
            ancestrais
            rotulo="Trilha de navegação"
            rotuloRecolhidos={(n) => `Mostrar ${n} níveis ocultos`}
            itens={[{ rotulo: "Início" }, { rotulo: "Automações", icone: FlowArrow }]}
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
            {/* liga e desliga na hora: é Switch, não botão de salvar */}
            <Switch
              checked={ativa}
              onChange={(e) => {
                setAtiva(e.target.checked);
                toast({ variant: "info", titulo: e.target.checked ? "Automação ativa" : "Automação pausada", descricao: e.target.checked ? "Novos leads entram no fluxo." : "Quem já está no fluxo termina; ninguém novo entra." });
              }}
            >
              Ativa
            </Switch>
            <Button ref={botaoAdicionar} variant="tertiary" aria-haspopup="dialog" aria-expanded={adicionando} onClick={() => setAdicionando((a) => !a)}>
              <Plus size={16} weight="regular" aria-hidden="true" />
              Bloco
            </Button>
            <ComboboxPainel
              aberto={adicionando}
              aoFechar={(devolver = true) => {
                setAdicionando(false);
                if (devolver) botaoAdicionar.current?.focus();
              }}
              gatilho={botaoAdicionar}
              rotulo="Adicionar bloco"
              opcoes={BLOCOS_PARA_ADICIONAR}
              selecionados={[]}
              aoAlternar={(tipo) => adicionarNoMeio(tipo as TipoDeBloco)}
              rotulos={{ busca: "Buscar bloco", vazio: "Nenhum bloco encontrado" }}
            />
            <Button
              ref={botaoMais}
              variant="tertiary"
              size="icon"
              aria-label="Mais ações"
              title="Mais ações"
              aria-haspopup="menu"
              aria-expanded={maisAcoes}
              onClick={() => setMaisAcoes((a) => !a)}
            >
              <DotsThree size={16} weight="bold" aria-hidden="true" />
            </Button>
            <Menu
              aberto={maisAcoes}
              gatilho={botaoMais}
              rotulo="Mais ações"
              itens={["Duplicar automação", "Exportar automação", "Adicionar anotação"].map((rotulo) => ({
                id: rotulo,
                rotulo,
                aoAtivar: () => toast({ variant: "info", titulo: rotulo, descricao: "No CRM: a ação da automação." }),
              }))}
              aoFechar={(devolver = true) => {
                setMaisAcoes(false);
                if (devolver) botaoMais.current?.focus();
              }}
            />
            <HeaderDivisor />
            <Button onClick={() => toast({ titulo: "Automação salva", descricao: `${blocos.length} blocos no fluxo.` })}>Salvar</Button>
          </>
        ),
      }}
    >
      <Canvas
        ref={canvas}
        blocos={blocos}
        selecionados={selecionados}
        aoSelecionar={setSelecionados}
        aoMover={mover}
        aoLigar={ligar}
        aoAdicionar={adicionar}
        aoRemover={remover}
        aoDuplicar={duplicar}
        aoDesfazer={fluxo.desfazer}
        aoRefazer={fluxo.refazer}
        podeDesfazer={fluxo.podeDesfazer}
        podeRefazer={fluxo.podeRefazer}
        rotulos={ROTULOS_DO_CANVAS}
      />
      <Toaster />
    </TelaBase>
  );
}
