"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Bell, FunnelSimple, MagnifyingGlass, type Icon } from "@phosphor-icons/react";
import { SeparadorDaTrilha } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { PainelFlutuante } from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useCliqueFora } from "@/lib/use-clique-fora";
import { useSaida } from "@/lib/use-saida";

import { foco, focoDentro, focoInterno, rolagemDiscreta, superficieDeApoio } from "@/lib/estados";
/**
 * Header — o topo de uma página do CRM, numa linha só.
 *
 * O arquivo (set 601:464) desenha duas linhas: trilha e sino em cima, título
 * `h1` e ações embaixo, 102px. O cliente apontou "bastante espaço em branco e
 * duas linhas" (crítica de 2026-09-28, ponto 7), e a proposta visual que o
 * humano aprovou por partes junta tudo numa linha, como o Twenty e o Attio
 * (ADR-053): a trilha, o título como último nível dela, e à direita as ações
 * e os utilitários. 60px sozinho; 48 dentro da `TelaBase`.
 *
 * O Header é a moldura — os encaixes e a geometria — e o conteúdo entra por
 * composição, porque o produto tem trilha de um a N níveis, título de
 * qualquer tamanho e qualquer conjunto de botões:
 *
 *   inicio       → antes de tudo (o botão de menu da `TelaBase`)
 *   trilha       → os ANCESTRAIS da página (`Breadcrumb ancestrais`)
 *   titulo       → a página: `h1` em `h4`, o último nível da trilha
 *   acoes        → à direita: busca, filtros, visão, período, a ação principal
 *   utilitarios  → na ponta direita: o sino
 *
 * Medidas: recuo 32×16, controles de 28, vão de 8 entre eles. O Header se
 * marca com `data-compacto` e o Button, o SegmentedControl, o ViewSwitcher e o
 * gatilho de data encolhem de 32 para 28 sozinhos (ADR-057). Não tem fundo
 * nem traço próprios: fica sobre a superfície de quem o hospeda. Na `TelaBase`
 * ele é a primeira faixa do painel da tela e o traço de baixo é dela (ADR-055).
 *
 * O subtítulo fica FORA por padrão (decisão do humano, 2026-09-18): descrição
 * decorativa em toda tela é anti-referência. Quando existe, vem depois do
 * título, em `body-sm`, e só aparece com 960px ou mais de largura.
 *
 * Quando não cabe, as ações descem para uma linha própria, à direita, e
 * quebram entre si; o título trunca com `title` (D12). Abaixo de 640 da
 * própria largura (container query, não a janela), a trilha sai, o título
 * fica centrado entre o menu e o sino, e as ações vão para a linha de baixo,
 * centradas (humano, 2026-09-24, ADR-032).
 */

export interface HeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  titulo: string;
  /** Fora por padrão. Passe só quando a frase disser o que o título não diz. */
  subtitulo?: string;
  /** Antes da trilha. É onde a `TelaBase` põe o botão de menu (< 1024px). */
  inicio?: React.ReactNode;
  /** Os níveis acima da página, antes do título. Normalmente `Breadcrumb ancestrais`. */
  trilha?: React.ReactNode;
  /** Na ponta direita, depois das ações. Normalmente `Notificacoes`. */
  utilitarios?: React.ReactNode;
  /** À direita: botões, `SegmentedControl`, `ViewSwitcher`, `HeaderDivisor`… */
  acoes?: React.ReactNode;
}

/* "Largo" é 640 ou mais da PRÓPRIA largura de conteúdo (a caixa sem o recuo —
   é o que o @container mede; não a janela). Medir a caixa e não a janela é o
   que faz o preview estreito da doc mostrar o mesmo que o celular. As classes
   vão por extenso: o Tailwind só enxerga o que está escrito inteiro. */

