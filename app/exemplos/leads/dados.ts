import type { Tom } from "@/lib/tons";

/* Contatos de mentira para a demonstração. Nomes, telefones, e-mails e
   documentos são inventados — nada aqui sai do arquivo nem encosta em dado
   real. Esta tela NÃO é componente do design system: é uma tela de exemplo,
   montada só com o que já existe em `components/ui/`. */

export type Origem = "Instagram" | "WhatsApp" | "Google" | "Meta" | "LinkedIn" | "Site" | "Indicação";

/** As origens em dois grupos: as que são marca (com ícone de marca) e as outras. */
export const ORIGENS: { valor: Origem; grupo: string }[] = [
  { valor: "Instagram", grupo: "Redes sociais" },
  { valor: "WhatsApp", grupo: "Redes sociais" },
  { valor: "Google", grupo: "Redes sociais" },
  { valor: "Meta", grupo: "Redes sociais" },
  { valor: "LinkedIn", grupo: "Redes sociais" },
  { valor: "Site", grupo: "Outras" },
  { valor: "Indicação", grupo: "Outras" },
];

/* As tags são um CATÁLOGO da conta: quem cria dá nome, descrição e cor — uma
   das quinze do design system. O lead guarda só os ids. */
export type TagDaConta = {
  id: string;
  rotulo: string;
  descricao?: string;
  /** Um dos catorze tons; `null` é a tag cinza. */
  tom: Tom | null;
};

export const TAGS: TagDaConta[] = [
  { id: "carrinho", rotulo: "Carrinho abandonado", descricao: "Saiu do checkout sem pagar", tom: "vermelho" },
  { id: "recorrente", rotulo: "Cliente recorrente", descricao: "Três compras ou mais", tom: "verde" },
  { id: "vip", rotulo: "Cliente VIP", descricao: "Ticket acima de R$ 5 mil", tom: "amarelo" },
  { id: "primeira", rotulo: "Primeira compra", descricao: "Comprou uma vez", tom: "azul" },
  { id: "avaliacao", rotulo: "Avaliação pendente", descricao: "Recebeu o pedido e não avaliou", tom: "laranja" },
];

/** Resolve os ids do lead na ordem do catálogo — não na ordem em que foram marcados. */
export function tagsDe(catalogo: TagDaConta[], ids: string[]): TagDaConta[] {
  return catalogo.filter((t) => ids.includes(t.id));
}

/** A tag como a célula e o painel a desenham: a bolinha na cor escolhida. A sem cor vai sem bolinha. */
export function etiquetaDe(tag: TagDaConta) {
  return { rotulo: tag.rotulo, tom: tag.tom ?? undefined };
}

/** O nome de cada cor, para o seletor (leitor de tela e tooltip). */
export const NOMES_DAS_CORES: Record<Tom | "neutro", string> = {
  neutro: "Cinza",
  azul: "Azul",
  indigo: "Índigo",
  roxo: "Roxo",
  fucsia: "Fúcsia",
  rosa: "Rosa",
  vermelho: "Vermelho",
  laranja: "Laranja",
  ambar: "Âmbar",
  amarelo: "Amarelo",
  lima: "Lima",
  verde: "Verde",
  turquesa: "Turquesa",
  ciano: "Ciano",
  marrom: "Marrom",
};

export type Lead = {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  /** Vazio quando a pessoa não informou. */
  empresa: string;
  documento: string;
  tags: string[];
  origem: Origem;
  /** Data de criação, AAAA-MM-DD. */
  criadoEm: string;
};

/* Intl.NumberFormat formata diferente no Node e no navegador (o espaço depois
   do R$) e a diferença vira erro de hidratação. Conta na mão. */
export function moeda(valor: number) {
  return `R$ ${Math.round(valor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/** O que o lead já comprou: as quatro métricas do topo do drawer. No CRM vem da API; aqui sai das tags. */
export function comprasDe(lead: Lead) {
  const pedidos = lead.tags.includes("recorrente") ? 4 : lead.tags.includes("vip") ? 2 : lead.tags.includes("primeira") ? 1 : 0;
  const ticket = lead.tags.includes("vip") ? 6400 : 1850;
  return { pedidos, ticket: pedidos ? ticket : 0, total: pedidos * ticket, cicloDias: pedidos > 1 ? 38 : 0 };
}

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** "2026-01-16" → "16 jan 2026". À mão, e não por `Intl`: servidor e navegador escrevem igual. */
export function dataCurta(iso: string) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia} ${MESES[Number(mes) - 1]} ${ano}`;
}

