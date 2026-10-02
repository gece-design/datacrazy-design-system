"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ChatCircleDots, FlowArrow, Gear, House, Kanban, Lightning, Question, Robot, UsersThree } from "@phosphor-icons/react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SidebarBrand, SidebarGrupo, SidebarItem, SidebarRodape, SidebarThemeSwitch, SidebarTopo, SidebarUser } from "@/components/ui/sidebar";
import { TelaBase } from "@/components/ui/tela-base";
import { useTema } from "@/lib/tema";
import { Tela as Atendimento } from "@/app/exemplos/atendimento/tela";
import { Tela as Automacoes } from "@/app/exemplos/automacoes/tela";
import { Tela as Dashboard } from "@/app/exemplos/dashboard/tela";
import { Tela as Leads } from "@/app/exemplos/leads/tela";
import { Tela as Pipeline } from "@/app/exemplos/pipeline/tela";

/* ---------------------------------------------------------------------------
   Protótipo SystemCrazy — NÃO é componente do design system.

   As telas de exemplo, que antes eram páginas soltas, viram um app só: a
   navegação de cada uma leva à outra, com a mesma sidebar (uma memória só,
   para ela não abrir e fechar a cada troca). Cada tela continua sendo o
   arquivo do bloco que o time instala — aqui elas só recebem `aoNavegar`.
--------------------------------------------------------------------------- */

/** O item da navegação → a tela. Os que não estão aqui ainda não têm exemplo. */
const TELAS = {
  dashboard: { destino: "Início", Tela: Dashboard },
  pipeline: { destino: "Pipelines", Tela: Pipeline },
  leads: { destino: "Leads", Tela: Leads },
  automacoes: { destino: "Automações", Tela: Automacoes },
  atendimento: { destino: "Chat ao vivo", Tela: Atendimento },
} as const;
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

export function Prototipo({ telaInicial }: { telaInicial?: string }) {
  // o que está na tela: uma das cinco, ou o nome de um destino que ainda não tem exemplo
  const [atual, setAtual] = React.useState<string>(telaInicial && telaInicial in TELAS ? telaInicial : "dashboard");

  /** Clique num item da navegação principal: troca de tela e guarda na URL, para o link abrir direto nela. */
  const aoNavegar = React.useCallback((destino: string) => {
    const id = (Object.keys(TELAS) as IdDaTela[]).find((k) => TELAS[k].destino === destino) ?? destino;
    setAtual(id);
    window.history.replaceState(null, "", id in TELAS ? `?tela=${id}` : window.location.pathname);
    return true;
  }, []);

  if (atual in TELAS) {
    const { Tela } = TELAS[atual as IdDaTela];
    // `key`: cada tela começa do seu estado inicial ao entrar
    return <Tela key={atual} aoNavegar={aoNavegar} memoria={MEMORIA} />;
  }
  return <EmBreve destino={atual} aoNavegar={aoNavegar} />;
}

/** Destino da navegação que ainda não tem tela de exemplo: a casca, com o aviso. */
function EmBreve({ destino, aoNavegar }: { destino: string; aoNavegar: (destino: string) => boolean }) {
  const { tema, mudar } = useTema();
  return (
    <TelaBase
      memoria={MEMORIA}
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
        titulo: destino,
        trilha: <Breadcrumb ancestrais rotulo="Trilha de navegação" rotuloRecolhidos={(n) => `Mostrar ${n} níveis ocultos`} itens={[{ rotulo: "Início" }]} />,
      }}
    >
      <div className="flex min-h-64 flex-1 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card p-6 text-center">
        <p className="text-label-lg text-foreground">{destino} ainda não tem tela no protótipo</p>
        <p className="max-w-md text-body-sm text-muted-foreground">
          As telas prontas estão no menu ao lado: Início, Pipelines, Leads, Automações e Chat ao vivo.
        </p>
      </div>
    </TelaBase>
  );
}
