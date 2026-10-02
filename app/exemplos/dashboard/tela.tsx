"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChatCircleDots,
  Clock,
  CurrencyDollar,
  FlowArrow,
  FunnelSimple,
  Gear,
  Globe,
  Handshake,
  Headset,
  House,
  Kanban,
  Lightning,
  Question,
  Robot,
  ShareNetwork,
  User,
  UsersThree,
  WarningCircle,
  Star,
} from "@phosphor-icons/react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardChart, CardDonut, CardHeader, CardList } from "@/components/ui/card";
import {
  CelulaLead,
  CelulaProgresso,
  DataTable,
  DataTableCell,
  DataTableRow,
  DataTableToolbar,
  type ColunaTabela,
} from "@/components/ui/data-table";
import { Drawer } from "@/components/ui/drawer";
import { Notificacoes, type Notificacao } from "@/components/ui/header";
import { IconeDeMarca } from "@/components/ui/icone-de-marca";
import { KpiCard } from "@/components/ui/kpi-card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Select } from "@/components/ui/select";
import { SidebarBrand, SidebarGrupo, SidebarItem, SidebarRodape, SidebarThemeSwitch, SidebarTopo, SidebarUser } from "@/components/ui/sidebar";
import { Tag } from "@/components/ui/tag";
import { TelaBase } from "@/components/ui/tela-base";
import { Toaster, toast } from "@/components/ui/toast";
import { useTema } from "@/lib/tema";
import { cn } from "@/lib/utils";
import { LeadParado } from "./lead-parado";
import { PARADOS, PERIODOS, RECORTES, moeda, moedaCurta, percentual, type Canal, type Periodo } from "./dados";

/* ---------------------------------------------------------------------------
   Tela de exemplo — NÃO é componente do design system.

   O dashboard do CRM numa composição só de peças do DS: KpiCard, Card (barras,
   rosca, lista), DataTable densa, SegmentedControl, IconeDeMarca. Nenhum
   estilo novo. A leitura vai do resumo ao detalhe, em três faixas:
   1. o que aconteceu — quatro indicadores, com a direção só onde ela existe;
   2. como aconteceu — a série no tempo ao lado da repartição por origem;
   3. o que fazer agora — os negócios parados ao lado de quem está fechando.
   Gráfico e tabela convivem lado a lado: é o padrão das referências (Twenty,
   Attio) que o time pediu.
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
  { id: "1", icone: WarningCircle, titulo: "Negócio parado há 11 dias", detalhe: "Transportes Serra Azul segue em Proposta sem interação registrada.", quando: "agora", lida: false },
  { id: "2", icone: Handshake, titulo: "Negócio ganho", detalhe: "Clínica Vitalis assinou o plano anual — R$ 18.400.", quando: "há 2 h", lida: true },
];

const COLUNAS: ColunaTabela[] = [
  // os pisos somam 720: a tabela cabe ao lado do ranking sem rolar; abaixo disso, rola
  { chave: "lead", rotulo: "Lead", icone: User, peso: 2.2, minimo: 170 },
  { chave: "etapa", rotulo: "Etapa", icone: FunnelSimple, peso: 1.8, minimo: 150 },
  { chave: "origem", rotulo: "Origem", icone: ShareNetwork, peso: 1.3, minimo: 110 },
  { chave: "atendente", rotulo: "Atendente", icone: Headset, peso: 1.2, minimo: 105 },
  { chave: "valor", rotulo: "Valor", icone: CurrencyDollar, peso: 1.2, minimo: 100, alinharFim: true },
  { chave: "dias", rotulo: "Parado", icone: Clock, peso: 1, minimo: 85, alinharFim: true },
];

/** Marca é `IconeDeMarca`; o que não é marca é Phosphor. */
function IconeDoCanal({ canal }: { canal: Canal }) {
  if (canal === "WhatsApp") return <IconeDeMarca marca="whatsapp" tamanho={14} />;
  if (canal === "Instagram") return <IconeDeMarca marca="instagram" tamanho={14} />;
  const Glifo = canal === "Site" ? Globe : Handshake;
  return <Glifo size={14} weight="regular" aria-hidden="true" className="shrink-0 text-muted-foreground" />;
}

const RECORTES_DO_GRAFICO = [
  { valor: "valor", rotulo: "Valor" },
  { valor: "quantidade", rotulo: "Quantidade" },
];

