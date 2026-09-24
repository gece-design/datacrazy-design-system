"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  CaretDown,
  CaretUp,
  Columns,
  DotsThree,
  DotsThreeVertical,
  Rows,
  SortAscending,
  SortDescending,
  Stack,
  type Icon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Tag, type Tom } from "@/components/ui/tag";
import { Button, BotaoFechar } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Menu, type ItemDoMenu } from "@/components/ui/menu";
import { useSaida } from "@/lib/use-saida";

import { foco, focoInterno } from "@/lib/estados";
import { AcaoCampo } from "@/components/ui/input";
/**
 * Data Table — espelho do component set "Data Table" do Figma (node 331:1354).
 *
 * O arquivo desenha com caixas empilhadas. Aqui é `<table>` de verdade: numa
 * tabela de CRM o leitor de tela precisa anunciar linha e coluna, e ordenação,
 * seleção e navegação por teclado se apoiam nessa estrutura depois.
 *
 * As larguras do arquivo (230 · 170 · 160 · 150 · 200 · 180 · 42) viram
 * proporção, não pixel: a tabela do CRM vive em telas de largura variável, e
 * coluna fixa em px é o bug #83285 esperando acontecer. Pixel só entra quando
 * a PESSOA redimensiona uma coluna — aí a medida é dela, e fica guardada.
 *
 * Os comportamentos (T1, reunião de 2026-09-18 · referência: grid do ExtJS):
 * ordenar pelo cabeçalho, esconder e reordenar colunas pelo menu do cabeçalho
 * ou pelo botão Colunas da barra, redimensionar pela alça, arrastar o
 * cabeçalho, e selecionar linha. Tudo isso mora em `useAjustesDaTabela`: a
 * tela cria os ajustes uma vez e passa para a tabela e para o botão da barra.
 * A tabela só EMITE a ordenação — as linhas chegam como filhos, então quem
 * ordena os dados é a tela (`ordenarPor` ajuda). Agrupar (T2) segue a mesma
 * regra: os ajustes guardam a coluna do grupo e os grupos recolhidos; a tela
 * monta os grupos (`agruparPor`) e desenha um `DataTableGrupo` antes das
 * linhas de cada um. Sem `ajustes`, a tabela é a do arquivo: nada muda.
 * Seleção em massa (2026-09-24): `selecao` na tabela põe a caixa no cabeçalho
 * e nas linhas com `chave`; a tela guarda os ids (`useSelecaoDaTabela`) e
 * desenha a `BarraDeSelecao` com as ações.
 *
 * `layout="compacta"` é o `Layout=Compact` que o drawer usa (node 597:5983):
 * traço `border` em volta e entre linhas, recuo de 12px e sem largura mínima.
 */

export type ColunaTabela = {
  chave: string;
  rotulo: string;
  /** Largura relativa. Os números do arquivo servem direto como peso. */
  peso: number;
  /** Coluna de ações fica à direita e não tem rótulo visível. */
  alinharFim?: boolean;
  /** Clique no cabeçalho ordena por ela. Padrão: sim, com `ajustes` ou `aoOrdenar`; a de ações, não. */
  ordenavel?: boolean;
  /** Pode sair da tela pelo menu Colunas. Padrão: sim; a de ações e a primeira, não. */
  ocultavel?: boolean;
  /** Largura mínima ao redimensionar, em px. Padrão 64. */
  minimo?: number;
  /** Entra no "Agrupar por" (barra e menu da coluna). Padrão: não. */
  agrupavel?: boolean;
};

export type OrdemTabela = { chave: string; direcao: "asc" | "desc" } | null;

/** Todo texto dos controles vem de fora (a UI é multi-idioma); estes são os de fábrica. */
export type RotulosDaTabela = {
  menuDaColuna: (coluna: string) => string;
  ordenar: (coluna: string) => string;
  crescente: string;
  decrescente: string;
  semOrdem: string;
  moverEsquerda: string;
  moverDireita: string;
  colunas: string;
  restaurar: string;
  redimensionar: (coluna: string) => string;
  /** O seletor da barra. Ex.: "Agrupar por". */
  agrupar: string;
  semGrupos: string;
  agruparPor: (coluna: string) => string;
  desagrupar: string;
  recolherGrupo: (grupo: string) => string;
  expandirGrupo: (grupo: string) => string;
  /** Nome da caixa do cabeçalho (seleção em massa). */
  selecionarTodos: string;
  /** Nome da caixa da linha, com o nome do registro quando a linha o passa. */
  selecionarLinha: (nome: string) => string;
  /** A barra: "3 selecionados". */
  selecionados: (n: number) => string;
  limparSelecao: string;
};

export const ROTULOS_DA_TABELA: RotulosDaTabela = {
  menuDaColuna: (c) => `Opções da coluna ${c}`,
  ordenar: (c) => `Ordenar por ${c}`,
  crescente: "Crescente",
  decrescente: "Decrescente",
  semOrdem: "Sem ordenação",
  moverEsquerda: "Mover para a esquerda",
  moverDireita: "Mover para a direita",
  colunas: "Colunas",
  restaurar: "Restaurar colunas",
  redimensionar: (c) => `Redimensionar coluna ${c}`,
  agrupar: "Agrupar por",
  semGrupos: "Sem grupos",
  agruparPor: (c) => `Agrupar por ${c}`,
  desagrupar: "Desagrupar",
  recolherGrupo: (g) => `Recolher ${g}`,
  expandirGrupo: (g) => `Expandir ${g}`,
  selecionarTodos: "Selecionar todas as linhas",
  selecionarLinha: (nome) => (nome ? `Selecionar ${nome}` : "Selecionar linha"),
  selecionados: (n) => `${n} ${n === 1 ? "selecionado" : "selecionados"}`,
  limparSelecao: "Limpar seleção",
};

const LARGURA_MINIMA = 64;
/** A coluna da caixa de seleção. */
const LARGURA_DA_CAIXA = 44;
const PASSO_DO_TECLADO = 16;
/** Arrasto começa depois disto: antes, é clique (ordenar). */
const LIMIAR_DE_ARRASTO = 6;

const ordenavel = (c: ColunaTabela) => c.ordenavel ?? !(c.alinharFim && !c.rotulo);
const ocultavel = (c: ColunaTabela, i: number) => c.ocultavel ?? !(i === 0 || (c.alinharFim && !c.rotulo));

/* -------------------------------------------------------------- Ajustes -- */

type Guardado = {
  ordem: OrdemTabela;
  escondidas: string[];
  sequencia: string[];
  larguras: Record<string, number>;
  /** A coluna que agrupa, ou nada. */
  grupo: string | null;
  /** Ids dos grupos recolhidos. */
  recolhidos: string[];
};

const CHAVE_DA_MEMORIA = "ds:tabela";

