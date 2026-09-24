"use client";

import * as React from "react";
import { CalendarBlank, CaretDown, Clock, GlobeHemisphereWest, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { CalendarioDeDia, type RotulosDoCalendario } from "@/components/ui/date-picker";
import { caixaDeCampo, rotuloDeCampo } from "@/lib/campo";
import {
  cidadeDoFuso,
  formatarNoFuso,
  fusoLocal,
  horaDeTexto,
  horaEmTexto,
  instanteNoFuso,
  partesNoFuso,
  rotuloDoFuso,
} from "@/lib/fusos";
import { textoDeIntl } from "@/lib/datas";
import { cn } from "@/lib/utils";
import { usePosicao } from "@/lib/use-posicao";
import { useCliqueFora } from "@/lib/use-clique-fora";
import { useSaida } from "@/lib/use-saida";
import { PainelFlutuante } from "@/components/ui/popover";

import { foco, focoInterno } from "@/lib/estados";
/**
 * TimePicker e DateTimePicker — hora, e data com hora.
 *
 * Não estão no Figma: entraram por pedido do humano (2026-09-17), montados com
 * o que o DS já tem — a caixa do Input no gatilho, os tokens `overlay/*` na
 * lista e a grade do Date Picker no calendário.
 *
 * As duas peças são **cientes de fuso**. O `TimePicker` guarda texto ("09:30"),
 * que é hora de parede e não tem fuso; o fuso aparece ao lado para dizer de
 * quem é aquele relógio, e é o que o botão "Agora" usa. O `DateTimePicker`
 * guarda um `Date`, que é instante: o mesmo valor lido em São Paulo e em
 * Lisboa mostra horas diferentes, e é isso que se quer numa agenda.
 *
 * A hora se escolhe em RODAS, como no iPhone (reunião de 2026-09-18): cinco
 * valores à vista, o do meio é o escolhido, rola e para no valor; os das
 * pontas inclinam de leve e apagam sob um sombreado em cima e embaixo. O
 * formato de 12 horas ganha a roda de AM/PM. O fuso abre um painel do DS com
 * busca, no lugar do `<select>` nativo.
 */

export type RotulosDeHora = {
  /** Gatilho sem valor. Ex.: "Escolher hora". */
  vazio: string;
  horas: string;
  minutos: string;
  segundos: string;
  agora: string;
  limpar: string;
  /** aria-label do seletor de fuso. Ex.: "Fuso horário". */
  fuso: string;
  /** A roda de AM/PM (formato de 12 horas). Padrão "AM" e "PM" — é assim em todo idioma. */
  am?: string;
  pm?: string;
  /** Placeholder da busca no painel de fuso. Padrão: "Buscar". */
  buscarFuso?: string;
};

/** 24h ("09:30") ou 12h ("9:30 AM"). Sem a prop, vale o costume do `locale`. */
export type FormatoDeHora = "12h" | "24h";

function formatoDoLocale(locale: string): FormatoDeHora {
  try {
    return new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions().hour12 ? "12h" : "24h";
  } catch {
    return "24h";
  }
}

const dois = (n: number) => String(n).padStart(2, "0");
const lista = (fim: number, passo: number) => Array.from({ length: Math.ceil(fim / passo) }, (_, i) => i * passo);

function textoDaHora(p: { hora: number; minuto: number; segundo: number }, formato: FormatoDeHora, locale: string, comSegundos: boolean) {
  return textoDeIntl(
    new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: comSegundos ? "2-digit" : undefined,
      hour12: formato === "12h",
    }).format(new Date(2000, 0, 1, p.hora, p.minuto, p.segundo)),
  );
}

/** Escape fecha só o painel, sem levar junto o drawer de trás; o clique fora
 *  é o de lib/use-clique-fora.ts. Com o painel de fuso aberto por cima, o
 *  Escape é dele. */