export function Header({ titulo, subtitulo, inicio, trilha, utilitarios, acoes, className, ...props }: HeaderProps) {
  return (
    <header
      // avisa os controles de dentro de que a faixa é compacta: 28 em vez de 32
      data-compacto=""
      className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 px-8 py-4 [container-type:inline-size]", className)}
      {...props}
    >
      {/* Trilha e título. O piso de 160px é o que faz as ações descerem de
          linha antes de o título virar reticências. */}
      <div className="flex min-h-7 min-w-[160px] flex-1 items-center gap-2">
        {inicio}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-1 [@container_(min-width:640px)]:justify-start">
          {trilha ? (
            <div className="hidden min-w-0 shrink items-center gap-1 [@container_(min-width:640px)]:flex">
              {trilha}
              <SeparadorDaTrilha />
            </div>
          ) : null}
          <h1 title={titulo} className="min-w-0 truncate text-h4 text-foreground">
            {titulo}
          </h1>
          {subtitulo ? (
            <p title={subtitulo} className="ml-1 hidden min-w-0 truncate text-body-sm text-muted-foreground [@container_(min-width:960px)]:block">
              {subtitulo}
            </p>
          ) : null}
        </div>
      </div>
      {/* Largo: na mesma linha, à direita; se não couber, desce e continua à
          direita. Estreito: linha própria, centrada, depois dos utilitários. */}
      {acoes ? (
        <div className="order-last flex w-full flex-wrap items-center justify-center gap-2 [@container_(min-width:640px)]:order-none [@container_(min-width:640px)]:ml-auto [@container_(min-width:640px)]:w-auto [@container_(min-width:640px)]:max-w-full [@container_(min-width:640px)]:justify-end">
          {acoes}
        </div>
      ) : null}
      {utilitarios ? <div className="flex shrink-0 items-center gap-2">{utilitarios}</div> : null}
    </header>
  );
}

/**
 * Traço vertical entre grupos de ação (node 601:55): 1×20 em `divider`. Só
 * entre o grupo de visão (troca-visão, período, data) e a ação principal;
 * fileira só com busca, filtros e a ação não leva (humano, 2026-09-24).
 */
export function HeaderDivisor({ className }: { className?: string }) {
  // estreito: as ações quebram em linhas centradas e o traço ficaria solto na ponta de uma delas
  return <div role="separator" aria-orientation="vertical" className={cn("hidden h-5 w-px shrink-0 bg-divider [@container_(min-width:640px)]:block", className)} />;
}

export interface HeaderNotificacoesProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Nome do botão, já com a contagem. Ex.: "Notificações: 5 não lidas". */
  rotulo: string;
  /** Não lidas. Zero ou ausente: sem selo. Acima de 99 vira "99+". */
  contagem?: number;
}

/**
 * Sino com selo (607:12957): Button `tertiary` de 28px no Header (32 fora dele) e selo `destructive`
 * de 16px de altura, 4px para fora do canto, com anel de 1,5 em `card`.
 *
 * O número do selo é `primary-foreground`, não o `destructive-foreground` do
 * arquivo: aquele é branco nos dois modos (reprova a D8) e, no escuro, branco
 * sobre o `destructive` claro dá 2,6:1. É a mesma escolha do Button destructive.
 */
export const HeaderNotificacoes = React.forwardRef<HTMLButtonElement, HeaderNotificacoesProps>(
  ({ rotulo, contagem = 0, className, ...props }, ref) => (
    <Tooltip content={rotulo} position="bottom">
      <Button ref={ref} variant="tertiary" size="icon" aria-label={rotulo} className={cn("relative", className)} {...props}>
        <Bell size={16} weight="regular" aria-hidden="true" />
        {contagem > 0 ? <Selo tom="destructive">{contagem > 99 ? "99+" : contagem}</Selo> : null}
      </Button>
    </Tooltip>
  ),
);
HeaderNotificacoes.displayName = "HeaderNotificacoes";

/** O selo no canto do botão de ícone (607:12957): 16px de altura, 4px para fora, anel de 1,5 em `card`. */
function Selo({ tom, children }: { tom: "destructive" | "primary"; children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      // D18: traço de 1,5 é ring, não border — o Chrome arredonda border para 1px em tela 1×
      className={cn(
        // número branco nos dois modos (humano, 2026-09-24): o destructive do escuro
        // desceu para 58% e o branco fecha 4,4:1
        "absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-label-sm tabular-nums text-primary-foreground ring-1.5 ring-inset ring-card",
        tom === "destructive" ? "bg-destructive" : "bg-primary",
      )}
    >
      {children}
    </span>
  );
}

