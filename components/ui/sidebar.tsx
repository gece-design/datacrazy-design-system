"use client";

import { createContext, useContext, useId } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CaretDown, Moon, SidebarSimple, Sun } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { LogoDataCrazy } from "./logo-datacrazy";

import { foco, desabilitado, desabilitadoLink } from "@/lib/estados";
/* ---------------------------------------------------------------------------
   Contexto — `colapsada` desce sozinha. É o único estado compartilhado: cada
   peça precisa saber se mostra rótulo ou só ícone, e passar a prop à mão em
   cada filho seria erro esperando acontecer.
--------------------------------------------------------------------------- */

/** Os nomes do botão de recolher. Todo texto vem de fora (a UI é multi-idioma); estes são os de fábrica. */
export type RotulosDaSidebar = { recolher: string; expandir: string };
export const ROTULOS_DA_SIDEBAR: RotulosDaSidebar = { recolher: "Recolher menu", expandir: "Expandir menu" };

const SidebarContexto = createContext<{
  colapsada: boolean;
  /** Presente quando o painel pode recolher: é o que faz a marca ganhar o botão. */
  aoColapsar?: (colapsada: boolean) => void;
  rotulos: RotulosDaSidebar;
}>({ colapsada: false, rotulos: ROTULOS_DA_SIDEBAR });

function useSidebar() {
  return useContext(SidebarContexto);
}

/* ---------------------------------------------------------------------------
   Marca d'água — o símbolo a 362px no rodapé, a 7% de opacidade, sangrando
   pela esquerda. É decoração: fica atrás de tudo e não recebe ponteiro.
--------------------------------------------------------------------------- */

function MarcaDagua({ colapsada }: { colapsada: boolean }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn(
        // check-tokens:ignore opacidade-literal — marca d'água a 7%, medida do arquivo (270:15429); só a remedição mexe
        "pointer-events-none absolute -bottom-[156px] size-[362px] opacity-[0.07]",
        colapsada ? "-left-[153px]" : "-left-14"
      )}
    >
      <defs>
        <radialGradient id={id}>
          {/* currentColor + classe do token: vale no Tailwind v3 e no v4 */}
          <stop offset="0%" stopColor="currentColor" className="text-primary" />
          <stop offset="100%" stopColor="currentColor" className="text-primary" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M10.137 31.5364L8.61601 28.4486L8.86962 27.1018L23.0282 21.7612L3.10272 17.5132V13.8521L3.94205 12.8124L23.3514 6.73274L0 4.50065V0.985472L0.842614 0L30.8518 3.56642L31.5364 4.73815V7.88148L9.65047 15.2016L28.4156 19.0537L29.1265 20.1299V23.0305L10.137 31.5364Z"
        fill={`url(#${id})`}
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   Sidebar — o painel
--------------------------------------------------------------------------- */

export interface SidebarProps extends Omit<React.HTMLAttributes<HTMLElement>, "onToggle"> {
  /** Estado colapsado: 282px viram 88px e todo rótulo sai de cena. */
  colapsada?: boolean;
  /** Passe para ganhar o botão de recolher, na linha da marca (`SidebarBrand`). */
  onColapsarChange?: (colapsada: boolean) => void;
  /** Rótulo acessível da região de navegação. */
  rotulo?: string;
  /** Nomes do botão de recolher (i18n). Padrão: "Recolher menu" e "Expandir menu". */
  rotulos?: Partial<RotulosDaSidebar>;
}

export function Sidebar({
  colapsada = false,
  onColapsarChange,
  rotulo = "Navegação principal",
  rotulos,
  className,
  children,
  ...props
}: SidebarProps) {
  return (
    <SidebarContexto.Provider value={{ colapsada, aoColapsar: onColapsarChange, rotulos: { ...ROTULOS_DA_SIDEBAR, ...rotulos } }}>
      {/* A largura anima em `base` — exceção declarada à I11 (ADR-022), com o
          precedente do Toast. Colapsar esconde os rótulos na hora; expandir
          traz cada um dissolvendo depois que a largura abriu. */}
      <div className={cn("relative shrink-0 transition-[width] duration-base ease-enter", colapsada ? "w-[88px]" : "w-[282px]")}>
        <nav
          aria-label={rotulo}
          className={cn(
            // a borda de 16px não é traço: é o respiro do shell, na cor do fundo
            // da aplicação. Vem do Figma como stroke INSIDE de 16px.
            "relative flex h-full flex-col justify-between gap-5 overflow-hidden",
            "rounded-3xl border-[16px] border-background bg-[image:var(--sidebar-surface)] px-2 py-4",
            className
          )}
          {...props}
        >
          <MarcaDagua colapsada={colapsada} />
          {children}
        </nav>
      </div>
    </SidebarContexto.Provider>
  );
}

/* ---------------------------------------------------------------------------
   Toggle — o botão que recolhe o painel
--------------------------------------------------------------------------- */

