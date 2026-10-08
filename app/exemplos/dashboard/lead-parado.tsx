"use client";

import * as React from "react";
import { CalendarCheck, Clock, CurrencyCircleDollar, FunnelSimple, Wallet } from "@phosphor-icons/react";
import { DrawerSecao, LinhaDoTempo } from "@/components/ui/drawer";
import { AcaoCopiar, CampoEditavel } from "@/components/ui/input";
import { Tag } from "@/components/ui/tag";
// O drawer é UM: o mesmo `DrawerLead` da página do Drawer no design system,
// aberto com o negócio clicado na tabela. Nada aqui é uma segunda versão dele.
import { DrawerLead, cabecalhos, type LeadDoDrawer, type SecaoDoDrawer } from "@/components/ui/drawer-do-lead";
import { gradeDeCartoes } from "@/lib/campo";
import { tomDe } from "@/lib/tons";
import { moeda, type NegocioParado } from "./dados";

/**
 * O negócio parado, aberto: `DrawerLead` do design system com os dados da
 * linha clicada — quem é, quanto vale e há quantos dias está na etapa.
 */
export function LeadParado({
  negocio,
  aoEditar,
  aoFechar,
}: {
  negocio: NegocioParado;
  aoEditar: (campos: Partial<NegocioParado>) => void;
  aoFechar: () => void;
}) {
  // As seções são componentes: ficam estáveis entre renders e leem o negócio atual por ref.
  const atual = React.useRef({ negocio, aoEditar });
  atual.current = { negocio, aoEditar };

  const secoes = React.useMemo<Partial<Record<string, SecaoDoDrawer>>>(
    () => ({
      historicos: {
        ...cabecalhos.historicos,
        Corpo: function Historicos() {
          const { negocio } = atual.current;
          return (
            <LinhaDoTempo
              eventos={[
                { id: "parado", titulo: `Parado em ${negocio.etapa}`, detalhes: [`há ${negocio.dias} dias`, `Atendente: ${negocio.atendente}`], icone: Clock },
                { id: "etapa", titulo: `Entrou em ${negocio.etapa}`, detalhes: [`Origem: ${negocio.canal}`], icone: FunnelSimple },
              ]}
            />
          );
        },
      },
      perfil: {
        ...cabecalhos.perfil,
        Corpo: function Perfil() {
          const { negocio, aoEditar } = atual.current;
          return (
            <>
              <DrawerSecao titulo="Dados cadastrais">
                <div className={gradeDeCartoes}>
                  <CampoEditavel rotulo="Nome" valor={negocio.nome} aoSalvar={(v) => aoEditar({ nome: v })} rotuloEditar="Editar nome do lead" textoVazio="Adicionar" />
                  <CampoEditavel rotulo="Empresa" valor={negocio.empresa} aoSalvar={(v) => aoEditar({ empresa: v })} rotuloEditar="Editar empresa" textoVazio="Adicionar" />
                  <CampoEditavel
                    rotulo="Valor do negócio"
                    valor={moeda(negocio.valor)}
                    aoSalvar={(v) => {
                      const n = Number(v.replace(/[^\d]/g, ""));
                      if (Number.isFinite(n) && n > 0) aoEditar({ valor: n });
                    }}
                    rotuloEditar="Editar valor do negócio"
                    textoVazio="R$ 0"
                    inputMode="numeric"
                  />
                </div>
              </DrawerSecao>
              <DrawerSecao titulo="Contato">
                <div className={gradeDeCartoes}>
                  <CampoEditavel
                    rotulo="Telefone"
                    valor={negocio.telefone}
                    aoSalvar={(v) => aoEditar({ telefone: v })}
                    rotuloEditar="Editar telefone"
                    textoVazio="Adicionar"
                    acoes={<AcaoCopiar rotulo="Copiar telefone" rotuloCopiado="Telefone copiado" valor={negocio.telefone} />}
                  />
                  <CampoEditavel
                    rotulo="E-mail"
                    valor={negocio.email}
                    aoSalvar={(v) => aoEditar({ email: v })}
                    rotuloEditar="Editar e-mail"
                    textoVazio="Adicionar"
                    acoes={<AcaoCopiar rotulo="Copiar e-mail" rotuloCopiado="E-mail copiado" valor={negocio.email} />}
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

  const dados: LeadDoDrawer = {
    nome: negocio.nome,
    tipo: "empresa",
    telefone: negocio.telefone,
    email: negocio.email,
    tags: [],
    metricas: [
      { rotulo: "Valor do negócio", valor: moeda(negocio.valor), icone: CurrencyCircleDollar },
      { rotulo: "Em risco", valor: moeda(negocio.valor), icone: Wallet },
      { rotulo: "Parado há", valor: `${negocio.dias}d`, icone: Clock },
      { rotulo: "Etapa", valor: `${negocio.percentual}%`, icone: CalendarCheck },
    ],
  };

  return (
    <DrawerLead
      dados={dados}
      tom={tomDe(negocio.nome)}
      secoes={secoes}
      menuInicial="perfil"
      aoFechar={aoFechar}
      memoria="dashboard-lead"
      className="rounded-none"
      tags={
        <>
          <Tag>{negocio.atendente}</Tag>
          <Tag tom={negocio.tom === "neutro" ? undefined : negocio.tom}>{negocio.etapa}</Tag>
          <Tag>{negocio.canal}</Tag>
        </>
      }
    />
  );
}
