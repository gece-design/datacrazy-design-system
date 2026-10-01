"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

/**
 * Card — espelho do component set "Card" do Figma (node 304:5313).
 *
 * O arquivo tem um eixo `Content` com três conteúdos: List, Donut e Chart.
 * Aqui isso não vira prop: a casca é uma, e cada conteúdo é um componente que
 * se encaixa nela. Um `content="chart"` obrigaria o card a conhecer dados de
 * gráfico, e casca não conhece conteúdo.
 *
 * O eixo `theme` também não vira prop — os dois temas saem dos tokens.
 */

/* p-[19px] e não 20 pela regra D14: o Figma desenha o traço POR DENTRO da
 * caixa e o CSS soma por fora, então 1 de borda + 19 = os 20 do arquivo.
 * A borda é do token `card`, a mesma cor do fundo — ela existe para ocupar
 * espaço, não para aparecer. */
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // traço visível (`border`): sem ele o card some sobre superfície clara e destoa
        // do KpiCard e da Table ao lado (cliente, 2026-09-28: "stroke nas divs"; ADR-045)
        "flex min-w-0 flex-col items-start overflow-hidden rounded-md border border-border bg-card p-[19px]",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rótulo do card. Ex.: "Dados diários". */
  title: string;
  /** Número em destaque. Sem ele, o card mostra só o rótulo (é o caso da lista). */
  value?: string;
  /** Linha que explica o recorte. Ex.: "Visualização por valor dos negócios". */
  subtitle?: string;
  /** Canto direito do cabeçalho — no arquivo é o seletor de recorte. */
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, value, subtitle, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex w-full items-start justify-between gap-4 overflow-hidden", className)}
      {...props}
    >
      <div className="flex min-w-0 flex-col items-start gap-1.5">
        <p className="w-full truncate text-h3 text-foreground" title={title}>
          {title}
        </p>
        {value ? (
          <p className="w-full truncate text-display tabular-nums text-foreground" title={value}>
            {value}
          </p>
        ) : null}
        {subtitle ? (
          <p className="w-full truncate text-body-md text-muted-foreground" title={subtitle}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  ),
);
CardHeader.displayName = "CardHeader";

/* ---------------------------------------------------------------- Lista -- */

export type LinhaDaLista = {
  /** Identificação de quem a linha mede. */
  nome: string;
  /** Segunda linha da identificação — no arquivo, o e-mail. */
  detalhe?: string;
  /** Iniciais do avatar. Sem isto, sai a primeira letra do nome. */
  inicial?: string;
  /** Métricas alinhadas à direita, na ordem em que devem aparecer. */
  metricas: { rotulo: string; valor: string }[];
};

/**
 * Lista com ranking. Cada linha traz avatar, identificação e métricas à
 * direita.
 *
 * As linhas são separadas por um traço do token `card` — a mesma cor do fundo.
 * Isso é o que o arquivo manda: a separação real é o respiro de 13px, e o
 * traço só ocupa 1px. Ver a divergência aberta na doc.
 */
