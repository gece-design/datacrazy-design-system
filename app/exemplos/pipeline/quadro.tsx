"use client";

import * as React from "react";
import { Buildings, CalendarBlank, Clock, EnvelopeSimple, Globe, Handshake, User, UserCircle, WarningCircle } from "@phosphor-icons/react";
import { Quadro, QuadroCartao, type ColunaDoQuadro, type DetalheDoCartao, type RotulosDoQuadro } from "@/components/ui/quadro";
import { Tag, type GrupoTags } from "@/components/ui/tag";
import { IconeDeOrigem } from "@/components/ui/icone-de-marca";
import { cn } from "@/lib/utils";
import { etapaPor, moeda, tagsDe, type Canal, type Etapa, type EtapaId, type Lead } from "./dados";

/* O quadro do funil é o `Quadro` do design system (components/ui/quadro.tsx)
   com o que é da tela por cima: etapa vira coluna, lead vira `QuadroCartao`, e
   as palavras do funil ("Novo lead", "Nova etapa") entram por `rotulos`. O
   arrastar, o teclado, o trilho e a casca do cartão são do componente. */

/** O que não é marca: o ícone Phosphor de cada origem. A marca o `IconeDeOrigem` resolve sozinho. */
const OUTRAS_ORIGENS = { Site: Globe, Indicação: Handshake };

/** O ícone de cada origem — o quadro, a lista e os filtros usam o mesmo `IconeDeOrigem` do DS. */
export function IconeDoCanal({ canal, tamanho = 14 }: { canal: Canal; tamanho?: 12 | 14 | 16 }) {
  return <IconeDeOrigem origem={canal} outros={OUTRAS_ORIGENS} tamanho={tamanho} />;
}

export type Colunas = Record<EtapaId, Lead[]>;

export function agrupar(etapas: Etapa[], leads: Lead[]): Colunas {
  const vazio = Object.fromEntries(etapas.map((e) => [e.id, [] as Lead[]])) as Colunas;
  for (const lead of leads) vazio[lead.etapa]?.push(lead);
  return vazio;
}

/**
 * O que o cartão mostra além de nome e valor — a pessoa escolhe campo a
 * campo, como as propriedades de um card do Notion (humano, 2026-09-23; os
 * três presets do protótipo saíram). De fábrica vem o cartão enxuto
 * (`CAMPOS_DE_FABRICA`); próxima ação, contato e e-mail entram por escolha.
 */
export const CAMPOS_DO_CARTAO = ["empresa", "origem", "proximaAcao", "contato", "email", "tags", "atendente", "dias"] as const;
export type CampoDoCartao = (typeof CAMPOS_DO_CARTAO)[number];
export const CAMPOS_DE_FABRICA: CampoDoCartao[] = ["empresa", "origem", "tags", "atendente", "dias"];
export const ROTULOS_DOS_CAMPOS: Record<CampoDoCartao, string> = {
  empresa: "Empresa e cidade",
  origem: "Origem",
  proximaAcao: "Próxima ação",
  contato: "Contato principal",
  email: "E-mail",
  tags: "Tags",
  atendente: "Atendente",
  dias: "Dias na etapa",
};

/* As palavras do funil. O que não está aqui (anúncios de posição, tooltip do
   título) já sai certo da fábrica do componente. */
const ROTULOS_DO_FUNIL: Partial<RotulosDoQuadro> = {
  instrucoes:
    "Cartão do funil. Enter abre o lead. Espaço pega o cartão para movê-lo; com ele pego, as setas escolhem a etapa e a posição, Enter solta e Esc cancela.",
  cartao: "Cartão do funil",
  adicionar: "Novo lead",
  criarColuna: "Nova etapa",
  resumo: (total) => `${total} em aberto nesta etapa`,
  vazio: "Nenhum lead nesta etapa. Arraste um cartão para cá.",
  anteriores: "Ver etapas anteriores",
  proximas: "Ver próximas etapas",
  pego: (nome) =>
    `${nome} pego. Setas para os lados trocam de etapa, setas para cima e para baixo mudam a posição. Enter solta, Esc cancela.`,
};

