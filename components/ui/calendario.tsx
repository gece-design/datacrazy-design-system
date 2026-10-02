"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { PainelFlutuante } from "@/components/ui/popover";
import { useCliqueFora } from "@/lib/use-clique-fora";
import { useSaida } from "@/lib/use-saida";
import {
  celulasDoMes,
  chaveDoDia,
  deISO,
  inicioDaSemana,
  inicioDoMes,
  maiuscula,
  mesmoMes,
  nomesDosDias,
  primeiroDiaDaSemana,
  somarDias,
  somarMeses,
  textoDeIntl,
} from "@/lib/datas";

import { foco, focoInterno, rolagemDiscreta } from "@/lib/estados";
/**
 * Calendário — a visão por data do pipeline (T4, pedido do cliente em
 * 2026-09-18: "uma visão de calendário" ao lado do Kanban e da lista).
 *
 * Não há desenho no arquivo: o componente nasce do código, com as peças que
 * já existem — a grade e as datas do Date Picker (lib/datas.ts), o
 * SegmentedControl para mês/semana, o Button tertiary nas setas, o
 * PainelFlutuante para o dia cheio. Tudo que é palavra sai de `Intl` a partir
 * do `locale`; os rótulos dos controles vêm de fora (`rotulos`).
 *
 * O componente não sabe o que é um evento: recebe `{ id, data, rotulo }` e
 * devolve o evento clicado em `aoAbrir` — no CRM, é o lead que abre no
 * Drawer. Mês ou semana é `visao`; o dia que diz qual mês é `referencia`.
 * Quem guarda os dois é a tela.
 */

/** Os catorze tons do DS (os mesmos da Tag e do perfil do Drawer). Só a
 *  bolinha do evento pinta: a cor reforça, o texto é o sinal. */
export type TomDoEvento =
  | "azul" | "indigo" | "roxo" | "fucsia" | "rosa" | "vermelho" | "laranja"
  | "ambar" | "amarelo" | "lima" | "verde" | "turquesa" | "ciano" | "marrom";

export type EventoCalendario = {
  id: string;
  /** AAAA-MM-DD, sem hora e sem fuso. */
  data: string;
  rotulo: string;
  /** Linha de apoio no painel do dia. Ex.: a empresa. */
  detalhe?: string;
  tom?: TomDoEvento;
};

export type VisaoCalendario = "mes" | "semana";

export type RotulosDoCalendario = {
  anterior: string;
  proximo: string;
  hoje: string;
  mes: string;
  semana: string;
  /** Nome do grupo mês/semana. */
  visao: string;
  /** O botão do dia cheio. Ex.: (n) => `+${n} mais`. */
  mais: (n: number) => string;
  /** Nome do botão do dia: a data por extenso e quantos eventos tem. */
  dia: (data: string, eventos: number) => string;
};

export const ROTULOS_DO_CALENDARIO: RotulosDoCalendario = {
  anterior: "Anterior",
  proximo: "Próximo",
  hoje: "Hoje",
  mes: "Mês",
  semana: "Semana",
  visao: "Visualização",
  mais: (n) => `+${n} mais`,
  dia: (data, n) => (n ? `${data}, ${n} ${n === 1 ? "evento" : "eventos"}` : data),
};

export interface CalendarioProps {
  eventos: EventoCalendario[];
  /** O dia que diz o mês (ou a semana) na tela. Quem guarda é a tela. */
  referencia: Date;
  aoMudarReferencia: (d: Date) => void;
  visao?: VisaoCalendario;
  /** Com ele, o grupo mês/semana aparece na barra. */
  aoMudarVisao?: (v: VisaoCalendario) => void;
  /** BCP-47. No CRM é o locale ativo do next-intl, nunca um literal. */
  locale: string;
  rotulos?: Partial<RotulosDoCalendario>;
  /** Clique num evento (na grade ou no painel do dia). */
  aoAbrir?: (evento: EventoCalendario) => void;
  /** Clique no número do dia. Ex.: criar algo naquela data. */
  aoEscolherDia?: (dia: Date) => void;
  /** O dia marcado como hoje. Sem ele, o de agora — medido depois de montar,
   *  para o servidor e o navegador não discordarem. */
  hoje?: Date;
  /** Eventos por dia antes do "+N mais". Padrão 3 no mês, 8 na semana. */
  maximoPorDia?: number;
  className?: string;
}

const ALTURA_DO_PAINEL = 320;
const LARGURA_DO_PAINEL = 288;