export const LEADS: Lead[] = [
  { id: "l01", nome: "Ana Beatriz Ferreira", telefone: "(54) 94041-2782", email: "ana.ferreira@gmail.com", empresa: "Casa Bella Decorações", documento: "791.187.853-99", tags: [], origem: "WhatsApp", criadoEm: "2026-01-16" },
  { id: "l02", nome: "Bruno Henrique Souza", telefone: "(36) 96107-0629", email: "bruno.souza@outlook.com", empresa: "Clínica Vida Plena", documento: "417.789.996-88", tags: ["carrinho", "recorrente"], origem: "LinkedIn", criadoEm: "2026-03-23" },
  { id: "l03", nome: "Carolina Almeida", telefone: "(37) 97706-3571", email: "carolina.almeida@hotmail.com", empresa: "", documento: "637.070.023-60", tags: [], origem: "LinkedIn", criadoEm: "2025-10-22" },
  { id: "l04", nome: "Daniel Martins", telefone: "(78) 95687-0730", email: "daniel.martins@yahoo.com", empresa: "Escola Raízes", documento: "531.284.168-63", tags: ["vip", "primeira"], origem: "Meta", criadoEm: "2026-02-07" },
  { id: "l05", nome: "Eduarda Ribeiro", telefone: "(80) 95975-2402", email: "eduarda.ribeiro@gmail.com", empresa: "", documento: "384.053.423-05", tags: ["carrinho", "vip"], origem: "Google", criadoEm: "2026-03-12" },
  { id: "l06", nome: "Felipe Andrade", telefone: "(43) 91744-5614", email: "felipe.andrade@outlook.com", empresa: "Construtora Boa Vista", documento: "193.419.538-13", tags: ["avaliacao", "primeira"], origem: "Site", criadoEm: "2025-05-29" },
  { id: "l07", nome: "Gabriela Nogueira", telefone: "(60) 92293-5310", email: "gabriela.nogueira@hotmail.com", empresa: "", documento: "641.744.413-04", tags: ["avaliacao", "primeira"], origem: "LinkedIn", criadoEm: "2025-10-29" },
  { id: "l08", nome: "Henrique Moreira", telefone: "(27) 92716-0210", email: "henrique.moreira@yahoo.com", empresa: "", documento: "076.885.412-88", tags: ["carrinho", "vip", "primeira"], origem: "Site", criadoEm: "2025-11-17" },
  { id: "l09", nome: "Isabela Castro", telefone: "(03) 93284-4139", email: "isabela.castro@gmail.com", empresa: "", documento: "282.926.433-34", tags: ["carrinho", "avaliacao"], origem: "Site", criadoEm: "2026-01-07" },
  { id: "l10", nome: "João Pedro Lima", telefone: "(47) 97426-6088", email: "joao.lima@outlook.com", empresa: "", documento: "349.215.700-73", tags: ["carrinho", "avaliacao"], origem: "Meta", criadoEm: "2025-12-26" },
  { id: "l11", nome: "Karina Duarte", telefone: "(11) 98812-4407", email: "karina.duarte@gmail.com", empresa: "Studio Kora", documento: "208.441.967-15", tags: ["recorrente"], origem: "Instagram", criadoEm: "2026-02-19" },
  { id: "l12", nome: "Leonardo Bastos", telefone: "(21) 99644-1820", email: "leonardo.bastos@empresa.com.br", empresa: "Bastos Engenharia", documento: "915.306.284-40", tags: ["vip", "recorrente"], origem: "Indicação", criadoEm: "2025-08-04" },
  { id: "l13", nome: "Mariana Teixeira", telefone: "(31) 98203-7751", email: "mariana.teixeira@gmail.com", empresa: "", documento: "462.118.935-07", tags: ["primeira"], origem: "Instagram", criadoEm: "2026-03-30" },
  { id: "l14", nome: "Nicolas Farias", telefone: "(41) 99170-3368", email: "nicolas.farias@outlook.com", empresa: "Farias & Filhos", documento: "730.592.146-21", tags: [], origem: "Google", criadoEm: "2026-02-02" },
  { id: "l15", nome: "Olívia Santana", telefone: "(71) 98455-9023", email: "olivia.santana@hotmail.com", empresa: "Ateliê Santana", documento: "158.674.209-56", tags: ["recorrente", "avaliacao"], origem: "WhatsApp", criadoEm: "2025-09-11" },
  { id: "l16", nome: "Paulo Roberto Dias", telefone: "(85) 99731-6642", email: "paulo.dias@yahoo.com", empresa: "", documento: "604.837.512-90", tags: ["carrinho"], origem: "Meta", criadoEm: "2026-01-25" },
  { id: "l17", nome: "Rafaela Monteiro", telefone: "(62) 98120-5574", email: "rafaela.monteiro@gmail.com", empresa: "Monteiro Advocacia", documento: "327.905.681-42", tags: ["vip"], origem: "LinkedIn", criadoEm: "2025-07-18" },
  { id: "l18", nome: "Samuel Cardoso", telefone: "(48) 99306-2219", email: "samuel.cardoso@outlook.com", empresa: "", documento: "841.260.793-18", tags: ["primeira"], origem: "Google", criadoEm: "2026-03-05" },
  { id: "l19", nome: "Tatiane Lopes", telefone: "(51) 98674-0935", email: "tatiane.lopes@empresa.com.br", empresa: "Lopes Contabilidade", documento: "596.013.478-64", tags: ["recorrente", "vip"], origem: "Indicação", criadoEm: "2025-06-09" },
  { id: "l20", nome: "Vinícius Araújo", telefone: "(92) 99258-7106", email: "vinicius.araujo@gmail.com", empresa: "", documento: "273.549.806-31", tags: [], origem: "WhatsApp", criadoEm: "2026-02-27" },
];
