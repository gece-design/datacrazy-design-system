"use client";

import { useState } from "react";
import { ArrowLineLeft, ChatCircleDots, Handshake, UsersThree } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerMenu, DrawerPerfil, HierarquiaNo, LinhaDoTempo, type TomPerfil } from "@/components/ui/drawer";
import { Tag } from "@/components/ui/tag";
import { PaginaDS, Secao, Chip } from "@/components/ds/preview";
import { DrawerLead, MENU_LEAD } from "../drawer/drawer-lead";
import { PropostaBarraDeIcones, PropostaGrade, PropostaTrilhoDeIcones } from "./propostas";

/* As variações do Drawer, fora da página principal: os oito tons, o menu
   solto, a linha do tempo, o nó da hierarquia, a camada — e as três propostas
   do cliente refeitas com os componentes do sistema. O drawer inteiro, que é
   o que se copia, fica em /feedback/drawer. */

const tons: { tom: TomPerfil; nome: string; tipo: "pessoa" | "empresa"; origem: string }[] = [
  { tom: "azul", nome: "Rafael Pinto Pinheiro", tipo: "pessoa", origem: "arquivo · 565:6447" },
  { tom: "roxo", nome: "Joel Jota", tipo: "empresa", origem: "arquivo · 565:8651" },
  { tom: "rosa", nome: "Marina Albuquerque", tipo: "pessoa", origem: "matiz 330°" },
  { tom: "laranja", nome: "Norte Logística", tipo: "empresa", origem: "matiz 24°" },
  { tom: "verde", nome: "Campo Vivo Agro", tipo: "empresa", origem: "matiz 142°" },
  { tom: "ciano", nome: "Helena Moraes", tipo: "pessoa", origem: "matiz 190°" },
  { tom: "ambar", nome: "Oficina Farol", tipo: "empresa", origem: "matiz 45°" },
  { tom: "vermelho", nome: "Tomás Vilela", tipo: "pessoa", origem: "matiz 356°" },
];

