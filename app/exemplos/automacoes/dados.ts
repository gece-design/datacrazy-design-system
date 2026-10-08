/* Dados de exemplo da tela de Automações. No CRM, a automação vem da API —
   troque este arquivo pelos hooks do time e mantenha os formatos. */

import { LARGURA_DO_BLOCO, type SaidaDoCanvas } from "@/components/ui/canvas";

export type TipoDeBloco = "gatilho" | "mensagem" | "espera" | "condicao" | "acao" | "randomizador";
export type Canal = "WhatsApp" | "Instagram";
export type Unidade = "minutos" | "horas" | "dias";

/** Uma saída do bloco: a do canvas do DS. `tom` diz se é o caminho feliz, o de alerta ou o de erro. */
export type Saida = SaidaDoCanvas;

/** O bloco da automação: o formato do `BlocoDoCanvas` mais o que é deste domínio (canal, texto, espera). */
export type Bloco = {
  id: string;
  tipo: TipoDeBloco;
  titulo: string;
  /** Posição no canvas, em px. */
  x: number;
  y: number;
  /** As linhas do corpo: gatilhos, ações, condições ou ramificações. */
  itens: string[];
  /** Só na Mensagem. */
  texto?: string;
  canal?: Canal;
  /** Só na Espera. */
  espera?: { valor: number; unidade: Unidade };
  saidas: Saida[];
  /** Quantas execuções passaram pelo bloco e como terminaram. */
  contagem?: { sucessos: number; alertas: number; erros: number };
};

/** O que cada tipo de bloco é e o que dá para adicionar nele. */
export const TIPOS: Record<TipoDeBloco, { rotulo: string; descricao: string; adicionar?: string; catalogo?: string[] }> = {
  gatilho: {
    rotulo: "Início",
    descricao: "O gatilho é o que dispara a automação.",
    adicionar: "Adicionar gatilho",
    catalogo: ["Lead criado pelo WhatsApp", "Lead criado pelo Instagram", "Lead mudou de etapa", "Tag adicionada ao lead", "Mensagem recebida", "Execução manual por lead"],
  },
  mensagem: { rotulo: "Mensagem", descricao: "Envia uma mensagem e, se quiser, espera a resposta." },
  espera: { rotulo: "Espera", descricao: "Aguarda um tempo antes de continuar." },
  condicao: {
    rotulo: "Condição",
    descricao: "Separa o fluxo conforme o que é verdade para o lead.",
    adicionar: "Adicionar condição",
    catalogo: ['Mensagem contém "agendar"', "Tag é Quente", "Etapa é Proposta", "Valor acima de R$ 10 mil", "Sem atendente"],
  },
  acao: {
    rotulo: "Ação",
    descricao: "Executa ações no sistema.",
    adicionar: "Adicionar ação",
    catalogo: ["Mover para a etapa Qualificação", "Atribuir a Esther", "Adicionar a tag Quente", "Avisar o atendente", "Criar tarefa de retorno", "Deletar lead"],
  },
  randomizador: {
    rotulo: "Randomizador",
    descricao: "Divide o fluxo em ramificações aleatórias.",
    adicionar: "Adicionar ramificação",
    catalogo: ["Oferta A", "Oferta B", "Oferta C", "Sem oferta"],
  },
};

const COLUNA = LARGURA_DO_BLOCO + 72;
const col = (n: number) => 24 + n * COLUNA;