/**
 * O botão de recolher: 28px, quadrado, sem relevo, com o ícone do painel —
 * mora na linha da marca, dentro da Sidebar. O arquivo desenha um disco de
 * 32px com sombra, pendurado na borda; o cliente apontou que ele "fica
 * flutuando e é o único botão 100% redondo" (crítica de 2026-09-28, ADR-052).
 * A `SidebarBrand` já o traz quando a Sidebar recebe `onColapsarChange`;
 * exportado para quem monta o topo de outro jeito.
 */
export function SidebarToggle({
  colapsada = false,
  rotulos = ROTULOS_DA_SIDEBAR,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { colapsada?: boolean; rotulos?: RotulosDaSidebar }) {
  const nome = colapsada ? rotulos.expandir : rotulos.recolher;
  return (
    <button
      type="button"
      aria-label={nome}
      title={nome}
      aria-expanded={!colapsada}
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors",
        "hover:bg-nav-item-hover hover:text-foreground",
        `${foco}`,
        className
      )}
      {...props}
    >
      <SidebarSimple size={16} weight="regular" aria-hidden="true" />
    </button>
  );
}

/* ---------------------------------------------------------------------------
   Marca — o logo do topo e, quando o painel recolhe, o botão ao lado
--------------------------------------------------------------------------- */

