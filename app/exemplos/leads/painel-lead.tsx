"use client";

import * as React from "react";
import { ArrowsClockwise, Buildings, CalendarBlank, CalendarCheck, CurrencyCircleDollar, EnvelopeSimple, IdentificationCard, Lightning, Phone, ShareNetwork, Tag as IconeDeTag, UserPlus, Wallet } from "@phosphor-icons/react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { OpcaoCombobox } from "@/components/ui/combobox";
import { CelulaEditavel, CelulaEscolha } from "@/components/ui/data-table";
import { DrawerSecao, LinhaDoTempo } from "@/components/ui/drawer";
import { AcaoCopiar, CampoEditavel } from "@/components/ui/input";
import { LinhaDeCampo, ListaDeCampos, PainelLateral, PainelLateralCorpo } from "@/components/ui/painel-lateral";
import { Select } from "@/components/ui/select";
import { SeletorTags, Tag } from "@/components/ui/tag";
// O drawer é UM: o mesmo `DrawerLead` da página do Drawer no design system,
// aberto com o lead clicado na lista. As versões em avaliação (abas, ao lado,
// página) montam o mesmo lead com as mesmas peças — ADR-081.
import { DrawerLead, PaginaDoLead, cabecalhos, type LayoutDoLead, type LeadDoDrawer, type SecaoDoDrawer } from "@/components/ui/drawer-do-lead";
import { gradeDeCartoes } from "@/lib/campo";
import { tomDe, type Tom } from "@/lib/tons";
import { comprasDe, dataCurta, moeda, tagsDe, type Lead, type Origem, type TagDaConta } from "./dados";

/** Como o lead abre na tela: no drawer com menu (o padrão), no drawer com abas, ao lado da lista ou como página (ADR-081). */
export type VersaoDoLead = "drawer" | "abas" | "lado" | "cheia";

type PropsDoLead = {
  lead: Lead;
  /** O catálogo de tags da conta. */
  tags: TagDaConta[];
  /** As origens como opções: as mesmas da célula e do filtro. */
  opcoesDeOrigem: OpcaoCombobox[];
  aoFechar: () => void;
  aoEditar: (campos: Partial<Lead>) => void;
  /** Cria a tag no catálogo e devolve o id: ela já sai marcada no lead. */
  aoCriarTag: (rotulo: string, tom: Tom | null) => string;
};

/**
 * O que toda versão do lead precisa: os dados do drawer (nome, contato, as
 * quatro métricas), a fileira de tags que escreve na linha e as duas seções
 * com o dado DESTE lead — Histórico e Perfil. O resto do menu é o conteúdo
 * de exemplo do próprio drawer.
 */
