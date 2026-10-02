import { Fire, Snowflake, ThermometerSimple } from "@phosphor-icons/react";
import type { GrupoTags, OpcaoTag } from "@/components/ui/tag";
import type { TomPerfil } from "@/components/ui/drawer";

/* Funil de mentira para a demonstração. Nomes, valores, telefones e histórico
   são inventados — nada aqui sai do arquivo nem encosta em dado real.
   Esta tela NÃO é componente do design system: é uma tela de exemplo, montada
   só com o que já existe em `components/ui/`. Ver o comentário no topo de
   ./tela.tsx. */

/* Etapa é dado da tela, não constante: o cliente cria, renomeia e recolore
   coluna na demonstração. Por isso o id é string — o novo nasce em tempo de
   execução — e ETAPAS é só o estado inicial. */
export type EtapaId = string;

/** Cor do painel da coluna. São os catorze tons do DS mais o neutro. */
export type CorColuna = "neutro" | TomPerfil;

export const CORES_COLUNA: { valor: CorColuna; rotulo: string }[] = [
  { valor: "neutro", rotulo: "Neutro" },
  { valor: "azul", rotulo: "Azul" },
  { valor: "indigo", rotulo: "Índigo" },
  { valor: "roxo", rotulo: "Roxo" },
  { valor: "fucsia", rotulo: "Fúcsia" },
  { valor: "rosa", rotulo: "Rosa" },
  { valor: "vermelho", rotulo: "Vermelho" },
  { valor: "laranja", rotulo: "Laranja" },
  { valor: "ambar", rotulo: "Âmbar" },
  { valor: "amarelo", rotulo: "Amarelo" },
  { valor: "lima", rotulo: "Lima" },
  { valor: "verde", rotulo: "Verde" },
  { valor: "turquesa", rotulo: "Turquesa" },
  { valor: "ciano", rotulo: "Ciano" },
  { valor: "marrom", rotulo: "Marrom" },
];

export type Etapa = {
  id: EtapaId;
  rotulo: string;
  /** Aparece no tooltip do cabeçalho da coluna. */
  descricao: string;
  /** Pinta o painel da coluna e a bolinha do cabeçalho. */
  cor: CorColuna;
  /** Quanto do funil já andou. Alimenta a barra da visão em lista. */
  percentual: number;
};

export const ETAPAS: Etapa[] = [
  { id: "novo", rotulo: "Novo lead", descricao: "Entrou e ainda não foi contatado", cor: "neutro", percentual: 15 },
  { id: "qualificacao", rotulo: "Qualificação", descricao: "Em conversa, entendendo a necessidade", cor: "ciano", percentual: 35 },
  { id: "proposta", rotulo: "Proposta", descricao: "Proposta enviada, aguardando retorno", cor: "azul", percentual: 60 },
  { id: "negociacao", rotulo: "Negociação", descricao: "Ajuste de preço, prazo e escopo", cor: "ambar", percentual: 80 },
  { id: "fechamento", rotulo: "Fechamento", descricao: "Contrato em assinatura", cor: "verde", percentual: 95 },
];

export const etapaPor = (etapas: Etapa[], id: EtapaId) => etapas.find((e) => e.id === id) ?? etapas[0];

export type Canal = "WhatsApp" | "Instagram" | "Site" | "Indicação";
export type TipoEvento = "mensagem" | "ligacao" | "proposta" | "reuniao" | "nota";

/* As tags são um CATÁLOGO da conta, não texto solto no lead: é o que permite
   o seletor do drawer marcar, desmarcar e criar — o lead guarda só os ids. */
export const GRUPOS_TAGS: GrupoTags[] = [
  {
    id: "temperatura",
    rotulo: "Temperatura",
    tags: [
      // Escala, não categoria: o ícone diz o degrau, na cor dele.
      { id: "frio", rotulo: "Frio", icone: Snowflake, tom: "ciano" },
      { id: "warm", rotulo: "Warm", icone: ThermometerSimple, tom: "laranja" },
      { id: "quente", rotulo: "Quente", icone: Fire, tom: "vermelho" },
    ],
  },
  {
    id: "status",
    rotulo: "Status",
    tags: [
      { id: "em-aberto", rotulo: "Em aberto", status: "info" },
      { id: "agendado", rotulo: "Agendado", status: "success" },
      { id: "proposta-enviada", rotulo: "Proposta enviada", status: "info" },
      { id: "sem-retorno", rotulo: "Sem retorno", status: "destructive" },
    ],
  },
  {
    id: "origem",
    rotulo: "Origem",
    tags: [
      { id: "inbound", rotulo: "Inbound", status: "info" },
      { id: "indicacao", rotulo: "Indicação", status: "success" },
    ],
  },
  {
    id: "segmento",
    rotulo: "Segmento",
    tags: [
      { id: "saude", rotulo: "Saúde" },
      { id: "educacao", rotulo: "Educação" },
      { id: "enterprise", rotulo: "Enterprise" },
      { id: "juridico", rotulo: "Jurídico" },
      { id: "agro", rotulo: "Agro" },
      { id: "varejo", rotulo: "Varejo" },
      { id: "desconto", rotulo: "Desconto" },
    ],
  },
];

