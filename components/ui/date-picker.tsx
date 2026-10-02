"use client";

import * as React from "react";
import { CalendarBlank, CaretDown, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  chaveDoDia,
  inicioDoMes,
  somarMeses,
  somarDias,
  mesmoMes,
  primeiroDiaDaSemana,
  maiuscula,
  celulasDoMes,
  textoDeIntl,
} from "@/lib/datas";
import { usePosicao } from "@/lib/use-posicao";
import { useCliqueFora } from "@/lib/use-clique-fora";
import { useSaida } from "@/lib/use-saida";
import { PainelFlutuante } from "@/components/ui/popover";

import { alturaCompacta, desabilitado, foco, focoInterno, hoverDeApoio, superficieDeApoio } from "@/lib/estados";
/* ---------------------------------------------------------------------------
   Date Range Picker — seleção de período com dois meses e atalhos.

   Regra R3 (i18n) é o eixo do componente: nome de mês, nome de dia, ordem
   dd/mm e PRIMEIRO DIA DA SEMANA mudam entre en, es e pt-br. Nada disso é
   escrito aqui — tudo sai de `Intl` a partir do `locale`. Formatação manual de
   data neste componente é bug garantido nas outras duas línguas.

   Texto de interface (rótulos, atalhos, botões) NÃO mora no componente: entra
   por `rotulos` e `atalhos`, que no CRM vêm do next-intl.

   Dívida registrada: a superfície flutuante é local, não o `Popover` do DS —
   ele ainda não existe (roadmap, lote de overlays). Quando existir, o painel
   passa a ser filho dele e este arquivo perde o posicionamento e o clique-fora.
--------------------------------------------------------------------------- */

export type IntervaloDeDatas = { inicio: Date | null; fim: Date | null };

/** Atalho da coluna da esquerda. O rótulo vem traduzido de fora. */
export type AtalhoDeIntervalo = {
  id: string;
  rotulo: string;
  intervalo: (hoje: Date) => IntervaloDeDatas;
};

export type RotulosDoDatePicker = {
  /** Texto do gatilho quando não há período escolhido. */
  vazio: string;
  /** Título da coluna de atalhos. */
  atalhos: string;
  /** aria-label do seletor de mês. */
  mes: string;
  /** aria-label do seletor de ano. */
  ano: string;
  mesAnterior: string;
  proximoMes: string;
  aplicar: string;
  cancelar: string;
};

export interface DateRangePickerProps {
  valor: IntervaloDeDatas;
  onValorChange: (valor: IntervaloDeDatas) => void;
  rotulos: RotulosDoDatePicker;
  /** BCP-47. No CRM é o locale ativo do next-intl, nunca um literal. */
  locale: string;
  atalhos?: AtalhoDeIntervalo[];
  dataMinima?: Date;
  dataMaxima?: Date;
  disabled?: boolean;
  className?: string;  /** Quantos meses o painel mostra lado a lado. Padrão 2; 1 para um filtro curto ou um painel estreito. */
  meses?: 1 | 2;
}

/* --- datas: comparação por dia, sem hora e sem fuso — lib/datas.ts (D21) --- */

/* --- Intl: tudo que é palavra ou ordem sai daqui --------------------------- */

/** Rótulo do gatilho. `formatRange` é quem sabe encurtar "27 de ago. – 3 de
 *  set. de 2026" sem repetir o ano; concatenar duas datas à mão devolveria a
 *  string errada em pelo menos uma das três línguas. */
function formatarIntervalo(v: IntervaloDeDatas, locale: string, vazio: string) {
  if (!v.inicio) return vazio;
  const f = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" });
  if (!v.fim) return f.format(v.inicio);
  try {
    return f.formatRange(v.inicio, v.fim);
  } catch {
    return `${f.format(v.inicio)} – ${f.format(v.fim)}`;
  }
}

/* --- grade de um mês ------------------------------------------------------ */