export function CardList({ linhas }: { linhas: LinhaDaLista[] }) {
  return (
    <div className="flex w-full min-w-0 flex-col overflow-hidden">
      {linhas.map((l, i) => (
        <div
          key={l.nome}
          className={cn(
            "flex w-full items-center justify-between gap-4 overflow-hidden py-[13px]",
            i > 0 && "border-t border-card",
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
            <span
              className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-accent text-h4 text-primary"
              aria-hidden="true"
            >
              {l.inicial ?? l.nome.replace(/[^\p{L}\p{N}]/gu, "").charAt(0)}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden">
              <p className="w-full truncate text-h4 text-foreground" title={l.nome}>
                {l.nome}
              </p>
              {l.detalhe ? (
                <p className="w-full truncate text-body-sm text-muted-foreground" title={l.detalhe}>
                  {l.detalhe}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex shrink-0 items-start gap-[22px] text-right">
            {l.metricas.map((m) => (
              <div key={m.rotulo} className="flex flex-col items-end gap-[3px]">
                <p className="w-full text-caption text-muted-foreground">{m.rotulo}</p>
                <p className="w-full text-h4 tabular-nums text-foreground">{m.valor}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- Rosca -- */

export type FatiaDaRosca = { nome: string; percentual: number };

/* Geometria do arquivo: caixa de 150, raio externo 75 e interno 49,5. Um anel
 * desenhado com `stroke` fica no meio dos dois — raio 62,25 e espessura 25,5. */
const RAIO = 62.25;
const ESPESSURA = 25.5;
const VOLTA = 2 * Math.PI * RAIO;
/** Fatias no mesmo matiz, separadas pela opacidade: a primeira é a cheia. */
const OPACIDADE_DA_FATIA = [1, 0.6, 0.35, 0.2];

/**
 * Rosca de distribuição percentual.
 *
 * Cor chapada em `primary`: o gradiente vertical do arquivo saiu (cliente,
 * 2026-09-28; regra A3). O arquivo não entrega paleta categórica, então as
 * fatias se distinguem pela opacidade, da maior para a menor (100 · 60 · 35 ·
 * 20%) — um matiz só, sem inventar cor.
 */
export function CardDonut({
  fatias,
  destaque,
  rotulo,
  formatar = (percentual) => `${percentual.toFixed(1)}%`,
}: {
  fatias: FatiaDaRosca[];
  /** Como o percentual aparece na legenda. Padrão: uma casa e ponto ("46.0%"); passe o formato do idioma. */
  formatar?: (percentual: number) => string;
  /** O número grande no centro. Ex.: "100.0%". */
  destaque: string;
  /** A linha pequena sob ele. Ex.: o nome da fatia dominante. */
  rotulo?: string;
}) {
  let percorrido = 0;
  // A legenda repete a intensidade da fatia: é o que liga o nome ao arco.
  const comValor = fatias.filter((f) => f.percentual > 0);
  const opacidadeDe = (f: FatiaDaRosca) =>
    OPACIDADE_DA_FATIA[Math.min(comValor.indexOf(f), OPACIDADE_DA_FATIA.length - 1)];
  return (
    <>
      <div className="flex w-full flex-col items-center overflow-hidden py-1">
        <div className="relative size-[150px] shrink-0">
          <svg viewBox="0 0 150 150" className="size-full" aria-hidden="true">
            {comValor.map((f) => {
                const arco = (f.percentual / 100) * VOLTA;
                const deslocamento = -(percorrido / 100) * VOLTA;
                percorrido += f.percentual;
                return (
                  <circle
                    key={f.nome}
                    cx="75"
                    cy="75"
                    r={RAIO}
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity={opacidadeDe(f)}
                    className="text-primary"
                    strokeWidth={ESPESSURA}
                    strokeDasharray={`${arco} ${VOLTA - arco}`}
                    strokeDashoffset={deslocamento}
                    transform="rotate(-90 75 75)"
                  />
                );
              })}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-h1 tabular-nums text-foreground">{destaque}</p>
            {rotulo ? <p className="text-caption text-muted-foreground">{rotulo}</p> : null}
          </div>
        </div>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-[11px] overflow-hidden">
        {fatias.map((f) => (
          <div key={f.nome} className="flex w-full items-center justify-between gap-4 overflow-hidden">
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
              {/* Ponto cheio quando a fatia tem valor; apagado quando é zero. */}
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  f.percentual > 0 ? "bg-primary" : "bg-subtle-foreground",
                )}
                style={f.percentual > 0 ? { opacity: opacidadeDe(f) } : undefined}
                aria-hidden="true"
              />
              <p className="min-w-0 flex-1 truncate text-body-md text-muted-foreground" title={f.nome}>
                {f.nome}
              </p>
            </div>
            <p className="shrink-0 text-label-lg tabular-nums text-foreground">
              {formatar(f.percentual)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

/* --------------------------------------------------------------- Barras -- */

export type BarraDoGrafico = { rotulo: string; valor: number };

/* A barra cheia mede 218 num plot de 224 — os 6 que sobram são o respiro do
 * topo. Barra sem valor não some: vira um traço de 3px, que é o que mostra
 * que o dia existe e está zerado. */
const ALTURA_PLOT = 224;
const ALTURA_MAXIMA = 218;
const ALTURA_ZERO = 3;
/** Espaço que um rótulo do eixo de baixo precisa para aparecer inteiro ("28/09", "Sem 38"). */
const LARGURA_DO_ROTULO = 48;

/**
 * Barras verticais por período, em cor chapada: o gradiente primary → accent do
 * arquivo saiu ("não encaixa com o resto", cliente, 2026-09-28; regra A3). O
 * valor aparece ao passar o cursor (regra A7); sem `eixoY`, o gráfico fica
 * minimalista — só barras e rótulos embaixo.
 */
export function CardChart({
  barras,
  eixoY,
  formatar = String,
}: {
  barras: BarraDoGrafico[];
  /** Rótulos do eixo Y, do topo para a base, já formatados. Sem eles, o gráfico não tem eixo (A7). */
  eixoY?: string[];
  /** Como o valor aparece no balão da barra. Ex.: `(v) => moeda(v)`. Padrão: o número. */
  formatar?: (valor: number) => string;
}) {
  const maximo = Math.max(...barras.map((b) => b.valor), 0);
  /* Rótulo cortado em "0…" não diz nada (E1). Quando não cabem todos — o
     card numa coluna de celular —, aparece um a cada `passo`, inteiro; os
     outros somem, e a barra continua dizendo o dela no balão. */
  const fileira = React.useRef<HTMLDivElement>(null);
  const [passo, setPasso] = React.useState(1);
  React.useEffect(() => {
    const el = fileira.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const medir = () => setPasso(Math.max(1, Math.ceil((barras.length * LARGURA_DO_ROTULO) / (el.clientWidth || 1))));
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, [barras.length]);
  return (
    <div className="flex w-full min-w-0 flex-col gap-5">
      <div className="flex w-full min-w-0 items-end gap-3">
        {eixoY ? (
          <div
            className="flex w-[66px] shrink-0 flex-col items-end justify-between overflow-hidden text-body-sm tabular-nums text-muted-foreground"
            style={{ height: ALTURA_PLOT }}
            aria-hidden="true"
          >
            {eixoY.map((r) => (
              <p key={r}>{r}</p>
            ))}
          </div>
        ) : null}
        <div className="flex min-w-0 flex-1 items-end gap-[14px]" style={{ height: ALTURA_PLOT }}>
          {barras.map((b) => {
            const cheia = maximo > 0 && b.valor > 0;
            return (
              <Tooltip key={b.rotulo} content={`${b.rotulo} · ${formatar(b.valor)}`} delay={0}>
                <div
                  role="img"
                  aria-label={`${b.rotulo}: ${formatar(b.valor)}`}
                  className={cn("min-w-0 flex-1 rounded-t-sm transition-colors", cheia ? "bg-primary hover:bg-primary-hover" : "bg-background")}
                  style={{ height: cheia ? (b.valor / maximo) * ALTURA_MAXIMA : ALTURA_ZERO }}
                />
              </Tooltip>
            );
          })}
        </div>
      </div>
      <div className="flex w-full min-w-0 items-start gap-3" aria-hidden="true">
        {eixoY ? <span className="w-[66px] shrink-0" /> : null}
        <div ref={fileira} className="flex min-w-0 flex-1 gap-[14px]">
          {barras.map((b, i) => (
            // a caixa do rótulo é a largura da barra; o texto, inteiro, pode passar dela para os dois lados
            <p key={b.rotulo} className="flex min-w-0 flex-1 justify-center text-body-sm tabular-nums text-muted-foreground">
              {i % passo === 0 ? <span className="whitespace-nowrap">{b.rotulo}</span> : null}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
