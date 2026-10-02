"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  ArrowsOut,
  CaretDown,
  CaretRight,
  CaretUp,
  PushPin,
  EnvelopeSimple,
  Minus,
  Phone,
  Plus,
  SidebarSimple,
  X,
  type Icon,
} from "@phosphor-icons/react";
import { Avatar } from "@/components/ui/avatar";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";
import { useCamada } from "@/lib/use-camada";
import { useMontado, useSaida } from "@/lib/use-saida";
import { Scrim } from "@/components/ui/modal";

import { foco, rolagemDiscreta } from "@/lib/estados";
/**
 * Drawer do lead — canvas "↳ Drawer" do Figma (node 533:3809).
 *
 * O component set `Drawer` (565:5959) tem um eixo `Menu` com cinco valores:
 * Histórico, Perfil, Campos adicionais, Negócios e Hierarquia. Em código isso
 * NÃO vira prop — o eixo é o item escolhido no menu, e cada valor é só o
 * conteúdo da coluna direita. O que é componente:
 *
 *   Drawer          a camada: scrim, foco preso, Escape
 *   DrawerPainel    a caixa de 840px (arrastável pela borda esquerda, até 1080) com raio à esquerda e elevação xl
 *   DrawerPerfil    a coluna de 320px ("Profile section", 565:6448)
 *   DrawerBloco     "header info" recolhível + o que vem embaixo
 *   DrawerMetricas  "Card info" (563:4737)
 *   DrawerContato   "Row" (563:4363)
 *   DrawerMenu      "Drawer / Menu" + "Menu Item" (556:3331 · 556:428)
 *   DrawerConteudo  a coluna da direita: título, ações, divisória e corpo
 *   DrawerSecao     "header info" com linha, dentro do conteúdo
 *   LinhaDoTempo    os eventos do Histórico
 *   HierarquiaNo    "Hierarchy Node" (597:2929)
 *   HierarquiaCanvas  a área pontilhada com os controles de zoom
 *
 * O estilo do perfil (`outline` ou `fill`) é um só para a coluna inteira, então
 * desce por contexto em vez de ser repetido em cada bloco.
 */

type EstiloPerfil = "outline" | "fill";
const EstiloDoPerfil = React.createContext<EstiloPerfil>("outline");
const useEstilo = (forcado?: EstiloPerfil) => {
  const herdado = React.useContext(EstiloDoPerfil);
  return forcado ?? herdado;
};

/* ----------------------------------------------------------------- Camada -- */

export interface DrawerProps {
  aberto: boolean;
  aoFechar: () => void;
  /** Nome da camada para leitor de tela. Ex.: "Lead Rafael Pinto Pinheiro". */
  rotulo: string;
  children: React.ReactNode;
}

/**
 * A camada que abre pela direita. O arquivo desenha só o painel; o scrim, o
 * foco preso e o Escape são o que um modal lateral precisa para ser usável
 * por teclado. A opacidade do scrim (40%) é derivação — ver Drawer.md.
 */
