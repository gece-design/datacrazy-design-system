"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  Briefcase,
  Buildings,
  Check,
  Flag,
  GraduationCap,
  Handshake,
  Heart,
  ListBullets,
  MagnifyingGlass,
  Megaphone,
  Plant,
  Plus,
  Scales,
  Star,
  Storefront,
  User,
} from "@phosphor-icons/react";
import { buscaDoPainel, caixaDeMarcar } from "@/lib/campo";
import { PONTO_DO_STATUS, TEXTO_DO_STATUS, type StatusDaTag } from "@/lib/sinais";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useCliqueFora } from "@/lib/use-clique-fora";
import { useSaida } from "@/lib/use-saida";
import { PainelFlutuante } from "@/components/ui/popover";

import { foco, rolagemDiscreta } from "@/lib/estados";
import { TONS, tomDe, type Tom } from "@/lib/tons";
/**
 * Tag — rótulo em pílula do perfil do lead (node 538:197).
 *
 * O arquivo desenha oito "temas" num eixo só; aqui eles viram três props que
 * se combinam: `status` (bolinha de 6px), `tipo` (pessoa ou empresa, com
 * ícone) e `foto` (atendente). Sem nenhuma, é a tag de texto. O de adicionar é
 * um botão — clicável não é tag — e mora em `TagAdicionar`; com a lista de
 * tags para escolher, em `SeletorTags`.
 */

// A bolinha e a cor do ícone por status moram em lib/sinais.ts: a opção de
// uma lista pinta o mesmo sinal sem a pílula (ADR-069).
const pontos = PONTO_DO_STATUS;
const iconesDoStatus = TEXTO_DO_STATUS;

// Os tons moram em lib/tons.ts (o Avatar também usa); a Tag continua exportando.
export { TONS, tomDe, type Tom } from "@/lib/tons";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Bolinha de 6px na cor da situação. Com `tom`, a bolinha já vem, na cor do tom. O texto continua sendo o sinal: a cor só reforça. */
  status?: StatusDaTag;
  /** Tipo do registro: ícone de 12px e texto em `primary`. */
  tipo?: "pessoa" | "empresa";
  /** Foto de 22px encostada à esquerda — a tag do atendente. */
  foto?: string;
  /** Um dos catorze tons: a cor da bolinha (ou do ícone, quando há `icone`). Sem tom, a tag não tem cor. */
  tom?: Tom;
  /** Ícone de 12px antes do texto, no lugar da bolinha: leva a cor do `tom` ou do `status`. A forma distingue junto com a cor. */
  icone?: React.ComponentType<{ size?: number; weight?: "regular" | "fill"; className?: string }>;
}