function usarFechamento(aberto: boolean, fechar: (devolverFoco?: boolean) => void, raiz: React.RefObject<HTMLDivElement | null>) {
  useCliqueFora(aberto, [raiz], () => fechar(false));
  React.useEffect(() => {
    if (!aberto) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (raiz.current?.querySelector("[data-subpainel]")) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      fechar();
    };
    document.addEventListener("keydown", tecla, true);
    return () => document.removeEventListener("keydown", tecla, true);
  }, [aberto, fechar, raiz]);
}

/* ------------------------------------------------------------------ Roda -- */

const ALTURA_DO_ITEM = 32;
/** Ímpar: o do meio é o escolhido. */
const VISIVEIS = 5;
const RECUO_DA_RODA = ((VISIVEIS - 1) / 2) * ALTURA_DO_ITEM;

type ItemDaRoda = { valor: number; texto: string };

/**
 * A roda: uma lista que rola e para no valor (`scroll-snap`), com o escolhido
 * numa faixa no meio. Os itens inclinam e apagam conforme se afastam do centro
 * (olho de peixe discreto, calculado a cada rolagem) e um sombreado em cima e
 * embaixo fecha o cilindro. Setas, PageUp/PageDown, Home e End andam; clicar
 * num item também escolhe. O valor só muda quando a rolagem para.
 */