function lerMemoria(memoria: string, chaves: string[]): Guardado | null {
  try {
    const bruto = window.localStorage.getItem(`${CHAVE_DA_MEMORIA}:${memoria}`);
    if (!bruto) return null;
    const g = JSON.parse(bruto) as Partial<Guardado>;
    const valida = (k: unknown): k is string => typeof k === "string" && chaves.includes(k);
    return {
      ordem: g.ordem && valida(g.ordem.chave) && (g.ordem.direcao === "asc" || g.ordem.direcao === "desc") ? g.ordem : null,
      escondidas: Array.isArray(g.escondidas) ? g.escondidas.filter(valida) : [],
      // coluna nova no código entra no fim; coluna que sumiu do código sai
      sequencia: Array.isArray(g.sequencia) ? [...g.sequencia.filter(valida), ...chaves.filter((k) => !g.sequencia!.includes(k))] : chaves,
      larguras: Object.fromEntries(Object.entries(g.larguras ?? {}).filter(([k, v]) => valida(k) && typeof v === "number")),
      grupo: valida(g.grupo) ? g.grupo : null,
      recolhidos: Array.isArray(g.recolhidos) ? g.recolhidos.filter((x): x is string => typeof x === "string") : [],
    };
  } catch {
    // navegação anônima, storage bloqueado ou JSON estragado: sem memória
    return null;
  }
}

function salvarMemoria(memoria: string, g: Guardado) {
  try {
    window.localStorage.setItem(`${CHAVE_DA_MEMORIA}:${memoria}`, JSON.stringify(g));
  } catch {
    // não poder salvar não pode quebrar a tabela
  }
}

export interface AjustesDaTabela {
  /** As colunas como a tela declarou. */
  colunas: ColunaTabela[];
  /** As que estão na tela, na ordem atual. */
  naTela: ColunaTabela[];
  /** Todas as chaves, na ordem atual (as escondidas também). */
  sequencia: string[];
  escondidas: string[];
  /** Larguras em px, só depois que a pessoa redimensionou. Vazio = proporcional. */
  larguras: Record<string, number>;
  ordem: OrdemTabela;
  ordenar: (ordem: OrdemTabela) => void;
  /** Esconde ou mostra uma coluna. */
  alternarColuna: (chave: string) => void;
  /** Põe `chave` antes ou depois de `destino`. */
  mover: (chave: string, destino: string, lado: "antes" | "depois") => void;
  /** Uma posição para o lado, entre as visíveis (menu e teclado). */
  deslocar: (chave: string, passo: -1 | 1) => void;
  /** `atuais`: a foto das larguras no momento em que o arrasto começa (a
   *  primeira vez, quando ainda eram proporcionais). */
  redimensionar: (chave: string, largura: number, atuais?: Record<string, number>) => void;
  restaurar: () => void;
  /** A coluna que agrupa as linhas, ou `null`. A tela monta os grupos com `agruparPor`. */
  grupo: string | null;
  agrupar: (chave: string | null) => void;
  /** Ids dos grupos recolhidos. */
  recolhidos: string[];
  alternarGrupo: (id: string) => void;
  /** Algo saiu do padrão da tela. */
  mexido: boolean;
  rotulos: RotulosDaTabela;
}

/**
 * O estado de uma tabela ajustável: ordenação, colunas escondidas, ordem das
 * colunas e larguras. Com `memoria`, fica salvo no navegador por essa chave
 * (uma por tela) — quem volta encontra a tabela como deixou, como o fundo do
 * preview. Lido só depois de montar: no servidor não há storage.
 */
export function useAjustesDaTabela(
  colunas: ColunaTabela[],
  {
    memoria,
    ordemInicial = null,
    grupoInicial = null,
    rotulos,
  }: { memoria?: string; ordemInicial?: OrdemTabela; grupoInicial?: string | null; rotulos?: Partial<RotulosDaTabela> } = {},
): AjustesDaTabela {
  const chaves = React.useMemo(() => colunas.map((c) => c.chave), [colunas]);
  const padrao = React.useMemo<Guardado>(
    () => ({ ordem: ordemInicial, escondidas: [], sequencia: chaves, larguras: {}, grupo: grupoInicial, recolhidos: [] }),
    [chaves, ordemInicial, grupoInicial],
  );
  const [estado, setEstado] = React.useState<Guardado>(padrao);
  const [lido, setLido] = React.useState(!memoria);

  React.useEffect(() => {
    if (!memoria) return;
    const salvo = lerMemoria(memoria, chaves);
    if (salvo) setEstado(salvo);
    setLido(true);
  }, [memoria, chaves]);

  React.useEffect(() => {
    if (memoria && lido) salvarMemoria(memoria, estado);
  }, [memoria, lido, estado]);

  const naTela = React.useMemo(
    () =>
      estado.sequencia
        .map((k) => colunas.find((c) => c.chave === k))
        .filter((c): c is ColunaTabela => Boolean(c) && !estado.escondidas.includes(c!.chave)),
    [colunas, estado.sequencia, estado.escondidas],
  );

  const mover = React.useCallback((chave: string, destino: string, lado: "antes" | "depois") => {
    setEstado((e) => {
      if (chave === destino) return e;
      const sem = e.sequencia.filter((k) => k !== chave);
      const i = sem.indexOf(destino);
      if (i < 0) return e;
      sem.splice(lado === "antes" ? i : i + 1, 0, chave);
      return { ...e, sequencia: sem };
    });
  }, []);

  const deslocar = React.useCallback(
    (chave: string, passo: -1 | 1) => {
      const visiveis = naTela.map((c) => c.chave);
      const i = visiveis.indexOf(chave);
      const vizinho = visiveis[i + passo];
      if (i < 0 || !vizinho) return;
      mover(chave, vizinho, passo > 0 ? "depois" : "antes");
    },
    [naTela, mover],
  );

  const mexido =
    Boolean(estado.ordem) !== Boolean(padrao.ordem) ||
    estado.ordem?.chave !== padrao.ordem?.chave ||
    estado.ordem?.direcao !== padrao.ordem?.direcao ||
    estado.escondidas.length > 0 ||
    estado.sequencia.join() !== chaves.join() ||
    Object.keys(estado.larguras).length > 0 ||
    estado.grupo !== padrao.grupo ||
    estado.recolhidos.length > 0;

  return {
    colunas,
    naTela,
    sequencia: estado.sequencia,
    escondidas: estado.escondidas,
    larguras: estado.larguras,
    ordem: estado.ordem,
    ordenar: (ordem) => setEstado((e) => ({ ...e, ordem })),
    alternarColuna: (chave) =>
      setEstado((e) => ({
        ...e,
        escondidas: e.escondidas.includes(chave) ? e.escondidas.filter((k) => k !== chave) : [...e.escondidas, chave],
      })),
    mover,
    deslocar,
    redimensionar: (chave, largura, atuais) =>
      setEstado((e) => ({ ...e, larguras: { ...(atuais ?? {}), ...e.larguras, [chave]: Math.round(largura) } })),
    restaurar: () => setEstado(padrao),
    grupo: estado.grupo,
    // trocar o grupo abre todos: os ids recolhidos eram do agrupamento anterior
    agrupar: (chave) => setEstado((e) => ({ ...e, grupo: chave, recolhidos: [] })),
    recolhidos: estado.recolhidos,
    alternarGrupo: (id) =>
      setEstado((e) => ({ ...e, recolhidos: e.recolhidos.includes(id) ? e.recolhidos.filter((x) => x !== id) : [...e.recolhidos, id] })),
    mexido,
    rotulos: { ...ROTULOS_DA_TABELA, ...rotulos },
  };
}

