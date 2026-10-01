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
  Star,
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

const FAVORITOS = ["Pipeline comercial", "Leads quentes", "Propostas da semana"];

const APOIO: Rota[] = [
  { rotulo: "Calendar", icone: CalendarBlank },
  { rotulo: "Ajuda", icone: Question },
  { rotulo: "Configurações", icone: Gear },
];

type Parte = { classe: string; parte: string; valor: string };

const anatomia: Parte[] = [
  { classe: "w-[220px]", parte: "Largura aberta", valor: "220px · 48px recolhida" },
  { classe: "bg-background", parte: "Superfície", valor: "nenhuma: o fundo da aplicação, sem cartão nem traço" },
  { classe: "px-2 pt-4 pb-3", parte: "Recuo", valor: "8px lateral · 16 em cima, alinhado ao Header" },
  { classe: "gap-4", parte: "Entre blocos", valor: "16px · marca, destinos, favoritos" },
  { classe: "h-8 px-2", parte: "Item", valor: "32px de altura · 8px de recuo" },
  { classe: "gap-0.5", parte: "Entre itens", valor: "2px · no container, nunca margin" },
  { classe: "text-body-lg", parte: "Rótulo", valor: "13 / 18 · Regular 400" },
  { classe: "size={16}", parte: "Ícone", valor: "16px · fill no selecionado" },
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
      "172px de volta para a tabela — a largura de mais uma coluna e meia no pipeline. O preço é real: sem rótulo, o ícone precisa carregar sozinho o significado, e é por isso que o title fica no item inteiro. Estado de quem já sabe onde as coisas estão.",
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
      descricao="A navegação principal do CRM: plana, direto no fundo da aplicação, com 220px que viram 48. Destinos em dois blocos, um grupo de Favoritos e um item de 32px que é o componente de verdade."
      secoes={[
        "Como funciona",
        "A sidebar inteira",
        "Item",
        "Estados do item",
        "Favoritos",
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
          A navegação é <span className="text-foreground">plana</span>: não tem cartão, moldura nem sombra. Fica
          direto sobre <Chip>background</Chip>, a cor do fundo da aplicação, e quem a separa do conteúdo é o próprio
          conteúdo, que vem em superfícies brancas. São 220px aberta e 48 recolhida — 16 deles de recuo —, com a
          linha da marca alinhada à linha do Header. O arquivo desenha um painel de 282px em cartão, com item de
          36; o time pediu a densidade do Twenty e do Attio, e a navegação foi a terceira parte dessa mudança.
        </p>
        <p>
          Os cinco tokens <Chip>nav/item/*</Chip> vieram do Figma com modo Claro e Escuro próprios —
          e é o que torna o item honesto nos dois temas sem uma linha de <Chip>dark:</Chip>. O
          selecionado é <Chip>blue-50</Chip> + <Chip>blue-600</Chip> no claro e{" "}
          <Chip>accent</Chip> + <Chip>blue-300</Chip> no escuro, tudo por alias. O hover é a exceção:
          o do arquivo é <Chip>background</Chip>, que sumiria numa navegação plana sobre o próprio{" "}
          <Chip>background</Chip>. Aqui o hover é <Chip>card</Chip> — aparece nos dois temas.
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
          disco branco no pé da navegação. A saída é um token de componente:{" "}
          <Chip>--sidebar-avatar</Chip>, que guarda as duas escolhas. Regra
          que fica: <span className="text-foreground">onde a variante do Figma troca de variável,
          o código ganha um token — nunca um <Chip>dark:</Chip></span>.
        </p>
        <p>
          Falta contar a armadilha, que é o rótulo. Ele ocupa o que sobra do item, uns 170px, e o
          arquivo corta o texto seco, sem reticências e sem aviso —{" "}
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
        spec="220 → 48px"
        descricao="Viva: clique no botão ao lado da marca para recolher, no sol e na lua para trocar o tema da página inteira, e em qualquer destino para movê-lo."
        codigo={`const [colapsada, setColapsada] = useState(false);
const [ativa, setAtiva] = useState("Pipelines");

<Sidebar colapsada={colapsada} onColapsarChange={setColapsada}>
  <SidebarTopo>
    <SidebarBrand />
    <SidebarGrupo>
      <SidebarItem icone={House} selecionado={ativa === "Início"}>Início</SidebarItem>
      <SidebarItem icone={Kanban} selecionado={ativa === "Pipelines"}>Pipelines</SidebarItem>
      <SidebarItem icone={UsersThree} selecionado={ativa === "Leads"}>Leads</SidebarItem>
    </SidebarGrupo>
    <SidebarGrupo rotulo="Favoritos" ocultarRecolhida>
      <SidebarItem icone={Star}>Pipeline comercial</SidebarItem>
      <SidebarItem icone={Star}>Leads quentes</SidebarItem>
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
                220px viram 48 · o botão de recolher mora na linha da marca; recolhida, o símbolo
                vira o botão de expandir
              </Item>
              <Item mono="onColapsarChange">
                é o que faz o botão existir — sem ele a navegação é fixa e a marca fica sozinha
              </Item>
              <Item mono="SidebarTopo / SidebarRodape">
                os dois blocos do <Chip>justify-between</Chip>: o rodapé cola no pé mesmo com o
                painel alto
              </Item>
              <Item mono="rotulo / ocultarRecolhida">
                o grupo com nome (Favoritos) · recolhida, o nome some; com{" "}
                <Chip>ocultarRecolhida</Chip>, o grupo inteiro
              </Item>
            </ul>
          </>
        }
      >
        <Palco>
          <Sidebar colapsada={colapsada} onColapsarChange={setColapsada}>
            <SidebarTopo>
              <SidebarBrand />
              <SidebarGrupo>
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
              <SidebarGrupo rotulo="Favoritos" ocultarRecolhida>
                {FAVORITOS.map((f) => (
                  <SidebarItem
                    key={f}
                    icone={Star}
                    href="#"
                    selecionado={ativa === f}
                    onClick={(e) => {
                      e.preventDefault();
                      setAtiva(f);
                    }}
                  >
                    {f}
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
        spec="h-8 · gap-2 · 16px"
        descricao="O componente que a Sidebar existe para hospedar. Ícone de 16px, rótulo de 13/18 e 8px entre os dois, numa linha de 32. É um link quando tem para onde ir, e um span quando não tem."
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
              Os ícones são Phosphor no peso <Chip>regular</Chip>. No item selecionado o ícone passa
              a <Chip>fill</Chip> — a única troca de peso da interface: na navegação plana a
              superfície do selecionado é discreta, e o ícone cheio é o que o olho acha primeiro.
            </p>
          </>
        }
      >
        <div className="mx-auto w-[204px]">
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
                <Chip>bg-card</Chip> + <Chip>text-foreground</Chip> · a navegação fica sobre{" "}
                <Chip>background</Chip>, então o hover do arquivo (<Chip>background</Chip>) sumiria
              </Item>
              <Item mono="selecionado">
                <Chip>bg-nav-item-selected</Chip> + <Chip>text-nav-item-selected-foreground</Chip>,
                com o ícone em <Chip>fill</Chip>
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
        <div className="mx-auto w-[204px]">
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
        titulo="Favoritos"
        spec="rotulo · ocultarRecolhida"
        descricao="Os atalhos que a pessoa fixou: uma visão salva, uma lista, um funil. É um grupo com nome — o nome vem em caption, acima da lista — e some inteiro quando a navegação recolhe."
        codigo={`<SidebarGrupo rotulo="Favoritos" ocultarRecolhida>
  <SidebarItem icone={Star} href="/pipelines/comercial">Pipeline comercial</SidebarItem>
  <SidebarItem icone={Star} href="/leads?visao=quentes">Leads quentes</SidebarItem>
</SidebarGrupo>`}
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="rotulo">
                o nome da seção · vira o nome acessível da lista e some quando a navegação recolhe
              </Item>
              <Item mono="ocultarRecolhida">
                recolhida, o grupo sai de cena · três estrelas iguais sem rótulo não dizem nada
              </Item>
            </ul>
            <p className="mt-2.5">
              Favorito é atalho, não destino novo: aponta para um lugar que já existe na navegação
              de cima. Quem fixa e desfixa é a tela — o grupo só mostra.
            </p>
          </>
        }
      >
        <div className="mx-auto w-[204px]">
          <SidebarGrupo rotulo="Favoritos" ocultarRecolhida>
            {FAVORITOS.map((f) => (
              <SidebarItem key={f} icone={Star} href="#" onClick={(e) => e.preventDefault()}>
                {f}
              </SidebarItem>
            ))}
          </SidebarGrupo>
        </div>
      </Secao>

      <Secao
        titulo="Colapsada"
        spec="48px · 32×32"
        descricao="O mesmo item, sem rótulo: 32 por 32, ícone centrado e o texto inteiro no title. Devolve 172px para a tela."
        codigo={`<Sidebar colapsada>
  {/* nada muda aqui dentro: o contexto avisa cada filho */}
</Sidebar>`}
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="w-12">
                48 = 32 de conteúdo + 8 de recuo de cada lado
              </Item>
              <Item mono="title">
                o rótulo vira <Chip>title</Chip> e <Chip>aria-label</Chip> · sem eles o ícone fica
                mudo para o mouse e para o leitor de tela
              </Item>
              <Item mono="theme switch">
                o trilho de dois botões não cabe em 32px: vira um botão só, que mostra o tema atual
                e alterna no clique
              </Item>
              <Item mono="user">
                sobra o círculo de 24px · nome e e-mail vão para o <Chip>title</Chip>
              </Item>
            </ul>
          </>
        }
      >
        <Palco>
          <Sidebar colapsada={soColapsada} onColapsarChange={setSoColapsada}>
            <SidebarTopo>
              <SidebarBrand />
              <SidebarGrupo>
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
        spec="60×32 · 28×28"
        descricao="Dois botões num trilho de 2px de padding. O ativo herda a superfície do item selecionado — mesmo token, mesma cor — e é o que amarra o seletor ao resto da navegação. Clique: ele troca o tema desta página."
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
              O trilho tem <Chip>bg-card</Chip>: sobre o fundo da aplicação ele aparece sozinho, sem
              borda nem sombra. Tem a altura do item, 32px, para não desalinhar a lista.
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
        spec="h-10 · rounded-md"
        descricao="A última linha da navegação: avatar de 24px, nome em Medium, e-mail embaixo e um caret que promete um menu. É a única linha de 40px — tem duas linhas de texto."
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
              Os dois exemplos abaixo estão em 204px, a largura real dentro da navegação. O de baixo
              tem um e-mail longo de propósito: é onde o <Chip>truncate</Chip> aparece.
            </p>
          </>
        }
      >
        <div className="mx-auto w-[204px] space-y-2">
          <SidebarUser nome="Gabriel Correa" email="gece@datacrazy.com" />
          <SidebarUser
            nome="Marina Albuquerque"
            email="marina.albuquerque@nortelogistica.com.br"
          />
        </div>
      </Secao>

      <Secao
        titulo="Anatomia"
        spec="220 · 204 · 32px"
        descricao="Oito decisões sustentam a navegação. A que mais explica o resto é a segunda: ela não tem superfície própria — é o fundo da aplicação — e por isso tudo nela é mais baixo e mais junto que num painel em cartão."
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
              Um raio só: 6px no item, no seletor de tema e na linha do usuário. Forma diferente
              entre componentes exige motivo — é a regra A1 —, e numa navegação plana não há motivo.
            </p>
          </>
        }
      >
        <Palco alta={false}>
          <div className="w-[204px] py-4">
            <SidebarGrupo>
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
        <div className="mx-auto w-[204px]">
          <SidebarGrupo>
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