function Roda({
  rotulo,
  itens,
  atual,
  aoEscolher,
  minimo = "min-w-14",
}: {
  rotulo: string;
  itens: ItemDaRoda[];
  atual: number;
  aoEscolher: (v: number) => void;
  /** Largura mínima; a roda cresce para ocupar o painel. */
  minimo?: string;
}) {
  const caixa = React.useRef<HTMLDivElement>(null);
  const id = React.useId().replace(/:/g, "");
  const indice = Math.max(0, itens.findIndex((i) => i.valor === atual));
  const primeira = React.useRef(true);
  const emitido = React.useRef(atual);
  const timer = React.useRef<number | undefined>(undefined);

  const pintar = React.useCallback(() => {
    const el = caixa.current;
    if (!el) return;
    const centro = el.scrollTop + el.clientHeight / 2;
    for (const item of Array.from(el.querySelectorAll<HTMLElement>("[data-item]"))) {
      const d = (item.offsetTop + item.offsetHeight / 2 - centro) / ALTURA_DO_ITEM;
      const a = Math.min(Math.abs(d), 2.5);
      // o do meio cresce ~2px (13 → 15); as pontas inclinam até 60° e apagam —
      // "pode deixar o olho de peixe bem mais forte" (humano, 2026-09-24)
      item.style.opacity = String(Math.max(0.2, 1 - a * 0.34));
      item.style.transform = `perspective(180px) rotateX(${(-d * 30).toFixed(1)}deg) scale(${Math.max(0.6, 1.15 - a * 0.16).toFixed(3)})`;
    }
  }, []);

  // abre já no valor atual; depois, cada mudança rola suave até o novo
  React.useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const alvo = indice * ALTURA_DO_ITEM;
    if (Math.abs(el.scrollTop - alvo) > 1) el.scrollTo({ top: alvo, behavior: primeira.current ? "auto" : "smooth" });
    else pintar();
    primeira.current = false;
    emitido.current = atual;
  }, [indice, atual, pintar]);

  React.useEffect(() => {
    pintar();
  }, [pintar, itens]);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  function aoRolar() {
    pintar();
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const el = caixa.current;
      if (!el) return;
      const i = Math.max(0, Math.min(itens.length - 1, Math.round(el.scrollTop / ALTURA_DO_ITEM)));
      const item = itens[i];
      if (item && item.valor !== emitido.current) {
        emitido.current = item.valor;
        aoEscolher(item.valor);
      }
    }, 120);
  }

  function teclado(e: React.KeyboardEvent) {
    const passos: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, PageDown: 5, PageUp: -5, Home: -itens.length, End: itens.length };
    const passo = passos[e.key];
    if (!passo) return;
    e.preventDefault();
    const i = Math.max(0, Math.min(itens.length - 1, indice + passo));
    if (itens[i] && itens[i].valor !== atual) aoEscolher(itens[i].valor);
  }

  return (
    <div className={cn("flex flex-1 flex-col items-center", minimo)}>
      <p className="pb-1 text-caption text-muted-foreground">{rotulo}</p>
      <div className="relative w-full" style={{ height: ALTURA_DO_ITEM * VISIVEIS }}>
        {/* a faixa do meio: é onde o valor escolhido para */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 rounded-md bg-overlay-item-selected" />
        <div
          ref={caixa}
          role="listbox"
          aria-label={rotulo}
          aria-activedescendant={`${id}-${indice}`}
          tabIndex={0}
          onScroll={aoRolar}
          onKeyDown={teclado}
          className={cn(
            "relative h-full w-full snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            focoInterno,
          )}
          style={{ paddingTop: RECUO_DA_RODA, paddingBottom: RECUO_DA_RODA }}
        >
          {itens.map((item, i) => (
            <div
              key={item.valor}
              id={`${id}-${i}`}
              data-item=""
              role="option"
              aria-selected={item.valor === atual}
              onClick={() => aoEscolher(item.valor)}
              className={cn(
                "flex h-8 cursor-pointer snap-center items-center justify-center text-body-lg tabular-nums",
                item.valor === atual ? "text-overlay-item-text-selected" : "text-foreground",
              )}
            >
              {item.texto}
            </div>
          ))}
        </div>
        {/* o sombreado em cima e embaixo */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-12 rounded-t-md bg-gradient-to-b from-overlay-bg to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-12 rounded-b-md bg-gradient-to-t from-overlay-bg to-transparent" />
      </div>
    </div>
  );
}

type PartesDeHora = { hora: number; minuto: number; segundo: number };

/** As rodas de hora, minuto, segundo (opcional) e AM/PM (formato 12h). */
function Rodas({
  formato,
  segundos,
  passoMinutos,
  passoSegundos,
  partes,
  rotulos,
  aoTrocar,
}: {
  formato: FormatoDeHora;
  segundos: boolean;
  passoMinutos: number;
  passoSegundos: number;
  partes: PartesDeHora;
  rotulos: RotulosDeHora;
  aoTrocar: (troca: Partial<PartesDeHora>) => void;
}) {
  const doze = formato === "12h";
  const tarde = partes.hora >= 12;
  const horas: ItemDaRoda[] = doze
    ? Array.from({ length: 12 }, (_, i) => ({ valor: i, texto: i === 0 ? "12" : dois(i) }))
    : lista(24, 1).map((v) => ({ valor: v, texto: dois(v) }));
  const am = rotulos.am ?? "AM";
  const pm = rotulos.pm ?? "PM";
  return (
    // as rodas dividem a largura do painel entre si: sem espaço morto ao lado
    <div className="flex w-full items-end gap-1">
      <Roda
        rotulo={rotulos.horas}
        itens={horas}
        atual={doze ? partes.hora % 12 : partes.hora}
        aoEscolher={(h) => aoTrocar({ hora: doze ? h + (tarde ? 12 : 0) : h })}
      />
      <Roda
        rotulo={rotulos.minutos}
        itens={lista(60, passoMinutos).map((v) => ({ valor: v, texto: dois(v) }))}
        atual={partes.minuto}
        aoEscolher={(m) => aoTrocar({ minuto: m })}
      />
      {segundos ? (
        <Roda
          rotulo={rotulos.segundos}
          itens={lista(60, passoSegundos).map((v) => ({ valor: v, texto: dois(v) }))}
          atual={partes.segundo}
          aoEscolher={(s) => aoTrocar({ segundo: s })}
        />
      ) : null}
      {doze ? (
        <Roda
          rotulo={`${am}/${pm}`}
          itens={[
            { valor: 0, texto: am },
            { valor: 1, texto: pm },
          ]}
          atual={tarde ? 1 : 0}
          aoEscolher={(p) => aoTrocar({ hora: (partes.hora % 12) + (p ? 12 : 0) })}
          minimo="min-w-16"
        />
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ Fuso -- */

/**
 * O seletor de fuso: um botão com o deslocamento e a cidade, que abre um
 * painel do DS com busca — no lugar do `<select>` nativo (reunião de
 * 2026-09-18). Setas andam, Enter escolhe, Escape fecha só este painel.
 */
function SeletorDeFuso({
  fuso,
  fusos,
  aoMudar,
  locale,
  rotulos,
}: {
  fuso: string;
  fusos: string[];
  aoMudar: (fuso: string) => void;
  locale: string;
  rotulos: RotulosDeHora;
}) {
  const [aberto, setAberto] = React.useState(false);
  const [busca, setBusca] = React.useState("");
  const [emFoco, setEmFoco] = React.useState(0);
  const gatilho = React.useRef<HTMLButtonElement>(null);
  const painel = React.useRef<HTMLDivElement>(null);
  const campo = React.useRef<HTMLInputElement>(null);
  const { saindo, visivel } = useSaida(aberto);
  const id = React.useId().replace(/:/g, "");
  const agora = new Date();
  const buscar = rotulos.buscarFuso ?? "Buscar";

  useCliqueFora(aberto, [gatilho, painel], () => setAberto(false));
  React.useEffect(() => {
    if (!aberto) return;
    setBusca("");
    setEmFoco(Math.max(0, fusos.indexOf(fuso)));
    campo.current?.focus();
  }, [aberto, fusos, fuso]);

  const termo = busca.trim().toLowerCase();
  const encontrados = fusos.filter((f) => !termo || f.toLowerCase().includes(termo) || cidadeDoFuso(f).toLowerCase().includes(termo));
  React.useEffect(() => {
    if (termo) setEmFoco(0);
  }, [termo]);
  React.useEffect(() => {
    painel.current?.querySelector<HTMLElement>(`[id="${id}-${emFoco}"]`)?.scrollIntoView({ block: "nearest" });
  }, [emFoco, id]);

  function fechar(devolverFoco = true) {
    setAberto(false);
    if (devolverFoco) gatilho.current?.focus();
  }
  function escolher(f: string) {
    aoMudar(f);
    fechar();
  }
  function teclado(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      fechar();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setEmFoco((i) => Math.min(encontrados.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setEmFoco((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (encontrados[emFoco]) escolher(encontrados[emFoco]);
    }
  }

  return (
    <div className="relative min-w-0">
      <Button
        ref={gatilho}
        variant="ghost"
        size="sm"
        aria-haspopup="dialog"
        aria-expanded={aberto}
        aria-label={`${rotulos.fuso}: ${cidadeDoFuso(fuso)}`}
        title={`${rotulos.fuso}: ${cidadeDoFuso(fuso)}`}
        onClick={() => (aberto ? fechar(false) : setAberto(true))}
        className="max-w-full gap-1 px-1.5 text-caption"
      >
        {/* só o ícone e o deslocamento: a cidade fica no title e no painel — o
            rodapé é o que dá a largura do painel, e ele estava sobrando */}
        <GlobeHemisphereWest size={14} weight="regular" aria-hidden="true" className="shrink-0" />
        <span className="truncate tabular-nums" suppressHydrationWarning>
          {rotuloDoFuso(agora, fuso, locale)}
        </span>
        <CaretDown size={12} weight="bold" aria-hidden="true" className="shrink-0" />
      </Button>
      {visivel ? (
        <PainelFlutuante
          ref={painel}
          role="dialog"
          aria-label={rotulos.fuso}
          acima
          saindo={saindo}
          data-subpainel=""
          onKeyDown={teclado}
          className="flex w-72 flex-col p-1.5"
        >
          <label className={cn(caixaDeCampo(), "h-8 gap-2 px-2")}>
            <MagnifyingGlass size={14} weight="regular" aria-hidden="true" className="shrink-0 text-input-placeholder" />
            <input
              ref={campo}
              type="search"
              role="combobox"
              aria-expanded="true"
              aria-controls={`${id}-lista`}
              aria-activedescendant={encontrados[emFoco] ? `${id}-${emFoco}` : undefined}
              aria-label={buscar}
              placeholder={buscar}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-label-lg text-input-text outline-none placeholder:text-input-placeholder [&::-webkit-search-cancel-button]:appearance-none"
            />
          </label>
          <ul id={`${id}-lista`} role="listbox" aria-label={rotulos.fuso} className="mt-1 max-h-56 overflow-y-auto [scrollbar-width:thin]">
            {encontrados.map((f, i) => (
              <li
                key={f}
                id={`${id}-${i}`}
                role="option"
                aria-selected={f === fuso}
                onMouseEnter={() => setEmFoco(i)}
                onClick={() => escolher(f)}
                className={cn(
                  "flex h-8 cursor-pointer items-center justify-between gap-2 rounded-sm px-2 text-label-lg",
                  i === emFoco && "bg-overlay-item-hover",
                  f === fuso ? "text-overlay-item-text-selected" : "text-foreground",
                )}
              >
                <span className="min-w-0 truncate">{cidadeDoFuso(f)}</span>
                <span className="shrink-0 text-caption tabular-nums text-muted-foreground" suppressHydrationWarning>
                  {rotuloDoFuso(agora, f, locale)}
                </span>
              </li>
            ))}
          </ul>
        </PainelFlutuante>
      ) : null}
    </div>
  );
}

function Rodape({
  fuso,
  rotulos,
  locale,
  fusos,
  aoMudarFuso,
  aoAgora,
  aoLimpar,
}: {
  fuso: string;
  rotulos: RotulosDeHora;
  locale: string;
  fusos?: string[];
  aoMudarFuso?: (fuso: string) => void;
  aoAgora: () => void;
  aoLimpar: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-border px-2 py-2">
      {aoMudarFuso && fusos ? (
        <SeletorDeFuso fuso={fuso} fusos={fusos} aoMudar={aoMudarFuso} locale={locale} rotulos={rotulos} />
      ) : (
        <span className="flex min-w-0 items-center gap-1 px-1.5 text-caption text-muted-foreground" title={cidadeDoFuso(fuso)}>
          <GlobeHemisphereWest size={14} weight="regular" aria-hidden="true" className="shrink-0" />
          <span className="truncate tabular-nums" suppressHydrationWarning>
            {rotuloDoFuso(new Date(), fuso, locale)}
          </span>
        </span>
      )}
      <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="sm" onClick={aoLimpar}>
          {rotulos.limpar}
        </Button>
        <Button variant="soft" size="sm" onClick={aoAgora}>
          {rotulos.agora}
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ TimePicker -- */

export interface TimePickerProps {
  rotulo: string;
  /** "HH:MM" ou "HH:MM:SS", sempre em 24h — o formato é só a vista. */
  valor: string | null;
  aoMudar: (valor: string | null) => void;
  /** Liga a roda de segundos. */
  segundos?: boolean;
  /** De quanto em quanto os minutos aparecem. Padrão 5. */
  passoMinutos?: number;
  /** Idem para os segundos. Padrão 10. */
  passoSegundos?: number;
  /** 12h (com a roda de AM/PM) ou 24h. Sem a prop, o costume do `locale`. */
  formato?: FormatoDeHora;
  /** Fuso mostrado ao lado e usado pelo "Agora". Padrão: o do navegador. */
  fuso?: string;
  /** Com ela (e com `fusos`), o rodapé ganha o seletor de fuso. */
  aoMudarFuso?: (fuso: string) => void;
  fusos?: string[];
  locale: string;
  rotulos: RotulosDeHora;
  disabled?: boolean;
  className?: string;
}

export function TimePicker({
  rotulo,
  valor,
  aoMudar,
  segundos = false,
  passoMinutos = 5,
  passoSegundos = 10,
  formato,
  fuso,
  aoMudarFuso,
  fusos,
  locale,
  rotulos,
  disabled,
  className,
}: TimePickerProps) {
  const [aberto, setAberto] = React.useState(false);
  const raiz = React.useRef<HTMLDivElement>(null);
  const { gatilho, painel, acima, aDireita } = usePosicao(aberto);
  const { saindo, visivel } = useSaida(aberto);
  const id = React.useId().replace(/:/g, "");
  const zona = fuso ?? fusoLocal();
  const vista = formato ?? formatoDoLocale(locale);

  const fechar = React.useCallback((devolverFoco = true) => {
    setAberto(false);
    if (devolverFoco) gatilho.current?.focus();
  }, [gatilho]);
  usarFechamento(aberto, fechar, raiz);

  const lido = horaDeTexto(valor);
  const partes = lido ?? { hora: 0, minuto: 0, segundo: 0 };
  const escolher = (troca: Partial<PartesDeHora>) => aoMudar(horaEmTexto({ ...partes, ...troca }, segundos));

  return (
    <div ref={raiz} className={cn("relative flex min-w-0 flex-col gap-1", className)}>
      <label htmlFor={`hora-${id}`} className={rotuloDeCampo()}>
        {rotulo}
      </label>
      <button
        ref={gatilho}
        id={`hora-${id}`}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        onClick={() => (aberto ? fechar(false) : setAberto(true))}
        className={cn(caixaDeCampo({ disabled }), "justify-between text-left", foco)}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Clock size={16} weight="regular" aria-hidden="true" className="shrink-0 text-input-placeholder" />
          <span className={cn("truncate text-body-md tabular-nums", valor ? "text-input-text" : "text-input-placeholder")} suppressHydrationWarning>
            {lido ? textoDaHora(lido, vista, locale, segundos) : rotulos.vazio}
          </span>
        </span>
        <span className="shrink-0 text-caption text-muted-foreground" suppressHydrationWarning>
          {rotuloDoFuso(new Date(), zona, locale)}
        </span>
      </button>

      {visivel ? (
        <PainelFlutuante
          saindo={saindo}
          ref={painel}
          role="dialog"
          aria-label={rotulo}
          acima={acima}
          aDireita={aDireita}
          className="flex w-max flex-col"
        >
          <div className="p-3">
            <Rodas
              formato={vista}
              segundos={segundos}
              passoMinutos={passoMinutos}
              passoSegundos={passoSegundos}
              partes={partes}
              rotulos={rotulos}
              aoTrocar={escolher}
            />
          </div>
          <Rodape
            fuso={zona}
            rotulos={rotulos}
            locale={locale}
            fusos={fusos}
            aoMudarFuso={aoMudarFuso}
            aoAgora={() => {
              const agora = partesNoFuso(new Date(), zona);
              aoMudar(horaEmTexto(agora, segundos));
            }}
            aoLimpar={() => aoMudar(null)}
          />
        </PainelFlutuante>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------- DateTimePicker -- */

export interface DateTimePickerProps {
  rotulo: string;
  /** O instante. Ler e escrever sempre em `Date` — o fuso é só a vista. */
  valor: Date | null;
  aoMudar: (valor: Date | null) => void;
  segundos?: boolean;
  passoMinutos?: number;
  passoSegundos?: number;
  /** 12h (com a roda de AM/PM) ou 24h. Sem a prop, o costume do `locale`. */
  formato?: FormatoDeHora;
  /** Fuso da vista. Padrão: o do navegador. */
  fuso?: string;
  /** Com ela (e com `fusos`), o rodapé ganha o seletor de fuso. */
  aoMudarFuso?: (fuso: string) => void;
  fusos?: string[];
  locale: string;
  rotulos: RotulosDeHora & RotulosDoCalendario;
  dataMinima?: Date;
  dataMaxima?: Date;
  disabled?: boolean;
  className?: string;
}

export function DateTimePicker({
  rotulo,
  valor,
  aoMudar,
  segundos = false,
  passoMinutos = 5,
  passoSegundos = 10,
  formato,
  fuso,
  aoMudarFuso,
  fusos,
  locale,
  rotulos,
  dataMinima,
  dataMaxima,
  disabled,
  className,
}: DateTimePickerProps) {
  const [aberto, setAberto] = React.useState(false);
  const raiz = React.useRef<HTMLDivElement>(null);
  const { gatilho, painel, acima, aDireita } = usePosicao(aberto);
  const { saindo, visivel } = useSaida(aberto);
  const id = React.useId().replace(/:/g, "");
  const zona = fuso ?? fusoLocal();
  const vista = formato ?? formatoDoLocale(locale);

  const fechar = React.useCallback((devolverFoco = true) => {
    setAberto(false);
    if (devolverFoco) gatilho.current?.focus();
  }, [gatilho]);
  usarFechamento(aberto, fechar, raiz);

  // O relógio daquele fuso, no instante guardado. Sem valor, a hora começa
  // zerada e o calendário abre no mês de hoje.
  const partes = valor ? partesNoFuso(valor, zona) : null;
  const diaDoCalendario = partes ? new Date(partes.ano, partes.mes - 1, partes.dia) : null;

  function trocar(troca: Partial<{ ano: number; mes: number; dia: number; hora: number; minuto: number; segundo: number }>) {
    const base = partes ?? { ...partesNoFuso(new Date(), zona), hora: 0, minuto: 0, segundo: 0 };
    aoMudar(instanteNoFuso({ ...base, ...troca }, zona));
  }

  const textoDoGatilho = valor
    ? textoDeIntl(
        formatarNoFuso(valor, zona, locale, { dateStyle: "short", timeStyle: segundos ? "medium" : "short", hour12: vista === "12h" }),
      )
    : rotulos.vazio;

  return (
    <div ref={raiz} className={cn("relative flex min-w-0 flex-col gap-1", className)}>
      <label htmlFor={`datahora-${id}`} className={rotuloDeCampo()}>
        {rotulo}
      </label>
      <button
        ref={gatilho}
        id={`datahora-${id}`}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        onClick={() => (aberto ? fechar(false) : setAberto(true))}
        className={cn(caixaDeCampo({ disabled }), "justify-between text-left", foco)}
      >
        <span className="flex min-w-0 items-center gap-2">
          <CalendarBlank size={16} weight="regular" aria-hidden="true" className="shrink-0 text-input-placeholder" />
          <span
            className={cn("truncate text-body-md tabular-nums", valor ? "text-input-text" : "text-input-placeholder")}
            suppressHydrationWarning
          >
            {textoDoGatilho}
          </span>
        </span>
        <span className="shrink-0 text-caption text-muted-foreground" suppressHydrationWarning>
          {rotuloDoFuso(valor ?? new Date(), zona, locale)}
        </span>
      </button>

      {visivel ? (
        <PainelFlutuante
          saindo={saindo}
          ref={painel}
          role="dialog"
          aria-label={rotulo}
          acima={acima}
          aDireita={aDireita}
          className="flex w-max flex-col"
        >
          <div className="flex items-start gap-3 p-3">
            <CalendarioDeDia
              valor={diaDoCalendario}
              aoEscolher={(d) => trocar({ ano: d.getFullYear(), mes: d.getMonth() + 1, dia: d.getDate() })}
              locale={locale}
              rotulos={rotulos}
              dataMinima={dataMinima}
              dataMaxima={dataMaxima}
            />
            <div className="border-l border-border pl-3">
              <Rodas
                formato={vista}
                segundos={segundos}
                passoMinutos={passoMinutos}
                passoSegundos={passoSegundos}
                partes={partes ?? { hora: 0, minuto: 0, segundo: 0 }}
                rotulos={rotulos}
                aoTrocar={trocar}
              />
            </div>
          </div>
          <Rodape
            fuso={zona}
            rotulos={rotulos}
            locale={locale}
            fusos={fusos}
            aoMudarFuso={aoMudarFuso}
            aoAgora={() => aoMudar(new Date())}
            aoLimpar={() => aoMudar(null)}
          />
        </PainelFlutuante>
      ) : null}
    </div>
  );
}
