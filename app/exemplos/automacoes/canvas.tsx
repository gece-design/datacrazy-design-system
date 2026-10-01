"use client";

import * as React from "react";
import {
  ChatCircleDots,
  CornersOut,
  GitBranch,
  HourglassMedium,
  Lightning,
  Minus,
  Play,
  Plus,
  Shuffle,
  type Icon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { IconeDeMarca } from "@/components/ui/icone-de-marca";
import { foco, rolagemDiscreta } from "@/lib/estados";
import { cn } from "@/lib/utils";
import { LARGURA_DO_BLOCO, TIPOS, type Bloco, type Saida, type TipoDeBloco } from "./dados";

/* O canvas da automação. Não é componente do design system: é o arranjo desta
   tela, feito com as peças dele — o bloco é um cartão com traço (como o card
   do quadro), o conector é um traço em `subtle-foreground`, e a cor só entra
   onde quer dizer algo: alerta e erro nas saídas que são alerta e erro.

   Cada bloco fica onde o dado manda (`x`, `y`) e pode ser arrastado pelo
   cabeçalho. Os conectores não guardam geometria: são medidos na tela, da
   bolinha da saída até a entrada do bloco de destino, e remedidos quando algo
   muda de lugar ou de tamanho. */

export const ICONES_DOS_BLOCOS: Record<TipoDeBloco, Icon> = {
  gatilho: Play,
  mensagem: ChatCircleDots,
  espera: HourglassMedium,
  condicao: GitBranch,
  acao: Lightning,
  randomizador: Shuffle,
};

const TOM_DA_SAIDA = {
  padrao: { ponto: "bg-subtle-foreground", traco: "text-subtle-foreground" },
  alerta: { ponto: "bg-warning", traco: "text-warning" },
  erro: { ponto: "bg-destructive", traco: "text-destructive" },
} as const;

const ZOOM_MINIMO = 0.5;
const ZOOM_MAXIMO = 1.5;
/** Folga depois do último bloco, para ele não encostar na borda do canvas. */
const FOLGA = 120;

const useEfeitoDeLayout = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

type Conector = { chave: string; d: string; tom: keyof typeof TOM_DA_SAIDA; destaque: boolean };

/** O quadrado do ícone do tipo: o mesmo slot do KpiCard e da linha do tempo. */
export function IconeDoBloco({ tipo, className }: { tipo: TipoDeBloco; className?: string }) {
  const Icone = ICONES_DOS_BLOCOS[tipo];
  return (
    <span aria-hidden="true" className={cn("flex size-7 shrink-0 items-center justify-center rounded-md bg-accent text-primary", className)}>
      <Icone size={16} weight="regular" />
    </span>
  );
}

/** O que o corpo do bloco mostra, por tipo: é o resumo do que está configurado. */
function Corpo({ bloco }: { bloco: Bloco }) {
  if (bloco.tipo === "mensagem") {
    return (
      <div className="flex flex-col gap-1.5 px-3 pb-2.5">
        {bloco.canal ? (
          <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
            <IconeDeMarca marca={bloco.canal === "WhatsApp" ? "whatsapp" : "instagram"} tamanho={12} />
            {bloco.canal}
          </p>
        ) : null}
        <p className="line-clamp-3 rounded-md bg-background px-2 py-1.5 text-body-md text-foreground" title={bloco.texto}>
          {bloco.texto}
        </p>
      </div>
    );
  }
  if (bloco.tipo === "espera" && bloco.espera) {
    return (
      <p className="px-3 pb-2.5 text-body-md text-foreground">
        {bloco.espera.valor} {bloco.espera.unidade}
      </p>
    );
  }
  if (!bloco.itens.length) return null;
  return (
    <ul className="flex flex-col gap-1 px-3 pb-2.5">
      {bloco.itens.map((item) => (
        <li key={item} className="truncate rounded-md bg-background px-2 py-1 text-body-md text-foreground" title={item}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Canvas({
  blocos,
  selecionado,
  aoSelecionar,
  aoMover,
  rotulos,
  className,
}: {
  blocos: Bloco[];
  /** O bloco aberto no painel ao lado. */
  selecionado: string | null;
  aoSelecionar: (id: string | null) => void;
  /** Arrastar pelo cabeçalho muda a posição do bloco. */
  aoMover: (id: string, x: number, y: number) => void;
  rotulos: { aproximar: string; afastar: string; ajustar: string; sucessos: string; alertas: string; erros: string };
  className?: string;
}) {
  const janela = React.useRef<HTMLDivElement>(null);
  const folha = React.useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = React.useState(1);
  const [conectores, setConectores] = React.useState<Conector[]>([]);
  const arrasto = React.useRef<{ id: string; x: number; y: number; px: number; py: number; moveu: boolean } | null>(null);

  const largura = Math.max(...blocos.map((b) => b.x)) + LARGURA_DO_BLOCO + FOLGA;
  const [altura, setAltura] = React.useState(720);

  /* Mede os conectores: do centro da bolinha de cada saída ligada até a
     bolinha de entrada do destino, em coordenadas da folha (sem o zoom). */
  const medir = React.useCallback(() => {
    const el = folha.current;
    if (!el) return;
    const base = el.getBoundingClientRect();
    const escala = base.width / el.offsetWidth || 1;
    const centro = (alvo: Element) => {
      const r = alvo.getBoundingClientRect();
      return { x: (r.left + r.width / 2 - base.left) / escala, y: (r.top + r.height / 2 - base.top) / escala };
    };
    const novos: Conector[] = [];
    let fundo = 0;
    for (const b of blocos) {
      const caixa = el.querySelector(`[data-bloco="${b.id}"]`);
      if (caixa) fundo = Math.max(fundo, b.y + (caixa as HTMLElement).offsetHeight);
      for (const s of b.saidas) {
        if (!s.para) continue;
        const de = el.querySelector(`[data-saida="${b.id}:${s.id}"]`);
        const ate = el.querySelector(`[data-entrada="${s.para}"]`);
        if (!de || !ate) continue;
        const a = centro(de);
        const z = centro(ate);
        // a curva sai e chega na horizontal; quando o destino fica para trás, o laço abre mais
        const folga = Math.max(40, Math.abs(z.x - a.x) / 2, z.x < a.x ? 120 : 0);
        novos.push({
          chave: `${b.id}:${s.id}`,
          d: `M ${a.x} ${a.y} C ${a.x + folga} ${a.y}, ${z.x - folga} ${z.y}, ${z.x} ${z.y}`,
          tom: s.tom ?? "padrao",
          destaque: b.id === selecionado || s.para === selecionado,
        });
      }
    }
    setConectores(novos);
    setAltura(fundo + FOLGA);
  }, [blocos, selecionado]);

  useEfeitoDeLayout(() => {
    medir();
    const el = folha.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    // o corpo de um bloco muda de altura quando a pessoa edita: as saídas descem e o conector acompanha
    const observador = new ResizeObserver(medir);
    el.querySelectorAll("[data-bloco]").forEach((b) => observador.observe(b));
    return () => observador.disconnect();
  }, [medir]);

  const passo = (d: number) => setZoom((z) => Math.min(ZOOM_MAXIMO, Math.max(ZOOM_MINIMO, Math.round((z + d) * 10) / 10)));
  function ajustar() {
    const el = janela.current;
    if (!el) return;
    setZoom(Math.min(1, Math.max(ZOOM_MINIMO, Math.floor(((el.clientWidth - 24) / largura) * 10) / 10)));
  }

  function comecarArrasto(e: React.PointerEvent, b: Bloco) {
    if (e.button !== 0) return;
    arrasto.current = { id: b.id, x: b.x, y: b.y, px: e.clientX, py: e.clientY, moveu: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function arrastar(e: React.PointerEvent) {
    const a = arrasto.current;
    if (!a) return;
    const dx = (e.clientX - a.px) / zoom;
    const dy = (e.clientY - a.py) / zoom;
    // menos que 4px é clique, não arrasto
    if (!a.moveu && Math.hypot(dx, dy) < 4) return;
    a.moveu = true;
    aoMover(a.id, Math.max(8, Math.round(a.x + dx)), Math.max(8, Math.round(a.y + dy)));
  }
  function soltar(b: Bloco) {
    const a = arrasto.current;
    arrasto.current = null;
    if (!a?.moveu) aoSelecionar(b.id);
  }

  return (
    <div className={cn("relative flex min-h-0 min-w-0 flex-1 bg-background", className)}>
      <div
        ref={janela}
        className={cn("min-h-0 min-w-0 flex-1 overflow-auto", rolagemDiscreta)}
        // clique no vazio fecha o bloco aberto
        onClick={(e) => {
          if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.folha !== undefined) aoSelecionar(null);
        }}
      >
        {/* a caixa tem o tamanho da folha JÁ com o zoom: é o que dá a rolagem certa */}
        <div style={{ width: largura * zoom, height: altura * zoom }}>
          <div
            ref={folha}
            data-folha
            className="relative origin-top-left"
            style={{ width: largura, height: altura, transform: `scale(${zoom})` }}
          >
            <svg aria-hidden="true" width={largura} height={altura} className="pointer-events-none absolute inset-0">
              {conectores.map((c) => (
                <path
                  key={c.chave}
                  d={c.d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={c.destaque ? 2 : 1.5}
                  strokeLinecap="round"
                  className={c.destaque && c.tom === "padrao" ? "text-primary" : TOM_DA_SAIDA[c.tom].traco}
                />
              ))}
            </svg>

            {blocos.map((b) => {
              const aberto = b.id === selecionado;
              const tipo = TIPOS[b.tipo];
              return (
                <article
                  key={b.id}
                  data-bloco={b.id}
                  aria-label={`${tipo.rotulo}: ${b.titulo}`}
                  style={{ left: b.x, top: b.y, width: LARGURA_DO_BLOCO }}
                  className={cn(
                    "absolute flex flex-col rounded-lg border border-border bg-card shadow-sm",
                    // aberto: contorno de 2, como toda seleção do DS — não ring com offset
                    aberto && "outline outline-2 outline-primary",
                  )}
                >
                  {/* a entrada: onde os conectores chegam. O gatilho não tem — nada vem antes dele */}
                  {b.tipo === "gatilho" ? null : (
                    <span
                      data-entrada={b.id}
                      aria-hidden="true"
                      className="absolute -left-1.5 top-[22px] size-3 rounded-full border-2 border-card bg-subtle-foreground"
                    />
                  )}

                  {/* check-tokens:ignore botao-cru — o cabeçalho é o alvo de selecionar E a alça de arrastar: duas linhas de conteúdo e ponteiro capturado não cabem no Button */}
                  <button
                    type="button"
                    aria-pressed={aberto}
                    onPointerDown={(e) => comecarArrasto(e, b)}
                    onPointerMove={arrastar}
                    onPointerUp={() => soltar(b)}
                    onPointerCancel={() => (arrasto.current = null)}
                    // o clique do teclado (Enter, Espaço) não passa pelo ponteiro
                    onClick={(e) => {
                      if (e.detail === 0) aoSelecionar(b.id);
                    }}
                    className={cn("flex w-full cursor-grab touch-none items-center gap-2 rounded-t-lg px-3 py-2.5 text-left active:cursor-grabbing", foco)}
                  >
                    <IconeDoBloco tipo={b.tipo} />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-caption text-muted-foreground">{tipo.rotulo}</span>
                      <span className="truncate text-h4 text-foreground" title={b.titulo}>
                        {b.titulo}
                      </span>
                    </span>
                  </button>

                  <Corpo bloco={b} />

                  <ul className="flex flex-col border-t border-border py-1">
                    {b.saidas.map((s: Saida) => {
                      const tom = TOM_DA_SAIDA[s.tom ?? "padrao"];
                      return (
                        <li key={s.id} className="relative flex h-7 items-center justify-end px-3">
                          <span className={cn("truncate text-label-md", s.para ? "text-foreground" : "text-subtle-foreground")} title={s.rotulo}>
                            {s.rotulo}
                          </span>
                          {/* a bolinha da saída: cheia quando liga a alguém, vazada quando o caminho ainda não tem destino */}
                          <span
                            data-saida={`${b.id}:${s.id}`}
                            aria-hidden="true"
                            className={cn(
                              "absolute -right-1.5 size-3 rounded-full border-2 border-card",
                              s.para ? tom.ponto : "bg-card ring-1 ring-inset ring-subtle-foreground",
                            )}
                          />
                        </li>
                      );
                    })}
                  </ul>

                  {b.contagem ? (
                    <dl className="flex items-center gap-3 border-t border-border px-3 py-1.5 text-caption tabular-nums text-muted-foreground">
                      {(
                        [
                          [rotulos.sucessos, b.contagem.sucessos, "bg-success"],
                          [rotulos.alertas, b.contagem.alertas, "bg-warning"],
                          [rotulos.erros, b.contagem.erros, "bg-destructive"],
                        ] as const
                      ).map(([nome, valor, ponto]) => (
                        <div key={nome} className="flex items-center gap-1" title={`${nome}: ${valor}`}>
                          <dt className="flex items-center">
                            <span aria-hidden="true" className={cn("size-1.5 rounded-full", ponto)} />
                            <span className="sr-only">{nome}</span>
                          </dt>
                          <dd className={cn(valor > 0 && ponto !== "bg-success" && "text-foreground")}>{valor}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* Zoom: uma caixa `card` com sombra, sobre o canvas cinza — o botão de apoio (cinza dentro do painel da tela) sumiria nele */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-card p-1 shadow-md">
        <Button variant="ghost" size="icon-sm" aria-label={rotulos.afastar} title={rotulos.afastar} disabled={zoom <= ZOOM_MINIMO} onClick={() => passo(-0.1)}>
          <Minus size={16} weight="regular" aria-hidden="true" />
        </Button>
        <span aria-live="polite" className="w-10 text-center text-label-md tabular-nums text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>
        <Button variant="ghost" size="icon-sm" aria-label={rotulos.aproximar} title={rotulos.aproximar} disabled={zoom >= ZOOM_MAXIMO} onClick={() => passo(0.1)}>
          <Plus size={16} weight="regular" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label={rotulos.ajustar} title={rotulos.ajustar} onClick={ajustar}>
          <CornersOut size={16} weight="regular" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
