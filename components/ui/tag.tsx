"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Buildings, Check, MagnifyingGlass, Plus, User } from "@phosphor-icons/react";
import { caixaDeCampo } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useCliqueFora } from "@/lib/use-clique-fora";
import { PainelFlutuante } from "@/components/ui/popover";

import { foco } from "@/lib/estados";
/**
 * Tag — rótulo em pílula do perfil do lead (node 538:197).
 *
 * O arquivo desenha oito "temas" num eixo só; aqui eles viram três props que
 * se combinam: `status` (bolinha de 6px), `tipo` (pessoa ou empresa, com
 * ícone) e `foto` (atendente). Sem nenhuma, é a tag de texto. O de adicionar é
 * um botão — clicável não é tag — e mora em `TagAdicionar`; com a lista de
 * tags para escolher, em `SeletorTags`.
 */

const pontos = {
  destructive: "bg-destructive",
  info: "bg-info",
  success: "bg-success",
} as const;

/** Os oito tons de `[data-tom]` no globals.css. A tag não inventa cor: escolhe um. */
export const TONS = ["azul", "roxo", "rosa", "laranja", "verde", "ciano", "ambar", "vermelho"] as const;
export type Tom = (typeof TONS)[number];

/** Fora do sorteio: verde e vermelho querem dizer "deu certo" e "deu errado".
    Uma lista qualquer em vermelho lê como alarme. Quem escolher, escolhe. */
const SORTEAVEIS = TONS.filter((t) => t !== "verde" && t !== "vermelho");

/**
 * Tom estável a partir de um texto — a mesma lista recebe sempre a mesma cor,
 * em qualquer máquina e entre recargas. Serve de padrão quando ninguém
 * escolheu: uma tag nova nasce colorida em vez de cinza.
 */
export function tomDe(chave: string): Tom {
  let h = 0;
  for (let i = 0; i < chave.length; i++) h = (h * 31 + chave.charCodeAt(i)) >>> 0;
  return SORTEAVEIS[h % SORTEAVEIS.length];
}

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Bolinha de 6px antes do texto. O texto continua sendo o sinal: a cor só reforça. */
  status?: keyof typeof pontos;
  /** Tipo do registro: ícone de 12px e texto em `primary`. */
  tipo?: "pessoa" | "empresa";
  /** Foto de 22px encostada à esquerda — a tag do atendente. */
  foto?: string;
  /** Um dos oito tons. Sem tom, a tag é cinza — é assim que o atendente fica. */
  tom?: Tom;
  /** Ícone de 12px antes do texto, para quem não distingue as cores. */
  icone?: React.ComponentType<{ size?: number; weight?: "regular" | "fill"; className?: string }>;
}

