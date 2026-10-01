"use client";

import * as React from "react";
import {
  ArrowsClockwise,
  Buildings,
  CalendarCheck,
  ChatCircleDots,
  Clock,
  CurrencyDollar,
  EnvelopeSimple,
  FileText,
  FunnelSimple,
  Headset,
  MapPin,
  Note,
  Phone,
  ShareNetwork,
  User,
  Wallet,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { Avatar } from "@/components/ui/avatar";
import { CelulaEditavel, CelulaEscolha } from "@/components/ui/data-table";
import { LinhaDoTempo } from "@/components/ui/drawer";
import { AcaoCopiar } from "@/components/ui/input";
import { LinhaDeCampo, ListaDeCampos, PainelLateral, PainelLateralCorpo } from "@/components/ui/painel-lateral";
import { TabPanel, Tabs } from "@/components/ui/tabs";
import { SeletorTags, Tag } from "@/components/ui/tag";
import type { OpcaoSelect } from "@/components/ui/select";
import { GRUPOS_TAGS, moeda, tagsDe, type Canal, type Etapa, type EtapaId, type Lead, type TipoEvento } from "./dados";
import { IconeDoCanal } from "./quadro";

const glifos: Record<TipoEvento, Icon> = {
  mensagem: ChatCircleDots,
  ligacao: Phone,
  proposta: FileText,
  reuniao: CalendarCheck,
  nota: Note,
};

const ROTULOS_DA_LISTA = { busca: "Buscar", vazio: "Nada encontrado" };

/**
 * O lead aberto AO LADO da lista (ou do quadro): `PainelLateral` do design
 * system, no encaixe `lateral` da TelaBase. A lista continua à vista e clicar
 * em outra linha troca o registro. Os campos vêm em linha — rótulo à
 * esquerda, valor à direita — e editam no lugar: texto com `CelulaEditavel`,
 * valor de lista com `CelulaEscolha`. O botão de expandir leva à tela cheia.
 */
export function PainelLead({
  etapas,
  atendentes,
  origens,
  lead,
  telaCheia,
  aoAlternarTelaCheia,
  aoFechar,
  aoMudarEtapa,
  aoEditar,
  aoTrocarTags,
}: {
  etapas: Etapa[];
  atendentes: string[];
  /** As origens como opções: as mesmas do filtro e do "Novo lead". */
  origens: OpcaoSelect[];
  lead: Lead;
  telaCheia: boolean;
  aoAlternarTelaCheia: () => void;
  aoFechar: () => void;
  aoMudarEtapa: (etapa: EtapaId) => void;
  aoEditar: (campos: Partial<Lead>) => void;
  aoTrocarTags: (ids: string[]) => void;
}) {
  const [aba, setAba] = React.useState("geral");
  // Tag criada no seletor entra no catálogo da conta e já sai marcada.
  const [grupos, setGrupos] = React.useState(GRUPOS_TAGS);
  const Tipo = lead.tipo === "empresa" ? Buildings : User;
  const etapa = etapas.find((e) => e.id === lead.etapa);

  return (
    <PainelLateral
      titulo={lead.nome}
      subtitulo={
        <>
          <Tipo size={12} weight="regular" aria-hidden="true" className="shrink-0" />
          <span className="truncate">{lead.empresa}</span>
        </>
      }
      inicio={<Avatar nome={lead.nome} size="sm" aria-hidden="true" className="shrink-0" />}
      telaCheia={telaCheia}
      aoAlternarTelaCheia={aoAlternarTelaCheia}
      aoFechar={aoFechar}
      rotulos={{ fechar: "Fechar o lead", expandir: "Abrir em tela cheia", recolher: "Voltar ao painel" }}
    >
      <Tabs
        id="lead"
        rotulo="Seções do lead"
        atual={aba}
        aoEscolher={setAba}
        itens={[
          { valor: "geral", rotulo: "Visão geral" },
          { valor: "historico", rotulo: `Histórico · ${lead.historico.length}` },
          { valor: "arquivos", rotulo: "Arquivos" },
        ]}
        className="shrink-0 border-b border-border px-3"
      />
      <PainelLateralCorpo>
        <TabPanel id="lead" valor="geral" atual={aba} className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-1">
            {tagsDe(grupos, lead.tags).map((t) => (
              <Tag key={t.id} status={t.status}>
                {t.rotulo}
              </Tag>
            ))}
            <SeletorTags
              grupos={grupos}
              selecionadas={lead.tags}
              aoAlternar={(t) => aoTrocarTags(lead.tags.includes(t.id) ? lead.tags.filter((x) => x !== t.id) : [...lead.tags, t.id])}
              aoCriar={(rotulo, grupoId) => {
                const id = `${grupoId}-${Date.now()}`;
                setGrupos((gs) => gs.map((g) => (g.id === grupoId ? { ...g, tags: [...g.tags, { id, rotulo }] } : g)));
                aoTrocarTags([...lead.tags, id]);
              }}
              rotulos={{
                gatilho: "Adicionar tag",
                busca: "Buscar ou criar tag",
                vazio: "Nenhuma tag nesta aba",
                criar: (texto, grupo) => `Criar "${texto}" em ${grupo}`,
                cor: "Cor",
              }}
            />
          </div>

          <section aria-labelledby="lead-negocio" className="flex flex-col gap-1">
            <h3 id="lead-negocio" className="text-label-md uppercase text-muted-foreground">
              Negócio
            </h3>
            <ListaDeCampos>
              <LinhaDeCampo icone={FunnelSimple} rotulo="Etapa">
                <CelulaEscolha
                  rotulo={`Mudar etapa de ${lead.nome}`}
                  opcoes={etapas.map((e) => ({ valor: e.id, rotulo: e.rotulo }))}
                  selecionados={[lead.etapa]}
                  aoAlternar={(v) => aoMudarEtapa(v)}
                  rotulos={ROTULOS_DA_LISTA}
                >
                  <span className="truncate">{etapa?.rotulo}</span>
                </CelulaEscolha>
              </LinhaDeCampo>
              <LinhaDeCampo icone={CurrencyDollar} rotulo="Valor">
                <CelulaEditavel
                  valor={String(lead.valor)}
                  formatar={(v) => moeda(Number(v) || 0)}
                  inputMode="numeric"
                  rotulo={`Editar valor de ${lead.nome}`}
                  aoSalvar={(v) => aoEditar({ valor: Number(v.replace(/\D/g, "")) || 0 })}
                />
              </LinhaDeCampo>
              <LinhaDeCampo icone={Headset} rotulo="Atendente">
                <CelulaEscolha
                  rotulo={`Mudar atendente de ${lead.nome}`}
                  opcoes={atendentes.map((a) => ({ valor: a, rotulo: a }))}
                  selecionados={[lead.responsavel]}
                  aoAlternar={(v) => aoEditar({ responsavel: v })}
                  rotulos={ROTULOS_DA_LISTA}
                >
                  <Tag foto="/ds/atendente.png">{lead.responsavel}</Tag>
                </CelulaEscolha>
              </LinhaDeCampo>
              <LinhaDeCampo icone={ShareNetwork} rotulo="Origem">
                <CelulaEscolha
                  rotulo={`Mudar origem de ${lead.nome}`}
                  opcoes={origens}
                  selecionados={[lead.canal]}
                  aoAlternar={(v) => aoEditar({ canal: v as Canal })}
                  rotulos={ROTULOS_DA_LISTA}
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <IconeDoCanal canal={lead.canal} />
                    <span className="truncate">{lead.canal}</span>
                  </span>
                </CelulaEscolha>
              </LinhaDeCampo>
              <LinhaDeCampo icone={Clock} rotulo="Parado na etapa">
                <span className="tabular-nums">{lead.dias} dia(s)</span>
              </LinhaDeCampo>
            </ListaDeCampos>
          </section>

          <section aria-labelledby="lead-contato" className="flex flex-col gap-1">
            <h3 id="lead-contato" className="text-label-md uppercase text-muted-foreground">
              Contato
            </h3>
            <ListaDeCampos>
              <LinhaDeCampo icone={Phone} rotulo="Telefone">
                <span className="flex items-center gap-1">
                  <CelulaEditavel valor={lead.telefone} rotulo={`Editar telefone de ${lead.nome}`} aoSalvar={(v) => aoEditar({ telefone: v })} />
                  <AcaoCopiar rotulo="Copiar telefone" rotuloCopiado="Telefone copiado" valor={lead.telefone} />
                </span>
              </LinhaDeCampo>
              <LinhaDeCampo icone={EnvelopeSimple} rotulo="E-mail">
                <span className="flex items-center gap-1">
                  <CelulaEditavel valor={lead.email} rotulo={`Editar e-mail de ${lead.nome}`} aoSalvar={(v) => aoEditar({ email: v })} />
                  <AcaoCopiar rotulo="Copiar e-mail" rotuloCopiado="E-mail copiado" valor={lead.email} />
                </span>
              </LinhaDeCampo>
              <LinhaDeCampo icone={Buildings} rotulo="Empresa">
                <CelulaEditavel valor={lead.empresa} rotulo={`Editar empresa de ${lead.nome}`} aoSalvar={(v) => aoEditar({ empresa: v })} />
              </LinhaDeCampo>
              <LinhaDeCampo icone={MapPin} rotulo="Cidade">
                <CelulaEditavel valor={lead.cidade} rotulo={`Editar cidade de ${lead.nome}`} aoSalvar={(v) => aoEditar({ cidade: v })} />
              </LinhaDeCampo>
            </ListaDeCampos>
          </section>

          <section aria-labelledby="lead-compras" className="flex flex-col gap-1">
            <h3 id="lead-compras" className="text-label-md uppercase text-muted-foreground">
              Compras
            </h3>
            <ListaDeCampos>
              <LinhaDeCampo icone={CurrencyDollar} rotulo="Ticket médio">
                <span className="tabular-nums">{moeda(lead.valor)}</span>
              </LinhaDeCampo>
              <LinhaDeCampo icone={Wallet} rotulo="Total comprado">
                <span className="tabular-nums">{moeda(lead.totalCompras)}</span>
              </LinhaDeCampo>
              <LinhaDeCampo icone={ArrowsClockwise} rotulo="Ciclo de compra">
                <span className="tabular-nums">{lead.cicloDias} dia(s)</span>
              </LinhaDeCampo>
            </ListaDeCampos>
          </section>
        </TabPanel>

        <TabPanel id="lead" valor="historico" atual={aba}>
          <LinhaDoTempo eventos={lead.historico.map((h) => ({ ...h, icone: glifos[h.tipo] }))} />
        </TabPanel>

        <TabPanel id="lead" valor="arquivos" atual={aba}>
          <p className="text-body-md text-muted-foreground">Nenhum arquivo neste lead.</p>
        </TabPanel>
      </PainelLateralCorpo>
    </PainelLateral>
  );
}
