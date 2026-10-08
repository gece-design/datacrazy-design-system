"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UsersThree,
  SquaresFour,
  ChatsCircle,
  TreeStructure,
  MagnifyingGlass, CaretDown, CaretRight, Lock, X,
  // um por item da navegação — Phosphor, peso regular, a mesma biblioteca do
  // design system (regra A8: um peso só na interface inteira).
  RocketLaunch, DownloadSimple, Palette, TextAa, Shapes, ArrowsOutLineHorizontal,
  BoundingBox, StackSimple, CursorClick, HandPointing, Textbox, CaretCircleDown,
  CheckSquare, CalendarBlank, Clock, SidebarSimple, Path, ListNumbers, ChartLineUp,
  Tag, UserCircle, Table, ChartBar, ChatTeardropText, Tray, Browsers, ArrowLineLeft,
  Cards, RadioButton, ToggleRight, Bell, Tabs, Browser, Flask, Kanban,
  Waveform, CalendarDots,
  ChatCircleDots, ListMagnifyingGlass, FunnelSimple, SquareSplitHorizontal, FlowArrow, Robot,
} from "@phosphor-icons/react";
import { navegacao } from "./nav";
import { SeloNovo } from "@/components/ds/novidade";
import { Logo, LogoSimbolo } from "./logo";
import { Tree } from "./tree";
import { SidebarToggle } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import { foco } from "@/lib/estados";
import { BotaoFechar } from "@/components/ui/button";
// Medidas do Figma (node 255:6493): sidebar 260 · padding 13 · conteúdo 234
// busca h36 p8 · categoria h28 px10 · item h32 passo 34 · ícone x32 · texto x56

type Glifo = React.ComponentType<{ size?: number; weight?: "regular"; className?: string }>;

/** Chave declarada em `nav.ts` → glifo. A chave existe para o dado da rota não
 *  importar componente: `nav.ts` é a verdade da navegação, não da renderização. */
const icones: Record<string, Glifo> = {
  foguete: RocketLaunch,
  download: DownloadSimple,
  paleta: Palette,
  texto: TextAa,
  formas: Shapes,
  espaco: ArrowsOutLineHorizontal,
  raio: BoundingBox,
  elevacao: StackSimple,
  movimento: Waveform,
  clique: CursorClick,
  toque: HandPointing,
  campo: Textbox,
  selecao: CaretCircleDown,
  caixa: CheckSquare,
  radio: RadioButton,
  interruptor: ToggleRight,
  calendario: CalendarBlank,
  relogio: Clock,
  painel: SidebarSimple,
  trilha: Path,
  paginas: ListNumbers,
  abas: Tabs,
  cabecalho: Browser,
  cartao: Cards,
  metrica: ChartLineUp,
  etiqueta: Tag,
  pessoa: UserCircle,
  tabela: Table,
  tela: Browsers,
  agenda: CalendarDots,
  progresso: ChartBar,
  balao: ChatTeardropText,
  sino: Bell,
  bandeja: Tray,
  camada: Browsers,
  gaveta: ArrowLineLeft,
  proposta: Flask,
  kanban: Kanban,
  conversa: ChatCircleDots,
  lupa: ListMagnifyingGlass,
  funil: FunnelSimple,
  lateral: SquareSplitHorizontal,
  fluxo: FlowArrow,
  robo: Robot,
  contatos: UsersThree,
  catalogo: SquaresFour,
  conversas: ChatsCircle,
  canvas: TreeStructure,
};

const glifo = (chave?: string): Glifo | null => (chave ? icones[chave] ?? null : null);

export interface SidebarProps {
  /** Rail de 64px: os mesmos itens, só o glifo. */
  rail?: boolean;
  /** Liga o botão redondo de recolher/expandir na borda direita do painel. */
  onColapsarChange?: (rail: boolean) => void;
  /** Chamado ao navegar — é o que fecha o drawer no celular. */
  aoNavegar?: () => void;
  /** Botão de fechar no topo. Só o drawer usa. */
  onFechar?: () => void;
  className?: string;
}

