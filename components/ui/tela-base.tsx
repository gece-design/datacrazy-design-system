"use client";

import * as React from "react";
import { List } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button, BotaoFechar } from "@/components/ui/button";
import { Header, type HeaderProps } from "@/components/ui/header";
import { Scrim } from "@/components/ui/modal";
import { Sidebar } from "@/components/ui/sidebar";
import { useCamada } from "@/lib/use-camada";
import { useMontado, useSaida } from "@/lib/use-saida";
import { rolagemDiscreta } from "@/lib/estados";

/**
 * TelaBase — a casca de toda tela do CRM (pedido do humano, 2026-09-23).
 *
 * Sidebar e Header já ligados, com o que era decisão repetida por tela: a
 * sidebar aberta ou recolhida com memória, o conteúdo rolando por dentro, os
 * recuos, o `main` nomeado. A tela só preenche os encaixes — `navegacao` (o
 * miolo da Sidebar), `cabecalho` (as props do Header) e `children`. Não há
 * subcabeçalho: a segunda linha de controles é a fileira de ações do Header
 * (humano, 2026-09-23 — "não ficou legal").
 *
 * Os breakpoints moram aqui, não na tela (ADR-027):
 *   ≥ 1280 (xl)  sidebar aberta, 220px
 *   1024–1279    sidebar recolhida em ícones, 48px — a pessoa pode abrir
 *   < 1024 (lg)  sidebar some; o botão de menu no Header abre o painel por
 *                cima, com o Scrim do Modal e a camada (foco preso, Escape)
 * Os recuos do conteúdo e do Header: 16 — o arquivo desenha 32 no Header;
 * foi 24 e "ainda tinha muito espaço" (humano, 2026-09-23, ADR-028). O Header
 * é de uma linha (ADR-053) e tem 8 embaixo: fecha em 56px, com os controles
 * alinhados ao topo do painel da Sidebar. À esquerda, com a sidebar no lugar (lg+), o recuo é 8: a
 * navegação plana já traz 8 do próprio recuo, e os dois somam os 16 do resto.
 *
 * Instala-se como bloco: `npx shadcn add @datacrazy/tela` cria a página
 * pronta com estes encaixes preenchidos por placeholders.
 */

export type RotulosDaTela = {
  /** Nome do botão de menu (< 1024px). */
  abrirMenu: string;
  fecharMenu: string;
  /** Nomes do botão que recolhe e expande a sidebar (≥ 1024px). */
  recolherMenu: string;
  expandirMenu: string;
  /** Nome da região de navegação (a Sidebar). */
  navegacao: string;
  /** Nome da região de conteúdo (o main). */
  conteudo: string;
};

export const ROTULOS_DA_TELA: RotulosDaTela = {
  abrirMenu: "Abrir menu",
  fecharMenu: "Fechar menu",
  recolherMenu: "Recolher menu",
  expandirMenu: "Expandir menu",
  navegacao: "Navegação principal",
  conteudo: "Conteúdo",
};

export interface TelaBaseProps {
  /** O miolo da Sidebar: `SidebarTopo` com a marca e os itens, `SidebarRodape` com tema e usuário. */
  navegacao: React.ReactNode;
  /** As props do Header: `titulo`, `trilha`, `utilitarios`, `acoes`, `subtitulo`. */
  cabecalho: HeaderProps;
  /** O conteúdo. Rola por dentro; o cabeçalho fica. */
  children: React.ReactNode;
  /** Chave da memória da sidebar (aberta ou recolhida) no navegador. Sem ela, começa pelo breakpoint. */
  memoria?: string;
  /** Recuo do conteúdo (16). Desligue quando o conteúdo traz o próprio, como o quadro do pipeline. */
  recuo?: boolean;
  rotulos?: Partial<RotulosDaTela>;
  className?: string;
}

const CHAVE_DA_MEMORIA = "ds:tela";
/** Abaixo disto a sidebar nasce recolhida (o `xl` do Tailwind). */
const LARGURA_ABERTA = 1280;

