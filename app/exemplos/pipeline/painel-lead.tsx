"use client";

import * as React from "react";
import {
  ArrowsClockwise,
  CalendarCheck,
  ChatCircleDots,
  CurrencyCircleDollar,
  FileText,
  MapPin,
  Note,
  Phone,
  Wallet,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { AcaoCopiar, CampoEditavel } from "@/components/ui/input";
import { Select, type OpcaoSelect } from "@/components/ui/select";
import { SeletorTags, Tag } from "@/components/ui/tag";
import { DrawerSecao, LinhaDoTempo } from "@/components/ui/drawer";
// O drawer é UM: o mesmo `DrawerLead` da página do Drawer no design system,
// aberto com o lead clicado no quadro. Nada aqui é uma segunda versão dele.
import { DrawerLead, cabecalhos, type LeadDoDrawer, type SecaoDoDrawer } from "@/app/feedback/drawer/drawer-lead";
import { GRUPOS_TAGS, moeda, tagsDe, type Etapa, type EtapaId, type Lead, type TipoEvento } from "./dados";
import { gradeDeCartoes } from "@/lib/campo";

const glifos: Record<TipoEvento, Icon> = {
  mensagem: ChatCircleDots,
  ligacao: Phone,
  proposta: FileText,
  reuniao: CalendarCheck,
  nota: Note,
};

/**
 * O lead aberto: `DrawerLead` do showcase, com três coisas vindas do quadro —
 * os dados do lead, a fileira de tags (que escreve no cartão) e duas seções
 * com o dado DESTE lead em vez do dado do arquivo: Históricos e Perfil. O
 * resto do menu é o conteúdo do arquivo, sem alteração.
 */
export function PainelLead({
  etapas,
  atendentes,
  origens,
  lead,
  aoFechar,
  aoMudarEtapa,
  aoEditar,
  aoTrocarTags,
}: {
  etapas: Etapa[];
  /** Os atendentes e as origens como opções: as mesmas do filtro e do "Novo lead". */
  atendentes: OpcaoSelect[];
  origens: OpcaoSelect[];
  lead: Lead;
  aoFechar: () => void;
  aoMudarEtapa: (etapa: EtapaId) => void;
  aoEditar: (campos: Partial<Lead>) => void;
  aoTrocarTags: (ids: string[]) => void;
}) {
  // Tag criada no seletor entra no catálogo da conta e já sai marcada.
  const [grupos, setGrupos] = React.useState(GRUPOS_TAGS);

  // As seções são componentes: ficam estáveis entre renders (senão remontam a
  // cada tecla) e leem o lead e os callbacks atuais por ref.
  const atual = React.useRef({ lead, etapas, atendentes, origens, aoEditar, aoMudarEtapa });
  atual.current = { lead, etapas, atendentes, origens, aoEditar, aoMudarEtapa };

  const secoes = React.useMemo<Partial<Record<string, SecaoDoDrawer>>>(
    () => ({
      historicos: {
        ...cabecalhos.historicos,
        Corpo: function Historicos() {
          const { lead } = atual.current;
          return <LinhaDoTempo eventos={lead.historico.map((h) => ({ ...h, icone: glifos[h.tipo] }))} />;
        },
      },
      perfil: {
        ...cabecalhos.perfil,
        Corpo: function Perfil() {
          const { lead, etapas, atendentes, origens, aoEditar, aoMudarEtapa } = atual.current;
          const salvarValor = (texto: string) => {
            const n = Number(texto.replace(/[^\d]/g, ""));
            if (Number.isFinite(n) && n > 0) aoEditar({ valor: n });
          };
          return (
            <>
              <DrawerSecao titulo="Dados cadastrais">
                <div className={gradeDeCartoes}>
                  <CampoEditavel rotulo="Nome" valor={lead.nome} aoSalvar={(v) => aoEditar({ nome: v })} rotuloEditar="Editar nome do lead" textoVazio="Adicionar" />
                  <CampoEditavel rotulo="Empresa" valor={lead.empresa} aoSalvar={(v) => aoEditar({ empresa: v })} rotuloEditar="Editar empresa" textoVazio="Adicionar" />
                  <CampoEditavel rotulo="Cidade" valor={lead.cidade} aoSalvar={(v) => aoEditar({ cidade: v })} rotuloEditar="Editar cidade" textoVazio="Adicionar" iconeInicio={MapPin} />
                  <CampoEditavel rotulo="Valor do negócio" valor={moeda(lead.valor)} aoSalvar={salvarValor} rotuloEditar="Editar valor do negócio" textoVazio="R$ 0" inputMode="numeric" />
                  {/* valor que vem de lista: a opção aparece como aparece na tela — a Tag com a foto, o ícone da origem */}
                  <Select cartao rotulo="Atendente" opcoes={atendentes} valor={lead.responsavel} aoEscolher={(v) => aoEditar({ responsavel: v })} />
                  <Select cartao rotulo="Origem" opcoes={origens} valor={lead.canal} aoEscolher={(v) => aoEditar({ canal: v as Lead["canal"] })} />
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
                  {/* o mesmo cartão dos campos ao lado, com o caret (cliente, 2026-09-28) */}
                  <Select
                    cartao
                    rotulo="Etapa do funil"
                    opcoes={etapas.map((e) => ({ valor: e.id, rotulo: e.rotulo }))}
                    valor={lead.etapa}
                    aoEscolher={(v) => aoMudarEtapa(v)}
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

  /* As quatro métricas do arquivo, com os números deste lead. */
  const dados: LeadDoDrawer = {
    nome: lead.nome,
    tipo: lead.tipo,
    telefone: lead.telefone,
    email: lead.email,
    tags: lead.tags,
    metricas: [
      { rotulo: "Ticket médio", valor: moeda(lead.valor), icone: CurrencyCircleDollar },
      { rotulo: "Total", valor: moeda(lead.totalCompras), icone: Wallet },
      { rotulo: "Ciclo de compra", valor: `${lead.cicloDias}d`, icone: ArrowsClockwise },
      { rotulo: "Última compra", valor: `${lead.dias}d`, icone: CalendarCheck },
    ],
    // Só lead empresa tem contato principal; nos leads pessoa fica vazio e o
    // bloco não aparece (cliente, 2026-09-18).
    contatoPrincipal: lead.contatoPrincipal,
  };

  return (
    <DrawerLead
      dados={dados}
      tom={lead.tom}
      secoes={secoes}
      aoFechar={aoFechar}
      // a largura que a pessoa arrastou fica guardada por tela
      memoria="pipeline-lead"
      className="rounded-none"
      tags={
        <>
          <Tag foto="/ds/atendente.png">{lead.responsavel}</Tag>
          {tagsDe(grupos, lead.tags).map((t) => (
            <Tag key={t.id} status={t.status} tom={t.tom} icone={t.icone}>
              {t.rotulo}
            </Tag>
          ))}
          <SeletorTags
            grupos={grupos}
            selecionadas={lead.tags}
            aoAlternar={(t) =>
              aoTrocarTags(lead.tags.includes(t.id) ? lead.tags.filter((x) => x !== t.id) : [...lead.tags, t.id])
            }
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
        </>
      }
    />
  );
}
