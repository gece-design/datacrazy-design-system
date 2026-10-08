"use client";

import * as React from "react";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  Copy,
  CornersOut,
  Keyboard,
  LinkBreak,
  MapTrifold,
  Minus,
  Plus,
  SelectionAll,
  Trash,
  TreeStructure,
  X,
  type Icon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ComboboxPainel } from "@/components/ui/combobox";
import { Menu, type ItemDoMenu } from "@/components/ui/menu";
import { foco, focoInterno } from "@/lib/estados";
import { DURACAO } from "@/lib/movimento";
import { cn } from "@/lib/utils";

/**
 * Canvas — o editor de fluxo: blocos ligados por conectores numa folha que
 * anda e dá zoom. Nasceu como o arranjo da tela de Automações (2026-10-01/02)
 * e virou peça em 2026-10-07, a pedido do cliente na reunião de 02/10.
 *
 * O componente não sabe o que é um bloco: recebe `{ id, tipo, titulo, itens,
 * saidas }`, um mapa `tipos` com o rótulo e o ícone de cada `tipo`, e um
 * `corpo` pronto quando o resumo do bloco é mais que uma lista. Tudo o que
 * muda o fluxo é um pedido para a tela (`aoMover`, `aoLigar`, `aoAdicionar`…):
 * quem guarda os blocos — e o desfazer — é ela. Texto, só por `rotulos`.
 *
 * É um canvas de verdade, sem biblioteca de grafo:
 * - a folha não tem tamanho: a vista é uma translação e uma escala (`vista`),
 *   e o fundo pontilhado anda e escala junto;
 * - arrastar o fundo move a tela; rolar ou pinçar dá zoom no ponto do cursor;
 *   dois dedos no toque movem e dão zoom ao mesmo tempo;
 * - o bloco arrasta pelo corpo todo; com vários marcados, vão juntos;
 * - a ligação se faz arrastando da bolinha de uma saída até outro bloco, e se
 *   desfaz marcando o conector e apertando Delete;
 * - o que a pessoa conduz com a mão (arrasto, roda, pinça) segue o dedo, sem
 *   transição; o que ela pede por botão ou tecla (zoom, enquadrar, organizar)
 *   desliza até o lugar, com a duração `base` do design system.
 *
 * O bloco é um cartão com traço (como o card do quadro), o conector é um traço
 * em `subtle-foreground`, e a cor só entra onde quer dizer algo: alerta e erro
 * nas saídas que são alerta e erro. Os conectores não guardam geometria: são
 * medidos na tela, da bolinha da saída até a entrada do destino, e remedidos
 * quando algo muda.
 */

/** A largura de todo bloco, em px do canvas. A tela usa para nascer um bloco centrado. */
export const LARGURA_DO_BLOCO = 264;

/** Uma saída do bloco: o caminho que o fluxo segue. `tom` diz se é o caminho feliz, o de alerta ou o de erro. */
export type SaidaDoCanvas = {
  id: string;
  rotulo: string;
  /** O id do bloco de destino. Sem ele, o caminho ainda não tem para onde ir. */
  para?: string;
  tom?: "alerta" | "erro";
};

export type BlocoDoCanvas = {
  id: string;
  /** A chave em `tipos`: dá o ícone e o rótulo do cabeçalho. */
  tipo: string;
  titulo: string;
  /** Posição no canvas, em px. */
  x: number;
  y: number;
  /** As linhas do corpo: cada uma vira um item da lista. */
  itens: string[];
  saidas: SaidaDoCanvas[];
  /** Quantas execuções passaram pelo bloco e como terminaram. */
  contagem?: { sucessos: number; alertas: number; erros: number };
  /** Um corpo pronto, no lugar da lista de `itens`: a tela monta o resumo que o tipo pede. */
  corpo?: React.ReactNode;
};

/** O que o canvas precisa saber de cada tipo de bloco. */
export type TipoDoCanvas = {
  rotulo: string;
  icone: Icon;
  /** O começo do fluxo: não tem entrada, não se remove nem duplica, e o organizar parte dele. */
  inicio?: boolean;
};

const TOM_DA_SAIDA = {
  padrao: { ponto: "bg-subtle-foreground", traco: "text-subtle-foreground" },
  alerta: { ponto: "bg-warning", traco: "text-warning" },
  erro: { ponto: "bg-destructive", traco: "text-destructive" },
} as const;

const ZOOM_MINIMO = 0.25;
const ZOOM_MAXIMO = 2;
/** Os blocos assentam numa grade de 8 ao soltar: colunas e linhas fecham sem esforço. */
const GRADE = 8;
/** O vão entre os pontos do fundo, em px do canvas. */
const PONTILHADO = 24;
/** Folga em volta do fluxo ao enquadrar. */
const MARGEM = 48;
/** Distância entre colunas e entre blocos ao organizar. */
const VAO_DA_COLUNA = 72;
const VAO_DA_LINHA = 32;
const MAPA = { largura: 168, altura: 112 };
/** Altura de um bloco antes da primeira medida. */
const ALTURA_ESTIMADA = 160;

const useEfeitoDeLayout = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

type Ponto = { x: number; y: number };
/** Onde a folha está (px da tela) e em que escala. */
type Vista = { x: number; y: number; k: number };
type Conector = { chave: string; bloco: string; saida: string; d: string; meio: Ponto; tom: keyof typeof TOM_DA_SAIDA; destaque: boolean };
type Gesto =
  | { tipo: "mover-tela"; px: number; py: number; vista: Vista; moveu: boolean }
  | { tipo: "bloco"; id: string; ids: string[]; px: number; py: number; moveu: boolean; shift: boolean }
  | { tipo: "ligar"; bloco: string; saida: string }
  | { tipo: "marcar"; x0: number; y0: number }
  | { tipo: "pinca"; distancia: number; meio: Ponto; vista: Vista };

const limitar = (k: number) => Math.min(ZOOM_MAXIMO, Math.max(ZOOM_MINIMO, k));
const naGrade = (n: number) => Math.round(n / GRADE) * GRADE;

export type RotulosDoCanvas = {
  /** Nome da região. Ex.: "Fluxo da automação". */
  canvas: string;
  aproximar: string;
  afastar: string;
  ajustar: string;
  organizar: string;
  desfazer: string;
  refazer: string;
  mapa: string;
  ajuda: string;
  sucessos: string;
  alertas: string;
  erros: string;
  adicionarBloco: string;
  buscarBloco: string;
  nenhumBloco: string;
  adicionarAqui: string;
  selecionarTudo: string;
  duplicar: string;
  desligar: string;
  remover: string;
  removerLigacao: string;
  maisAcoes: string;
  /** A lista do cartão de ajuda: o gesto e o que ele faz. */
  atalhos: { gesto: string; efeito: string }[];
};

