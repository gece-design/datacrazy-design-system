/**
 * Datas por DIA, sem hora e sem fuso — o que o Date Picker e o Calendário
 * compartilham (regra D21: helper comum mora em lib/, nunca sai de um
 * componente, senão o registry faz `calendario` instalar `date-picker`).
 *
 * Tudo que é palavra ou ordem sai de `Intl` a partir do `locale`: nome de
 * dia, de mês e o primeiro dia da semana. Nada escrito à mão.
 */

/** Chave numérica AAAAMMDD. Comparar por ela evita o clássico "mesmo dia,
 *  horas diferentes" — a origem do bug quando a data vem do back com hora. */
export function chaveDoDia(d: Date) {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function inicioDoMes(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function somarMeses(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

export function somarDias(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function mesmoMes(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function mesmoDia(a: Date, b: Date) {
  return chaveDoDia(a) === chaveDoDia(b);
}

/** "2026-09-23" → Date local (meia-noite). Sem `new Date(iso)`: isso seria UTC
 *  e viraria o dia anterior a oeste de Greenwich. */
export function deISO(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d);
}

export function paraISO(d: Date) {
  const dois = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
}

/** Domingo = 0. O CLDR devolve 1 = segunda … 7 = domingo. pt-br e en começam
 *  no domingo, es começa na segunda: é por isso que isto não é constante. */
export function primeiroDiaDaSemana(locale: string) {
  try {
    const l = new Intl.Locale(locale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const info = typeof l.getWeekInfo === "function" ? l.getWeekInfo() : l.weekInfo;
    if (info?.firstDay) return info.firstDay % 7;
  } catch {
    /* navegador sem weekInfo cai no domingo, que é o padrão de pt-br */
  }
  return 0;
}

/** O primeiro dia da semana em que `d` está, dado o primeiro dia do locale. */
export function inicioDaSemana(d: Date, primeiroDia: number) {
  return somarDias(d, -((d.getDay() - primeiroDia + 7) % 7));
}

export function maiuscula(s: string, locale: string) {
  return s.charAt(0).toLocaleUpperCase(locale) + s.slice(1);
}

export type CelulaDoMes = { data: Date; doMes: boolean };

/** A grade de um mês: semanas inteiras, com os dias vizinhos que fecham a
 *  primeira e a última linha marcados como de outro mês. */
export function celulasDoMes(mes: Date, primeiroDia: number): CelulaDoMes[] {
  const primeiro = inicioDoMes(mes);
  const anteriores = (primeiro.getDay() - primeiroDia + 7) % 7;
  const diasNoMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  const total = Math.ceil((anteriores + diasNoMes) / 7) * 7;

  return Array.from({ length: total }, (_, i) => {
    const data = somarDias(primeiro, i - anteriores);
    return { data, doMes: mesmoMes(data, mes) };
  });
}

/** Os sete nomes de dia, curtos e longos, começando pelo primeiro dia do locale. */
export function nomesDosDias(locale: string, primeiroDia: number) {
  const curto = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
  const longo = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" });
  // 2024-01-07 (UTC) é um domingo — âncora para varrer a semana inteira.
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.UTC(2024, 0, 7 + ((primeiroDia + i) % 7)));
    return { curto: curto.format(d).replace(/\.$/, ""), longo: longo.format(d) };
  });
}

/** Espaços "especiais" do ICU (o U+202F de "5 de set." no Chrome, que o Node
 *  não põe) viram espaço comum: texto de `Intl` igual no servidor e no
 *  navegador, senão a hidratação reclama de um caractere invisível. */
export function textoDeIntl(s: string) {
  return s.replace(/[\u00A0\u202F\u2009]/g, " ");
}
