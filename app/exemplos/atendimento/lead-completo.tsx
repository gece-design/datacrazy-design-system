"use client";

import * as React from "react";
import { ArrowsClockwise, CalendarCheck, ChatCircleDots, CurrencyCircleDollar, MapPin, Wallet } from "@phosphor-icons/react";
import { DrawerSecao, LinhaDoTempo } from "@/components/ui/drawer";
import { AcaoCopiar, CampoEditavel } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SeletorTags, Tag, type GrupoTags, type IconeDeTag } from "@/components/ui/tag";
// O drawer é UM: o mesmo `DrawerLead` da página do Drawer no design system,
// aberto com o lead da conversa. Nada aqui é uma segunda versão dele.
import { DrawerLead, cabecalhos, type LeadDoDrawer, type SecaoDoDrawer } from "@/components/ui/drawer-do-lead";
import { gradeDeCartoes } from "@/lib/campo";
import { tomDe } from "@/lib/tons";
import { OPCOES_DE_ATENDENTE } from "./painel";
import { ETAPAS, moeda, tagsDe, type Conversa, type EtapaId } from "./dados";

/**
 * O lead da conversa, inteiro: `DrawerLead` do design system. A coluna ao
 * lado do chat é o resumo; o botão de expandir dela abre este drawer, com o
 * histórico (as mensagens da conversa) e o perfil deste lead.
 */
export function LeadCompleto({
  conversa,
  grupos,
  aoCriarTag,
  aoEditar,
  aoFechar,
}: {
  conversa: Conversa;
  /** O catálogo de tags da conta, e como criar uma: quem guarda é a tela. */
  grupos: GrupoTags[];
  aoCriarTag: (rotulo: string, grupoId: string, icone?: IconeDeTag) => string;
  aoEditar: (campos: Partial<Conversa>) => void;
  aoFechar: () => void;
}) {
  // As seções são componentes: ficam estáveis entre renders e leem o lead atual por ref.
  const atual = React.useRef({ conversa, aoEditar });
  atual.current = { conversa, aoEditar };

  const secoes = React.useMemo<Partial<Record<string, SecaoDoDrawer>>>(
    () => ({
      historicos: {
        ...cabecalhos.historicos,
        Corpo: function Historicos() {
          const { conversa } = atual.current;
          return (
            <LinhaDoTempo
              eventos={conversa.mensagens
                .filter((m) => m.texto)
                .map((m) => ({ id: m.id, titulo: m.texto, detalhes: [m.autor ?? (m.de === "contato" ? conversa.nome : "Sistema"), m.dia, m.hora], icone: ChatCircleDots }))}
            />
          );
        },
      },
      perfil: {
        ...cabecalhos.perfil,
        Corpo: function Perfil() {
          const { conversa, aoEditar } = atual.current;
          return (
            <>
              <DrawerSecao titulo="Negócio">
                <div className={gradeDeCartoes}>
                  <Select
                    cartao
                    rotulo="Etapa do funil"
                    opcoes={ETAPAS.map((e) => ({ valor: e.id, rotulo: e.rotulo }))}
                    valor={conversa.etapa}
                    aoEscolher={(v) => aoEditar({ etapa: v as EtapaId })}
                  />
                  <CampoEditavel
                    rotulo="Valor do negócio"
                    valor={moeda(conversa.valor)}
                    aoSalvar={(v) => {
                      const n = Number(v.replace(/[^\d]/g, ""));
                      if (Number.isFinite(n)) aoEditar({ valor: n });
                    }}
                    rotuloEditar="Editar valor do negócio"
                    textoVazio="R$ 0"
                    inputMode="numeric"
                  />
                  <Select
                    cartao
                    rotulo="Atendente"
                    textoVazio="Sem atendente"
                    opcoes={OPCOES_DE_ATENDENTE}
                    valor={conversa.atendente ?? ""}
                    aoEscolher={(v) => aoEditar({ atendente: v })}
                  />
                </div>
              </DrawerSecao>
              <DrawerSecao titulo="Contato">
                <div className={gradeDeCartoes}>
                  <CampoEditavel
                    rotulo="Telefone"
                    valor={conversa.telefone}
                    aoSalvar={(v) => aoEditar({ telefone: v })}
                    rotuloEditar="Editar telefone"
                    textoVazio="Adicionar"
                    acoes={<AcaoCopiar rotulo="Copiar telefone" rotuloCopiado="Telefone copiado" valor={conversa.telefone} />}
                  />
                  <CampoEditavel
                    rotulo="E-mail"
                    valor={conversa.email}
                    aoSalvar={(v) => aoEditar({ email: v })}
                    rotuloEditar="Editar e-mail"
                    textoVazio="Adicionar"
                    acoes={<AcaoCopiar rotulo="Copiar e-mail" rotuloCopiado="E-mail copiado" valor={conversa.email} />}
                  />
                  <CampoEditavel rotulo="Cidade" valor={conversa.cidade} aoSalvar={(v) => aoEditar({ cidade: v })} rotuloEditar="Editar cidade" textoVazio="Adicionar" iconeInicio={MapPin} />
                </div>
              </DrawerSecao>
            </>
          );
        },
      },
    }),
    [],
  );

  const dados: LeadDoDrawer = {
    nome: conversa.nome,
    tipo: conversa.tipo,
    telefone: conversa.telefone,
    email: conversa.email,
    tags: conversa.tags,
    metricas: [
      { rotulo: "Valor do negócio", valor: moeda(conversa.valor), icone: CurrencyCircleDollar },
      { rotulo: "Total", valor: moeda(conversa.valor), icone: Wallet },
      { rotulo: "Mensagens", valor: String(conversa.mensagens.length), icone: ArrowsClockwise },
      { rotulo: "Não lidas", valor: String(conversa.naoLidas), icone: CalendarCheck },
    ],
  };

  return (
    <DrawerLead
      dados={dados}
      tom={tomDe(conversa.nome)}
      secoes={secoes}
      menuInicial="perfil"
      aoFechar={aoFechar}
      memoria="atendimento-lead"
      className="rounded-none"
      tags={
        <>
          {conversa.atendente ? <Tag foto="/ds/atendente.png">{conversa.atendente}</Tag> : null}
          {tagsDe(conversa.tags, grupos).map((t) => (
            <Tag key={t.id} status={t.status} tom={t.tom} icone={t.icone}>
              {t.rotulo}
            </Tag>
          ))}
          <SeletorTags
            grupos={grupos}
            selecionadas={conversa.tags}
            aoAlternar={(t) => aoEditar({ tags: conversa.tags.includes(t.id) ? conversa.tags.filter((x) => x !== t.id) : [...conversa.tags, t.id] })}
            // digitou um nome que não existe: o seletor oferece criar, e a tag nova já entra no lead
            aoCriar={(rotulo, grupoId, _tom, icone) => aoEditar({ tags: [...conversa.tags, aoCriarTag(rotulo, grupoId, icone)] })}
            rotulos={{
              gatilho: "Adicionar tag",
              busca: "Buscar ou criar tag",
              vazio: "Nenhuma tag nesta aba",
              criar: (t, g) => `Criar "${t}" em ${g}`,
              cor: "Cor da tag",
              icone: "Ícone",
            }}
          />
        </>
      }
    />
  );
}