/** Os textos em pt-BR. No CRM, a tela passa os do next-intl por `rotulos`. */
export const ROTULOS_DO_CANVAS: RotulosDoCanvas = {
  canvas: "Fluxo",
  aproximar: "Aproximar (+)",
  afastar: "Afastar (−)",
  ajustar: "Ver o fluxo inteiro (1)",
  organizar: "Organizar os blocos",
  desfazer: "Desfazer (Ctrl ou ⌘ + Z)",
  refazer: "Refazer (Ctrl ou ⌘ + Shift + Z)",
  mapa: "Mapa do fluxo",
  ajuda: "Gestos e atalhos",
  sucessos: "Sucessos",
  alertas: "Alertas",
  erros: "Erros",
  adicionarBloco: "Adicionar bloco",
  buscarBloco: "Buscar bloco",
  nenhumBloco: "Nenhum bloco encontrado",
  adicionarAqui: "Adicionar bloco aqui",
  selecionarTudo: "Selecionar tudo",
  duplicar: "Duplicar",
  desligar: "Desligar as saídas",
  remover: "Remover",
  removerLigacao: "Remover a ligação",
  maisAcoes: "Ações",
  atalhos: [
    { gesto: "Arrastar o fundo", efeito: "move a tela" },
    { gesto: "Rolar ou pinçar", efeito: "aproxima e afasta" },
    { gesto: "Arrastar um bloco", efeito: "muda de lugar" },
    { gesto: "Arrastar da bolinha de uma saída", efeito: "liga a outro bloco" },
    { gesto: "Clicar numa ligação + Delete", efeito: "desfaz a ligação" },
    { gesto: "Dois cliques no fundo", efeito: "adiciona um bloco ali" },
    { gesto: "Shift + arrastar", efeito: "marca vários" },
    { gesto: "Botão direito", efeito: "mais ações" },
    { gesto: "Setas", efeito: "movem o bloco marcado" },
    { gesto: "Ctrl ou ⌘ + D · Delete", efeito: "duplica · remove" },
  ],
};

/** O que a tela pode pedir ao canvas. */
export type CanvasRef = {
  /** O ponto do canvas que está no meio da tela agora: onde um bloco novo deve nascer. */
  centro: () => Ponto;
};

export interface CanvasProps<B extends BlocoDoCanvas = BlocoDoCanvas> {
  blocos: B[];
  /** O rótulo e o ícone de cada `tipo` de bloco; `inicio` marca o começo do fluxo. */
  tipos: Record<B["tipo"], TipoDoCanvas>;
  /** O que a lista de adicionar oferece (dois cliques no fundo, "adicionar aqui", saída solta no vazio). Sem `icone`, usa o do tipo. */
  opcoesParaAdicionar: { valor: B["tipo"]; rotulo: string; icone?: Icon }[];
  /** Os blocos marcados. Com um só, a tela abre o painel dele. */
  selecionados: string[];
  aoSelecionar: (ids: string[]) => void;
  /** A posição nova de cada bloco movido: arrasto, setas ou organizar. */
  aoMover: (posicoes: Record<string, Ponto>) => void;
  /** Liga a saída de um bloco a outro; sem `para`, desfaz a ligação. */
  aoLigar: (bloco: string, saida: string, para: string | undefined) => void;
  /** Cria um bloco no ponto do canvas; com `ligar`, ele já nasce como destino daquela saída. */
  aoAdicionar: (tipo: B["tipo"], x: number, y: number, ligar?: { bloco: string; saida: string }) => void;
  aoRemover: (ids: string[]) => void;
  aoDuplicar: (ids: string[]) => void;
  aoDesfazer: () => void;
  aoRefazer: () => void;
  podeDesfazer: boolean;
  podeRefazer: boolean;
  /** Os textos. Fábrica: `ROTULOS_DO_CANVAS`. */
  rotulos?: Partial<RotulosDoCanvas>;
  className?: string;
}

/** O quadrado do ícone do tipo: o mesmo slot do KpiCard e da linha do tempo. A tela reusa no painel do bloco. */
export function IconeDoBloco({ icone: Icone, className }: { icone: Icon; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("flex size-7 shrink-0 items-center justify-center rounded-md bg-accent text-primary", className)}>
      <Icone size={16} weight="regular" />
    </span>
  );
}

/** A curva de uma saída até uma entrada: sai e chega na horizontal; quando o destino fica para trás, o laço abre mais. */
function curva(a: Ponto, z: Ponto) {
  const folga = Math.max(40, Math.abs(z.x - a.x) / 2, z.x < a.x ? 120 : 0);
  const c1 = { x: a.x + folga, y: a.y };
  const c2 = { x: z.x - folga, y: z.y };
  return {
    d: `M ${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${z.x} ${z.y}`,
    // o ponto do meio da curva (t = 0,5): onde fica o botão de remover a ligação
    meio: { x: (a.x + 3 * c1.x + 3 * c2.x + z.x) / 8, y: (a.y + 3 * c1.y + 3 * c2.y + z.y) / 8 },
  };
}

