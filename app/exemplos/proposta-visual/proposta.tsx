"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowsInSimple,
  ArrowsOutSimple,
  Bell,
  Buildings,
  CalendarBlank,
  ChatCircleDots,
  CurrencyDollar,
  EnvelopeSimple,
  FlowArrow,
  FunnelSimple,
  Gear,
  Handshake,
  House,
  Kanban,
  Lightning,
  MagnifyingGlass,
  MapPin,
  Phone,
  Plus,
  Question,
  Robot,
  Rows,
  SidebarSimple,
  Star,
  Tag as IconeDeTag,
  User,
  UsersThree,
  type Icon,
} from "@phosphor-icons/react";

import { Avatar } from "@/components/ui/avatar";
import { BotaoFechar, Button } from "@/components/ui/button";
import { BotaoAgrupar, BotaoColunas, CelulaEditavel, useAjustesDaTabela } from "@/components/ui/data-table";
import { LinhaDoTempo } from "@/components/ui/drawer";
import { LogoDataCrazy } from "@/components/ui/logo-datacrazy";
import { Select } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { Tag } from "@/components/ui/tag";
import { Toaster, toast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { rolagemDiscreta } from "@/lib/estados";
import { cn } from "@/lib/utils";
import { ETAPAS, GRUPOS_TAGS, LEADS, etapaPor, moeda, tagsDe, type EtapaId, type Lead } from "../pipeline/dados";
import { COLUNAS_DA_LISTA, Lista } from "../pipeline/lista";

/**
 * PROPOSTA, não design system: a casca desenhada aqui (navegação, topo, barra
 * de visão, painel do registro) é um protótipo para o humano aprovar — por
 * isso monta Sidebar e Header à mão, o que uma tela do produto nunca faz. Os
 * átomos são os do DS (Button, Tag, Tabs, Select, a Table densa). Aprovada, a
 * casca vira `TelaBase`, `Header` e `Sidebar`; recusada, esta pasta some.
 *
 * As quatro mudanças, medidas no tema aberto do Twenty:
 * 1. Uma superfície só: topo, barra e tabela no mesmo painel, separados por traço.
 * 2. Topo de uma linha (48): título de 13px ao lado da trilha, ações de 28.
 * 3. Navegação plana de 220 (48 recolhida), item de 32, com Favoritos.
 * 4. Registro em painel lateral de 480 que EMPURRA a lista, com campos em linha.
 */

const PRINCIPAIS: { rotulo: string; icone: Icon }[] = [
  { rotulo: "Início", icone: House },
  { rotulo: "Pipelines", icone: Kanban },
  { rotulo: "Leads", icone: UsersThree },
  { rotulo: "Impulso", icone: Lightning },
  { rotulo: "Automações", icone: FlowArrow },
  { rotulo: "Chat ao vivo", icone: ChatCircleDots },
  { rotulo: "Agentes de IA", icone: Robot },
];
const FAVORITOS = ["Pipeline comercial", "Leads quentes", "Propostas da semana"];

function ItemDaNavegacao({ icone: Icone, rotulo, selecionado, recolhida, ...props }: { icone: Icon; rotulo: string; selecionado?: boolean; recolhida: boolean } & React.ComponentProps<typeof Button>) {
  const item = (
    <Button
      variant="ghost"
      aria-current={selecionado ? "page" : undefined}
      aria-label={recolhida ? rotulo : undefined}
      className={cn("h-8 w-full gap-2 px-2 text-body-lg", recolhida ? "justify-center" : "justify-start", selecionado && "bg-accent text-foreground")}
      {...props}
    >
      <Icone size={16} weight={selecionado ? "fill" : "regular"} className={cn(selecionado && "text-primary")} />
      {recolhida ? null : <span className="min-w-0 truncate">{rotulo}</span>}
    </Button>
  );
  return recolhida ? <Tooltip content={rotulo} position="right">{item}</Tooltip> : item;
}

/** Campo em linha: rótulo à esquerda, valor à direita, 32 de altura — no lugar do cartão. */
function LinhaDeCampo({ icone: Icone, rotulo, children }: { icone: Icon; rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-8 items-center gap-2">
      <span className="flex w-36 shrink-0 items-center gap-2 text-body-md text-muted-foreground">
        <Icone size={14} weight="regular" aria-hidden="true" className="shrink-0" />
        <span className="truncate">{rotulo}</span>
      </span>
      <div className="min-w-0 flex-1 text-body-md text-foreground">{children}</div>
    </div>
  );
}

function PainelDoRegistro({
  lead,
  aoEditar,
  aoFechar,
  telaCheia,
  aoAlternarTelaCheia,
}: {
  lead: Lead;
  aoEditar: (campos: Partial<Lead>) => void;
  aoFechar: () => void;
  telaCheia: boolean;
  aoAlternarTelaCheia: () => void;
}) {
  const [aba, setAba] = React.useState("geral");
  const Tipo = lead.tipo === "empresa" ? Buildings : User;
  const Expandir = telaCheia ? ArrowsInSimple : ArrowsOutSimple;
  return (
    <aside aria-label={`Lead ${lead.nome}`} className={cn("flex min-h-0 flex-col border-l border-border", telaCheia ? "min-w-0 flex-1" : "w-[480px] max-w-full shrink-0")}>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
        <Avatar nome={lead.nome} size="sm" className="shrink-0" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col">
          <h2 className="truncate text-h4 text-foreground">{lead.nome}</h2>
          <p className="flex min-w-0 items-center gap-1 text-caption text-muted-foreground">
            <Tipo size={12} weight="regular" aria-hidden="true" className="shrink-0" />
            <span className="truncate">{lead.empresa}</span>
          </p>
        </div>
        <Tooltip content={telaCheia ? "Voltar ao painel" : "Abrir em tela cheia"}>
          <Button variant="ghost" size="icon-sm" aria-label={telaCheia ? "Voltar ao painel" : "Abrir em tela cheia"} onClick={aoAlternarTelaCheia}>
            <Expandir size={16} weight="regular" />
          </Button>
        </Tooltip>
        <BotaoFechar rotulo="Fechar o lead" onClick={aoFechar} />
      </header>
      <Tabs
        id="proposta-registro"
        rotulo="Seções do lead"
        atual={aba}
        aoEscolher={setAba}
        itens={[
          { valor: "geral", rotulo: "Visão geral" },
          { valor: "atividades", rotulo: "Atividades" },
          { valor: "arquivos", rotulo: "Arquivos" },
        ]}
        className="shrink-0 border-b border-border px-3"
      />
      <div className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3", rolagemDiscreta)}>
        {aba === "geral" ? (
          <>
            <div className="flex flex-col">
              <LinhaDeCampo icone={FunnelSimple} rotulo="Etapa">
                <Select
                  size="sm"
                  rotulo="Etapa do funil"
                  opcoes={ETAPAS.map((e) => ({ valor: e.id, rotulo: e.rotulo }))}
                  valor={lead.etapa}
                  aoEscolher={(v) => aoEditar({ etapa: v as EtapaId })}
                />
              </LinhaDeCampo>
              <LinhaDeCampo icone={CurrencyDollar} rotulo="Valor">
                <CelulaEditavel
                  valor={String(lead.valor)}
                  formatar={(v) => moeda(Number(v) || 0)}
                  inputMode="numeric"
                  rotulo={`Editar valor de ${lead.nome}`}
                  aoSalvar={(v) => aoEditar({ valor: Number(v.replace(/\D/g, "")) || 0 })}
                />
              </LinhaDeCampo>
              <LinhaDeCampo icone={User} rotulo="Atendente">
                <Tag foto="/ds/atendente.png">{lead.responsavel}</Tag>
              </LinhaDeCampo>
              <LinhaDeCampo icone={IconeDeTag} rotulo="Tags">
                <div className="flex flex-wrap gap-1">
                  {tagsDe(GRUPOS_TAGS, lead.tags).map((t) => (
                    <Tag key={t.id} status={t.status}>
                      {t.rotulo}
                    </Tag>
                  ))}
                </div>
              </LinhaDeCampo>
              <LinhaDeCampo icone={Phone} rotulo="Telefone">
                <CelulaEditavel valor={lead.telefone} rotulo={`Editar telefone de ${lead.nome}`} aoSalvar={(v) => aoEditar({ telefone: v })} />
              </LinhaDeCampo>
              <LinhaDeCampo icone={EnvelopeSimple} rotulo="E-mail">
                <CelulaEditavel valor={lead.email} rotulo={`Editar e-mail de ${lead.nome}`} aoSalvar={(v) => aoEditar({ email: v })} />
              </LinhaDeCampo>
              <LinhaDeCampo icone={MapPin} rotulo="Cidade">
                <CelulaEditavel valor={lead.cidade} rotulo={`Editar cidade de ${lead.nome}`} aoSalvar={(v) => aoEditar({ cidade: v })} />
              </LinhaDeCampo>
            </div>
          </>
        ) : aba === "atividades" ? (
          <LinhaDoTempo
            eventos={[
              { id: "1", titulo: "Proposta enviada por e-mail", detalhes: [lead.responsavel, "ontem", "17:10"], icone: EnvelopeSimple },
              { id: "2", titulo: `Entrou em ${etapaPor(ETAPAS, lead.etapa).rotulo}`, detalhes: ["Automação", `há ${lead.dias} dias`], icone: FlowArrow },
              { id: "3", titulo: "Lead criado", detalhes: [lead.canal, "12/09"], icone: Handshake },
            ]}
          />
        ) : (
          <p className="text-body-sm text-muted-foreground">Nenhum arquivo neste lead.</p>
        )}
      </div>
    </aside>
  );
}

export function Proposta() {
  const [leads, setLeads] = React.useState<Lead[]>(LEADS);
  const [recolhida, setRecolhida] = React.useState(false);
  const [abertoId, setAbertoId] = React.useState<string | null>(null);
  const [telaCheia, setTelaCheia] = React.useState(false);
  const ajustes = useAjustesDaTabela(COLUNAS_DA_LISTA, { memoria: "proposta-visual" });
  const aberto = leads.find((l) => l.id === abertoId) ?? null;
  const total = leads.reduce((n, l) => n + l.valor, 0);
  const editar = (id: string, campos: Partial<Lead>) => setLeads((l) => l.map((x) => (x.id === id ? { ...x, ...campos } : x)));

  // abaixo de 1280 a navegação nasce recolhida, como na tela base
  React.useEffect(() => {
    if (window.innerWidth < 1280) setRecolhida(true);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* 3 · navegação plana: sem cartão, 220 aberta e 48 recolhida, item de 32 */}
      <nav aria-label="Navegação principal" className={cn("hidden shrink-0 flex-col gap-4 py-3 lg:flex", recolhida ? "w-12 px-2" : "w-[220px] px-2")}>
        <div className={cn("flex h-8 items-center", recolhida ? "justify-center" : "justify-between pl-2")}>
          {recolhida ? null : <LogoDataCrazy className="text-surface-inverse" />}
          <Tooltip content={recolhida ? "Expandir menu" : "Recolher menu"} position="right">
            <Button variant="ghost" size="icon-sm" aria-label={recolhida ? "Expandir menu" : "Recolher menu"} aria-expanded={!recolhida} onClick={() => setRecolhida((r) => !r)}>
              <SidebarSimple size={16} weight="regular" />
            </Button>
          </Tooltip>
        </div>
        <div className="flex flex-col gap-0.5">
          {PRINCIPAIS.map((r) => (
            <ItemDaNavegacao key={r.rotulo} icone={r.icone} rotulo={r.rotulo} selecionado={r.rotulo === "Pipelines"} recolhida={recolhida} />
          ))}
        </div>
        {recolhida ? null : (
          <div className="flex flex-col gap-0.5">
            <p className="px-2 pb-1 text-caption text-muted-foreground">Favoritos</p>
            {FAVORITOS.map((f, i) => (
              <ItemDaNavegacao key={f} icone={Star} rotulo={f} selecionado={false} recolhida={false} className={cn("h-8 w-full justify-start gap-2 px-2 text-body-lg", i === 0 && "text-foreground")} />
            ))}
          </div>
        )}
        <div className="mt-auto flex flex-col gap-0.5">
          <ItemDaNavegacao icone={Question} rotulo="Ajuda" recolhida={recolhida} />
          <ItemDaNavegacao icone={Gear} rotulo="Configurações" recolhida={recolhida} />
          <Button asChild variant="ghost" className={cn("h-8 w-full gap-2 px-2 text-body-lg", recolhida ? "justify-center" : "justify-start")}>
            <Link href="/" aria-label={recolhida ? "Voltar ao design system" : undefined}>
              <ArrowLeft size={16} weight="regular" />
              {recolhida ? null : <span className="truncate">Voltar ao design system</span>}
            </Link>
          </Button>
          <div className={cn("mt-2 flex items-center gap-2", recolhida ? "justify-center" : "px-2")}>
            <Avatar nome="Gabriel Correa" size="xs" className="shrink-0 bg-accent" />
            {recolhida ? null : <span className="min-w-0 truncate text-body-lg text-foreground">Gabriel Correa</span>}
          </div>
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 p-2 lg:pl-0">
        {/* 1 · uma superfície só: tudo no mesmo painel, separado por traço */}
        <div className="flex min-w-0 flex-1 overflow-hidden rounded-lg border border-border bg-card">
          <div className={cn("flex min-w-0 flex-1 flex-col", aberto && telaCheia && "hidden")}>
            {/* 2 · topo de uma linha: 48, título de 13 ao lado da trilha, ações de 28 */}
            <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
              <Kanban size={16} weight="regular" aria-hidden="true" className="shrink-0 text-muted-foreground" />
              <p className="hidden shrink-0 text-body-lg text-muted-foreground sm:block">Pipelines /</p>
              <h1 className="truncate text-h4 text-foreground">Comercial</h1>
              <div className="ml-auto flex shrink-0 items-center gap-1">
                <Tooltip content="Pesquisar" position="bottom">
                  <Button variant="ghost" size="icon-sm" aria-label="Pesquisar">
                    <MagnifyingGlass size={16} weight="regular" />
                  </Button>
                </Tooltip>
                <Tooltip content="Notificações" position="bottom">
                  <Button variant="ghost" size="icon-sm" aria-label="Notificações">
                    <Bell size={16} weight="regular" />
                  </Button>
                </Tooltip>
                <Button size="sm" onClick={() => toast({ variant: "info", titulo: "Novo lead", descricao: "Na proposta, o botão é o mesmo: só ficou com 28 de altura." })}>
                  <Plus size={16} weight="regular" />
                  Novo lead
                </Button>
              </div>
            </header>

            {/* barra de visão: 40. Visões à esquerda, filtrar / agrupar / colunas à direita, com texto */}
            <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border px-3">
              <div role="group" aria-label="Visualização" className="flex items-center gap-0.5">
                {(
                  [
                    ["Quadro", Kanban, false],
                    ["Lista", Rows, true],
                    ["Calendário", CalendarBlank, false],
                  ] as const
                ).map(([rotulo, Icone, atual]) => (
                  <Button key={rotulo} variant="ghost" size="sm" aria-pressed={atual} className={cn("gap-1.5 px-2", atual && "bg-accent text-foreground")}>
                    <Icone size={16} weight="regular" />
                    {rotulo}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="gap-1.5 px-2">
                  <FunnelSimple size={16} weight="regular" />
                  Filtrar
                </Button>
                <BotaoAgrupar ajustes={ajustes} />
                <BotaoColunas ajustes={ajustes} />
              </div>
            </div>

            <Lista
              semMoldura
              classeDaTabela="[&_tbody_td]:py-0.5"
              etapas={ETAPAS}
              leads={leads}
              ajustes={ajustes}
              aberto={abertoId}
              aoAbrir={(l) => setAbertoId(l.id)}
              aoMoverEmMassa={(ids, etapa) => setLeads((l) => l.map((x) => (ids.includes(x.id) ? { ...x, etapa } : x)))}
              aoExcluirEmMassa={(ids) => setLeads((l) => l.filter((x) => !ids.includes(x.id)))}
              aoEditar={editar}
            />

            {/* rodapé de contagem, como a linha de cálculo do Twenty */}
            <footer className="flex h-8 shrink-0 items-center gap-4 border-t border-border px-3 text-caption text-muted-foreground">
              <span className="tabular-nums">{leads.length} negócios</span>
              <span className="tabular-nums">Soma {moeda(total)}</span>
            </footer>
          </div>

          {/* 4 · o registro abre ao lado e EMPURRA a lista; o botão de expandir leva à tela cheia */}
          {aberto ? (
            <PainelDoRegistro
              lead={aberto}
              aoEditar={(campos) => editar(aberto.id, campos)}
              aoFechar={() => {
                setAbertoId(null);
                setTelaCheia(false);
              }}
              telaCheia={telaCheia}
              aoAlternarTelaCheia={() => setTelaCheia((t) => !t)}
            />
          ) : null}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
