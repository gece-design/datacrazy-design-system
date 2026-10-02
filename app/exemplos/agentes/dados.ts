/* Dados de exemplo da tela de Agentes de IA. No CRM, cada lista é uma chamada
   da API — troque este arquivo pelos hooks do time e mantenha os formatos. */

export type Agente = {
  id: string;
  nome: string;
  /** O que o agente faz, em uma ou duas frases. */
  descricao: string;
  /** O modelo de IA que responde por ele: um dos `MODELOS`. */
  modelo: string;
  /** De 0 a 100. `null` enquanto o agente ainda não tem score. */
  score: number | null;
  /** Quantas ferramentas o agente pode usar. */
  ferramentas: number;
};

export type BaseDeConhecimento = {
  id: string;
  nome: string;
  descricao: string;
  /** O nome de cada arquivo enviado para a base. */
  arquivos: string[];
};

export type ServidorMcp = {
  id: string;
  nome: string;
  /** O endereço do servidor. */
  url: string;
};

/** Os modelos de IA que a conta pode escolher. */
export const MODELOS = ["GPT-4o", "GPT-4o mini", "Claude Sonnet", "Gemini Flash"];

/** "1 agente", "9 agentes": a contagem com o nome no número certo. */
export const contar = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

export const AGENTES: Agente[] = [
  {
    id: "a1",
    nome: "Qualificador de leads",
    descricao: "Faz as primeiras perguntas no WhatsApp e marca o lead como frio, morno ou quente.",
    modelo: "GPT-4o",
    score: 92,
    ferramentas: 6,
  },
  {
    id: "a2",
    nome: "Agendador de reuniões",
    descricao: "Oferece os horários livres do vendedor e confirma a reunião com o lead.",
    modelo: "GPT-4o mini",
    score: 88,
    ferramentas: 4,
  },
  {
    id: "a3",
    nome: "Suporte nível 1",
    descricao: "Responde as dúvidas mais comuns pela central de ajuda e passa para um atendente quando não sabe.",
    modelo: "Claude Sonnet",
    score: 81,
    ferramentas: 5,
  },
  {
    id: "a4",
    nome: "Recuperador de carrinho",
    descricao: "Chama quem saiu do checkout sem pagar e ajuda a concluir a compra.",
    modelo: "GPT-4o mini",
    score: 74,
    ferramentas: 3,
  },
  {
    id: "a5",
    nome: "Pós-venda",
    descricao: "Acompanha a entrega, pede a avaliação e abre um chamado quando o cliente reclama.",
    modelo: "Gemini Flash",
    score: 67,
    ferramentas: 4,
  },
  {
    id: "a6",
    nome: "Cobrança amigável",
    descricao: "Lembra o cliente da fatura em aberto e envia a segunda via do boleto.",
    modelo: "GPT-4o mini",
    score: 58,
    ferramentas: 2,
  },
  {
    id: "a7",
    nome: "Resumidor de conversas",
    descricao: "Resume cada atendimento encerrado e grava o resumo no histórico do lead.",
    modelo: "Claude Sonnet",
    score: 95,
    ferramentas: 1,
  },
  {
    id: "a8",
    nome: "Triagem de mensagens",
    descricao: "Lê a primeira mensagem e encaminha para o time certo: vendas, suporte ou financeiro.",
    modelo: "Gemini Flash",
    score: 79,
    ferramentas: 2,
  },
  {
    id: "a9",
    nome: "Reativador de base",
    descricao: "Retoma o contato com leads parados há mais de 60 dias.",
    modelo: "GPT-4o",
    score: null,
    ferramentas: 0,
  },
];

export const BASES: BaseDeConhecimento[] = [
  {
    id: "b1",
    nome: "Central de ajuda",
    descricao: "Artigos de suporte e perguntas frequentes",
    arquivos: ["perguntas-frequentes.pdf", "primeiros-passos.pdf", "integracoes.pdf", "faturamento.pdf"],
  },
  {
    id: "b2",
    nome: "Catálogo de produtos",
    descricao: "Planos, preços e condições comerciais",
    arquivos: ["tabela-de-precos-2026.xlsx", "planos.pdf"],
  },
  {
    id: "b3",
    nome: "Políticas da empresa",
    descricao: "Troca, devolução, garantia e privacidade",
    arquivos: ["trocas-e-devolucoes.pdf", "garantia.pdf", "privacidade.pdf"],
  },
  {
    id: "b4",
    nome: "Roteiros de venda",
    descricao: "Abordagem, objeções e fechamento",
    arquivos: [],
  },
];

export const SERVIDORES: ServidorMcp[] = [
  { id: "s1", nome: "Agenda da equipe", url: "https://agenda.exemplo.com.br/mcp" },
  { id: "s2", nome: "Pedidos e estoque", url: "https://erp.exemplo.com.br/mcp" },
  { id: "s3", nome: "Pagamentos", url: "https://pagamentos.exemplo.com.br/mcp" },
];