function usarLeadDoDrawer({ lead, tags, opcoesDeOrigem, aoEditar, aoCriarTag }: Omit<PropsDoLead, "aoFechar">) {
  // As seções são componentes: ficam estáveis entre renders (senão remontam a
  // cada tecla) e leem o lead e os callbacks atuais por ref.
  const atual = React.useRef({ lead, aoEditar, opcoesDeOrigem });
  atual.current = { lead, aoEditar, opcoesDeOrigem };

  const secoes = React.useMemo<Partial<Record<string, SecaoDoDrawer>>>(
    () => ({
      historicos: {
        ...cabecalhos.historicos,
        Corpo: function Historicos() {
          const { lead } = atual.current;
          return (
            <LinhaDoTempo
              eventos={[{ id: "criado", titulo: "Lead criado", detalhes: [`Origem: ${lead.origem}`, dataCurta(lead.criadoEm)], icone: UserPlus }]}
            />
          );
        },
      },
      perfil: {
        ...cabecalhos.perfil,
        Corpo: function Perfil() {
          const { lead, aoEditar, opcoesDeOrigem } = atual.current;
          return (
            <>
              <DrawerSecao titulo="Dados cadastrais">
                <div className={gradeDeCartoes}>
                  <CampoEditavel rotulo="Nome" valor={lead.nome} aoSalvar={(v) => aoEditar({ nome: v })} rotuloEditar="Editar nome do lead" textoVazio="Adicionar" />
                  <CampoEditavel rotulo="Empresa" valor={lead.empresa} aoSalvar={(v) => aoEditar({ empresa: v })} rotuloEditar="Editar empresa" textoVazio="Adicionar" />
                  <CampoEditavel
                    rotulo="Documento"
                    valor={lead.documento}
                    aoSalvar={(v) => aoEditar({ documento: v })}
                    rotuloEditar="Editar documento"
                    textoVazio="Adicionar"
                    iconeInicio={IdentificationCard}
                  />
                  {/* grupos com cabeçalho e ícone por opção, no cartão do drawer */}
                  <Select cartao rotulo="Origem" opcoes={opcoesDeOrigem} valor={lead.origem} aoEscolher={(v) => aoEditar({ origem: v as Origem })} />
                </div>
              </DrawerSecao>
              <DrawerSecao titulo="Contato">
                <div className={gradeDeCartoes}>
                  <CampoEditavel
                    rotulo="Telefone"
                    valor={lead.telefone}
                    aoSalvar={(v) => aoEditar({ telefone: v })}
                    rotuloEditar="Editar telefone"
                    textoVazio="Adicionar"
                    acoes={<AcaoCopiar rotulo="Copiar telefone" rotuloCopiado="Telefone copiado" valor={lead.telefone} />}
                  />
                  <CampoEditavel
                    rotulo="E-mail"
                    valor={lead.email}
                    aoSalvar={(v) => aoEditar({ email: v })}
                    rotuloEditar="Editar e-mail"
                    textoVazio="Adicionar"
                    acoes={<AcaoCopiar rotulo="Copiar e-mail" rotuloCopiado="E-mail copiado" valor={lead.email} />}
                  />
                </div>
              </DrawerSecao>
            </>
          );
        },
      },
    }),
    [],
  );

  /* As quatro métricas do drawer, com os números deste lead. */
  const compras = comprasDe(lead);
  const dados: LeadDoDrawer = {
    nome: lead.nome,
    tipo: "pessoa",
    telefone: lead.telefone,
    email: lead.email,
    tags: lead.tags,
    metricas: [
      { rotulo: "Ticket médio", valor: moeda(compras.ticket), icone: CurrencyCircleDollar },
      { rotulo: "Total", valor: moeda(compras.total), icone: Wallet },
      { rotulo: "Ciclo de compra", valor: compras.cicloDias ? `${compras.cicloDias}d` : "—", icone: ArrowsClockwise },
      { rotulo: "Compras", valor: String(compras.pedidos), icone: CalendarCheck },
    ],
  };

  const fileiraDeTags = (
    <>
      {tagsDe(tags, lead.tags).map((t) => (
        <Tag key={t.id} tom={t.tom ?? undefined}>
          {t.rotulo}
        </Tag>
      ))}
      <SeletorTags
        // um grupo só: as tags da conta, com a cor que quem criou escolheu
        grupos={[{ id: "tags", rotulo: "Tags", corLivre: true, tags: tags.map((t) => ({ id: t.id, rotulo: t.rotulo, tom: t.tom ?? undefined })) }]}
        selecionadas={lead.tags}
        aoAlternar={(t) => aoEditar({ tags: lead.tags.includes(t.id) ? lead.tags.filter((x) => x !== t.id) : [...lead.tags, t.id] })}
        aoCriar={(rotulo, _grupo, tom) => aoEditar({ tags: [...lead.tags, aoCriarTag(rotulo, tom ?? null)] })}
        rotulos={{
          gatilho: "Adicionar tag",
          busca: "Buscar ou criar tag",
          vazio: "Nenhuma tag encontrada",
          criar: (texto) => `Criar "${texto}"`,
          cor: "Cor",
          icone: "Ícone",
        }}
      />
    </>
  );

  return { dados, secoes, fileiraDeTags };
}

/** O lead no Drawer do design system: com o menu de seções (o padrão) ou com abas (`layout="abas"`). */
export function PainelLead({ aoFechar, layout = "menu", ...resto }: PropsDoLead & { layout?: LayoutDoLead }) {
  const { dados, secoes, fileiraDeTags } = usarLeadDoDrawer(resto);
  return (
    <DrawerLead
      dados={dados}
      // a mesma cor das iniciais na lista
      tom={tomDe(resto.lead.nome)}
      secoes={secoes}
      menuInicial="perfil"
      aoFechar={aoFechar}
      layout={layout}
      // a largura que a pessoa arrastou fica guardada por tela (uma memória por versão)
      memoria={layout === "abas" ? "leads-lead-abas" : "leads-lead"}
      className="rounded-none"
      tags={fileiraDeTags}
    />
  );
}

/** O lead como página, no lugar da lista: perfil à esquerda, seções em abas à direita (versão em avaliação). */
export function LeadNaPagina({ aoFechar, ...resto }: PropsDoLead) {
  const { dados, secoes, fileiraDeTags } = usarLeadDoDrawer(resto);
  return <PaginaDoLead dados={dados} tom={tomDe(resto.lead.nome)} secoes={secoes} tags={fileiraDeTags} aoFechar={aoFechar} />;
}

/**
 * O lead ao lado da lista, no `PainelLateral` de 480: campos em linha, as tags
 * e o histórico; o botão de tela cheia abre o painel na janela inteira
 * (versão em avaliação — a que a reunião de 2 de outubro lembrou).
 */