export function Tela({
  aoNavegar,
  memoria = "dashboard",
}: {
  /** Só no protótipo, que junta as telas: recebe o destino clicado na navegação e devolve `true` quando troca de tela. */
  aoNavegar?: (destino: string) => boolean;
  /** Chave da memória da sidebar. No protótipo é uma só, para ela não mudar de estado entre as telas. */
  memoria?: string;
} = {}) {
  const [rota, setRota] = React.useState("Início");
  const [periodo, setPeriodo] = React.useState<Periodo>("30");
  const [recorte, setRecorte] = React.useState("valor");
  const [notificacoes, setNotificacoes] = React.useState(NOTIFICACOES);
  const { tema, mudar } = useTema();

  const dados = RECORTES[periodo];
  const receita = dados.receita.reduce((n, b) => n + b.valor, 0);
  // por quantidade, a mesma série em negócios: o ticket médio do exemplo é de ~R$ 5,8 mil
  const barras = recorte === "valor" ? dados.receita : dados.receita.map((b) => ({ ...b, valor: Math.round(b.valor / 5800) }));
  const principal = dados.origens[0];
  // os negócios parados são estado da tela: o Drawer edita a linha
  const [parados, setParados] = React.useState(PARADOS);
  const [abertoId, setAbertoId] = React.useState<string | null>(null);
  const aberto = parados.find((p) => p.id === abertoId) ?? null;
  const emRisco = parados.reduce((n, p) => n + p.valor, 0);

  return (
    <TelaBase
      memoria={memoria}
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
        titulo: "Visão geral",
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
        // Dashboard não tem ação principal: a fileira é só o período, que vale para a tela toda.
        acoes: (
          <SegmentedControl
            rotulo="Período"
            atual={periodo}
            aoEscolher={(v) => setPeriodo(v as Periodo)}
            itens={PERIODOS}
          />
        ),
      }}
    >
      <div className="flex min-w-0 flex-col gap-3">
        {/* 1 · O que aconteceu. Quatro por fileira só acima de 1280: com a Sidebar aberta, antes disso o número trunca. */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {dados.indicadores.map((i) => (
            <KpiCard key={i.titulo} title={i.titulo} value={i.valor} caption={i.apoio} trend={i.tendencia} />
          ))}
        </div>

        {/* 2 · Como aconteceu: a série no tempo e, ao lado, de onde veio. */}
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
          <Card className="gap-5 xl:col-span-2">
            <CardHeader
              title="Receita ganha"
              value={recorte === "valor" ? moedaCurta(receita) : `${barras.reduce((n, b) => n + b.valor, 0)} negócios`}
              subtitle="Negócios ganhos no período, por data de fechamento"
              action={<Select rotulo="Ver por" opcoes={RECORTES_DO_GRAFICO} valor={recorte} aoEscolher={setRecorte} />}
            />
            <CardChart barras={barras} formatar={recorte === "valor" ? moeda : (v) => `${v} negócio(s)`} />
          </Card>

          <Card className="justify-between gap-5">
            <CardHeader title="Negócios por origem" subtitle="De onde vieram os negócios criados no período" />
            <CardDonut fatias={dados.origens} destaque={percentual(principal.percentual)} rotulo={principal.nome} formatar={percentual} />
          </Card>
        </div>

        {/* 3 · O que fazer agora: os parados e quem está fechando. A tabela é a própria superfície — não vai
            dentro de Card. `items-start`: cada bloco termina onde o conteúdo termina, sem esticar para igualar. */}
        <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-3">
          <div className="min-w-0 overflow-hidden rounded-md border border-border bg-card xl:col-span-2">
            <DataTableToolbar rotulo="Precisam de atenção" total={`${parados.length} negócios parados · ${moeda(emRisco)}`} />
            <DataTable colunas={COLUNAS} className="rounded-none border-0 border-t">
              {parados.map((p) => (
                <DataTableRow key={p.id} selecionada={p.id === abertoId} aoSelecionar={() => setAbertoId(p.id)}>
                  <DataTableCell coluna="lead">
                    {/* o nome abre o lead no Drawer */}
                    <CelulaLead nome={p.nome} avatar aoAbrir={() => setAbertoId(p.id)} />
                  </DataTableCell>
                  <DataTableCell coluna="etapa">
                    <CelulaProgresso etapa={p.etapa} percentual={p.percentual} tom={p.tom} />
                  </DataTableCell>
                  <DataTableCell coluna="origem">
                    <p className="flex min-w-0 items-center gap-1.5 text-label-lg text-foreground" title={`Origem: ${p.canal}`}>
                      <IconeDoCanal canal={p.canal} />
                      <span className="min-w-0 truncate">{p.canal}</span>
                    </p>
                  </DataTableCell>
                  <DataTableCell coluna="atendente">
                    <Tag>{p.atendente}</Tag>
                  </DataTableCell>
                  <DataTableCell coluna="valor" className="text-right">
                    <span className="text-label-lg tabular-nums text-foreground">{moeda(p.valor)}</span>
                  </DataTableCell>
                  <DataTableCell coluna="dias" className="text-right">
                    <span
                      title={`Parado há ${p.dias} dias em ${p.etapa}`}
                      className={cn("inline-flex items-center gap-1 text-label-lg tabular-nums", p.dias >= 7 ? "text-warning" : "text-muted-foreground")}
                    >
                      {p.dias >= 7 ? <WarningCircle size={14} weight="regular" aria-hidden="true" /> : <Clock size={14} weight="regular" aria-hidden="true" />}
                      {p.dias}d
                    </span>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTable>
          </div>

          <Card className="gap-2">
            <CardHeader title="Quem está fechando" subtitle="Negócios ganhos por atendente no período" />
            <CardList linhas={dados.ranking} />
          </Card>
        </div>
      </div>
      {/* O lead abre no Drawer do design system — o mesmo da página do Drawer. */}
      <Drawer aberto={Boolean(aberto)} aoFechar={() => setAbertoId(null)} rotulo={`Lead ${aberto?.nome ?? ""}`}>
        {aberto ? (
          <LeadParado
            negocio={aberto}
            aoEditar={(campos) => setParados((lista) => lista.map((p) => (p.id === aberto.id ? { ...p, ...campos } : p)))}
            aoFechar={() => setAbertoId(null)}
          />
        ) : null}
      </Drawer>
      <Toaster />
    </TelaBase>
  );
}