export function SidebarBrand({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { colapsada, aoColapsar, rotulos } = useSidebar();

  // Recolhida, não há lugar para marca e botão lado a lado: o símbolo É o
  // botão de expandir. Sob o cursor ou o foco, dá lugar ao ícone do painel.
  if (colapsada && aoColapsar) {
    return (
      <div className={cn("flex h-8 items-center justify-center", className)} {...props}>
        <button
          type="button"
          aria-label={rotulos.expandir}
          title={rotulos.expandir}
          aria-expanded={false}
          onClick={() => aoColapsar(false)}
          className={cn(
            "group/marca grid size-8 place-items-center rounded-md text-surface-inverse transition-colors hover:bg-nav-item-hover",
            `${foco}`
          )}
        >
          <LogoDataCrazy simbolo className="group-hover/marca:hidden group-focus-visible/marca:hidden" />
          <SidebarSimple
            size={16}
            weight="regular"
            aria-hidden="true"
            className="hidden text-foreground group-hover/marca:block group-focus-visible/marca:block"
          />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn("flex h-8 items-center text-surface-inverse", aoColapsar ? "justify-between pl-2" : "justify-center", className)}
      {...props}
    >
      <LogoDataCrazy simbolo={colapsada} />
      {aoColapsar ? <SidebarToggle rotulos={rotulos} onClick={() => aoColapsar(true)} /> : null}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Blocos de layout — topo, rodapé, grupo
--------------------------------------------------------------------------- */

/** O bloco de cima: marca + navegação, com 8px entre eles. */
export function SidebarTopo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

/** O bloco de baixo: tema, atalhos e o usuário, com 8px entre eles. */
export function SidebarRodape({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

/**
 * Lista de itens — 4px entre linhas. `px-0.5` é a folga que o Figma dá ao
 * grupo principal para o item não encostar na borda do painel.
 */
export function SidebarGrupo({
  recuo = false,
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement> & { recuo?: boolean }) {
  return (
    <ul className={cn("flex list-none flex-col gap-1", recuo && "px-0.5", className)} {...props} />
  );
}

/* ---------------------------------------------------------------------------
   SidebarItem — a linha de navegação
--------------------------------------------------------------------------- */

const itemVariants = cva(
  // `text-left`: com `componente="button"` a raiz é um <button>, que centraliza
  // o texto por padrão do navegador — o rótulo saía do eixo dos outros itens.
  "group relative flex h-9 w-full items-center overflow-hidden rounded-md p-2 " +
    "text-left text-button transition-colors " +
    `${foco} ` +
    `${desabilitadoLink} ` +
    `${desabilitado}`,
  {
    variants: {
      selecionado: {
        true: "bg-nav-item-selected text-nav-item-selected-foreground shadow-highlight",
        false: "text-nav-item hover:bg-nav-item-hover hover:shadow-highlight",
      },
      colapsada: {
        true: "justify-center",
        false: "justify-between",
      },
    },
    defaultVariants: { selecionado: false, colapsada: false },
  }
);

export interface SidebarItemProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    Omit<VariantProps<typeof itemVariants>, "colapsada"> {
  /** Ícone do Phosphor, 20px. Obrigatório: é o que sobra quando colapsa. */
  icone: Icon;
  /** O rótulo. Vira `title`, e `aria-label` no estado colapsado. */
  children: React.ReactNode;
  /**
   * A tag da raiz. Padrão: `a` quando há `href`, `span` quando não há — item
   * sem destino não é link, e um `a` dentro de outro `a` é HTML inválido, que é
   * o que acontecia na galeria da home. Passe `Link` do `next/link` para
   * navegação client-side: ele aceita `className` e `children` direto.
   *
   * `asChild` do Radix não serve aqui: o item tem duas camadas (casca + grupo
   * de conteúdo), e o `Slot` promoveria a camada de dentro a raiz.
   */
  componente?: React.ElementType;
}

export function SidebarItem({
  icone: Icone,
  selecionado = false,
  componente,
  className,
  children,
  ...props
}: SidebarItemProps) {
  const { colapsada } = useSidebar();
  const Comp = componente ?? (props.href ? "a" : "span");
  const texto = typeof children === "string" ? children : undefined;

  return (
    <li>
      <Comp
        aria-current={selecionado ? "page" : undefined}
        // truncar sem tooltip é bug conhecido (#83283, #83274, #59567): o
        // rótulo tem 160px e es/pt-br crescem 20–30% sobre en.
        title={texto}
        aria-label={colapsada ? texto : undefined}
        className={cn(itemVariants({ selecionado, colapsada }), className)}
        {...props}
      >
        <span className={cn("flex min-w-0 items-center gap-2", !colapsada && "flex-1")}>
          <Icone
            size={20}
            weight="regular"
            className={cn("shrink-0", selecionado && "text-nav-item-selected-icon")}
          />
          {!colapsada && <span className="min-w-0 max-w-[160px] flex-1 truncate motion-safe:animate-fade-in-fast">{children}</span>}
        </span>
      </Comp>
    </li>
  );
}

/* ---------------------------------------------------------------------------
   SidebarThemeSwitch — dois botões num trilho só
--------------------------------------------------------------------------- */

export interface SidebarThemeSwitchProps {
  tema: "claro" | "escuro";
  onTemaChange: (tema: "claro" | "escuro") => void;
  className?: string;
}

export function SidebarThemeSwitch({ tema, onTemaChange, className }: SidebarThemeSwitchProps) {
  const { colapsada } = useSidebar();

  const opcoes = [
    { id: "claro" as const, rotulo: "Usar tema claro", Icone: Sun },
    { id: "escuro" as const, rotulo: "Usar tema escuro", Icone: Moon },
  ];

  // Colapsada, o trilho não cabe: vira um botão só, que mostra o tema atual e
  // alterna no clique. Mesma altura de 36px, para não desalinhar a lista.
  const visiveis = colapsada ? opcoes.filter((o) => o.id === tema) : opcoes;

  return (
    <div
      role={colapsada ? undefined : "radiogroup"}
      aria-label="Tema"
      className={cn(
        "inline-flex w-fit items-center rounded-md bg-card p-0.5 shadow-highlight",
        className
      )}
    >
      {visiveis.map(({ id, rotulo, Icone }) => {
        const ativo = tema === id;
        return (
          <button
            key={id}
            type="button"
            role={colapsada ? undefined : "radio"}
            aria-checked={colapsada ? undefined : ativo}
            aria-label={rotulo}
            title={rotulo}
            onClick={() => onTemaChange(colapsada ? (tema === "claro" ? "escuro" : "claro") : id)}
            className={cn(
              "grid size-8 place-items-center rounded-md transition-colors",
              `${foco}`,
              ativo
                ? "bg-nav-item-selected text-nav-item-selected-icon"
                : "text-muted-foreground hover:bg-nav-item-hover"
            )}
          >
            <Icone size={16} weight="regular" />
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   SidebarUser — a linha do usuário, no pé do painel
--------------------------------------------------------------------------- */

export interface SidebarUserProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  nome: string;
  email: string;
  /** Slot da foto. Sem ele fica o círculo cheio, que é o desenho do Figma. */
  avatar?: React.ReactNode;
}

export function SidebarUser({ nome, email, avatar, className, ...props }: SidebarUserProps) {
  const { colapsada } = useSidebar();

  const foto = (
    <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-sidebar-avatar shadow-highlight">
      {avatar}
    </span>
  );

  if (colapsada) {
    return (
      <button
        type="button"
        aria-label={nome}
        title={`${nome} · ${email}`}
        className={cn(
          "flex h-8 w-full items-center justify-center rounded-xl transition-colors",
          `${foco}`,
          className
        )}
        {...props}
      >
        {foto}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between gap-2 rounded-xl pl-2.5 pr-2 transition-colors",
        "hover:bg-nav-item-hover",
        `${foco}`,
        className
      )}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2">
        {foto}
        <span className="flex min-w-0 flex-col items-start">
          <span className="max-w-full truncate text-button text-foreground">{nome}</span>
          {/* o e-mail é o campo que trunca primeiro — daí o title */}
          <span className="max-w-full truncate text-body-lg text-muted-foreground" title={email}>
            {email}
          </span>
        </span>
      </span>
      <CaretDown size={16} weight="bold" className="shrink-0 text-muted-foreground" />
    </button>
  );
}
