import type { BarraDoGrafico, FatiaDaRosca, LinhaDaLista } from "@/components/ui/card";
import type { Tom } from "@/components/ui/tag";

/* Dados de exemplo do dashboard. No CRM, cada bloco é uma chamada da API —
   troque este arquivo pelos hooks do time e mantenha os formatos. */

export type Periodo = "7" | "30" | "90";

export const PERIODOS: { valor: Periodo; rotulo: string }[] = [
  { valor: "7", rotulo: "7 dias" },
  { valor: "30", rotulo: "30 dias" },
  { valor: "90", rotulo: "90 dias" },
];

/** Percentual no formato do idioma: 46,0%. */
export const percentual = (v: number) => `${v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
export const moeda = (v: number) => `R$ ${Math.round(v).toLocaleString("pt-BR")}`;
/** Número grande, no formato do card: R$ 184,6K. */
export const moedaCurta = (v: number) =>
  v >= 1000 ? `R$ ${(v / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}K` : moeda(v);

export type Indicador = {
  titulo: string;
  valor: string;
  /** Contagem de apoio, no chip. */
  apoio: string;
  /** A direção do número contra o período anterior — literal: subiu ou caiu. Sem direção, `neutral`. */
  tendencia: "up" | "down" | "neutral";
};

type Recorte = {
  indicadores: Indicador[];
  receita: BarraDoGrafico[];
  origens: FatiaDaRosca[];
  ranking: LinhaDaLista[];
};

const ranking = (fator: number): LinhaDaLista[] =>
  [
    { nome: "Esther Lima", detalhe: "Inside sales", negocios: 14, total: 71200 },
    { nome: "Liam Costa", detalhe: "Inside sales", negocios: 9, total: 52800 },
    { nome: "Marina Prado", detalhe: "Contas-chave", negocios: 6, total: 44100 },
    { nome: "Breno Ramos", detalhe: "Pré-vendas", negocios: 3, total: 16500 },
  ].map((p) => ({
    nome: p.nome,
    detalhe: p.detalhe,
    metricas: [
      { rotulo: "Ganhos", valor: String(Math.max(1, Math.round(p.negocios * fator))) },
      { rotulo: "Total", valor: moedaCurta(p.total * fator) },
    ],
  }));

const serie = (rotulos: string[], valores: number[]): BarraDoGrafico[] => rotulos.map((rotulo, i) => ({ rotulo, valor: valores[i] ?? 0 }));

export const RECORTES: Record<Periodo, Recorte> = {
  "7": {
    indicadores: [
      { titulo: "Receita ganha", valor: "R$ 46,2K", apoio: "8 negócios ganhos", tendencia: "up" },
      { titulo: "Negócios criados", valor: "31", apoio: "22 em aberto", tendencia: "neutral" },
      { titulo: "Taxa de conversão", valor: "25,8%", apoio: "+1,2 p.p. no período", tendencia: "up" },
      { titulo: "Ciclo médio", valor: "19 dias", apoio: "1 dia a mais", tendencia: "up" },
    ],
    receita: serie(["24/09", "25/09", "26/09", "27/09", "28/09", "29/09", "30/09"], [8400, 0, 12600, 3200, 0, 9800, 12200]),
    origens: [
      { nome: "WhatsApp", percentual: 52 },
      { nome: "Instagram", percentual: 21 },
      { nome: "Site", percentual: 17 },
      { nome: "Indicação", percentual: 10 },
    ],
    ranking: ranking(0.25),
  },
  "30": {
    indicadores: [
      { titulo: "Receita ganha", valor: "R$ 184,6K", apoio: "32 negócios ganhos", tendencia: "up" },
      { titulo: "Negócios criados", valor: "118", apoio: "86 em aberto", tendencia: "neutral" },
      { titulo: "Taxa de conversão", valor: "27,1%", apoio: "+3,4 p.p. no período", tendencia: "up" },
      { titulo: "Ciclo médio", valor: "18 dias", apoio: "2 dias a menos", tendencia: "down" },
    ],
    receita: serie(
      ["01/09", "04/09", "07/09", "10/09", "13/09", "16/09", "19/09", "22/09", "25/09", "28/09"],
      [14200, 9800, 22400, 0, 18600, 26100, 12400, 31800, 21000, 28300],
    ),
    origens: [
      { nome: "WhatsApp", percentual: 46 },
      { nome: "Instagram", percentual: 24 },
      { nome: "Site", percentual: 18 },
      { nome: "Indicação", percentual: 12 },
    ],
    ranking: ranking(1),
  },
  "90": {
    indicadores: [
      { titulo: "Receita ganha", valor: "R$ 512,9K", apoio: "91 negócios ganhos", tendencia: "up" },
      { titulo: "Negócios criados", valor: "342", apoio: "86 em aberto", tendencia: "neutral" },
      { titulo: "Taxa de conversão", valor: "26,6%", apoio: "−0,8 p.p. no período", tendencia: "down" },
      { titulo: "Ciclo médio", valor: "21 dias", apoio: "estável", tendencia: "neutral" },
    ],
    receita: serie(
      ["Sem 27", "Sem 28", "Sem 29", "Sem 30", "Sem 31", "Sem 32", "Sem 33", "Sem 34", "Sem 35", "Sem 36", "Sem 37", "Sem 38"],
      [31200, 44800, 28900, 52100, 39400, 47700, 36800, 58300, 41200, 49600, 38100, 44800],
    ),
    origens: [
      { nome: "WhatsApp", percentual: 44 },
      { nome: "Instagram", percentual: 26 },
      { nome: "Site", percentual: 19 },
      { nome: "Indicação", percentual: 11 },
    ],
    ranking: ranking(2.8),
  },
};

export type Canal = "WhatsApp" | "Instagram" | "Site" | "Indicação";

export type NegocioParado = {
  id: string;
  nome: string;
  empresa: string;
  etapa: string;
  /** Quanto do funil a etapa representa, de 0 a 100. */
  percentual: number;
  /** A cor da etapa: a mesma da coluna do quadro. */
  tom: Tom | "neutro";
  canal: Canal;
  atendente: string;
  valor: number;
  dias: number;
};

/** O que precisa de atenção hoje: parado há mais tempo primeiro. Não muda com o período. */
export const PARADOS: NegocioParado[] = [
  { id: "p1", nome: "Transportes Serra Azul", empresa: "Serra Azul Log", etapa: "Proposta", percentual: 60, tom: "azul", canal: "Site", atendente: "Marina", valor: 78000, dias: 11 },
  { id: "p2", nome: "Pedro Nakamura", empresa: "Nakamura Contabilidade", etapa: "Qualificação", percentual: 30, tom: "ciano", canal: "WhatsApp", atendente: "Marina", valor: 21000, dias: 9 },
  { id: "p3", nome: "Rede Sorriso", empresa: "Sorriso Odonto", etapa: "Negociação", percentual: 80, tom: "ambar", canal: "Indicação", atendente: "Liam", valor: 63500, dias: 7 },
  { id: "p4", nome: "Supermercados Bom Dia", empresa: "Rede Bom Dia", etapa: "Qualificação", percentual: 30, tom: "ciano", canal: "Site", atendente: "Liam", valor: 145000, dias: 6 },
  { id: "p5", nome: "Escola Raízes", empresa: "Instituto Raízes", etapa: "Proposta", percentual: 60, tom: "azul", canal: "Indicação", atendente: "Esther", valor: 54000, dias: 5 },
  { id: "p6", nome: "Henrique Salles", empresa: "Salles Fotografia", etapa: "Novo lead", percentual: 10, tom: "neutro", canal: "WhatsApp", atendente: "Liam", valor: 7600, dias: 5 },
  { id: "p7", nome: "Rafael Pinto", empresa: "Pinto Advocacia", etapa: "Novo lead", percentual: 10, tom: "neutro", canal: "Indicação", atendente: "Marina", valor: 12500, dias: 4 },
  { id: "p8", nome: "Júlia Bastos", empresa: "Bastos Odontologia", etapa: "Qualificação", percentual: 30, tom: "ciano", canal: "Instagram", atendente: "Esther", valor: 9800, dias: 3 },
];
