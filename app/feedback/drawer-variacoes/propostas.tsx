"use client";

/* As três propostas do cliente refeitas com os componentes do DS. Nada aqui
   vira componente: é tela de exemplo, para ser olhada lado a lado com o
   drawer principal em /feedback/drawer.

   Origem: "Ícones dos botões de ação (standalone).html", mocks 1A, 2C e 2B. */

import * as React from "react";
import {
  ChatCircleDots,
  ChatText,
  FunnelSimple,
  ListPlus,
  Play,
  Tag as TagIcon,
  UsersThree,
} from "@phosphor-icons/react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DrawerBloco,
  DrawerContato,
  DrawerConteudo,
  DrawerMenu,
  DrawerMetricas,
  DrawerPainel,
  DrawerPerfil,
  LinhaDoTempo,
  type ItemMenuDrawer,
} from "@/components/ui/drawer";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";
import { CATALOGO_TAGS, LEADS, MENU_LEAD, tagsEscolhidas, linhasDoContato } from "../drawer/drawer-lead";

import { foco, rolagemDiscreta } from "@/lib/estados";
const LEAD = LEADS.joel;

function TagsDoLead({ limite }: { limite?: number }) {
  const escolhidas = tagsEscolhidas(CATALOGO_TAGS, LEAD.tags);
  const visiveis = limite ? escolhidas.slice(0, limite) : escolhidas;
  const restantes = escolhidas.length - visiveis.length;
  return (
    <>
      {visiveis.map((t) => (
        <Tag key={t.id} status={t.status} foto={t.foto}>
          {t.rotulo}
        </Tag>
      ))}
      {restantes > 0 ? <Tag>+{restantes}</Tag> : null}
    </>
  );
}

/** A coluna da direita é a mesma nas três: o que muda é sempre a da esquerda. */
function ConteudoHistoricos() {
  return (
    <DrawerConteudo
      titulo="Históricos"
      descricao="Veja o histórico do seu lead"
      acoes={
        <>
          <Button variant="outline">
            <FunnelSimple size={16} weight="regular" />
            Todos
          </Button>
          <Button variant="soft">
            <ChatText size={16} weight="regular" />
            Comentário
          </Button>
        </>
      }
    >
      <LinhaDoTempo
        eventos={[
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
    </DrawerConteudo>
  );
}

/* ------------------------------------------- Proposta 1 · barra de ícones -- */

/** Mock 1A: as quatro ações do perfil viram ícones sem rótulo, e uma linha de
 *  legenda embaixo diz o que cada um faz. */
export function PropostaBarraDeIcones({ className }: { className?: string }) {
  const [menu, setMenu] = React.useState("historicos");

  const acoes = [
    { id: "tags", rotulo: "Adicionar tags", icone: TagIcon },
    { id: "lista", rotulo: "Adicionar à lista", icone: ListPlus },
    { id: "automacao", rotulo: "Executar automação", icone: Play },
  ];

  return (
    <DrawerPainel className={className}>
      <DrawerPerfil
        nome={LEAD.nome}
        tipo={LEAD.tipo}
        rotuloTipo="Empresa"
        telefone={LEAD.telefone}
        email={LEAD.email}
        tags={<TagsDoLead limite={3} />}
        acoes={
          <div className="flex flex-col items-center gap-2.5">
            <div className="flex items-center gap-2.5">
              {acoes.map((a) => {
                const Icone = a.icone;
                return (
                  <button
                    key={a.id}
                    type="button"
                    aria-label={a.rotulo}
                    title={a.rotulo}
                    className={cn(
                      "flex size-[38px] items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary",
                      foco,
                    )}
                  >
                    <Icone size={19} weight="regular" aria-hidden="true" />
                  </button>
                );
              })}
              <button
                type="button"
                aria-label="Atendente: Davi Baldin"
                title="Atendente: Davi Baldin"
                className={cn(
                  "flex size-[38px] items-center justify-center rounded-md border border-border bg-card transition-colors hover:border-primary",
                  foco,
                )}
              >
                <Avatar nome="Davi Baldin" size="sm" className="size-6 border-2 text-label-sm" aria-hidden="true" />
              </button>
            </div>
            {/* A legenda é a confissão do desenho: se os ícones precisam de uma
                lista de nomes embaixo, eles não estão comunicando nada. */}
            <p className="text-caption text-subtle-foreground">Tags · Lista · Automação · Atendente</p>
          </div>
        }
      >
        <DrawerBloco titulo="Métricas">
          <DrawerMetricas itens={LEAD.metricas} />
        </DrawerBloco>
        {LEAD.tipo === "empresa" && LEAD.contatoPrincipal ? (
          <DrawerBloco titulo="Contato principal">
            <DrawerContato linhas={linhasDoContato(LEAD.contatoPrincipal)} />
          </DrawerBloco>
        ) : null}
        <DrawerBloco titulo="Menu">
          <DrawerMenu rotulo="Seções do lead" itens={MENU_LEAD} atual={menu} aoEscolher={setMenu} />
        </DrawerBloco>
      </DrawerPerfil>
      <ConteudoHistoricos />
    </DrawerPainel>
  );
}

/* ------------------------------------------ Proposta 2 · trilho de ícones -- */

/** Mock 2C: as doze seções viram uma coluna de 52px só com glifos. O rótulo
 *  aparece no hover, via `title` — em toque, nunca. */
export function PropostaTrilhoDeIcones({ className }: { className?: string }) {
  const [menu, setMenu] = React.useState("historicos");

  return (
    <DrawerPainel className={className}>
      {/* `data-tom` é o que define --tom-anel/--tom-texto/--tom-brilho. Sem ele
          o anel do avatar cai para um hsl() inválido e vira preto. */}
      <div data-tom="roxo" className="flex w-[320px] shrink-0 items-stretch border-r border-border bg-card">
        <nav
          aria-label="Seções do lead"
          className={cn("flex w-[52px] shrink-0 flex-col items-center gap-1 overflow-y-auto border-r border-border bg-background py-2", rolagemDiscreta)}
        >
          {MENU_LEAD.map((item: ItemMenuDrawer) => {
            const Icone = item.icone;
            const selecionado = item.id === menu;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.rotulo}
                title={item.rotulo}
                aria-current={selecionado ? "true" : undefined}
                onClick={() => setMenu(item.id)}
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-md transition-colors",
                  foco,
                  selecionado
                    ? "bg-nav-item-selected text-nav-item-selected-icon"
                    : "text-nav-item hover:bg-nav-item-hover hover:text-foreground",
                )}
              >
                <Icone size={18} weight="regular" aria-hidden="true" />
              </button>
            );
          })}
        </nav>

        <div className={cn("flex min-w-0 flex-1 flex-col items-center gap-3 overflow-y-auto bg-card px-4 py-5", rolagemDiscreta)}>
          <div className="relative flex flex-col items-center gap-1">
            <Avatar nome={LEAD.nome} size="lg" aria-hidden="true" className="border-tom-anel text-tom-texto" />
            <p className="text-center text-h2 text-foreground">{LEAD.nome}</p>
            <Tag tipo={LEAD.tipo} className="bg-background p-1 text-tom-tag">
              Empresa
            </Tag>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1">
            <TagsDoLead limite={3} />
          </div>
          <div className="flex w-full flex-col gap-2">
            <Button className="w-full">
              <Play size={16} weight="regular" />
              Automação
            </Button>
            <Button variant="soft" className="w-full">
              <Avatar nome="Davi Baldin" size="sm" className="size-5 border-2 text-label-sm" aria-hidden="true" />
              Davi Baldin
            </Button>
          </div>
          <DrawerMetricas itens={LEAD.metricas} className="w-full" />
        </div>
      </div>
      <ConteudoHistoricos />
    </DrawerPainel>
  );
}

