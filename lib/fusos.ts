/**
 * Fuso horário sem biblioteca.
 *
 * O CRM tem cliente em três fusos e agenda atendimento entre eles: hora sem
 * fuso é hora errada de alguém. `Date` guarda um instante, e todo o resto —
 * ler as partes do relógio e voltar delas para o instante — sai do `Intl`,
 * que já traz o banco de fusos do sistema, inclusive horário de verão.
 */

export type PartesDeData = {
  ano: number;
  mes: number;
  dia: number;
  hora: number;
  minuto: number;
  segundo: number;
};

/** O que o relógio marca, naquele fuso, naquele instante. */
export function partesNoFuso(data: Date, fuso: string): PartesDeData {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: fuso,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p: Record<string, number> = {};
  for (const parte of f.formatToParts(data)) {
    if (parte.type !== "literal") p[parte.type] = Number(parte.value);
  }
  return { ano: p.year, mes: p.month, dia: p.day, hora: p.hour % 24, minuto: p.minute, segundo: p.second };
}

/** Deslocamento do fuso em minutos, naquele instante (com horário de verão). */
export function deslocamentoEmMinutos(data: Date, fuso: string) {
  const p = partesNoFuso(data, fuso);
  const comoSeFosseUtc = Date.UTC(p.ano, p.mes - 1, p.dia, p.hora, p.minuto, p.segundo);
  return (comoSeFosseUtc - data.getTime() + data.getMilliseconds()) / 60000;
}

/**
 * O instante em que, naquele fuso, o relógio marca estas partes.
 *
 * Duas passadas: a primeira usa o deslocamento de um palpite, a segunda o
 * deslocamento do resultado. É o que acerta a hora que cai em cima da virada
 * do horário de verão, quando o deslocamento muda no meio da conta.
 */
export function instanteNoFuso(partes: Partial<PartesDeData> & Pick<PartesDeData, "ano" | "mes" | "dia">, fuso: string) {
  const alvo = Date.UTC(partes.ano, partes.mes - 1, partes.dia, partes.hora ?? 0, partes.minuto ?? 0, partes.segundo ?? 0);
  const primeiro = new Date(alvo - deslocamentoEmMinutos(new Date(alvo), fuso) * 60000);
  return new Date(alvo - deslocamentoEmMinutos(primeiro, fuso) * 60000);
}

/** "GMT-3" — o nome curto do fuso naquele instante, no idioma pedido. */
export function rotuloDoFuso(data: Date, fuso: string, locale: string) {
  const parte = new Intl.DateTimeFormat(locale, { timeZone: fuso, timeZoneName: "shortOffset" })
    .formatToParts(data)
    .find((p) => p.type === "timeZoneName");
  return parte?.value ?? fuso;
}

/** O fuso do navegador. */
export function fusoLocal() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/** Todos os fusos do sistema. Sem `supportedValuesOf`, devolve só o local. */
export function fusosDisponiveis(): string[] {
  const intl = Intl as typeof Intl & { supportedValuesOf?: (chave: string) => string[] };
  try {
    return intl.supportedValuesOf?.("timeZone") ?? [fusoLocal()];
  } catch {
    return [fusoLocal()];
  }
}

/** Formata um instante naquele fuso. */
export function formatarNoFuso(data: Date, fuso: string, locale: string, opcoes: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale, { ...opcoes, timeZone: fuso }).format(data);
}

/** "09:30" ou "09:30:15". */
export function horaEmTexto(partes: Pick<PartesDeData, "hora" | "minuto" | "segundo">, comSegundos: boolean) {
  const dois = (n: number) => String(n).padStart(2, "0");
  return comSegundos
    ? `${dois(partes.hora)}:${dois(partes.minuto)}:${dois(partes.segundo)}`
    : `${dois(partes.hora)}:${dois(partes.minuto)}`;
}

/** Lê "09:30" ou "09:30:15". Devolve null quando não for hora. */
export function horaDeTexto(texto: string | null) {
  if (!texto) return null;
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(texto.trim());
  if (!m) return null;
  const hora = Number(m[1]);
  const minuto = Number(m[2]);
  const segundo = Number(m[3] ?? 0);
  if (hora > 23 || minuto > 59 || segundo > 59) return null;
  return { hora, minuto, segundo };
}
