"use client";

import { useState } from "react";
import { ArrowLineLeft, ChatCircleDots, Handshake, UsersThree } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerBloco,
  DrawerContato,
  DrawerMenu,
  DrawerMetricas,
  DrawerPerfil,
  HierarquiaNo,
  LinhaDoTempo,
  type TomPerfil,
} from "@/components/ui/drawer";
import { Tag } from "@/components/ui/tag";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";
import { CATALOGO_TAGS, DrawerLead, LEADS, MENU_LEAD, tagsEscolhidas } from "./drawer-lead";

function PerfilDeExemplo({ estilo }: { estilo: "outline" | "fill" }) {
  const [menu, setMenu] = useState("historicos");
  const lead = LEADS.rafael;
  return (
    <DrawerPerfil
      nome={lead.nome}
      tipo={lead.tipo}
      rotuloTipo="Pessoa"
      telefone={lead.telefone}
      email={lead.email}
      estilo={estilo}
      className="rounded-md border"
      tags={tagsEscolhidas(CATALOGO_TAGS, lead.tags)
        .slice(0, 3)
        .map((t) => (
          <Tag key={t.id} status={t.status} foto={t.foto}>
            {t.rotulo}
          </Tag>
        ))}
    >
      <DrawerBloco titulo="Métricas">
        <DrawerMetricas itens={lead.metricas} />
      </DrawerBloco>
      <DrawerBloco titulo="Contato principal">
        <DrawerContato linhas={lead.contato} />
      </DrawerBloco>
      <DrawerBloco titulo="Menu">
        <DrawerMenu rotulo={`Seções do lead · ${estilo}`} itens={MENU_LEAD.slice(0, 7)} atual={menu} aoEscolher={setMenu} />
      </DrawerBloco>
    </DrawerPerfil>
  );
}

const tons: { tom: TomPerfil; nome: string; tipo: "pessoa" | "empresa"; origem: string }[] = [
  { tom: "azul", nome: "Rafael Pinto Pinheiro", tipo: "pessoa", origem: "arquivo · 565:6447" },
  { tom: "roxo", nome: "Joel Jota", tipo: "empresa", origem: "arquivo · 565:8651" },
  { tom: "rosa", nome: "Marina Albuquerque", tipo: "pessoa", origem: "matiz 330°" },
  { tom: "laranja", nome: "Norte Logística", tipo: "empresa", origem: "matiz 24°" },
];

const leadsDoPreview = [
  { id: "rafael" as const, rotulo: "Rafael · pessoa" },
  { id: "joel" as const, rotulo: "Joel Jota · empresa" },
];

