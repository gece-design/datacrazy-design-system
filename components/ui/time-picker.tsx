"use client";

import * as React from "react";
import { CalendarBlank, Clock, GlobeHemisphereWest } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { CalendarioDeDia, type RotulosDoCalendario } from "@/components/ui/date-picker";
import { caixaDeCampo, rotuloDeCampo } from "@/lib/campo";
import {
  formatarNoFuso,
  fusoLocal,
  horaDeTexto,
  horaEmTexto,
  instanteNoFuso,
  partesNoFuso,
  rotuloDoFuso,
} from "@/lib/fusos";
import { cn } from "@/lib/utils";
import { usePosicao } from "@/lib/use-posicao";
import { useCliqueFora } from "@/lib/use-clique-fora";
import { PainelFlutuante } from "@/components/ui/popover";

import { foco } from "@/lib/estados";
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
};

const dois = (n: number) => String(n).padStart(2, "0");
const lista = (fim: number, passo: number) => Array.from({ length: Math.ceil(fim / passo) }, (_, i) => i * passo);

/** Escape fecha só o painel, sem levar junto o drawer de trás; o clique fora
 *  é o de lib/use-clique-fora.ts. */
function usarFechamento(aberto: boolean, fechar: (devolverFoco?: boolean) => void, raiz: React.RefObject<HTMLDivElement | null>) {
  useCliqueFora(aberto, [raiz], () => fechar(false));
  React.useEffect(() => {
    if (!aberto) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopImmediatePropagation();
      fechar();
    };
    document.addEventListener("keydown", tecla, true);
    return () => document.removeEventListener("keydown", tecla, true);
  }, [aberto, fechar]);
}

