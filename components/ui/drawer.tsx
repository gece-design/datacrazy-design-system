"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  ArrowsOut,
  CaretDown,
  CaretRight,
  CaretUp,
  PushPin,
  Rows,
  SquaresFour,
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

/**
 * Drawer do lead — canvas "↳ Drawer" do Figma (node 533:3809).
 *
 * O component set `Drawer` (565:5959) tem um eixo `Menu` com cinco valores:
 * Histórico, Perfil, Campos adicionais, Negócios e Hierarquia. Em código isso
 * NÃO vira prop — o eixo é o item escolhido no menu, e cada valor é só o
 * conteúdo da coluna direita. O que é componente:
 *
 *   Drawer          a camada: scrim, foco preso, Escape
 *   DrawerPainel    a caixa de 1080px com raio à esquerda e elevação xl
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

const foco =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

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
  const fechar = React.useRef(aoFechar);
  fechar.current = aoFechar;
  const [montado, setMontado] = React.useState(false);
  React.useEffect(() => setMontado(true), []);

  // Fechar tem que ser visto: o painel fica no ar enquanto desliza para fora.
  // Quem pediu menos movimento ao sistema não espera nada — sai na hora (I12).
  const [saindo, setSaindo] = React.useState(false);
  const jaAbriu = React.useRef(false);
  React.useEffect(() => {
    if (aberto) {
      jaAbriu.current = true;
      setSaindo(false);
      return;
    }
    if (!jaAbriu.current) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    setSaindo(true);
    const fim = setTimeout(() => setSaindo(false), DURACAO_SAIDA);
    return () => clearTimeout(fim);
  }, [aberto]);

  React.useEffect(() => {
    if (!aberto) return;
    const anterior = document.activeElement as HTMLElement | null;
    const rolagem = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    painel.current?.focus();

    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        fechar.current();
        return;
      }
      if (e.key !== "Tab" || !painel.current) return;
      const focaveis = painel.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focaveis.length === 0) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      const atual = document.activeElement;
      if (e.shiftKey && (atual === primeiro || atual === painel.current)) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && atual === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("keydown", tecla);
      document.body.style.overflow = rolagem;
      anterior?.focus();
    };
  }, [aberto]);

  if (!montado || (!aberto && !saindo)) return null;
  return createPortal(
    <div className={cn("fixed inset-0 z-modal flex justify-end", saindo && "pointer-events-none")}>
      <div
        aria-hidden="true"
        onClick={aoFechar}
        className={cn(
          "absolute inset-0 bg-overlay-scrim/40",
          saindo ? "motion-safe:animate-fade-out" : "motion-safe:animate-fade-in-fast",
        )}
      />
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

/** A caixa do drawer. Raio só à esquerda: o lado direito encosta na tela.
 *  Com altura definida (a tela inteira, na camada), perfil e conteúdo rolam
 *  cada um por conta própria. */
export function DrawerPainel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-full w-[1080px] max-w-full shrink-0 items-stretch overflow-hidden rounded-l-xl border border-border bg-card shadow-xl",
        className,
      )}
      {...props}
    />
  );
}

/** Botão quadrado de 29px do canto do perfil. Exportado para quem precisar
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
        "flex size-[29px] shrink-0 items-center justify-center rounded-lg bg-card text-foreground transition-colors hover:bg-accent",
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
  | "roxo"
  | "rosa"
  | "laranja"
  | "verde"
  | "ciano"
  | "ambar"
  | "vermelho";

/** Rolagem de coluna: barra fina e sem arrastar a página junto no fim. */
const rolagem = "min-h-0 overflow-y-auto overscroll-contain [scrollbar-width:thin]";

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