function Bolinha({ tom }: { tom?: TomDoEvento }) {
  return (
    <span
      aria-hidden="true"
      data-tom={tom}
      className={cn("size-1.5 shrink-0 rounded-full", tom ? "bg-tom-ponto" : "bg-primary")}
    />
  );
}

/** Um evento na grade ou no painel: bolinha do tom e o rótulo, numa linha. */
function Evento({
  evento,
  tabIndex,
  aoAbrir,
  comDetalhe,
}: {
  evento: EventoCalendario;
  tabIndex: number;
  aoAbrir?: (evento: EventoCalendario) => void;
  comDetalhe?: boolean;
}) {
  return (
    <button
      type="button"
      tabIndex={tabIndex}
      title={evento.detalhe ? `${evento.rotulo} · ${evento.detalhe}` : evento.rotulo}
      onClick={() => aoAbrir?.(evento)}
      className={cn(
        "flex w-full min-w-0 items-center gap-1.5 rounded-sm px-1 py-0.5 text-left transition-colors hover:bg-overlay-item-hover",
        focoInterno,
      )}
    >
      <Bolinha tom={evento.tom} />
      <span className="min-w-0 flex-1 truncate text-label-sm text-foreground">{evento.rotulo}</span>
      {comDetalhe && evento.detalhe ? (
        <span className="min-w-0 truncate text-caption text-muted-foreground">{evento.detalhe}</span>
      ) : null}
    </button>
  );
}