function CanvasInterno<B extends BlocoDoCanvas>(
  {
    blocos,
    tipos,
    opcoesParaAdicionar,
    selecionados,
    aoSelecionar,
    aoMover,
    aoLigar,
    aoAdicionar,
    aoRemover,
    aoDuplicar,
    aoDesfazer,
    aoRefazer,
    podeDesfazer,
    podeRefazer,
    rotulos: rotulosDeFora,
    className,
  }: CanvasProps<B>,
  ref: React.ForwardedRef<CanvasRef>,
) {
  const rotulos = { ...ROTULOS_DO_CANVAS, ...rotulosDeFora };
  const tipoDe = (b: B): TipoDoCanvas | undefined => tipos[b.tipo as B["tipo"]];
  const ehInicio = (b: B) => Boolean(tipoDe(b)?.inicio);

  const janela = React.useRef<HTMLDivElement>(null);
  const folha = React.useRef<HTMLDivElement>(null);
  const ancora = React.useRef<HTMLSpanElement>(null);

  const [vista, setVista] = React.useState<Vista>({ x: 0, y: 0, k: 1 });
  const vistaAtual = React.useRef(vista);
  vistaAtual.current = vista;
  /** Antes do primeiro enquadramento a folha fica invisível: não pisca fora do lugar. */
  const [pronto, setPronto] = React.useState(false);
  const [tamanho, setTamanho] = React.useState({ largura: 0, altura: 0 });

  const [conectores, setConectores] = React.useState<Conector[]>([]);
  const [alturas, setAlturas] = React.useState<Record<string, number>>({});
  const alturasAtuais = React.useRef(alturas);

  const gesto = React.useRef<Gesto | null>(null);
  const ponteiros = React.useRef(new Map<number, Ponto>());
  const espaco = React.useRef(false);
  /** O arrasto em curso: os blocos andam na tela, mas o fluxo só muda ao soltar. */
  const [arrasto, setArrasto] = React.useState<{ ids: string[]; dx: number; dy: number } | null>(null);
  const arrastoAtual = React.useRef(arrasto);
  arrastoAtual.current = arrasto;
  const [movendoTela, setMovendoTela] = React.useState(false);
  const [ligando, setLigando] = React.useState<{ de: Ponto; ate: Ponto; alvo: string | null } | null>(null);
  /** A caixa de marcar vários, e quem ela já tocou — a seleção só vale ao soltar. */
  const [marca, setMarca] = React.useState<{ x0: number; y0: number; x1: number; y1: number; ids: string[] } | null>(null);
  const marcaAtual = React.useRef(marca);
  marcaAtual.current = marca;
  const [conectorMarcado, setConectorMarcado] = React.useState<string | null>(null);

  /** Onde o menu e a lista de blocos abrem: um ponto da tela, com o ponto do canvas que está embaixo. */
  const [ponto, setPonto] = React.useState<{ tela: Ponto; canvas: Ponto } | null>(null);
  const [menu, setMenu] = React.useState<{ bloco?: string } | null>(null);
  const [lista, setLista] = React.useState<{ ligar?: { bloco: string; saida: string } } | null>(null);
  const [ajuda, setAjuda] = React.useState(false);
  const [mapa, setMapa] = React.useState(true);
  const enquadrarDepois = React.useRef(false);
  /** Uma mudança pedida por botão ou tecla está deslizando até o lugar. */
  const [animando, setAnimando] = React.useState(false);
  const fimDaAnimacao = React.useRef<number | undefined>(undefined);
  /** Roda a mudança com transição: a vista (e os blocos, ao organizar) deslizam em vez de pular. */
  const comAnimacao = (mudanca: () => void) => {
    setAnimando(true);
    mudanca();
    window.clearTimeout(fimDaAnimacao.current);
    fimDaAnimacao.current = window.setTimeout(() => setAnimando(false), DURACAO.base + 40);
  };

  const marcados = marca ? marca.ids : selecionados;

  /** A lista de adicionar: o ícone de 16 vem da opção ou do tipo. */
  const opcoesDaLista = React.useMemo(
    () =>
      opcoesParaAdicionar.map((o) => {
        const Icone = o.icone ?? tipos[o.valor]?.icone;
        return { valor: o.valor as string, rotulo: o.rotulo, icone: Icone ? <Icone size={16} weight="regular" aria-hidden="true" className="shrink-0" /> : undefined };
      }),
    [opcoesParaAdicionar, tipos],
  );

  /** Da tela (px dentro da janela) para o canvas. */
  const paraCanvas = (p: Ponto, v = vistaAtual.current): Ponto => ({ x: (p.x - v.x) / v.k, y: (p.y - v.y) / v.k });
  const naJanela = (e: { clientX: number; clientY: number }): Ponto => {
    const r = janela.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  /** Muda o zoom mantendo parado o ponto do canvas que está sob (px, py). */
  const zoomEm = React.useCallback((px: number, py: number, novo: (k: number) => number) => {
    setVista((v) => {
      const k = limitar(novo(v.k));
      const m = { x: (px - v.x) / v.k, y: (py - v.y) / v.k };
      return { k, x: px - m.x * k, y: py - m.y * k };
    });
  }, []);
  const zoomNoMeio = (novo: (k: number) => number) => zoomEm(tamanho.largura / 2, tamanho.altura / 2, novo);

  /* Enquadrar: o fluxo inteiro à vista, centrado, sem passar de 100%. Com
     `piso` (a chegada na tela), o zoom não desce dele: num celular o fluxo
     inteiro ficaria ilegível, então a tela abre no começo dele, legível. */
  const enquadrar = React.useCallback(
    (piso = ZOOM_MINIMO) => {
      const el = janela.current;
      if (!el || !blocos.length) return;
      const x0 = Math.min(...blocos.map((b) => b.x));
      const y0 = Math.min(...blocos.map((b) => b.y));
      const x1 = Math.max(...blocos.map((b) => b.x + LARGURA_DO_BLOCO));
      const y1 = Math.max(...blocos.map((b) => b.y + (alturasAtuais.current[b.id] ?? ALTURA_ESTIMADA)));
      const cabe = Math.min((el.clientWidth - 2 * MARGEM) / (x1 - x0), (el.clientHeight - 2 * MARGEM) / (y1 - y0));
      const k = Math.min(1, Math.max(piso, limitar(cabe)));
      const sobra = { x: el.clientWidth - (x1 - x0) * k, y: el.clientHeight - (y1 - y0) * k };
      // cabe: centra; não cabe: encosta no começo, com uma folga
      setVista({ k, x: (sobra.x > 0 ? sobra.x / 2 : 16) - x0 * k, y: (sobra.y > 0 ? sobra.y / 2 : 16) - y0 * k });
    },
    [blocos],
  );

  React.useImperativeHandle(
    ref,
    () => ({
      centro: () => {
        const el = janela.current;
        return paraCanvas({ x: (el?.clientWidth ?? 0) / 2, y: (el?.clientHeight ?? 0) / 2 });
      },
    }),
    [],
  );

  /* Mede os conectores: do centro da bolinha de cada saída ligada até a
     bolinha de entrada do destino, em coordenadas do canvas (sem o zoom). */
  const medir = React.useCallback(() => {
    const el = folha.current;
    if (!el) return;
    const base = el.getBoundingClientRect();
    // a escala REAL da folha agora — no meio de uma transição ela ainda não é a da vista
    const k = new DOMMatrixReadOnly(getComputedStyle(el).transform).a || 1;
    const centro = (alvo: Element): Ponto => {
      const r = alvo.getBoundingClientRect();
      return { x: (r.left + r.width / 2 - base.left) / k, y: (r.top + r.height / 2 - base.top) / k };
    };
    const novos: Conector[] = [];
    const medidas: Record<string, number> = {};
    for (const b of blocos) {
      const caixa = el.querySelector<HTMLElement>(`[data-bloco="${b.id}"]`);
      if (caixa) medidas[b.id] = caixa.offsetHeight;
      for (const s of b.saidas) {
        if (!s.para) continue;
        const de = el.querySelector(`[data-saida="${b.id}:${s.id}"]`);
        const ate = el.querySelector(`[data-entrada="${s.para}"]`);
        if (!de || !ate) continue;
        novos.push({
          chave: `${b.id}:${s.id}`,
          bloco: b.id,
          saida: s.id,
          ...curva(centro(de), centro(ate)),
          tom: s.tom ?? "padrao",
          destaque: selecionados.includes(b.id) || selecionados.includes(s.para),
        });
      }
    }
    alturasAtuais.current = medidas;
    setConectores(novos);
    setAlturas(medidas);
  }, [blocos, selecionados]);

  useEfeitoDeLayout(() => {
    medir();
    if (!pronto) {
      // a primeira medida já enquadra: a pessoa chega vendo o fluxo inteiro — ou o começo dele, se a tela for pequena
      enquadrar(0.6);
      setPronto(true);
    } else if (enquadrarDepois.current) {
      enquadrarDepois.current = false;
      enquadrar();
    }
    const el = folha.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    // o corpo de um bloco muda de altura quando a pessoa edita: as saídas descem e o conector acompanha
    const observador = new ResizeObserver(medir);
    el.querySelectorAll("[data-bloco]").forEach((b) => observador.observe(b));
    return () => observador.disconnect();
    // `arrasto` entra para o conector seguir o bloco enquanto ele anda
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medir, arrasto]);

  // enquanto algo desliza, os conectores são remedidos a cada quadro: acompanham os blocos
  React.useEffect(() => {
    if (!animando) return;
    let quadro = requestAnimationFrame(function passo() {
      medir();
      quadro = requestAnimationFrame(passo);
    });
    return () => cancelAnimationFrame(quadro);
  }, [animando, medir]);
  React.useEffect(() => () => window.clearTimeout(fimDaAnimacao.current), []);

  /* O tamanho da janela (para o mapa e para o centro) e os gestos que o React
     não deixa cancelar: a roda e a pinça precisam de `preventDefault`, senão o
     navegador dá zoom na página inteira. */
  React.useEffect(() => {
    const el = janela.current;
    if (!el) return;
    const medirJanela = () => setTamanho({ largura: el.clientWidth, altura: el.clientHeight });
    medirJanela();
    const observador = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(medirJanela);
    observador?.observe(el);

    const roda = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const passo = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      // Shift + roda anda de lado; fora isso, roda e pinça (que chega com ctrlKey) dão zoom no cursor
      if (e.shiftKey && !e.ctrlKey && !e.metaKey) {
        setVista((v) => ({ ...v, x: v.x - (e.deltaX || passo) }));
        return;
      }
      zoomEm(e.clientX - r.left, e.clientY - r.top, (k) => k * Math.exp(-passo * (e.ctrlKey ? 0.01 : 0.0015)));
    };
    // Safari manda a pinça do trackpad como gesture*, com a escala acumulada
    let escalaInicial = 1;
    const pincaComeca = (e: Event) => {
      e.preventDefault();
      escalaInicial = vistaAtual.current.k;
    };
    const pincaMuda = (e: Event) => {
      e.preventDefault();
      const g = e as unknown as { scale: number; clientX: number; clientY: number };
      const r = el.getBoundingClientRect();
      zoomEm(g.clientX - r.left, g.clientY - r.top, () => escalaInicial * g.scale);
    };
    el.addEventListener("wheel", roda, { passive: false });
    el.addEventListener("gesturestart", pincaComeca);
    el.addEventListener("gesturechange", pincaMuda);
    return () => {
      observador?.disconnect();
      el.removeEventListener("wheel", roda);
      el.removeEventListener("gesturestart", pincaComeca);
      el.removeEventListener("gesturechange", pincaMuda);
    };
  }, [zoomEm]);

  /** O bloco sob o ponteiro que pode receber a ligação: não é o de origem nem um início. */
  function alvoDaLigacao(e: { clientX: number; clientY: number }, origem: string) {
    const id = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>("[data-bloco]")?.dataset.bloco;
    const b = blocos.find((x) => x.id === id);
    return b && b.id !== origem && !ehInicio(b) ? b.id : null;
  }

  /* O menu e a lista de blocos abrem em portal, mas os eventos deles sobem
     pela árvore do React até aqui: o canvas só responde ao que nasceu dentro
     dele — senão capturaria o ponteiro e o clique na opção não chegaria. */
  const deFora = (alvo: EventTarget) => !janela.current?.contains(alvo as Node);

  function abrirEm(tela: Ponto) {
    setPonto({ tela, canvas: paraCanvas(tela) });
  }

  function baixar(e: React.PointerEvent) {
    const alvo = e.target as HTMLElement;
    // a barra, o mapa e os botões sobre o canvas respondem por si; o botão direito é do menu
    if (deFora(alvo) || alvo.closest("[data-fixo]") || e.button === 2) return;
    const el = janela.current!;
    const p = naJanela(e);
    ponteiros.current.set(e.pointerId, p);
    el.setPointerCapture(e.pointerId);

    // segundo dedo: vira pinça, e o que o primeiro estava fazendo é abandonado
    if (ponteiros.current.size === 2) {
      const [a, b] = [...ponteiros.current.values()];
      gesto.current = { tipo: "pinca", distancia: Math.hypot(a.x - b.x, a.y - b.y) || 1, meio: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, vista: vistaAtual.current };
      setArrasto(null);
      setLigando(null);
      setMarca(null);
      return;
    }

    // botão do meio ou Espaço segurado: o arrasto é sempre da tela
    const moverTela = e.button === 1 || espaco.current;
    const saida = moverTela ? null : alvo.closest<HTMLElement>("[data-saida]");
    const bloco = moverTela ? null : alvo.closest<HTMLElement>("[data-bloco]");
    const conector = moverTela ? null : alvo.closest<SVGElement>("[data-conector]");

    if (saida) {
      const [idDoBloco, idDaSaida] = saida.dataset.saida!.split(":");
      const r = saida.getBoundingClientRect();
      const base = el.getBoundingClientRect();
      const de = paraCanvas({ x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top });
      gesto.current = { tipo: "ligar", bloco: idDoBloco, saida: idDaSaida };
      setLigando({ de, ate: de, alvo: null });
      return;
    }
    if (bloco) {
      const id = bloco.dataset.bloco!;
      // marcado: anda com os outros marcados; não marcado: anda sozinho
      const ids = selecionados.includes(id) ? selecionados : [id];
      gesto.current = { tipo: "bloco", id, ids, px: p.x, py: p.y, moveu: false, shift: e.shiftKey };
      return;
    }
    if (conector) {
      setConectorMarcado(conector.dataset.conector!);
      aoSelecionar([]);
      gesto.current = null;
      return;
    }
    if (e.shiftKey && !moverTela) {
      gesto.current = { tipo: "marcar", x0: p.x, y0: p.y };
      setMarca({ x0: p.x, y0: p.y, x1: p.x, y1: p.y, ids: [] });
      return;
    }
    gesto.current = { tipo: "mover-tela", px: p.x, py: p.y, vista: vistaAtual.current, moveu: false };
  }

  function mover(e: React.PointerEvent) {
    const g = gesto.current;
    if (!g || !ponteiros.current.has(e.pointerId)) return;
    const p = naJanela(e);
    ponteiros.current.set(e.pointerId, p);

    if (g.tipo === "pinca") {
      const [a, b] = [...ponteiros.current.values()];
      if (!a || !b) return;
      const meio = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const k = limitar((g.vista.k * Math.hypot(a.x - b.x, a.y - b.y)) / g.distancia);
      // o ponto que estava entre os dedos continua entre os dedos
      const m = paraCanvas(g.meio, g.vista);
      setVista({ k, x: meio.x - m.x * k, y: meio.y - m.y * k });
      return;
    }
    if (g.tipo === "mover-tela") {
      const dx = p.x - g.px;
      const dy = p.y - g.py;
      // menos que 4px é clique, não arrasto
      if (!g.moveu && Math.hypot(dx, dy) < 4) return;
      g.moveu = true;
      setMovendoTela(true);
      setVista({ ...g.vista, x: g.vista.x + dx, y: g.vista.y + dy });
      return;
    }
    if (g.tipo === "bloco") {
      const dx = p.x - g.px;
      const dy = p.y - g.py;
      if (!g.moveu && Math.hypot(dx, dy) < 4) return;
      g.moveu = true;
      const k = vistaAtual.current.k;
      setArrasto({ ids: g.ids, dx: dx / k, dy: dy / k });
      return;
    }
    if (g.tipo === "ligar") {
      const alvo = alvoDaLigacao(e, g.bloco);
      setLigando((l) => (l ? { ...l, ate: paraCanvas(p), alvo } : l));
      return;
    }
    if (g.tipo === "marcar") {
      // marca quem a caixa toca, enquanto ela cresce
      const base = janela.current!.getBoundingClientRect();
      const [esq, dir] = [Math.min(g.x0, p.x), Math.max(g.x0, p.x)];
      const [topo, pe] = [Math.min(g.y0, p.y), Math.max(g.y0, p.y)];
      const dentro = blocos.filter((b) => {
        const r = folha.current?.querySelector(`[data-bloco="${b.id}"]`)?.getBoundingClientRect();
        return r && r.left - base.left < dir && r.right - base.left > esq && r.top - base.top < pe && r.bottom - base.top > topo;
      });
      setMarca({ x0: g.x0, y0: g.y0, x1: p.x, y1: p.y, ids: dentro.map((b) => b.id) });
    }
  }

  function soltar(e: React.PointerEvent) {
    const g = gesto.current;
    ponteiros.current.delete(e.pointerId);
    if (!g) return;
    if (g.tipo === "pinca") {
      if (ponteiros.current.size < 2) gesto.current = null;
      return;
    }
    gesto.current = null;

    if (g.tipo === "mover-tela") {
      setMovendoTela(false);
      // clique no vazio: desmarca tudo
      if (!g.moveu) {
        aoSelecionar([]);
        setConectorMarcado(null);
      }
      return;
    }
    if (g.tipo === "bloco") {
      const a = arrastoAtual.current;
      setArrasto(null);
      setConectorMarcado(null);
      if (g.moveu && a) {
        // mover não marca: o painel só abre com o clique
        aoMover(Object.fromEntries(blocos.filter((b) => a.ids.includes(b.id)).map((b) => [b.id, { x: naGrade(b.x + a.dx), y: naGrade(b.y + a.dy) }])));
      } else if (g.shift) {
        // Shift + clique: põe ou tira da seleção
        aoSelecionar(selecionados.includes(g.id) ? selecionados.filter((id) => id !== g.id) : [...selecionados, g.id]);
      } else {
        aoSelecionar([g.id]);
      }
      return;
    }
    if (g.tipo === "ligar") {
      setLigando(null);
      const destino = alvoDaLigacao(e, g.bloco);
      if (destino) {
        aoLigar(g.bloco, g.saida, destino);
      } else if (!document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-bloco], [data-fixo]")) {
        // soltou no vazio: a lista de blocos abre ali, e o escolhido já nasce ligado
        abrirEm(naJanela(e));
        setLista({ ligar: { bloco: g.bloco, saida: g.saida } });
      }
      return;
    }
    // marcar: a seleção passa a valer
    const m = marcaAtual.current;
    setMarca(null);
    if (m) aoSelecionar(m.ids);
  }

  /* Organizar: uma coluna por passo do fluxo, a partir do início e de cada
     trecho solto; o que sobrar (um laço fechado) vai para a última coluna. */
  function organizar() {
    const porId = new Map(blocos.map((b) => [b.id, b]));
    const coluna = new Map<string, number>();
    const ordem: string[] = [];
    // começa pelos inícios; depois, por quem não recebe ligação de ninguém (um trecho solto do fluxo)
    const recebe = new Set(blocos.flatMap((b) => b.saidas.map((s) => s.para)));
    const fila = [...blocos.filter((b) => ehInicio(b)), ...blocos.filter((b) => !ehInicio(b) && !recebe.has(b.id))].map((b) => b.id);
    fila.forEach((id) => coluna.set(id, 0));
    while (fila.length) {
      const id = fila.shift()!;
      ordem.push(id);
      for (const s of porId.get(id)!.saidas) {
        if (s.para && porId.has(s.para) && !coluna.has(s.para)) {
          coluna.set(s.para, coluna.get(id)! + 1);
          fila.push(s.para);
        }
      }
    }
    const ultima = Math.max(0, ...coluna.values());
    for (const b of blocos) {
      if (coluna.has(b.id)) continue;
      coluna.set(b.id, ultima + 1);
      ordem.push(b.id);
    }
    const topo = new Map<number, number>();
    const posicoes: Record<string, Ponto> = {};
    for (const id of ordem) {
      const c = coluna.get(id)!;
      const y = topo.get(c) ?? 24;
      posicoes[id] = { x: 24 + c * (LARGURA_DO_BLOCO + VAO_DA_COLUNA), y };
      topo.set(c, y + (alturas[id] ?? ALTURA_ESTIMADA) + VAO_DA_LINHA);
    }
    comAnimacao(() => {
      enquadrarDepois.current = true;
      aoMover(posicoes);
    });
  }

  function teclar(e: React.KeyboardEvent) {
    const alvo = e.target as HTMLElement;
    if (deFora(alvo) || alvo.closest("input, textarea, select, [contenteditable=true]")) return;
    const comando = e.metaKey || e.ctrlKey;
    const tecla = e.key.toLowerCase();
    // setas e Delete valem com o foco no canvas ou num bloco — não na barra de botões
    const noFluxo = alvo === janela.current || Boolean(alvo.closest("[data-bloco]"));

    if (comando && tecla === "z") {
      e.preventDefault();
      if (e.shiftKey) aoRefazer();
      else aoDesfazer();
    } else if (comando && tecla === "y") {
      e.preventDefault();
      aoRefazer();
    } else if (comando && tecla === "a") {
      e.preventDefault();
      aoSelecionar(blocos.map((b) => b.id));
    } else if (comando && tecla === "d") {
      e.preventDefault();
      if (selecionados.length) aoDuplicar(selecionados);
    } else if ((e.key === "Delete" || e.key === "Backspace") && noFluxo) {
      e.preventDefault();
      if (conectorMarcado) {
        const [bloco, saida] = conectorMarcado.split(":");
        aoLigar(bloco, saida, undefined);
        setConectorMarcado(null);
      } else if (selecionados.length) {
        aoRemover(selecionados);
      }
    } else if (e.key === "Escape") {
      if (gesto.current?.tipo === "ligar" || gesto.current?.tipo === "marcar") gesto.current = null;
      setLigando(null);
      setMarca(null);
      setConectorMarcado(null);
      setAjuda(false);
      if (selecionados.length) aoSelecionar([]);
    } else if (e.key.startsWith("Arrow") && noFluxo) {
      e.preventDefault();
      const d = e.shiftKey ? 3 * GRADE : GRADE;
      const dx = e.key === "ArrowLeft" ? -d : e.key === "ArrowRight" ? d : 0;
      const dy = e.key === "ArrowUp" ? -d : e.key === "ArrowDown" ? d : 0;
      if (selecionados.length) {
        // com bloco marcado, as setas movem o bloco
        aoMover(Object.fromEntries(blocos.filter((b) => selecionados.includes(b.id)).map((b) => [b.id, { x: b.x + dx, y: b.y + dy }])));
      } else {
        // sem nada marcado, movem a tela
        setVista((v) => ({ ...v, x: v.x - dx * 6, y: v.y - dy * 6 }));
      }
    } else if (!comando && (e.key === "+" || e.key === "=")) {
      comAnimacao(() => zoomNoMeio((k) => k + 0.1));
    } else if (!comando && e.key === "-") {
      comAnimacao(() => zoomNoMeio((k) => k - 0.1));
    } else if (!comando && e.key === "0") {
      comAnimacao(() => zoomNoMeio(() => 1));
    } else if (!comando && e.key === "1") {
      comAnimacao(() => enquadrar());
    } else if (e.key === " " && alvo === janela.current) {
      // Espaço segurado: qualquer arrasto move a tela, mesmo em cima de um bloco
      e.preventDefault();
      espaco.current = true;
    }
  }

  const blocoDoMenu = blocos.find((b) => b.id === menu?.bloco);
  // o menu age no bloco clicado — ou em todos os marcados, se ele é um deles
  const alvosDoMenu = blocoDoMenu ? (selecionados.includes(blocoDoMenu.id) ? selecionados : [blocoDoMenu.id]) : [];
  const itensDoMenu: ItemDoMenu[] = blocoDoMenu
    ? [
        { id: "duplicar", rotulo: rotulos.duplicar, icone: Copy, desabilitado: ehInicio(blocoDoMenu), aoAtivar: () => aoDuplicar(alvosDoMenu) },
        {
          id: "desligar",
          rotulo: rotulos.desligar,
          icone: LinkBreak,
          desabilitado: !blocoDoMenu.saidas.some((s) => s.para),
          aoAtivar: () => blocoDoMenu.saidas.forEach((s) => s.para && aoLigar(blocoDoMenu.id, s.id, undefined)),
        },
        {
          id: "remover",
          rotulo: rotulos.remover,
          icone: Trash,
          separadorAntes: true,
          desabilitado: ehInicio(blocoDoMenu),
          aoAtivar: () => aoRemover(alvosDoMenu),
        },
      ]
    : [
        { id: "adicionar", rotulo: rotulos.adicionarAqui, icone: Plus, aoAtivar: () => setLista({}) },
        { id: "tudo", rotulo: rotulos.selecionarTudo, icone: SelectionAll, aoAtivar: () => aoSelecionar(blocos.map((b) => b.id)) },
        { id: "organizar", rotulo: rotulos.organizar, icone: TreeStructure, separadorAntes: true, aoAtivar: organizar },
        { id: "ajustar", rotulo: rotulos.ajustar, icone: CornersOut, aoAtivar: () => comAnimacao(() => enquadrar()) },
      ];

  // o pontilhado anda e escala com a vista; muito afastado, dobra o vão para não virar ruído
  const vao = PONTILHADO * vista.k * (vista.k < 0.5 ? 2 : 1);
  const conectorAberto = conectores.find((c) => c.chave === conectorMarcado);

  return (
    <div
      ref={janela}
      role="group"
      aria-label={rotulos.canvas}
      tabIndex={0}
      onPointerDown={baixar}
      onPointerMove={mover}
      onPointerUp={soltar}
      onPointerCancel={soltar}
      onKeyDown={teclar}
      onKeyUp={(e) => {
        if (e.key === " ") espaco.current = false;
      }}
      onDoubleClick={(e) => {
        // dois cliques no vazio: a lista de blocos abre ali
        if (deFora(e.target) || (e.target as HTMLElement).closest("[data-bloco], [data-fixo], [data-conector]")) return;
        abrirEm(naJanela(e));
        setLista({});
      }}
      onContextMenu={(e) => {
        if (deFora(e.target) || (e.target as HTMLElement).closest("[data-fixo]")) return;
        e.preventDefault();
        const id = (e.target as HTMLElement).closest<HTMLElement>("[data-bloco]")?.dataset.bloco;
        abrirEm(naJanela(e));
        setMenu({ bloco: id });
      }}
      // só as medidas do pontilhado: o desenho dele está nas classes da camada de fundo
      style={{ "--vao": `${vao}px`, "--px": `${vista.x}px`, "--py": `${vista.y}px` } as React.CSSProperties}
      className={cn(
        // `muted`: o cinza claro do canvas — não é o da navegação (`background`) nem o branco dos blocos
        "relative min-h-0 min-w-0 flex-1 touch-none select-none overflow-hidden bg-muted",
        movendoTela ? "cursor-grabbing" : "cursor-grab",
        focoInterno,
        className,
      )}
    >
      {/* o pontilhado, numa camada própria: a cor é `text-divider` por currentColor —
          a variável do token direto no gradiente não vale no Tailwind v4 (o registry recusa) */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 text-divider [background-image:radial-gradient(circle,currentColor_1px,transparent_1.5px)] [background-position:var(--px)_var(--py)] [background-size:var(--vao)_var(--vao)]",
          // o pontilhado desliza junto com a folha
          animando && "transition-[background-position,background-size] duration-base ease-enter",
        )}
      />
      <div
        ref={folha}
        className={cn("absolute left-0 top-0 origin-top-left", !pronto && "invisible", animando && "transition-transform duration-base ease-enter")}
        style={{ transform: `translate(${vista.x}px, ${vista.y}px) scale(${vista.k})` }}
      >
        <svg aria-hidden="true" width={1} height={1} className="pointer-events-none absolute left-0 top-0 overflow-visible">
          {conectores.map((c) => {
            const marcado = c.chave === conectorMarcado;
            return (
              <g key={c.chave}>
                {/* a área de clique: larga e invisível, sob o traço fino */}
                <path data-conector={c.chave} d={c.d} fill="none" stroke="transparent" strokeWidth={14} className="pointer-events-auto cursor-pointer" />
                <path
                  d={c.d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={marcado ? 2.5 : c.destaque ? 2 : 1.5}
                  strokeLinecap="round"
                  className={marcado || (c.destaque && c.tom === "padrao") ? "text-primary" : TOM_DA_SAIDA[c.tom].traco}
                />
              </g>
            );
          })}
          {/* a ligação em andamento: tracejada, da saída até o ponteiro */}
          {ligando ? (
            <path d={curva(ligando.de, ligando.ate).d} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeDasharray="6 5" className="text-primary" />
          ) : null}
        </svg>

        {blocos.map((b) => {
          const marcado = marcados.includes(b.id);
          const tipo = tipoDe(b);
          const andando = Boolean(arrasto?.ids.includes(b.id));
          return (
            <article
              key={b.id}
              data-bloco={b.id}
              aria-label={`${tipo?.rotulo ?? b.tipo}: ${b.titulo}`}
              style={{ left: b.x + (andando ? arrasto!.dx : 0), top: b.y + (andando ? arrasto!.dy : 0), width: LARGURA_DO_BLOCO }}
              className={cn(
                // o bloco novo entra em fade; a sombra cresce enquanto ele é arrastado
                "absolute flex cursor-grab flex-col rounded-lg border border-border bg-card shadow-sm transition-shadow active:cursor-grabbing motion-safe:animate-fade-in-fast",
                // organizar: os blocos deslizam até a coluna nova
                animando && "transition-[left,top,box-shadow] duration-base ease-enter",
                // marcado: contorno de 2, como toda seleção do DS — não ring com offset
                marcado && "outline outline-2 outline-primary",
                // o destino da ligação que está sendo arrastada
                ligando?.alvo === b.id && "outline-dashed outline-2 outline-primary",
                andando && "shadow-lg",
              )}
            >
              {/* a entrada: onde os conectores chegam. O início não tem — nada vem antes dele */}
              {tipo?.inicio ? null : (
                <span
                  data-entrada={b.id}
                  aria-hidden="true"
                  className="absolute -left-1.5 top-[22px] size-3 rounded-full border-2 border-card bg-subtle-foreground"
                />
              )}

              {/* check-tokens:ignore botao-cru — o cabeçalho é o alvo do teclado para marcar o bloco: duas linhas de conteúdo não cabem no Button, e o arrasto é do cartão inteiro */}
              <button
                type="button"
                aria-pressed={marcado}
                // o clique do ponteiro é resolvido no canvas (arrasto ou seleção); aqui só o do teclado (Enter, Espaço)
                onClick={(e) => {
                  if (e.detail === 0) aoSelecionar([b.id]);
                }}
                className={cn("flex w-full cursor-[inherit] items-center gap-2 rounded-t-lg px-3 py-2.5 text-left", foco)}
              >
                {tipo ? <IconeDoBloco icone={tipo.icone} /> : null}
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-caption text-muted-foreground">{tipo?.rotulo ?? b.tipo}</span>
                  <span className="truncate text-h4 text-foreground" title={b.titulo}>
                    {b.titulo}
                  </span>
                </span>
              </button>

              {/* o corpo: o resumo que a tela montou ou, sem ele, a lista de itens */}
              {b.corpo !== undefined && b.corpo !== null ? (
                b.corpo
              ) : b.itens.length ? (
                <ul className="flex flex-col gap-1 px-3 pb-2.5">
                  {b.itens.map((item) => (
                    <li key={item} className="truncate rounded-md bg-background px-2 py-1 text-body-md text-foreground" title={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}

              <ul className="flex flex-col border-t border-border py-1">
                {b.saidas.map((s) => {
                  const tom = TOM_DA_SAIDA[s.tom ?? "padrao"];
                  return (
                    <li key={s.id} className="relative flex h-7 items-center justify-end px-3">
                      <span className={cn("truncate text-label-md", s.para ? "text-foreground" : "text-subtle-foreground")} title={s.rotulo}>
                        {s.rotulo}
                      </span>
                      {/* a saída: arrastar daqui até outro bloco faz a ligação. A área é maior que a bolinha, para o dedo e o cursor acertarem */}
                      <span data-saida={`${b.id}:${s.id}`} aria-hidden="true" className="absolute -right-2.5 grid size-5 cursor-crosshair place-items-center">
                        {/* cheia quando liga a alguém, vazada quando o caminho ainda não tem destino */}
                        <span className={cn("size-3 rounded-full border-2 border-card", s.para ? tom.ponto : "bg-card ring-1 ring-inset ring-subtle-foreground")} />
                      </span>
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
                  ).map(([nome, valor, cor]) => (
                    <div key={nome} className="flex items-center gap-1" title={`${nome}: ${valor}`}>
                      <dt className="flex items-center">
                        <span aria-hidden="true" className={cn("size-1.5 rounded-full", cor)} />
                        <span className="sr-only">{nome}</span>
                      </dt>
                      <dd className={cn(valor > 0 && cor !== "bg-success" && "text-foreground")}>{valor}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </article>
          );
        })}

        {/* a ligação marcada ganha o botão de remover, no meio da curva */}
        {conectorAberto ? (
          <div data-fixo className="absolute left-[var(--x)] top-[var(--y)] -translate-x-1/2 -translate-y-1/2" style={{ "--x": `${conectorAberto.meio.x}px`, "--y": `${conectorAberto.meio.y}px` } as React.CSSProperties}>
            <Button
              variant="secondary"
              size="icon-xs"
              aria-label={rotulos.removerLigacao}
              title={rotulos.removerLigacao}
              onClick={() => {
                aoLigar(conectorAberto.bloco, conectorAberto.saida, undefined);
                setConectorMarcado(null);
              }}
              className="rounded-full shadow-md"
            >
              <X size={12} weight="bold" aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>

      {/* Shift + arrastar: a caixa que marca vários */}
      {marca ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-sm border border-primary bg-primary/10"
          style={{ left: Math.min(marca.x0, marca.x1), top: Math.min(marca.y0, marca.y1), width: Math.abs(marca.x1 - marca.x0), height: Math.abs(marca.y1 - marca.y0) }}
        />
      ) : null}

      {/* o ponto onde o menu e a lista de blocos se ancoram */}
      <span ref={ancora} aria-hidden="true" className="pointer-events-none absolute size-0" style={{ left: ponto?.tela.x ?? 0, top: ponto?.tela.y ?? 0 }} />
      <Menu
        aberto={Boolean(menu)}
        gatilho={ancora}
        rotulo={rotulos.maisAcoes}
        itens={itensDoMenu}
        aoFechar={() => {
          setMenu(null);
          janela.current?.focus({ preventScroll: true });
        }}
      />
      <ComboboxPainel
        aberto={Boolean(lista)}
        gatilho={ancora}
        rotulo={rotulos.adicionarBloco}
        opcoes={opcoesDaLista}
        selecionados={[]}
        aoAlternar={(tipo) => {
          if (!ponto) return;
          // ligado a uma saída, a entrada do bloco novo nasce onde a pessoa soltou
          aoAdicionar(tipo as B["tipo"], naGrade(ponto.canvas.x), naGrade(ponto.canvas.y - (lista?.ligar ? 24 : 0)), lista?.ligar);
        }}
        aoFechar={() => {
          setLista(null);
          janela.current?.focus({ preventScroll: true });
        }}
        rotulos={{ busca: rotulos.buscarBloco, vazio: rotulos.nenhumBloco }}
      />

      {/* A barra do canvas: uma caixa `card` com traço e sombra, sobre o cinza */}
      <div data-fixo className="absolute bottom-3 left-3 flex cursor-default flex-col items-start gap-2">
        {ajuda ? (
          <dl className="flex w-[300px] max-w-[calc(100vw-24px)] flex-col gap-1.5 rounded-md border border-border bg-card p-3 shadow-md motion-safe:animate-surgir">
            {rotulos.atalhos.map((a) => (
              <div key={a.gesto} className="flex items-baseline justify-between gap-3">
                <dt className="text-label-md text-foreground">{a.gesto}</dt>
                <dd className="text-right text-caption text-muted-foreground">{a.efeito}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <div className="flex items-center gap-0.5 rounded-md border border-border bg-card p-1 shadow-md">
          <Button variant="ghost" size="icon-sm" aria-label={rotulos.desfazer} title={rotulos.desfazer} disabled={!podeDesfazer} onClick={aoDesfazer}>
            <ArrowCounterClockwise size={16} weight="regular" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={rotulos.refazer} title={rotulos.refazer} disabled={!podeRefazer} onClick={aoRefazer}>
            <ArrowClockwise size={16} weight="regular" aria-hidden="true" />
          </Button>
          <span aria-hidden="true" className="mx-1 h-5 w-px bg-divider" />
          <Button variant="ghost" size="icon-sm" aria-label={rotulos.afastar} title={rotulos.afastar} disabled={vista.k <= ZOOM_MINIMO} onClick={() => comAnimacao(() => zoomNoMeio((k) => k - 0.1))}>
            <Minus size={16} weight="regular" aria-hidden="true" />
          </Button>
          <span aria-live="polite" className="w-10 text-center text-label-md tabular-nums text-muted-foreground">
            {Math.round(vista.k * 100)}%
          </span>
          <Button variant="ghost" size="icon-sm" aria-label={rotulos.aproximar} title={rotulos.aproximar} disabled={vista.k >= ZOOM_MAXIMO} onClick={() => comAnimacao(() => zoomNoMeio((k) => k + 0.1))}>
            <Plus size={16} weight="regular" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={rotulos.ajustar} title={rotulos.ajustar} onClick={() => comAnimacao(() => enquadrar())}>
            <CornersOut size={16} weight="regular" aria-hidden="true" />
          </Button>
          <span aria-hidden="true" className="mx-1 h-5 w-px bg-divider" />
          <Button variant="ghost" size="icon-sm" aria-label={rotulos.organizar} title={rotulos.organizar} onClick={organizar}>
            <TreeStructure size={16} weight="regular" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={rotulos.mapa}
            title={rotulos.mapa}
            aria-pressed={mapa}
            onClick={() => setMapa((m) => !m)}
            className={cn("hidden md:inline-flex", mapa && "bg-accent text-foreground")}
          >
            <MapTrifold size={16} weight="regular" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={rotulos.ajuda} title={rotulos.ajuda} aria-expanded={ajuda} onClick={() => setAjuda((a) => !a)} className={cn(ajuda && "bg-accent text-foreground")}>
            <Keyboard size={16} weight="regular" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {mapa && tamanho.largura ? (
        <Minimapa
          blocos={blocos}
          alturas={alturas}
          selecionados={marcados}
          vista={vista}
          tamanho={tamanho}
          rotulo={rotulos.mapa}
          aoIr={(c) => setVista((v) => ({ ...v, x: tamanho.largura / 2 - c.x * v.k, y: tamanho.altura / 2 - c.y * v.k }))}
        />
      ) : null}
    </div>
  );
}

/** O canvas, tipado sobre o bloco da tela: `aoAdicionar` e `tipos` falam o `tipo` dela. */
export const Canvas = React.forwardRef(CanvasInterno) as <B extends BlocoDoCanvas>(
  props: CanvasProps<B> & React.RefAttributes<CanvasRef>,
) => React.ReactElement | null;

/* O mapa: o fluxo inteiro em miniatura, com o retângulo do que está à vista.
   Clicar ou arrastar nele leva a tela para lá. Some abaixo de 768. */
function Minimapa({
  blocos,
  alturas,
  selecionados,
  vista,
  tamanho,
  rotulo,
  aoIr,
}: {
  blocos: BlocoDoCanvas[];
  alturas: Record<string, number>;
  selecionados: string[];
  vista: Vista;
  tamanho: { largura: number; altura: number };
  rotulo: string;
  aoIr: (canvas: Ponto) => void;
}) {
  const caixa = React.useRef<HTMLDivElement>(null);
  // o que o mapa precisa mostrar: os blocos e o que está à vista, com folga
  const visivel = { x: -vista.x / vista.k, y: -vista.y / vista.k, w: tamanho.largura / vista.k, h: tamanho.altura / vista.k };
  const x0 = Math.min(visivel.x, ...blocos.map((b) => b.x)) - 40;
  const y0 = Math.min(visivel.y, ...blocos.map((b) => b.y)) - 40;
  const x1 = Math.max(visivel.x + visivel.w, ...blocos.map((b) => b.x + LARGURA_DO_BLOCO)) + 40;
  const y1 = Math.max(visivel.y + visivel.h, ...blocos.map((b) => b.y + (alturas[b.id] ?? ALTURA_ESTIMADA))) + 40;
  const s = Math.min(MAPA.largura / (x1 - x0), MAPA.altura / (y1 - y0));
  const dx = (MAPA.largura - (x1 - x0) * s) / 2;
  const dy = (MAPA.altura - (y1 - y0) * s) / 2;
  const noMapa = (x: number, y: number) => ({ left: dx + (x - x0) * s, top: dy + (y - y0) * s });

  const ir = (e: React.PointerEvent) => {
    const r = caixa.current!.getBoundingClientRect();
    aoIr({ x: (e.clientX - r.left - dx) / s + x0, y: (e.clientY - r.top - dy) / s + y0 });
  };

  return (
    <div
      ref={caixa}
      data-fixo
      role="img"
      aria-label={rotulo}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        ir(e);
      }}
      onPointerMove={(e) => {
        if (e.buttons & 1) ir(e);
      }}
      style={{ width: MAPA.largura, height: MAPA.altura }}
      className="absolute bottom-3 right-3 hidden cursor-pointer touch-none overflow-hidden rounded-md border border-border bg-card shadow-md md:block"
    >
      {blocos.map((b) => (
        <span
          key={b.id}
          className={cn("absolute rounded-sm", selecionados.includes(b.id) ? "bg-primary" : "bg-divider")}
          style={{ ...noMapa(b.x, b.y), width: LARGURA_DO_BLOCO * s, height: (alturas[b.id] ?? ALTURA_ESTIMADA) * s }}
        />
      ))}
      <span className="absolute rounded-sm border border-primary bg-primary/10" style={{ ...noMapa(visivel.x, visivel.y), width: visivel.w * s, height: visivel.h * s }} />
    </div>
  );
}
