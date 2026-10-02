"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, MagnifyingGlass, Plus, type Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { buscaDoPainel } from "@/lib/campo";
import { focoInterno, rolagemDiscreta } from "@/lib/estados";
import { useCliqueFora } from "@/lib/use-clique-fora";
import { useSaida } from "@/lib/use-saida";
import { PainelFlutuante } from "@/components/ui/popover";
import {
  GrupoDeOpcoes,
  SelectTrigger,
  agruparOpcoes,
  type OpcaoSelect,
  type SelectTriggerProps,
} from "@/components/ui/select";

/**
 * Combobox — a lista com busca. É o Select para quando a lista é longa (mais
 * de ~10 opções), tem grupos ou aceita várias escolhas (cliente, 2026-09-28:
 * "o catálogo nem lista um componente chamado Combobox separado do Select").
 *
 * Três peças:
 * - `ComboboxPainel`: só o painel (busca + lista), ancorado em qualquer
 *   gatilho — o chip de filtro, a célula da tabela. Controlado, como o Menu.
 * - `Combobox`: gatilho do Select + painel, uma escolha.
 * - `ComboboxMultiplo`: o mesmo, com caixa de marcar; não fecha ao escolher.
 *
 * O foco fica na busca o tempo todo; as setas andam pela lista por
 * `aria-activedescendant` (padrão combobox do WAI-ARIA). Escape fecha só o
 * painel — o Modal ou o Drawer de trás não fecham junto.
 *
 * Três acabamentos vieram da referência do time (Attio, crítica de
 * 2026-09-28): `detalhe` na opção (texto de apoio à direita), `aoCriar` (a
 * busca que não acha oferece criar) e `acao` (uma ação fixa no pé do painel).
 */

/** As do Select — inclusive `conteudo`, a opção como ela aparece na tela (uma `Tag`) —, mais o texto de apoio. */
export type OpcaoCombobox = OpcaoSelect & {
  /** Texto de apoio à direita, apagado: o domínio da empresa, o e-mail da pessoa. A busca também procura nele. */
  detalhe?: string;
};

/** A ação fixa no pé do painel. Ex.: "Gerenciar etapas". */
export type AcaoDoCombobox = { rotulo: string; icone?: Icon; aoAtivar: () => void };

export type RotulosDoCombobox = {
  /** Placeholder e nome da busca. Ex.: "Buscar etapa". */
  busca: string;
  /** Busca sem resultado. Ex.: "Nada encontrado". */
  vazio: string;
  /** A linha de criar, com o texto digitado. Ex.: (t) => `Criar "${t}"`. Passe junto com `aoCriar`. */
  criar?: (texto: string) => string;
};

/** Busca + lista (max-h-80: dez opções à vista) + a ação do pé: entra na medida de "cabe embaixo?". */
const ALTURA_DO_PAINEL = 408;
const LARGURA_DO_PAINEL = 256;

/* Buscar "saude" tem que achar "Saúde": quem digita rápido não põe acento. */
const semAcento = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLocaleLowerCase("pt-BR");

export interface ComboboxPainelProps {
  aberto: boolean;
  /** `devolverFoco` falso quando quem fechou foi um clique fora ou o Tab. */
  aoFechar: (devolverFoco?: boolean) => void;
  /** Quem abriu: dá a posição e recebe o foco de volta. */
  gatilho: React.RefObject<HTMLElement | null>;
  /** Nome do painel para leitor de tela. Ex.: "Filtrar por etapa". */
  rotulo: string;
  opcoes: OpcaoCombobox[];
  /** Os valores escolhidos. */
  selecionados: string[];
  /** Clique numa opção. Com `multiplo`, põe ou tira; sem, escolhe e o painel fecha. */
  aoAlternar: (valor: string) => void;
  /** Várias escolhas: caixa de marcar em cada opção e o painel fica aberto. */
  multiplo?: boolean;
  rotulos: RotulosDoCombobox;
  /** Largura mínima do painel, em px. Padrão 256; nunca menor que o gatilho. */
  largura?: number;
  /** Com ela, a busca que não acha oferece criar: uma linha no fim da lista, com o texto digitado. */
  aoCriar?: (texto: string) => void;
  /** Uma ação fixa no pé do painel, fora da lista. Ativar fecha o painel. */
  acao?: AcaoDoCombobox;
}

