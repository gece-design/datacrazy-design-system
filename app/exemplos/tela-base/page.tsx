"use client";

import { useEffect, useState } from "react";
import {
  ChartBar,
  ChatCircleDots,
  ClipboardText,
  FlowArrow,
  FunnelSimple,
  Gear,
  Handshake,
  House,
  Kanban,
  Lightning,
  Plus,
  Question,
  Robot,
  Rows,
  UserPlus,
  UsersThree,
  WarningCircle,
} from "@phosphor-icons/react";
import { TelaBase } from "@/components/ui/tela-base";
import { SidebarBrand, SidebarGrupo, SidebarItem, SidebarRodape, SidebarThemeSwitch, SidebarTopo, SidebarUser } from "@/components/ui/sidebar";
import { HeaderBusca, HeaderDivisor, Notificacoes, type Notificacao } from "@/components/ui/header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SegmentedControl, ViewSwitcher } from "@/components/ui/segmented-control";
import { Tabs, TabPanel } from "@/components/ui/tabs";
import { Toaster, toast } from "@/components/ui/toast";

/**
 * Tela base — o ponto de partida de toda tela nova do CRM.
 *
 * `npx shadcn@latest add @datacrazy/tela` cria este arquivo em
 * `app/nova-tela/page.tsx`. Renomeie a pasta, troque os placeholders e
 * preencha o conteúdo. Sidebar, Header, subcabeçalho e os breakpoints já
 * estão ligados pela `TelaBase`; não monte Sidebar e Header à mão.
 *
 * Tudo aqui funciona: o tema troca de verdade, o sino abre o painel, a busca
 * filtra, as abas trocam o conteúdo, as ações respondem com um Toast. Os
 * textos são placeholders — no CRM, todo texto vem do next-intl.
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

const NOTIFICACOES: Notificacao[] = [
  { id: "1", icone: UserPlus, titulo: "Novo lead atribuído", detalhe: "Construtora Horizonte entrou no seu funil pela campanha de setembro.", quando: "agora", lida: false },
  { id: "2", icone: ClipboardText, titulo: "Tarefa vence hoje", detalhe: "Ligar para Marina Albuquerque sobre a proposta enviada na sexta.", quando: "há 20 min", lida: false },
  { id: "3", icone: WarningCircle, titulo: "Negócio parado há 14 dias", detalhe: "Norte Logística segue em Proposta sem nenhuma interação registrada.", quando: "há 2 h", lida: false },
  { id: "4", icone: Handshake, titulo: "Negócio ganho", detalhe: "Joel Jota assinou o contrato anual — R$ 48.000.", quando: "ontem", lida: true },
];

const ABAS = [
  { valor: "visao-geral", rotulo: "Visão geral" },
  { valor: "atividades", rotulo: "Atividades" },
  { valor: "arquivos", rotulo: "Arquivos" },
];

/**
 * O tema vive numa classe `dark` no <html> e em localStorage — é o que o
 * setup do DS instala. No CRM, troque por quem já cuida do tema (next-themes):
 * o `SidebarThemeSwitch` só precisa de `tema` e `onTemaChange`.
 */
function useTema() {
  const [escuro, setEscuro] = useState(false);
  useEffect(() => setEscuro(document.documentElement.classList.contains("dark")), []);
  function mudar(tema: "claro" | "escuro") {
    const novo = tema === "escuro";
    setEscuro(novo);
    document.documentElement.classList.toggle("dark", novo);
    try {
      localStorage.setItem("dc-tema", tema);
    } catch {
      /* sem memória do tema */
    }
  }
  return { tema: escuro ? ("escuro" as const) : ("claro" as const), mudar };
}

