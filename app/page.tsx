"use client";

import {
  ChartBar,
  Funnel,
  FunnelSimple,
  Handshake,
  House,
  Kanban,
  MagnifyingGlass,
  Plus,
  Robot,
  Trash,
  UsersThree,
} from "@phosphor-icons/react";
import { IconeDeMarca } from "@/components/ui/icone-de-marca";
import { navegacao } from "@/components/ds/nav";
import { PaginaDS, Secao, ComoFunciona, Chip, CardComponente } from "@/components/ds/preview";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { KpiCard } from "@/components/ui/kpi-card";
import { SidebarGrupo, SidebarItem } from "@/components/ui/sidebar";
import { TooltipContent } from "@/components/ui/tooltip";
import { Toast } from "@/components/ui/toast";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, Radio } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { DateRangePicker, type RotulosDoDatePicker } from "@/components/ui/date-picker";
import { Header, HeaderNotificacoes } from "@/components/ui/header";
import { Breadcrumb, type ItemBreadcrumb } from "@/components/ui/breadcrumb";
import { Pagination } from "@/components/ui/pagination";
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Calendario } from "@/components/ui/calendario";
import { DataTable, DataTableRow, DataTableCell, CelulaLead, CelulaProgresso } from "@/components/ui/data-table";
import { ModalPainel } from "@/components/ui/modal";

const total = navegacao.reduce((n, c) => n + c.itens.length, 0);
const prontos = navegacao.reduce((n, c) => n + c.itens.filter((i) => i.pronto).length, 0);
const percentual = Math.round((prontos / total) * 100);

const rampa = ["50", "100", "200", "300", "400", "500", "600", "700"];
const estados = ["success", "warning", "destructive", "info"];
const degrausDeEspaco = [4, 8, 16, 24, 32, 48];
const degrausDeRaio = [
  { nome: "none", classe: "rounded-none" },
  { nome: "sm", classe: "rounded-sm" },
  { nome: "md", classe: "rounded-md" },
  { nome: "lg", classe: "rounded-lg" },
  { nome: "xl", classe: "rounded-xl" },
  { nome: "full", classe: "rounded-full" },
];
const alturas = [
  { nome: "sm", classe: "shadow-sm" },
  { nome: "md", classe: "shadow-md" },
  { nome: "lg", classe: "shadow-lg" },
  { nome: "xl", classe: "shadow-xl" },
];

// Os textos são literais porque a doc é em português; no CRM vêm do next-intl.
const rotulosTrilha = { rotulo: "Trilha de navegação", rotuloRecolhidos: (n: number) => `Mostrar ${n} níveis ocultos` };
// Sem href: o card já é um link, e <a> dentro de <a> não vale.
const trilhaLonga: ItemBreadcrumb[] = [
  { rotulo: "DataCrazy", avatar: { destaque: true } },
  { rotulo: "Comercial" },
  { rotulo: "Pipelines" },
  { rotulo: "Vendas B2B", icone: Kanban },
  { rotulo: "Negócio #4821", icone: Handshake },
];
const rotulosData: RotulosDoDatePicker = {
  vazio: "Selecione um período",
  atalhos: "Selecione",
  mes: "Mês",
  ano: "Ano",
  mesAnterior: "Mês anterior",
  proximoMes: "Próximo mês",
  aplicar: "Aplicar",
  cancelar: "Cancelar",
};
// Datas fixas: `new Date()` daria um texto no servidor e outro no navegador.
const periodoDoPreview = { inicio: new Date(2026, 8, 1), fim: new Date(2026, 8, 15) };
const negociosDoPreview = [
  { nome: "Giovanna", etapa: "Proposta", percentual: 44 },
  { nome: "Breno Ramos", etapa: "Negociação", percentual: 72 },
];