export interface HeaderFiltrosProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Texto do botão. Com `recolhido`, vira o nome acessível e o tooltip. */
  rotulo: string;
  /** Filtros ativos. Zero: botão neutro; acima disso, `soft` com a conta. */
  contagem?: number;
  /** Nome acessível com a conta. Ex.: `(n) => \`Filtros: ${n} ativos\``. Padrão: "rotulo (n)". */
  rotuloComContagem?: (n: number) => string;
  /** Só o ícone. Mesma regra da busca: fileira com troca-visão, período ou data. */
  recolhido?: boolean;
}

/**
 * O botão de filtros do Header. Com rótulo quando a fileira só tem botões;
 * só o ícone (`recolhido`) quando entra troca-visão, período ou data — a
 * mesma regra da `HeaderBusca` (humano, 2026-09-24). Com filtro ativo vira
 * `soft` e mostra a conta: é o único sinal na tela de que a lista está cortada.
 */
export const HeaderFiltros = React.forwardRef<HTMLButtonElement, HeaderFiltrosProps>(
  ({ rotulo, contagem = 0, rotuloComContagem, recolhido = false, className, ...props }, ref) => {
    const nome = contagem > 0 ? (rotuloComContagem ?? ((n: number) => `${rotulo} (${n})`))(contagem) : rotulo;
    const variant = contagem > 0 ? "soft" : "tertiary";
    if (recolhido) {
      return (
        <Tooltip content={nome} position="bottom">
          <Button ref={ref} variant={variant} size="icon" aria-label={nome} className={cn("relative", className)} {...props}>
            <FunnelSimple size={16} weight="regular" aria-hidden="true" />
            {contagem > 0 ? <Selo tom="primary">{contagem > 99 ? "99+" : contagem}</Selo> : null}
          </Button>
        </Tooltip>
      );
    }
    return (
      <Button ref={ref} variant={variant} aria-label={contagem > 0 ? nome : undefined} className={className} {...props}>
        <FunnelSimple size={16} weight="regular" aria-hidden="true" />
        {rotulo}
        {contagem > 0 ? (
          <span aria-hidden="true" className="rounded-full bg-primary px-1.5 text-label-sm tabular-nums text-primary-foreground">
            {contagem > 99 ? "99+" : contagem}
          </span>
        ) : null}
      </Button>
    );
  },
);
HeaderFiltros.displayName = "HeaderFiltros";

export interface HeaderBuscaProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Nome do campo para leitor de tela. Ex.: "Pesquisar leads". */
  rotulo: string;
  /**
   * Só a lupa (a caixa de 28px do botão tertiary). Clicar abre a caixa de
   * 184px com movimento e o foco entra; sem texto, fecha ao sair.
   *
   * A regra (humano, 2026-09-23, ADR-028): a fileira de ações só tem botões →
   * busca aberta; tem troca-visão, período ou data, ou a tela abre o registro
   * ao lado (a fileira encolhe quando ele abre) → `recolhida`. A escolha é
   * por tela, não por largura: o estado não muda quando a janela encolhe.
   */
  recolhida?: boolean;
}

/**
 * A busca do Header — sempre esta peça, nunca um Button "Pesquisar" com texto.
 * Aberta (variante Search, 610:14049): a caixa do Button `tertiary` com
 * 184px, virada campo. Sem rótulo visível — o placeholder é a pista e
 * `rotulo` é o nome acessível. Com `recolhida`, a caixa nasce com 28px e a
 * largura anima até 184 quando abre (`base` · `enter`). Quando usar cada uma:
 * ver a prop.
 */
