"use client";

import * as React from "react";

/**
 * Paginação de uma lista de registros — o estado que a tela guarda e as
 * contas que toda tela fazia por conta própria (ADR-079).
 *
 * As regras (docs/regras.md § Paginação): 20 por página, porque 20 linhas de
 * 36px cabem numa janela de 900 sem rolar por dentro; a pessoa pode trocar
 * para 50 ou 100 e a escolha fica lembrada por tela (`memoria`); a página
 * nunca é lembrada — toda entrada começa na primeira; busca, filtro,
 * ordenação e tamanho voltam à primeira (`chave`); a atual nunca passa da
 * última (apagar os registros da última recua para a que sobrou).
 */

/** O tamanho de página do DS. */
export const POR_PAGINA = 20;

/** As opções do menu "N por página". */
export const TAMANHOS_DE_PAGINA = [20, 50, 100];

const CHAVE_DA_MEMORIA = "ds:paginacao";

export interface Paginacao {
  /** A página atual, de 1 a `totalDePaginas` — já recuada quando a lista encolheu. */
  pagina: number;
  porPagina: number;
  totalDePaginas: number;
  /** Quantos registros a lista tem (o que veio de fora). */
  total: number;
  /** O primeiro e o último à vista, contando de 1. Zero quando não há nada. */
  inicio: number;
  fim: number;
  ir: (pagina: number) => void;
  mudarTamanho: (porPagina: number) => void;
  /** Os registros da página atual. */
  fatiar: <T>(lista: T[]) => T[];
}

export function usePaginacao(
  total: number,
  {
    porPagina: inicial = POR_PAGINA,
    tamanhos = TAMANHOS_DE_PAGINA,
    memoria,
    chave,
  }: {
    porPagina?: number;
    /** O tamanho lembrado só vale se estiver entre estes. */
    tamanhos?: number[];
    /** Chave da memória do tamanho no navegador. Sem ela, nada é lembrado. */
    memoria?: string;
    /** O que define a lista (busca, filtros, ordenação): quando muda, volta à primeira página. */
    chave?: string;
  } = {},
): Paginacao {
  const [pagina, setPagina] = React.useState(1);
  const [porPagina, setPorPagina] = React.useState(inicial);

  // o tamanho lembrado entra depois de montar: no servidor não há navegador
  React.useEffect(() => {
    if (!memoria) return;
    try {
      const lembrado = Number(window.localStorage.getItem(`${CHAVE_DA_MEMORIA}:${memoria}`));
      if (lembrado && tamanhos.includes(lembrado)) setPorPagina(lembrado);
    } catch {
      // navegação anônima ou storage bloqueado: sem memória
    }
    // `tamanhos` é uma lista literal na tela; a memória só se lê ao montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoria]);

  // a lista mudou de definição: a página 3 da lista antiga não existe mais
  const primeira = React.useRef(true);
  React.useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    setPagina(1);
  }, [chave]);

  const mudarTamanho = React.useCallback(
    (n: number) => {
      setPorPagina(n);
      setPagina(1);
      if (!memoria) return;
      try {
        window.localStorage.setItem(`${CHAVE_DA_MEMORIA}:${memoria}`, String(n));
      } catch {
        // não poder salvar não pode quebrar a lista
      }
    },
    [memoria],
  );

  const totalDePaginas = Math.max(1, Math.ceil(total / porPagina));
  const atual = Math.min(Math.max(1, pagina), totalDePaginas);
  const inicio = total === 0 ? 0 : (atual - 1) * porPagina + 1;
  const fim = Math.min(atual * porPagina, total);
  const fatiar = React.useCallback(<T,>(lista: T[]) => lista.slice((atual - 1) * porPagina, atual * porPagina), [atual, porPagina]);

  return { pagina: atual, porPagina, totalDePaginas, total, inicio, fim, ir: setPagina, mudarTamanho, fatiar };
}

/** "Mostrando 21–40 de 84 leads". Em pt-BR; a tela em outro idioma escreve o seu. */
export function resumoDaPaginacao({ inicio, fim, total }: Pick<Paginacao, "inicio" | "fim" | "total">, { um, varios }: { um: string; varios: string }) {
  if (total === 0) return `Nenhum ${um}`;
  return `Mostrando ${inicio}–${fim} de ${total} ${total === 1 ? um : varios}`;
}
