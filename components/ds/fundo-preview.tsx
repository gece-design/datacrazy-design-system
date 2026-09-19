"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

import { foco } from "@/lib/estados";
/**
 * O fundo da caixa de preview — o palco, não o componente.
 *
 * Quatro neutros, todos token semântico: acompanham o tema e não são cor solta.
 * O padrão continua sendo `background`, a superfície sobre a qual o componente
 * vive no produto; a regra de contraste abaixo só troca quando esse padrão faz
 * o componente sumir.
 */
export const FUNDOS = [
  { id: "background", rotulo: "Página", token: "--background", classe: "bg-background" },
  { id: "card", rotulo: "Card", token: "--card", classe: "bg-card" },
  { id: "accent", rotulo: "Realce", token: "--accent", classe: "bg-accent" },
  { id: "inverse", rotulo: "Invertido", token: "--surface-inverse", classe: "bg-surface-inverse" },
] as const;

export type Fundo = (typeof FUNDOS)[number]["id"];

export const classeDoFundo = (id: Fundo) => FUNDOS.find((f) => f.id === id)!.classe;

/* ------------------------------------------------------------- Memória -- */

/**
 * A escolha do fundo fica salva. Regra do humano (2026-09-18): trocar a
 * amostra de uma caixa é decisão, não experimento — quem volta à página
 * encontra o fundo que escolheu, e o contraste automático não desfaz.
 *
 * Tudo num objeto só, por chave `rota#seção`: a caixa não tem identidade
 * própria no DOM, e o par rota+título é o que ela tem de estável.
 */
const CHAVE = "ds:fundo-preview";

const eFundo = (v: unknown): v is Fundo => FUNDOS.some((f) => f.id === v);

function lerTudo(): Record<string, Fundo> {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return {};
    const dados: unknown = JSON.parse(bruto);
    if (!dados || typeof dados !== "object") return {};
    return Object.fromEntries(Object.entries(dados as Record<string, unknown>).filter(([, v]) => eFundo(v))) as Record<
      string,
      Fundo
    >;
  } catch {
    // navegação anônima, storage bloqueado ou JSON estragado: sem memória, e
    // a página continua de pé com o padrão.
    return {};
  }
}

export function lerFundoSalvo(chave: string): Fundo | null {
  return lerTudo()[chave] ?? null;
}

export function salvarFundo(chave: string, fundo: Fundo) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify({ ...lerTudo(), [chave]: fundo }));
  } catch {
    // idem: não poder salvar não pode quebrar a troca de fundo
  }
}

/* ------------------------------------------------------------ Contraste -- */

const TRANSPARENTE = /^(transparent|rgba\(0, 0, 0, 0\))$/;

/** Elemento sem fundo próprio: o que está atrás dele atravessa. */
function naoPinta(cs: CSSStyleDeclaration) {
  return TRANSPARENTE.test(cs.backgroundColor) && cs.backgroundImage === "none";
}

/** Só conta quem se apoia DIRETO na caixa. Um bloco `background` dentro de um
 *  card não some — o card é que está atrás dele, não a caixa. */
function apoiadoNaCaixa(el: HTMLElement, caixa: HTMLElement) {
  for (let p = el.parentElement; p && p !== caixa; p = p.parentElement) {
    if (!naoPinta(getComputedStyle(p))) return false;
  }
  return true;
}

/**
 * A regra de contraste: um elemento some quando pinta a MESMA cor da caixa,
 * não tem traço nem sombra que o recorte, e está apoiado direto nela.
 *
 * O caso que motivou isto é a Tag do drawer: ela é `--input-bg-disabled`, que
 * é alias de `--background` — o mesmo cinza do padrão da caixa. Sobre ele a
 * pílula existe e não se vê.
 */
export function somemNoFundo(caixa: HTMLElement) {
  const fundo = getComputedStyle(caixa).backgroundColor;
  // teto de varredura: um preview dá no máximo algumas centenas de nós, e
  // passar de mil aqui custaria mais do que a regra resolve.
  const nos = Array.from(caixa.querySelectorAll<HTMLElement>("*")).slice(0, 1000);
  for (const el of nos) {
    const cs = getComputedStyle(el);
    if (cs.backgroundColor !== fundo || cs.backgroundImage !== "none") continue;
    if (cs.boxShadow !== "none") continue;
    if (["Top", "Right", "Bottom", "Left"].some((l) => parseFloat(cs[`border${l}Width` as never]) > 0)) continue;
    const r = el.getBoundingClientRect();
    // menor que isto é filete de layout, não superfície que o olho procura
    if (r.width < 16 || r.height < 12) continue;
    if (!apoiadoNaCaixa(el, caixa)) continue;
    return true;
  }
  return false;
}

/** Valor real do token, para medir sem trocar as classes da caixa. */
function corDoToken(token: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return v ? `hsl(${v})` : "";
}

/** O primeiro neutro, na ordem de FUNDOS, em que nada some. `null` se todos
 *  colidem — aí o padrão fica de pé e quem decide é o humano. */
export function primeiroFundoLimpo(caixa: HTMLElement): Fundo | null {
  const salvo = caixa.style.backgroundColor;
  try {
    for (const f of FUNDOS) {
      caixa.style.backgroundColor = corDoToken(f.token);
      if (!somemNoFundo(caixa)) return f.id;
    }
    return null;
  } finally {
    caixa.style.backgroundColor = salvo;
  }
}

export function SeletorDeFundo({
  valor,
  aoEscolher,
  trocadoAuto,
  className,
}: {
  valor: Fundo;
  aoEscolher: (f: Fundo) => void;
  /** Ligado quando foi a regra de contraste que escolheu, não o humano. */
  trocadoAuto?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {trocadoAuto ? (
        <span
          className="chrome-meta text-subtle-foreground"
          title="O componente usava o mesmo tom do fundo padrão e sumia. Pode trocar."
        >
          contraste
        </span>
      ) : null}
      <div
        role="radiogroup"
        aria-label="Fundo do preview"
        // `card`, não `background`: o trilho não pode ser um dos neutros que
        // ele oferece, senão a amostra "Página" some dentro dele — o mesmo
        // problema que a regra de contraste existe para resolver.
        className="flex items-center gap-1 rounded-lg border border-border bg-card p-1"
      >
        {FUNDOS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={valor === f.id}
            aria-label={f.rotulo}
            title={f.rotulo}
            onClick={() => aoEscolher(f.id)}
            className={cn(
              "size-5 rounded-md transition-colors",
              `${foco}`,
              f.classe,
              // seleção por traço, não por halo: halo pinta uma cor sólida em
              // volta e mentiria sobre o neutro que a amostra está mostrando
              valor === f.id ? "border-2 border-primary" : "border border-border hover:border-muted-foreground",
            )}
          />
        ))}
      </div>
    </div>
  );
}