export function Sidebar({ rail = false, onColapsarChange, aoNavegar, onFechar, className }: SidebarProps) {
  const caminho = usePathname();
  const [busca, setBusca] = useState("");
  const [fechadas, setFechadas] = useState<string[]>([]);

  const filtrada = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return navegacao;
    return navegacao
      .map((c) => ({ ...c, itens: c.itens.filter((i) => i.titulo.toLowerCase().includes(q)) }))
      .filter((c) => c.itens.length > 0);
  }, [busca]);

  const moldura = cn("relative shrink-0", className);
  const painel =
    "flex h-full flex-col gap-3 overflow-hidden rounded-[16px] border border-card bg-background p-[13px]";

  /* ------------------------------------------------------------------ rail */
  if (rail) {
    return (
      <div className={cn(moldura, "w-[64px]")}>
        <nav aria-label="Navegação recolhida" className={cn(painel, "items-center gap-2")}>
          <Link
            href="/"
            onClick={aoNavegar}
            aria-label="Início"
            className={`flex h-[30px] w-full shrink-0 items-center justify-center text-foreground rounded ${foco}`}
          >
            <LogoSimbolo className="h-[26px] w-auto" />
          </Link>

          {/* o mesmo botão de recolher do produto (`SidebarToggle`), na linha de baixo da marca */}
          {onColapsarChange && <SidebarToggle colapsada onClick={() => onColapsarChange(false)} />}

          <button
            onClick={() => onColapsarChange?.(false)}
            aria-label="Buscar componente"
            title="Buscar"
            className={`chrome-busca grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground
                       transition-colors hover:text-foreground ${foco}`}
          >
            <MagnifyingGlass size={18} weight="regular" />
          </button>

          <ul className="-mr-1 flex flex-1 list-none flex-col items-center gap-0.5 overflow-y-auto pr-1 pt-1">
            {navegacao.map((cat, i) => (
              <li key={cat.titulo} className="contents">
                {/* a divisória substitui o rótulo da categoria: sem ela o rail
                    vira uma coluna de 26 glifos sem agrupamento nenhum */}
                {i > 0 && <hr className="my-1 w-6 shrink-0 border-t border-border" />}
                {cat.itens.map((item) => {
                  const Icone = glifo(item.icone);
                  const ativo = caminho === item.href;
                  const base = "grid size-9 shrink-0 place-items-center rounded-md transition-colors";

                  if (!item.pronto) {
                    return (
                      <span
                        key={item.href}
                        aria-disabled="true"
                        title={`${item.titulo} · ainda não implementado`}
                        className={cn(base, "cursor-not-allowed text-subtle-foreground")}
                      >
                        {Icone && <Icone size={18} weight="regular" />}
                      </span>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={aoNavegar}
                      title={item.titulo}
                      aria-label={item.titulo}
                      aria-current={ativo ? "page" : undefined}
                      className={cn(
                        base,
                        `${foco}`,
                        // recolhido o glifo é o ÚNICO portador do significado,
                        // então ele sobe de tom: aqui vale a WCAG 1.4.11 (3:1),
                        // que `subtle-foreground` não entrega (regra D13).
                        ativo ? "bg-card text-primary" : "text-muted-foreground hover:bg-card hover:text-foreground"
                      )}
                    >
                      {Icone && <Icone size={18} weight="regular" />}
                    </Link>
                  );
                })}
              </li>
            ))}
          </ul>
        </nav>

      </div>
    );
  }

  /* -------------------------------------------------------------- expandida */
  return (
    <div className={cn(moldura, "w-[260px]")}>
      <nav aria-label="Navegação" className={painel}>
        <div className="flex h-[30px] shrink-0 items-center">
          <Link
            href="/"
            onClick={aoNavegar}
            className={`flex flex-1 items-center justify-center text-foreground rounded ${foco}`}
          >
            <Logo className="h-[28px] w-auto" />
          </Link>
          {onFechar && <BotaoFechar rotulo="Fechar menu" onClick={onFechar} className="-mr-1" />}
          {/* o mesmo botão de recolher do produto (`SidebarToggle`), na linha da marca */}
          {onColapsarChange && <SidebarToggle onClick={() => onColapsarChange(true)} className="-mr-1" />}
        </div>

        <div className="relative h-9 shrink-0">
          <MagnifyingGlass
            size={20}
            weight="regular"
            className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar"
            aria-label="Buscar componente"
            className={`chrome-item h-9 w-full chrome-busca rounded-full border-0 pl-[36px] pr-[44px] text-foreground
                       placeholder:text-muted-foreground ${foco}`}
          />
          <kbd className="chrome-kbd pointer-events-none absolute right-2 top-1/2 flex h-5 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-subtle-foreground/25 text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        <div className="-mr-1.5 flex-1 overflow-y-auto pr-1.5">
          {filtrada.map((cat, i) => {
            const fechada = fechadas.includes(cat.titulo);
            const Chevron = fechada ? CaretRight : CaretDown;
            return (
              <div
                key={cat.titulo}
                // divisória entre categorias: separa sem gastar mais espaço
                // vertical do que o respiro que já existia
                className={cn("pb-2", i > 0 && "mt-2 border-t border-border pt-2")}
              >
                <button
                  onClick={() =>
                    setFechadas((f) =>
                      f.includes(cat.titulo) ? f.filter((x) => x !== cat.titulo) : [...f, cat.titulo]
                    )
                  }
                  className={`chrome-categoria flex h-7 w-full items-start justify-between rounded-md px-2.5 pb-1 pt-2
                             text-muted-foreground transition-colors hover:text-foreground
                             ${foco}`}
                >
                  <span className="truncate">{cat.titulo}</span>
                  <Chevron size={16} weight="regular" className="shrink-0" />
                </button>

                {!fechada && (
                  <ul className="relative mt-0.5 space-y-0.5">
                    <Tree itens={cat.itens.length} />
                    {cat.itens.map((item) => {
                      const ativo = caminho === item.href;
                      const Icone = glifo(item.icone);
                      const base = "chrome-item relative flex h-8 items-center gap-2 rounded-md pl-8 pr-2.5 transition-colors";
                      // aberto, o rótulo é quem carrega o significado — o glifo
                      // é apoio. Um tom abaixo do texto para 26 ícones não
                      // virarem ruído; o contraste que a WCAG cobra está no
                      // rótulo, não aqui.
                      const tomDoGlifo = ativo ? "text-primary" : "text-subtle-foreground";

                      if (!item.pronto) {
                        return (
                          <li key={item.href}>
                            <span
                              aria-disabled="true"
                              title="Ainda não implementado"
                              className={cn(base, "cursor-not-allowed text-subtle-foreground")}
                            >
                              {Icone && <Icone size={16} weight="regular" className="shrink-0 opacity-70" />}
                              <span className="flex-1 truncate">{item.titulo}</span>
                              <Lock size={13} weight="regular" className="shrink-0 opacity-60" />
                            </span>
                          </li>
                        );
                      }

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={aoNavegar}
                            aria-current={ativo ? "page" : undefined}
                            className={cn(
                              base,
                              `${foco}`,
                              ativo ? "bg-card text-foreground" : "text-foreground hover:bg-card"
                            )}
                          >
                            {Icone && <Icone size={16} weight="regular" className={cn("shrink-0", tomDoGlifo)} />}
                            <span className="flex-1 truncate">{item.titulo}</span>
                            {/* só no que mudou nesta semana (a data está no nav.ts) */}
                            <SeloNovo data={item.atualizado} />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
          {filtrada.length === 0 && (
            <p className="px-2.5 py-6 text-center chrome-meta text-subtle-foreground">Nada encontrado.</p>
          )}
        </div>
      </nav>

    </div>
  );
}

/** Painel deslizante do celular: a mesma sidebar, por cima do conteúdo. */
export function SidebarDrawer({ aberto, onFechar }: { aberto: boolean; onFechar: () => void }) {
  const caminho = usePathname();

  // fecha ao trocar de rota — o clique no item já navegou, o painel não some
  // sozinho porque a árvore não é desmontada.
  useEffect(() => { onFechar(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [caminho]);

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    document.addEventListener("keydown", aoTeclar);
    // trava a rolagem de trás: senão o dedo arrasta a página sob o painel
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = antes;
    };
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-modal lg:hidden">
      <div
        onClick={onFechar}
        aria-hidden="true"
        // check-tokens:ignore scrim-literal — moldura do site (D3), decisão do humano em 2026-09-19: o menu no celular mantém o blur; Modal, Drawer e tela de senha usam o Scrim do DS
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-[2px]"
      />
      <Sidebar
        onFechar={onFechar}
        aoNavegar={onFechar}
        className="absolute bottom-3 left-3 top-3 shadow-[0_16px_48px_rgba(0,0,0,0.24)]"
      />
    </div>
  );
}