/* ------------------------------------------------- Proposta 3 · grade 2×6 -- */

/** Mock 2B: o menu deixa de ser lista e vira grade de duas colunas, com o
 *  ícone acima do rótulo. */
export function PropostaGrade({ className }: { className?: string }) {
  const [menu, setMenu] = React.useState("historicos");

  return (
    <DrawerPainel className={className}>
      <DrawerPerfil
        nome={LEAD.nome}
        tipo={LEAD.tipo}
        rotuloTipo="Empresa"
        telefone={LEAD.telefone}
        email={LEAD.email}
        tags={<TagsDoLead limite={3} />}
        acoes={
          <>
            <Button>
              <Play size={16} weight="regular" />
              Automação
            </Button>
            <Button variant="soft">
              <Avatar nome="Davi Baldin" size="sm" className="size-5 border-2 text-label-sm" aria-hidden="true" />
              Davi Baldin
            </Button>
          </>
        }
      >
        <DrawerBloco titulo="Métricas">
          <DrawerMetricas itens={LEAD.metricas} />
        </DrawerBloco>
        <DrawerBloco titulo="Menu">
          <nav aria-label="Seções do lead">
            <ul className="grid grid-cols-2 gap-1.5">
              {MENU_LEAD.map((item: ItemMenuDrawer) => {
                const Icone = item.icone;
                const selecionado = item.id === menu;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-current={selecionado ? "true" : undefined}
                      onClick={() => setMenu(item.id)}
                      className={cn(
                        "flex w-full flex-col items-start gap-1.5 rounded-md border p-2.5 text-left text-label-md transition-colors",
                        foco,
                        selecionado
                          ? "border-transparent bg-nav-item-selected text-nav-item-selected-foreground"
                          : "border-border text-foreground hover:bg-nav-item-hover",
                      )}
                    >
                      <Icone
                        size={18}
                        weight="regular"
                        aria-hidden="true"
                        className={cn("shrink-0", selecionado ? "text-nav-item-selected-icon" : "text-nav-item")}
                      />
                      {/* Sem truncate de propósito: é assim que o mock quebra
                          "Campos adicionais" em duas linhas e desalinha a grade. */}
                      <span className="min-w-0 leading-[15px]">{item.rotulo}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </DrawerBloco>
        {LEAD.tipo === "empresa" && LEAD.contatoPrincipal ? (
          <DrawerBloco titulo="Contato principal">
            <DrawerContato linhas={linhasDoContato(LEAD.contatoPrincipal)} />
          </DrawerBloco>
        ) : null}
      </DrawerPerfil>
      <ConteudoHistoricos />
    </DrawerPainel>
  );
}