export function ComboboxPainel({
  aberto,
  aoFechar,
  gatilho,
  rotulo,
  opcoes,
  selecionados,
  aoAlternar,
  multiplo = false,
  rotulos,
  largura = LARGURA_DO_PAINEL,
  aoCriar,
  acao,
}: ComboboxPainelProps) {
  const painel = React.useRef<HTMLDivElement>(null);
  const campo = React.useRef<HTMLInputElement>(null);
  const [busca, setBusca] = React.useState("");
  const [ativo, setAtivo] = React.useState(0);
  const [pos, setPos] = React.useState<{ top?: number; bottom?: number; left: number; width: number } | null>(null);
  const id = React.useId().replace(/:/g, "");
  const { saindo, visivel } = useSaida(aberto);

  const termo = semAcento(busca.trim());
  const filtradas = termo ? opcoes.filter((o) => semAcento(`${o.rotulo} ${o.detalhe ?? ""}`).includes(termo)) : opcoes;
  // Criar só aparece quando o texto não é o nome de nenhuma opção; entra na
  // fila das setas como o último item.
  const podeCriar = Boolean(aoCriar && termo && !opcoes.some((o) => semAcento(o.rotulo) === termo));
  const total = filtradas.length + (podeCriar ? 1 : 0);

  /* Portal `fixed`, medido a partir do gatilho: o painel abre dentro de Modal,
     de célula de tabela e de barra que rola sem ser cortado (como o Select). */
  const posicionar = React.useCallback(() => {
    const r = gatilho.current?.getBoundingClientRect();
    if (!r) return;
    const width = Math.min(Math.max(r.width, largura), window.innerWidth - 16);
    const abaixo = window.innerHeight - r.bottom;
    const acima = abaixo < ALTURA_DO_PAINEL + 8 && r.top > abaixo;
    setPos({
      ...(acima ? { bottom: window.innerHeight - r.top + 4 } : { top: r.bottom + 4 }),
      left: Math.max(8, Math.min(r.left, window.innerWidth - width - 8)),
      width,
    });
  }, [gatilho, largura]);

  React.useEffect(() => {
    if (!aberto) return;
    posicionar();
    setBusca("");
    // abre na primeira escolhida: quem volta ao painel quer ver o que marcou
    setAtivo(Math.max(0, opcoes.findIndex((o) => selecionados.includes(o.valor))));
    window.addEventListener("resize", posicionar);
    window.addEventListener("scroll", posicionar, true);
    return () => {
      window.removeEventListener("resize", posicionar);
      window.removeEventListener("scroll", posicionar, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto]);

  // o foco entra na busca depois que o painel existe (o portal só monta com `pos`)
  React.useEffect(() => {
    if (aberto && pos) campo.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto, Boolean(pos)]);

  // a opção sob o teclado fica sempre à vista
  React.useEffect(() => {
    if (aberto) document.getElementById(`opcao-${id}-${ativo}`)?.scrollIntoView({ block: "nearest" });
  }, [aberto, ativo, id]);

  useCliqueFora(aberto, [gatilho, painel], () => aoFechar(false));

  function escolher(o: OpcaoCombobox | undefined) {
    if (!o) return;
    aoAlternar(o.valor);
    if (!multiplo) aoFechar();
  }

  function criar() {
    aoCriar?.(busca.trim());
    if (multiplo) {
      setBusca("");
      setAtivo(0);
    } else aoFechar();
  }

  function teclado(e: React.KeyboardEvent) {
    // setas e Enter são da busca; na ação do pé, o botão responde por si
    const naBusca = e.target === campo.current;
    if (e.key === "Escape") {
      e.preventDefault();
      // a camada de trás (Modal, Drawer) também escuta Escape: aqui ele fecha só o painel
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      aoFechar();
    } else if (e.key === "ArrowDown" && naBusca && total) {
      e.preventDefault();
      setAtivo((a) => (a + 1) % total);
    } else if (e.key === "ArrowUp" && naBusca && total) {
      e.preventDefault();
      setAtivo((a) => (a - 1 + total) % total);
    } else if (e.key === "Enter" && naBusca) {
      e.preventDefault();
      if (ativo < filtradas.length) escolher(filtradas[ativo]);
      else if (podeCriar) criar();
    } else if (e.key === "Tab") {
      // com ação no pé, Tab vai da busca para ela e Shift+Tab volta; fora isso, Tab sai do painel
      if (acao && (naBusca ? !e.shiftKey : e.shiftKey)) return;
      aoFechar(false);
    }
  }

  const IconeDaAcao = acao?.icone;

  if (!visivel || !pos || typeof document === "undefined") return null;
  return createPortal(
    <PainelFlutuante
      ref={painel}
      fixo
      saindo={saindo}
      role="dialog"
      aria-label={rotulo}
      onKeyDown={teclado}
      style={{ top: pos.top, bottom: pos.bottom, left: pos.left, width: pos.width }}
      className="flex flex-col overflow-hidden"
    >
      <label htmlFor={`busca-${id}`} className="sr-only">
        {rotulos.busca}
      </label>
      <div className={buscaDoPainel}>
        <MagnifyingGlass size={16} weight="regular" aria-hidden="true" className="shrink-0 text-input-placeholder" />
        <input
          ref={campo}
          id={`busca-${id}`}
          role="combobox"
          aria-expanded="true"
          aria-controls={`lista-${id}`}
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

      <div
        id={`lista-${id}`}
        role="listbox"
        aria-label={rotulo}
        aria-multiselectable={multiplo || undefined}
        className={cn("max-h-80 overflow-y-auto overscroll-contain p-1.5", rolagemDiscreta)}
      >
        {agruparOpcoes(filtradas).map((bloco, b) => (
          <GrupoDeOpcoes key={bloco.grupo ?? `sem-grupo-${b}`} grupo={bloco.grupo} primeiro={b === 0}>
            {bloco.itens.map(({ opcao: o, indice: i }) => {
              const escolhida = selecionados.includes(o.valor);
              const emFoco = i === ativo;
              return (
                <div
                  key={o.valor}
                  id={`opcao-${id}-${i}`}
                  role="option"
                  aria-selected={escolhida}
                  aria-label={o.conteudo ? o.rotulo : undefined}
                  onMouseEnter={() => setAtivo(i)}
                  // o foco fica na busca: clicar não tira o cursor de lá
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => escolher(o)}
                  className={cn(
                    "flex min-h-8 cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-label-lg transition-colors",
                    multiplo
                      ? "text-foreground"
                      : escolhida
                        ? "bg-overlay-item-selected text-overlay-item-text-selected"
                        : "text-muted-foreground",
                    emFoco && (multiplo || !escolhida) && "bg-overlay-item-hover text-foreground",
                    // escolhida E sob o teclado: o fundo já é o de selecionada, então o foco ganha traço
                    emFoco && !multiplo && escolhida && "ring-1 ring-inset ring-ring",
                  )}
                >
                  {multiplo ? (
                    // a mesma caixa do item `check` do Menu
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-sm border",
                        escolhida ? "border-primary bg-primary text-primary-foreground" : "border-input-border bg-card",
                      )}
                    >
                      {escolhida ? <Check size={12} weight="bold" /> : null}
                    </span>
                  ) : null}
                  {o.conteudo ? null : o.icone}
                  {o.conteudo ? (
                    <span className="flex min-w-0 flex-1 items-center">{o.conteudo}</span>
                  ) : (
                    <span className="min-w-0 flex-1 truncate" title={o.rotulo}>
                      {o.rotulo}
                    </span>
                  )}
                  {o.detalhe ? (
                    <span title={o.detalhe} className="max-w-[45%] shrink-0 truncate text-caption text-subtle-foreground">
                      {o.detalhe}
                    </span>
                  ) : null}
                  {!multiplo && escolhida ? <Check size={16} weight="regular" aria-hidden="true" className="shrink-0" /> : null}
                </div>
              );
            })}
          </GrupoDeOpcoes>
        ))}
        {podeCriar ? (
          <div
            id={`opcao-${id}-${filtradas.length}`}
            role="option"
            aria-selected={false}
            onMouseEnter={() => setAtivo(filtradas.length)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={criar}
            className={cn(
              "flex min-h-8 cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-label-lg text-overlay-item-text-selected transition-colors",
              ativo === filtradas.length && "bg-overlay-item-hover",
            )}
          >
            <Plus size={16} weight="regular" aria-hidden="true" className="shrink-0" />
            <span className="min-w-0 truncate">{rotulos.criar ? rotulos.criar(busca.trim()) : busca.trim()}</span>
          </div>
        ) : null}
        {total === 0 ? <p className="px-2 py-2 text-body-md text-muted-foreground">{rotulos.vazio}</p> : null}
      </div>

      {acao ? (
        // fora da lista: ação não é opção
        <div className="shrink-0 border-t border-overlay-border p-1.5">
          <button
            type="button"
            onClick={() => {
              aoFechar();
              acao.aoAtivar();
            }}
            className={cn(
              "flex min-h-8 w-full items-center gap-2 rounded-sm px-2 py-1 text-left text-label-lg text-foreground transition-colors hover:bg-overlay-item-hover",
              focoInterno,
            )}
          >
            {IconeDaAcao ? <IconeDaAcao size={16} weight="regular" aria-hidden="true" className="shrink-0 text-muted-foreground" /> : null}
            <span className="min-w-0 truncate">{acao.rotulo}</span>
          </button>
        </div>
      ) : null}
    </PainelFlutuante>,
    document.body,
  );
}