/** Resolve os ids do lead na ordem do catálogo — não na ordem em que foram marcados. */
export function tagsDe(grupos: GrupoTags[], ids: string[]): OpcaoTag[] {
  return grupos.flatMap((g) => g.tags).filter((t) => ids.includes(t.id));
}

export type Lead = {
  id: string;
  nome: string;
  empresa: string;
  tipo: "pessoa" | "empresa";
  telefone: string;
  email: string;
  cidade: string;
  canal: Canal;
  /** Quem atende. Vira a tag com foto no cartão. */
  responsavel: string;
  valor: number;
  /** Dias parado na etapa atual. Acima de 7 o cartão acende o aviso. */
  dias: number;
  /** Alimentam as métricas do drawer — as mesmas quatro do arquivo. */
  totalCompras: number;
  cicloDias: number;
  etapa: EtapaId;
  /** Ids do catálogo `GRUPOS_TAGS`. */
  tags: string[];
  /** Cor do perfil no drawer. Os tons do DS giram entre os leads. */
  tom: TomPerfil;
  /** A pessoa por trás de um lead empresa. Lead pessoa não tem (cliente, 2026-09-18). */
  contatoPrincipal?: { nome: string; cargo?: string; telefone?: string; email?: string };
  /** A próxima ação marcada, AAAA-MM-DD — é o que põe o lead no calendário. */
  proximaAcao: string;
  historico: { id: string; tipo: TipoEvento; titulo: string; detalhes: string[] }[];
};

/* Intl.NumberFormat resolveria, mas formata diferente no Node e no navegador
   (o espaço depois do R$) e a diferença vira erro de hidratação. Conta na mão,
   que dá o mesmo resultado nos dois lados. */
