"use client";

import { createContext, useContext } from "react";
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
   Sidebar — a navegação

   Plana: sem cartão, sem moldura e sem marca d'água, direto no fundo da
   aplicação. 220px aberta, 48 recolhida, item de 32. O arquivo (124:2114)
   desenha um painel de 282px em cartão, com moldura de 16, item de 36 e o
   símbolo em marca d'água; o cliente pediu a aproximação com o Twenty e o
   Attio, e esta é a terceira parte da proposta visual que o humano aprovou
   por partes (2026-10-01, ADR-054).
--------------------------------------------------------------------------- */

export interface SidebarProps extends Omit<React.HTMLAttributes<HTMLElement>, "onToggle"> {
  /** Estado colapsado: 220px viram 48 e todo rótulo sai de cena. */
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
      <div className={cn("shrink-0 transition-[width] duration-base ease-enter", colapsada ? "w-12" : "w-[220px]")}>
        <nav
          aria-label={rotulo}
          className={cn(
            // 16 em cima: a linha da marca alinha com a linha do Header
            "flex h-full flex-col justify-between gap-4 overflow-hidden bg-background px-2 pb-3 pt-4",
            className
          )}
          {...props}
        >
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
      className={cn("flex h-8 items-center justify-between pl-2 text-surface-inverse", className)}
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

/** O bloco de cima: marca, navegação e favoritos, com 16px entre eles. */
export function SidebarTopo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex min-h-0 flex-col gap-4", className)} {...props} />;
}

/** O bloco de baixo: tema, atalhos e o usuário, com 8px entre eles. */
export function SidebarRodape({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

/**
 * Lista de itens — 2px entre linhas. Com `rotulo`, é uma seção com nome
 * ("Favoritos"): o nome some quando o painel recolhe. `ocultarRecolhida` tira
 * o grupo inteiro de cena no painel recolhido — atalho com o mesmo ícone em
 * todos os itens (a estrela dos favoritos) não diz nada sem o rótulo.
 */
export function SidebarGrupo({
  rotulo,
  ocultarRecolhida = false,
  recuo: _recuo,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement> & {
  /** Nome da seção, em cima da lista. Ex.: "Favoritos". */
  rotulo?: string;
  /** No painel recolhido o grupo some. */
  ocultarRecolhida?: boolean;
  /** Sem efeito desde a navegação plana (ADR-054); mantido para não quebrar telas prontas. */
  recuo?: boolean;
}) {
  const { colapsada } = useSidebar();
  if (colapsada && ocultarRecolhida) return null;
  const lista = (
    <ul aria-label={rotulo} className={cn("flex list-none flex-col gap-0.5", className)} {...props}>
      {children}
    </ul>
  );
  if (!rotulo || colapsada) return lista;
  return (
    <div className="flex flex-col gap-1">
      <p aria-hidden="true" className="truncate px-2 text-caption text-muted-foreground motion-safe:animate-fade-in-fast">
        {rotulo}
      </p>
      {lista}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   SidebarItem — a linha de navegação
--------------------------------------------------------------------------- */

const itemVariants = cva(
  // `text-left`: com `componente="button"` a raiz é um <button>, que centraliza
  // o texto por padrão do navegador — o rótulo saía do eixo dos outros itens.
  "group relative flex h-8 w-full items-center overflow-hidden rounded-md px-2 " +
    "text-left text-body-lg transition-colors " +
    `${foco} ` +
    `${desabilitadoLink} ` +
    `${desabilitado}`,
  {
    variants: {
      selecionado: {
        true: "bg-nav-item-selected text-nav-item-selected-foreground",
        // `card`, não `nav-item-hover`: o painel é plano, direto sobre `background`,
        // e o hover do arquivo é `background` — sumiria. `card` aparece nos dois temas.
        false: "text-nav-item hover:bg-card hover:text-foreground",
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
  /** Ícone do Phosphor, 16px. Obrigatório: é o que sobra quando colapsa. */
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
        // rótulo tem ~170px e es/pt-br crescem 20–30% sobre en.
        title={texto}
        aria-label={colapsada ? texto : undefined}
        className={cn(itemVariants({ selecionado, colapsada }), className)}
        {...props}
      >
        <span className={cn("flex min-w-0 items-center gap-2", !colapsada && "flex-1")}>
          {/* A8: um peso só; `fill` é do item selecionado */}
          <Icone
            size={16}
            weight={selecionado ? "fill" : "regular"}
            className={cn("shrink-0", selecionado && "text-nav-item-selected-icon")}
          />
          {!colapsada && <span className="min-w-0 flex-1 truncate motion-safe:animate-fade-in-fast">{children}</span>}
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
  // alterna no clique. Mesma altura de 32px, para não desalinhar a lista.
  const visiveis = colapsada ? opcoes.filter((o) => o.id === tema) : opcoes;

  return (
    <div
      role={colapsada ? undefined : "radiogroup"}
      aria-label="Tema"
      className={cn(
        "inline-flex w-fit items-center rounded-md bg-card p-0.5",
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
              "grid size-7 place-items-center rounded-sm transition-colors",
              `${foco}`,
              ativo
                ? "bg-nav-item-selected text-nav-item-selected-icon"
                : "text-muted-foreground hover:bg-nav-item-hover hover:text-foreground"
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
    <span className="grid size-6 shrink-0 place-items-center overflow-hidden rounded-full bg-sidebar-avatar">
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
          "flex h-8 w-full items-center justify-center rounded-md transition-colors hover:bg-card",
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
        "flex h-10 w-full items-center justify-between gap-2 rounded-md px-2 text-left transition-colors",
        "hover:bg-card",
        `${foco}`,
        className
      )}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2">
        {foto}
        <span className="flex min-w-0 flex-col items-start">
          <span className="max-w-full truncate text-label-lg text-foreground">{nome}</span>
          {/* o e-mail é o campo que trunca primeiro — daí o title */}
          <span className="max-w-full truncate text-caption text-muted-foreground" title={email}>
            {email}
          </span>
        </span>
      </span>
      <CaretDown size={12} weight="bold" className="shrink-0 text-muted-foreground" />
    </button>
  );
}