/** Tem que bater com `drawer-sai` no tailwind.config: é o tempo do desmonte. */
const DURACAO_SAIDA = 200;

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
          "pointer-events-none absolute inset-x-0 z-10 flex h-12 justify-center from-card via-card/85 transition-opacity",
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
  /** Cor do anel, da inicial, da tag de tipo e do brilho do topo. Padrão:
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
      {/* A casca não rola: é ela que segura o indicador parado na borda,
          enquanto o conteúdo passa por baixo. */}
      <div
        data-tom={tom ?? (tipo === "empresa" ? "roxo" : "azul")}
        className={cn("relative flex w-[320px] shrink-0 border-r border-border bg-drawer-perfil bg-local", className)}
      >
      <aside
        ref={coluna}
        aria-label={nome}
        className={cn(
          // D14: 20px de recuo com o traço direito por dentro — 19 + 1 aqui.
          "flex w-full flex-col py-5 pl-5 pr-[19px]",
          rolagem,
        )}
      >
        <div className="relative flex shrink-0 flex-col items-center">
          <div className="relative flex w-full flex-col items-center gap-4 pt-2">
            <div className="flex flex-col items-center gap-1">
              <Avatar nome={nome} size="lg" aria-hidden="true" className="border-tom-anel text-tom-texto" />
              <h2 className="text-center text-h1 text-foreground">{nome}</h2>
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
            {/* A tag de tipo flutua sobre a borda do avatar, na posição exata do
                arquivo. Nessa instância o fundo é `background` e o recuo é 4px
                em volta — override do próprio arquivo sobre a Tag. */}
            <Tag tipo={tipo} className="absolute left-[158px] top-[13px] bg-background p-1 text-tom-tag">
              {rotuloTipo}
            </Tag>
            {tags ? <div className="flex w-full flex-wrap items-center justify-center gap-1">{tags}</div> : null}
            {acoes ? <div className="flex items-start justify-center gap-2">{acoes}</div> : null}
          </div>

          {aoFechar || aoRecolher ? (
            <div className="absolute left-0 top-0 flex w-full items-center justify-between">
              {aoFechar ? (
                <DrawerBotaoCanto rotulo={rotuloFechar} onClick={aoFechar}>
                  <X size={19.33} weight="regular" aria-hidden="true" />
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

        {children ? <div className="flex shrink-0 flex-col gap-4 pt-4">{children}</div> : null}
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
  children,
}: {
  titulo: string;
  inicialAberto?: boolean;
  /**
   * Controle do bloco, na linha do título — é onde o olho procura.
   * Fica FORA do botão de abrir/fechar: botão dentro de botão é inválido.
   */
  acoes?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [aberto, setAberto] = React.useState(inicialAberto);
  const id = React.useId().replace(/:/g, "");
  return (
    <section className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
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
      <div id={`bloco-${id}`} hidden={!aberto}>
        {children}
      </div>
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
    <dl className={cn("grid gap-2", colunas === 4 ? "grid-cols-4" : "grid-cols-2", className)}>
      {itens.map((m) => (
        <div
          key={m.rotulo}
          data-tom={m.tom}
          className={cn(
            "flex min-w-0 flex-col gap-0.5 rounded-md px-2 py-3",
            // Sem traço por decisão do humano (2026-09-17): o que separa o
            // cartão do fundo é o gradiente, o mesmo do topo do perfil.
            e === "outline" ? "bg-metrica" : "bg-background",
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

/** Lista (uma coluna, ícone ao lado) ou cards (duas colunas, ícone em cima). */
export type VisaoDoMenu = "lista" | "cards";

export interface VisualizacaoDoMenu {
  modo: VisaoDoMenu;
  aoMudar: (modo: VisaoDoMenu) => void;
  /** Nome do interruptor. Ex.: "Ver o menu em cards". */
  rotulo: string;
}

/**
 * Interruptor pequeno e cinza: lista ↔ cards.
 *
 * O lugar dele é a linha do título do bloco (`DrawerBloco acoes=…`), que é onde
 * o olho procura o controle da seção; dentro da caixa do menu ninguém acha.
 *
 * Não é o `Switch` do DS de propósito — aquele é azul quando ligado, e azul
 * aqui competiria com o item selecionado, que é o que a pessoa precisa achar.
 * Este fica em cinza nos dois estados: quem diz o modo é o botão que anda.
 */
export function SeletorDeVisao({ modo, aoMudar, rotulo }: VisualizacaoDoMenu) {
  const cards = modo === "cards";
  return (
    // Os dois ícones ficam de fora do botão: eles dizem o que o interruptor
    // faz sem texto para traduzir, e é por eles que a pessoa acha o controle.
    <span className="flex items-center gap-1.5">
      <Rows
        size={12}
        weight="fill"
        aria-hidden="true"
        className={cards ? "text-input-border" : "text-muted-foreground"}
      />
      <button
        type="button"
        role="switch"
        aria-checked={cards}
        aria-label={rotulo}
        title={rotulo}
        onClick={() => aoMudar(cards ? "lista" : "cards")}
        className={cn(
          "flex h-4 w-7 shrink-0 items-center rounded-full px-0.5 transition-colors",
          foco,
          cards ? "bg-muted-foreground" : "bg-input-border",
        )}
      >
        <span
          aria-hidden="true"
          className={cn("size-3 rounded-full bg-card shadow-sm transition-transform", cards && "translate-x-3")}
        />
      </button>
      <SquaresFour
        size={12}
        weight="fill"
        aria-hidden="true"
        className={cards ? "text-muted-foreground" : "text-input-border"}
      />
    </span>
  );
}

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
  visao = "lista",
}: {
  item: ItemMenuDrawer;
  selecionado: boolean;
  fixado: boolean;
  aoEscolher?: (id: string) => void;
  fixacao?: FixacaoDoMenu;
  visao?: VisaoDoMenu;
}) {
  const Icone = item.icone;
  const cartao = visao === "cards";
  return (
    <li className="group/item relative">
      <button
        type="button"
        aria-current={selecionado ? "true" : undefined}
        onClick={() => aoEscolher?.(item.id)}
        className={cn(
          "w-full rounded-md text-label-lg transition-colors",
          foco,
          cartao
            // cartão: ícone em cima do rótulo, duas colunas na grade de fora
            ? "flex flex-col items-center gap-1.5 px-2 py-3 text-center"
            // 36px = 9 + 18 + 9. O recuo de 8 à esquerda é o gap do arquivo.
            : "flex items-center justify-between py-[9px] pl-2 pr-2.5 text-left",
          // com o alfinete à direita, o caret recua para não ficar embaixo dele
          fixacao && !cartao && "pr-9",
          selecionado
            ? "bg-nav-item-selected text-nav-item-selected-foreground"
            : "text-foreground hover:bg-nav-item-hover",
        )}
      >
        <span className={cn("flex min-w-0", cartao ? "flex-col items-center gap-1.5" : "items-center gap-2")}>
          <Icone
            size={cartao ? 20 : 18}
            weight="regular"
            aria-hidden="true"
            className={cn("shrink-0", selecionado ? "text-nav-item-selected-icon" : "text-nav-item")}
          />
          <span className={cn("truncate", cartao && "w-full")}>{item.rotulo}</span>
        </span>
        {selecionado && !cartao ? (
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
            "absolute rounded-sm p-0.5 transition-opacity",
            // no cartão ele sobe para o canto; na lista fica no meio da linha
            cartao ? "right-1 top-1" : "right-2 top-1/2 -translate-y-1/2",
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
  visao,
  visualizacao,
}: {
  itens: ItemMenuDrawer[];
  atual: string;
  aoEscolher?: (id: string) => void;
  /** Nome da navegação para leitor de tela. Ex.: "Seções do lead". */
  rotulo: string;
  estilo?: EstiloPerfil;
  /** Liga o alfinete de cada item. Sem ela, o menu é só a lista do arquivo. */
  fixacao?: FixacaoDoMenu;
  /** Layout da lista quando o interruptor está fora (no título do bloco). */
  visao?: VisaoDoMenu;
  /** Põe o interruptor DENTRO da caixa do menu — só para menu sem bloco. */
  visualizacao?: VisualizacaoDoMenu;
}) {
  const e = useEstilo(estilo);
  const modo = visualizacao?.modo ?? visao ?? "lista";

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
      visao={modo}
    />
  );

  const grade = modo === "cards" ? "grid grid-cols-2 gap-1" : "flex flex-col";

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
      {visualizacao ? (
        <div className="flex items-center justify-end py-1.5">
          <SeletorDeVisao {...visualizacao} />
        </div>
      ) : null}

      {fixados.length > 0 ? (
        <>
          <ul className={grade}>{fixados.map((item) => linha(item, true))}</ul>
          {resto.length > 0 ? (
            // Separa sem título: o alfinete cheio já diz por que aqueles estão em cima.
            <div aria-hidden="true" className="my-1 h-0.5 bg-background" />
          ) : null}
        </>
      ) : null}

      <ul className={grade}>{resto.map((item) => linha(item, false))}</ul>
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
      className={cn("flex w-full flex-col gap-4 py-5", rolagem)}
    >
      <div className="flex shrink-0 flex-col gap-5">
        <div className="flex items-center justify-between gap-4 px-5">
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
      {children ? <div className="flex shrink-0 flex-col gap-4 px-5">{children}</div> : null}
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
    <section className={cn("flex flex-col gap-3", className)}>
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

/** A área da árvore. Os nós e as linhas vêm de fora, posicionados. */
export function HierarquiaCanvas({
  rotulos,
  children,
  className,
}: {
  rotulos: { aproximar: string; afastar: string; ajustar: string };
  children: React.ReactNode;
  className?: string;
}) {
  const [zoom, setZoom] = React.useState(1);
  const passo = (d: number) => setZoom((z) => Math.min(1.5, Math.max(0.5, Math.round((z + d) * 10) / 10)));
  return (
    <div className={cn("relative h-[540px] overflow-hidden rounded-md bg-background/40", className)}>
      <div className="absolute inset-0 origin-center transition-transform" style={{ transform: `scale(${zoom})` }}>
        {children}
      </div>
      <div className="absolute left-4 top-[426px] flex flex-col gap-1">
        <BotaoZoom rotulo={rotulos.aproximar} onClick={() => passo(0.1)}>
          <Plus size={16} weight="regular" aria-hidden="true" />
        </BotaoZoom>
        <BotaoZoom rotulo={rotulos.afastar} onClick={() => passo(-0.1)}>
          <Minus size={16} weight="regular" aria-hidden="true" />
        </BotaoZoom>
        <BotaoZoom rotulo={rotulos.ajustar} onClick={() => setZoom(1)}>
          <ArrowsOut size={16} weight="regular" aria-hidden="true" />
        </BotaoZoom>
      </div>
    </div>
  );
}
