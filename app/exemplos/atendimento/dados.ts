import { Fire, Snowflake, ThermometerSimple } from "@phosphor-icons/react";
import type { GrupoTags } from "@/components/ui/tag";

/* Dados de exemplo da tela de Atendimento. No CRM, tudo isto vem da API: as
   conversas por conexão (WhatsApp, Instagram, site), as mensagens paginadas e
   o lead ligado ao contato. Os textos são literais porque a tela é exemplo;
   no produto, vêm do next-intl. */

export type Canal = "WhatsApp" | "Instagram" | "Site";
export type Situacao = "aberta" | "pendente" | "finalizada";
export type EtapaId = "novo" | "qualificacao" | "proposta" | "negociacao" | "fechamento";

export type Mensagem = {
  id: string;
  /** Quem escreveu. `nota` é interna: o contato não vê. `sistema` é evento (assumiu, transferiu, finalizou). */
  de: "contato" | "atendente" | "nota" | "sistema";
  texto: string;
  /** Dia em texto, já pronto para o separador. Ex.: "Hoje". */
  dia: string;
  hora: string;
  autor?: string;
  /** Só nas do atendente: entregue e lida. */
  lida?: boolean;
};

export type Conversa = {
  id: string;
  nome: string;
  empresa: string;
  tipo: "pessoa" | "empresa";
  telefone: string;
  email: string;
  cidade: string;
  canal: Canal;
  situacao: Situacao;
  atendente: string | null;
  etapa: EtapaId;
  valor: number;
  tags: string[];
  naoLidas: number;
  mensagens: Mensagem[];
};

export const ETAPAS: { id: EtapaId; rotulo: string }[] = [
  { id: "novo", rotulo: "Novo lead" },
  { id: "qualificacao", rotulo: "Qualificação" },
  { id: "proposta", rotulo: "Proposta" },
  { id: "negociacao", rotulo: "Negociação" },
  { id: "fechamento", rotulo: "Fechamento" },
];

export const ATENDENTES = ["Esther", "Liam", "Marina", "Breno"];
export const EU = "Esther";

export const RESPOSTAS_RAPIDAS = [
  { id: "saudacao", rotulo: "Saudação", texto: "Olá! Aqui é a Esther, da DataCrazy. Como posso ajudar?" },
  { id: "proposta", rotulo: "Envio de proposta", texto: "Acabei de enviar a proposta para o seu e-mail. Consegue dar uma olhada e me dizer o que achou?" },
  { id: "horario", rotulo: "Fora do horário", texto: "Nosso atendimento é de segunda a sexta, das 9h às 18h. Respondo assim que voltarmos." },
];

/* O catálogo de tags da conta: o contato guarda só os ids. */
export const GRUPOS_TAGS: GrupoTags[] = [
  {
    id: "temperatura",
    rotulo: "Temperatura",
    tags: [
      // Escala, não categoria: o ícone diz o degrau, na cor dele.
      { id: "frio", rotulo: "Frio", icone: Snowflake, tom: "ciano" },
      { id: "morno", rotulo: "Morno", icone: ThermometerSimple, tom: "laranja" },
      { id: "quente", rotulo: "Quente", icone: Fire, tom: "vermelho" },
    ],
  },
  {
    id: "status",
    rotulo: "Status",
    tags: [
      { id: "cliente", rotulo: "Cliente", status: "success" },
      { id: "lead", rotulo: "Lead", status: "info" },
      { id: "sem-retorno", rotulo: "Sem retorno", status: "destructive" },
    ],
  },
  {
    id: "listas",
    rotulo: "Listas",
    tags: [
      { id: "saude", rotulo: "Saúde" },
      { id: "varejo", rotulo: "Varejo" },
      { id: "indicacao", rotulo: "Indicação" },
    ],
  },
];

export const tagsDe = (ids: string[]) =>
  GRUPOS_TAGS.flatMap((g) => g.tags).filter((t) => ids.includes(t.id));