/** Ordena a lista pela ordem que a tabela emitiu. `valor` diz o que cada
 *  coluna lê do item — número compara como número, texto como texto em pt-BR. */
export function ordenarPor<T>(
  itens: T[],
  ordem: OrdemTabela,
  valor: (item: T, chave: string) => string | number | null | undefined,
): T[] {
  if (!ordem) return itens;
  const sentido = ordem.direcao === "asc" ? 1 : -1;
  return [...itens].sort((a, b) => {
    const va = valor(a, ordem.chave);
    const vb = valor(b, ordem.chave);
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    if (typeof va === "number" && typeof vb === "number") return (va - vb) * sentido;
    return String(va).localeCompare(String(vb), "pt-BR", { numeric: true, sensitivity: "base" }) * sentido;
  });
}

export type GrupoTabela<T> = { id: string; rotulo: string; itens: T[] };

/** Monta os grupos na ordem em que aparecem (ordene as linhas antes), ou na
 *  `ordemDosGrupos` dada — a do funil, por exemplo. */
export function agruparPor<T>(
  itens: T[],
  grupoDe: (item: T) => { id: string; rotulo: string },
  ordemDosGrupos?: string[],
): GrupoTabela<T>[] {
  const grupos = new Map<string, GrupoTabela<T>>();
  for (const item of itens) {
    const g = grupoDe(item);
    const atual = grupos.get(g.id) ?? { id: g.id, rotulo: g.rotulo, itens: [] };
    atual.itens.push(item);
    grupos.set(g.id, atual);
  }
  const lista = [...grupos.values()];
  if (!ordemDosGrupos) return lista;
  const posicao = (id: string) => {
    const i = ordemDosGrupos.indexOf(id);
    return i < 0 ? ordemDosGrupos.length : i;
  };
  return lista.sort((a, b) => posicao(a.id) - posicao(b.id));
}

/* ----------------------------------------------------------------- Menu -- */
// O menu (`role="menu"`, teclado, portal) mora em components/ui/menu.tsx desde
// 2026-09-23 — o pipeline e outras telas usam o mesmo.

/** Os itens de esconder/mostrar coluna — os mesmos no menu do cabeçalho e no botão da barra. */
function itensDeColunas(a: AjustesDaTabela, separadorAntes: boolean): ItemDoMenu[] {
  return a.colunas
    .map((c, i) => ({ c, i }))
    .filter(({ c, i }) => ocultavel(c, i))
    .map(({ c }, j) => ({
      id: `coluna-${c.chave}`,
      rotulo: c.rotulo,
      tipo: "check" as const,
      marcado: !a.escondidas.includes(c.chave),
      separadorAntes: separadorAntes && j === 0,
      aoAtivar: () => a.alternarColuna(c.chave),
    }));
}

/**
 * O botão "Colunas" da barra: abre a lista de colunas com um check por
 * coluna e "Restaurar colunas". O menu do cabeçalho também esconde coluna,
 * mas menu escondido no cabeçalho ninguém acha — o botão é o caminho visível.
 */
export function BotaoColunas({ ajustes, className }: { ajustes: AjustesDaTabela; className?: string }) {
  const [aberto, setAberto] = React.useState(false);
  const gatilho = React.useRef<HTMLButtonElement>(null);
  const r = ajustes.rotulos;
  const itens: ItemDoMenu[] = [
    ...itensDeColunas(ajustes, false),
    {
      id: "restaurar",
      rotulo: r.restaurar,
      icone: ArrowCounterClockwise,
      separadorAntes: true,
      desabilitado: !ajustes.mexido,
      aoAtivar: ajustes.restaurar,
    },
  ];
  return (
    <>
      <Button
        ref={gatilho}
        variant="tertiary"
        size="sm"
        aria-haspopup="menu"
        aria-expanded={aberto}
        onClick={() => setAberto((a) => !a)}
        className={className}
      >
        <Columns size={16} weight="regular" aria-hidden="true" />
        {r.colunas}
        {ajustes.escondidas.length > 0 ? (
          <span className="text-muted-foreground">{ajustes.colunas.length - ajustes.escondidas.length}/{ajustes.colunas.length}</span>
        ) : null}
      </Button>
      <Menu
        aberto={aberto}
        gatilho={gatilho}
        rotulo={r.colunas}
        itens={itens}
        aoFechar={(devolver = true) => {
          setAberto(false);
          if (devolver) gatilho.current?.focus();
        }}
      />
    </>
  );
}

/**
 * O "Agrupar por" da barra: o mesmo botão `tertiary` do Colunas, abrindo um
 * menu com "Sem grupos" e as colunas `agrupavel` (itens de rádio). Com grupo
 * ativo vira `soft` e diz qual — o mesmo sinal do Filtros do Header. Era um
 * Select: duas superfícies na mesma barra (humano, 2026-09-24, ADR-031). O
 * menu da coluna também agrupa — o botão é o caminho visível.
 */
export function BotaoAgrupar({ ajustes, className }: { ajustes: AjustesDaTabela; className?: string }) {
  const [aberto, setAberto] = React.useState(false);
  const gatilho = React.useRef<HTMLButtonElement>(null);
  const r = ajustes.rotulos;
  const atual = ajustes.colunas.find((c) => c.chave === ajustes.grupo);
  const itens: ItemDoMenu[] = [
    { id: "sem-grupos", rotulo: r.semGrupos, tipo: "radio", marcado: !ajustes.grupo, aoAtivar: () => ajustes.agrupar(null) },
    ...ajustes.colunas
      .filter((c) => c.agrupavel)
      .map((c) => ({ id: `grupo-${c.chave}`, rotulo: c.rotulo, tipo: "radio" as const, marcado: ajustes.grupo === c.chave, aoAtivar: () => ajustes.agrupar(c.chave) })),
  ];
  return (
    <>
      <Button
        ref={gatilho}
        variant={atual ? "soft" : "tertiary"}
        size="sm"
        aria-haspopup="menu"
        aria-expanded={aberto}
        onClick={() => setAberto((a) => !a)}
        className={className}
      >
        <Stack size={16} weight="regular" aria-hidden="true" />
        {atual ? r.agruparPor(atual.rotulo) : r.agrupar}
      </Button>
      <Menu
        aberto={aberto}
        gatilho={gatilho}
        rotulo={r.agrupar}
        itens={itens}
        aoFechar={(devolver = true) => {
          setAberto(false);
          if (devolver) gatilho.current?.focus();
        }}
      />
    </>
  );
}

/* --------------------------------------------------------------- Tabela -- */

type Layout = "padrao" | "compacta";

/** A seleção em massa por dentro: o que a linha precisa para desenhar a caixa. */
type SelecaoInterna = {
  selecionados: string[];
  alternar: (chave: string, shift: boolean) => void;
  rotulos: RotulosDaTabela;
};

type ContextoDaTabela = {
  layout: Layout;
  /** As chaves como a tela declarou — é por elas que a célula sem `coluna` se acha, pela posição. */
  chaves: string[];
  /** As que estão na tela, na ordem atual. `null` = tabela sem ajustes: a linha desenha as células como vieram. */
  naTela: string[] | null;
  /** `null` = sem seleção em massa: a linha não desenha a caixa. */
  selecao: SelecaoInterna | null;
};
const Contexto = React.createContext<ContextoDaTabela>({ layout: "padrao", chaves: [], naTela: null, selecao: null });

