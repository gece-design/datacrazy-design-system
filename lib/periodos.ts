import type { AtalhoDeIntervalo, IntervaloDeDatas } from "@/components/ui/date-picker";

/**
 * Catálogo de períodos prontos para o Date Picker.
 *
 * Os atalhos sempre vieram por prop — o componente não tem nenhum embutido,
 * porque texto de interface não mora dentro de componente (i18n, regra 4).
 * O que faltava era este catálogo: as contas de "trimestre anterior",
 * "últimos 3 dias" e companhia, escritas uma vez.
 *
 * `criarAtalhos` recebe os rótulos já traduzidos e devolve a lista na ordem
 * pedida. Escolher quais entram é do produto: a tela do funil não precisa dos
 * mesmos períodos do relatório financeiro.
 */

export type ChaveDePeriodo =
  | "hoje"
  | "ontem"
  | "ultimos3"
  | "ultimos7"
  | "ultimos15"
  | "ultimos30"
  | "ultimos90"
  | "estaSemana"
  | "semanaPassada"
  | "esteMes"
  | "mesPassado"
  | "esteTrimestre"
  | "trimestreAnterior"
  | "esteAno"
  | "anoPassado"
  | "ultimos12Meses";

const dia = (d: Date, n = 0) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const mes = (d: Date, n = 0) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const fimDoMes = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

/** Domingo ou segunda, conforme o locale — a mesma conta da grade do calendário. */
function inicioDaSemana(d: Date, primeiroDia: number) {
  const desloc = (d.getDay() - primeiroDia + 7) % 7;
  return dia(d, -desloc);
}

const trimestre = (d: Date) => Math.floor(d.getMonth() / 3);

/** As contas, sem rótulo: cada uma recebe "hoje" e devolve o intervalo. */
export const PERIODOS: Record<ChaveDePeriodo, (hoje: Date, primeiroDiaDaSemana?: number) => IntervaloDeDatas> = {
  hoje: (h) => ({ inicio: h, fim: h }),
  ontem: (h) => ({ inicio: dia(h, -1), fim: dia(h, -1) }),
  ultimos3: (h) => ({ inicio: dia(h, -2), fim: h }),
  ultimos7: (h) => ({ inicio: dia(h, -6), fim: h }),
  ultimos15: (h) => ({ inicio: dia(h, -14), fim: h }),
  ultimos30: (h) => ({ inicio: dia(h, -29), fim: h }),
  ultimos90: (h) => ({ inicio: dia(h, -89), fim: h }),
  estaSemana: (h, p = 0) => ({ inicio: inicioDaSemana(h, p), fim: h }),
  semanaPassada: (h, p = 0) => {
    const inicio = dia(inicioDaSemana(h, p), -7);
    return { inicio, fim: dia(inicio, 6) };
  },
  esteMes: (h) => ({ inicio: mes(h), fim: h }),
  mesPassado: (h) => ({ inicio: mes(h, -1), fim: fimDoMes(mes(h, -1)) }),
  esteTrimestre: (h) => ({ inicio: new Date(h.getFullYear(), trimestre(h) * 3, 1), fim: h }),
  trimestreAnterior: (h) => {
    const inicio = new Date(h.getFullYear(), trimestre(h) * 3 - 3, 1);
    return { inicio, fim: new Date(inicio.getFullYear(), inicio.getMonth() + 3, 0) };
  },
  esteAno: (h) => ({ inicio: new Date(h.getFullYear(), 0, 1), fim: h }),
  anoPassado: (h) => ({
    inicio: new Date(h.getFullYear() - 1, 0, 1),
    fim: new Date(h.getFullYear() - 1, 11, 31),
  }),
  ultimos12Meses: (h) => ({ inicio: new Date(h.getFullYear() - 1, h.getMonth(), h.getDate() + 1), fim: h }),
};

export interface OpcoesDosAtalhos {
  /** 0 = domingo, 1 = segunda. Só as opções de semana usam. */
  primeiroDiaDaSemana?: number;
}

/**
 * Monta a lista de atalhos na ordem das chaves.
 *
 * ```ts
 * criarAtalhos(["hoje", "ultimos3", "trimestreAnterior"], {
 *   hoje: t("hoje"), ultimos3: t("ultimos3"), trimestreAnterior: t("trimestreAnterior"),
 * })
 * ```
 */
export function criarAtalhos(
  chaves: ChaveDePeriodo[],
  rotulos: Partial<Record<ChaveDePeriodo, string>>,
  opcoes: OpcoesDosAtalhos = {},
): AtalhoDeIntervalo[] {
  return chaves.map((chave) => ({
    id: chave,
    rotulo: rotulos[chave] ?? chave,
    intervalo: (hoje: Date) => PERIODOS[chave](hoje, opcoes.primeiroDiaDaSemana),
  }));
}