export function moeda(valor: number) {
  return `R$ ${Math.round(valor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

export const LEADS: Lead[] = [
  {
    id: "l1",
    nome: "Marina Alvarenga",
    empresa: "Clínica Vitalis",
    tipo: "pessoa",
    telefone: "+55 (11) 98844-2019",
    email: "marina@vitalis.com.br",
    cidade: "São Paulo · SP",
    canal: "WhatsApp",
    responsavel: "Esther",
    valor: 18400,
    dias: 1,
    proximaAcao: "2026-09-22",
    totalCompras: 0,
    cicloDias: 0,
    etapa: "novo",
    tom: "azul",
    tags: ["inbound", "saude"],
    historico: [
      { id: "h1", tipo: "mensagem", titulo: "Primeira mensagem no WhatsApp", detalhes: ["Automação de boas-vindas", "hoje", "09:12"] },
      { id: "h2", tipo: "nota", titulo: "Veio do anúncio de agenda online", detalhes: ["Esther", "hoje", "09:20"] },
    ],
  },
  {
    id: "l2",
    nome: "Construtora Horizonte",
    empresa: "Horizonte Engenharia",
    tipo: "empresa",
    contatoPrincipal: { nome: "Paulo Nogueira", cargo: "Gerente de obras", telefone: "+55 (41) 99711-2030", email: "paulo@horizonte.eng.br" },
    telefone: "+55 (41) 3322-7788",
    email: "comercial@horizonte.eng.br",
    cidade: "Curitiba · PR",
    canal: "Site",
    responsavel: "Liam",
    valor: 96000,
    dias: 2,
    proximaAcao: "2026-09-24",
    totalCompras: 184000,
    cicloDias: 74,
    etapa: "novo",
    tom: "roxo",
    tags: ["enterprise", "em-aberto"],
    historico: [
      { id: "h1", tipo: "mensagem", titulo: "Formulário de contato preenchido", detalhes: ["Site", "ontem", "16:40"] },
      { id: "h2", tipo: "nota", titulo: "Pediu orçamento para três obras em andamento", detalhes: ["Liam", "ontem", "17:05"] },
    ],
  },
  {
    id: "l3",
    nome: "Rafael Pinto",
    empresa: "Pinto Advocacia",
    tipo: "pessoa",
    telefone: "+55 (54) 4434-5346",
    email: "rafael@pintoadv.com.br",
    cidade: "Caxias do Sul · RS",
    canal: "Indicação",
    responsavel: "Marina",
    valor: 12500,
    dias: 4,
    proximaAcao: "2026-09-24",
    totalCompras: 9800,
    cicloDias: 41,
    etapa: "novo",
    tom: "verde",
    tags: ["indicacao"],
    historico: [
      { id: "h1", tipo: "ligacao", titulo: "Ligação não atendida", detalhes: ["Marina", "há 2 dias", "14:05"] },
    ],
  },
  {
    id: "l4",
    nome: "Júlia Bastos",
    empresa: "Bastos Odontologia",
    tipo: "pessoa",
    telefone: "+55 (21) 99712-4455",
    email: "julia@bastosodonto.com",
    cidade: "Rio de Janeiro · RJ",
    canal: "Instagram",
    responsavel: "Esther",
    valor: 9800,
    dias: 3,
    proximaAcao: "2026-09-25",
    totalCompras: 0,
    cicloDias: 0,
    etapa: "qualificacao",
    tom: "ciano",
    tags: ["warm", "saude"],
    historico: [
      { id: "h1", tipo: "mensagem", titulo: "Respondeu o direct", detalhes: ["Instagram", "há 3 dias", "11:30"] },
      { id: "h2", tipo: "ligacao", titulo: "Ligação de diagnóstico · 12 min", detalhes: ["Esther", "há 2 dias", "15:10"] },
    ],
  },
  {
    id: "l5",
    nome: "Supermercados Bom Dia",
    empresa: "Rede Bom Dia",
    tipo: "empresa",
    contatoPrincipal: { nome: "Carla Menezes", cargo: "Coordenadora de TI", telefone: "+55 (31) 98822-4455", email: "carla@redebomdia.com.br" },
    telefone: "+55 (31) 3555-9090",
    email: "ti@redebomdia.com.br",
    cidade: "Belo Horizonte · MG",
    canal: "Site",
    responsavel: "Liam",
    valor: 145000,
    dias: 6,
    proximaAcao: "2026-09-29",
    totalCompras: 312000,
    cicloDias: 96,
    etapa: "qualificacao",
    tom: "ambar",
    tags: ["enterprise", "quente"],
    historico: [
      { id: "h1", tipo: "reuniao", titulo: "Reunião de descoberta · 45 min", detalhes: ["Liam", "há 4 dias", "10:00"] },
      { id: "h2", tipo: "nota", titulo: "Pediu integração com o ERP", detalhes: ["Liam", "há 4 dias", "10:50"] },
    ],
  },
  {
    id: "l6",
    nome: "Pedro Nakamura",
    empresa: "Nakamura Contabilidade",
    tipo: "pessoa",
    telefone: "+55 (11) 96633-1122",
    email: "pedro@nakamura.cnt.br",
    cidade: "Santo André · SP",
    canal: "WhatsApp",
    responsavel: "Marina",
    valor: 21000,
    dias: 9,
    proximaAcao: "2026-09-30",
    totalCompras: 54000,
    cicloDias: 63,
    etapa: "qualificacao",
    tom: "rosa",
    tags: ["sem-retorno"],
    historico: [
      { id: "h1", tipo: "mensagem", titulo: "Três mensagens sem resposta", detalhes: ["Marina", "há 9 dias"] },
    ],
  },
  {
    id: "l7",
    nome: "Escola Raízes",
    empresa: "Instituto Raízes",
    tipo: "empresa",
    contatoPrincipal: { nome: "Renata Sales", cargo: "Diretora pedagógica", telefone: "+55 (85) 99640-7788", email: "renata@raizes.edu.br" },
    telefone: "+55 (85) 3232-4141",
    email: "diretoria@raizes.edu.br",
    cidade: "Fortaleza · CE",
    canal: "Indicação",
    responsavel: "Esther",
    valor: 54000,
    dias: 5,
    proximaAcao: "2026-10-02",
    totalCompras: 128000,
    cicloDias: 58,
    etapa: "proposta",
    tom: "vermelho",
    tags: ["educacao", "proposta-enviada"],
    historico: [
      { id: "h1", tipo: "proposta", titulo: "Proposta v2 enviada", detalhes: ["Esther", "há 5 dias", "17:22"] },
      { id: "h2", tipo: "reuniao", titulo: "Apresentação para a diretoria", detalhes: ["Esther", "há 8 dias", "09:00"] },
    ],
  },
  {
    id: "l8",
    nome: "Camila Ferraz",
    empresa: "Ferraz Arquitetura",
    tipo: "pessoa",
    telefone: "+55 (48) 99881-7766",
    email: "camila@ferrazarq.com",
    cidade: "Florianópolis · SC",
    canal: "Instagram",
    responsavel: "Liam",
    valor: 16700,
    dias: 2,
    proximaAcao: "2026-09-23",
    totalCompras: 22400,
    cicloDias: 35,
    etapa: "proposta",
    tom: "laranja",
    tags: ["warm"],
    historico: [
      { id: "h1", tipo: "proposta", titulo: "Proposta enviada por e-mail", detalhes: ["Liam", "há 2 dias", "13:45"] },
    ],
  },
  {
    id: "l9",
    nome: "Transportes Serra Azul",
    empresa: "Serra Azul Log",
    tipo: "empresa",
    telefone: "+55 (62) 3444-2020",
    email: "contato@serraazul.log.br",
    cidade: "Goiânia · GO",
    canal: "Site",
    responsavel: "Marina",
    valor: 78000,
    dias: 11,
    proximaAcao: "2026-10-06",
    totalCompras: 196000,
    cicloDias: 88,
    etapa: "proposta",
    tom: "azul",
    tags: ["enterprise", "sem-retorno"],
    historico: [
      { id: "h1", tipo: "proposta", titulo: "Proposta enviada", detalhes: ["Marina", "há 11 dias", "11:05"] },
      { id: "h2", tipo: "ligacao", titulo: "Follow-up sem resposta", detalhes: ["Marina", "há 4 dias", "16:30"] },
    ],
  },
  {
    id: "l10",
    nome: "Otávio Rangel",
    empresa: "Rangel Seguros",
    tipo: "pessoa",
    telefone: "+55 (11) 97744-3311",
    email: "otavio@rangelseguros.com.br",
    cidade: "Campinas · SP",
    canal: "WhatsApp",
    responsavel: "Esther",
    valor: 32400,
    dias: 3,
    proximaAcao: "2026-09-24",
    totalCompras: 61000,
    cicloDias: 47,
    etapa: "negociacao",
    tom: "roxo",
    tags: ["quente", "desconto"],
    historico: [
      { id: "h1", tipo: "reuniao", titulo: "Negociação de prazo · 30 min", detalhes: ["Esther", "há 3 dias", "14:00"] },
      { id: "h2", tipo: "nota", titulo: "Pediu 10% no plano anual", detalhes: ["Esther", "há 3 dias", "14:35"] },
    ],
  },
  {
    id: "l11",
    nome: "Rede Sorriso",
    empresa: "Sorriso Odonto",
    tipo: "empresa",
    telefone: "+55 (51) 3030-8080",
    email: "financeiro@redesorriso.com.br",
    cidade: "Porto Alegre · RS",
    canal: "Indicação",
    responsavel: "Liam",
    valor: 63500,
    dias: 7,
    proximaAcao: "2026-10-08",
    totalCompras: 147000,
    cicloDias: 52,
    etapa: "negociacao",
    tom: "verde",
    tags: ["saude", "juridico"],
    historico: [
      { id: "h1", tipo: "nota", titulo: "Contrato no jurídico do cliente", detalhes: ["Liam", "há 7 dias"] },
    ],
  },
  {
    id: "l12",
    nome: "Beatriz Colombo",
    empresa: "Colombo Estética",
    tipo: "pessoa",
    telefone: "+55 (47) 98123-4567",
    email: "bia@colomboestetica.com",
    cidade: "Joinville · SC",
    canal: "Instagram",
    responsavel: "Marina",
    valor: 14200,
    dias: 1,
    proximaAcao: "2026-09-28",
    totalCompras: 0,
    cicloDias: 0,
    etapa: "fechamento",
    tom: "ciano",
    tags: ["agendado"],
    historico: [
      { id: "h1", tipo: "proposta", titulo: "Contrato enviado para assinatura", detalhes: ["Marina", "hoje", "08:40"] },
    ],
  },
  {
    id: "l13",
    nome: "Agro Vale Verde",
    empresa: "Vale Verde Agro",
    tipo: "empresa",
    telefone: "+55 (65) 3621-1919",
    email: "diretoria@valeverde.agr.br",
    cidade: "Cuiabá · MT",
    canal: "Site",
    responsavel: "Esther",
    valor: 118000,
    dias: 2,
    proximaAcao: "2026-09-22",
    totalCompras: 289000,
    cicloDias: 71,
    etapa: "fechamento",
    tom: "ambar",
    tags: ["enterprise", "agendado"],
    historico: [
      { id: "h1", tipo: "reuniao", titulo: "Assinatura marcada para sexta", detalhes: ["Esther", "ontem", "15:00"] },
    ],
  },
  {
    id: "l14",
    nome: "Henrique Salles",
    empresa: "Salles Fotografia",
    tipo: "pessoa",
    telefone: "+55 (27) 99555-1212",
    email: "henrique@sallesfoto.com",
    cidade: "Vitória · ES",
    canal: "WhatsApp",
    responsavel: "Liam",
    valor: 7600,
    dias: 5,
    proximaAcao: "2026-09-24",
    totalCompras: 0,
    cicloDias: 0,
    etapa: "novo",
    tom: "rosa",
    tags: ["inbound"],
    historico: [
      { id: "h1", tipo: "mensagem", titulo: "Pediu tabela de preços", detalhes: ["WhatsApp", "há 5 dias", "19:02"] },
    ],
  },
];