export default function NovaTela() {
  const [rota, setRota] = useState("Início");
  const { tema, mudar } = useTema();
  const [notificacoes, setNotificacoes] = useState(NOTIFICACOES);
  const [busca, setBusca] = useState("");
  const [visao, setVisao] = useState("lista");
  const [periodo, setPeriodo] = useState("mes");
  const [aba, setAba] = useState("visao-geral");

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
                <SidebarThemeSwitch tema={tema} onTemaChange={mudar} />
              </li>
              {APOIO.map((r) => (
                <SidebarItem key={r.rotulo} icone={r.icone} componente="button" selecionado={r.rotulo === rota} onClick={() => setRota(r.rotulo)}>
                  {r.rotulo}
                </SidebarItem>
              ))}
            </SidebarGrupo>
            <SidebarUser
              nome="Nome Sobrenome"
              email="nome@empresa.com"
              onClick={() => toast({ variant: "info", titulo: "Menu do usuário", descricao: "No CRM: perfil, preferências e sair." })}
            />
          </SidebarRodape>
        </>
      }
      cabecalho={{
        titulo: "Título da tela",
        trilha: (
          <Breadcrumb
            rotulo="Trilha de navegação"
            rotuloRecolhidos={(n) => `Mostrar ${n} níveis ocultos`}
            itens={[
              { rotulo: "DataCrazy", href: "#", avatar: { destaque: true } },
              { rotulo: rota },
            ]}
          />
        ),
        utilitarios: (
          <Notificacoes
            itens={notificacoes}
            aoMarcarLida={(id) => setNotificacoes((l) => l.map((n) => (n.id === id ? { ...n, lida: true } : n)))}
            aoMarcarTodas={() => setNotificacoes((l) => l.map((n) => ({ ...n, lida: true })))}
            aoVerTodas={() => toast({ variant: "info", titulo: "Todas as notificações", descricao: "No CRM: a tela de notificações." })}
          />
        ),
        // A ordem do arquivo (601:464): busca, filtros, visualização, período, divisor e a ação principal.
        acoes: (
          <>
            <HeaderBusca rotulo="Pesquisar" placeholder="Pesquisar" value={busca} onChange={(e) => setBusca(e.target.value)} />
            <Button variant="tertiary" onClick={() => toast({ variant: "info", titulo: "Filtros", descricao: "No CRM: o painel de filtros da tela." })}>
              <FunnelSimple size={16} weight="regular" />
              Filtros
            </Button>
            <ViewSwitcher
              rotulo="Visualização"
              atual={visao}
              aoEscolher={setVisao}
              itens={[
                { valor: "lista", rotulo: "Lista", icone: Rows },
                { valor: "grafico", rotulo: "Gráfico", icone: ChartBar },
              ]}
            />
            <SegmentedControl
              rotulo="Período"
              atual={periodo}
              aoEscolher={setPeriodo}
              itens={[
                { valor: "semana", rotulo: "Semana" },
                { valor: "mes", rotulo: "Mês" },
                { valor: "ano", rotulo: "Ano" },
              ]}
            />
            <HeaderDivisor />
            <Button onClick={() => toast({ variant: "success", titulo: "Ação principal", descricao: "No CRM: criar o registro desta tela." })}>
              <Plus size={16} weight="regular" />
              Novo registro
            </Button>
          </>
        ),
      }}
      subcabecalho={<Tabs id="tela" rotulo="Seções da tela" itens={ABAS} atual={aba} aoEscolher={setAba} />}
    >
      {ABAS.map((a) => (
        <TabPanel key={a.valor} id="tela" valor={a.valor} atual={aba} className="flex min-h-0 flex-1 flex-col">
          {/* O conteúdo da seção entra aqui. Este bloco é só o placeholder. */}
          <div className="flex min-h-64 flex-1 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card text-center">
            <p className="text-label-lg text-foreground">{a.rotulo}</p>
            <p className="max-w-md text-body-sm text-muted-foreground">
              {busca ? `Pesquisando por “${busca}” em ${visao}, ${periodo}.` : `Troque este bloco pelo conteúdo de ${a.rotulo.toLowerCase()}: uma Table, um quadro, um formulário em Cards.`}
            </p>
          </div>
        </TabPanel>
      ))}
      <Toaster />
    </TelaBase>
  );
}
