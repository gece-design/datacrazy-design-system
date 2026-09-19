// Os estados que todo componente interativo do DS compartilha (regra D21:
// helper de classe mora em lib/, nunca exportado de um componente — o
// registry deriva dependências dos imports, e `checkbox` não deve instalar
// `button` para pegar uma constante).
//
// Foco (interactions.md L1 · calibração D6): outline de 2px na cor `ring`,
// com respiro de 2px TRANSPARENTE. Não é ring com offset: o offset do ring é
// pintado com cor sólida e vira halo errado dentro de card, modal e linha.
//
// Antes deste arquivo a mesma string vivia em 26 lugares, mais 4 cópias de
// uma constante `foco` e 20 lugares com o dialeto antigo (ring). Uma
// constante, um dono.

/** Foco visível padrão: em botão, link, item, célula. */
export const foco =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** Contêiner que ROLA e cortaria o respiro de fora (fileira de abas): anel
 *  interno, a única exceção à D6 — calibração D19, ADR-009. */
export const focoAnel = "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";

/** Célula colada na vizinha (dia do calendário, item de lista densa): o
 *  outline entra 2px em vez de sair, para não pisar na célula ao lado. */
export const focoInterno =
  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring";

/** Controle nativo escondido (checkbox, radio, switch): o anel vai na caixa
 *  desenhada, lendo o foco do `<input>` irmão pelo `peer`. */
export const focoPeer =
  "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring";

/** Campo composto (caixa do Input, busca do Header): o anel no contêiner
 *  quando qualquer filho tem o foco. */
export const focoDentro =
  "focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring";

/** Desabilitado (I5 · interactions.md L4, decisão do gate B0): opacidade por
 *  token e cursor de "não dá", com os eventos MANTIDOS — um tooltip pode
 *  explicar por quê. O hover do elemento fica sob `enabled:` para não
 *  acender num controle apagado. */
export const desabilitado = "disabled:cursor-not-allowed disabled:opacity-disabled";

/** Link ou item sem `disabled` nativo (`aria-disabled`): aqui o
 *  `pointer-events-none` fica, porque sem ele o link navega. */
export const desabilitadoLink = "aria-disabled:pointer-events-none aria-disabled:opacity-disabled";