export function Drawer({ aberto, aoFechar, rotulo, children }: DrawerProps) {
  const painel = React.useRef<HTMLDivElement>(null);
  const montado = useMontado();
  // Fechar tem que ser visto: o painel fica no ar enquanto desliza para fora
  // (lib/use-saida.ts — nasceu aqui e saiu para o Modal e os painéis usarem).
  const { saindo } = useSaida(aberto);
  // Foco preso, Escape, rolagem travada com a barra compensada e foco devolvido:
  // a mesma camada do Modal (lib/use-camada.ts), com pilha — um modal aberto
  // de dentro do drawer é quem escuta o teclado.
  useCamada(montado && aberto, painel, aoFechar);

  if (!montado || (!aberto && !saindo)) return null;
  return createPortal(
    <div className={cn("fixed inset-0 z-modal flex justify-end", saindo && "pointer-events-none")}>
      <Scrim saindo={saindo} onClick={aoFechar} />
      <div
        ref={painel}
        role="dialog"
        aria-modal="true"
        aria-label={rotulo}
        aria-hidden={saindo || undefined}
        tabIndex={-1}
        className={cn(
          "relative flex h-full max-w-full focus:outline-none",
          saindo ? "motion-safe:animate-drawer-sai" : "motion-safe:animate-drawer-entra",
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

/** Largura com que o painel abre e limites do arrasto, em px. O arquivo
 *  desenha 1080; o cliente pediu menos tela ocupada e a opção de ajustar
 *  (2026-09-28, ADR-040) — o 1080 do arquivo virou o teto do arrasto. */
export const LARGURA_DO_PAINEL = 840;
export const LARGURA_MINIMA_DO_PAINEL = 720;
export const LARGURA_MAXIMA_DO_PAINEL = 1080;
/** Setas na alça: 16px (64 com Shift), como na coluna da tabela. */
const PASSO_DA_ALCA = 16;
/** Nome da alça. `rotuloRedimensionar` troca pelo texto do idioma. */
export const ROTULO_DE_REDIMENSIONAR = "Redimensionar painel";

export interface DrawerPainelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Largura inicial, em px. Padrão 840. */
  largura?: number;
  /** Chave do navegador que lembra a largura arrastada (ex.: "pipeline-lead"). */
  memoria?: string;
  /** Nome da alça para leitor de tela. Padrão "Redimensionar painel". */
  rotuloRedimensionar?: string;
  /** Sem alça: o painel fica na `largura`. */
  fixo?: boolean;
}

/* Entre o mínimo e o máximo — e nunca mais que a janela menos 48. */
function limitarLargura(v: number) {
  const teto = typeof window === "undefined" ? LARGURA_MAXIMA_DO_PAINEL : Math.min(LARGURA_MAXIMA_DO_PAINEL, window.innerWidth - 48);
  return Math.round(Math.min(Math.max(v, LARGURA_MINIMA_DO_PAINEL), Math.max(LARGURA_MINIMA_DO_PAINEL, teto)));
}

/** A caixa do drawer. Raio só à esquerda: o lado direito encosta na tela.
 *  Com altura definida (a tela inteira, na camada), perfil e conteúdo rolam
 *  cada um por conta própria. A borda esquerda é a alça: sob o cursor aparece
 *  um traço de 3px em `divider` e o arrasto muda a largura (720 a 1080);
 *  `memoria` guarda a medida no navegador. */
export function DrawerPainel({
  largura = LARGURA_DO_PAINEL,
  memoria,
  rotuloRedimensionar = ROTULO_DE_REDIMENSIONAR,
  fixo,
  className,
  style,
  children,
  ...props
}: DrawerPainelProps) {
  const [atual, setAtual] = React.useState(largura);
  // a memória entra depois de montar: no servidor não há localStorage
  React.useEffect(() => {
    if (!memoria) return;
    try {
      const guardada = Number(localStorage.getItem(`ds:drawer:${memoria}`));
      if (guardada) setAtual(limitarLargura(guardada));
    } catch {
      // sem armazenamento: fica na largura inicial
    }
  }, [memoria]);

  function definir(v: number) {
    const l = limitarLargura(v);
    setAtual(l);
    if (!memoria) return;
    try {
      localStorage.setItem(`ds:drawer:${memoria}`, String(l));
    } catch {
      // sem armazenamento: a medida vale só enquanto o painel estiver aberto
    }
  }

  /* Arrastar para a esquerda alarga: o painel cresce a partir da borda direita. */
  function alcaPonteiro(e: React.PointerEvent<HTMLSpanElement>) {
    if (e.button !== 0) return;
    e.preventDefault();
    const inicio = e.clientX;
    const base = atual;
    const alca = e.currentTarget;
    alca.setPointerCapture(e.pointerId);
    const mover = (ev: PointerEvent) => definir(base + (inicio - ev.clientX));
    const soltar = () => {
      alca.removeEventListener("pointermove", mover);
      alca.removeEventListener("pointerup", soltar);
      alca.removeEventListener("pointercancel", soltar);
    };
    alca.addEventListener("pointermove", mover);
    alca.addEventListener("pointerup", soltar);
    alca.addEventListener("pointercancel", soltar);
  }

  function alcaTeclado(e: React.KeyboardEvent) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const passo = (e.shiftKey ? 4 : 1) * PASSO_DA_ALCA;
    definir(atual + (e.key === "ArrowLeft" ? passo : -passo));
  }

  return (
    <div
      // dentro do drawer os controles são compactos: Button `md` e `icon` medem 28 (humano, 2026-10-02) — ver `alturaCompacta`
      data-compacto=""
      className={cn(
        "relative flex h-full max-w-full shrink-0 items-stretch overflow-hidden rounded-l-xl border border-border bg-card shadow-xl",
        className,
      )}
      style={{ width: atual, ...style }}
      {...props}
    >
      {children}
      {fixo ? null : (
        <span
          role="separator"
          aria-orientation="vertical"
          aria-label={rotuloRedimensionar}
          aria-valuenow={atual}
          aria-valuemin={LARGURA_MINIMA_DO_PAINEL}
          aria-valuemax={LARGURA_MAXIMA_DO_PAINEL}
          tabIndex={0}
          onPointerDown={alcaPonteiro}
          onKeyDown={alcaTeclado}
          className={cn(
            "absolute inset-y-0 left-0 z-dropdown w-2 cursor-col-resize touch-none outline-none",
            // o traço de 3px é um pseudo-elemento: `divider` sob o cursor, `primary` no foco
            "after:absolute after:inset-y-0 after:left-0 after:w-[3px] after:bg-transparent after:transition-colors hover:after:bg-divider focus-visible:after:bg-primary",
          )}
        />
      )}
    </div>
  );
}

/** Botão quadrado de 24px do canto do perfil (eram 29, com caixa `card` sobre o degradê — os dois saíram). Exportado para quem precisar
 *  reabrir o perfil recolhido a partir do conteúdo. */
export function DrawerBotaoCanto({
  rotulo,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { rotulo: string }) {
  return (
    <button
      type="button"
      aria-label={rotulo}
      title={rotulo}
      // O arquivo tem raio 9,67 — instância escalada. Vai o degrau lg (8px).
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        foco,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ----------------------------------------------------------------- Perfil -- */

/** Cor do topo do perfil. Os valores moram em `app/globals.css` (`[data-tom]`). */
export type TomPerfil =
  | "azul"
  | "indigo"
  | "roxo"
  | "fucsia"
  | "rosa"
  | "vermelho"
  | "laranja"
  | "ambar"
  | "amarelo"
  | "lima"
  | "verde"
  | "turquesa"
  | "ciano"
  | "marrom";

/** Rolagem de coluna: barra fina que só aparece sob o cursor (cliente, 2026-09-24) e sem arrastar a página junto no fim. */
const rolagemDeColuna = `min-h-0 overflow-y-auto overscroll-contain ${rolagemDiscreta}`;

/** Tem conteúdo acima? E abaixo? Reage à rolagem e a mudança de tamanho —
 *  recolher um bloco do perfil muda o que sobra para rolar. */
function usarRolagem(alvo: React.RefObject<HTMLElement | null>) {
  const [estado, setEstado] = React.useState({ acima: false, abaixo: false });

  React.useEffect(() => {
    const el = alvo.current;
    if (!el) return;
    const medir = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      // 4px de folga: arredondamento de zoom não vale como "tem mais conteúdo"
      setEstado({ acima: scrollTop > 4, abaixo: scrollTop + clientHeight < scrollHeight - 4 });
    };
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    for (const filho of Array.from(el.children)) observador.observe(filho);
    return () => {
      el.removeEventListener("scroll", medir);
      observador.disconnect();
    };
  }, [alvo]);

  return estado;
}

export type RotulosDeRolagem = { subir: string; descer: string };

/** Nomes de fábrica das setas. Toda seta é clicável; a tela só troca o texto. */
export const ROTULOS_DE_ROLAGEM: RotulosDeRolagem = { subir: "Subir", descer: "Descer" };

/**
 * Seta que diz que a coluna continua além da borda.
 *
 * Sai da própria superfície: uma faixa da cor do `card` atravessa a coluna
 * inteira e some em degradê, abrindo espaço para a seta sem cortar o conteúdo
 * que passa por baixo. A faixa não recebe clique; a pastilha, sim.
 *
 * Cada seta é sempre um botão que rola quase uma tela: seta que parece clicável
 * e não é vira reclamação. O nome vem de `ROTULOS_DE_ROLAGEM` e a tela troca
 * pelo texto do contexto — botão sem nome não entra no DS (regra E7).
 */
function IndicadorDeRolagem({
  acima,
  abaixo,
  alvo,
  rotulos,
}: {
  acima: boolean;
  abaixo: boolean;
  alvo: React.RefObject<HTMLElement | null>;
  rotulos: RotulosDeRolagem;
}) {
  const pastilha =
    "flex size-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors";

  function rolar(direcao: 1 | -1) {
    const el = alvo.current;
    if (!el) return;
    // 80% da altura visível: sobra contexto entre um clique e o outro
    el.scrollBy({ top: direcao * el.clientHeight * 0.8, behavior: "smooth" });
  }

  const seta = (direcao: 1 | -1, visivel: boolean) => {
    const cima = direcao === -1;
    const Glifo = cima ? CaretUp : CaretDown;
    const conteudo = <Glifo size={14} weight="bold" aria-hidden="true" />;
    return (
      // A faixa é a "sombrinha": cobre a largura inteira da coluna e some em
      // degradê na direção do conteúdo, para a seta nunca encostar no texto.
      // Ela não recebe clique — só a pastilha, que fica acima dela.
      <span
        className={cn(
          "pointer-events-none absolute inset-x-0 z-dropdown flex h-12 justify-center from-card via-card/85 transition-opacity",
          cima ? "top-0 items-start bg-gradient-to-b pt-1" : "bottom-0 items-end bg-gradient-to-t pb-1",
          !visivel && "opacity-0",
        )}
      >
        <button
          type="button"
          tabIndex={visivel ? 0 : -1}
          aria-label={cima ? rotulos.subir : rotulos.descer}
          title={cima ? rotulos.subir : rotulos.descer}
          onClick={() => rolar(direcao)}
          className={cn(
            pastilha,
            "hover:bg-accent hover:text-foreground",
            foco,
            visivel ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          {conteudo}
        </button>
      </span>
    );
  };

  return (
    <>
      {seta(-1, acima)}
      {seta(1, abaixo)}
    </>
  );
}

export interface DrawerPerfilProps {
  nome: string;
  telefone?: string;
  email?: string;
  /** Pessoa ou empresa: muda o ícone da tag sobre o avatar. */
  tipo: "pessoa" | "empresa";
  /** Cor do anel, da inicial e da tag de tipo. Padrão:
   *  `azul` para pessoa e `roxo` para empresa, como o arquivo desenha. */
  tom?: TomPerfil;
  /** O texto da tag de tipo. Vem de fora (i18n). Ex.: "Pessoa". */
  rotuloTipo: string;
  /** `outline` desenha as caixas com traço; `fill`, com fundo. */
  estilo?: EstiloPerfil;
  /** A fileira de tags do lead. */
  tags?: React.ReactNode;
  /** Os dois botões sob as tags. */
  acoes?: React.ReactNode;
  /** Com eles, as setas de rolagem viram botões. Sem, são só decoração. */
  rotulosRolagem?: RotulosDeRolagem;
  aoFechar?: () => void;
  rotuloFechar?: string;
  aoRecolher?: () => void;
  rotuloRecolher?: string;
  /** Os blocos: métricas, contato, menu. */
  children?: React.ReactNode;
  className?: string;
}

export function DrawerPerfil({
  nome,
  telefone,
  email,
  tipo,
  tom,
  rotuloTipo,
  estilo = "outline",
  tags,
  acoes,
  rotulosRolagem = ROTULOS_DE_ROLAGEM,
  aoFechar,
  rotuloFechar = "Fechar",
  aoRecolher,
  rotuloRecolher = "Recolher perfil",
  children,
  className,
}: DrawerPerfilProps) {
  const coluna = React.useRef<HTMLElement>(null);
  const { acima, abaixo } = usarRolagem(coluna);

  return (
    <EstiloDoPerfil.Provider value={estilo}>
      {/* A casca não rola: é ela que segura o indicador parado na borda.
          No uso normal a coluna nem rola — quem rola é o menu (DrawerBloco
          rolagem), depois a área dos blocos; a coluna só rolaria se nem o
          cabeçalho coubesse. */}
      <div
        data-tom={tom ?? (tipo === "empresa" ? "roxo" : "azul")}
        // plano: o degradê do topo saiu (humano, 2026-10-02). O tom segue no anel e na letra do avatar e na tag de tipo.
        className={cn("relative flex w-[320px] shrink-0 border-r border-border bg-card", className)}
      >
      <aside
        ref={coluna}
        aria-label={nome}
        className={cn(
          // D14: 16px de recuo com o traço direito por dentro — 15 + 1 aqui.
          "flex w-full flex-col py-4 pl-4 pr-[15px]",
          rolagemDeColuna,
        )}
      >
        <div className="relative flex shrink-0 flex-col items-center">
          <div className="relative flex w-full flex-col items-center gap-3 pt-1">
            <div className="flex flex-col items-center gap-1">
              <Avatar nome={nome} size="lg" aria-hidden="true" className="border-tom-anel text-tom-texto" />
              <h2 className="text-center text-h1 text-foreground">{nome}</h2>
              {/* A tag de tipo fica no fluxo, sob o nome. No arquivo ela flutua sobre a
                  borda do avatar; o cliente apontou que "flutua solta, sem se conectar
                  ao card" (2026-09-28), o mesmo defeito do botão redondo da sidebar. */}
              <Tag tipo={tipo} className="text-tom-tag">
                {rotuloTipo}
              </Tag>
              {telefone ? (
                <p className="flex items-start justify-center gap-1 text-label-sm text-foreground">
                  <Phone size={15} weight="regular" aria-hidden="true" className="shrink-0" />
                  {telefone}
                </p>
              ) : null}
              {email ? (
                <p className="flex items-start justify-center gap-1 text-label-sm text-foreground">
                  <EnvelopeSimple size={15} weight="regular" aria-hidden="true" className="shrink-0" />
                  {email}
                </p>
              ) : null}
            </div>
            {tags ? <div className="flex w-full flex-wrap items-center justify-center gap-1">{tags}</div> : null}
            {acoes ? <div className="flex items-start justify-center gap-2">{acoes}</div> : null}
          </div>

          {aoFechar || aoRecolher ? (
            <div className="absolute left-0 top-0 flex w-full items-center justify-between">
              {aoFechar ? (
                <DrawerBotaoCanto rotulo={rotuloFechar} onClick={aoFechar}>
                  <X size={16} weight="regular" aria-hidden="true" />
                </DrawerBotaoCanto>
              ) : (
                <span />
              )}
              {aoRecolher ? (
                <DrawerBotaoCanto rotulo={rotuloRecolher} onClick={aoRecolher}>
                  <SidebarSimple size={12} weight="regular" aria-hidden="true" />
                </DrawerBotaoCanto>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Os blocos ocupam o que sobra da coluna; o que tem `rolagem` (o menu)
            cresce e rola por dentro. Se nem o mínimo do menu couber, é esta
            área dos blocos que rola — o cabeçalho com nome e telefone fica. */}
        {children ? (
          <div className={cn("flex min-h-0 flex-1 flex-col gap-3 pt-3", rolagemDeColuna)}>{children}</div>
        ) : null}
      </aside>
      <IndicadorDeRolagem acima={acima} abaixo={abaixo} alvo={coluna} rotulos={rotulosRolagem} />
      </div>
    </EstiloDoPerfil.Provider>
  );
}

/** "header info" recolhível: título em caixa alta e o caret. */
export function DrawerBloco({
  titulo,
  inicialAberto = true,
  acoes,
  rolagem,
  children,
}: {
  titulo: string;
  inicialAberto?: boolean;
  /**
   * Controle do bloco, na linha do título — é onde o olho procura.
   * Fica FORA do botão de abrir/fechar: botão dentro de botão é inválido.
   */
  acoes?: React.ReactNode;
  /**
   * Com eles, o bloco ocupa o que sobra da coluna e o conteúdo rola POR
   * DENTRO, com as setas na borda — é o menu. Cliente (2026-09-18): quem
   * rola é o menu, não o perfil; nome e telefone ficam sempre à vista.
   */
  rolagem?: RotulosDeRolagem;
  children: React.ReactNode;
}) {
  const [aberto, setAberto] = React.useState(inicialAberto);
  const id = React.useId().replace(/:/g, "");
  const conteudo = React.useRef<HTMLDivElement>(null);
  const { acima, abaixo } = usarRolagem(conteudo);
  return (
    <section className={cn("flex flex-col gap-0.5", rolagem ? "min-h-0 flex-1" : "shrink-0")}>
      <div className="flex shrink-0 items-center gap-2">
        <h3 className="min-w-0 flex-1">
          <button
            type="button"
            aria-expanded={aberto}
            aria-controls={`bloco-${id}`}
            onClick={() => setAberto((a) => !a)}
            className={cn(
              // tamanho do body-sm com peso e entrelinha do heading-4: é a mistura do arquivo
              "flex w-full items-center justify-between rounded-sm text-body-sm font-semibold leading-[18px] uppercase text-muted-foreground transition-colors hover:text-foreground",
              foco,
            )}
          >
            {titulo}
            {acoes ? null : (
              <CaretDown
                size={16}
                weight="regular"
                aria-hidden="true"
                className={cn("shrink-0 transition-transform", !aberto && "-rotate-90")}
              />
            )}
          </button>
        </h3>
        {acoes ? (
          <>
            {acoes}
            <button
              type="button"
              aria-expanded={aberto}
              aria-controls={`bloco-${id}`}
              aria-label={titulo}
              onClick={() => setAberto((a) => !a)}
              className={cn("shrink-0 rounded-sm text-muted-foreground transition-colors hover:text-foreground", foco)}
            >
              <CaretDown
                size={16}
                weight="regular"
                aria-hidden="true"
                className={cn("transition-transform", !aberto && "-rotate-90")}
              />
            </button>
          </>
        ) : null}
      </div>
      {rolagem ? (
        // min-h-20: dois itens à vista no mínimo — "um scroll pequenininho" que
        // o cliente aceitou em troca do nome sempre visível. Se nem isso couber,
        // a área dos blocos do perfil rola, não o cabeçalho.
        <div className="relative min-h-20 flex-1" hidden={!aberto}>
          <div id={`bloco-${id}`} ref={conteudo} className={cn("h-full", rolagemDeColuna)}>
            {children}
          </div>
          <IndicadorDeRolagem acima={acima} abaixo={abaixo} alvo={conteudo} rotulos={rolagem} />
        </div>
      ) : (
        <div id={`bloco-${id}`} hidden={!aberto}>
          {children}
        </div>
      )}
    </section>
  );
}

export type MetricaDrawer = {
  rotulo: string;
  valor: string;
  /** Ícone de 16px no canto do cartão, na cor do tom. */
  icone?: Icon;
  /** Tom do cartão. Sem ele, herda o tom do perfil em volta. */
  tom?: TomPerfil;
};

/** "Card info": rótulo em caption e número em metric. */
export function DrawerMetricas({
  itens,
  colunas = 2,
  estilo,
  className,
}: {
  itens: MetricaDrawer[];
  /** 2 no perfil; 4 em linha no conteúdo de Negócios. */
  colunas?: 2 | 4;
  estilo?: EstiloPerfil;
  className?: string;
}) {
  const e = useEstilo(estilo);
  return (
    <dl className={cn("grid gap-1.5", colunas === 4 ? "grid-cols-4" : "grid-cols-2", className)}>
      {itens.map((m) => (
        <div
          key={m.rotulo}
          data-tom={m.tom}
          className={cn(
            "flex min-w-0 flex-col gap-0.5 rounded-md px-2 py-2",
            // Plano, com traço: o gradiente que separava o cartão do fundo saiu
            // com o do topo do perfil (humano, 2026-10-02).
            e === "outline" ? "border border-border" : "bg-background",
          )}
        >
          <dt className="flex items-center justify-between gap-2 text-caption text-muted-foreground">
            <span className="min-w-0 truncate">{m.rotulo}</span>
            {m.icone ? <m.icone size={16} weight="regular" aria-hidden="true" className="shrink-0 text-tom-texto" /> : null}
          </dt>
          <dd className="truncate text-metric text-foreground">{m.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

export type LinhaContato = { texto: string; icone: Icon; rotulo: string };

/** "Row": uma linha por dado, ícone à direita. */
export function DrawerContato({ linhas, estilo }: { linhas: LinhaContato[]; estilo?: EstiloPerfil }) {
  const e = useEstilo(estilo);
  return (
    <ul
      className={cn(
        "flex flex-col gap-2 rounded-lg",
        e === "outline" ? "border-2 border-background p-2.5" : "bg-background p-3",
      )}
    >
      {linhas.map((l) => {
        const Icone = l.icone;
        return (
          <li key={l.texto} className="flex items-start justify-between gap-2">
            <span className="min-w-0 truncate text-label-lg text-foreground">
              <span className="sr-only">{l.rotulo}: </span>
              {l.texto}
            </span>
            <Icone size={15} weight="regular" aria-hidden="true" className="shrink-0 text-muted-foreground" />
          </li>
        );
      })}
    </ul>
  );
}

export type ItemMenuDrawer = { id: string; rotulo: string; icone: Icon };

export interface FixacaoDoMenu {
  /** Ids fixados, na ordem em que aparecem no topo. */
  fixados: string[];
  aoAlternar: (id: string) => void;
  /** Ex.: (item) => `Fixar ${item.rotulo} no topo`. */
  rotuloFixar: (item: ItemMenuDrawer) => string;
  rotuloDesafixar: (item: ItemMenuDrawer) => string;
}

function ItemDoMenu({
  item,
  selecionado,
  fixado,
  aoEscolher,
  fixacao,
}: {
  item: ItemMenuDrawer;
  selecionado: boolean;
  fixado: boolean;
  aoEscolher?: (id: string) => void;
  fixacao?: FixacaoDoMenu;
}) {
  const Icone = item.icone;
  return (
    <li className="group/item relative">
      <button
        type="button"
        aria-current={selecionado ? "true" : undefined}
        onClick={() => aoEscolher?.(item.id)}
        className={cn(
          // 32px = 7 + 18 + 7 (eram 36: "gaps menores", humano, 2026-10-02). O recuo de 8 à esquerda é o gap do arquivo.
          "flex w-full items-center justify-between rounded-md py-[7px] pl-2 pr-2.5 text-left text-label-lg transition-colors",
          foco,
          // com o alfinete à direita, o caret recua para não ficar embaixo dele
          fixacao && "pr-9",
          selecionado
            ? "bg-nav-item-selected text-nav-item-selected-foreground"
            : "text-foreground hover:bg-nav-item-hover",
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Icone
            size={18} // check-tokens:ignore icone-fora-da-escala — 18 é a medida do item do arquivo (556:428)
            weight="regular"
            aria-hidden="true"
            className={cn("shrink-0", selecionado ? "text-nav-item-selected-icon" : "text-nav-item")}
          />
          <span className="truncate">{item.rotulo}</span>
        </span>
        {selecionado ? (
          <CaretRight size={14} weight="regular" aria-hidden="true" className="shrink-0 text-nav-item-selected-icon" />
        ) : null}
      </button>

      {fixacao ? (
        // Fora do <button> de propósito: botão dentro de botão é HTML inválido.
        <button
          type="button"
          aria-pressed={fixado}
          aria-label={fixado ? fixacao.rotuloDesafixar(item) : fixacao.rotuloFixar(item)}
          title={fixado ? fixacao.rotuloDesafixar(item) : fixacao.rotuloFixar(item)}
          onClick={() => fixacao.aoAlternar(item.id)}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-0.5 transition-opacity",
            foco,
            // fixado fica sempre à vista; o resto só sob o cursor ou no foco
            fixado
              ? "text-nav-item-selected-icon"
              : "text-nav-item opacity-0 group-hover/item:opacity-100 focus-visible:opacity-100",
          )}
        >
          <PushPin size={14} weight={fixado ? "fill" : "regular"} aria-hidden="true" />
        </button>
      ) : null}
    </li>
  );
}

/** "Drawer / Menu": a lista que troca o conteúdo da direita. */
export function DrawerMenu({
  itens,
  atual,
  aoEscolher,
  rotulo,
  estilo,
  fixacao,
}: {
  itens: ItemMenuDrawer[];
  atual: string;
  aoEscolher?: (id: string) => void;
  /** Nome da navegação para leitor de tela. Ex.: "Seções do lead". */
  rotulo: string;
  estilo?: EstiloPerfil;
  /** Liga o alfinete de cada item. Sem ela, o menu é só a lista do arquivo. */
  fixacao?: FixacaoDoMenu;
}) {
  const e = useEstilo(estilo);

  // Fixados sobem na ordem em que foram fixados; o resto segue a ordem original.
  const fixados = fixacao ? (fixacao.fixados.map((id) => itens.find((i) => i.id === id)).filter(Boolean) as ItemMenuDrawer[]) : [];
  const resto = itens.filter((i) => !fixacao?.fixados.includes(i.id));

  const linha = (item: ItemMenuDrawer, fixado: boolean) => (
    <ItemDoMenu
      key={item.id}
      item={item}
      selecionado={item.id === atual}
      fixado={fixado}
      aoEscolher={aoEscolher}
      fixacao={fixacao}
    />
  );

  // Só lista, uma coluna (cliente, reunião de 2026-09-18): a grade de cards
  // de duas colunas "parecia mobile" e saiu.
  return (
    <nav
      aria-label={rotulo}
      className={cn(
        "rounded-lg",
        // No outline o traço de 2px fica POR DENTRO e o menu não tem recuo
        // vertical: anel interno em vez de borda, senão a caixa cresce 4px.
        e === "outline" ? "px-1 ring-2 ring-inset ring-background" : "bg-background p-2",
      )}
    >
      {fixados.length > 0 ? (
        <>
          <ul className="flex flex-col">{fixados.map((item) => linha(item, true))}</ul>
          {resto.length > 0 ? (
            // Separa sem título: o alfinete cheio já diz por que aqueles estão em cima.
            <div aria-hidden="true" className="my-1 h-0.5 bg-background" />
          ) : null}
        </>
      ) : null}

      <ul className="flex flex-col">{resto.map((item) => linha(item, false))}</ul>
    </nav>
  );
}

/* --------------------------------------------------------------- Conteúdo -- */

export function DrawerConteudo({
  titulo,
  descricao,
  acoes,
  antesDoTitulo,
  rotulosRolagem = ROTULOS_DE_ROLAGEM,
  children,
  className,
}: {
  titulo: string;
  descricao?: string;
  /** Botões à direita do título. No arquivo: filtro e comentário. */
  acoes?: React.ReactNode;
  /** Algo antes do título — ex.: o botão que reabre o perfil recolhido. */
  antesDoTitulo?: React.ReactNode;
  /** Com eles, as setas de rolagem viram botões. Sem, são só decoração. */
  rotulosRolagem?: RotulosDeRolagem;
  children?: React.ReactNode;
  className?: string;
}) {
  const id = React.useId().replace(/:/g, "");
  const coluna = React.useRef<HTMLElement>(null);
  const { acima, abaixo } = usarRolagem(coluna);

  return (
    <div className={cn("relative flex min-w-0 flex-1 bg-card", className)}>
    <section
      ref={coluna}
      aria-labelledby={`titulo-${id}`}
      className={cn("flex w-full flex-col gap-3 py-4", rolagemDeColuna)}
    >
      <div className="flex shrink-0 flex-col gap-4">
        <div className="flex items-center justify-between gap-4 px-4">
          <div className="flex min-w-0 items-center gap-3">
            {antesDoTitulo}
            <div className="flex min-w-0 flex-col gap-0.5">
              <h2 id={`titulo-${id}`} className="text-h1 text-foreground">
                {titulo}
              </h2>
              {descricao ? <p className="text-body-sm text-muted-foreground">{descricao}</p> : null}
            </div>
          </div>
          {acoes ? <div className="flex shrink-0 items-center gap-2">{acoes}</div> : null}
        </div>
        <div aria-hidden="true" className="h-px w-full bg-border" />
      </div>
      {children ? <div className="flex shrink-0 flex-col gap-3 px-4">{children}</div> : null}
    </section>
    <IndicadorDeRolagem acima={acima} abaixo={abaixo} alvo={coluna} rotulos={rotulosRolagem} />
    </div>
  );
}

/** "header info" com linha: o título de cada grupo dentro do conteúdo. */
export function DrawerSecao({
  titulo,
  children,
  className,
}: {
  titulo: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-2", className)}>
      {/* sem traço por baixo (decisão do humano, 2026-09-18): os cartões dos
          campos já separam os grupos, e a linha virava um segundo separador */}
      <h3 className="text-body-sm font-semibold leading-[18px] uppercase text-muted-foreground">
        {titulo}
      </h3>
      {children}
    </section>
  );
}

/* --------------------------------------------------------- Linha do tempo -- */

export type EventoLinhaDoTempo = {
  id: string;
  titulo: string;
  /** Quem, quando, a que horas. Saem separados por " · ". */
  detalhes: string[];
  icone: Icon;
};

export function LinhaDoTempo({ eventos, className }: { eventos: EventoLinhaDoTempo[]; className?: string }) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {eventos.map((ev, i) => {
        const Icone = ev.icone;
        const ultimo = i === eventos.length - 1;
        return (
          <li key={ev.id} className="flex min-h-16 gap-3">
            <div aria-hidden="true" className="flex w-8 shrink-0 flex-col items-center">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                <Icone size={16} weight="regular" />
              </span>
              {ultimo ? null : <span className="w-px flex-1 bg-border" />}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 pb-5 pt-1.5">
              <p className="text-label-lg text-foreground">{ev.titulo}</p>
              <p className="whitespace-pre-wrap text-caption text-muted-foreground">{ev.detalhes.join("  ·  ")}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------- Hierarquia -- */

export interface HierarquiaNoProps extends React.HTMLAttributes<HTMLDivElement> {
  nome: string;
  subtitulo: string;
  /** Relação com a empresa atual. Ex.: "Empresa mãe". */
  tipo: string;
  /** A empresa do lead aberto: traço de 2px em `primary`. */
  atual?: boolean;
  /** Botão de recolher os filhos. Sem ele, o nó não tem o "–". */
  recolher?: { rotulo: string; aoClicar: () => void; recolhido?: boolean };
}

export function HierarquiaNo({ nome, subtitulo, tipo, atual, recolher, className, ...props }: HierarquiaNoProps) {
  return (
    <div
      aria-current={atual ? "true" : undefined}
      className={cn(
        // Aqui o traço conta no tamanho (o nó atual tem 140 e os outros 138),
        // então é borda + p-3, sem a conta da D14.
        "flex w-[176px] flex-col items-center gap-2 rounded-md bg-card p-3",
        atual ? "border-2 border-primary" : "border border-border",
        className,
      )}
      {...props}
    >
      <div className="flex w-full items-start justify-between gap-1">
        <Tag>{tipo}</Tag>
        {recolher ? (
          <button
            type="button"
            aria-label={recolher.rotulo}
            title={recolher.rotulo}
            aria-expanded={!recolher.recolhido}
            onClick={recolher.aoClicar}
            className={cn("rounded-sm text-muted-foreground transition-colors hover:text-foreground", foco)}
          >
            {/* recolhido vira "+": o arquivo só desenha o "–" */}
            {recolher.recolhido ? (
              <Plus size={16} weight="regular" aria-hidden="true" />
            ) : (
              <Minus size={16} weight="regular" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>
      <div className="flex flex-col items-center">
        <Avatar nome={nome} size="md" aria-hidden="true" />
        <p className="text-h4 text-foreground">{nome}</p>
        <p className="text-body-sm text-muted-foreground">{subtitulo}</p>
      </div>
    </div>
  );
}

function BotaoZoom({ rotulo, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { rotulo: string }) {
  return (
    <button
      type="button"
      aria-label={rotulo}
      title={rotulo}
      className={cn("flex rounded-sm bg-card p-1.5 text-foreground transition-colors hover:bg-accent", foco)}
      {...props}
    >
      {children}
    </button>
  );
}

/** A área da árvore. Os nós e as linhas vêm de fora, posicionados num
 *  desenho de `largura` × `altura` (656 × 540, o do arquivo). O zoom inicial
 *  é o que faz o desenho caber na largura da caixa (nunca mais que 1) e é
 *  medido de novo quando o painel muda de largura pela alça; a caixa encolhe
 *  na mesma proporção. "Ajustar" volta a esse zoom. */
export function HierarquiaCanvas({
  rotulos,
  largura = 656,
  altura = 540,
  children,
  className,
}: {
  rotulos: { aproximar: string; afastar: string; ajustar: string };
  /** Largura e altura do desenho, em px. */
  largura?: number;
  altura?: number;
  children: React.ReactNode;
  className?: string;
}) {
  const caixa = React.useRef<HTMLDivElement>(null);
  const [larguraDaCaixa, setLarguraDaCaixa] = React.useState(largura);
  // null = no zoom de ajuste; um número = a pessoa mexeu no + ou no −
  const [zoom, setZoom] = React.useState<number | null>(null);
  const useEfeitoDeLayout = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
  useEfeitoDeLayout(() => {
    const el = caixa.current;
    if (!el) return;
    const medir = () => setLarguraDaCaixa(el.clientWidth);
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, []);
  const ajuste = Math.min(1, Math.round((larguraDaCaixa / largura) * 100) / 100);
  const atual = zoom ?? ajuste;
  const passo = (d: number) => setZoom(Math.min(1.5, Math.max(0.5, Math.round((atual + d) * 10) / 10)));
  // o desenho fica centrado no que sobra da largura
  const deslocamento = Math.max(0, Math.round((larguraDaCaixa - largura * atual) / 2));
  return (
    <div
      ref={caixa}
      className={cn("relative overflow-hidden rounded-md bg-background/40", className)}
      style={{ height: Math.round(altura * ajuste) }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left transition-transform"
        style={{ width: largura, height: altura, transform: `translateX(${deslocamento}px) scale(${atual})` }}
      >
        {children}
      </div>
      <div className="absolute bottom-4 left-4 flex flex-col gap-1">
        <BotaoZoom rotulo={rotulos.aproximar} onClick={() => passo(0.1)}>
          <Plus size={16} weight="regular" aria-hidden="true" />
        </BotaoZoom>
        <BotaoZoom rotulo={rotulos.afastar} onClick={() => passo(-0.1)}>
          <Minus size={16} weight="regular" aria-hidden="true" />
        </BotaoZoom>
        <BotaoZoom rotulo={rotulos.ajustar} onClick={() => setZoom(null)}>
          <ArrowsOut size={16} weight="regular" aria-hidden="true" />
        </BotaoZoom>
      </div>
    </div>
  );
}
