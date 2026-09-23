"use client";

import { useState } from "react";
import { Bell, ChatCircleDots, FlowArrow, Gear, House, Kanban, Lightning, Plus, Question, Robot, UsersThree } from "@phosphor-icons/react";
import { TelaBase } from "@/components/ui/tela-base";
import { SidebarBrand, SidebarGrupo, SidebarItem, SidebarRodape, SidebarThemeSwitch, SidebarTopo, SidebarUser } from "@/components/ui/sidebar";
import { HeaderNotificacoes } from "@/components/ui/header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SegmentedControl } from "@/components/ui/segmented-control";

/**
 * Tela base — o ponto de partida de toda tela nova do CRM.
 *
 * `npx shadcn@latest add @datacrazy/tela` cria este arquivo em
 * `app/nova-tela/page.tsx`. Renomeie a pasta, troque os placeholders e
 * preencha o conteúdo. Sidebar, Header, subcabeçalho e os breakpoints já
 * estão ligados pela `TelaBase`; não monte Sidebar e Header à mão.
 *
 * Os textos abaixo são placeholders: no CRM, todo texto vem do next-intl.
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

const APOIO = [
  { rotulo: "Ajuda", icone: Question },
  { rotulo: "Configurações", icone: Gear },
];

export default function NovaTela() {
  const [rota, setRota] = useState("Início");
  const [tema, setTema] = useState<"claro" | "escuro">("claro");
  const [periodo, setPeriodo] = useState("30d");
  const [visao, setVisao] = useState("todos");

  return (
    <TelaBase
      memoria="nova-tela"
      navegacao={
        <>
          <SidebarTopo>
            <SidebarBrand />
            <SidebarGrupo recuo>
              {PRINCIPAIS.map((r) => (
                <SidebarItem key={r.rotulo} icone={r.icone} componente="button" selecionado={r.rotulo === rota} onClick={() => setRota(r.rotulo)}>
                  {r.rotulo}
                </SidebarItem>
              ))}
            </SidebarGrupo>
          </SidebarTopo>
          <SidebarRodape>
            <SidebarGrupo>
              <li>
                <SidebarThemeSwitch tema={tema} onTemaChange={setTema} />
              </li>
              {APOIO.map((r) => (
                <SidebarItem key={r.rotulo} icone={r.icone} componente="button" selecionado={r.rotulo === rota} onClick={() => setRota(r.rotulo)}>
                  {r.rotulo}
                </SidebarItem>
              ))}
            </SidebarGrupo>
            <SidebarUser nome="Nome Sobrenome" email="nome@empresa.com" />
          </SidebarRodape>
        </>
      }
      cabecalho={{
        titulo: "Título da tela",
        subtitulo: "Uma frase que diz o que o título não diz — ou nada.",
        trilha: <Breadcrumb rotulo="Trilha" rotuloRecolhidos={(n) => `Mostrar mais ${n} níveis`} itens={[{ rotulo: "Início" }, { rotulo: rota }]} />,
        utilitarios: <HeaderNotificacoes rotulo="Notificações: 3 não lidas" contagem={3} />,
        acoes: (
          <Button>
            <Plus size={16} weight="regular" />
            Ação principal
          </Button>
        ),
      }}
      subcabecalho={
        <>
          <SegmentedControl
            rotulo="Recorte"
            atual={visao}
            aoEscolher={setVisao}
            itens={[
              { valor: "todos", rotulo: "Todos" },
              { valor: "meus", rotulo: "Meus" },
              { valor: "equipe", rotulo: "Equipe" },
            ]}
          />
          <Select
            size="sm"
            rotulo="Período"
            opcoes={[
              { valor: "7d", rotulo: "Últimos 7 dias" },
              { valor: "30d", rotulo: "Últimos 30 dias" },
              { valor: "90d", rotulo: "Últimos 90 dias" },
            ]}
            valor={periodo}
            aoEscolher={setPeriodo}
          />
        </>
      }
    >
      {/* O conteúdo da tela entra aqui. Este bloco é só o placeholder. */}
      <div className="flex min-h-64 flex-1 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card text-center">
        <Bell size={20} weight="regular" aria-hidden="true" className="text-subtle-foreground" />
        <p className="text-label-lg text-foreground">Conteúdo da tela</p>
        <p className="max-w-md text-body-sm text-muted-foreground">
          Sidebar, Header e o subcabeçalho já estão no lugar, com os breakpoints. Troque este bloco pelo conteúdo: uma
          Table, um quadro, um formulário em Cards.
        </p>
      </div>
    </TelaBase>
  );
}