export function PainelLadoDoLead({
  lead,
  tags,
  opcoesDeOrigem,
  aoFechar,
  aoEditar,
  aoCriarTag,
  telaCheia,
  aoAlternarTelaCheia,
}: PropsDoLead & { telaCheia: boolean; aoAlternarTelaCheia: () => void }) {
  return (
    <PainelLateral
      titulo={lead.nome}
      subtitulo={
        lead.empresa ? (
          <>
            <Buildings size={12} weight="regular" aria-hidden="true" className="shrink-0" />
            <span className="truncate">{lead.empresa}</span>
          </>
        ) : undefined
      }
      inicio={<Avatar nome={lead.nome} size="sm" tom="auto" iniciais="duas" aria-hidden="true" className="shrink-0" />}
      acoes={
        <Button variant="soft" size="sm">
          <Lightning size={16} weight="regular" />
          Automação
        </Button>
      }
      telaCheia={telaCheia}
      aoAlternarTelaCheia={aoAlternarTelaCheia}
      aoFechar={aoFechar}
      rotulos={{ fechar: `Fechar ${lead.nome}`, expandir: "Abrir em tela cheia", recolher: "Voltar ao painel" }}
    >
      <PainelLateralCorpo>
        <ListaDeCampos>
          <LinhaDeCampo icone={Buildings} rotulo="Empresa">
            <CelulaEditavel valor={lead.empresa} rotulo={`Editar empresa de ${lead.nome}`} aoSalvar={(empresa) => aoEditar({ empresa })} />
          </LinhaDeCampo>
          <LinhaDeCampo icone={Phone} rotulo="Telefone">
            <CelulaEditavel valor={lead.telefone} rotulo={`Editar telefone de ${lead.nome}`} aoSalvar={(telefone) => aoEditar({ telefone })} />
          </LinhaDeCampo>
          <LinhaDeCampo icone={EnvelopeSimple} rotulo="E-mail">
            <CelulaEditavel valor={lead.email} rotulo={`Editar e-mail de ${lead.nome}`} aoSalvar={(email) => aoEditar({ email })} />
          </LinhaDeCampo>
          <LinhaDeCampo icone={IdentificationCard} rotulo="Documento">
            <CelulaEditavel valor={lead.documento} rotulo={`Editar documento de ${lead.nome}`} aoSalvar={(documento) => aoEditar({ documento })} />
          </LinhaDeCampo>
          <LinhaDeCampo icone={ShareNetwork} rotulo="Origem">
            <CelulaEscolha
              rotulo={`Mudar origem de ${lead.nome}`}
              opcoes={opcoesDeOrigem}
              selecionados={[lead.origem]}
              aoAlternar={(origem) => aoEditar({ origem: origem as Origem })}
              rotulos={{ busca: "Buscar origem", vazio: "Nenhuma origem encontrada" }}
            >
              <span className="truncate">{lead.origem}</span>
            </CelulaEscolha>
          </LinhaDeCampo>
          <LinhaDeCampo icone={IconeDeTag} rotulo="Tags">
            <div className="flex flex-wrap items-center gap-1">
              {tagsDe(tags, lead.tags).map((t) => (
                <Tag key={t.id} tom={t.tom ?? undefined}>
                  {t.rotulo}
                </Tag>
              ))}
              <SeletorTags
                grupos={[{ id: "tags", rotulo: "Tags", corLivre: true, tags: tags.map((t) => ({ id: t.id, rotulo: t.rotulo, tom: t.tom ?? undefined })) }]}
                selecionadas={lead.tags}
                aoAlternar={(t) => aoEditar({ tags: lead.tags.includes(t.id) ? lead.tags.filter((x) => x !== t.id) : [...lead.tags, t.id] })}
                aoCriar={(rotulo, _grupo, tom) => aoEditar({ tags: [...lead.tags, aoCriarTag(rotulo, tom ?? null)] })}
                rotulos={{ gatilho: "Adicionar tag", busca: "Buscar ou criar tag", vazio: "Nenhuma tag encontrada", criar: (texto) => `Criar "${texto}"`, cor: "Cor", icone: "Ícone" }}
              />
            </div>
          </LinhaDeCampo>
          <LinhaDeCampo icone={CalendarBlank} rotulo="Criado em">
            {dataCurta(lead.criadoEm)}
          </LinhaDeCampo>
        </ListaDeCampos>
        <DrawerSecao titulo="Histórico">
          <LinhaDoTempo eventos={[{ id: "criado", titulo: "Lead criado", detalhes: [`Origem: ${lead.origem}`, dataCurta(lead.criadoEm)], icone: UserPlus }]} />
        </DrawerSecao>
      </PainelLateralCorpo>
    </PainelLateral>
  );
}