export const HeaderBusca = React.forwardRef<HTMLInputElement, HeaderBuscaProps>(
  ({ rotulo, recolhida = false, className, onBlur, onKeyDown, ...props }, ref) => {
    const [aberta, setAberta] = React.useState(!recolhida);
    const campo = React.useRef<HTMLInputElement | null>(null);
    const ligar = (el: HTMLInputElement | null) => {
      campo.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    };
    // abriu pela lupa: o foco entra no campo assim que ele tem largura
    React.useEffect(() => {
      if (recolhida && aberta) campo.current?.focus();
    }, [recolhida, aberta]);
    const fechada = recolhida && !aberta;

    return (
      <label
        className={cn(
          // 28 de altura, como os botões do topo (ADR-057)
          "flex h-7 max-w-full items-center gap-0.5 rounded-md text-muted-foreground shadow-button-inner",
          superficieDeApoio,
          recolhida ? "transition-[width] duration-base ease-enter" : "w-[184px] cursor-text px-2 py-1.5",
          recolhida && (fechada ? "w-7 cursor-pointer justify-center" : "w-[184px] cursor-text px-2 py-1.5"),
          !fechada && `${focoDentro}`,
          className,
        )}
      >
        {fechada ? (
          <button
            type="button"
            aria-label={rotulo}
            title={rotulo}
            onClick={() => setAberta(true)}
            className={cn("flex size-7 shrink-0 items-center justify-center rounded-md transition-colors hover:text-foreground", foco)}
          >
            <MagnifyingGlass size={16} weight="regular" aria-hidden="true" />
          </button>
        ) : (
          <MagnifyingGlass size={16} weight="regular" aria-hidden="true" className="shrink-0" />
        )}
        <input
          ref={ligar}
          type="search"
          aria-label={rotulo}
          aria-hidden={fechada || undefined}
          tabIndex={fechada ? -1 : 0}
          onBlur={(e) => {
            onBlur?.(e);
            // sem texto, a caixa volta a ser só a lupa
            if (recolhida && !e.currentTarget.value) setAberta(false);
          }}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (recolhida && e.key === "Escape" && !e.currentTarget.value) setAberta(false);
          }}
          className={cn(
            "h-full min-w-0 bg-transparent text-label-lg text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none",
            fechada ? "w-0 px-0 opacity-0" : "flex-1 px-1",
          )}
          {...props}
        />
      </label>
    );
  },
);
HeaderBusca.displayName = "HeaderBusca";

/* --------------------------------------------------------- Notificações -- */

export type Notificacao = {
  id: string;
  icone: Icon;
  titulo: string;
  detalhe: string;
  /** Quando aconteceu, já em texto. Ex.: "há 20 min". */
  quando: string;
  lida: boolean;
};

export type RotulosDasNotificacoes = {
  titulo: string;
  /** Nome do sino. Ex.: (n) => `Notificações: ${n} não lidas`. */
  naoLidas: (n: number) => string;
  marcarTodas: string;
  /** O rodapé: abre a lista inteira na altura da janela, e volta. */
  verTodas: string;
  verMenos: string;
};

export const ROTULOS_DAS_NOTIFICACOES: RotulosDasNotificacoes = {
  titulo: "Notificações",
  naoLidas: (n) => (n ? `Notificações: ${n} não lida${n === 1 ? "" : "s"}` : "Notificações: nenhuma não lida"),
  marcarTodas: "Marcar todas como lidas",
  verTodas: "Ver todas",
  verMenos: "Ver menos",
};

export interface NotificacoesProps {
  itens: Notificacao[];
  /** Clique num item. A tela marca como lida e abre o que for. */
  aoMarcarLida: (id: string) => void;
  aoMarcarTodas: () => void;
  rotulos?: Partial<RotulosDasNotificacoes>;
  className?: string;
}

/**
 * O sino com o painel: a lista de notificações, não lidas em destaque,
 * "marcar todas" no topo e "ver todas" no pé. Era o cenário da página do
 * Header; virou peça porque toda tela do CRM tem o sino e ele precisa abrir
 * alguma coisa (humano, 2026-09-23). O arquivo desenha só o sino e o selo; o
 * painel é derivado dos tokens `overlay/*`, o mesmo caminho da lista do
 * Select. O que é uma notificação continua sendo da tela: ela manda os
 * itens e recebe os cliques.
 *
 * Abre em portal fixo abaixo do sino, alinhado pela direita; acompanha a
 * rolagem e a janela; clique fora e Escape fecham; o foco volta ao sino.
 */
