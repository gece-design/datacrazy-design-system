"use client";

import * as React from "react";
import { ArrowsClockwise, CalendarCheck, CurrencyCircleDollar, IdentificationCard, UserPlus, Wallet } from "@phosphor-icons/react";
import type { OpcaoCombobox } from "@/components/ui/combobox";
import { DrawerSecao, LinhaDoTempo } from "@/components/ui/drawer";
import { AcaoCopiar, CampoEditavel } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SeletorTags, Tag } from "@/components/ui/tag";
// O drawer é UM: o mesmo `DrawerLead` da página do Drawer no design system,
// aberto com o lead clicado na lista. Nada aqui é uma segunda versão dele.
import { DrawerLead, cabecalhos, type LeadDoDrawer, type SecaoDoDrawer } from "@/app/feedback/drawer/drawer-lead";
import { gradeDeCartoes } from "@/lib/campo";
import { tomDe, type Tom } from "@/lib/tons";
import { comprasDe, dataCurta, moeda, tagsDe, type Lead, type Origem, type TagDaConta } from "./dados";

/**
 * O lead aberto: `DrawerLead` do design system, com três coisas vindas da
 * lista — os dados do lead, a fileira de tags (que escreve na linha) e duas
 * seções com o dado DESTE lead: Histórico e Perfil. O resto do menu é o
 * conteúdo de exemplo do próprio drawer.
 */
export function PainelLead({
  lead,
  tags,
  opcoesDeOrigem,
  aoFechar,
  aoEditar,
  aoCriarTag,
}: {
  lead: Lead;
  /** O catálogo de tags da conta. */
  tags: TagDaConta[];
  /** As origens como opções: as mesmas da célula e do filtro. */
  opcoesDeOrigem: OpcaoCombobox[];
  aoFechar: () => void;
  aoEditar: (campos: Partial<Lead>) => void;
  /** Cria a tag no catálogo e devolve o id: ela já sai marcada no lead. */
  aoCriarTag: (rotulo: string, tom: Tom | null) => string;
}) {
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

  return (
    <DrawerLead
      dados={dados}
      // a mesma cor das iniciais na lista
      tom={tomDe(lead.nome)}
      secoes={secoes}
      menuInicial="perfil"
      aoFechar={aoFechar}
      // a largura que a pessoa arrastou fica guardada por tela
      memoria="leads-lead"
      className="rounded-none"
      tags={
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
      }
    />
  );
}