type GradeProps = {
  mes: Date;
  locale: string;
  primeiroDia: number;
  nomesDosDias: { curto: string; longo: string }[];
  rascunho: IntervaloDeDatas;
  previa: Date | null;
  foco: Date;
  hoje: Date;
  estaDesabilitada: (d: Date) => boolean;
  onEscolher: (d: Date) => void;
  onPrevia: (d: Date | null) => void;
};

function GradeDoMes({
  mes, locale, primeiroDia, nomesDosDias, rascunho, previa, foco, hoje,
  estaDesabilitada, onEscolher, onPrevia,
}: GradeProps) {
  const celulas = celulasDoMes(mes, primeiroDia);
  const semanas = Array.from({ length: celulas.length / 7 }, (_, i) => celulas.slice(i * 7, i * 7 + 7));

  // Extremos do intervalo em desenho: com só o início escolhido, o dia sob o
  // cursor faz as vezes de fim — é o que dá a prévia do arrasto sem arrastar.
  const a = rascunho.inicio ? chaveDoDia(rascunho.inicio) : null;
  const b = rascunho.fim ? chaveDoDia(rascunho.fim) : previa ? chaveDoDia(previa) : null;
  let menor = a;
  let maior = b;
  if (menor !== null && maior !== null && maior < menor) [menor, maior] = [maior, menor];

  const diaFormatado = new Intl.DateTimeFormat(locale, { dateStyle: "long" });
  const rotuloDoMes = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(mes);

  return (
    <table role="grid" aria-label={rotuloDoMes} className="border-separate border-spacing-0">
      <thead>
        <tr>
          {nomesDosDias.map((d) => (
            <th key={d.longo} scope="col" abbr={d.longo} className="h-8 w-8 font-normal">
              <span className="text-label-lg text-muted-foreground">{d.curto}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {semanas.map((semana, i) => (
          <tr key={i}>
            {semana.map(({ data, doMes }) => {
              const k = chaveDoDia(data);

              if (!doMes) {
                // Dia de outro mês: visível para fechar a grade, nunca clicável.
                // Com dois meses lado a lado ele apareceria duas vezes, e o
                // mesmo dia em dois lugares clicáveis é ambiguidade, não ajuda.
                return (
                  <td key={k} className="p-0">
                    <span
                      aria-hidden="true"
                      className="grid h-8 w-8 place-items-center text-body-lg tabular-nums text-subtle-foreground"
                    >
                      {data.getDate()}
                    </span>
                  </td>
                );
              }

              const extremo = k === a || k === b;
              const dentro = menor !== null && maior !== null && k > menor && k < maior;
              const naFaixa = maior !== null && menor !== null && maior !== menor && (extremo || dentro);
              const desabilitada = estaDesabilitada(data);
              const ehHoje = k === chaveDoDia(hoje);

              return (
                <td
                  key={k}
                  aria-selected={extremo}
                  className={cn(
                    "p-0",
                    naFaixa && "bg-accent",
                    naFaixa && k === menor && "rounded-l-md",
                    naFaixa && k === maior && "rounded-r-md"
                  )}
                >
                  <button
                    type="button"
                    data-dia={k}
                    aria-current={ehHoje ? "date" : undefined}
                    aria-label={diaFormatado.format(data)}
                    disabled={desabilitada}
                    tabIndex={k === chaveDoDia(foco) ? 0 : -1}
                    onClick={() => onEscolher(data)}
                    onPointerEnter={() => onPrevia(data)}
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-md text-body-lg tabular-nums outline-none transition-colors",
                      `${focoInterno}`,
                      `${desabilitado}`,
                      extremo
                        ? "bg-primary text-primary-foreground enabled:hover:bg-primary-hover"
                        : dentro
                          ? "text-accent-foreground"
                          : "text-foreground enabled:hover:bg-accent",
                      // "hoje" não está desenhado no rascunho: é estado derivado
                      // por regra (exceção E-01), e o sinal é cor, não moldura.
                      ehHoje && !extremo && "text-primary"
                    )}
                  >
                    {data.getDate()}
                  </button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* --- cabeçalho de um mês: mês e ano como seletores ------------------------ */

type CabecalhoProps = {
  mes: Date;
  nomesDosMeses: string[];
  anos: number[];
  /** Só os dois rótulos dos seletores — o calendário de dia não tem o resto. */
  rotulos: Pick<RotulosDoDatePicker, "mes" | "ano">;
  onMudarMes: (mes: Date) => void;
};

function CabecalhoDoMes({ mes, nomesDosMeses, anos, rotulos, onMudarMes }: CabecalhoProps) {
  const seletor =
    "appearance-none rounded-md bg-transparent py-0.5 pl-1.5 pr-5 text-h4 text-foreground outline-none " +
    "transition-colors enabled:hover:bg-accent " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring";

  return (
    <div className="flex flex-1 items-center justify-center gap-1">
      <div className="relative inline-flex items-center">
        <select
          aria-label={rotulos.mes}
          value={mes.getMonth()}
          onChange={(e) => onMudarMes(new Date(mes.getFullYear(), Number(e.target.value), 1))}
          className={seletor}
        >
          {nomesDosMeses.map((nome, i) => (
            <option key={nome} value={i}>{nome}</option>
          ))}
        </select>
        <CaretDown size={12} weight="bold" className="pointer-events-none absolute right-1.5 text-muted-foreground" />
      </div>

      <div className="relative inline-flex items-center">
        <select
          aria-label={rotulos.ano}
          value={mes.getFullYear()}
          onChange={(e) => onMudarMes(new Date(Number(e.target.value), mes.getMonth(), 1))}
          className={cn(seletor, "tabular-nums")}
        >
          {anos.map((ano) => (
            <option key={ano} value={ano}>{ano}</option>
          ))}
        </select>
        <CaretDown size={12} weight="bold" className="pointer-events-none absolute right-1.5 text-muted-foreground" />
      </div>
    </div>
  );
}

/* --- componente ----------------------------------------------------------- */

/**
 * O gatilho — "Data button" do Figma (node 471:2809). Não é o Button
 * secundário: o arquivo desenha um controle próprio, de 29px, sem traço, com
 * `text/body-md` e DOIS estados de repouso — Default (`card` +
 * `muted-foreground`) e Active (`accent` + `primary`). Active é o painel
 * aberto, então quem manda nele é `aberto`. Medidas: px 8 · py 6 · gap 4 ·
 * raio 6 (`radius/md`). O ícone sai em currentColor junto com o texto. É o
 * mesmo do período e do `DatePicker` de uma data.
 */
const GatilhoDeData = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { aberto: boolean }>(
  ({ aberto, className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={aberto}
      className={cn(
        // h-8: o arquivo desenha 29, mas ele fica ao lado de botões de 32 — "no
        // mesmo tamanho dos outros" (humano, 2026-09-24, AUD-122). No topo da
        // tela desce para 28 com eles (`alturaCompacta`).
        "inline-flex h-8 max-w-full items-center gap-1 rounded-md px-2 text-body-md",
        alturaCompacta,
        "outline-none transition-colors",
        `${foco}`,
        `${desabilitado} [&_svg]:shrink-0`,
        aberto
          ? "bg-accent text-primary"
          // hover derivado (E-01): empresta a superfície do Active, que é
          // token que já existe, e mantém o texto em `muted-foreground`.
          // o mesmo do Button `tertiary`: texto em `foreground`, hover branco a 50%
          : cn(superficieDeApoio, "text-foreground", hoverDeApoio),
        className,
      )}
      {...props}
    >
      <CalendarBlank size={16} weight="regular" />
      <span className="truncate" suppressHydrationWarning>
        {children}
      </span>
    </button>
  ),
);
GatilhoDeData.displayName = "GatilhoDeData";

export function DateRangePicker({
  valor, onValorChange, rotulos, locale, atalhos = [],
  dataMinima, dataMaxima, disabled, className, meses: quantosMeses = 2,
}: DateRangePickerProps) {
  const [aberto, setAberto] = React.useState(false);
  const [rascunho, setRascunho] = React.useState<IntervaloDeDatas>(valor);
  const [previa, setPrevia] = React.useState<Date | null>(null);
  // lado e alinhamento medidos (lib/use-posicao.ts), com os refs do gatilho e do painel
  const { gatilho, painel, acima, aDireita } = usePosicao(aberto);
  const { saindo, visivel } = useSaida(aberto);

  const hoje = React.useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const [mesBase, setMesBase] = React.useState(() => inicioDoMes(valor.inicio ?? hoje));
  const [foco, setFoco] = React.useState(() => valor.inicio ?? hoje);

  const raiz = React.useRef<HTMLDivElement>(null);
  const grades = React.useRef<HTMLDivElement>(null);
  const moverFoco = React.useRef(false);

  const primeiroDia = React.useMemo(() => primeiroDiaDaSemana(locale), [locale]);

  const nomesDosDias = React.useMemo(() => {
    const curto = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
    const longo = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" });
    // 2024-01-07 (UTC) é um domingo — âncora para varrer a semana inteira.
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.UTC(2024, 0, 7 + ((primeiroDia + i) % 7)));
      return { curto: curto.format(d).replace(/\.$/, ""), longo: longo.format(d) };
    });
  }, [locale, primeiroDia]);

  const nomesDosMeses = React.useMemo(() => {
    const f = new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" });
    return Array.from({ length: 12 }, (_, i) => maiuscula(f.format(new Date(Date.UTC(2024, i, 1))), locale));
  }, [locale]);

  const anos = React.useMemo(() => {
    const primeiro = dataMinima ? dataMinima.getFullYear() : hoje.getFullYear() - 10;
    const ultimo = dataMaxima ? dataMaxima.getFullYear() : hoje.getFullYear() + 10;
    return Array.from({ length: Math.max(1, ultimo - primeiro + 1) }, (_, i) => primeiro + i);
  }, [dataMinima, dataMaxima, hoje]);

  const estaDesabilitada = React.useCallback(
    (d: Date) => {
      const k = chaveDoDia(d);
      if (dataMinima && k < chaveDoDia(dataMinima)) return true;
      if (dataMaxima && k > chaveDoDia(dataMaxima)) return true;
      return false;
    },
    [dataMinima, dataMaxima]
  );

  function abrir() {
    setRascunho(valor);
    setPrevia(null);
    setMesBase(inicioDoMes(valor.inicio ?? hoje));
    setFoco(valor.inicio ?? hoje);
    setAberto(true);
  }

  const fechar = React.useCallback((devolverFoco = true) => {
    setAberto(false);
    setPrevia(null);
    if (devolverFoco) gatilho.current?.focus();
  }, []);

  // Clique fora (lib/use-clique-fora.ts) e Escape. O painel é uma camada: sai por onde entrou.
  useCliqueFora(aberto, [raiz], () => fechar(false));
  React.useEffect(() => {
    if (!aberto) return;
    function naTecla(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        fechar();
      }
    }
    document.addEventListener("keydown", naTecla);
    return () => document.removeEventListener("keydown", naTecla);
  }, [aberto, fechar]);

  // Foco itinerante: um dia por vez carrega tabIndex 0, e o teclado o move.
  React.useEffect(() => {
    if (!aberto || !moverFoco.current) return;
    moverFoco.current = false;
    const alvo = grades.current?.querySelector<HTMLElement>(`[data-dia="${chaveDoDia(foco)}"]`);
    alvo?.focus();
  }, [aberto, foco, mesBase]);

  /** Muda o par de meses visível e mantém o foco itinerante dentro dele —
   *  senão a grade fica sem nenhum dia com tabIndex 0 e o Tab a atravessa. */
  function mudarMesBase(m: Date) {
    const base = inicioDoMes(m);
    setMesBase(base);
    const segundo = quantosMeses === 2 ? somarMeses(base, 1) : base;
    if (!mesmoMes(foco, base) && !mesmoMes(foco, segundo)) {
      const ultimo = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
      setFoco(new Date(base.getFullYear(), base.getMonth(), Math.min(foco.getDate(), ultimo)));
    }
  }

  function irPara(d: Date) {
    moverFoco.current = true;
    setFoco(d);
    const segundo = quantosMeses === 2 ? somarMeses(mesBase, 1) : mesBase;
    if (!mesmoMes(d, mesBase) && !mesmoMes(d, segundo)) {
      setMesBase(quantosMeses === 1 || chaveDoDia(d) < chaveDoDia(mesBase) ? inicioDoMes(d) : somarMeses(inicioDoMes(d), -1));
    }
  }

  function noTeclado(e: React.KeyboardEvent) {
    const passo: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in passo) {
      e.preventDefault();
      irPara(somarDias(foco, passo[e.key]));
      return;
    }
    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const desloc = (foco.getDay() - primeiroDia + 7) % 7;
      irPara(somarDias(foco, e.key === "Home" ? -desloc : 6 - desloc));
      return;
    }
    if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      const n = e.key === "PageUp" ? -1 : 1;
      const alvo = new Date(foco.getFullYear(), foco.getMonth() + n, 1);
      const ultimo = new Date(alvo.getFullYear(), alvo.getMonth() + 1, 0).getDate();
      irPara(new Date(alvo.getFullYear(), alvo.getMonth(), Math.min(foco.getDate(), ultimo)));
    }
  }

  function escolher(d: Date) {
    setFoco(d);
    // Primeiro clique abre o intervalo; segundo fecha. Clicar antes do início
    // recomeça em vez de inverter — inverter faria o usuário perder o ponto de
    // partida sem ter pedido.
    if (!rascunho.inicio || rascunho.fim || chaveDoDia(d) < chaveDoDia(rascunho.inicio)) {
      setRascunho({ inicio: d, fim: null });
    } else {
      setRascunho({ inicio: rascunho.inicio, fim: d });
    }
  }

  function aplicarAtalho(atalho: AtalhoDeIntervalo) {
    const intervalo = atalho.intervalo(hoje);
    setRascunho(intervalo);
    setPrevia(null);
    if (intervalo.inicio) {
      setFoco(intervalo.inicio);
      setMesBase(inicioDoMes(intervalo.fim ?? intervalo.inicio));
    }
  }

  const atalhoAtivo = atalhos.find((a) => {
    const i = a.intervalo(hoje);
    return (
      !!rascunho.inicio && !!i.inicio &&
      chaveDoDia(i.inicio) === chaveDoDia(rascunho.inicio) &&
      (i.fim ? chaveDoDia(i.fim) : null) === (rascunho.fim ? chaveDoDia(rascunho.fim) : null)
    );
  });

  // Só há prévia entre o primeiro e o segundo clique. Fora disso, passar o
  // ponteiro pela grade não pinta nada — e não redesenha nada.
  const escolhendoOFim = Boolean(rascunho.inicio) && !rascunho.fim;
  const meses = quantosMeses === 2 ? [mesBase, somarMeses(mesBase, 1)] : [mesBase];
  const rotuloDoGatilho = formatarIntervalo(valor, locale, rotulos.vazio);

  return (
    <div ref={raiz} className={cn("relative inline-block", className)}>
      {/* Gatilho — "Data button" do Figma (node 471:2809). Não é o Button
          secundário: o arquivo desenha um controle próprio, de 29px, sem traço,
          com `text/body-md` e DOIS estados de repouso — Default (`card` +
          `muted-foreground`) e Active (`accent` + `primary`). Active é o painel
          aberto, então quem manda nele é `aberto`, não uma prop.
          Medidas do arquivo: px 8 · py 6 · gap 4 · raio 6 (`radius/md`).
          O ícone não tem cor própria: sai em currentColor junto com o texto —
          no arquivo os dois viram `primary` juntos quando o painel abre. */}
      <GatilhoDeData ref={gatilho} aberto={aberto} disabled={disabled} onClick={() => (aberto ? fechar() : abrir())}>
        {/* O ICU do Node e o do navegador não separam o intervalo igual: um usa
            espaço fino (U+2009) em volta do travessão, o outro usa espaço
            comum. Mesma data, mesmo locale, dois bytes diferentes — e o React
            acusa erro de hidratação em toda página renderizada no servidor.
            O gatilho suprime o aviso. */}
        {rotuloDoGatilho}
      </GatilhoDeData>

      {/* casca de painel flutuante (D22): overlay-* e shadow-lg, como os outros — decisão do humano, gate B4 */}
      {visivel && (
        <PainelFlutuante ref={painel} role="dialog" aria-label={rotuloDoGatilho} acima={acima} aDireita={aDireita} saindo={saindo} className="flex w-max">
          {atalhos.length > 0 && (
            <div className="hidden w-44 shrink-0 border-r border-border p-4 sm:block">
              <p className="px-2 pb-1 text-h4 text-foreground">{rotulos.atalhos}</p>
              <ul className="space-y-0.5">
                {atalhos.map((atalho) => (
                  <li key={atalho.id}>
                    <button
                      type="button"
                      aria-pressed={atalhoAtivo?.id === atalho.id}
                      onClick={() => aplicarAtalho(atalho)}
                      className={cn(
                        "w-full rounded-md px-2 py-1.5 text-left text-body-lg outline-none transition-colors",
                        `${focoInterno}`,
                        atalhoAtivo?.id === atalho.id
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground enabled:hover:bg-accent"
                      )}
                    >
                      {atalho.rotulo}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* p-4 e vão de 8 entre as grades: o painel respira (reunião de 2026-09-18) */}
          <div className="flex flex-col p-4">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                aria-label={rotulos.mesAnterior}
                onClick={() => mudarMesBase(somarMeses(mesBase, -1))}
                className="px-1.5"
              >
                <CaretLeft size={14} weight="bold" />
              </Button>

              <CabecalhoDoMes
                mes={meses[0]}
                nomesDosMeses={nomesDosMeses}
                anos={anos}
                rotulos={rotulos}
                onMudarMes={mudarMesBase}
              />
              {meses[1] ? (
                <div className="hidden flex-1 sm:flex">
                  <CabecalhoDoMes
                    mes={meses[1]}
                    nomesDosMeses={nomesDosMeses}
                    anos={anos}
                    rotulos={rotulos}
                    onMudarMes={(m) => mudarMesBase(somarMeses(m, -1))}
                  />
                </div>
              ) : null}

              <Button
                variant="ghost"
                size="sm"
                aria-label={rotulos.proximoMes}
                onClick={() => mudarMesBase(somarMeses(mesBase, 1))}
                className="px-1.5"
              >
                <CaretRight size={14} weight="bold" />
              </Button>
            </div>

            <div
              ref={grades}
              onKeyDown={noTeclado}
              onPointerLeave={() => setPrevia(null)}
              className="mt-3 flex gap-8"
            >
              {meses.map((mes, i) => (
                <div key={mes.toISOString()} className={cn(i === 1 && "hidden sm:block")}>
                  <GradeDoMes
                    mes={mes}
                    locale={locale}
                    primeiroDia={primeiroDia}
                    nomesDosDias={nomesDosDias}
                    rascunho={rascunho}
                    previa={escolhendoOFim ? previa : null}
                    foco={foco}
                    hoje={hoje}
                    estaDesabilitada={estaDesabilitada}
                    onEscolher={escolher}
                    onPrevia={(d) => escolhendoOFim && setPrevia(d)}
                  />
                </div>
              ))}
            </div>

            <div className="-mx-4 mt-4 flex items-center justify-end gap-2 border-t border-border px-4 pt-4">
              <Button variant="ghost" size="sm" onClick={() => fechar()}>
                {rotulos.cancelar}
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!rascunho.inicio}
                onClick={() => {
                  onValorChange(rascunho);
                  fechar();
                }}
              >
                {rotulos.aplicar}
              </Button>
            </div>
          </div>
        </PainelFlutuante>
      )}
    </div>
  );
}

/* --- calendário de um dia ------------------------------------------------- */

export type RotulosDoCalendario = Pick<RotulosDoDatePicker, "mes" | "ano" | "mesAnterior" | "proximoMes">;

export interface CalendarioDeDiaProps {
  valor: Date | null;
  aoEscolher: (dia: Date) => void;
  /** BCP-47, como no DateRangePicker. */
  locale: string;
  rotulos: RotulosDoCalendario;
  dataMinima?: Date;
  dataMaxima?: Date;
  className?: string;
}

/**
 * Um mês, um dia escolhido — a mesma grade do intervalo, sem o segundo clique.
 *
 * Existe para o `DateTimePicker` não redesenhar calendário: aqui a grade, o
 * cabeçalho, o foco itinerante e as teclas são os mesmos do período.
 */
export function CalendarioDeDia({
  valor, aoEscolher, locale, rotulos, dataMinima, dataMaxima, className,
}: CalendarioDeDiaProps) {
  const hoje = React.useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);
  const [mes, setMes] = React.useState(() => inicioDoMes(valor ?? hoje));
  const [foco, setFoco] = React.useState<Date>(valor ?? hoje);
  const grade = React.useRef<HTMLDivElement>(null);
  const moverFoco = React.useRef(false);

  const primeiroDia = React.useMemo(() => primeiroDiaDaSemana(locale), [locale]);

  const nomesDosDias = React.useMemo(() => {
    const curto = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
    const longo = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" });
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.UTC(2024, 0, 7 + ((primeiroDia + i) % 7)));
      return { curto: curto.format(d).replace(/\.$/, ""), longo: longo.format(d) };
    });
  }, [locale, primeiroDia]);

  const nomesDosMeses = React.useMemo(() => {
    const f = new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" });
    return Array.from({ length: 12 }, (_, i) => maiuscula(f.format(new Date(Date.UTC(2024, i, 1))), locale));
  }, [locale]);

  const anos = React.useMemo(() => {
    const primeiro = dataMinima ? dataMinima.getFullYear() : hoje.getFullYear() - 10;
    const ultimo = dataMaxima ? dataMaxima.getFullYear() : hoje.getFullYear() + 10;
    return Array.from({ length: Math.max(1, ultimo - primeiro + 1) }, (_, i) => primeiro + i);
  }, [dataMinima, dataMaxima, hoje]);

  const estaDesabilitada = React.useCallback(
    (d: Date) => {
      const k = chaveDoDia(d);
      if (dataMinima && k < chaveDoDia(dataMinima)) return true;
      if (dataMaxima && k > chaveDoDia(dataMaxima)) return true;
      return false;
    },
    [dataMinima, dataMaxima]
  );

  React.useEffect(() => {
    if (!moverFoco.current) return;
    moverFoco.current = false;
    grade.current?.querySelector<HTMLElement>(`[data-dia="${chaveDoDia(foco)}"]`)?.focus();
  }, [foco, mes]);

  function irPara(d: Date) {
    moverFoco.current = true;
    setFoco(d);
    if (!mesmoMes(d, mes)) setMes(inicioDoMes(d));
  }

  function noTeclado(e: React.KeyboardEvent) {
    const passo: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in passo) {
      e.preventDefault();
      irPara(somarDias(foco, passo[e.key]));
      return;
    }
    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const desloc = (foco.getDay() - primeiroDia + 7) % 7;
      irPara(somarDias(foco, e.key === "Home" ? -desloc : 6 - desloc));
      return;
    }
    if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      const n = e.key === "PageUp" ? -1 : 1;
      const alvo = new Date(foco.getFullYear(), foco.getMonth() + n, 1);
      const ultimo = new Date(alvo.getFullYear(), alvo.getMonth() + 1, 0).getDate();
      irPara(new Date(alvo.getFullYear(), alvo.getMonth(), Math.min(foco.getDate(), ultimo)));
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          aria-label={rotulos.mesAnterior}
          onClick={() => setMes(somarMeses(mes, -1))}
          className="px-1.5"
        >
          <CaretLeft size={14} weight="bold" />
        </Button>
        <CabecalhoDoMes mes={mes} nomesDosMeses={nomesDosMeses} anos={anos} rotulos={rotulos} onMudarMes={setMes} />
        <Button
          variant="ghost"
          size="sm"
          aria-label={rotulos.proximoMes}
          onClick={() => setMes(somarMeses(mes, 1))}
          className="px-1.5"
        >
          <CaretRight size={14} weight="bold" />
        </Button>
      </div>
      <div ref={grade} onKeyDown={noTeclado}>
        <GradeDoMes
          mes={mes}
          locale={locale}
          primeiroDia={primeiroDia}
          nomesDosDias={nomesDosDias}
          // um dia só: início e fim no mesmo lugar, sem prévia de arrasto
          rascunho={{ inicio: valor, fim: valor }}
          previa={null}
          foco={foco}
          hoje={hoje}
          estaDesabilitada={estaDesabilitada}
          onEscolher={(d) => {
            setFoco(d);
            aoEscolher(d);
          }}
          onPrevia={() => undefined}
        />
      </div>
    </div>
  );
}

/* --- uma data ------------------------------------------------------------ */

export type RotulosDoDatePickerSimples = Pick<RotulosDoDatePicker, "vazio" | "mes" | "ano" | "mesAnterior" | "proximoMes"> & {
  /** O botão que escolhe o dia de hoje. */
  hoje: string;
  limpar: string;
};

export interface DatePickerProps {
  valor: Date | null;
  aoMudar: (valor: Date | null) => void;
  /** BCP-47, como no DateRangePicker. */
  locale: string;
  rotulos: RotulosDoDatePickerSimples;
  dataMinima?: Date;
  dataMaxima?: Date;
  disabled?: boolean;
  className?: string;
}

/**
 * Uma data, um calendário: o mesmo gatilho do período, um mês só e o dia
 * escolhido fecha o painel na hora — sem Aplicar, porque não há segundo
 * clique (reunião de 2026-09-18: "cenário onde abre apenas uma data").
 * Hoje e Limpar no rodapé.
 */
export function DatePicker({ valor, aoMudar, locale, rotulos, dataMinima, dataMaxima, disabled, className }: DatePickerProps) {
  const [aberto, setAberto] = React.useState(false);
  const raiz = React.useRef<HTMLDivElement>(null);
  const { gatilho, painel, acima, aDireita } = usePosicao(aberto);
  const { saindo, visivel } = useSaida(aberto);

  const fechar = React.useCallback((devolverFoco = true) => {
    setAberto(false);
    if (devolverFoco) gatilho.current?.focus();
  }, [gatilho]);
  useCliqueFora(aberto, [raiz], () => fechar(false));
  React.useEffect(() => {
    if (!aberto) return;
    function naTecla(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        fechar();
      }
    }
    document.addEventListener("keydown", naTecla);
    return () => document.removeEventListener("keydown", naTecla);
  }, [aberto, fechar]);

  const texto = valor ? textoDeIntl(new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(valor)) : rotulos.vazio;
  const hoje = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  return (
    <div ref={raiz} className={cn("relative inline-block", className)}>
      <GatilhoDeData ref={gatilho} aberto={aberto} disabled={disabled} onClick={() => (aberto ? fechar() : setAberto(true))}>
        {texto}
      </GatilhoDeData>
      {visivel && (
        <PainelFlutuante ref={painel} role="dialog" aria-label={texto} acima={acima} aDireita={aDireita} saindo={saindo} className="flex w-max flex-col p-4">
          <CalendarioDeDia
            valor={valor}
            aoEscolher={(d) => {
              aoMudar(d);
              fechar();
            }}
            locale={locale}
            rotulos={rotulos}
            dataMinima={dataMinima}
            dataMaxima={dataMaxima}
          />
          <div className="-mx-4 mt-4 flex items-center justify-end gap-2 border-t border-border px-4 pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                aoMudar(null);
                fechar();
              }}
            >
              {rotulos.limpar}
            </Button>
            <Button
              variant="soft"
              size="sm"
              onClick={() => {
                aoMudar(hoje());
                fechar();
              }}
            >
              {rotulos.hoje}
            </Button>
          </div>
        </PainelFlutuante>
      )}
    </div>
  );
}