export function Notificacoes({ itens, aoMarcarLida, aoMarcarTodas, rotulos, className }: NotificacoesProps) {
  const r = { ...ROTULOS_DAS_NOTIFICACOES, ...rotulos };
  const [aberto, setAberto] = React.useState(false);
  // "Ver todas" não sai do painel: ele cresce até a altura da janela e a
  // lista rola — o que a pessoa espera de um sino (humano, 2026-09-23).
  const [expandido, setExpandido] = React.useState(false);
  const { saindo, visivel } = useSaida(aberto);
  const [pos, setPos] = React.useState<{ top: number; right: number } | null>(null);
  const gatilho = React.useRef<HTMLButtonElement>(null);
  const painel = React.useRef<HTMLDivElement>(null);
  const naoLidas = itens.filter((n) => !n.lida).length;

  const posicionar = React.useCallback(() => {
    const g = gatilho.current?.getBoundingClientRect();
    if (!g) return;
    setPos({ top: g.bottom + 8, right: Math.max(16, window.innerWidth - g.right) });
  }, []);

  useCliqueFora(aberto, [painel, gatilho], () => setAberto(false));

  function fechar(devolverFoco = true) {
    setAberto(false);
    if (devolverFoco) gatilho.current?.focus();
  }

  React.useEffect(() => {
    if (!aberto) return;
    posicionar();
    // Escape fecha de onde o foco estiver — inclusive depois que "marcar todas"
    // desabilita o próprio botão e o foco cai no body.
    const teclado = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setAberto(false);
      gatilho.current?.focus();
    };
    document.addEventListener("keydown", teclado);
    window.addEventListener("resize", posicionar);
    // `true`: a página rola atrás do painel, e o painel acompanha o sino
    window.addEventListener("scroll", posicionar, true);
    return () => {
      document.removeEventListener("keydown", teclado);
      window.removeEventListener("resize", posicionar);
      window.removeEventListener("scroll", posicionar, true);
    };
  }, [aberto, posicionar]);

  // O foco entra no painel depois que ele existe (o portal só monta com `pos`).
  React.useEffect(() => {
    if (aberto && pos) painel.current?.focus();
  }, [aberto, pos]);

  return (
    <>
      <HeaderNotificacoes
        ref={gatilho}
        rotulo={r.naoLidas(naoLidas)}
        contagem={naoLidas}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        onClick={() => (aberto ? fechar() : setAberto(true))}
        className={className}
      />
      {visivel && pos && typeof document !== "undefined"
        ? createPortal(
            <PainelFlutuante
              ref={painel}
              fixo
              saindo={saindo}
              role="dialog"
              aria-label={r.titulo}
              tabIndex={-1}
              style={{ top: pos.top, right: pos.right }}
              className="flex w-[360px] max-w-[calc(100vw-32px)] flex-col overflow-hidden outline-none"
            >
              <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
                <p className="text-h4 text-foreground">{r.titulo}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!naoLidas}
                  onClick={() => {
                    aoMarcarTodas();
                    // o botão vai desabilitar: o foco fica no painel, não cai no body
                    painel.current?.focus();
                  }}
                >
                  {r.marcarTodas}
                </Button>
              </div>

              <ul
                className={cn(
                  "flex flex-col overflow-y-auto overscroll-contain transition-[max-height] duration-base ease-enter", rolagemDiscreta,
                  expandido ? "max-h-[calc(100vh-160px)]" : "max-h-[320px]",
                )}
              >
                {itens.map((n) => {
                  const Icone = n.icone;
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => aoMarcarLida(n.id)}
                        className={cn(
                          "flex w-full items-start gap-3 px-4 py-3 text-left outline-none transition-colors hover:bg-overlay-item-hover",
                          focoInterno,
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-full",
                            n.lida ? "bg-background text-subtle-foreground" : "bg-accent text-primary",
                          )}
                        >
                          <Icone size={16} weight="regular" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline gap-2">
                            <span className={cn("truncate text-label-lg", n.lida ? "text-muted-foreground" : "text-foreground")}>{n.titulo}</span>
                            <span className="ml-auto shrink-0 text-caption text-subtle-foreground">{n.quando}</span>
                          </span>
                          <span className="mt-0.5 line-clamp-2 block text-body-sm text-muted-foreground">{n.detalhe}</span>
                        </span>
                        {n.lida ? null : <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-border p-1.5">
                <Button variant="ghost" size="sm" className="w-full" aria-expanded={expandido} onClick={() => setExpandido((v) => !v)}>
                  {expandido ? r.verMenos : r.verTodas}
                </Button>
              </div>
            </PainelFlutuante>,
            document.body,
          )
        : null}
    </>
  );
}
