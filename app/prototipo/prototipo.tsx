"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ChatCircleDots, FlowArrow, Gear, House, Kanban, Lightning, Question, Robot, UsersThree } from "@phosphor-icons/react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SidebarBrand, SidebarGrupo, SidebarItem, SidebarRodape, SidebarThemeSwitch, SidebarTopo, SidebarUser } from "@/components/ui/sidebar";
import { SkeletonDaTela, type ModeloDeCarregamento } from "@/components/ui/skeleton";
import { TelaBase } from "@/components/ui/tela-base";
import { useTema } from "@/lib/tema";
import { Tela as Agentes } from "@/app/exemplos/agentes/tela";
import { Tela as Atendimento } from "@/app/exemplos/atendimento/tela";
import { Tela as Automacoes } from "@/app/exemplos/automacoes/tela";
import { Tela as Dashboard } from "@/app/exemplos/dashboard/tela";
import { Tela as Leads } from "@/app/exemplos/leads/tela";
import type { VersaoDoLead } from "@/app/exemplos/leads/painel-lead";
import { Tela as Pipeline } from "@/app/exemplos/pipeline/tela";

/* ---------------------------------------------------------------------------
   Protótipo SystemCrazy — NÃO é componente do design system.

   As telas de exemplo, que antes eram páginas soltas, viram um app só: a
   navegação de cada uma leva à outra, com a mesma sidebar (uma memória só,
   para ela não abrir e fechar a cada troca). Cada tela continua sendo o
   arquivo do bloco que o time instala — aqui elas só recebem `aoNavegar`.

   Duas variações, pedidas pelo cliente em 2026-10-08: `vazio` (a conta sem
   nada: cada tela no seu estado vazio) e `carregando` (o modelo de
   carregamento de página, o Skeleton com a forma da tela). Ao trocar de tela
   pelo menu, o Skeleton aparece por um instante — como no CRM, enquanto a
   API responde.
--------------------------------------------------------------------------- */

/** O item da navegação → a tela, e a forma dela enquanto carrega. */
const TELAS = {
  dashboard: { destino: "Início", titulo: "Visão geral", Tela: Dashboard, modelo: "painel" },
  pipeline: { destino: "Pipelines", titulo: "Comercial", Tela: Pipeline, modelo: "quadro" },
  leads: { destino: "Leads", titulo: "Leads", Tela: Leads, modelo: "tabela" },
  automacoes: { destino: "Automações", titulo: "Automações", Tela: Automacoes, modelo: "canvas" },
  atendimento: { destino: "Chat ao vivo", titulo: "Atendimento", Tela: Atendimento, modelo: "conversa" },
  agentes: { destino: "Agentes de IA", titulo: "Agentes de IA", Tela: Agentes, modelo: "cartoes" },
} as const satisfies Record<string, { destino: string; titulo: string; Tela: React.ComponentType<{ aoNavegar?: (d: string) => boolean; memoria?: string; vazio?: boolean; versaoDoLead?: VersaoDoLead }>; modelo: ModeloDeCarregamento }>;
type IdDaTela = keyof typeof TELAS;

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
  { rotulo: "Ajuda", icone: Question },
  { rotulo: "Configurações", icone: Gear },
];

const MEMORIA = "prototipo";

/** Quanto tempo o Skeleton fica ao trocar de tela: o que uma API responde numa conexão normal. Só no protótipo. */
const TEMPO_DE_CARREGAMENTO_SIMULADO = 600;

export type VariacaoDoPrototipo = "vazio" | "carregando";

export function Prototipo({ telaInicial, variacao, versaoDoLead }: { telaInicial?: string; variacao?: VariacaoDoPrototipo; versaoDoLead?: VersaoDoLead }) {
  // o que está na tela: uma das seis, ou o nome de um destino que ainda não tem exemplo
  const [atual, setAtual] = React.useState<string>(telaInicial && telaInicial in TELAS ? telaInicial : "dashboard");
  // `?carregando=1` segura o Skeleton; a troca pelo menu mostra por um instante
  const [carregando, setCarregando] = React.useState(variacao === "carregando");
  const vazio = variacao === "vazio";

  /** Clique num item da navegação principal: troca de tela e guarda na URL, para o link abrir direto nela. */
  const aoNavegar = React.useCallback(
    (destino: string) => {
      const id = (Object.keys(TELAS) as IdDaTela[]).find((k) => TELAS[k].destino === destino) ?? destino;
      setAtual(id);
      const consulta = id in TELAS ? `?tela=${id}${vazio ? "&vazio=1" : ""}${versaoDoLead ? `&lead=${versaoDoLead}` : ""}` : window.location.pathname;
      window.history.replaceState(null, "", consulta);
      if (id in TELAS) setCarregando(true);
      return true;
    },
    [vazio, versaoDoLead],
  );

  React.useEffect(() => {
    if (!carregando || variacao === "carregando") return;
    const t = window.setTimeout(() => setCarregando(false), TEMPO_DE_CARREGAMENTO_SIMULADO);
    return () => window.clearTimeout(t);
  }, [carregando, atual, variacao]);

  if (atual in TELAS) {
    const { Tela, destino, titulo, modelo } = TELAS[atual as IdDaTela];
    if (carregando) {
      return (
        // o Skeleton já traz o recuo do padrão de fundo; o título da tela já se sabe
        <Casca destino={destino} titulo={titulo} aoNavegar={aoNavegar} recuo={false}>
          <SkeletonDaTela modelo={modelo} />
        </Casca>
      );
    }
    // `key`: cada tela começa do seu estado inicial ao entrar
    return <Tela key={atual} aoNavegar={aoNavegar} memoria={MEMORIA} vazio={vazio} versaoDoLead={versaoDoLead} />;
  }
  return (
    <Casca destino={atual} aoNavegar={aoNavegar}>
      <div className="flex min-h-64 flex-1 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card p-6 text-center">
        <p className="text-label-lg text-foreground">{atual} ainda não tem tela no protótipo</p>
        <p className="max-w-md text-body-sm text-muted-foreground">
          As telas prontas estão no menu ao lado: Início, Pipelines, Leads, Automações, Chat ao vivo e Agentes de IA.
        </p>
      </div>
    </Casca>
  );
}

/** A casca do protótipo sem uma tela dentro: a sidebar e o Header com o título, para o Skeleton e para os destinos sem exemplo. */
function Casca({ destino, titulo = destino, aoNavegar, recuo = true, children }: { destino: string; titulo?: string; aoNavegar: (destino: string) => boolean; recuo?: boolean; children: React.ReactNode }) {
  const { tema, mudar } = useTema();
  return (
    <TelaBase
      memoria={MEMORIA}
      recuo={recuo}
      navegacao={
        <>
          <SidebarTopo>
            <SidebarBrand />
            <SidebarGrupo>
              {PRINCIPAIS.map((r) => (
                <SidebarItem key={r.rotulo} icone={r.icone} componente="button" selecionado={r.rotulo === destino} onClick={() => aoNavegar(r.rotulo)}>
                  {r.rotulo}
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
                <SidebarItem key={r.rotulo} icone={r.icone} componente="button" selecionado={false}>
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
        titulo,
        trilha: <Breadcrumb ancestrais rotulo="Trilha de navegação" rotuloRecolhidos={(n) => `Mostrar ${n} níveis ocultos`} itens={[{ rotulo: "Início" }]} />,
      }}
    >
      {children}
    </TelaBase>
  );
}