export default function DrawerVariacoesPage() {
  const [camada, setCamada] = useState(false);
  const [menuSolto, setMenuSolto] = useState("historicos");
  const [fixadosSoltos, setFixadosSoltos] = useState<string[]>(["negocios", "hierarquia"]);

  return (
    <PaginaDS
      titulo="Drawer variações"
      descricao="Tudo o que o Drawer faz além do lead inteiro: as cores do perfil, o menu com alfinete, a linha do tempo, o nó da hierarquia e a camada. No fim, as três propostas de navegação do lead refeitas com os componentes do sistema, para comparar com o drawer principal."
      secoes={["Cores do perfil", "Menu", "Linha do tempo", "Hierarquia", "Camada", "Barra de ícones", "Trilho de ícones", "Grade de duas colunas"]}
    >
      <Secao
        titulo="Cores do perfil"
        spec="tom · 8"
        descricao="O tom muda o anel e a letra do avatar, o texto da tag de tipo e o brilho do topo. O resto — botões, tags, menu — continua azul. Sem a prop, pessoa sai azul e empresa sai roxo, como no arquivo."
        codigo={`<DrawerPerfil tipo="pessoa" …/>              {/* azul */}
<DrawerPerfil tipo="empresa" …/>             {/* roxo */}
<DrawerPerfil tipo="pessoa" tom="rosa" …/>
<DrawerPerfil tipo="empresa" tom="laranja" …/>
<DrawerPerfil tipo="empresa" tom="verde" …/>
<DrawerPerfil tipo="pessoa" tom="ciano" …/>
<DrawerPerfil tipo="empresa" tom="ambar" …/>
<DrawerPerfil tipo="pessoa" tom="vermelho" …/>`}
        nota={
          <>
            Os quatro roxos do arquivo (<Chip>#F2E8FF</Chip>, <Chip>#6C12E2</Chip>, <Chip>#8B33FF</Chip>,{" "}
            <Chip>#EEE0FF</Chip>) são exatamente o azul do sistema com o matiz girado para 266° — mesma saturação, mesma
            luminosidade. Rosa (330°) e laranja (24°) saem da mesma conta, e o escuro de cada um repete o S/L do azul
            escuro. Os valores moram em <Chip>[data-tom]</Chip> no <Chip>globals.css</Chip>. Verde (142°), ciano (190°)
            e âmbar (45°) entraram depois (2026-09-18) e <span className="text-foreground">não copiam a luminosidade
            do azul</span>: no mesmo 60% o texto da tag fica em 1,4:1 sobre o fundo claro — o motivo de eles terem
            sido recusados antes. O matiz gira e o L desce até empatar com o azul: 3,0:1 na tag, 5,3:1 na letra sobre
            o card. O vermelho (356°) já fecha a conta quase no L do azul.
          </>
        }
      >
        <div className="grid justify-center gap-4 sm:grid-cols-[repeat(2,320px)]">
          {tons.map((t) => (
            <div key={t.tom} className="flex flex-col gap-2">
              <span className="chrome-caption text-subtle-foreground">
                <span className="font-mono text-foreground">tom=&quot;{t.tom}&quot;</span> · {t.origem}
              </span>
              <DrawerPerfil
                nome={t.nome}
                tipo={t.tipo}
                tom={t.tom}
                rotuloTipo={t.tipo === "pessoa" ? "Pessoa" : "Empresa"}
                telefone="+55 (11) 98765-4321"
                email="contato@datacrazy.com"
                className="rounded-md border"
                tags={
                  <>
                    <Tag>Lista de leads</Tag>
                    <Tag status="success">Agendado</Tag>
                  </>
                }
              />
            </div>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Menu"
        spec="36px · fixar"
        descricao="Repouso, hover e selecionado — os três desenhados no arquivo, nos dois temas. O selecionado ganha fundo, texto e ícone azuis e o caret à direita. Passe o cursor num item para ver o alfinete: o que é fixado sobe para o topo e fica com o alfinete cheio. Só lista, uma coluna: a grade de cards saiu a pedido do cliente (2026-09-18)."
        codigo={`<DrawerMenu
  rotulo="Seções do lead"
  itens={[{ id: "perfil", rotulo: "Perfil", icone: User }, …]}
  atual={secao}
  aoEscolher={setSecao}
  fixacao={{
    fixados,
    aoAlternar: (id) => alternarFixado(id),
    rotuloFixar: (item) => \`Fixar \${item.rotulo} no topo\`,
    rotuloDesafixar: (item) => \`Desafixar \${item.rotulo}\`,
  }}
/>`}
        nota={
          <>
            Os tokens são os mesmos do item da Sidebar: <Chip>nav/item/bg-hover</Chip>,{" "}
            <Chip>nav/item/bg-selected</Chip>, <Chip>nav/item/text-selected</Chip>. O ícone em repouso é{" "}
            <Chip>nav/item/text-default</Chip> e o texto é <Chip>foreground</Chip>. Cada item é{" "}
            <Chip>&lt;button&gt;</Chip> com <Chip>aria-current</Chip> no escolhido.
            <br />
            Fixar <span className="text-foreground">não está no arquivo</span> (pedido do humano, 2026-09-18). O
            alfinete é um botão separado, irmão do item — botão dentro de botão é HTML inválido —, com{" "}
            <Chip>aria-pressed</Chip> e rótulo que diz o que vai acontecer. Sem a prop <Chip>fixacao</Chip>, o menu é
            a lista do arquivo, sem alfinete nenhum.
          </>
        }
      >
        <div className="mx-auto w-[280px]">
          <DrawerMenu
            rotulo="Menu de exemplo"
            itens={MENU_LEAD}
            atual={menuSolto}
            aoEscolher={setMenuSolto}
            fixacao={{
              fixados: fixadosSoltos,
              aoAlternar: (id) => setFixadosSoltos((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
              rotuloFixar: (item) => `Fixar ${item.rotulo} no topo`,
              rotuloDesafixar: (item) => `Desafixar ${item.rotulo}`,
            }}
          />
        </div>
      </Secao>

      <Secao
        titulo="Linha do tempo"
        spec="marcador 32px"
        descricao="O conteúdo do Histórico. Cada evento tem um marcador em accent com o ícone em primary, o texto e a linha de detalhes. A linha vertical liga um marcador ao próximo e some no último."
        codigo={`<LinhaDoTempo
  eventos={[
    { id: "1", titulo: "Lead criado via importação",
      detalhes: ["Importação", "17/08/2026", "18:23"], icone: UsersThree },
  ]}
/>`}
      >
        <div className="mx-auto max-w-[520px]">
          <LinhaDoTempo
            eventos={[
              {
                id: "negocio",
                titulo: "Negócio #8 criado na pipeline E-commerce Sales",
                detalhes: ["Esther Lima", "20/08/2026", "09:02"],
                icone: Handshake,
              },
              {
                id: "tag",
                titulo: "Tag [ENV] Follow-up 3 adicionada ao lead",
                detalhes: ["João Carlos Ferreira Jr", "17/08/2026", "22:15"],
                icone: ChatCircleDots,
              },
              {
                id: "criado",
                titulo: "Lead criado via importação",
                detalhes: ["Importação", "17/08/2026", "18:23"],
                icone: UsersThree,
              },
            ]}
          />
        </div>
      </Secao>

      <Secao
        titulo="Hierarquia"
        spec="176px · atual"
        descricao="O nó da árvore de empresas. A empresa do lead aberto tem traço de 2px em primary; as outras, 1px em border."
        codigo={`<HierarquiaNo nome="XBOX" subtitulo="Empresa" tipo="Empresa atual" atual
  recolher={{ rotulo: "Recolher empresas filhas", aoClicar: alternar }} />
<HierarquiaNo nome="Microsoft" subtitulo="Empresa" tipo="Empresa mãe" />`}
        nota={
          <>
            Aqui o traço conta no tamanho — o nó atual tem 140px e os outros 138 — então é borda com{" "}
            <Chip>p-3</Chip>, sem a conta da D14. A árvore inteira, com linhas e zoom, está na seção Hierarquia do
            drawer acima.
          </>
        }
      >
        <div className="flex flex-wrap justify-center gap-4">
          <HierarquiaNo nome="Microsoft" subtitulo="Empresa" tipo="Empresa mãe" />
          <HierarquiaNo
            nome="XBOX"
            subtitulo="Empresa"
            tipo="Empresa atual"
            atual
            recolher={{ rotulo: "Recolher empresas filhas de XBOX", aoClicar: () => undefined }}
          />
        </div>
      </Secao>

      <Secao
        titulo="Camada"
        spec='role="dialog"'
        descricao="O drawer de verdade: abre pela direita sobre um scrim, ocupa a altura da tela, prende o foco, fecha no X, no Escape e no clique fora, e devolve o foco ao botão que o abriu."
        codigo={`<Button onClick={() => setAberto(true)}>Abrir lead</Button>
<Drawer aberto={aberto} aoFechar={() => setAberto(false)} rotulo="Lead Joel Jota">
  <DrawerLead lead="joel" aoFechar={() => setAberto(false)} />
</Drawer>`}
        nota={
          <>
            O scrim é <Chip>overlay/scrim</Chip> a 40%. O token existe; a opacidade, não — o arquivo não desenha a
            camada. Com o seletor de tags aberto, Escape fecha só o seletor.
          </>
        }
      >
        <div className="flex justify-center py-6">
          <Button onClick={() => setCamada(true)}>
            <ArrowLineLeft size={16} weight="regular" />
            Abrir lead
          </Button>
        </div>
        <Drawer aberto={camada} aoFechar={() => setCamada(false)} rotulo="Lead Joel Jota">
          <DrawerLead lead="joel" aoFechar={() => setCamada(false)} className="rounded-none" />
        </Drawer>
      </Secao>

      <Secao
        titulo="Barra de ícones"
        spec="proposta 1A · 4 ações sem rótulo"
        descricao="As quatro ações do perfil — tags, lista, automação e atendente — como botões quadrados só com o ícone, e uma linha de legenda embaixo. Refeita com os componentes do sistema."
        nota={
          <>
            Mesmo com o traço, o raio e o ícone certos, a legenda continua sendo a confissão do desenho: se os ícones
            precisam de uma lista de nomes logo abaixo, eles não estão comunicando. E o quarto botão é o avatar do
            atendente, que num cartão de contato lê como uma segunda pessoa, não como um seletor.
          </>
        }
      >
        <div className="overflow-x-auto">
          <PropostaBarraDeIcones className="h-[720px] max-w-none" />
        </div>
      </Secao>

      <Secao
        titulo="Trilho de ícones"
        spec="proposta 2C · 12 seções sem rótulo"
        descricao="A navegação do lead como uma coluna de 52px só com ícones, ao lado do conteúdo do contato. O rótulo aparece ao passar o mouse."
        nota={
          <>
            Os ícones são os do Phosphor, no peso do sistema — e ainda assim doze destinos sem texto não se distinguem.
            Passe o mouse pelo trilho e tente adivinhar qual é Campos adicionais, qual é Hierarquia e qual é Históricos
            antes de ler a dica. Em toque, a dica <span className="text-foreground">nunca</span> aparece.
          </>
        }
      >
        <div className="overflow-x-auto">
          <PropostaTrilhoDeIcones className="h-[720px] max-w-none" />
        </div>
      </Secao>

      <Secao
        titulo="Grade de duas colunas"
        spec="proposta 2B · 12 itens em 6 linhas"
        descricao="O menu em grade de duas colunas, com o ícone acima do rótulo, para os doze itens caberem sem rolagem."
        nota={
          <>
            A grade resolve a rolagem e cobra a leitura: o olho varre menu de cima para baixo, não em zigue-zague, e
            aqui ele precisa fazer os dois. Some a isso o rótulo que quebra em duas linhas — Campos adicionais,
            Atendimentos — e as células deixam de ter a mesma altura.
          </>
        }
      >
        <div className="overflow-x-auto">
          <PropostaGrade className="h-[720px] max-w-none" />
        </div>
      </Secao>

    </PaginaDS>
  );
}