/* ------------------------------------------------------------ Gatilho -- */

export interface ComboboxProps {
  /** As opções da lista. `grupo` separa em blocos com cabeçalho; `icone` vai antes do rótulo. */
  opcoes: OpcaoCombobox[];
  /** O valor escolhido. Sem ele, o gatilho mostra `textoVazio`. */
  valor?: string;
  aoEscolher?: (valor: string) => void;
  /** O que o gatilho mostra quando nada foi escolhido. */
  textoVazio?: string;
  /** Nome do controle para leitor de tela. Ex.: "Origem do lead". */
  rotulo: string;
  /** Os tamanhos do gatilho do Select: `md` (card), `sm` (barra), `field` (formulário). */
  size?: SelectTriggerProps["size"];
  rotulos: RotulosDoCombobox;
  /** A busca que não acha oferece criar, com o texto digitado. Passe `rotulos.criar` junto. */
  aoCriar?: (texto: string) => void;
  /** Uma ação fixa no pé do painel. Ex.: "Gerenciar origens". */
  acao?: AcaoDoCombobox;
  className?: string;
}

type BaseDoCombobox = Omit<ComboboxProps, "valor" | "aoEscolher">;

function GatilhoDoCombobox({
  base,
  selecionados,
  multiplo,
  aoAlternar,
}: {
  base: BaseDoCombobox;
  selecionados: string[];
  multiplo: boolean;
  aoAlternar: (valor: string) => void;
}) {
  const { opcoes, textoVazio = "Selecione", rotulo, size, rotulos, aoCriar, acao, className } = base;
  const [aberto, setAberto] = React.useState(false);
  const gatilho = React.useRef<HTMLButtonElement>(null);
  // na ordem da lista, não na ordem do clique: o resumo não pula de lugar
  const escolhidas = opcoes.filter((o) => selecionados.includes(o.valor));
  const primeira = escolhidas[0];

  return (
    <div className={cn("relative inline-block", className)}>
      <SelectTrigger
        ref={gatilho}
        size={size}
        aberto={aberto}
        vazio={!primeira}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        aria-label={rotulo}
        onClick={() => setAberto((a) => !a)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setAberto(true);
          }
        }}
      >
        {primeira ? (
          <span className="flex min-w-0 items-center gap-1.5">
            {/* a escolhida aparece como aparece na lista: a mesma peça */}
            {primeira.conteudo ?? (
              <>
                {primeira.icone}
                <span className="min-w-0 truncate">{primeira.rotulo}</span>
              </>
            )}
            {escolhidas.length > 1 ? <span className="shrink-0 tabular-nums text-muted-foreground">+{escolhidas.length - 1}</span> : null}
          </span>
        ) : (
          textoVazio
        )}
      </SelectTrigger>
      <ComboboxPainel
        aberto={aberto}
        aoFechar={(devolver = true) => {
          setAberto(false);
          if (devolver) gatilho.current?.focus();
        }}
        gatilho={gatilho}
        rotulo={rotulo}
        opcoes={opcoes}
        selecionados={selecionados}
        aoAlternar={aoAlternar}
        multiplo={multiplo}
        rotulos={rotulos}
        aoCriar={aoCriar}
        acao={acao}
      />
    </div>
  );
}

/** Uma escolha numa lista com busca. As props são as do Select, mais `rotulos`. */
export function Combobox({ valor, aoEscolher, ...base }: ComboboxProps) {
  return (
    <GatilhoDoCombobox
      base={base}
      selecionados={valor ? [valor] : []}
      multiplo={false}
      aoAlternar={(v) => aoEscolher?.(v)}
    />
  );
}

export interface ComboboxMultiploProps extends BaseDoCombobox {
  /** Os valores escolhidos. O gatilho mostra o primeiro e quantos mais ("WhatsApp +2"). */
  valores: string[];
  aoMudar?: (valores: string[]) => void;
}

/** Várias escolhas numa lista com busca: caixa de marcar em cada opção, e a lista fica aberta. */
export function ComboboxMultiplo({ valores, aoMudar, ...base }: ComboboxMultiploProps) {
  return (
    <GatilhoDoCombobox
      base={base}
      selecionados={valores}
      multiplo
      aoAlternar={(v) => aoMudar?.(valores.includes(v) ? valores.filter((x) => x !== v) : [...valores, v])}
    />
  );
}