function Coluna({
  rotulo,
  valores,
  atual,
  aoEscolher,
}: {
  rotulo: string;
  valores: number[];
  atual: number;
  aoEscolher: (v: number) => void;
}) {
  const caixa = React.useRef<HTMLDivElement>(null);

  // abre já mostrando o valor atual, em vez de começar na meia-noite
  React.useEffect(() => {
    caixa.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div className="flex flex-col">
      <p className="px-2 pb-1 text-caption text-muted-foreground">{rotulo}</p>
      <div
        ref={caixa}
        role="listbox"
        aria-label={rotulo}
        className="flex max-h-48 w-14 flex-col gap-0.5 overflow-y-auto overscroll-contain px-1 [scrollbar-width:thin]"
      >
        {valores.map((v) => {
          const escolhido = v === atual;
          return (
            <button
              key={v}
              type="button"
              role="option"
              aria-selected={escolhido}
              onClick={() => aoEscolher(v)}
              className={cn(
                "shrink-0 rounded-md px-2 py-1 text-center text-body-md tabular-nums transition-colors",
                foco,
                escolhido
                  ? "bg-overlay-item-selected text-overlay-item-text-selected"
                  : "text-foreground hover:bg-overlay-item-hover",
              )}
            >
              {dois(v)}
            </button>
          );
        })}
      </div>
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
    <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2">
      <div className="flex min-w-0 items-center gap-1 text-caption text-muted-foreground">
        <GlobeHemisphereWest size={14} weight="regular" aria-hidden="true" className="shrink-0" />
        {aoMudarFuso && fusos ? (
          <div className="relative inline-flex min-w-0 items-center">
            <span className="truncate" suppressHydrationWarning>
              {fuso} · {rotuloDoFuso(new Date(), fuso, locale)}
            </span>
            {/* nativo por cima, como os seletores de mês e ano do Date Picker */}
            <select
              aria-label={rotulos.fuso}
              value={fuso}
              onChange={(e) => aoMudarFuso(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            >
              {fusos.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <span className="truncate" suppressHydrationWarning>
            {fuso} · {rotuloDoFuso(new Date(), fuso, locale)}
          </span>
        )}
      </div>
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
  /** "HH:MM" ou "HH:MM:SS". */
  valor: string | null;
  aoMudar: (valor: string | null) => void;
  /** Liga a coluna de segundos. */
  segundos?: boolean;
  /** De quanto em quanto os minutos aparecem. Padrão 5. */
  passoMinutos?: number;
  /** Idem para os segundos. Padrão 10. */
  passoSegundos?: number;
  /** Fuso mostrado ao lado e usado pelo "Agora". Padrão: o do navegador. */
  fuso?: string;
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
  fuso,
  locale,
  rotulos,
  disabled,
  className,
}: TimePickerProps) {
  const [aberto, setAberto] = React.useState(false);
  const raiz = React.useRef<HTMLDivElement>(null);
  const { gatilho, painel, acima, aDireita } = usePosicao(aberto);
  const id = React.useId().replace(/:/g, "");
  const zona = fuso ?? fusoLocal();

  const fechar = React.useCallback((devolverFoco = true) => {
    setAberto(false);
    if (devolverFoco) gatilho.current?.focus();
  }, [gatilho]);
  usarFechamento(aberto, fechar, raiz);

  const partes = horaDeTexto(valor) ?? { hora: 0, minuto: 0, segundo: 0 };
  const escolher = (troca: Partial<typeof partes>) =>
    aoMudar(horaEmTexto({ ...partes, ...troca }, segundos));

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
          <span className={cn("truncate text-body-md tabular-nums", valor ? "text-input-text" : "text-input-placeholder")}>
            {valor ?? rotulos.vazio}
          </span>
        </span>
        <span className="shrink-0 text-caption text-muted-foreground" suppressHydrationWarning>
          {rotuloDoFuso(new Date(), zona, locale)}
        </span>
      </button>

      {aberto ? (
        <PainelFlutuante
          ref={painel}
          role="dialog"
          aria-label={rotulo}
          acima={acima}
          aDireita={aDireita}
          className="flex w-max flex-col"
        >
          <div className="flex gap-1 p-2">
            <Coluna rotulo={rotulos.horas} valores={lista(24, 1)} atual={partes.hora} aoEscolher={(h) => escolher({ hora: h })} />
            <Coluna
              rotulo={rotulos.minutos}
              valores={lista(60, passoMinutos)}
              atual={partes.minuto}
              aoEscolher={(m) => escolher({ minuto: m })}
            />
            {segundos ? (
              <Coluna
                rotulo={rotulos.segundos}
                valores={lista(60, passoSegundos)}
                atual={partes.segundo}
                aoEscolher={(s) => escolher({ segundo: s })}
              />
            ) : null}
          </div>
          <Rodape
            fuso={zona}
            rotulos={rotulos}
            locale={locale}
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
  const id = React.useId().replace(/:/g, "");
  const zona = fuso ?? fusoLocal();

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
    ? formatarNoFuso(valor, zona, locale, { dateStyle: "short", timeStyle: segundos ? "medium" : "short" })
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

      {aberto ? (
        <PainelFlutuante
          ref={painel}
          role="dialog"
          aria-label={rotulo}
          acima={acima}
          aDireita={aDireita}
          className="flex w-max flex-col"
        >
          <div className="flex items-start gap-2 p-3">
            <CalendarioDeDia
              valor={diaDoCalendario}
              aoEscolher={(d) => trocar({ ano: d.getFullYear(), mes: d.getMonth() + 1, dia: d.getDate() })}
              locale={locale}
              rotulos={rotulos}
              dataMinima={dataMinima}
              dataMaxima={dataMaxima}
            />
            <div className="flex gap-1 border-l border-border pl-2">
              <Coluna
                rotulo={rotulos.horas}
                valores={lista(24, 1)}
                atual={partes?.hora ?? 0}
                aoEscolher={(h) => trocar({ hora: h })}
              />
              <Coluna
                rotulo={rotulos.minutos}
                valores={lista(60, passoMinutos)}
                atual={partes?.minuto ?? 0}
                aoEscolher={(m) => trocar({ minuto: m })}
              />
              {segundos ? (
                <Coluna
                  rotulo={rotulos.segundos}
                  valores={lista(60, passoSegundos)}
                  atual={partes?.segundo ?? 0}
                  aoEscolher={(s) => trocar({ segundo: s })}
                />
              ) : null}
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