export function Tag({ status, tipo, foto, tom, icone, className, children, ...props }: TagProps) {
  const Icone = icone ?? (tipo === "pessoa" ? User : tipo === "empresa" ? Buildings : null);
  return (
    <span
      // `data-tom` liga os quatro --tom-* daquele tom neste span (globals.css)
      data-tom={tom}
      className={cn(
        // 22px = 14 de entrelinha + 4 de respiro em cima e embaixo
        "inline-flex h-[22px] shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full px-1.5 text-label-sm uppercase text-foreground",
        // com tom: pastel por fundo, a mesma cor escura na letra. Sem: o cinza de antes.
        tom ? "bg-tom-brilho text-tom-texto" : "bg-input-bg-disabled",
        foto && "pl-0",
        // a tag de tipo não colore o fundo: fica cinza e pega a cor do lead
        // (`--tom-texto` do `[data-tom]` que o perfil do drawer já define).
        tipo && !tom && "text-tom-texto",
        className,
      )}
      {...props}
    >
      {foto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={foto} alt="" className="size-[22px] shrink-0 rounded-full object-cover" />
      ) : null}
      {status ? (
        <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", tom ? "bg-tom-tag" : pontos[status])} />
      ) : null}
      {Icone ? <Icone size={12} weight="regular" className="shrink-0" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export interface TagAdicionarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Obrigatório: o botão só tem ícone. Ex.: "Adicionar tag". */
  rotulo: string;
}

/** O "+" do fim da fileira de tags. É botão, então tem foco e rótulo. */
export const TagAdicionar = React.forwardRef<HTMLButtonElement, TagAdicionarProps>(
  ({ rotulo, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={rotulo}
      title={rotulo}
      className={cn(
        "inline-flex size-[22px] shrink-0 items-center justify-center rounded-full bg-primary text-background shadow-button-inner-primary transition-colors hover:bg-primary-hover",
        `${foco}`,
        className,
      )}
      {...props}
    >
      <Plus size={14} weight="regular" aria-hidden="true" />
    </button>
  ),
);
TagAdicionar.displayName = "TagAdicionar";

/* ------------------------------------------------------------ Seletor -- */

export type OpcaoTag = {
  id: string;
  rotulo: string;
  status?: TagProps["status"];
  foto?: string;
  tom?: Tom;
  icone?: TagProps["icone"];
};
export type GrupoTags = {
  id: string;
  rotulo: string;
  tags: OpcaoTag[];
  /** Nesta aba a cor é escolha de quem cria (Listas). Nas outras ela é regra. */
  corLivre?: boolean;
};

export interface SeletorTagsProps {
  /** Um grupo por aba. Ex.: Status, Listas, Atendentes. */
  grupos: GrupoTags[];
  /** Ids das tags que o lead tem. */
  selecionadas: string[];
  /** Clique numa tag da lista: põe ou tira. */
  aoAlternar: (tag: OpcaoTag) => void;
  /** Sem esta prop, a busca só filtra — não oferece criar. O `tom` só vem
      quando a aba tem `corLivre`; nas outras a cor é da regra do grupo. */
  aoCriar?: (rotulo: string, grupoId: string, tom?: Tom) => void;
  rotulos: {
    /** Nome do botão "+" e do painel. Ex.: "Adicionar tag". */
    gatilho: string;
    /** Placeholder e rótulo da busca. Ex.: "Buscar ou criar tag". */
    busca: string;
    /** Aba sem resultado. Ex.: "Nenhuma tag nesta aba". */
    vazio: string;
    /** A opção de criar. Ex.: (t, g) => `Criar "${t}" em ${g}`. */
    criar: (texto: string, grupo: string) => string;
    /** Rótulo da fileira de cores. Ex.: "Cor da tag". */
    cor: string;
  };
  className?: string;
}

// 360: cabem quatro abas com a contagem (356px medidos) sem a fileira rolar.
const LARGURA = 360;
/** Altura aproximada do painel aberto: decide se ele abre para cima. */
const ALTURA = 360;

/**
 * SeletorTags — o "+" que abre a lista de tags do lead.
 *
 * O painel parte do Select Menu do Figma (544:122): superfície `overlay/bg`,
 * traço `overlay/border`, `elevation/lg`, recuo 6 e item com check à direita
 * quando escolhido. Por cima dele, a pedido do humano (2026-09-15): abas por
 * tipo de tag — a Tab do canvas do drawer (535:21) — e uma busca que também
 * cria a tag quando o texto não existe.
 *
 * Abre num portal com posição fixa, porque o perfil do drawer rola e cortaria
 * um painel absoluto. Escape fecha só o painel (não o drawer por trás) e
 * devolve o foco ao "+".
 */
export function SeletorTags({ grupos, selecionadas, aoAlternar, aoCriar, rotulos, className }: SeletorTagsProps) {
  const [aberto, setAberto] = React.useState(false);
  const [aba, setAba] = React.useState(grupos[0]?.id ?? "");
  const [busca, setBusca] = React.useState("");
  const [ativo, setAtivo] = React.useState(0);
  // `null` = ninguém escolheu ainda: vale o tom que `tomDe` dá ao texto digitado.
  const [tomNovo, setTomNovo] = React.useState<Tom | null>(null);
  const [pos, setPos] = React.useState<{ top?: number; bottom?: number; left: number } | null>(null);
  const gatilho = React.useRef<HTMLButtonElement>(null);
  const painel = React.useRef<HTMLDivElement>(null);
  const campo = React.useRef<HTMLInputElement>(null);
  const id = React.useId().replace(/:/g, "");
  // Base de ids das abas: o `Tabs` monta `${base}-aba-x` e aponta para `${base}-painel-x`.
  const base = `tags-${id}`;

  const grupo = grupos.find((g) => g.id === aba) ?? grupos[0];
  const termo = busca.trim();
  const minusculo = termo.toLocaleLowerCase("pt-BR");
  const filtradas = (grupo?.tags ?? []).filter((t) => t.rotulo.toLocaleLowerCase("pt-BR").includes(minusculo));
  const existe = grupos.some((g) => g.tags.some((t) => t.rotulo.toLocaleLowerCase("pt-BR") === minusculo));
  const podeCriar = Boolean(aoCriar && grupo && termo && !existe);
  const total = filtradas.length + (podeCriar ? 1 : 0);

  const posicionar = React.useCallback(() => {
    const r = gatilho.current?.getBoundingClientRect();
    if (!r) return;
    const left = Math.min(Math.max(8, r.left + r.width / 2 - LARGURA / 2), window.innerWidth - LARGURA - 8);
    const abaixo = window.innerHeight - r.bottom;
    setPos(abaixo < ALTURA && r.top > abaixo ? { bottom: window.innerHeight - r.top + 6, left } : { top: r.bottom + 6, left });
  }, []);

  function abrir() {
    posicionar();
    setBusca("");
    setAtivo(0);
    setTomNovo(null);
    setAberto(true);
  }

  function fechar(devolverFoco = true) {
    setAberto(false);
    if (devolverFoco) gatilho.current?.focus();
  }

  useCliqueFora(aberto, [painel, gatilho], () => setAberto(false));
  React.useEffect(() => {
    if (!aberto) return;
    campo.current?.focus();
    window.addEventListener("resize", posicionar);
    window.addEventListener("scroll", posicionar, true);
    return () => {
      window.removeEventListener("resize", posicionar);
      window.removeEventListener("scroll", posicionar, true);
    };
  }, [aberto, posicionar]);

  function mudarAba(novo: string) {
    setAba(novo);
    setAtivo(0);
    setTomNovo(null);
  }

  function escolher(i: number) {
    if (i < filtradas.length) {
      aoAlternar(filtradas[i]);
    } else if (podeCriar && grupo) {
      aoCriar?.(termo, grupo.id, grupo.corLivre ? (tomNovo ?? tomDe(termo)) : undefined);
      setBusca("");
      setAtivo(0);
      setTomNovo(null);
    }
  }

  function teclado(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      // o drawer também escuta Escape no document: aqui ele fecha só o painel
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      fechar();
    } else if (e.key === "ArrowDown" && total) {
      e.preventDefault();
      setAtivo((a) => (a + 1) % total);
    } else if (e.key === "ArrowUp" && total) {
      e.preventDefault();
      setAtivo((a) => (a - 1 + total) % total);
    } else if (e.key === "Enter" && e.target === campo.current && total) {
      e.preventDefault();
      escolher(ativo);
    }
  }

  const idLista = grupo ? `${base}-painel-${grupo.id}` : undefined;

  return (
    <>
      <TagAdicionar
        ref={gatilho}
        rotulo={rotulos.gatilho}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        aria-controls={aberto ? `seletor-${id}` : undefined}
        onClick={() => (aberto ? fechar(false) : abrir())}
        className={className}
      />
      {aberto && pos
        ? createPortal(
            <PainelFlutuante
              ref={painel}
              id={`seletor-${id}`}
              role="dialog"
              aria-label={rotulos.gatilho}
              onKeyDown={teclado}
              fixo
              style={{ top: pos.top, bottom: pos.bottom, left: pos.left, width: LARGURA }}
              className="flex flex-col overflow-hidden"
            >
              {/* As abas são o `Tabs` do DS (Tab 535:21). Quantas tags do lead há em
                  cada aba vai no rótulo, para a pessoa saber onde procurar. */}
              <Tabs
                id={base}
                rotulo={rotulos.gatilho}
                atual={grupo?.id ?? ""}
                aoEscolher={mudarAba}
                itens={grupos.map((g) => {
                  const quantas = g.tags.filter((t) => selecionadas.includes(t.id)).length;
                  return { valor: g.id, rotulo: quantas ? `${g.rotulo} · ${quantas}` : g.rotulo };
                })}
                className="border-b border-border px-3"
              />

              <div className="p-1.5">
                <label htmlFor={`busca-${id}`} className="sr-only">
                  {rotulos.busca}
                </label>
                <div className={caixaDeCampo()}>
                  <MagnifyingGlass size={16} weight="regular" aria-hidden="true" className="shrink-0 text-input-placeholder" />
                  <input
                    ref={campo}
                    id={`busca-${id}`}
                    role="combobox"
                    aria-expanded="true"
                    aria-controls={idLista}
                    aria-autocomplete="list"
                    aria-activedescendant={total ? `opcao-${id}-${ativo}` : undefined}
                    autoComplete="off"
                    value={busca}
                    onChange={(e) => {
                      setBusca(e.target.value);
                      setAtivo(0);
                    }}
                    placeholder={rotulos.busca}
                    className="h-full min-w-0 flex-1 bg-transparent text-body-md text-input-text outline-none placeholder:text-input-placeholder"
                  />
                </div>
              </div>

              <div
                id={idLista}
                role="listbox"
                aria-multiselectable="true"
                aria-labelledby={grupo ? `${base}-aba-${grupo.id}` : undefined}
                className="flex max-h-60 flex-col gap-0.5 overflow-y-auto overscroll-contain px-1.5 pb-1.5 [scrollbar-width:thin]"
              >
                {filtradas.map((t, i) => {
                  const escolhida = selecionadas.includes(t.id);
                  const emFoco = i === ativo;
                  return (
                    <div
                      key={t.id}
                      id={`opcao-${id}-${i}`}
                      role="option"
                      aria-selected={escolhida}
                      onMouseEnter={() => setAtivo(i)}
                      // o foco fica na busca: clicar não tira o cursor de lá
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => escolher(i)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-1.5 transition-colors",
                        escolhida ? "bg-overlay-item-selected" : emFoco && "bg-overlay-item-hover",
                        // escolhida E sob o teclado: o fundo já é o de selecionada, então o foco ganha traço
                        escolhida && emFoco && "ring-1 ring-inset ring-ring",
                      )}
                    >
                      <Tag status={t.status} foto={t.foto} tom={t.tom} icone={t.icone}>
                        {t.rotulo}
                      </Tag>
                      {escolhida ? (
                        <Check size={16} weight="regular" aria-hidden="true" className="shrink-0 text-overlay-item-text-selected" />
                      ) : null}
                    </div>
                  );
                })}

                {podeCriar && grupo ? (
                  <div
                    id={`opcao-${id}-${filtradas.length}`}
                    role="option"
                    aria-selected={false}
                    onMouseEnter={() => setAtivo(filtradas.length)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => escolher(filtradas.length)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-body-md text-overlay-item-text-selected transition-colors",
                      ativo === filtradas.length && "bg-overlay-item-hover",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Plus size={16} weight="regular" aria-hidden="true" className="shrink-0" />
                      <span className="min-w-0 truncate">{rotulos.criar(termo, grupo.rotulo)}</span>
                    </span>
                    {/* prévia: a tag sai daqui exatamente assim */}
                    {grupo.corLivre ? <Tag tom={tomNovo ?? tomDe(termo)}>{termo}</Tag> : null}
                  </div>
                ) : null}

                {total === 0 ? <p className="px-3 py-2 text-body-md text-muted-foreground">{rotulos.vazio}</p> : null}
              </div>

              {/* Fileira de cores — fora do listbox, porque amostra não é opção
                  de tag. Só nas abas de cor livre: nas outras a cor é regra. */}
              {podeCriar && grupo?.corLivre ? (
                <div role="radiogroup" aria-label={rotulos.cor} className="flex items-center gap-2 border-t border-border px-3 py-2">
                  <span className="shrink-0 text-label-sm uppercase text-muted-foreground">{rotulos.cor}</span>
                  <div className="flex flex-wrap items-center gap-1">
                    {TONS.map((t) => {
                      const marcada = (tomNovo ?? tomDe(termo)) === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          role="radio"
                          aria-checked={marcada}
                          aria-label={t}
                          title={t}
                          data-tom={t}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => setTomNovo(t)}
                          // a amostra mostra as duas cores que a tag vai ter:
                          // o pastel do fundo e a letra por dentro do anel
                          className={cn(
                            "size-4 shrink-0 rounded-full bg-tom-brilho ring-2 ring-inset ring-tom-texto transition-transform",
                            `${foco}`,
                            marcada ? "scale-110 outline outline-2 outline-offset-2 outline-foreground" : "hover:scale-110",
                          )}
                        />
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </PainelFlutuante>,
            document.body,
          )
        : null}
    </>
  );
}