export function Tag({ status, tipo, foto, tom, icone, className, children, ...props }: TagProps) {
  const Icone = icone ?? (tipo === "pessoa" ? User : tipo === "empresa" ? Buildings : null);
  // A cor da tag é a bolinha. Com `icone`, o ícone entra NO LUGAR dela e leva
  // a cor — do tom, ou do status (humano, 2026-10-02). Com foto, a foto basta.
  const bolinha = icone ? false : Boolean(status) || (Boolean(tom) && !Icone && !foto);
  return (
    <span
      // `data-tom` liga os quatro --tom-* daquele tom neste span (globals.css)
      data-tom={tom}
      className={cn(
        // 22px = 15 de entrelinha + 2,5 de respiro em cima e embaixo + o traço.
        // `max-w-full` + texto que trunca: mais larga que o lugar (célula da
        // grade densa), a tag corta com reticências em vez de invadir a vizinha.
        // Pílula com traço, texto como foi escrito: a caixa alta e o fundo cheio
        // do arquivo saíram (cliente, 2026-09-28; humano, 2026-10-02, ADR-059).
        // traço em `divider`, um degrau acima de `border`: a pílula precisa se ler sobre branco e sobre cinza (humano, 2026-10-02)
        "inline-flex h-[22px] max-w-full shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border border-divider bg-card px-1.5 text-label-md text-foreground",
        // a foto encosta: 1px de folga por dentro do traço, em toda a volta
        foto && "pl-px",
        // a tag de tipo pega a cor do lead (`--tom-texto` do `[data-tom]` que
        // o perfil do drawer já define) no ícone e no texto.
        tipo && !tom && "text-tom-texto",
        className,
      )}
      {...props}
    >
      {foto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={foto} alt="" className="size-[18px] shrink-0 rounded-full object-cover" />
      ) : null}
      {bolinha ? (
        <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", tom ? "bg-tom-ponto" : status ? pontos[status] : "")} />
      ) : null}
      {Icone ? (
        <Icone size={12} weight="regular" // com tom ou status, a cor deles; sem nenhum (a tag de lista), cinza escuro
          className={cn("shrink-0", tom ? "text-tom-texto" : icone && status ? iconesDoStatus[status] : icone ? "text-muted-foreground" : undefined)} aria-hidden="true" />
      ) : null}
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

/**
 * Os sinais de uma tag do catálogo como a opção de uma lista os leva: foto,
 * tom, status e o ícone de 12px — sem a pílula. É o que vai em `opcoes` do
 * Select, do Combobox e da BarraDeFiltros (`{ valor, rotulo, ...sinaisDaTag(t) }`),
 * para quem abre a lista ver a cor e o ícone da tag sem um campo dentro do
 * campo (cliente, 2026-10-02, ADR-069).
 */
export function sinaisDaTag(t: { status?: StatusDaTag; tom?: Tom; icone?: TagProps["icone"]; foto?: string }) {
  const Icone = t.icone;
  return {
    status: t.status,
    tom: t.tom,
    foto: t.foto,
    icone: Icone ? <Icone size={12} weight="regular" aria-hidden="true" className="shrink-0" /> : undefined,
  };
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
        "inline-flex size-[22px] shrink-0 items-center justify-center rounded-full bg-primary text-background transition-colors hover:bg-primary-hover",
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

/* ------------------------------------------------------- Seletor de cor -- */

export interface SeletorDeTomProps {
  /** O tom marcado. `null` é "sem cor": a tag cinza. */
  valor: Tom | null;
  aoEscolher: (tom: Tom | null) => void;
  /** Nome do grupo para leitor de tela. Ex.: "Cor da tag". */
  rotulo: string;
  /** Nome de cada cor, para leitor de tela e tooltip (i18n). Sem ele, a chave do tom. */
  nomes?: Partial<Record<Tom | "neutro", string>>;
  /** Abre a fileira com a amostra cinza, "sem cor": são as quinze cores. */
  comNeutro?: boolean;
  /** 16px na fileira do seletor de tags; 24px, com o check na marcada, em formulário. */
  tamanho?: "sm" | "md";
  className?: string;
}

/**
 * SeletorDeTom — as amostras de cor de quem cria uma tag, uma etapa, uma lista.
 *
 * Cada amostra é a cor da bolinha que a tag vai ter; a cinza é "sem cor".
 * São os catorze tons de `TONS` — quinze com `comNeutro` — e
 * nenhum outro: quem cria escolhe, não inventa (ADR-051). Era a fileira de
 * dentro do `SeletorTags`; virou peça porque o modal de criar tag do cliente
 * precisa dela num formulário (crítica de 2026-09-28).
 */
export function SeletorDeTom({ valor, aoEscolher, rotulo, nomes, comNeutro = false, tamanho = "sm", className }: SeletorDeTomProps) {
  const md = tamanho === "md";
  const amostras: (Tom | null)[] = comNeutro ? [null, ...TONS] : [...TONS];
  return (
    <div role="radiogroup" aria-label={rotulo} className={cn("flex flex-wrap items-center", md ? "gap-2" : "gap-1", className)}>
      {amostras.map((t) => {
        const marcada = valor === t;
        const nome = nomes?.[t ?? "neutro"] ?? t ?? "sem cor";
        return (
          <button
            key={t ?? "neutro"}
            type="button"
            role="radio"
            aria-checked={marcada}
            aria-label={nome}
            title={nome}
            data-tom={t ?? undefined}
            onClick={() => aoEscolher(t)}
            className={cn(
              "grid shrink-0 place-items-center rounded-full transition-transform",
              md ? "size-6" : "size-4",
              // o check é branco sobre a cor; na cinza, escuro
              t ? "bg-tom-ponto text-primary-foreground" : "bg-input-bg-disabled text-foreground ring-1 ring-inset ring-border",
              `${foco}`,
              marcada ? "scale-110 outline outline-2 outline-offset-2 outline-foreground" : "hover:scale-110",
            )}
          >
            {md && marcada ? <Check size={12} weight="bold" aria-hidden="true" /> : null}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------ Seletor de ícone -- */

/**
 * Os ícones que uma tag de lista pode ter. Conjunto fechado, como as cores:
 * quem cria escolhe um, não traz o seu. A chave é o que se guarda no banco;
 * `ICONES_DE_TAG[chave]` é o componente que vai em `<Tag icone>`.
 */
export const ICONES_DE_TAG = {
  lista: ListBullets,
  estrela: Star,
  coracao: Heart,
  loja: Storefront,
  escola: GraduationCap,
  empresa: Buildings,
  balanca: Scales,
  planta: Plant,
  aperto: Handshake,
  bandeira: Flag,
  pasta: Briefcase,
  megafone: Megaphone,
} as const;
export type IconeDeTag = keyof typeof ICONES_DE_TAG;

export interface SeletorDeIconeProps {
  /** O ícone marcado. */
  valor: IconeDeTag;
  aoEscolher: (icone: IconeDeTag) => void;
  /** Nome do grupo para leitor de tela. Ex.: "Ícone da tag". */
  rotulo: string;
  /** Nome de cada ícone, para leitor de tela e tooltip (i18n). Sem ele, a chave. */
  nomes?: Partial<Record<IconeDeTag, string>>;
  className?: string;
}

/**
 * SeletorDeIcone — os ícones de quem cria uma tag de lista. A tag de lista
 * não tem cor: tem um ícone cinza, escolhido na hora de criar (humano,
 * 2026-10-02). Par do `SeletorDeTom`, com a mesma mecânica.
 */
export function SeletorDeIcone({ valor, aoEscolher, rotulo, nomes, className }: SeletorDeIconeProps) {
  return (
    <div role="radiogroup" aria-label={rotulo} className={cn("flex flex-wrap items-center gap-0.5", className)}>
      {(Object.keys(ICONES_DE_TAG) as IconeDeTag[]).map((chave) => {
        const Icone = ICONES_DE_TAG[chave];
        const marcado = valor === chave;
        const nome = nomes?.[chave] ?? chave;
        return (
          <button
            key={chave}
            type="button"
            role="radio"
            aria-checked={marcado}
            aria-label={nome}
            title={nome}
            onClick={() => aoEscolher(chave)}
            className={cn(
              "grid size-6 shrink-0 place-items-center rounded-sm transition-colors",
              `${foco}`,
              marcado ? "bg-accent text-primary" : "text-muted-foreground hover:bg-overlay-item-hover hover:text-foreground",
            )}
          >
            <Icone size={14} weight="regular" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

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
  /** Nesta aba a cor é escolha de quem cria. Nas outras ela é regra. */
  corLivre?: boolean;
  /** Nesta aba quem cria escolhe o ícone, entre os de `ICONES_DE_TAG` (Listas): a tag sai sem cor, com o ícone cinza. */
  iconeLivre?: boolean;
};

export interface SeletorTagsProps {
  /** Um grupo por aba. Ex.: Status, Listas, Atendentes. */
  grupos: GrupoTags[];
  /** Ids das tags que o lead tem. */
  selecionadas: string[];
  /** Clique numa tag da lista: põe ou tira. */
  aoAlternar: (tag: OpcaoTag) => void;
  /** Catálogo de tags sempre passa: digitar um nome que não existe oferece
      criar (humano, 2026-10-02). Só fica de fora quando a lista é de gente —
      pessoa não nasce num campo de busca. O `tom` só vem quando a aba tem
      `corLivre`, e o `icone` (a chave de `ICONES_DE_TAG`) quando tem
      `iconeLivre`; nas outras, cor e ícone são da regra do grupo. */
  aoCriar?: (rotulo: string, grupoId: string, tom?: Tom, icone?: IconeDeTag) => void;
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
    /** Rótulo da fileira de ícones. Ex.: "Ícone". */
    icone: string;
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
  const [iconeNovo, setIconeNovo] = React.useState<IconeDeTag>("lista");
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
  const { saindo, visivel } = useSaida(aberto);
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
      aoCriar?.(termo, grupo.id, grupo.corLivre ? (tomNovo ?? tomDe(termo)) : undefined, grupo.iconeLivre ? iconeNovo : undefined);
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
      {visivel && pos
        ? createPortal(
            <PainelFlutuante
              ref={painel}
              saindo={saindo}
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

              <div
                id={idLista}
                role="listbox"
                aria-multiselectable="true"
                aria-labelledby={grupo ? `${base}-aba-${grupo.id}` : undefined}
                className={cn("flex max-h-60 flex-col overflow-y-auto overscroll-contain p-1.5", rolagemDiscreta)}
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
                        // a mesma linha do Combobox de várias escolhas: caixa de marcar à esquerda, sem faixa azul
                        "flex min-h-8 cursor-pointer items-center gap-2 rounded-sm px-2 py-1 transition-colors",
                        emFoco && "bg-overlay-item-hover",
                      )}
                    >
                      <span aria-hidden="true" className={caixaDeMarcar(escolhida)}>
                        {escolhida ? <Check size={12} weight="regular" /> : null}
                      </span>
                      <Tag status={t.status} foto={t.foto} tom={t.tom} icone={t.icone}>
                        {t.rotulo}
                      </Tag>
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
                      "flex min-h-8 cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1 text-label-lg text-overlay-item-text-selected transition-colors",
                      ativo === filtradas.length && "bg-overlay-item-hover",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Plus size={16} weight="regular" aria-hidden="true" className="shrink-0" />
                      <span className="min-w-0 truncate">{rotulos.criar(termo, grupo.rotulo)}</span>
                    </span>
                    {/* prévia: a tag sai daqui exatamente assim */}
                    {grupo.corLivre || grupo.iconeLivre ? (
                      <Tag tom={grupo.corLivre ? (tomNovo ?? tomDe(termo)) : undefined} icone={grupo.iconeLivre ? ICONES_DE_TAG[iconeNovo] : undefined}>
                        {termo}
                      </Tag>
                    ) : null}
                  </div>
                ) : null}

                {total === 0 ? <p className="px-2 py-2 text-body-md text-muted-foreground">{rotulos.vazio}</p> : null}
              </div>

              {/* Fileira de cores — fora do listbox, porque amostra não é opção
                  de tag. Só nas abas de cor livre: nas outras a cor é regra. */}
              {podeCriar && grupo?.corLivre ? (
                // o clique na amostra não tira o foco da busca
                <div onMouseDown={(e) => e.preventDefault()} className="flex items-center gap-2 border-t border-border px-3 py-2">
                  <span aria-hidden="true" className="shrink-0 text-label-sm uppercase text-muted-foreground">{rotulos.cor}</span>
                  <SeletorDeTom rotulo={rotulos.cor} valor={tomNovo ?? tomDe(termo)} aoEscolher={(tom) => setTomNovo(tom)} />
                </div>
              ) : null}
              {/* Fileira de ícones — nas abas em que quem cria escolhe o ícone (Listas). */}
              {podeCriar && grupo?.iconeLivre ? (
                <div onMouseDown={(e) => e.preventDefault()} className="flex items-center gap-2 border-t border-border px-3 py-1.5">
                  <span aria-hidden="true" className="shrink-0 text-label-sm uppercase text-muted-foreground">{rotulos.icone}</span>
                  <SeletorDeIcone rotulo={rotulos.icone} valor={iconeNovo} aoEscolher={setIconeNovo} />
                </div>
              ) : null}
            </PainelFlutuante>,
            document.body,
          )
        : null}
    </>
  );
}
