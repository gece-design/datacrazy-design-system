// Os tons de cor do design system — os catorze de `[data-tom]` no globals.css.
// Moram aqui, e não na Tag, porque o Avatar e o seletor de cor também os usam
// (regra D21: helper compartilhado fica em lib/, senão instalar o Avatar
// puxaria a Tag inteira).

/** Os catorze tons, na ordem do círculo de cores — é a ordem das amostras de
 *  quem cria a tag. Com a tag sem tom (cinza), são quinze cores (cliente,
 *  2026-09-28; humano, 2026-10-01). Ninguém inventa cor: escolhe um. */
export const TONS = [
  "azul", "indigo", "roxo", "fucsia", "rosa", "vermelho", "laranja",
  "ambar", "amarelo", "lima", "verde", "turquesa", "ciano", "marrom",
] as const;
export type Tom = (typeof TONS)[number];

/** O sorteio continua nos seis de sempre: abrir a paleta não pode trocar a cor
    de uma lista que já existe. Verde e vermelho ficam fora porque querem dizer
    "deu certo" e "deu errado" — uma lista qualquer em vermelho lê como alarme.
    Os tons novos entram por escolha de quem cria. */
const SORTEAVEIS: Tom[] = ["azul", "roxo", "rosa", "laranja", "ciano", "ambar"];

/**
 * Tom estável a partir de um texto — a mesma lista (ou a mesma pessoa) recebe
 * sempre a mesma cor, em qualquer máquina e entre recargas. Serve de padrão
 * quando ninguém escolheu: uma tag nova nasce colorida em vez de cinza, e o
 * avatar sem foto ganha cor pelo nome.
 */
export function tomDe(chave: string): Tom {
  let h = 0;
  for (let i = 0; i < chave.length; i++) h = (h * 31 + chave.charCodeAt(i)) >>> 0;
  return SORTEAVEIS[h % SORTEAVEIS.length];
}