export function Calendario({
  eventos,
  referencia,
  aoMudarReferencia,
  visao = "mes",
  aoMudarVisao,
  locale,
  rotulos,
  aoAbrir,
  aoEscolherDia,
  hoje: hojeDeFora,
  maximoPorDia,
  className,
}: CalendarioProps) {
  const r = { ...ROTULOS_DO_CALENDARIO, ...rotulos };
  const maximo = maximoPorDia ?? (visao === "mes" ? 3 : 8);
  const primeiroDia = React.useMemo(() => primeiroDiaDaSemana(locale), [locale]);
  const dias = React.useMemo(() => nomesDosDias(locale, primeiroDia), [locale, primeiroDia]);
  const diaLongo = React.useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "full" }), [locale]);

  // "Hoje" só depois de montar: no servidor a data é a do build (o mesmo
  // motivo do Date Picker na regressão visual), e o navegador discordaria.
  const [hojeMedido, setHojeMedido] = React.useState<Date | null>(null);
  React.useEffect(() => {
    if (!hojeDeFora) setHojeMedido(new Date());
  }, [hojeDeFora]);
  const hoje = hojeDeFora ?? hojeMedido;

  /* As células: o mês inteiro em semanas, ou a semana da referência. */
  const celulas = React.useMemo(() => {
    if (visao === "semana") {
      const inicio = inicioDaSemana(referencia, primeiroDia);
      return Array.from({ length: 7 }, (_, i) => ({ data: somarDias(inicio, i), doMes: true }));
    }
    return celulasDoMes(referencia, primeiroDia);
  }, [visao, referencia, primeiroDia]);
  const semanas = Array.from({ length: celulas.length / 7 }, (_, i) => celulas.slice(i * 7, i * 7 + 7));

  const porDia = React.useMemo(() => {
    const m = new Map<number, EventoCalendario[]>();
    for (const e of eventos) {
      const k = chaveDoDia(deISO(e.data));
      m.set(k, [...(m.get(k) ?? []), e]);
    }
    return m;
  }, [eventos]);

  const titulo = React.useMemo(() => {
    if (visao === "semana") {
      const f = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" });
      const a = celulas[0].data;
      const b = celulas[6].data;
      try {
        return textoDeIntl(maiuscula(f.formatRange(a, b), locale));
      } catch {
        return textoDeIntl(`${f.format(a)} – ${f.format(b)}`);
      }
    }
    return textoDeIntl(maiuscula(new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(referencia), locale));
  }, [visao, locale, celulas, referencia]);

  /* Foco: um dia por vez no Tab (grade com setas). Começa na referência —
     o primeiro do mês ou o dia da semana pedida. */
  const [emFoco, setEmFoco] = React.useState<number>(chaveDoDia(referencia));
  const moverFoco = React.useRef(false);
  const grade = React.useRef<HTMLTableElement>(null);
  React.useEffect(() => {
    // a referência mudou por fora (setas, Hoje): o foco vai junto
    if (!celulas.some((c) => chaveDoDia(c.data) === emFoco)) setEmFoco(chaveDoDia(referencia));
  }, [celulas, referencia, emFoco]);
  React.useEffect(() => {
    if (!moverFoco.current) return;
    moverFoco.current = false;
    grade.current?.querySelector<HTMLButtonElement>(`[data-dia="${emFoco}"]`)?.focus();
  });

  function irPara(d: Date) {
    moverFoco.current = true;
    setEmFoco(chaveDoDia(d));
    // saiu da grade: o mês (ou a semana) anda para acompanhar
    if (!celulas.some((c) => chaveDoDia(c.data) === chaveDoDia(d))) aoMudarReferencia(visao === "mes" ? inicioDoMes(d) : d);
  }

  function teclado(e: React.KeyboardEvent<HTMLTableElement>) {
    const atual = celulas.find((c) => chaveDoDia(c.data) === emFoco)?.data;
    if (!atual || (e.target as HTMLElement).getAttribute("data-dia") === null) return;
    const passo: Record<string, () => Date> = {
      ArrowLeft: () => somarDias(atual, -1),
      ArrowRight: () => somarDias(atual, 1),
      ArrowUp: () => somarDias(atual, -7),
      ArrowDown: () => somarDias(atual, 7),
      Home: () => inicioDaSemana(atual, primeiroDia),
      End: () => somarDias(inicioDaSemana(atual, primeiroDia), 6),
      PageUp: () => (visao === "mes" ? somarMeses(atual, -1) : somarDias(atual, -7)),
      PageDown: () => (visao === "mes" ? somarMeses(atual, 1) : somarDias(atual, 7)),
    };
    const proximo = passo[e.key];
    if (!proximo) return;
    e.preventDefault();
    irPara(proximo());
  }

  /* O painel do dia cheio: a lista inteira, em portal fixo (a grade pode
     viver numa caixa que rola). Volta o foco ao "+N mais" ao fechar. */
  const [diaAberto, setDiaAberto] = React.useState<{ chave: number; top: number; left: number } | null>(null);
  const gatilhoDoPainel = React.useRef<HTMLButtonElement | null>(null);
  const painel = React.useRef<HTMLDivElement>(null);
  const { saindo, visivel } = useSaida(Boolean(diaAberto));
  useCliqueFora(Boolean(diaAberto), [painel, gatilhoDoPainel], () => setDiaAberto(null));
  React.useEffect(() => {
    if (!diaAberto) return;
    const primeiro = requestAnimationFrame(() => painel.current?.querySelector<HTMLElement>("button")?.focus());
    const fechar = () => setDiaAberto(null);
    window.addEventListener("scroll", fechar, true);
    window.addEventListener("resize", fechar);
    return () => {
      cancelAnimationFrame(primeiro);
      window.removeEventListener("scroll", fechar, true);
      window.removeEventListener("resize", fechar);
    };
  }, [diaAberto]);

  function abrirDia(chave: number, gatilho: HTMLButtonElement) {
    gatilhoDoPainel.current = gatilho;
    const g = gatilho.getBoundingClientRect();
    const left = Math.max(8, Math.min(g.left, window.innerWidth - LARGURA_DO_PAINEL - 8));
    const cabe = g.bottom + ALTURA_DO_PAINEL + 8 <= window.innerHeight;
    setDiaAberto({ chave, left, top: cabe ? g.bottom + 4 : Math.max(8, g.top - ALTURA_DO_PAINEL - 4) });
  }

  function fecharDia(devolverFoco = true) {
    setDiaAberto(null);
    if (devolverFoco) gatilhoDoPainel.current?.focus();
  }

  const diaDoPainel = diaAberto ? celulas.find((c) => chaveDoDia(c.data) === diaAberto.chave)?.data : undefined;
  const chaveDaGrade = visao === "mes" ? `${referencia.getFullYear()}-${referencia.getMonth()}` : String(chaveDoDia(celulas[0].data));

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="tertiary"
            size="icon-sm"
            aria-label={r.anterior}
            title={r.anterior}
            onClick={() => aoMudarReferencia(visao === "mes" ? somarMeses(referencia, -1) : somarDias(referencia, -7))}
          >
            <CaretLeft size={16} weight="regular" aria-hidden="true" />
          </Button>
          <Button
            variant="tertiary"
            size="icon-sm"
            aria-label={r.proximo}
            title={r.proximo}
            onClick={() => aoMudarReferencia(visao === "mes" ? somarMeses(referencia, 1) : somarDias(referencia, 7))}
          >
            <CaretRight size={16} weight="regular" aria-hidden="true" />
          </Button>
          <Button variant="tertiary" size="sm" onClick={() => aoMudarReferencia(hoje ?? new Date())}>
            {r.hoje}
          </Button>
          {/* aria-live: quem navega por teclado ouve o mês mudar sem sair da grade */}
          <h2 aria-live="polite" className="text-h3 text-foreground">
            {titulo}
          </h2>
        </div>
        {aoMudarVisao ? (
          <SegmentedControl
            rotulo={r.visao}
            atual={visao}
            aoEscolher={(v) => aoMudarVisao(v as VisaoCalendario)}
            itens={[
              { valor: "mes", rotulo: r.mes },
              { valor: "semana", rotulo: r.semana },
            ]}
          />
        ) : null}
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-card">
        <table ref={grade} role="grid" aria-label={titulo} onKeyDown={teclado} className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-muted">
              {dias.map((d) => (
                <th key={d.longo} scope="col" abbr={d.longo} className="h-8 border-b border-border text-center text-label-md font-medium text-muted-foreground">
                  {d.curto}
                </th>
              ))}
            </tr>
          </thead>
          {/* a chave troca a grade inteira quando o mês muda: entra dissolvendo (fast) */}
          <tbody key={chaveDaGrade} className="motion-safe:animate-fade-in-fast">
            {semanas.map((semana, i) => (
              <tr key={i}>
                {semana.map(({ data, doMes }) => {
                  const k = chaveDoDia(data);
                  const doDia = porDia.get(k) ?? [];
                  const ehHoje = hoje ? k === chaveDoDia(hoje) : false;
                  const focado = k === emFoco;
                  const escondidos = Math.max(0, doDia.length - maximo);
                  return (
                    <td
                      key={k}
                      aria-selected={focado || undefined}
                      className={cn(
                        "border-l border-t border-border p-1 align-top first:border-l-0",
                        i === 0 && "border-t-0",
                        !doMes && "bg-background/50",
                      )}
                    >
                      <div className={cn("flex flex-col gap-0.5", visao === "mes" ? "min-h-24" : "min-h-48")}>
                        <button
                          type="button"
                          data-dia={k}
                          tabIndex={focado ? 0 : -1}
                          aria-current={ehHoje ? "date" : undefined}
                          aria-label={r.dia(textoDeIntl(diaLongo.format(data)), doDia.length)}
                          onClick={() => aoEscolherDia?.(data)}
                          onFocus={() => setEmFoco(k)}
                          className={cn(
                            "grid size-6 place-items-center self-start rounded-full text-label-md tabular-nums transition-colors",
                            focoInterno,
                            ehHoje
                              ? "bg-primary text-primary-foreground"
                              : doMes
                                ? "text-foreground hover:bg-overlay-item-hover"
                                : "text-subtle-foreground hover:bg-overlay-item-hover",
                          )}
                        >
                          {data.getDate()}
                        </button>
                        {doDia.slice(0, maximo).map((e) => (
                          <Evento key={e.id} evento={e} tabIndex={focado ? 0 : -1} aoAbrir={aoAbrir} />
                        ))}
                        {escondidos > 0 ? (
                          <button
                            type="button"
                            tabIndex={focado ? 0 : -1}
                            aria-haspopup="dialog"
                            aria-expanded={diaAberto?.chave === k}
                            onClick={(e) => (diaAberto?.chave === k ? fecharDia(false) : abrirDia(k, e.currentTarget))}
                            className={cn(
                              "rounded-sm px-1 py-0.5 text-left text-label-sm text-primary transition-colors hover:bg-overlay-item-hover",
                              focoInterno,
                            )}
                          >
                            {r.mais(escondidos)}
                          </button>
                        ) : null}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visivel && diaAberto && diaDoPainel && typeof document !== "undefined"
        ? createPortal(
            <PainelFlutuante
              ref={painel}
              fixo
              saindo={saindo}
              role="dialog"
              aria-label={r.dia(textoDeIntl(diaLongo.format(diaDoPainel)), (porDia.get(diaAberto.chave) ?? []).length)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  fecharDia();
                }
              }}
              style={{ top: diaAberto.top, left: diaAberto.left, width: LARGURA_DO_PAINEL }}
              className={cn("flex max-h-80 flex-col gap-1 overflow-y-auto p-2", rolagemDiscreta, foco)}
            >
              <p className="px-1 pb-1 text-label-md text-muted-foreground">{textoDeIntl(maiuscula(diaLongo.format(diaDoPainel), locale))}</p>
              {(porDia.get(diaAberto.chave) ?? []).map((e) => (
                <Evento key={e.id} evento={e} tabIndex={0} comDetalhe aoAbrir={(ev) => { fecharDia(false); aoAbrir?.(ev); }} />
              ))}
            </PainelFlutuante>,
            document.body,
          )
        : null}
    </div>
  );
}
