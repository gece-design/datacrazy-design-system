import * as React from "react";
import { cn } from "@/lib/utils";

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
        "flex min-w-0 flex-col items-start overflow-hidden rounded-md border border-card bg-card p-[19px]",
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

/**
 * O seletor de recorte do cabeçalho.
 *
 * É um gatilho, não um menu: o componente Select do DS ainda não existe, e o
 * Figma desenha só o estado fechado. Quando o Select existir, este vira o
 * `trigger` dele. Até lá é um botão de verdade — focável, com anel visível —
 * e não uma caixa decorativa que finge ser controle.
 */
export const CardSelect = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "flex shrink-0 items-center justify-center gap-1 rounded-md border border-card bg-background px-3 py-2 text-label-lg text-muted-foreground",
      // O Figma aplica um realce interno no topo do gatilho.
      "shadow-[inset_0_4px_5px_0_rgb(106_117_129_/_0.06)]",
      "transition-colors hover:text-foreground",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      className,
    )}
    {...props}
  >
    {children}
    {/* Caret do arquivo: triângulo de 8×5 apontando para baixo. */}
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M4 5L0 0h8L4 5Z" fill="currentColor" />
    </svg>
  </button>
));
CardSelect.displayName = "CardSelect";

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

/**
 * Rosca de distribuição percentual.
 *
 * O gradiente é vertical e vale para o anel inteiro, não por fatia: o arquivo
 * não entrega paleta categórica, então duas fatias com valor saem da mesma cor.
 * Isso é limite do desenho, não do código — ver a divergência aberta na doc.
 */
export function CardDonut({
  fatias,
  destaque,
  rotulo,
}: {
  fatias: FatiaDaRosca[];
  /** O número grande no centro. Ex.: "100.0%". */
  destaque: string;
  /** A linha pequena sob ele. Ex.: o nome da fatia dominante. */
  rotulo?: string;
}) {
  const idGradiente = `rosca-${React.useId().replace(/:/g, "")}`;
  let percorrido = 0;
  return (
    <>
      <div className="flex w-full flex-col items-center overflow-hidden py-1">
        <div className="relative size-[150px] shrink-0">
          <svg viewBox="0 0 150 150" className="size-full" aria-hidden="true">
            <defs>
              <linearGradient id={idGradiente} x1="75" y1="0" x2="75" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="hsl(var(--primary))" />
                <stop offset="1" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
            {fatias
              .filter((f) => f.percentual > 0)
              .map((f) => {
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
                    stroke={`url(#${idGradiente})`}
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
                aria-hidden="true"
              />
              <p className="min-w-0 flex-1 truncate text-body-md text-muted-foreground" title={f.nome}>
                {f.nome}
              </p>
            </div>
            <p className="shrink-0 text-label-lg tabular-nums text-foreground">
              {f.percentual.toFixed(1)}%
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

/** Barras verticais por período. O eixo Y sai pronto de quem chama. */
export function CardChart({
  barras,
  eixoY,
}: {
  barras: BarraDoGrafico[];
  /** Rótulos do eixo Y, do topo para a base, já formatados. */
  eixoY: string[];
}) {
  const maximo = Math.max(...barras.map((b) => b.valor), 0);
  return (
    <div className="flex w-full min-w-0 flex-col gap-5">
      <div className="flex w-full min-w-0 items-end gap-3">
        <div
          className="flex w-[66px] shrink-0 flex-col items-end justify-between overflow-hidden text-body-sm tabular-nums text-muted-foreground"
          style={{ height: ALTURA_PLOT }}
          aria-hidden="true"
        >
          {eixoY.map((r) => (
            <p key={r}>{r}</p>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 items-end gap-[14px]" style={{ height: ALTURA_PLOT }}>
          {barras.map((b) => {
            const cheia = maximo > 0 && b.valor > 0;
            return (
              <div
                key={b.rotulo}
                className={cn(
                  "min-w-0 flex-1 rounded-t-sm",
                  cheia ? "bg-gradient-to-b from-primary to-accent" : "bg-background",
                )}
                style={{ height: cheia ? (b.valor / maximo) * ALTURA_MAXIMA : ALTURA_ZERO }}
              />
            );
          })}
        </div>
      </div>
      <div className="flex w-full min-w-0 items-start gap-3" aria-hidden="true">
        <span className="w-[66px] shrink-0" />
        <div className="flex min-w-0 flex-1 gap-[14px]">
          {barras.map((b) => (
            <p
              key={b.rotulo}
              className="min-w-0 flex-1 truncate text-center text-body-sm tabular-nums text-muted-foreground"
            >
              {b.rotulo}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
