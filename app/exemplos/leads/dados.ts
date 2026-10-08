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
  // Os 64 abaixo entraram em 2026-10-08, a pedido do cliente ("adicionar mais lead e criar a paginação"): a lista passa de uma página.
  { id: "l21", nome: "Raquel Cunha Ribeiro", telefone: "(21) 94519-6084", email: "raquel.ribeiro@icloud.com", empresa: "", documento: "680.865.578-13", tags: [], origem: "WhatsApp", criadoEm: "2026-04-02" },
  { id: "l22", nome: "Vitória Vieira", telefone: "(91) 91952-1135", email: "vitoria.vieira@hotmail.com", empresa: "Distribuidora Boa Safra", documento: "84.640.722/0001-18", tags: [], origem: "WhatsApp", criadoEm: "2026-01-22" },
  { id: "l23", nome: "Igor Pinto Barbosa", telefone: "(11) 94158-2752", email: "igor.barbosa@gmail.com", empresa: "Studio Forma Pilates", documento: "99.185.540/0001-22", tags: [], origem: "WhatsApp", criadoEm: "2025-10-14" },
  { id: "l24", nome: "Cauã Batista", telefone: "(31) 96945-1659", email: "caua.batista@outlook.com", empresa: "", documento: "293.576.404-44", tags: ["carrinho"], origem: "WhatsApp", criadoEm: "2026-03-01" },
  { id: "l25", nome: "Sofia Correia", telefone: "(31) 99717-5711", email: "sofia.correia@hotmail.com", empresa: "Transportadora Rota Sul", documento: "18.139.459/0001-22", tags: [], origem: "Instagram", criadoEm: "2026-03-23" },
  { id: "l26", nome: "Íris Ribeiro", telefone: "(41) 94425-6029", email: "iris.ribeiro@icloud.com", empresa: "", documento: "817.242.793-35", tags: ["recorrente", "primeira"], origem: "WhatsApp", criadoEm: "2026-02-02" },
  { id: "l27", nome: "Mateus Rocha Pereira", telefone: "(91) 91068-4874", email: "mateus.pereira@uol.com.br", empresa: "", documento: "286.817.954-44", tags: [], origem: "Instagram", criadoEm: "2026-02-15" },
  { id: "l28", nome: "Ricardo Nunes", telefone: "(91) 91699-7866", email: "ricardo.nunes@icloud.com", empresa: "", documento: "846.815.587-87", tags: [], origem: "WhatsApp", criadoEm: "2026-02-11" },
  { id: "l29", nome: "Fábio Moreira", telefone: "(47) 97512-6512", email: "fabio.moreira@hotmail.com", empresa: "Vinícola Serra Azul", documento: "568.189.922-37", tags: [], origem: "Google", criadoEm: "2025-12-06" },
  { id: "l30", nome: "Tomás Nunes Freitas", telefone: "(54) 97260-1185", email: "tomas.freitas@gmail.com", empresa: "Editora Pequenas Letras", documento: "809.807.568-97", tags: [], origem: "LinkedIn", criadoEm: "2026-03-20" },
  { id: "l31", nome: "Marcelo Guimarães Machado", telefone: "(43) 97874-7444", email: "marcelo.machado@gmail.com", empresa: "Gráfica Impressão Viva", documento: "626.145.660-15", tags: [], origem: "WhatsApp", criadoEm: "2026-02-24" },
  { id: "l32", nome: "Alice Moura", telefone: "(81) 93657-1307", email: "alice.moura@yahoo.com.br", empresa: "", documento: "216.485.710-69", tags: ["carrinho"], origem: "LinkedIn", criadoEm: "2026-04-14" },
  { id: "l33", nome: "Camila Campos Silva", telefone: "(41) 92045-5182", email: "camila.silva@yahoo.com.br", empresa: "", documento: "728.257.161-58", tags: ["recorrente", "vip"], origem: "LinkedIn", criadoEm: "2026-01-24" },
  { id: "l34", nome: "Helena Tavares Xavier", telefone: "(27) 97940-1774", email: "helena.xavier@uol.com.br", empresa: "Cervejaria Lúpulo Rei", documento: "201.335.747-60", tags: [], origem: "Meta", criadoEm: "2026-03-19" },
  { id: "l35", nome: "Íris Oliveira", telefone: "(47) 96450-8675", email: "iris.oliveira@uol.com.br", empresa: "Escritório Lemos Advogados", documento: "458.696.952-70", tags: ["avaliacao"], origem: "Meta", criadoEm: "2026-02-22" },
  { id: "l36", nome: "Wagner Moura Barbosa", telefone: "(71) 95429-5960", email: "wagner.barbosa@gmail.com", empresa: "Barbearia Dom Navalha", documento: "565.486.861-63", tags: [], origem: "Instagram", criadoEm: "2025-10-16" },
  { id: "l37", nome: "Clara Rodrigues Campos", telefone: "(41) 97740-1792", email: "clara.campos@hotmail.com", empresa: "Oficina Rápida Motors", documento: "124.973.327-96", tags: [], origem: "LinkedIn", criadoEm: "2026-04-05" },
  { id: "l38", nome: "Ricardo Brito", telefone: "(11) 91066-4378", email: "ricardo.brito@uol.com.br", empresa: "", documento: "575.236.928-42", tags: ["carrinho"], origem: "Site", criadoEm: "2025-12-24" },
  { id: "l39", nome: "César Silva Sales", telefone: "(62) 98425-7180", email: "cesar.sales@uol.com.br", empresa: "Farmácia Bem Viver", documento: "174.102.248-80", tags: ["recorrente", "vip"], origem: "Instagram", criadoEm: "2025-09-07" },
  { id: "l40", nome: "Simone Ribeiro Freitas", telefone: "(85) 92212-3124", email: "simone.freitas@outlook.com", empresa: "", documento: "867.159.353-82", tags: [], origem: "WhatsApp", criadoEm: "2026-02-05" },
  { id: "l41", nome: "Juliana Sales Ribeiro", telefone: "(32) 95434-7969", email: "juliana.ribeiro@icloud.com", empresa: "", documento: "497.170.201-94", tags: [], origem: "Meta", criadoEm: "2026-03-15" },
  { id: "l42", nome: "Lucas Correia", telefone: "(47) 99508-7031", email: "lucas.correia@outlook.com", empresa: "Escola Primeiros Passos", documento: "105.767.252-40", tags: ["vip"], origem: "Instagram", criadoEm: "2026-01-11" },
  { id: "l43", nome: "Júlio Correia", telefone: "(41) 97130-4839", email: "julio.correia@gmail.com", empresa: "", documento: "356.651.568-13", tags: [], origem: "Instagram", criadoEm: "2026-01-18" },
  { id: "l44", nome: "Talita Pinto Pereira", telefone: "(11) 99476-1976", email: "talita.pereira@yahoo.com.br", empresa: "", documento: "185.947.909-43", tags: [], origem: "Instagram", criadoEm: "2026-01-14" },
  { id: "l45", nome: "Otávio Melo Moreira", telefone: "(61) 91513-8282", email: "otavio.moreira@uol.com.br", empresa: "", documento: "185.345.263-86", tags: ["carrinho"], origem: "WhatsApp", criadoEm: "2025-11-16" },
  { id: "l46", nome: "Patrícia Rodrigues", telefone: "(27) 99128-6571", email: "patricia.rodrigues@hotmail.com", empresa: "", documento: "168.915.587-68", tags: ["avaliacao"], origem: "WhatsApp", criadoEm: "2026-02-12" },
  { id: "l47", nome: "Ítalo Reis Tavares", telefone: "(92) 91794-3739", email: "italo.tavares@uol.com.br", empresa: "Consultório Dra. Paes", documento: "432.348.791-20", tags: [], origem: "Google", criadoEm: "2026-01-04" },
  { id: "l48", nome: "Cauã Lacerda", telefone: "(11) 98136-2730", email: "caua.lacerda@icloud.com", empresa: "Floricultura Jardim das Rosas", documento: "254.458.251-53", tags: [], origem: "WhatsApp", criadoEm: "2025-11-28" },
  { id: "l49", nome: "Lívia Martins", telefone: "(32) 98845-6421", email: "livia.martins@icloud.com", empresa: "Floricultura Jardim das Rosas", documento: "380.798.887-38", tags: ["vip"], origem: "Instagram", criadoEm: "2026-03-29" },
  { id: "l50", nome: "Flávia Cunha", telefone: "(48) 94395-8183", email: "flavia.cunha@yahoo.com.br", empresa: "Mercado Vila Nova", documento: "56.392.941/0001-45", tags: ["carrinho"], origem: "LinkedIn", criadoEm: "2026-02-18" },
  { id: "l51", nome: "Camila Martins", telefone: "(11) 93776-2365", email: "camila.martins@outlook.com", empresa: "Oficina Rápida Motors", documento: "145.256.514-25", tags: ["recorrente", "avaliacao"], origem: "Instagram", criadoEm: "2026-02-16" },
  { id: "l52", nome: "Ítalo Cunha", telefone: "(32) 94795-8256", email: "italo.cunha@uol.com.br", empresa: "", documento: "378.870.720-58", tags: ["recorrente"], origem: "WhatsApp", criadoEm: "2026-02-01" },
  { id: "l53", nome: "Priscila Azevedo", telefone: "(31) 91419-3006", email: "priscila.azevedo@yahoo.com.br", empresa: "", documento: "461.753.370-86", tags: [], origem: "Google", criadoEm: "2026-02-06" },
  { id: "l54", nome: "Renan Rezende", telefone: "(81) 93334-9750", email: "renan.rezende@yahoo.com.br", empresa: "Padaria Pão Nosso", documento: "554.380.270-70", tags: [], origem: "WhatsApp", criadoEm: "2026-03-04" },
  { id: "l55", nome: "Ricardo Prado", telefone: "(91) 99553-8457", email: "ricardo.prado@yahoo.com.br", empresa: "", documento: "650.561.170-69", tags: [], origem: "Site", criadoEm: "2026-01-29" },
  { id: "l56", nome: "Lívia Prado Cunha", telefone: "(81) 97148-9075", email: "livia.cunha@gmail.com", empresa: "", documento: "381.300.680-69", tags: [], origem: "WhatsApp", criadoEm: "2025-12-27" },
  { id: "l57", nome: "Letícia Cunha", telefone: "(47) 97718-5497", email: "leticia.cunha@outlook.com", empresa: "", documento: "520.592.208-24", tags: [], origem: "Site", criadoEm: "2026-01-15" },
  { id: "l58", nome: "Renata Azevedo Teixeira", telefone: "(48) 91344-4836", email: "renata.teixeira@outlook.com", empresa: "", documento: "549.966.314-47", tags: [], origem: "Google", criadoEm: "2026-04-12" },
  { id: "l59", nome: "Ricardo Rodrigues Azevedo", telefone: "(85) 99171-1978", email: "ricardo.azevedo@icloud.com", empresa: "Auto Escola Direção Certa", documento: "420.524.718-26", tags: [], origem: "WhatsApp", criadoEm: "2025-08-27" },
  { id: "l60", nome: "Sabrina Cunha", telefone: "(62) 94032-8776", email: "sabrina.cunha@hotmail.com", empresa: "", documento: "317.158.431-48", tags: ["avaliacao"], origem: "Indicação", criadoEm: "2026-04-01" },
  { id: "l61", nome: "Cauã Rocha Teixeira", telefone: "(32) 96653-3269", email: "caua.teixeira@outlook.com", empresa: "", documento: "978.729.432-65", tags: [], origem: "WhatsApp", criadoEm: "2026-03-05" },
  { id: "l62", nome: "Melissa Reis Barros", telefone: "(11) 94353-4356", email: "melissa.barros@gmail.com", empresa: "Óptica Olhar Vivo", documento: "520.967.830-79", tags: [], origem: "Instagram", criadoEm: "2026-03-01" },
  { id: "l63", nome: "Cauã Cardoso", telefone: "(31) 92907-4078", email: "caua.cardoso@gmail.com", empresa: "Lanchonete Ponto Doce", documento: "172.674.548-32", tags: [], origem: "WhatsApp", criadoEm: "2026-04-13" },
  { id: "l64", nome: "Juliana Cunha", telefone: "(41) 95384-1724", email: "juliana.cunha@hotmail.com", empresa: "Estúdio Pixel Fotos", documento: "119.366.962-21", tags: ["primeira"], origem: "LinkedIn", criadoEm: "2025-09-07" },
  { id: "l65", nome: "Camila Fonseca Martins", telefone: "(47) 96474-1702", email: "camila.martins@outlook.com", empresa: "Auto Escola Direção Certa", documento: "15.435.638/0001-77", tags: [], origem: "WhatsApp", criadoEm: "2025-08-17" },
  { id: "l66", nome: "Lívia Moura", telefone: "(51) 92722-6191", email: "livia.moura@gmail.com", empresa: "", documento: "294.260.839-25", tags: [], origem: "WhatsApp", criadoEm: "2026-02-27" },
  { id: "l67", nome: "Cauã Rodrigues Barros", telefone: "(48) 97640-5885", email: "caua.barros@icloud.com", empresa: "Padaria Pão Nosso", documento: "339.204.924-35", tags: [], origem: "Instagram", criadoEm: "2025-11-24" },
  { id: "l68", nome: "Igor Carvalho", telefone: "(27) 97787-4929", email: "igor.carvalho@yahoo.com.br", empresa: "", documento: "163.554.866-95", tags: ["carrinho", "primeira"], origem: "Google", criadoEm: "2026-04-02" },
  { id: "l69", nome: "William Brito", telefone: "(62) 95702-2722", email: "william.brito@yahoo.com.br", empresa: "Doceria Mel & Canela", documento: "135.175.409-36", tags: [], origem: "WhatsApp", criadoEm: "2025-08-28" },
  { id: "l70", nome: "Otávio Rocha Melo", telefone: "(11) 97026-3463", email: "otavio.melo@outlook.com", empresa: "", documento: "709.593.443-12", tags: [], origem: "Site", criadoEm: "2026-03-24" },
  { id: "l71", nome: "Luana Fonseca Xavier", telefone: "(85) 99986-6517", email: "luana.xavier@gmail.com", empresa: "Serralheria Ferro Forte", documento: "257.182.154-99", tags: ["vip"], origem: "Site", criadoEm: "2026-03-20" },
  { id: "l72", nome: "Luísa Barros Santos", telefone: "(31) 91987-9573", email: "luisa.santos@outlook.com", empresa: "Pet Shop Amigo Fiel", documento: "913.315.193-48", tags: [], origem: "Instagram", criadoEm: "2025-12-02" },
  { id: "l73", nome: "Cecília Guimarães Reis", telefone: "(91) 97851-9033", email: "cecilia.reis@hotmail.com", empresa: "Academia Corpo Ativo", documento: "913.782.337-53", tags: [], origem: "Instagram", criadoEm: "2026-01-28" },
  { id: "l74", nome: "Cauã Melo", telefone: "(32) 97310-4347", email: "caua.melo@icloud.com", empresa: "Clínica Veterinária Patas", documento: "694.441.488-33", tags: [], origem: "Meta", criadoEm: "2026-03-17" },
  { id: "l75", nome: "Renan Reis", telefone: "(47) 93527-1573", email: "renan.reis@uol.com.br", empresa: "Hotel Vista do Vale", documento: "527.729.729-56", tags: [], origem: "Instagram", criadoEm: "2025-11-23" },
  { id: "l76", nome: "Sabrina Santos Nunes", telefone: "(85) 95680-3728", email: "sabrina.nunes@gmail.com", empresa: "Doceria Mel & Canela", documento: "291.363.264-99", tags: ["carrinho", "recorrente"], origem: "WhatsApp", criadoEm: "2026-03-18" },
  { id: "l77", nome: "Vitória Nunes Melo", telefone: "(62) 94448-2476", email: "vitoria.melo@icloud.com", empresa: "", documento: "269.220.372-87", tags: ["carrinho"], origem: "Site", criadoEm: "2025-10-03" },
  { id: "l78", nome: "Renata Batista Moura", telefone: "(19) 99980-9218", email: "renata.moura@outlook.com", empresa: "Papelaria Traço", documento: "218.981.196-86", tags: ["avaliacao", "vip"], origem: "Google", criadoEm: "2026-03-28" },
  { id: "l79", nome: "Bruna Campos Fonseca", telefone: "(62) 91305-3364", email: "bruna.fonseca@gmail.com", empresa: "Editora Pequenas Letras", documento: "712.425.293-50", tags: [], origem: "WhatsApp", criadoEm: "2026-04-14" },
  { id: "l80", nome: "Miguel Azevedo Batista", telefone: "(31) 91514-1287", email: "miguel.batista@uol.com.br", empresa: "Gráfica Impressão Viva", documento: "862.809.285-48", tags: ["vip"], origem: "Meta", criadoEm: "2025-09-09" },
  { id: "l81", nome: "Caio Melo Silva", telefone: "(19) 95679-5652", email: "caio.silva@outlook.com", empresa: "Óptica Olhar Vivo", documento: "673.303.426-93", tags: ["avaliacao", "primeira"], origem: "Instagram", criadoEm: "2026-03-19" },
  { id: "l82", nome: "Bianca Rezende", telefone: "(11) 91223-4822", email: "bianca.rezende@uol.com.br", empresa: "", documento: "300.906.396-25", tags: [], origem: "WhatsApp", criadoEm: "2026-02-07" },
  { id: "l83", nome: "Giovana Barros", telefone: "(54) 95621-5361", email: "giovana.barros@outlook.com", empresa: "", documento: "806.703.171-17", tags: [], origem: "Meta", criadoEm: "2026-04-27" },
  { id: "l84", nome: "Cauã Nunes", telefone: "(27) 92844-7237", email: "caua.nunes@yahoo.com.br", empresa: "Barbearia Dom Navalha", documento: "484.651.522-31", tags: ["avaliacao", "recorrente"], origem: "Google", criadoEm: "2026-04-21" },
];