export const moeda = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const etapaPor = (id: EtapaId) => ETAPAS.find((e) => e.id === id) ?? ETAPAS[0];

const m = (id: string, de: Mensagem["de"], texto: string, dia: string, hora: string, extra: Partial<Mensagem> = {}): Mensagem => ({ id, de, texto, dia, hora, ...extra });

export const CONVERSAS: Conversa[] = [
  {
    id: "c1",
    nome: "Marina Alvarenga",
    empresa: "Clínica Vitalis",
    tipo: "pessoa",
    telefone: "+55 (11) 98844-2019",
    email: "marina@vitalis.com.br",
    cidade: "São Paulo · SP",
    canal: "WhatsApp",
    situacao: "aberta",
    atendente: "Esther",
    etapa: "proposta",
    valor: 18400,
    tags: ["quente", "lead", "saude"],
    naoLidas: 2,
    mensagens: [
      m("1", "contato", "Oi! Vi o anúncio de vocês no Instagram. O plano atende clínica com três unidades?", "Ontem", "16:42"),
      m("2", "sistema", "Esther assumiu o atendimento", "Ontem", "16:43"),
      m("3", "atendente", "Oi, Marina! Atende sim. Cada unidade vira uma pipeline, com atendentes separados.", "Ontem", "16:45", { autor: "Esther", lida: true }),
      m("4", "nota", "Cliente veio da campanha de setembro. Já usa planilha e WhatsApp pessoal; dor é perder lead entre as unidades.", "Ontem", "16:50", { autor: "Esther" }),
      m("5", "atendente", "Mandei a proposta no seu e-mail com os três cenários.", "Ontem", "17:10", { autor: "Esther", lida: true }),
      m("6", "contato", "Recebi, obrigada. O valor é por unidade ou pela conta?", "Hoje", "09:12"),
      m("7", "contato", "E dá para migrar os contatos que já tenho na planilha?", "Hoje", "09:13"),
    ],
  },
  {
    id: "c2",
    nome: "Construtora Horizonte",
    empresa: "Horizonte Engenharia",
    tipo: "empresa",
    telefone: "+55 (41) 3533-1200",
    email: "contato@horizonte.eng.br",
    cidade: "Curitiba · PR",
    canal: "Site",
    situacao: "aberta",
    atendente: "Liam",
    etapa: "negociacao",
    valor: 96000,
    tags: ["morno", "lead"],
    naoLidas: 0,
    mensagens: [
      m("1", "contato", "Bom dia. Precisamos de integração com o nosso ERP antes de fechar.", "Hoje", "08:30"),
      m("2", "atendente", "Bom dia! Qual ERP vocês usam hoje? Temos integração nativa com Bling e Tiny.", "Hoje", "08:41", { autor: "Liam", lida: true }),
      m("3", "contato", "Usamos o Tiny.", "Hoje", "08:44"),
      m("4", "atendente", "Perfeito, então é nativo. Posso agendar uma demonstração com o time técnico?", "Hoje", "08:46", { autor: "Liam", lida: false }),
    ],
  },
  {
    id: "c3",
    nome: "Rafael Pinto",
    empresa: "Pinto Advocacia",
    tipo: "pessoa",
    telefone: "+55 (54) 98000-1122",
    email: "rafael@pintoadv.com.br",
    cidade: "Caxias do Sul · RS",
    canal: "WhatsApp",
    situacao: "aberta",
    atendente: null,
    etapa: "novo",
    valor: 12500,
    tags: ["indicacao"],
    naoLidas: 1,
    mensagens: [m("1", "contato", "Boa tarde, fui indicado pelo Dr. Henrique. Vocês têm automação de mensagem para prazo processual?", "Hoje", "13:05")],
  },
  {
    id: "c4",
    nome: "Júlia Bastos",
    empresa: "Bastos Odontologia",
    tipo: "pessoa",
    telefone: "+55 (21) 99712-4455",
    email: "julia@bastosodonto.com",
    cidade: "Rio de Janeiro · RJ",
    canal: "Instagram",
    situacao: "pendente",
    atendente: "Esther",
    etapa: "qualificacao",
    valor: 9800,
    tags: ["morno", "saude"],
    naoLidas: 0,
    mensagens: [
      m("1", "contato", "Quanto custa para dois atendentes?", "Ontem", "11:20"),
      m("2", "atendente", "Oi, Júlia! O plano Starter cobre até três atendentes. Posso te ligar para entender o volume de mensagens?", "Ontem", "11:32", { autor: "Esther", lida: true }),
      m("3", "sistema", "Aguardando resposta do contato há 1 dia", "Hoje", "11:32"),
    ],
  },
  {
    id: "c5",
    nome: "Supermercados Bom Dia",
    empresa: "Rede Bom Dia",
    tipo: "empresa",
    telefone: "+55 (31) 3348-7700",
    email: "compras@redebomdia.com.br",
    cidade: "Belo Horizonte · MG",
    canal: "WhatsApp",
    situacao: "aberta",
    atendente: "Marina",
    etapa: "qualificacao",
    valor: 145000,
    tags: ["quente", "varejo"],
    naoLidas: 0,
    mensagens: [
      m("1", "contato", "Temos 14 lojas e cada uma atende no próprio WhatsApp. Queremos centralizar.", "Hoje", "10:02"),
      m("2", "atendente", "É exatamente o caso de uso do multiatendimento. Cada loja vira uma conexão e o time enxerga tudo num painel.", "Hoje", "10:09", { autor: "Marina", lida: true }),
    ],
  },
  {
    id: "c6",
    nome: "Pedro Nakamura",
    empresa: "Nakamura Contabilidade",
    tipo: "pessoa",
    telefone: "+55 (11) 97755-0031",
    email: "pedro@nakamuracont.com.br",
    cidade: "Santo André · SP",
    canal: "WhatsApp",
    situacao: "pendente",
    atendente: "Breno",
    etapa: "qualificacao",
    valor: 21000,
    tags: ["sem-retorno"],
    naoLidas: 0,
    mensagens: [
      m("1", "atendente", "Pedro, conseguiu ver a proposta que enviei na semana passada?", "20/09", "15:00", { autor: "Breno", lida: true }),
      m("2", "sistema", "Sem resposta há 9 dias", "Hoje", "15:00"),
    ],
  },
  {
    id: "c7",
    nome: "Escola Raízes",
    empresa: "Instituto Raízes",
    tipo: "empresa",
    telefone: "+55 (85) 3221-9080",
    email: "secretaria@raizes.edu.br",
    cidade: "Fortaleza · CE",
    canal: "Site",
    situacao: "finalizada",
    atendente: "Esther",
    etapa: "fechamento",
    valor: 54000,
    tags: ["cliente"],
    naoLidas: 0,
    mensagens: [
      m("1", "contato", "Contrato assinado! Quando começa o onboarding?", "25/09", "09:40"),
      m("2", "atendente", "Que ótimo! O onboarding começa na segunda. Vou te apresentar a Marina, que cuida da implantação.", "25/09", "09:52", { autor: "Esther", lida: true }),
      m("3", "sistema", "Esther finalizou o atendimento", "25/09", "09:55"),
    ],
  },
  {
    id: "c8",
    nome: "Camila Ferraz",
    empresa: "Ferraz Fotografia",
    tipo: "pessoa",
    telefone: "+55 (48) 99102-5566",
    email: "camila@ferrazfoto.com",
    cidade: "Florianópolis · SC",
    canal: "Instagram",
    situacao: "aberta",
    atendente: "Liam",
    etapa: "proposta",
    valor: 16700,
    tags: ["morno"],
    naoLidas: 3,
    mensagens: [
      m("1", "contato", "Oi, tudo bem?", "Hoje", "12:48"),
      m("2", "contato", "Queria saber se consigo responder direct e WhatsApp no mesmo lugar", "Hoje", "12:48"),
      m("3", "contato", "E se tem teste grátis", "Hoje", "12:49"),
    ],
  },
];
