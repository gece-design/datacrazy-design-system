"use client";

import {
  ChartBar,
  Funnel,
  House,
  Kanban,
  MagnifyingGlass,
  Plus,
  Robot,
  UsersThree,
} from "@phosphor-icons/react";
import { navegacao } from "@/components/ds/nav";
import { PaginaDS, Secao, ComoFunciona, Chip, CardComponente } from "@/components/ds/preview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/ui/kpi-card";
import { SidebarGrupo, SidebarItem } from "@/components/ui/sidebar";

const total = navegacao.reduce((n, c) => n + c.itens.length, 0);
const prontos = navegacao.reduce((n, c) => n + c.itens.filter((i) => i.pronto).length, 0);
const percentual = Math.round((prontos / total) * 100);

const rampa = ["50", "100", "200", "300", "400", "500", "600", "700"];
const estados = ["success", "warning", "destructive", "info"];

// Preview ao vivo de cada item, por rota. Item sem página ainda cai no esqueleto.
const previews: Record<string, React.ReactNode> = {
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
        <span className="text-primary">$</span> npm install
      </p>
      <p className="mt-1 text-subtle-foreground">
        <span className="text-primary">$</span> npm run dev
      </p>
      <p className="mt-2 text-foreground">localhost:4321</p>
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
  "/data-display/badge": (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      <Badge variant="primary">Frio</Badge>
      <Badge variant="success">Ganho</Badge>
      <Badge variant="warning">Atrasado</Badge>
      <Badge variant="destructive">Perdido</Badge>
      <Badge>+1</Badge>
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
  "Installation": "Rodar o site e levar um componente para o CRM.",
  "Color": "31 variáveis, dois modos, nenhum nome de cor.",
  "Typography": "15 papéis, de 26px a 10px, hierarquia por peso.",
  "Icons": "Phosphor num peso só: regular; fill só no selecionado (A8).",
  "Button": "Quatro variantes, três tamanhos, estados por regra.",
  "Icon Button": "Ação sem rótulo: exige tooltip e aria-label (E7).",
  "Input": "Campo de uma linha, com erro inline (E6).",
  "Select": "Escolha única: é o ▾ dos filtros do dashboard.",
  "Checkbox": "Alternância booleana, com estado indeterminado.",
  "Sidebar": "282px que viram 88px, e o item de 36px que ela hospeda.",
  "Breadcrumb": "Dois níveis, e esse é o teto (G5).",
  "Pagination": "Mostrando 10 de 37 negócios, e os controles.",
  "Card": "A superfície que carrega um bloco de dados.",
  "KPI Card": "Métrica do dashboard: valor, tendência e legenda.",
  "Badge": "Seis variantes. A cor entra na tag, nunca no card (A2).",
  "Avatar": "Inicial em círculo quando não há foto.",
  "Table": "37 negócios, sete colunas e paginação.",
  "Progress": "Etapa do funil: barra, rótulo e tempo (E5).",
  "Tooltip": "O conteúdo completo de um texto truncado (E1).",
  "Empty State": "Ausência de dados, explicada — não só um ícone.",
  "Modal": "Grupos à esquerda, conteúdo à direita, botões à parte (G10).",
  "Drawer": "Registro aberto lateralmente, fecha no X (G1).",
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