export const AUTOMACAO: Bloco[] = [
  {
    id: "inicio",
    tipo: "gatilho",
    titulo: "Lead entrou pelo WhatsApp",
    x: col(0),
    y: 96,
    itens: ["Lead criado pelo WhatsApp", "Execução manual por lead"],
    saidas: [{ id: "s", rotulo: "Quando o evento ocorrer", para: "boas-vindas" }],
    contagem: { sucessos: 412, alertas: 0, erros: 0 },
  },
  {
    id: "boas-vindas",
    tipo: "mensagem",
    titulo: "Boas-vindas",
    x: col(1),
    y: 24,
    itens: [],
    canal: "WhatsApp",
    texto: "Oi, {{nome}}! Aqui é da Clínica Vitalis. Posso te ajudar a agendar uma avaliação?",
    saidas: [
      { id: "respondeu", rotulo: "Respondeu", para: "interesse" },
      { id: "silencio", rotulo: "Não respondeu", para: "espera", tom: "alerta" },
      { id: "erro", rotulo: "Erro no envio", para: "avisar", tom: "erro" },
    ],
    contagem: { sucessos: 388, alertas: 21, erros: 3 },
  },
  {
    id: "interesse",
    tipo: "condicao",
    titulo: "Quer agendar?",
    x: col(2),
    y: 24,
    itens: ['Mensagem contém "agendar"', "Tag é Quente"],
    saidas: [
      { id: "sim", rotulo: "Se for verdade", para: "qualificar" },
      { id: "nao", rotulo: "Se não", para: "oferta" },
    ],
    contagem: { sucessos: 301, alertas: 0, erros: 0 },
  },
  {
    id: "espera",
    tipo: "espera",
    titulo: "Dar um tempo",
    x: col(2),
    y: 312,
    itens: [],
    espera: { valor: 2, unidade: "horas" },
    saidas: [{ id: "s", rotulo: "Depois da espera", para: "lembrete" }],
    contagem: { sucessos: 21, alertas: 0, erros: 0 },
  },
  {
    id: "avisar",
    tipo: "acao",
    titulo: "Chamar um humano",
    x: col(2),
    y: 528,
    itens: ["Avisar o atendente", "Criar tarefa de retorno"],
    saidas: [
      { id: "s", rotulo: "Próximo passo" },
      { id: "erro", rotulo: "Erro na ação", tom: "erro" },
    ],
    contagem: { sucessos: 3, alertas: 0, erros: 0 },
  },
  {
    id: "qualificar",
    tipo: "acao",
    titulo: "Levar para o funil",
    x: col(3),
    y: 24,
    itens: ["Mover para a etapa Qualificação", "Atribuir a Esther", "Adicionar a tag Quente"],
    saidas: [
      { id: "s", rotulo: "Próximo passo" },
      { id: "erro", rotulo: "Erro na ação", tom: "erro" },
    ],
    contagem: { sucessos: 214, alertas: 0, erros: 2 },
  },
  {
    id: "oferta",
    tipo: "randomizador",
    titulo: "Testar duas ofertas",
    x: col(3),
    y: 288,
    itens: ["Oferta A", "Oferta B"],
    saidas: [
      { id: "a", rotulo: "50% · Oferta A" },
      { id: "b", rotulo: "50% · Oferta B" },
    ],
    contagem: { sucessos: 87, alertas: 0, erros: 0 },
  },
  {
    id: "lembrete",
    tipo: "mensagem",
    titulo: "Lembrete",
    x: col(3),
    y: 512,
    itens: [],
    canal: "WhatsApp",
    texto: "{{nome}}, ainda quer agendar? É só responder por aqui.",
    saidas: [
      { id: "respondeu", rotulo: "Respondeu" },
      { id: "silencio", rotulo: "Não respondeu", tom: "alerta" },
      { id: "erro", rotulo: "Erro no envio", tom: "erro" },
    ],
    contagem: { sucessos: 12, alertas: 9, erros: 0 },
  },
];

/** As saídas com que cada tipo nasce. O randomizador deriva as dele das ramificações. */
export function saidasDe(tipo: TipoDeBloco, itens: string[]): Saida[] {
  switch (tipo) {
    case "gatilho":
      return [{ id: "s", rotulo: "Quando o evento ocorrer" }];
    case "mensagem":
      return [
        { id: "respondeu", rotulo: "Respondeu" },
        { id: "silencio", rotulo: "Não respondeu", tom: "alerta" },
        { id: "erro", rotulo: "Erro no envio", tom: "erro" },
      ];
    case "espera":
      return [{ id: "s", rotulo: "Depois da espera" }];
    case "condicao":
      return [
        { id: "sim", rotulo: "Se for verdade" },
        { id: "nao", rotulo: "Se não" },
      ];
    case "acao":
      return [
        { id: "s", rotulo: "Próximo passo" },
        { id: "erro", rotulo: "Erro na ação", tom: "erro" },
      ];
    case "randomizador":
      return ramificacoes(itens, []);
  }
}

/** As saídas do randomizador: uma por ramificação, com a fatia igual para todas. Mantém o destino de quem já tinha. */
export function ramificacoes(itens: string[], atuais: Saida[]): Saida[] {
  const fatia = itens.length ? Math.round(100 / itens.length) : 0;
  return itens.map((item, i) => ({ id: `r${i}`, rotulo: `${fatia}% · ${item}`, para: atuais.find((s) => s.rotulo.endsWith(`· ${item}`))?.para }));
}