export function QuadroDoFunil({
  etapas,
  grupos,
  colunas,
  campos = CAMPOS_DO_CARTAO,
  aoMover,
  aoAbrir,
  aoAdicionar,
  aoEditarEtapa,
  aoCriarEtapa,
}: {
  etapas: Etapa[];
  /** O catálogo de tags da conta: é estado da tela, porque dá para criar tag. */
  grupos: GrupoTags[];
  colunas: Colunas;
  /** Os campos visíveis no cartão. Padrão: todos. */
  campos?: readonly CampoDoCartao[];
  /** Move o lead para `etapa`, na posição `indice` da lista sem ele. */
  aoMover: (id: string, etapa: EtapaId, indice: number) => void;
  aoAbrir: (lead: Lead) => void;
  aoAdicionar: (etapa: EtapaId) => void;
  aoEditarEtapa: (etapa: Etapa) => void;
  aoCriarEtapa: () => void;
}) {
  // etapa → coluna: o resumo do cabeçalho é a soma em aberto, já em moeda
  const colunasDoQuadro = React.useMemo<ColunaDoQuadro<Lead>[]>(
    () =>
      etapas.map((e) => {
        const itens = colunas[e.id] ?? [];
        return {
          id: e.id,
          rotulo: e.rotulo,
          descricao: e.descricao,
          cor: e.cor,
          itens,
          resumo: moeda(itens.reduce((n, l) => n + l.valor, 0)),
        };
      }),
    [etapas, colunas],
  );

  return (
    <Quadro
      colunas={colunasDoQuadro}
      chaveDe={(l) => l.id}
      nomeDe={(l) => l.nome}
      descricaoDe={(l) => `${l.empresa}, ${moeda(l.valor)}`}
      renderizar={(l) => <CartaoDoLead lead={l} grupos={grupos} campos={campos} />}
      aoMover={aoMover}
      aoAbrir={aoAbrir}
      aoAdicionar={aoAdicionar}
      aoEditarColuna={(c) => aoEditarEtapa(etapaPor(etapas, c.id))}
      aoCriarColuna={aoCriarEtapa}
      rotulos={ROTULOS_DO_FUNIL}
    />
  );
}

/** O lead no cartão: só o que a pessoa ligou em `campos` e que tem valor. */
function CartaoDoLead({ lead, grupos, campos }: { lead: Lead; grupos: GrupoTags[]; campos: readonly CampoDoCartao[] }) {
  const Tipo = lead.tipo === "empresa" ? Buildings : User;
  const parado = lead.dias >= 7;
  const tags = tagsDe(grupos, lead.tags);
  const mostra = (c: CampoDoCartao) => campos.includes(c);
  const proximaAcao = lead.proximaAcao ? lead.proximaAcao.split("-").reverse().slice(0, 2).join("/") : null;
  const detalhes = (
    [
      mostra("empresa") ? { icone: Tipo, rotulo: "Empresa", valor: `${lead.empresa} · ${lead.cidade}` } : null,
      mostra("proximaAcao") ? { icone: CalendarBlank, rotulo: "Próxima ação", valor: proximaAcao } : null,
      mostra("contato") && lead.contatoPrincipal
        ? {
            icone: UserCircle,
            rotulo: "Contato",
            valor: `${lead.contatoPrincipal.nome}${lead.contatoPrincipal.cargo ? ` · ${lead.contatoPrincipal.cargo}` : ""}`,
          }
        : null,
      mostra("email") ? { icone: EnvelopeSimple, rotulo: "E-mail", valor: lead.email } : null,
    ] as ({ icone: DetalheDoCartao["icone"]; rotulo: string; valor: string | null } | null)[]
  ).filter((linha): linha is DetalheDoCartao => Boolean(linha && linha.valor));

  return (
    <QuadroCartao
      titulo={lead.nome}
      avatar={{ nome: lead.nome }}
      valor={moeda(lead.valor)}
      sinais={
        <>
          {mostra("origem") ? (
            <span title={`Origem: ${lead.canal}`} className="flex items-center">
              <IconeDoCanal canal={lead.canal} />
              <span className="sr-only">{lead.canal}</span>
            </span>
          ) : null}
          {mostra("dias") ? (
            <span
              title={parado ? `Parado há ${lead.dias} dias nesta etapa` : `${lead.dias} dia(s) nesta etapa`}
              className={cn("flex items-center gap-1 text-caption tabular-nums", parado && "text-warning")}
            >
              {parado ? <WarningCircle size={14} weight="regular" aria-hidden="true" /> : <Clock size={14} weight="regular" aria-hidden="true" />}
              {lead.dias}d
            </span>
          ) : null}
        </>
      }
      detalhes={detalhes}
      rodape={
        (mostra("tags") && tags.length > 0) || mostra("atendente") ? (
          <>
            {mostra("atendente") ? <Tag foto="/ds/atendente.png">{lead.responsavel}</Tag> : null}
            {mostra("tags")
              ? tags.map((t) => (
                  <Tag key={t.id} status={t.status} tom={t.tom} icone={t.icone}>
                    {t.rotulo}
                  </Tag>
                ))
              : null}
          </>
        ) : null
      }
    />
  );
}