export default function DrawerPage() {
  const [lead, setLead] = useState<keyof typeof LEADS>("rafael");
  const [fechadoNoPreview, setFechadoNoPreview] = useState(false);
  const [camada, setCamada] = useState(false);
  const [menuSolto, setMenuSolto] = useState("historicos");

  return (
    <PaginaDS
      titulo="Drawer"
      descricao="O lead aberto pela direita: uma coluna de perfil com 320px e o conteúdo da seção escolhida no menu. O arquivo desenha cinco seções — Histórico, Perfil, Campos adicionais, Negócios e Hierarquia — e todas estão abaixo, vivas."
      secoes={["Como funciona", "Drawer do lead", "Perfil", "Cores do perfil", "Menu", "Linha do tempo", "Hierarquia", "Camada", "Quando usar"]}
    >
      <ComoFunciona>
        <p>
          No Figma o <Chip>Drawer</Chip> é um component set com um eixo <Chip>Menu</Chip> de cinco valores. Aqui esse
          eixo <span className="text-foreground">não vira prop</span>: ele é só o item escolhido no menu, e cada valor
          é o que vai na coluna da direita. O componente é um jogo de peças — <Chip>DrawerPainel</Chip>,{" "}
          <Chip>DrawerPerfil</Chip>, <Chip>DrawerBloco</Chip>, <Chip>DrawerMetricas</Chip>,{" "}
          <Chip>DrawerContato</Chip>, <Chip>DrawerMenu</Chip> e <Chip>DrawerConteudo</Chip> — e a tela monta com elas o
          que o lead tiver.
        </p>
        <p>
          O perfil tem dois estilos, <Chip>outline</Chip> e <Chip>fill</Chip>, e o estilo vale para a coluna inteira.
          Por isso ele é passado uma vez no <Chip>DrawerPerfil</Chip> e desce por contexto até as métricas, o contato
          e o menu. No outline as caixas têm traço de 2px <span className="text-foreground">por dentro</span>, como o
          Figma desenha: nas métricas e no contato isso é borda com o recuo descontado (regra D14); no menu, que não
          tem recuo vertical, é um anel interno — senão a caixa cresceria 4px.
        </p>
        <p>
          Com altura definida — a tela inteira, na camada — <span className="text-foreground">perfil e conteúdo rolam
          cada um por conta própria</span>: descer no menu não tira o título da seção de vista, e ler a linha do tempo
          não esconde de quem é o lead. A cor do topo do perfil é o <Chip>tom</Chip>: anel e letra do avatar, texto da
          tag de tipo e brilho do degradê. Azul e roxo são do arquivo; rosa e laranja seguem a mesma regra.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Drawer do lead"
        spec="1080px · 5 seções desenhadas"
        descricao="Troque o lead e a seção no menu. O + no fim das tags abre o seletor; os dois quadrados de um campo copiam o valor; o botão do canto direito do perfil recolhe a coluna."
        codigo={`<DrawerPainel className="h-[760px]">
  <DrawerPerfil nome="Joel Jota" tipo="empresa" rotuloTipo="Empresa"
    telefone="+55 (11) 98765-4321" email="contact@datawave.com"
    tags={<>{tags}<SeletorTags grupos={catalogo} selecionadas={ids} aoAlternar={…} aoCriar={…} rotulos={…} /></>}
    acoes={<><Button>Automação</Button><Button variant="soft">Atendimento</Button></>}
    aoFechar={fechar} aoRecolher={recolher}>
    <DrawerBloco titulo="Métricas"><DrawerMetricas itens={metricas} /></DrawerBloco>
    <DrawerBloco titulo="Contato principal"><DrawerContato linhas={contato} /></DrawerBloco>
    <DrawerBloco titulo="Menu">
      <DrawerMenu rotulo="Seções do lead" itens={menu} atual={secao} aoEscolher={setSecao} />
    </DrawerBloco>
  </DrawerPerfil>
  <DrawerConteudo titulo="Histórico" descricao="Veja o histórico do seu lead" acoes={…}>
    <LinhaDoTempo eventos={eventos} />
  </DrawerConteudo>
</DrawerPainel>`}
        nota={
          <>
            O preview fixa o painel em 760px de altura para mostrar as duas colunas rolando. Na{" "}
            <span className="text-foreground">Camada</span> ele ocupa a tela inteira. Abaixo de 1080px de largura, a
            caixa rola na horizontal.
          </>
        }
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {leadsDoPreview.map((l) => (
            <Button
              key={l.id}
              size="sm"
              variant={lead === l.id ? "soft" : "outline"}
              aria-pressed={lead === l.id}
              onClick={() => {
                setLead(l.id);
                setFechadoNoPreview(false);
              }}
            >
              {l.rotulo}
            </Button>
          ))}
        </div>
        <div className="overflow-x-auto">
          {fechadoNoPreview ? (
            <div className="flex justify-center py-10">
              <Button variant="soft" onClick={() => setFechadoNoPreview(false)}>
                <ArrowLineLeft size={16} weight="regular" />
                Reabrir o drawer
              </Button>
            </div>
          ) : (
            // max-w-none: no preview o painel mantém os 1080px e a caixa rola;
            // sem isso ele encolhe até a coluna e o conteúdo fica com 430px.
            <DrawerLead key={lead} lead={lead} aoFechar={() => setFechadoNoPreview(true)} className="h-[760px] max-w-none" />
          )}
        </div>
      </Secao>

      <Secao
        titulo="Perfil"
        spec="outline · fill"
        descricao="A mesma coluna nos dois estilos. Outline desenha as caixas com traço de 2px em background; fill, com fundo background."
        codigo={`<DrawerPerfil estilo="outline" …>…</DrawerPerfil>
<DrawerPerfil estilo="fill" …>…</DrawerPerfil>`}
      >
        <div className="flex flex-wrap justify-center gap-4">
          <PerfilDeExemplo estilo="outline" />
          <PerfilDeExemplo estilo="fill" />
        </div>
      </Secao>

      <Secao
        titulo="Cores do perfil"
        spec="tom · 4"
        descricao="O tom muda o anel e a letra do avatar, o texto da tag de tipo e o brilho do topo. O resto — botões, tags, menu — continua azul. Sem a prop, pessoa sai azul e empresa sai roxo, como no arquivo."
        codigo={`<DrawerPerfil tipo="pessoa" …/>              {/* azul */}
<DrawerPerfil tipo="empresa" …/>             {/* roxo */}
<DrawerPerfil tipo="pessoa" tom="rosa" …/>
<DrawerPerfil tipo="empresa" tom="laranja" …/>`}
        nota={
          <>
            Os quatro roxos do arquivo (<Chip>#F2E8FF</Chip>, <Chip>#6C12E2</Chip>, <Chip>#8B33FF</Chip>,{" "}
            <Chip>#EEE0FF</Chip>) são exatamente o azul do sistema com o matiz girado para 266° — mesma saturação, mesma
            luminosidade. Rosa (330°) e laranja (24°) saem da mesma conta, e o escuro de cada um repete o S/L do azul
            escuro. Os valores moram em <Chip>[data-tom]</Chip> no <Chip>globals.css</Chip>. Verde e amarelo ficaram de
            fora: na mesma luminosidade, o texto da tag não se lê sobre branco.
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
        spec="36px · 3 estados"
        descricao="Repouso, hover e selecionado — os três desenhados no arquivo, nos dois temas. O selecionado ganha fundo, texto e ícone azuis e o caret à direita."
        codigo={`<DrawerMenu
  rotulo="Seções do lead"
  itens={[{ id: "perfil", rotulo: "Perfil", icone: User }, …]}
  atual={secao}
  aoEscolher={setSecao}
/>`}
        nota={
          <>
            Os tokens são os mesmos do item da Sidebar: <Chip>nav/item/bg-hover</Chip>,{" "}
            <Chip>nav/item/bg-selected</Chip>, <Chip>nav/item/text-selected</Chip>. O ícone em repouso é{" "}
            <Chip>nav/item/text-default</Chip> e o texto é <Chip>foreground</Chip>. Cada item é{" "}
            <Chip>&lt;button&gt;</Chip> com <Chip>aria-current</Chip> no escolhido.
          </>
        }
      >
        <div className="mx-auto w-[280px]">
          <DrawerMenu rotulo="Menu de exemplo" itens={MENU_LEAD} atual={menuSolto} aoEscolher={setMenuSolto} />
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
        titulo="Quando usar"
        descricao="Drawer é para consultar e editar um registro sem sair da lista. Se a tarefa pede a tela inteira, é página."
      >
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Um registro por vez.</span> O drawer abre o lead clicado na tabela ou no
            funil; a lista continua atrás, no mesmo lugar. Dois drawers empilhados é sinal de que o segundo devia ser
            página.
          </li>
          <li>
            <span className="text-foreground">O menu troca o conteúdo, não a URL da lista.</span> Cada seção é uma
            coluna da direita; o perfil fica parado para a pessoa não perder de vista de quem é o dado.
          </li>
          <li>
            <span className="text-foreground">Tom identifica o tipo, não enfeita.</span> Um tom por tipo de registro,
            igual em toda a conta. Tom por gosto de cada lead vira ruído.
          </li>
          <li>
            <span className="text-foreground">Fecha sempre do mesmo jeito.</span> X no canto, Escape e clique no
            scrim. Edição não salva ao fechar é decisão da tela, não do drawer — e precisa de confirmação.
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
