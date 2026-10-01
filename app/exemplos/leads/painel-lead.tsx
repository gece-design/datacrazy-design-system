"use client";

import { Buildings, CalendarBlank, EnvelopeSimple, IdentificationCard, Phone, ShareNetwork, Tag as IconeDeTag } from "@phosphor-icons/react";
import { Avatar } from "@/components/ui/avatar";
import type { OpcaoCombobox } from "@/components/ui/combobox";
import { CelulaEditavel, CelulaEscolha, CelulaTags } from "@/components/ui/data-table";
import { AcaoCopiar } from "@/components/ui/input";
import { LinhaDeCampo, ListaDeCampos, PainelLateral, PainelLateralCorpo } from "@/components/ui/painel-lateral";
import { dataCurta, etiquetaDe, tagsDe, type Lead, type Origem, type TagDaConta } from "./dados";

const ROTULOS_DA_LISTA = { busca: "Buscar", vazio: "Nada encontrado" };

/**
 * O lead aberto AO LADO da lista: `PainelLateral` no encaixe `lateral` da
 * TelaBase. A lista continua à vista e clicar em outra linha troca o
 * registro. Os campos vêm em linha — rótulo à esquerda, valor à direita — e
 * editam no lugar, com as mesmas células da tabela.
 */
export function PainelLead({
  lead,
  tags,
  opcoesDeTag,
  opcoesDeOrigem,
  iconeDaOrigem,
  telaCheia,
  aoAlternarTelaCheia,
  aoFechar,
  aoEditar,
}: {
  lead: Lead;
  /** O catálogo de tags da conta. */
  tags: TagDaConta[];
  /** As tags e as origens como opções: as mesmas da célula e do filtro. */
  opcoesDeTag: OpcaoCombobox[];
  opcoesDeOrigem: OpcaoCombobox[];
  iconeDaOrigem: React.ReactNode;
  telaCheia: boolean;
  aoAlternarTelaCheia: () => void;
  aoFechar: () => void;
  aoEditar: (campos: Partial<Lead>) => void;
}) {
  const doLead = tagsDe(tags, lead.tags);
  return (
    <PainelLateral
      titulo={lead.nome}
      subtitulo={<span className="truncate">{lead.empresa || lead.email}</span>}
      inicio={<Avatar nome={lead.nome} size="sm" iniciais="duas" tom="auto" aria-hidden="true" className="shrink-0" />}
      telaCheia={telaCheia}
      aoAlternarTelaCheia={aoAlternarTelaCheia}
      aoFechar={aoFechar}
      rotulos={{ fechar: "Fechar o lead", expandir: "Abrir em tela cheia", recolher: "Voltar ao painel" }}
    >
      <PainelLateralCorpo>
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
            <LinhaDeCampo icone={IdentificationCard} rotulo="Documento">
              <CelulaEditavel valor={lead.documento} rotulo={`Editar documento de ${lead.nome}`} aoSalvar={(v) => aoEditar({ documento: v })} />
            </LinhaDeCampo>
          </ListaDeCampos>
        </section>

        <section aria-labelledby="lead-cadastro" className="flex flex-col gap-1">
          <h3 id="lead-cadastro" className="text-label-md uppercase text-muted-foreground">
            Cadastro
          </h3>
          <ListaDeCampos>
            <LinhaDeCampo icone={IconeDeTag} rotulo="Tags">
              <CelulaEscolha
                multiplo
                rotulo={`Editar tags de ${lead.nome}`}
                opcoes={opcoesDeTag}
                selecionados={lead.tags}
                aoAlternar={(id) => aoEditar({ tags: lead.tags.includes(id) ? lead.tags.filter((t) => t !== id) : [...lead.tags, id] })}
                rotulos={{ busca: "Buscar tag", vazio: "Nenhuma tag encontrada" }}
              >
                {doLead.length ? (
                  <CelulaTags etiquetas={doLead.map(etiquetaDe)} />
                ) : (
                  <span className="text-subtle-foreground">Adicionar</span>
                )}
              </CelulaEscolha>
            </LinhaDeCampo>
            <LinhaDeCampo icone={ShareNetwork} rotulo="Origem">
              <CelulaEscolha
                rotulo={`Mudar origem de ${lead.nome}`}
                opcoes={opcoesDeOrigem}
                selecionados={[lead.origem]}
                aoAlternar={(v) => aoEditar({ origem: v as Origem })}
                rotulos={ROTULOS_DA_LISTA}
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  {iconeDaOrigem}
                  <span className="min-w-0 truncate">{lead.origem}</span>
                </span>
              </CelulaEscolha>
            </LinhaDeCampo>
            <LinhaDeCampo icone={CalendarBlank} rotulo="Criado em">
              <span className="tabular-nums">{dataCurta(lead.criadoEm)}</span>
            </LinhaDeCampo>
          </ListaDeCampos>
        </section>
      </PainelLateralCorpo>
    </PainelLateral>
  );
}
