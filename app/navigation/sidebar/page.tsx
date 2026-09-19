"use client";

import { useState } from "react";
import {
  CalendarBlank,
  ChatCircleDots,
  FlowArrow,
  Gear,
  House,
  Kanban,
  Lightning,
  Question,
  Robot,
  UsersThree,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import {
  Sidebar,
  SidebarBrand,
  SidebarGrupo,
  SidebarItem,
  SidebarRodape,
  SidebarThemeSwitch,
  SidebarTopo,
  SidebarUser,
} from "@/components/ui/sidebar";
import { useTema } from "@/components/ds/theme-toggle";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";

/* ------------------------------------------------------------------------- */

type Rota = { rotulo: string; icone: Icon };

const PRINCIPAIS: Rota[] = [
  { rotulo: "Início", icone: House },
  { rotulo: "Pipelines", icone: Kanban },
  { rotulo: "Leads", icone: UsersThree },
  { rotulo: "Impulso", icone: Lightning },
  { rotulo: "Automações", icone: FlowArrow },
  { rotulo: "Chat ao vivo", icone: ChatCircleDots },
  { rotulo: "Agentes de IA", icone: Robot },
];

const APOIO: Rota[] = [
  { rotulo: "Calendar", icone: CalendarBlank },
  { rotulo: "Ajuda", icone: Question },
  { rotulo: "Configurações", icone: Gear },
];

type Parte = { classe: string; parte: string; valor: string };

const anatomia: Parte[] = [
  { classe: "w-[282px]", parte: "Largura aberta", valor: "282px · 88px colapsada" },
  { classe: "border-[16px]", parte: "Respiro do shell", valor: "borda de background, não traço" },
  { classe: "rounded-3xl", parte: "Raio do painel", valor: "24px por fora · 8px por dentro" },
  { classe: "px-2 py-4", parte: "Padding interno", valor: "8px lateral · 16px topo e base" },
  { classe: "gap-5", parte: "Topo ↔ rodapé", valor: "20px, com justify-between" },
  { classe: "h-9 p-2", parte: "Item", valor: "36px de altura · 8px de padding" },
  { classe: "gap-1", parte: "Entre itens", valor: "4px · no container, nunca margin" },
  { classe: "text-button", parte: "Rótulo", valor: "13 / 18 · Medium 500" },
];

type Uso = { nome: string; regra: string; texto: string };

const usos: Uso[] = [
  {
    nome: "Aberta",
    regra: "padrão",
    texto:
      "É o estado que ensina o produto. Sete destinos com rótulo cabem sem rolagem, e o rótulo é o que separa Impulso de Automações para quem chegou hoje. Enquanto houver espaço horizontal, é este o estado.",
  },
  {
    nome: "Colapsada",
    regra: "quando a tela é a tarefa",
    texto:
      "194px de volta para a tabela — a largura de mais duas colunas no pipeline. O preço é real: sem rótulo, o ícone precisa carregar sozinho o significado, e é por isso que o title fica no item inteiro. Estado de quem já sabe onde as coisas estão.",
  },
  {
    nome: "Item selecionado",
    regra: "1 por painel",
    texto:
      "Só um item pode estar selecionado, e ele é a única superfície azul do painel. Dois selecionados ao mesmo tempo é bug de rota, não de estilo — e o aria-current=\"page\" é o que faz o leitor de tela concordar com o que o olho vê.",
  },
];

/** Item de nota: o que se copia em mono, o detalhe em seguida. */
function Item({ mono, children }: { mono: string; children: React.ReactNode }) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-2">
      <code className="w-48 shrink-0 font-mono chrome-meta text-foreground">{mono}</code>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

/** Caixa alta o bastante para o painel inteiro caber sem rolagem interna. */
function Palco({ children, alta = true }: { children: React.ReactNode; alta?: boolean }) {
  return (
    <div className={alta ? "flex h-[720px] items-stretch justify-center" : "flex justify-center"}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------- */

export default function PaginaSidebar() {
  const [colapsada, setColapsada] = useState(false);
  const [soColapsada, setSoColapsada] = useState(true);
  const [ativa, setAtiva] = useState("Pipelines");
  const { escuro, alternar } = useTema();

  return (
    <PaginaDS
      titulo="Sidebar"
      descricao="A navegação principal do CRM: 282px que viram 88px, dez destinos em dois blocos, e um item de 36px que é o componente de verdade — cinco estados, três deles desenhados no Figma e dois derivados por regra."
      secoes={[
        "Como funciona",
        "A sidebar inteira",
        "Item",
        "Estados do item",
        "Colapsada",
        "Theme Switch",
        "Usuário",
        "Anatomia",
        "Quando usar cada estado",
      ]}
    >
      <ComoFunciona>
        <p>
          A Sidebar não é um componente: são seis que aparecem — painel, marca, item, seletor de
          tema, linha do usuário e o botão de colapsar — mais três de layout. O que costura os nove
          é um <span className="text-foreground">contexto de uma propriedade só</span>.{" "}
          <Chip>colapsada</Chip> desce do painel para a marca, para cada item, para o seletor de
          tema e para a linha do usuário, e cada um decide sozinho o que fazer com ela — a marca
          troca a assinatura pelo símbolo, o item esconde o rótulo, o seletor de tema vira um botão
          só. A alternativa seria repassar a prop em dez filhos, e a décima primeira linha seria a
          que alguém esqueceria.
        </p>
        <p>
          A borda de 16px do painel é o detalhe que engana. No Figma ela é um{" "}
          <Chip>stroke INSIDE</Chip> de 16px na cor <Chip>background</Chip> — e não é traço nenhum:
          é <span className="text-foreground">o respiro do shell</span>, na cor do fundo da
          aplicação. Em CSS isso cai redondo em <Chip>border-[16px] border-background</Chip>, porque
          o raio interno de um <Chip>border-box</Chip> é o externo menos a espessura: 24px por fora,
          8px por dentro, exatamente como o desenho. Consequência prática: os 282px já incluem os 16
          de cada lado, e o conteúdo trabalha em 234.
        </p>
        <p>
          O painel muda de natureza entre os temas, e por isso a superfície é um token de gradiente,
          não de cor. No claro é <Chip>card</Chip> chapado; no escuro, um gradiente vertical de{" "}
          <Chip>background</Chip> para <Chip>accent</Chip> — o topo funde com o fundo da página e a
          base emerge. Como gradiente é <Chip>background-image</Chip> e cor é{" "}
          <Chip>background-color</Chip>, misturar os dois exigiria <span className="text-foreground">
          ramificar o componente por tema</span>, que é justamente o que o critério de pronto proíbe.
          A saída foi <Chip>--sidebar-surface</Chip> ser <span className="text-foreground">sempre</span>{" "}
          gradiente: no claro, um gradiente de <Chip>card</Chip> para <Chip>card</Chip>. Um caminho
          de código só, dois resultados.
        </p>
        <p>
          Os cinco tokens <Chip>nav/item/*</Chip> vieram do Figma com modo Claro e Escuro próprios —
          e é o que torna o item honesto nos dois temas sem uma linha de <Chip>dark:</Chip>. O
          selecionado é <Chip>blue-50</Chip> + <Chip>blue-600</Chip> no claro e{" "}
          <Chip>accent</Chip> + <Chip>blue-300</Chip> no escuro, tudo por alias. O hover também veio
          desenhado — <Chip>nav/item/bg-hover</Chip> —, o que é raro por aqui: pela exceção{" "}
          <span className="text-foreground">E-01</span>, estado de interação costuma ser derivado
          por regra, não desenhado. Aqui não precisou derivar nada.
        </p>
        <p>
          Nem tudo veio tão pronto. O avatar sem foto é o caso do bloqueio{" "}
          <span className="text-foreground">B8</span> em miniatura: o Figma modela tema como{" "}
          <span className="text-foreground">variante do componente</span>, não como modo de
          variável, então a variante clara escolheu <Chip>surface-inverse</Chip> e a escura{" "}
          <Chip>base/blue/700</Chip> — duas variáveis diferentes para a mesma peça. Copiar o nome da
          variante escura não funciona: ela foi escolhida pelo valor que tem no modo{" "}
          <span className="text-foreground">Claro</span> do documento. E{" "}
          <Chip>surface-inverse</Chip> sozinha não serve, porque ela inverte — no escuro viraria um
          disco branco de 32px no pé do painel. A saída é a mesma da superfície:{" "}
          <Chip>--sidebar-avatar</Chip>, um token de componente que guarda as duas escolhas. Regra
          que fica: <span className="text-foreground">onde a variante do Figma troca de variável,
          o código ganha um token — nunca um <Chip>dark:</Chip></span>.
        </p>
        <p>
          Falta contar a armadilha, que é o rótulo. O item tem{" "}
          <Chip>max-w-[160px]</Chip> e o Figma corta o texto seco, sem reticências e sem aviso —{" "}
          <span className="text-foreground">exatamente o padrão de três tickets</span> (#83283,
          #83274, #59567). Como <Chip>pt-br</Chip> e <Chip>es</Chip> crescem 20–30% sobre{" "}
          <Chip>en</Chip>, &quot;Agentes de IA&quot; passa. &quot;Configurações de automação&quot;
          não. O componente troca o corte por <Chip>truncate</Chip> e carrega o rótulo inteiro no{" "}
          <Chip>title</Chip> do item — que no estado colapsado deixa de ser acabamento e vira a
          única forma de saber o que o ícone significa.
        </p>
      </ComoFunciona>

      <Secao
        titulo="A sidebar inteira"
        spec="282 → 88px"
        descricao="Viva: clique no botão da borda para colapsar, no sol e na lua para trocar o tema da página inteira, e em qualquer destino para movê-lo. É o node 124:2114 do Figma, com as quatro variantes cobertas por dois estados."
        className="bg-background"
        codigo={`const [colapsada, setColapsada] = useState(false);
const [ativa, setAtiva] = useState("Pipelines");

<Sidebar colapsada={colapsada} onColapsarChange={setColapsada}>
  <SidebarTopo>
    <SidebarBrand />
    <SidebarGrupo recuo>
      <SidebarItem icone={House} selecionado={ativa === "Início"}>Início</SidebarItem>
      <SidebarItem icone={Kanban} selecionado={ativa === "Pipelines"}>Pipelines</SidebarItem>
      <SidebarItem icone={UsersThree} selecionado={ativa === "Leads"}>Leads</SidebarItem>
    </SidebarGrupo>
  </SidebarTopo>

  <SidebarRodape>
    <SidebarGrupo>
      <li><SidebarThemeSwitch tema={tema} onTemaChange={setTema} /></li>
      <SidebarItem icone={CalendarBlank}>Calendar</SidebarItem>
      <SidebarItem icone={Question}>Ajuda</SidebarItem>
      <SidebarItem icone={Gear}>Configurações</SidebarItem>
    </SidebarGrupo>
    <SidebarUser nome="Gabriel Correa" email="gece@datacrazy.com" />
  </SidebarRodape>
</Sidebar>`}
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="colapsada">
                282px viram 88px · o botão da borda não se move: <Chip>right-[3px] top-[59px]</Chip>{" "}
                nas duas larguras
              </Item>
              <Item mono="onColapsarChange">
                é o que faz o botão existir — sem ele o painel é fixo e o toggle não é renderizado
              </Item>
              <Item mono="SidebarTopo / SidebarRodape">
                os dois blocos do <Chip>justify-between</Chip>: o rodapé cola no pé mesmo com o
                painel alto
              </Item>
              <Item mono="recuo">
                os 2px que o grupo principal ganha de folga lateral · o grupo do rodapé não tem
              </Item>
            </ul>
            <p className="mt-2.5">
              A marca d&apos;água é o símbolo a 362px, 7% de opacidade, sangrando pela esquerda no
              rodapé — e ela se move quando o painel colapsa, porque o que está fixo é a diagonal do
              símbolo, não a borda.
            </p>
          </>
        }
      >
        <Palco>
          <Sidebar colapsada={colapsada} onColapsarChange={setColapsada}>
            <SidebarTopo>
              <SidebarBrand />
              <SidebarGrupo recuo>
                {PRINCIPAIS.map((r) => (
                  <SidebarItem
                    key={r.rotulo}
                    icone={r.icone}
                    href="#"
                    selecionado={ativa === r.rotulo}
                    onClick={(e) => {
                      e.preventDefault();
                      setAtiva(r.rotulo);
                    }}
                  >
                    {r.rotulo}
                  </SidebarItem>
                ))}
              </SidebarGrupo>
            </SidebarTopo>

            <SidebarRodape>
              <SidebarGrupo>
                <li>
                  <SidebarThemeSwitch
                    tema={escuro ? "escuro" : "claro"}
                    onTemaChange={(t) => {
                      if ((t === "escuro") !== escuro) alternar();
                    }}
                  />
                </li>
                {APOIO.map((r) => (
                  <SidebarItem
                    key={r.rotulo}
                    icone={r.icone}
                    href="#"
                    selecionado={ativa === r.rotulo}
                    onClick={(e) => {
                      e.preventDefault();
                      setAtiva(r.rotulo);
                    }}
                  >
                    {r.rotulo}
                  </SidebarItem>
                ))}
              </SidebarGrupo>
              <SidebarUser nome="Gabriel Correa" email="gece@datacrazy.com" />
            </SidebarRodape>
          </Sidebar>
        </Palco>
      </Secao>

      <Secao
        titulo="Item"
        spec="h-9 · gap-2 · 20px"
        descricao="O componente que a Sidebar existe para hospedar. Ícone de 20px — não 16, como no botão —, rótulo de 13/18 Medium, e 8px entre os dois. É um link quando tem para onde ir, e um span quando não tem: a prop componente troca a tag da raiz, e é por onde o next/link entra."
        codigo={`<SidebarItem icone={House} href="/inicio">Início</SidebarItem>

<SidebarItem icone={Kanban} href="/pipelines" selecionado>
  Pipelines
</SidebarItem>

{/* navegação client-side: o próprio Link é a raiz */}
<SidebarItem icone={UsersThree} componente={Link} href="/leads">
  Leads
</SidebarItem>`}
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="icone">
                obrigatório · é o que sobra quando o painel colapsa, então item sem ícone vira item
                invisível
              </Item>
              <Item mono="selecionado">
                <Chip>bg-nav-item-selected</Chip> + <Chip>text-nav-item-selected-foreground</Chip> ·
                o ícone recebe <Chip>text-nav-item-selected-icon</Chip>, que é token separado no
                Figma
              </Item>
              <Item mono="componente">
                a tag da raiz · <Chip>a</Chip> quando há <Chip>href</Chip>, <Chip>span</Chip>{" "}
                quando não há, e <Chip>Link</Chip> para navegação client-side
              </Item>
              <Item mono="aria-current">
                sai como <Chip>page</Chip> quando <Chip>selecionado</Chip> · é o que o leitor de
                tela lê
              </Item>
            </ul>
            <p className="mt-2.5">
              Os ícones são Phosphor no peso <Chip>regular</Chip>, o único peso da interface. O
              selecionado não muda para <Chip>fill</Chip> aqui: quem marca a seleção é a superfície,
              e dobrar o sinal gastaria dois recursos para dizer a mesma coisa.
            </p>
          </>
        }
      >
        <div className="mx-auto w-[234px]">
          <SidebarGrupo>
            <SidebarItem icone={House} href="#" onClick={(e) => e.preventDefault()}>
              Início
            </SidebarItem>
            <SidebarItem icone={Kanban} href="#" selecionado onClick={(e) => e.preventDefault()}>
              Pipelines
            </SidebarItem>
            <SidebarItem icone={UsersThree} href="#" onClick={(e) => e.preventDefault()}>
              Leads
            </SidebarItem>
            <SidebarItem icone={Robot} href="#" onClick={(e) => e.preventDefault()}>
              Agentes de IA
            </SidebarItem>
          </SidebarGrupo>
        </div>
      </Secao>

      <Secao
        titulo="Estados do item"
        spec="4 · nav/item"
        descricao="Quatro estados, e desta vez três vieram do Figma — repouso, hover e selecionado são tokens desenhados, não regra derivada. Passe o mouse, dê Tab a partir daqui, e repare que o desabilitado não responde."
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="repouso">
                <Chip>text-nav-item</Chip> · alias de <Chip>muted-foreground</Chip>, que inverte
                sozinho entre os temas
              </Item>
              <Item mono="hover">
                <Chip>bg-nav-item-hover</Chip> · <Chip>background</Chip> no claro,{" "}
                <Chip>card</Chip> no escuro — veio desenhado, não derivado
              </Item>
              <Item mono="selecionado">
                <Chip>bg-nav-item-selected</Chip> + <Chip>shadow-highlight</Chip>, o realce interno
                de 1px que o Figma põe em toda superfície do painel
              </Item>
              <Item mono="focus-visible">
                <Chip>outline-2 outline-offset-2 outline-ring</Chip> · o mesmo anel do{" "}
                <Chip>Button</Chip>, pela regra E7
              </Item>
              <Item mono="aria-disabled">
                <Chip>opacity-50</Chip> + <Chip>pointer-events-none</Chip> · num link,{" "}
                <Chip>disabled</Chip> não existe, então o estado vai por ARIA
              </Item>
            </ul>
            <p className="mt-2.5">
              Falta <Chip>active</Chip> — é a decisão <Chip>D4</Chip> de{" "}
              <Chip>docs/processo/interactions.md</Chip>, ainda aberta. Sem token para ele, não se
              inventa um.
            </p>
          </>
        }
      >
        <div className="mx-auto w-[234px]">
          <SidebarGrupo>
            <SidebarItem icone={House} href="#" onClick={(e) => e.preventDefault()}>
              Repouso
            </SidebarItem>
            <SidebarItem icone={Kanban} href="#" selecionado onClick={(e) => e.preventDefault()}>
              Selecionado
            </SidebarItem>
            <SidebarItem icone={UsersThree} href="#" onClick={(e) => e.preventDefault()}>
              Passe o mouse
            </SidebarItem>
            <SidebarItem icone={Gear} aria-disabled="true">
              Desabilitado
            </SidebarItem>
          </SidebarGrupo>
        </div>
      </Secao>

      <Secao
        titulo="Colapsada"
        spec="88px · 36×36"
        descricao="O mesmo item, sem rótulo: 36 por 36, ícone centrado e o texto inteiro no title. Devolve 194px para a tela — a largura de duas colunas de tabela no pipeline."
        className="bg-background"
        codigo={`<Sidebar colapsada>
  {/* nada muda aqui dentro: o contexto avisa cada filho */}
</Sidebar>`}
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="w-[88px]">
                88 = 40 de conteúdo + 8 de padding + 16 de respiro, dos dois lados
              </Item>
              <Item mono="title">
                o rótulo vira <Chip>title</Chip> e <Chip>aria-label</Chip> · sem eles o ícone fica
                mudo para o mouse e para o leitor de tela
              </Item>
              <Item mono="theme switch">
                o trilho de dois botões não cabe em 40px: vira um botão só, que mostra o tema atual
                e alterna no clique
              </Item>
              <Item mono="user">
                sobra o círculo de 32px · nome e e-mail vão para o <Chip>title</Chip>
              </Item>
            </ul>
          </>
        }
      >
        <Palco>
          <Sidebar colapsada={soColapsada} onColapsarChange={setSoColapsada}>
            <SidebarTopo>
              <SidebarBrand />
              <SidebarGrupo recuo>
                {PRINCIPAIS.map((r) => (
                  <SidebarItem
                    key={r.rotulo}
                    icone={r.icone}
                    href="#"
                    selecionado={r.rotulo === "Pipelines"}
                    onClick={(e) => e.preventDefault()}
                  >
                    {r.rotulo}
                  </SidebarItem>
                ))}
              </SidebarGrupo>
            </SidebarTopo>

            <SidebarRodape>
              <SidebarGrupo>
                <li>
                  <SidebarThemeSwitch
                    tema={escuro ? "escuro" : "claro"}
                    onTemaChange={() => alternar()}
                  />
                </li>
                {APOIO.map((r) => (
                  <SidebarItem
                    key={r.rotulo}
                    icone={r.icone}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    {r.rotulo}
                  </SidebarItem>
                ))}
              </SidebarGrupo>
              <SidebarUser nome="Gabriel Correa" email="gece@datacrazy.com" />
            </SidebarRodape>
          </Sidebar>
        </Palco>
      </Secao>

      <Secao
        titulo="Theme Switch"
        spec="68×36 · 32×32"
        descricao="Dois botões num trilho de 2px de padding. O ativo herda a superfície do item selecionado — mesmo token, mesma cor — e é o que amarra o seletor ao resto do painel. Clique: ele troca o tema desta página."
        codigo={`const [tema, setTema] = useState<"claro" | "escuro">("claro");

<SidebarThemeSwitch tema={tema} onTemaChange={setTema} />`}
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="ativo">
                <Chip>bg-nav-item-selected</Chip> + <Chip>text-nav-item-selected-icon</Chip> · os
                mesmos tokens do item selecionado, de propósito
              </Item>
              <Item mono="inativo">
                <Chip>text-muted-foreground</Chip> · hover em <Chip>bg-nav-item-hover</Chip>
              </Item>
              <Item mono="role=radiogroup">
                dois botões que se excluem são um grupo de rádio, não dois toggles soltos — muda o
                que o leitor de tela anuncia
              </Item>
            </ul>
            <p className="mt-2.5">
              O trilho tem <Chip>bg-card</Chip>, e no tema claro isso significa branco sobre branco:
              é o <Chip>shadow-highlight</Chip> que o separa do painel, não uma borda. No Figma o
              botão inativo tem raio 16 e o ativo 6 — como o inativo não tem superfície, a diferença
              nunca aparece, e o código usa 6 nos dois.
            </p>
          </>
        }
      >
        <div className="flex justify-center">
          <SidebarThemeSwitch
            tema={escuro ? "escuro" : "claro"}
            onTemaChange={(t) => {
              if ((t === "escuro") !== escuro) alternar();
            }}
          />
        </div>
      </Secao>

      <Secao
        titulo="Usuário"
        spec="h-10 · rounded-xl"
        descricao="A última linha do painel: avatar de 32px, nome em Medium, e-mail em Regular e um caret que promete um menu. Raio de 12px — maior que o do item, porque é uma linha que se lê como cartão, não como destino."
        codigo={`<SidebarUser nome="Gabriel Correa" email="gece@datacrazy.com" />

{/* com foto, quando houver */}
<SidebarUser
  nome="Gabriel Correa"
  email="gece@datacrazy.com"
  avatar={<img src={url} alt="" className="size-full object-cover" />}
/>`}
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="avatar">
                slot · sem ele fica o círculo <Chip>--sidebar-avatar</Chip> cheio, que é o desenho
                do Figma
              </Item>
              <Item mono="email">
                <Chip>truncate</Chip> + <Chip>title</Chip> · é o campo que estoura primeiro, e
                truncar mudo é o bug #83283
              </Item>
              <Item mono="CaretDown">
                promete um menu · o <Chip>Dropdown</Chip> que ele abriria ainda não existe no DS
              </Item>
            </ul>
            <p className="mt-2.5">
              Os dois exemplos abaixo estão em 234px, a largura real dentro do painel. O de baixo
              tem um e-mail longo de propósito: é onde o <Chip>truncate</Chip> aparece.
            </p>
          </>
        }
      >
        <div className="mx-auto w-[234px] space-y-2">
          <SidebarUser nome="Gabriel Correa" email="gece@datacrazy.com" />
          <SidebarUser
            nome="Marina Albuquerque"
            email="marina.albuquerque@nortelogistica.com.br"
          />
        </div>
      </Secao>

      <Secao
        titulo="Anatomia"
        spec="282 · 234 · 36px"
        descricao="Oito decisões sustentam o painel. A que mais explica o resto é a segunda: a borda de 16px não é traço, é o fundo da aplicação entrando pelo componente — e é ela que faz 282 virarem 234 de conteúdo."
        nota={
          <>
            <ul className="space-y-1.5">
              {anatomia.map((a) => (
                <Item key={a.classe} mono={a.classe}>
                  {a.parte} — {a.valor}
                </Item>
              ))}
            </ul>
            <p className="mt-2.5">
              Três raios convivem no painel e cada um tem motivo: 24px no painel, 12px na linha do
              usuário, 6px no item e no seletor de tema. Forma diferente entre componentes exige
              motivo — é a regra A1 — e aqui o motivo é hierarquia: quanto menor o elemento, menor o
              raio.
            </p>
          </>
        }
      >
        <Palco alta={false}>
          <div className="w-[234px] py-4">
            <SidebarGrupo recuo>
              <SidebarItem icone={Kanban} href="#" selecionado onClick={(e) => e.preventDefault()}>
                Pipelines
              </SidebarItem>
            </SidebarGrupo>
          </div>
        </Palco>
      </Secao>

      <Secao
        titulo="Quando usar cada estado"
        descricao="A sidebar tem uma decisão só, e ela não é estética: quanto da tela pertence à navegação. Abaixo, o que cada estado custa e o que devolve."
        nota={
          <>
            <ul className="space-y-3">
              {usos.map((u) => (
                <li key={u.nome}>
                  <span className="font-mono chrome-label text-foreground">{u.nome}</span>{" "}
                  <span className="chrome-meta text-subtle-foreground">· {u.regra}</span>
                  <p className="mt-1 chrome-prose text-muted-foreground">{u.texto}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              O que não muda com o estado: a ordem. Os sete destinos de cima são o produto; os três
              de baixo são apoio, e ficam colados no pé porque{" "}
              <span className="text-foreground">Configurações não disputa com Pipelines</span>. Item
              novo entra no bloco de cima só se for um lugar onde se trabalha.
            </p>
          </>
        }
      >
        <div className="mx-auto w-[234px]">
          <SidebarGrupo recuo>
            <SidebarItem icone={Kanban} href="#" selecionado onClick={(e) => e.preventDefault()}>
              Pipelines
            </SidebarItem>
            <SidebarItem icone={UsersThree} href="#" onClick={(e) => e.preventDefault()}>
              Leads
            </SidebarItem>
            <SidebarItem icone={Lightning} href="#" onClick={(e) => e.preventDefault()}>
              Impulso
            </SidebarItem>
          </SidebarGrupo>
        </div>
      </Secao>
    </PaginaDS>
  );
}