// Preview ao vivo de cada item, por rota. Item sem página ainda cai no esqueleto.
const previews: Record<string, React.ReactNode> = {
  "/foundations/motion": (
    <div className="flex w-56 max-w-full flex-col gap-2">
      {[["fast", 150], ["base", 200], ["slow", 280]].map(([nome, ms]) => (
        <div key={nome} className="flex items-center gap-2">
          <span className="w-9 font-mono text-caption text-subtle-foreground">{nome}</span>
          <div className="h-2 rounded-full bg-primary" style={{ width: `${(Number(ms) / 280) * 100}%` }} />
          <span className="font-mono text-caption text-muted-foreground">{ms}ms</span>
        </div>
      ))}
    </div>
  ),
  "/": (
    <div className="w-56 max-w-full">
      <p className="text-display text-foreground">
        {prontos} <span className="text-subtle-foreground">/ {total}</span>
      </p>
      <p className="mt-0.5 text-body-md text-muted-foreground">itens implementados</p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-primary" style={{ width: `${percentual}%` }} />
      </div>
      <p className="mt-2 font-mono text-caption text-subtle-foreground">
        {navegacao.length} categorias · {percentual}%
      </p>
    </div>
  ),
  "/getting-started/installation": (
    <div className="w-60 max-w-full rounded-md border border-border bg-card p-3 font-mono text-body-sm">
      <p className="text-subtle-foreground">
        <span className="text-primary">$</span> npx shadcn add @datacrazy/setup
      </p>
      <p className="mt-1 text-subtle-foreground">
        <span className="text-primary">$</span> npx shadcn mcp init
      </p>
      <p className="mt-2 text-foreground">Claude Code conectado</p>
    </div>
  ),
  "/foundations/color": (
    <div className="w-60 max-w-full">
      <div className="flex overflow-hidden rounded-md border border-border">
        {rampa.map((n) => (
          <div key={n} className="h-10 flex-1" style={{ background: `hsl(var(--blue-${n}))` }} />
        ))}
      </div>
      <div className="mt-2 flex gap-1.5">
        {estados.map((t) => (
          <div
            key={t}
            className="h-6 flex-1 rounded border border-border"
            style={{ background: `hsl(var(--${t}))` }}
          />
        ))}
      </div>
      <p className="mt-2 font-mono text-caption text-subtle-foreground">
        --blue-50 → --blue-700 · 4 estados
      </p>
    </div>
  ),
  "/foundations/typography": (
    <div className="w-60 max-w-full">
      <p className="truncate text-h1 text-foreground">Automatize seu</p>
      <p className="text-body-md text-muted-foreground">Corpo em 12px, Regular</p>
      <p className="mt-1 font-mono text-caption text-subtle-foreground">Geist · Geist Mono</p>
    </div>
  ),
  "/foundations/icons": (
    <div className="flex items-center gap-4 text-foreground">
      <House size={24} weight="regular" />
      <Funnel size={24} weight="regular" />
      <MagnifyingGlass size={24} weight="regular" />
      <ChartBar size={24} weight="regular" />
      <Robot size={24} weight="regular" />
    </div>
  ),
  "/actions/button": (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button>
        <Plus size={16} weight="regular" />
        Nova campanha
      </Button>
      <Button variant="secondary">Filtros</Button>
      <Button variant="ghost">Cancelar</Button>
    </div>
  ),
  "/data-display/kpi-card": (
    <div className="w-56">
      <KpiCard title="Total em aberto" value="R$ 3,00K" caption="37 negócios" trend="neutral" />
    </div>
  ),
  "/navigation/sidebar": (
    <div className="w-52 max-w-full">
      <SidebarGrupo>
        <SidebarItem icone={House}>Início</SidebarItem>
        <SidebarItem icone={Kanban} selecionado>
          Pipelines
        </SidebarItem>
        <SidebarItem icone={UsersThree}>Leads</SidebarItem>
      </SidebarGrupo>
    </div>
  ),
  "/data-display/tag": (
    <div className="flex w-56 max-w-full flex-wrap items-center justify-center gap-1">
      <Tag foto="/ds/atendente.png">Esther</Tag>
      <Tag>Lista de leads</Tag>
      <Tag status="destructive">Abandonou</Tag>
      <Tag status="success">Agendado</Tag>
    </div>
  ),
  "/feedback/tooltip": <TooltipContent>Copiar para a área de transferência</TooltipContent>,
  "/feedback/toast": <Toast titulo="Negócio salvo" descricao="As alterações já aparecem no funil." />,
  "/navigation/tabs": (
    <Tabs
      id="preview-tabs"
      rotulo="Seções do lead"
      itens={[
        { valor: "historico", rotulo: "Histórico" },
        { valor: "atividades", rotulo: "Atividades" },
        { valor: "arquivos", rotulo: "Arquivos" },
      ]}
      atual="historico"
      aoEscolher={() => {}}
    />
  ),
  "/foundations/spacing": (
    <div className="flex w-60 max-w-full flex-col gap-1.5">
      {degrausDeEspaco.map((px) => (
        <div key={px} className="flex items-center gap-3">
          <span className="w-6 shrink-0 text-right font-mono text-caption text-subtle-foreground">{px}</span>
          <div className="h-2 rounded-sm bg-primary" style={{ width: px * 3 }} />
        </div>
      ))}
    </div>
  ),
  "/foundations/radius": (
    <div className="flex items-end gap-2.5">
      {degrausDeRaio.map((d) => (
        <div key={d.nome} className="flex flex-col items-center gap-1.5">
          <div className={`size-8 border border-border bg-card ${d.classe}`} />
          <span className="font-mono text-caption text-subtle-foreground">{d.nome}</span>
        </div>
      ))}
    </div>
  ),
  "/foundations/elevation": (
    <div className="flex items-center gap-4">
      {alturas.map((a) => (
        <div
          key={a.nome}
          className={`grid size-12 place-items-center rounded-md bg-card font-mono text-caption text-subtle-foreground ${a.classe}`}
        >
          {a.nome}
        </div>
      ))}
    </div>
  ),
  "/forms/input": (
    <div className="w-60 max-w-full">
      <Input rotulo="E-mail" placeholder="Exemplo: email@dominio.com" />
    </div>
  ),
  // Estáticos de propósito: o card já é um link, e controle dentro de link não vale.
  "/forms/combobox": (
    <div className="w-56 max-w-full rounded-lg border border-overlay-border bg-overlay-bg p-1.5 shadow-lg">
      <div className="flex h-8 items-center gap-2 rounded-md border border-input-border px-2 text-body-md text-input-placeholder">
        <MagnifyingGlass size={14} weight="regular" aria-hidden="true" />
        Buscar origem
      </div>
      <div className="mt-1 flex h-8 items-center gap-2 rounded-sm bg-overlay-item-hover px-2 text-label-lg text-foreground">
        <IconeDeMarca marca="whatsapp" />
        WhatsApp
      </div>
      <div className="flex h-8 items-center gap-2 rounded-sm px-2 text-label-lg text-muted-foreground">
        <IconeDeMarca marca="instagram" />
        Instagram
      </div>
    </div>
  ),
  "/navigation/barra-de-filtros": (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      <span className="inline-flex h-7 items-center gap-1.5 rounded-md bg-button-soft px-2.5 text-button text-button-soft-foreground">
        <FunnelSimple size={14} weight="regular" aria-hidden="true" />
        <span className="font-normal">Etapa:</span>
        Proposta
      </span>
      <span className="inline-flex h-7 items-center gap-1.5 rounded-md bg-button-soft px-2.5 text-button text-button-soft-foreground">
        <span className="font-normal">Origem:</span>
        WhatsApp
      </span>
      <span className="inline-flex h-7 items-center gap-1.5 px-2.5 text-button text-muted-foreground">
        <Plus size={14} weight="regular" aria-hidden="true" />
        Filtro
      </span>
    </div>
  ),
  "/forms/checkbox": (
    <div className="flex flex-col gap-2.5">
      <Checkbox defaultChecked>Negócios em aberto</Checkbox>
      <Checkbox indeterminado>Todas as colunas</Checkbox>
      <Checkbox>Mostrar arquivados</Checkbox>
    </div>
  ),
  "/forms/radio-group": (
    <RadioGroup rotulo="Tipo de pessoa" valorPadrao="fisica">
      <Radio value="fisica">Pessoa física</Radio>
      <Radio value="juridica">Pessoa jurídica</Radio>
    </RadioGroup>
  ),
  "/forms/switch": (
    <div className="flex flex-col gap-2.5">
      <Switch defaultChecked>Notificações por e-mail</Switch>
      <Switch>Resumo semanal</Switch>
    </div>
  ),
  "/forms/date-picker": (
    <DateRangePicker valor={periodoDoPreview} onValorChange={() => {}} locale="pt-BR" rotulos={rotulosData} />
  ),
  "/navigation/header": (
    <Header
      data-superficie
      className="w-full rounded-md border bg-card px-4 py-3"
      titulo="Negócios"
      subtitulo="37 em aberto"
      trilha={<Breadcrumb ancestrais {...rotulosTrilha} itens={[trilhaLonga[0], trilhaLonga[3]]} />}
      utilitarios={<HeaderNotificacoes rotulo="Notificações: 5 não lidas" contagem={5} />}
      acoes={
        <Button size="sm">
          <Plus size={16} weight="regular" />
          Novo
        </Button>
      }
    />
  ),
  "/navigation/breadcrumb": <Breadcrumb {...rotulosTrilha} itens={trilhaLonga} className="max-w-full" />,
  "/navigation/pagination": (
    <Pagination paginas={4} atual={2} />
  ),
  "/data-display/card": (
    <Card className="w-64 max-w-full">
      <CardHeader title="Dados diários" value="R$ 3,00K" subtitle="Visualização por valor dos negócios" />
    </Card>
  ),
  "/data-display/avatar": (
    <div className="flex items-center gap-4">
      <Avatar nome="Rafael Pinto Pinheiro" size="sm" />
      <Avatar nome="Esther Lima" src="/ds/atendente.png" size="md" />
      <Avatar nome="Joel Jota" size="lg" />
    </div>
  ),
  "/data-display/table": (
    <DataTable
      layout="compacta"
      className="w-72 max-w-full"
      colunas={[
        { chave: "lead", rotulo: "Lead", peso: 230 },
        { chave: "etapa", rotulo: "Etapa", peso: 200 },
      ]}
    >
      {negociosDoPreview.map((n) => (
        <DataTableRow key={n.nome}>
          <DataTableCell primeira>
            <CelulaLead nome={n.nome} />
          </DataTableCell>
          <DataTableCell ultima>
            <CelulaProgresso etapa={n.etapa} percentual={n.percentual} />
          </DataTableCell>
        </DataTableRow>
      ))}
    </DataTable>
  ),
  "/data-display/calendario": (
    // a semana inteira mede mais que a caixa de 176: reduzida, sem a barra
    <div className="pointer-events-none w-[420px] origin-center scale-[0.6]">
      <Calendario
        locale="pt-BR"
        visao="semana"
        referencia={new Date(2026, 8, 15)}
        aoMudarReferencia={() => {}}
        hoje={new Date(2026, 8, 17)}
        eventos={[
          { id: "a", data: "2026-09-15", rotulo: "Instituto Raízes" },
          { id: "b", data: "2026-09-17", rotulo: "Marina Alvarenga", tom: "rosa" },
          { id: "c", data: "2026-09-17", rotulo: "Oficina Farol", tom: "ambar" },
          { id: "d", data: "2026-09-18", rotulo: "Campo Vivo Agro", tom: "verde" },
        ]}
      />
    </div>
  ),
  "/feedback/modal": (
    // o painel mede 400 × 240; reduzido para caber na caixa de 176
    <div className="origin-center scale-[0.66]">
      <ModalPainel
        variant="destructive"
        titulo="Excluir negócio?"
        descricao="Ele sai do funil e do histórico do lead. Não dá para desfazer."
        aoFechar={() => {}}
        acoes={
          <>
            <Button variant="outline" size="sm">Cancelar</Button>
            <Button variant="destructive" size="sm">
              <Trash size={16} weight="regular" />
              Excluir
            </Button>
          </>
        }
      />
    </div>
  ),
  "/feedback/drawer": (
    <div className="relative h-32 w-64 max-w-full overflow-hidden rounded-md border border-border bg-card">
      {/* a tela por baixo fica só à esquerda: não passa por trás do painel */}
      <div className="flex w-28 flex-col gap-2 p-3">
        <div className="h-2 w-2/3 rounded bg-border" />
        <div className="h-2 w-full rounded bg-border" />
        <div className="h-2 w-1/2 rounded bg-border" />
      </div>
      <div className="absolute inset-y-0 right-0 flex w-36 flex-col items-start gap-2 border-l border-overlay-border bg-overlay-bg p-3 shadow-xl">
        <Avatar nome="Joel Jota" size="sm" />
        <p className="w-full truncate text-label-md text-foreground">Joel Jota</p>
        <Tag status="success">Agendado</Tag>
      </div>
    </div>
  ),
  "/feedback/painel-lateral": (
    <div className="flex h-24 w-full max-w-full overflow-hidden rounded-md border border-border bg-card">
      <div className="flex min-w-0 flex-1 flex-col">
        {["Marina Alvarenga", "Rafael Pinto", "Júlia Bastos"].map((nome, i) => (
          <p key={nome} className={`truncate border-b border-border px-2 py-1.5 text-label-md text-foreground ${i === 0 ? "bg-accent" : ""}`}>
            {nome}
          </p>
        ))}
      </div>
      <div className="flex w-1/2 flex-col gap-1.5 border-l border-border p-2">
        <p className="truncate text-label-lg text-foreground">Marina Alvarenga</p>
        <p className="flex justify-between gap-2 text-caption text-muted-foreground">
          <span>Etapa</span>
          <span className="truncate text-foreground">Novo lead</span>
        </p>
        <p className="flex justify-between gap-2 text-caption text-muted-foreground">
          <span>Valor</span>
          <span className="truncate text-foreground">R$ 18.400</span>
        </p>
      </div>
    </div>
  ),
  "/exemplos/leads": (
    <div className="flex w-full max-w-full flex-col overflow-hidden rounded-md border border-border bg-card">
      {[
        ["Ana Beatriz Ferreira", "vermelho", "Carrinho"],
        ["Bruno Henrique Souza", "verde", "Recorrente"],
        ["Daniel Martins", "amarelo", "VIP"],
      ].map(([nome, tom, tag]) => (
        <div key={nome} className="flex items-center gap-2 border-b border-border px-2 py-1 last:border-b-0">
          <Avatar nome={nome} size="xs" iniciais="duas" tom="auto" aria-hidden="true" />
          <p className="min-w-0 flex-1 truncate text-label-md text-foreground">{nome}</p>
          <Tag tom={tom as "vermelho" | "verde" | "amarelo"} status="info">
            {tag}
          </Tag>
        </div>
      ))}
    </div>
  ),
  "/exemplos/automacoes": (
    <div className="flex w-full max-w-full items-center justify-center gap-2">
      {["Início", "Mensagem", "Condição"].map((bloco, i) => (
        <div key={bloco} className="flex items-center gap-2">
          {i > 0 ? <span aria-hidden="true" className="h-px w-4 bg-subtle-foreground" /> : null}
          <p className="rounded-md border border-border bg-card px-2 py-1.5 text-label-md text-foreground">{bloco}</p>
        </div>
      ))}
    </div>
  ),
  "/exemplos/dashboard": (
    <div className="flex w-full max-w-full flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">
        {["R$ 184,6K", "118", "27,1%"].map((valor) => (
          <div key={valor} className="rounded-md border border-border bg-card p-2">
            <p className="truncate text-h4 tabular-nums text-foreground">{valor}</p>
          </div>
        ))}
      </div>
      <div className="flex h-12 items-end gap-1.5 rounded-md border border-border bg-card p-2">
        {["h-3", "h-5", "h-2", "h-6", "h-4", "h-8", "h-5", "h-7"].map((altura, i) => (
          <span key={i} className={`flex-1 rounded-sm bg-primary ${altura}`} />
        ))}
      </div>
    </div>
  ),
  "/exemplos/pipeline": (
    <div className="flex w-full max-w-full gap-2">
      {[
        { etapa: "Novo lead", ponto: "bg-subtle-foreground", cartoes: 2 },
        { etapa: "Proposta", ponto: "bg-primary", cartoes: 3 },
        { etapa: "Fechamento", ponto: "bg-success", cartoes: 1 },
      ].map((c) => (
        <div key={c.etapa} className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p className="flex items-center gap-1 truncate text-label-sm text-muted-foreground">
            <span className={`size-1.5 shrink-0 rounded-full ${c.ponto}`} />
            {c.etapa}
          </p>
          {Array.from({ length: c.cartoes }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1 rounded-md bg-card p-2 shadow-sm">
              <div className="h-1.5 w-2/3 rounded bg-border" />
              <div className="h-1.5 w-full rounded bg-border" />
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

const esqueleto = (
  <div className="flex w-52 max-w-full flex-col gap-2">
    <div className="h-3 w-2/3 rounded bg-border" />
    <div className="h-3 w-full rounded bg-border" />
    <div className="h-3 w-1/2 rounded bg-border" />
  </div>
);

const descricoes: Record<string, string> = {
  "Let's begin": "Esta página: o inventário e a regra que o sustenta.",
  "SystemCrazy": "Três comandos para o Claude Code criar telas com o DS.",
  "Color": "31 variáveis, dois modos, nenhum nome de cor.",
  "Typography": "15 papéis, de 26px a 10px, hierarquia por peso.",
  "Icons": "Phosphor num peso só: regular; fill só no selecionado (A8).",
  "Spacing": "Catorze degraus de 0 a 80px, todos da escala do Tailwind.",
  "Radius": "Sete degraus que saem de uma variável só: --radius.",
  "Elevation": "Quatro sombras, do card em repouso ao modal.",
  "Button": "Quatro variantes, três tamanhos, estados por regra.",
  "Icon Button": "Ação sem rótulo: exige tooltip e aria-label (E7).",
  "Input": "Rótulo, cinco estados e ações dentro da caixa (E6).",
  "Select": "Escolha única numa lista curta, com grupos e ícone por opção.",
  "Combobox": "Lista com busca: uma ou várias escolhas, grupos e ícones.",
  "Filtros": "Cada filtro ativo é um chip; o + Filtro traz os outros campos.",
  "Checkbox": "Alternância booleana, com estado indeterminado.",
  "Radio Group": "Escolha exclusiva: setas movem e selecionam.",
  "Switch": "Efeito imediato, sem botão de salvar.",
  "Time Picker": "Hora e data-hora, com fuso à vista.",
  "Date Picker": "Período em dois meses, com atalhos e confirmação explícita.",
  "Sidebar": "Plana: 220px que viram 48, item de 32 e Favoritos.",
  "Header": "Uma linha: trilha, título, ações e sino, por composição.",
  "Breadcrumb": "Qualquer número de níveis; passando de três, os do meio recolhem.",
  "Pagination": "Controles de página, com o resumo do que está à vista.",
  "Tabs": "Seções do mesmo registro, numa fileira que rola e nunca quebra.",
  "Card": "A superfície que carrega um bloco de dados.",
  "KPI Card": "Métrica do dashboard: valor, tendência e legenda.",
  "Tag": "A etiqueta do lead, com seletor em abas que também cria.",
  "Avatar": "Inicial em disco com anel: 32, 48 e 90px.",
  "Table": "37 negócios, sete colunas e paginação.",
  "Tooltip": "O conteúdo completo de um texto truncado (E1).",
  "Toast": "Quatro estados, com fila e pausa sob o cursor.",
  "Modal": "Grupos à esquerda, conteúdo à direita, botões à parte (G10).",
  "Drawer": "O lead pela direita: perfil, menu e cinco seções (G1).",
  "Drawer variações": "Tons, menu, linha do tempo, hierarquia, camada e as três propostas.",
  "Dashboard": "Indicadores, receita por dia e os negócios parados, numa tela.",
  "Pipeline": "O funil do CRM: arraste um lead e abra o registro.",
  "Leads": "A lista de contatos: edite tags e origem na célula e crie uma tag.",
  "Automações": "O fluxo em blocos ligados; clique num bloco e edite ao lado.",
  "Painel lateral": "O registro ao lado da lista: 480px, campos em linha.",
  "Atendimento": "WhatsApp, Instagram e site numa tela: responda, anote e edite o lead.",
};

export default function Home() {
  return (
    <PaginaDS
      titulo="Design System"
      descricao={`${prontos} de ${total} itens em ${navegacao.length} categorias, do Figma para React e Tailwind. Por trás deles, 112 variáveis lidas do arquivo em duas coleções — 31 de cor e 81 de tipografia — e um único peso de ícone em toda a interface.`}
      secoes={["Como funciona", ...navegacao.map((c) => c.titulo)]}
    >
      <ComoFunciona>
        <p>
          O DataCrazy é um CRM em produção — Next.js, Tailwind e Radix, mais de 500 empresas atendidas. Este site não
          é produto novo: é o design system sendo <span className="text-foreground">refeito por cima do que já existe</span>,
          componente a componente. A entrega é estilo shadcn, sem pacote a instalar: o componente é um arquivo em{" "}
          <Chip>components/ui/</Chip> que você copia para o CRM, junto com os tokens de <Chip>globals.css</Chip> e o{" "}
          <Chip>lib/utils.ts</Chip>.
        </p>
        <p>
          A regra que sustenta tudo tem duas metades. Cor e tipografia são{" "}
          <span className="text-foreground">espelho do Figma</span> — 31 variáveis na coleção Cor, 81 na Tipografia,
          exportadas para <Chip>globals.css</Chip> e <Chip>tailwind.config.ts</Chip>; mudou lá, reexporta, nunca se
          edita o valor aqui. Estado de interação, por outro lado, não é desenhado: hover, foco, active e disabled são{" "}
          <span className="text-foreground">derivados por regra a partir de um token que já existe</span> — é a exceção
          E-01. O hover do botão primário aponta para <Chip>primary-hover</Chip>, que já estava no arquivo; o anel de
          foco aponta para <Chip>ring</Chip>, alias de <Chip>primary</Chip>. Onde não existe token, não se inventa
          valor: decide-se com o humano e o token passa a existir. O espelho ainda tem dívida aberta —{" "}
          <Chip>success</Chip>, <Chip>warning</Chip>, <Chip>destructive</Chip> e <Chip>info</Chip> repetem o mesmo
          valor nos dois modos, que é literalmente o bug #80174 e o que a regra E4 proíbe.
        </p>
        <p>
          Os nomes não foram escolhidos por convenção, foram <span className="text-foreground">medidos</span>: uma
          varredura de 84.775 nós contou cada binding por tipo de nó. A variável chamada <Chip>Surface escura</Chip>
          {" "}tinha 1.285 preenchimentos de texto e 1.064 de vetor — era cor de texto, não superfície, e virou{" "}
          <Chip>foreground</Chip>. É por isso que nenhum token carrega nome de cor: <Chip>card</Chip> em vez de{" "}
          <Chip>Branco</Chip> é o que permite dois temas sem duplicar componente. E é por isso que componente só
          referencia semântico: primitivo como <Chip>base/blue/100</Chip> guarda valor literal e não acompanha o tema.
        </p>
        <p>
          A armadilha desta página é confundir a vitrine com o produto. A moldura em <Chip>components/ds/</Chip> —
          sidebar, busca, árvore de navegação — <span className="text-foreground">não faz parte do design system</span>:
          ela reproduz o layout de referência que o humano trouxe e carrega, de propósito, classes{" "}
          <Chip>.chrome-*</Chip> com tamanho em px e hex solto — <Chip>#ebebeb</Chip> no fundo da busca,{" "}
          <Chip>#d4d4d4</Chip> no traço da árvore — isoladas num <Chip>@layer components</Chip> à parte do{" "}
          <Chip>globals.css</Chip>. Copiar de lá leva para o CRM valor que não acompanha o tema. O que se copia é{" "}
          <Chip>components/ui/</Chip>; quando falta um valor, o caminho é abrir a decisão, não abrir uma exceção.
        </p>
      </ComoFunciona>

      {navegacao.map((cat) => {
        const feitos = cat.itens.filter((i) => i.pronto).length;
        return (
          <Secao
            key={cat.titulo}
            titulo={cat.titulo}
            spec={`${feitos} de ${cat.itens.length}`}
            descricao={cat.descricao}
            // a galeria são cards; a caixa de preview padrão viraria card sobre card
            semCaixa
            semSeletorDeFundo
            className="border-0 bg-transparent"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {cat.itens.map((item) => (
                <CardComponente
                  key={item.href}
                  titulo={item.titulo}
                  descricao={descricoes[item.titulo] ?? ""}
                  href={item.href}
                  pronto={item.pronto}
                >
                  {previews[item.href] ?? esqueleto}
                </CardComponente>
              ))}
            </div>
          </Secao>
        );
      })}
    </PaginaDS>
  );
}
