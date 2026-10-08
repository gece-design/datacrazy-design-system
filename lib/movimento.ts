// O dono único do movimento do DS (regra D20 · interactions.md L8/L9).
//
// O CSS lê estes números pelo tailwind.config (duration-*, ease-*, delay-* e as
// animações nomeadas); o JavaScript que precisa esperar uma animação acabar
// (Drawer saindo, Toast fechando o vão) lê daqui. Um número em dois lugares é
// como o painel some antes do quadro final.
//
// Valores aprovados pelo humano (gate B0, 2026-09-19): fast 150 (Tooltip e todo
// hover), base 200 (Toast abre e sai, Drawer sai), slow 280 (Drawer entra).
// Desvio da I10 do kit (120/200/320) registrado em ADR-021.

export const DURACAO = {
  fast: 150,
  base: 200,
  slow: 280,
  /** Um ciclo de animação contínua — a ida do brilho do Skeleton; a volta é o
   *  `alternate` do CSS. Não é transição de estado: é o tempo de uma onda que
   *  diz "ainda estou carregando" sem cansar (ADR-078). */
  ciclo: 1400,
} as const;

export const CURVA = {
  /** Entrada: desacelera no fim (o `ease-out` do Tailwind). */
  enter: "cubic-bezier(0, 0, 0.2, 1)",
  /** Saída: acelera — sair não é evento (o `ease-in` do Tailwind). */
  exit: "cubic-bezier(0.4, 0, 1, 1)",
  /** Painel que desliza e assenta em vez de parar seco (Drawer). */
  settle: "cubic-bezier(0.32, 0.72, 0, 1)",
  /** Overshoot: o pulo da estrela do Rating. */
  pop: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  /** Vai e volta: simétrica, para a onda do Skeleton ir e voltar sem solavanco
   *  nas pontas (o `ease-in-out` do CSS). */
  vaivem: "cubic-bezier(0.45, 0, 0.55, 1)",
} as const;

/** Quanto tempo a tela espera antes de desfazer um feedback. Não é animação:
 *  é permanência. Mora aqui pelo mesmo motivo — um número, um dono. */
export const PERMANENCIA = {
  /** Toast na tela (decisão do humano, 2026-09-15). */
  toast: 8000,
  /** O check de "copiado" no lugar do ícone de copiar. */
  copiado: 1500,
} as const;

/** Quem pediu menos movimento ao sistema não espera animação nenhuma (I12).
 *  A redução no CSS é global (globals.css); no JS, quem espera um fim de
 *  animação para desmontar pergunta aqui e desmonta na hora. */
export const reduzido = () =>
  typeof window !== "undefined" && (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
