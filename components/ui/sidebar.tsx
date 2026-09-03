"use client";

import { createContext, useContext, useId } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CaretDown, CaretLeft, CaretRight, Moon, Sun } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { LogoDataCrazy } from "./logo-datacrazy";

/* ---------------------------------------------------------------------------
   Contexto — `colapsada` desce sozinha. É o único estado compartilhado: cada
   peça precisa saber se mostra rótulo ou só ícone, e passar a prop à mão em
   cada filho seria erro esperando acontecer.
--------------------------------------------------------------------------- */

const SidebarContexto = createContext<{ colapsada: boolean }>({ colapsada: false });

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
        "pointer-events-none absolute -bottom-[156px] size-[362px] opacity-[0.07]",
        colapsada ? "-left-[153px]" : "-left-14"
      )}
    >
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
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
  /** Passe para ganhar o botão de colapsar pendurado na borda direita. */
  onColapsarChange?: (colapsada: boolean) => void;
  /** Rótulo acessível da região de navegação. */
  rotulo?: string;
}

export function Sidebar({
  colapsada = false,
  onColapsarChange,
  rotulo = "Navegação principal",
  className,
  children,
  ...props
}: SidebarProps) {
  return (
    <SidebarContexto.Provider value={{ colapsada }}>
      {/* wrapper sem recorte: o botão de colapsar precisa vazar a borda do painel */}
      <div className={cn("relative shrink-0", colapsada ? "w-[88px]" : "w-[282px]")}>
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

        {onColapsarChange && (
          <SidebarToggle colapsada={colapsada} onClick={() => onColapsarChange(!colapsada)} />
        )}
      </div>
    </SidebarContexto.Provider>
  );
}

/* ---------------------------------------------------------------------------
   Toggle — o botão redondo que colapsa o painel
--------------------------------------------------------------------------- */

export function SidebarToggle({
  colapsada = false,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { colapsada?: boolean }) {
  const Seta = colapsada ? CaretRight : CaretLeft;
  return (
    <button
      type="button"
      aria-label={colapsada ? "Expandir menu" : "Recolher menu"}
      aria-expanded={!colapsada}
      className={cn(
        // 3px da borda direita e 59px do topo: as coordenadas do Figma, iguais
        // nas duas larguras — o botão não se move quando o painel colapsa.
        "absolute right-[3px] top-[59px] z-dropdown grid size-8 place-items-center",
        // o Figma pinta o chevron em `subtle-foreground`, que no claro dá 2.4:1 —
        // abaixo dos 3:1 que a WCAG 1.4.11 exige de componente gráfico. Um degrau
        // mais escuro passa nos dois temas sem mudar a leitura do desenho.
        "rounded-full bg-card text-muted-foreground shadow-float transition-colors",
        "hover:text-foreground",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
      {...props}
    >
      <Seta size={16} weight="bold" />
    </button>
  );
}

/* ---------------------------------------------------------------------------
   Marca — o logo do topo
--------------------------------------------------------------------------- */

export function SidebarBrand({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { colapsada } = useSidebar();
  return (
    <div
      className={cn("flex h-8 items-center justify-center text-surface-inverse", className)}
      {...props}
    >
      <LogoDataCrazy simbolo={colapsada} />
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
  "group relative flex h-9 w-full items-center overflow-hidden rounded-md p-2 " +
    "text-button transition-colors " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
    "aria-disabled:pointer-events-none aria-disabled:opacity-50 " +
    "disabled:pointer-events-none disabled:opacity-50",
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
          {!colapsada && <span className="min-w-0 max-w-[160px] flex-1 truncate">{children}</span>}
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
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
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
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
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
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
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