const useEfeitoDeLayout = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export function TelaBase({
  navegacao,
  cabecalho,
  children,
  memoria,
  recuo = true,
  rotulos,
  className,
}: TelaBaseProps) {
  const r = { ...ROTULOS_DA_TELA, ...rotulos };

  /* A sidebar: aberta no servidor (o HTML que chega), e antes da primeira
     pintura no navegador vira o que a memória diz — ou o que a largura pede. */
  const [colapsada, setColapsada] = React.useState(false);
  useEfeitoDeLayout(() => {
    let salva: boolean | null = null;
    try {
      const bruto = memoria ? window.localStorage.getItem(`${CHAVE_DA_MEMORIA}:${memoria}`) : null;
      if (bruto === "aberta") salva = false;
      if (bruto === "recolhida") salva = true;
    } catch {
      /* storage bloqueado: vale a largura */
    }
    setColapsada(salva ?? window.innerWidth < LARGURA_ABERTA);
  }, [memoria]);
  function colapsar(v: boolean) {
    setColapsada(v);
    try {
      if (memoria) window.localStorage.setItem(`${CHAVE_DA_MEMORIA}:${memoria}`, v ? "recolhida" : "aberta");
    } catch {
      /* não poder salvar não pode quebrar a tela */
    }
  }

  /* O menu por cima (< 1024): a mesma Sidebar, num painel com o Scrim e a
     camada — foco preso, Escape, foco devolvido ao botão. */
  const [menuAberto, setMenuAberto] = React.useState(false);
  const painel = React.useRef<HTMLDivElement>(null);
  const montado = useMontado();
  const { saindo, visivel } = useSaida(menuAberto);
  useCamada(montado && menuAberto, painel, () => setMenuAberto(false));
  // clicar num item da navegação fecha o menu: o destino já foi escolhido
  const fecharAoNavegar = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button:not([aria-expanded])")) setMenuAberto(false);
  };

  const botaoMenu = (
    <Button
      variant="tertiary"
      size="icon"
      aria-label={r.abrirMenu}
      title={r.abrirMenu}
      aria-haspopup="dialog"
      aria-expanded={menuAberto}
      onClick={() => setMenuAberto(true)}
      className="lg:hidden"
    >
      <List size={16} weight="regular" aria-hidden="true" />
    </Button>
  );

  return (
    <div className={cn("flex h-screen overflow-hidden bg-background", className)}>
      {/* No lugar só de lg para cima; abaixo, vira o painel do menu. O
          `className` da Sidebar é do nav, por isso o esconder fica num
          embrulho — é a caixa de 220/48px que precisa sumir. */}
      <div className="hidden h-screen lg:block">
        <Sidebar
          rotulo={r.navegacao}
          rotulos={{ recolher: r.recolherMenu, expandir: r.expandirMenu }}
          colapsada={colapsada}
          onColapsarChange={colapsar}
          className="h-screen"
        >
          {navegacao}
        </Sidebar>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          {...cabecalho}
          className={cn("shrink-0 pl-4 pr-4 pb-2 lg:pl-2", cabecalho.className)}
          inicio={botaoMenu}
        />
        <main
          aria-label={r.conteudo}
          className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto", rolagemDiscreta, recuo && "p-4 lg:pl-2")}
        >
          {children}
        </main>
      </div>

      {montado && visivel ? (
        <div className={cn("fixed inset-0 z-modal lg:hidden", saindo && "pointer-events-none")}>
          <Scrim saindo={saindo} onClick={() => setMenuAberto(false)} />
          <div
            ref={painel}
            role="dialog"
            aria-modal="true"
            aria-label={r.navegacao}
            aria-hidden={saindo || undefined}
            tabIndex={-1}
            onClick={fecharAoNavegar}
            className={cn(
              "absolute inset-y-0 left-0 focus:outline-none",
              saindo ? "motion-safe:animate-fade-out" : "motion-safe:animate-fade-in-fast",
            )}
          >
            {/* flex: a caixa da Sidebar estica até o chão; só assim o nav
                `h-full` ocupa a altura inteira do painel */}
            <div className="flex h-full">
              <Sidebar rotulo={r.navegacao} className="h-full shadow-xl">
                {navegacao}
              </Sidebar>
            </div>
            <BotaoFechar rotulo={r.fecharMenu} onClick={() => setMenuAberto(false)} className="absolute right-2 top-[18px]" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
