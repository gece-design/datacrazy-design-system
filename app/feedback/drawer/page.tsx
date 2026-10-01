"use client";

import { useState } from "react";
import { ArrowLineLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";
import { DrawerLead, LEADS } from "./drawer-lead";

const leadsDoPreview = [
  { id: "rafael" as const, rotulo: "Rafael · pessoa" },
  { id: "joel" as const, rotulo: "Joel Jota · empresa" },
];

export default function DrawerPage() {
  const [lead, setLead] = useState<keyof typeof LEADS>("rafael");
  const [fechadoNoPreview, setFechadoNoPreview] = useState(false);

  return (
    <PaginaDS
      titulo="Drawer"
      descricao="O lead aberto pela direita: uma coluna de perfil com 320px e o conteúdo da seção escolhida no menu. O arquivo desenha cinco seções — Histórico, Perfil, Campos adicionais, Negócios e Hierarquia — e todas estão abaixo, vivas. As variações — tons, menu, linha do tempo, hierarquia, camada e as propostas — têm página própria."
      secoes={["Como funciona", "Drawer do lead", "Quando usar"]}
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
          O estilo da coluna é o <Chip>outline</Chip>: caixas com traço de 2px <span className="text-foreground">por
          dentro</span>, como o Figma desenha — nas métricas e no contato isso é borda com o recuo descontado (regra
          D14); no menu, que não tem recuo vertical, é um anel interno, senão a caixa cresceria 4px. O estilo é passado
          uma vez no <Chip>DrawerPerfil</Chip> e desce por contexto.
        </p>
        <p>
          Com altura definida — a tela inteira, na camada — <span className="text-foreground">quem rola no perfil é o
          menu, não a coluna</span>: nome, telefone, métricas e contato ficam sempre à vista, e a lista de seções
          ocupa o que sobra e rola por dentro (cliente, 2026-09-18: em notebook de tela baixa, o nome não pode sumir).
          O conteúdo rola por conta própria. Cada área que rola mostra uma seta na borda enquanto continua além dela,
          e a seta some quando chega ao fim. A cor do topo do perfil é o <Chip>tom</Chip>: anel e letra do avatar, texto da
          tag de tipo e brilho do degradê. Azul e roxo são do arquivo; rosa e laranja seguem a mesma regra.
        </p>
      </ComoFunciona>
      <Secao
        titulo="Drawer do lead"
        spec="840px · arrastável até 1080 · 5 seções desenhadas"
        descricao="Troque o lead e a seção no menu. O + no fim das tags abre o seletor; os dois quadrados de um campo copiam o valor; o botão do canto direito do perfil recolhe a coluna."
        codigo={`<DrawerPainel className="h-[760px]">
  <DrawerPerfil nome="Joel Jota" tipo="empresa" rotuloTipo="Empresa"
    telefone="+55 (11) 98765-4321" email="contact@datawave.com"
    tags={<>{tags}<SeletorTags grupos={catalogo} selecionadas={ids} aoAlternar={alternar} aoCriar={criar} rotulos={rotulosDoSeletor} /></>}
    acoes={<><Button>Automação</Button><Button variant="soft">Atendimento</Button></>}
    aoFechar={fechar} aoRecolher={recolher}>
    <DrawerBloco titulo="Métricas"><DrawerMetricas itens={metricas} /></DrawerBloco>
    {/* só lead empresa: a pessoa por trás dele */}
    {tipo === "empresa" ? <DrawerBloco titulo="Contato principal"><DrawerContato linhas={contato} /></DrawerBloco> : null}
    {/* rolagem: o menu ocupa o que sobra da coluna e rola por dentro */}
    <DrawerBloco titulo="Menu" rolagem={{ subir: "Subir no menu", descer: "Descer no menu" }}>
      <DrawerMenu rotulo="Seções do lead" itens={menu} atual={secao} aoEscolher={setSecao} />
    </DrawerBloco>
  </DrawerPerfil>
  <DrawerConteudo
    titulo="Histórico"
    descricao="Veja o histórico do seu lead"
    acoes={<><Button variant="tertiary" size="icon" aria-label="Filtrar"><FunnelSimple size={16} weight="regular" /></Button><Button variant="tertiary" size="icon" aria-label="Comentar"><ChatText size={16} weight="regular" /></Button></>}
  >
    <LinhaDoTempo eventos={eventos} />
  </DrawerConteudo>
</DrawerPainel>`}
        nota={
          <>
            O preview fixa o painel em 760px de altura para mostrar o menu e o conteúdo rolando. Na{" "}
            <span className="text-foreground">Camada</span> ele ocupa a tela inteira. Arraste a borda esquerda para mudar a largura (720 a 1080): sob o
            cursor aparece um traço de 3px. Abaixo do mínimo, a caixa rola na horizontal.
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
        titulo="Quando usar"
        descricao="Drawer é para o registro completo: perfil, métricas e um menu de seções. O registro que abre de uma lista fica no Painel lateral, que não cobre a lista."
      >
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Um registro por vez.</span> O drawer cobre a tela para mostrar tudo
            de um lead. Para consultar e editar passando de um registro a outro, o lugar é o Painel lateral. Dois
            drawers empilhados é sinal de que o segundo devia ser página.
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