type Arrasto = { chave: string; x: number; y: number; alvo: { chave: string; lado: "antes" | "depois" } | null; ativo: boolean };

export interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  colunas: ColunaTabela[];
  layout?: Layout;
  /** Liga os comportamentos: menu do cabeçalho, colunas, mover, redimensionar. Vem de `useAjustesDaTabela`. */
  ajustes?: AjustesDaTabela;
  /** Só ordenar, sem o resto: a ordem atual e o que fazer quando a pessoa clica no cabeçalho. `ajustes` já traz os dois. */
  ordem?: OrdemTabela;
  aoOrdenar?: (ordem: OrdemTabela) => void;
  rotulos?: Partial<RotulosDaTabela>;
  /** Seleção em massa: a caixa no cabeçalho e em cada linha com `chave`. Vem de `useSelecaoDaTabela`. */
  selecao?: SelecaoDaTabela;
}

export const DataTable = React.forwardRef<HTMLDivElement, DataTableProps>(
  ({ className, colunas, layout = "padrao", ajustes, ordem: ordemDeFora, aoOrdenar: aoOrdenarDeFora, rotulos, selecao, children, ...props }, ref) => {
    const compacta = layout === "compacta";
    const r = { ...ROTULOS_DA_TABELA, ...ajustes?.rotulos, ...rotulos };
    const naTela = ajustes ? ajustes.naTela : colunas;
    const ordem = ajustes ? ajustes.ordem : (ordemDeFora ?? null);
    const aoOrdenar = ajustes ? ajustes.ordenar : aoOrdenarDeFora;
    const chaves = React.useMemo(() => colunas.map((c) => c.chave), [colunas]);

    const cabecalhos = React.useRef<Record<string, HTMLTableCellElement | null>>({});
    const corpo = React.useRef<HTMLTableSectionElement>(null);

    /* Seleção em massa: a tabela só sabe quais linhas estão na tela, na ordem
       em que aparecem — é o que a caixa do cabeçalho e o Shift+clique usam.
       Quem guarda os ids escolhidos é a tela (`selecao`). */
    const [visiveis, setVisiveis] = React.useState<string[]>([]);
    React.useEffect(() => {
      if (!selecao) return;
      const ids = Array.from(corpo.current?.querySelectorAll<HTMLTableRowElement>("tr[data-chave]") ?? []).map((l) => l.dataset.chave ?? "");
      setVisiveis((v) => (v.join("\u0000") === ids.join("\u0000") ? v : ids));
    });
    const ultimaCaixa = React.useRef<string | null>(null);
    const alternarLinha = React.useCallback(
      (chave: string, shift: boolean) => {
        if (!selecao) return;
        const atuais = selecao.selecionados;
        const anterior = ultimaCaixa.current;
        ultimaCaixa.current = chave;
        // Shift+clique marca a faixa entre a última caixa e esta, na ordem da tela
        if (shift && anterior && anterior !== chave) {
          const a = visiveis.indexOf(anterior);
          const b = visiveis.indexOf(chave);
          if (a >= 0 && b >= 0) {
            selecao.aoMudar(Array.from(new Set([...atuais, ...visiveis.slice(Math.min(a, b), Math.max(a, b) + 1)])));
            return;
          }
        }
        selecao.aoMudar(atuais.includes(chave) ? atuais.filter((c) => c !== chave) : [...atuais, chave]);
      },
      [selecao, visiveis],
    );
    const marcadas = selecao ? visiveis.filter((v) => selecao.selecionados.includes(v)).length : 0;
    const todasMarcadas = Boolean(selecao) && visiveis.length > 0 && marcadas === visiveis.length;
    function alternarTodas() {
      if (!selecao) return;
      if (todasMarcadas) selecao.aoMudar(selecao.selecionados.filter((s) => !visiveis.includes(s)));
      else selecao.aoMudar(Array.from(new Set([...selecao.selecionados, ...visiveis])));
    }

    const contexto = React.useMemo<ContextoDaTabela>(
      () => ({
        layout,
        chaves,
        naTela: ajustes ? naTela.map((c) => c.chave) : null,
        selecao: selecao ? { selecionados: selecao.selecionados, alternar: alternarLinha, rotulos: r } : null,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [layout, chaves, ajustes, naTela, selecao?.selecionados, alternarLinha],
    );

    const total = naTela.reduce((n, c) => n + c.peso, 0);
    const emPixel = Boolean(ajustes && Object.keys(ajustes.larguras).length);
    const larguraDe = (c: ColunaTabela) => (emPixel ? ajustes!.larguras[c.chave] ?? Math.round((c.peso / total) * 960) : 0);
    const soma = emPixel ? naTela.reduce((n, c) => n + larguraDe(c), 0) : 0;

    const [menuAberto, setMenuAberto] = React.useState<string | null>(null);
    const gatilhoDoMenu = React.useRef<HTMLButtonElement | null>(null);
    const [arrasto, setArrasto] = React.useState<Arrasto | null>(null);
    const arrastou = React.useRef(false);

    /* Ordenar: clique no cabeçalho gira crescente → decrescente → nada. */
    function alternarOrdem(c: ColunaTabela) {
      if (!aoOrdenar) return;
      if (ordem?.chave !== c.chave) aoOrdenar({ chave: c.chave, direcao: "asc" });
      else if (ordem.direcao === "asc") aoOrdenar({ chave: c.chave, direcao: "desc" });
      else aoOrdenar(null);
    }

    /* A foto das larguras atuais: a primeira vez que alguém redimensiona, as
       colunas ainda são proporcionais e precisam virar px todas de uma vez,
       senão só a mexida teria medida e as outras encolheriam para o mínimo. */
    function larguras() {
      return Object.fromEntries(naTela.map((c) => [c.chave, Math.round(cabecalhos.current[c.chave]?.getBoundingClientRect().width ?? larguraDe(c))]));
    }

    function alcaPonteiro(c: ColunaTabela) {
      return (e: React.PointerEvent<HTMLSpanElement>) => {
        if (!ajustes || e.button !== 0) return;
        e.preventDefault();
        const inicio = e.clientX;
        const foto = larguras();
        const base = foto[c.chave];
        const minimo = c.minimo ?? LARGURA_MINIMA;
        const alca = e.currentTarget;
        alca.setPointerCapture(e.pointerId);
        const mover = (ev: PointerEvent) => ajustes.redimensionar(c.chave, Math.max(minimo, base + ev.clientX - inicio), foto);
        const soltar = () => {
          alca.removeEventListener("pointermove", mover);
          alca.removeEventListener("pointerup", soltar);
          alca.removeEventListener("pointercancel", soltar);
        };
        alca.addEventListener("pointermove", mover);
        alca.addEventListener("pointerup", soltar);
        alca.addEventListener("pointercancel", soltar);
      };
    }

    function alcaTeclado(c: ColunaTabela) {
      return (e: React.KeyboardEvent) => {
        if (!ajustes || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
        e.preventDefault();
        const foto = larguras();
        const passo = (e.shiftKey ? 4 : 1) * PASSO_DO_TECLADO * (e.key === "ArrowRight" ? 1 : -1);
        ajustes.redimensionar(c.chave, Math.max(c.minimo ?? LARGURA_MINIMA, foto[c.chave] + passo), foto);
      };
    }

    /* Arrastar o cabeçalho reordena. O mesmo botão que ordena: até 6px é
       clique; passou disso, vira arrasto e o clique no fim é engolido. */
    function cabecalhoPonteiro(c: ColunaTabela) {
      return (e: React.PointerEvent<HTMLButtonElement>) => {
        if (!ajustes || e.button !== 0) return;
        const origem = { x: e.clientX, y: e.clientY };
        const botao = e.currentTarget;
        arrastou.current = false;
        let ativo = false;
        // captura já no pointerdown: um movimento rápido sai do botão antes do
        // limiar e, sem captura, o pointermove nunca chegaria. O clique continua
        // chegando normalmente quando não há arrasto.
        botao.setPointerCapture(e.pointerId);
        const alvoEm = (x: number): Arrasto["alvo"] => {
          for (const col of naTela) {
            const el = cabecalhos.current[col.chave];
            if (!el) continue;
            const b = el.getBoundingClientRect();
            if (x >= b.left && x <= b.right) return col.chave === c.chave ? null : { chave: col.chave, lado: x < b.left + b.width / 2 ? "antes" : "depois" };
          }
          return null;
        };
        const mover = (ev: PointerEvent) => {
          if (!ativo) {
            if (Math.hypot(ev.clientX - origem.x, ev.clientY - origem.y) < LIMIAR_DE_ARRASTO) return;
            ativo = true;
            arrastou.current = true;
          }
          setArrasto({ chave: c.chave, x: ev.clientX, y: ev.clientY, alvo: alvoEm(ev.clientX), ativo: true });
        };
        const soltar = (ev: PointerEvent) => {
          botao.removeEventListener("pointermove", mover);
          botao.removeEventListener("pointerup", soltar);
          botao.removeEventListener("pointercancel", soltar);
          if (!ativo) return;
          const alvo = alvoEm(ev.clientX);
          if (alvo && ev.type === "pointerup") ajustes.mover(c.chave, alvo.chave, alvo.lado);
          setArrasto(null);
        };
        botao.addEventListener("pointermove", mover);
        botao.addEventListener("pointerup", soltar);
        botao.addEventListener("pointercancel", soltar);
      };
    }

    function itensDoMenu(c: ColunaTabela): ItemDoMenu[] {
      const a = ajustes!;
      const visiveis = naTela.map((x) => x.chave);
      const i = visiveis.indexOf(c.chave);
      const podeOrdenar = ordenavel(c) && Boolean(aoOrdenar);
      const itens: ItemDoMenu[] = [];
      if (podeOrdenar) {
        itens.push(
          { id: "asc", rotulo: r.crescente, icone: SortAscending, marcado: ordem?.chave === c.chave && ordem.direcao === "asc", aoAtivar: () => aoOrdenar!({ chave: c.chave, direcao: "asc" }) },
          { id: "desc", rotulo: r.decrescente, icone: SortDescending, marcado: ordem?.chave === c.chave && ordem.direcao === "desc", aoAtivar: () => aoOrdenar!({ chave: c.chave, direcao: "desc" }) },
        );
      }
      if (c.agrupavel) {
        const agrupada = a.grupo === c.chave;
        itens.push({
          id: "grupo",
          rotulo: agrupada ? r.desagrupar : r.agruparPor(c.rotulo),
          icone: Rows,
          separadorAntes: podeOrdenar,
          aoAtivar: () => a.agrupar(agrupada ? null : c.chave),
        });
      }
      itens.push(
        { id: "esq", rotulo: r.moverEsquerda, icone: ArrowLeft, separadorAntes: podeOrdenar || Boolean(c.agrupavel), desabilitado: i <= 0, aoAtivar: () => a.deslocar(c.chave, -1) },
        { id: "dir", rotulo: r.moverDireita, icone: ArrowRight, desabilitado: i >= visiveis.length - 1, aoAtivar: () => a.deslocar(c.chave, 1) },
        ...itensDeColunas(a, true),
      );
      return itens;
    }

    /* Setas entre as linhas selecionáveis, e sempre uma delas no Tab. */
    React.useEffect(() => {
      const tbody = corpo.current;
      if (!tbody) return;
      const linhas = Array.from(tbody.querySelectorAll<HTMLTableRowElement>("tr[data-selecionavel]"));
      if (!linhas.length) return;
      const selecionada = linhas.find((l) => l.getAttribute("aria-selected") === "true");
      for (const l of linhas) l.tabIndex = l === (selecionada ?? linhas[0]) ? 0 : -1;
    });

    function tecladoDoCorpo(e: React.KeyboardEvent<HTMLTableSectionElement>) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const linhas = Array.from(e.currentTarget.querySelectorAll<HTMLTableRowElement>("tr[data-selecionavel]"));
      const i = linhas.indexOf(e.target as HTMLTableRowElement);
      if (i < 0) return;
      e.preventDefault();
      linhas[Math.min(linhas.length - 1, Math.max(0, i + (e.key === "ArrowDown" ? 1 : -1)))]?.focus();
    }

    const colunaDoMenu = menuAberto ? naTela.find((c) => c.chave === menuAberto) : undefined;
    const emArrasto = arrasto?.ativo ? naTela.find((c) => c.chave === arrasto.chave) : undefined;

    return (
      <Contexto.Provider value={contexto}>
        <div
          ref={ref}
          className={cn("w-full overflow-hidden rounded-md bg-card", compacta && "border border-border", className)}
          {...props}
        >
          {/* O scroll horizontal vive aqui: numa tela estreita a tabela rola,
              em vez de espremer coluna até o texto virar uma letra por linha. */}
          <div className={cn("w-full overflow-x-auto", arrasto?.ativo && "select-none")}>
            <table
              className={cn("w-full table-fixed border-collapse", !compacta && !emPixel && "min-w-[1160px]")}
              // com larguras em px a tabela mede a soma delas: passou da caixa, rola
              style={emPixel ? { minWidth: soma } : undefined}
            >
              <colgroup>
                {selecao ? <col style={{ width: LARGURA_DA_CAIXA }} /> : null}
                {naTela.map((c) => (
                  <col
                    key={c.chave}
                    // com a caixa, as proporções descontam a coluna dela — senão a soma passa de 100% e a tabela rola
                    style={{
                      width: emPixel
                        ? `${larguraDe(c)}px`
                        : selecao
                          ? `calc(${(c.peso / total) * 100}% - ${Math.round((LARGURA_DA_CAIXA * c.peso) / total)}px)`
                          : `${(c.peso / total) * 100}%`,
                    }}
                  />
                ))}
              </colgroup>
              <thead>
                <tr className="bg-muted">
                  {selecao ? (
                    <th scope="col" className={cn("align-middle", compacta ? "pl-3 pr-1" : "pl-5 pr-1")}>
                      <Checkbox
                        aria-label={r.selecionarTodos}
                        checked={todasMarcadas}
                        indeterminado={marcadas > 0 && !todasMarcadas}
                        onChange={alternarTodas}
                      />
                    </th>
                  ) : null}
                  {naTela.map((c, i) => {
                    const ordenada = ordem?.chave === c.chave ? ordem.direcao : null;
                    const podeOrdenar = Boolean(aoOrdenar) && ordenavel(c);
                    const Seta = ordenada === "asc" ? CaretUp : CaretDown;
                    return (
                      <th
                        key={c.chave}
                        ref={(el) => {
                          cabecalhos.current[c.chave] = el;
                        }}
                        scope="col"
                        aria-sort={podeOrdenar ? (ordenada === "asc" ? "ascending" : ordenada === "desc" ? "descending" : "none") : undefined}
                        className={cn(
                          "group/coluna relative px-2 py-2.5 text-left align-middle text-label-md font-medium text-muted-foreground",
                          c.alinharFim && "text-right",
                          i === 0 && !selecao && (compacta ? "pl-3" : "pl-5"),
                          i === naTela.length - 1 && (compacta ? "pr-3" : "pr-5"),
                          arrasto?.ativo && arrasto.chave === c.chave && "opacity-disabled",
                        )}
                      >
                        <div className={cn("flex min-w-0 items-center gap-1", c.alinharFim && "justify-end")}>
                          {podeOrdenar || ajustes ? (
                            <button
                              type="button"
                              aria-label={podeOrdenar ? r.ordenar(c.rotulo) : undefined}
                              title={podeOrdenar ? r.ordenar(c.rotulo) : undefined}
                              onClick={() => {
                                // o clique que fecha um arrasto não ordena
                                if (arrastou.current || !podeOrdenar) return;
                                alternarOrdem(c);
                              }}
                              onPointerDown={cabecalhoPonteiro(c)}
                              className={cn(
                                "flex min-w-0 items-center gap-1 rounded-sm text-left font-medium transition-colors hover:text-foreground",
                                focoInterno,
                                // arrastar precisa do ponteiro inteiro, inclusive no toque
                                ajustes && "cursor-grab touch-none active:cursor-grabbing",
                                ordenada && "text-foreground",
                              )}
                            >
                              <span className="min-w-0 truncate">{c.rotulo || <span className="sr-only">Ações</span>}</span>
                              {ordenada ? <Seta size={12} weight="bold" aria-hidden="true" className="shrink-0 text-primary" /> : null}
                            </button>
                          ) : (
                            /* A coluna de ações tem rótulo vazio no arquivo. Vazio para
                               quem vê, nomeado para quem ouve. */
                            <span className="min-w-0 truncate">{c.rotulo || <span className="sr-only">Ações</span>}</span>
                          )}

                          {ajustes && c.rotulo ? (
                            // só aparece sob o cursor ou no foco: sete gatilhos fixos
                            // no cabeçalho seriam ruído (regra da tabela do arquivo)
                            <AcaoCampo
                              icone={DotsThreeVertical}
                              rotulo={r.menuDaColuna(c.rotulo)}
                              aria-haspopup="menu"
                              aria-expanded={menuAberto === c.chave}
                              onClick={(e) => {
                                gatilhoDoMenu.current = e.currentTarget;
                                setMenuAberto((m) => (m === c.chave ? null : c.chave));
                              }}
                              className={cn(
                                // sobre o cinza do cabeçalho, o ícone precisa do muted-foreground cheio
                                // (subtle sumia — humano, 2026-09-24)
                                "opacity-0 text-muted-foreground group-hover/coluna:opacity-100 focus-visible:opacity-100",
                                menuAberto === c.chave && "opacity-100 text-foreground",
                              )}
                            />
                          ) : null}
                        </div>

                        {ajustes ? (
                          // A alça: um separador vertical focável na borda direita. Setas
                          // mudam 16px (64 com Shift); o ponteiro arrasta.
                          <span
                            role="separator"
                            aria-orientation="vertical"
                            aria-label={r.redimensionar(c.rotulo || "Ações")}
                            aria-valuenow={emPixel ? larguraDe(c) : undefined}
                            aria-valuemin={c.minimo ?? LARGURA_MINIMA}
                            tabIndex={0}
                            onPointerDown={alcaPonteiro(c)}
                            onKeyDown={alcaTeclado(c)}
                            className={cn(
                              // a linha da alça é um pseudo-elemento: aparece sob o cursor da
                              // coluna, acende em primary sob a própria alça e no foco
                              "absolute inset-y-0 z-dropdown w-2 cursor-col-resize touch-none rounded-sm",
                              "after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2 after:bg-transparent after:transition-colors",
                              "group-hover/coluna:after:bg-divider hover:after:bg-primary focus-visible:after:bg-primary",
                              // na última coluna a alça não vaza da caixa que rola
                              i === naTela.length - 1 ? "right-0" : "-right-1",
                              foco,
                            )}
                          />
                        ) : null}

                        {arrasto?.ativo && arrasto.alvo?.chave === c.chave ? (
                          // onde a coluna arrastada vai cair
                          <span
                            aria-hidden="true"
                            className={cn("pointer-events-none absolute inset-y-0 w-0.5 bg-primary", arrasto.alvo.lado === "antes" ? "left-0" : "right-0")}
                          />
                        ) : null}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody ref={corpo} onKeyDown={tecladoDoCorpo}>
                {children}
              </tbody>
            </table>
          </div>

          {ajustes && colunaDoMenu ? (
            <Menu
              aberto={menuAberto === colunaDoMenu.chave}
              gatilho={gatilhoDoMenu}
              rotulo={r.menuDaColuna(colunaDoMenu.rotulo)}
              itens={itensDoMenu(colunaDoMenu)}
              aoFechar={(devolver = true) => {
                setMenuAberto(null);
                if (devolver) gatilhoDoMenu.current?.focus();
              }}
            />
          ) : null}

          {emArrasto && typeof document !== "undefined"
            ? createPortal(
                // a etiqueta que segue o ponteiro durante o arrasto
                <span
                  aria-hidden="true"
                  className="pointer-events-none fixed z-popover -translate-x-1/2 -translate-y-1/2 rounded-md border border-overlay-border bg-overlay-bg px-2 py-1 text-label-md text-foreground shadow-lg"
                  style={{ top: arrasto!.y, left: arrasto!.x }}
                >
                  {emArrasto.rotulo}
                </span>,
                document.body,
              )
            : null}
        </div>
      </Contexto.Provider>
    );
  },
);
DataTable.displayName = "DataTable";

/**
 * Uma linha. No layout padrão o traço superior é do token `card` — ver a
 * divergência na doc. No compacto o arquivo usa `border`, e ele aparece.
 *
 * O hover NÃO está no arquivo: foi decisão do humano (2026-09-04). Numa lista
 * de 37 linhas o realce sob o cursor é o que evita ler o dado da linha errada.
 * O token é `overlay/item-hover`, que existe para exatamente isto e clareia nos
 * dois temas.
 *
 * Com `aoSelecionar`, a linha é selecionável: clique (fora de botão e campo),
 * Enter ou Espaço escolhem; setas andam entre as linhas; `aria-selected` diz
 * qual está escolhida e o fundo é `overlay/item-selected`. É o mestre-detalhe
 * da referência: a tela liga a linha escolhida ao painel (o Drawer, no CRM).
 *
 * Numa tabela com `ajustes`, as células seguem a ordem e a visibilidade das
 * colunas: cada uma se acha pela prop `coluna`, ou pela posição em que veio.
 */
export type DataTableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  /** A linha escolhida: `aria-selected` e fundo `overlay/item-selected`. */
  selecionada?: boolean;
  /** Liga a seleção: clique fora de botão e campo, Enter ou Espaço. */
  aoSelecionar?: () => void;
  /** O id da linha para a seleção em massa (`selecao` na tabela): a caixa entra sozinha antes da primeira célula. */
  chave?: string;
  /** O nome do registro, para a caixa ter nome: "Selecionar Giovanna Alves". */
  nome?: string;
};

export const DataTableRow = React.forwardRef<HTMLTableRowElement, DataTableRowProps>(
  ({ className, selecionada, aoSelecionar, chave, nome, onClick, onKeyDown, children, ...props }, ref) => {
  const { layout, chaves, naTela, selecao } = React.useContext(Contexto);
  const selecionavel = Boolean(aoSelecionar);
  const comCaixa = Boolean(selecao && chave);
  const marcada = comCaixa && selecao!.selecionados.includes(chave!);
  // O Shift vem do pointerdown na célula: o clique que chega ao input é o que
  // o label dispara, e ele não carrega as teclas. Teclado (Espaço) não passa
  // por aqui, então a marca zera depois de usada.
  const shift = React.useRef(false);

  let celulas: React.ReactNode = children;
  if (naTela) {
    const vindas = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<DataTableCellProps>[];
    const porChave = new Map<string, React.ReactElement<DataTableCellProps>>();
    vindas.forEach((el, i) => {
      const chave = el.props.coluna ?? chaves[i];
      if (chave) porChave.set(chave, el);
    });
    celulas = naTela.map((chave, i) => {
      const el = porChave.get(chave);
      return el ? React.cloneElement(el, { key: chave, primeira: i === 0 && !comCaixa, ultima: i === naTela.length - 1 }) : null;
    });
  }

  return (
    <tr
      ref={ref}
      data-selecionavel={selecionavel || undefined}
      data-chave={comCaixa ? chave : undefined}
      aria-selected={selecionavel ? Boolean(selecionada) || marcada : comCaixa ? marcada : undefined}
      onClick={(e) => {
        onClick?.(e);
        if (!aoSelecionar || e.defaultPrevented) return;
        // clique num botão, link ou campo da linha é dele, não da seleção
        if ((e.target as HTMLElement).closest("button, a, input, label, select, textarea, [role='button'], [role='separator']")) return;
        aoSelecionar();
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (!aoSelecionar || e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          aoSelecionar();
        }
      }}
      className={cn(
        "border-t transition-colors hover:bg-overlay-item-hover",
        layout === "compacta" ? "border-border" : "border-card",
        selecionavel && `cursor-pointer ${focoInterno}`,
        (selecionada || marcada) && "bg-overlay-item-selected hover:bg-overlay-item-selected",
        className,
      )}
      {...props}
    >
      {comCaixa ? (
        <td
          className={cn("select-none align-middle", layout === "compacta" ? "pl-3 pr-1" : "pl-5 pr-1")}
          onPointerDown={(e) => {
            shift.current = e.shiftKey;
          }}
        >
          <Checkbox
            aria-label={selecao!.rotulos.selecionarLinha(nome ?? "")}
            checked={marcada}
            onChange={() => {
              const comShift = shift.current;
              shift.current = false;
              selecao!.alternar(chave!, comShift);
            }}
          />
        </td>
      ) : null}
      {celulas}
    </tr>
  );
  },
);
DataTableRow.displayName = "DataTableRow";

export type DataTableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  primeira?: boolean;
  ultima?: boolean;
  /** A coluna desta célula (`chave`). Sem ela, vale a posição em que a célula veio. */
  coluna?: string;
};

export const DataTableCell = React.forwardRef<HTMLTableCellElement, DataTableCellProps>(
  ({ className, primeira, ultima, coluna: _coluna, ...props }, ref) => {
    const compacta = React.useContext(Contexto).layout === "compacta";
    return (
      <td
        ref={ref}
        className={cn(
          "px-2 py-3 align-middle",
          primeira && (compacta ? "pl-3" : "pl-5"),
          ultima && (compacta ? "pr-3" : "pr-5"),
          className,
        )}
        {...props}
      />
    );
  },
);
DataTableCell.displayName = "DataTableCell";

/* ---------------------------------------------------------------- Grupo -- */

/**
 * A linha de um grupo: ocupa todas as colunas, com o caret que recolhe, o
 * nome, quantas linhas tem e um resumo à direita (o total do grupo, que a
 * tela calcula). Recolhido, a tela deixa de desenhar as linhas dele. As setas
 * da seleção pulam esta linha: ela não é `data-selecionavel`.
 */
export function DataTableGrupo({
  rotulo,
  quantidade,
  resumo,
  aberto,
  aoAlternar,
  rotulos,
  className,
}: {
  rotulo: string;
  quantidade: number;
  /** O total do grupo, à direita. Ex.: "R$ 45.200,00". */
  resumo?: string;
  aberto: boolean;
  aoAlternar: () => void;
  rotulos?: Partial<Pick<RotulosDaTabela, "recolherGrupo" | "expandirGrupo">>;
  className?: string;
}) {
  const { layout, chaves, naTela, selecao } = React.useContext(Contexto);
  const compacta = layout === "compacta";
  const r = { ...ROTULOS_DA_TABELA, ...rotulos };
  return (
    <tr className={cn("border-t bg-muted", compacta ? "border-border" : "border-card", className)}>
      <td colSpan={(naTela ?? chaves).length + (selecao ? 1 : 0)} className={cn("py-2", compacta ? "px-3" : "px-5")}>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            aria-expanded={aberto}
            aria-label={aberto ? r.recolherGrupo(rotulo) : r.expandirGrupo(rotulo)}
            onClick={aoAlternar}
            className={cn("flex min-w-0 items-center gap-2 rounded-sm text-label-lg text-foreground", focoInterno)}
          >
            <CaretDown
              size={14}
              weight="bold"
              aria-hidden="true"
              className={cn("shrink-0 text-muted-foreground transition-transform", !aberto && "-rotate-90")}
            />
            <span className="truncate">{rotulo}</span>
            <span className="tabular-nums text-muted-foreground">{quantidade}</span>
          </button>
          {resumo ? <span className="shrink-0 text-body-sm tabular-nums text-muted-foreground">{resumo}</span> : null}
        </div>
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------- Toolbar -- */

export function DataTableToolbar({
  rotulo,
  total,
  layout = "padrao",
  children,
}: {
  /** Linha de cima, pequena. Ex.: "Total de resultados". */
  rotulo: string;
  /** Linha de baixo, em destaque. Ex.: "37 negócios". */
  total: string;
  /** `compacta`: sem recuo próprio, rótulo em caption e total em h4. */
  layout?: Layout;
  /** Os filtros à direita. */
  children?: React.ReactNode;
}) {
  const compacta = layout === "compacta";
  return (
    <div className={cn("flex w-full flex-wrap items-center justify-between gap-4", !compacta && "px-5 py-4")}>
      <div className={cn("flex flex-col", compacta ? "gap-0.5" : "gap-[3px]")}>
        <p className={cn("text-muted-foreground", compacta ? "text-caption" : "text-body-sm")}>{rotulo}</p>
        <p className={cn("text-foreground", compacta ? "text-h4" : "text-h3")}>{total}</p>
      </div>
      {children ? <div className="flex flex-wrap items-start gap-2">{children}</div> : null}
    </div>
  );
}

/* -------------------------------------------------------------- Seleção -- */

/** A seleção em massa: os ids escolhidos e quem os guarda (a tela). */
export type SelecaoDaTabela = { selecionados: string[]; aoMudar: (ids: string[]) => void };

/** O estado da seleção em massa, pronto para `DataTable selecao=` e `BarraDeSelecao`. */
export function useSelecaoDaTabela(): SelecaoDaTabela & { limpar: () => void } {
  const [selecionados, aoMudar] = React.useState<string[]>([]);
  const limpar = React.useCallback(() => aoMudar([]), []);
  return { selecionados, aoMudar, limpar };
}

/**
 * A barra que sobe quando há linhas marcadas: quantas são, as ações em massa
 * (os filhos, Buttons) e o X que limpa. Escape também limpa — salvo com um
 * menu ou diálogo aberto, que têm o Escape para si. Portal fixo embaixo,
 * centrado, na superfície do Menu (`overlay/*` + `elevation/lg`); entra e
 * sai com fade (humano, 2026-09-24, ADR-031).
 */
export function BarraDeSelecao({
  selecao,
  rotulos,
  children,
  className,
}: {
  selecao: SelecaoDaTabela;
  rotulos?: Partial<Pick<RotulosDaTabela, "selecionados" | "limparSelecao">>;
  children?: React.ReactNode;
  className?: string;
}) {
  const r = { ...ROTULOS_DA_TABELA, ...rotulos };
  const n = selecao.selecionados.length;
  const aberta = n > 0;
  const { saindo, visivel } = useSaida(aberta);
  // saindo, a barra ainda mostra a última conta (não "0 selecionados")
  const ultimo = React.useRef(n);
  if (n > 0) ultimo.current = n;
  const { aoMudar } = selecao;

  React.useEffect(() => {
    if (!aberta) return;
    const teclado = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || document.querySelector('[role="dialog"], [role="menu"]')) return;
      aoMudar([]);
    };
    document.addEventListener("keydown", teclado);
    return () => document.removeEventListener("keydown", teclado);
  }, [aberta, aoMudar]);

  if (!visivel || typeof document === "undefined") return null;
  return createPortal(
    <div
      role="toolbar"
      aria-label={r.selecionados(ultimo.current)}
      className={cn(
        "fixed bottom-6 left-1/2 z-popover flex max-w-[calc(100vw-32px)] -translate-x-1/2 flex-wrap items-center gap-2 rounded-lg border border-overlay-border bg-overlay-bg py-2 pl-4 pr-2 shadow-lg",
        saindo ? "motion-safe:animate-fade-out" : "motion-safe:animate-fade-in-fast",
        className,
      )}
    >
      <span className="text-label-lg tabular-nums text-foreground">{r.selecionados(ultimo.current)}</span>
      <span aria-hidden="true" className="mx-1 h-5 w-px bg-divider" />
      {children}
      <BotaoFechar rotulo={r.limparSelecao} onClick={() => aoMudar([])} className="ml-1" />
    </div>,
    document.body,
  );
}

/* -------------------------------------------------------------- Células -- */

/** Nome com as etiquetas embaixo — a primeira coluna do arquivo. */
export function CelulaLead({ nome, etiquetas = [] }: { nome: string; etiquetas?: EtiquetaDaCelula[] }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      <p className="w-full truncate text-h4 text-foreground" title={nome}>
        {nome}
      </p>
      {etiquetas.length > 0 ? (
        /* As etiquetas são a Tag do DS, a mesma do drawer e do cartão (humano,
           2026-09-24: "outro padrão de tags?"). Quebram linha quando a coluna
           estreita — antes vazavam por cima da coluna vizinha. */
        <div className="flex w-full min-w-0 flex-wrap items-start gap-1">
          {etiquetas.map((e) => {
            const { rotulo, tom } = typeof e === "string" ? { rotulo: e, tom: undefined } : e;
            return (
              <Tag key={rotulo} tom={tom} className="max-w-full" title={rotulo}>
                {rotulo}
              </Tag>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/** Uma etiqueta da `CelulaLead`: só o texto (cinza) ou com um dos tons da Tag. */
export type EtiquetaDaCelula = string | { rotulo: string; tom?: Tom };

/** Valor em cima, complemento embaixo. Ex.: produto e preço. */
export function CelulaDupla({ principal, apoio }: { principal: string; apoio?: string }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-0.5">
      <p className="w-full truncate text-h4 text-foreground" title={principal}>
        {principal}
      </p>
      {apoio ? (
        <p className="w-full truncate text-body-sm text-muted-foreground" title={apoio}>
          {apoio}
        </p>
      ) : null}
    </div>
  );
}

/** Texto simples de uma linha. `enfase` pinta com `primary`, como o arquivo faz
 *  na coluna de atendente. */
export function CelulaTexto({ children, enfase }: { children: string; enfase?: boolean }) {
  return (
    <p
      className={cn(
        "w-full truncate",
        enfase ? "text-label-lg text-primary" : "text-body-lg text-muted-foreground",
      )}
      title={children}
    >
      {children}
    </p>
  );
}

/** Etapa com a barra de progresso embaixo. */
export function CelulaProgresso({ etapa, percentual }: { etapa: string; percentual: number }) {
  const preenchido = Math.min(100, Math.max(0, percentual));
  return (
    <div className="flex min-w-0 flex-col items-start gap-[7px]">
      <p className="w-full truncate text-label-lg text-foreground" title={etapa}>
        {etapa}
      </p>
      <div
        className="h-[5px] w-full overflow-hidden rounded-sm bg-background"
        role="progressbar"
        aria-valuenow={preenchido}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${etapa}: ${preenchido}%`}
      >
        <div className="h-full rounded-sm bg-primary" style={{ width: `${preenchido}%` }} />
      </div>
    </div>
  );
}

/** Duas estatísticas lado a lado, cada uma com número e rótulo. */
export function CelulaEstatisticas({
  itens,
}: {
  itens: { valor: string; rotulo: string }[];
}) {
  return (
    <div className="flex min-w-0 items-start gap-[18px]">
      {itens.map((i) => (
        <div key={i.rotulo} className="flex min-w-0 shrink-0 flex-col items-start gap-0.5">
          <p className="text-h4 tabular-nums text-foreground">{i.valor}</p>
          <p className="w-full truncate text-caption text-muted-foreground" title={i.rotulo}>
            {i.rotulo}
          </p>
        </div>
      ))}
    </div>
  );
}

/** O botão de ações da linha. `DotsThree` do Phosphor, como pede a regra de
 *  ícone do DS — o arquivo desenha "•••" no layout padrão e o glifo no compacto. */
export function CelulaAcoes({ rotulo = "Ações da linha" }: { rotulo?: string }) {
  return (
    <div className="flex justify-end">
      {/* é a mesma ação de 16px do campo (AcaoCampo); o p-0.5 mantém a caixa de 20 do arquivo */}
      <AcaoCampo icone={DotsThree} rotulo={rotulo} className="p-0.5" />
    </div>
  );
}
