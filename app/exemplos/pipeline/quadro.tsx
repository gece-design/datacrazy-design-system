"use client";

import * as React from "react";
import {
  Buildings,
  CaretLeft,
  CaretRight,
  Clock,
  Globe,
  Handshake,
  Plus,
  User,
  WarningCircle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { IconeDeMarca } from "@/components/ui/icone-de-marca";
import { cn } from "@/lib/utils";
import { GRUPOS_TAGS, etapaPor, moeda, tagsDe, type Canal, type Etapa, type EtapaId, type Lead } from "./dados";

import { foco, rolagemDiscreta } from "@/lib/estados";
/* O quadro do funil. Arrastar é HTML5 puro — `draggable` + os eventos de drag
   — porque a lista negativa do projeto não deixa entrar biblioteca nova por
   causa de uma tela de exemplo.
   Arrastar com o mouse não é acessível sozinho (WCAG 2.5.7): o mesmo movimento
   existe pelo teclado — Espaço pega, setas escolhem coluna e posição, Enter
   solta, Esc cancela — e cada passo é anunciado numa região `aria-live`.
   O trilho rola de três jeitos: roda do mouse, setas nas bordas e arrastando o
   fundo do quadro, como no Trello. */

/** O ícone de cada origem — o quadro, a lista e os filtros usam o mesmo.
 *  Marca é `IconeDeMarca`, na cor da marca; o que não é marca é Phosphor. */
export function IconeDoCanal({ canal, tamanho = 14 }: { canal: Canal; tamanho?: 14 | 16 }) {
  if (canal === "WhatsApp") return <IconeDeMarca marca="whatsapp" tamanho={tamanho} />;
  if (canal === "Instagram") return <IconeDeMarca marca="instagram" tamanho={tamanho} />;
  const Glifo = canal === "Site" ? Globe : Handshake;
  return <Glifo size={tamanho} weight="regular" aria-hidden="true" className="shrink-0 text-muted-foreground" />;
}

/** Largura da coluna + vão. Um clique na seta anda exatamente uma coluna. */
const PASSO = 316;

export type Colunas = Record<EtapaId, Lead[]>;

export function agrupar(etapas: Etapa[], leads: Lead[]): Colunas {
  const vazio = Object.fromEntries(etapas.map((e) => [e.id, [] as Lead[]])) as Colunas;
  for (const lead of leads) vazio[lead.etapa]?.push(lead);
  return vazio;
}

/* A cor da coluna sai dos tons do DS: `data-tom` troca as variáveis e o painel
   usa o degrau mais claro (`tom-anel`), a bolinha usa o cheio (`tom-tag`). */
function pintura(cor: Etapa["cor"]) {
  // Bolinha e título saem do MESMO token — `tom-texto`, o degrau que se lê
  // sobre o painel claro. `tom-tag` é o cheio: bonito na bolinha, fraco demais
  // no texto (3:1 aos 13px). Igualar os dois é o pedido do humano.
  if (cor === "neutro") return { tom: undefined, painel: "bg-card/50", ponto: "bg-muted-foreground", texto: "text-muted-foreground" };
  return { tom: cor, painel: "bg-tom-anel", ponto: "bg-tom-texto", texto: "text-tom-texto" };
}

type Alvo = { etapa: EtapaId; indice: number };

/**
 * O que o cartão mostra além de nome e valor — a pessoa escolhe campo a
 * campo, como as propriedades de um card do Notion (humano, 2026-09-23; os
 * três presets do protótipo saíram). Tudo ligado é o estado de fábrica.
 */
export const CAMPOS_DO_CARTAO = ["empresa", "origem", "proximaAcao", "contato", "email", "tags", "atendente", "dias"] as const;
export type CampoDoCartao = (typeof CAMPOS_DO_CARTAO)[number];
export const ROTULOS_DOS_CAMPOS: Record<CampoDoCartao, string> = {
  empresa: "Empresa e cidade",
  origem: "Origem",
  proximaAcao: "Próxima ação",
  contato: "Contato principal",
  email: "E-mail",
  tags: "Tags",
  atendente: "Atendente",
  dias: "Dias na etapa",
};

export function Quadro({
  etapas,
  colunas,
  campos = CAMPOS_DO_CARTAO,
  aoMover,
  aoAbrir,
  aoAdicionar,
  aoEditarEtapa,
  aoCriarEtapa,
}: {
  etapas: Etapa[];
  colunas: Colunas;
  /** Os campos visíveis no cartão. Padrão: todos. */
  campos?: readonly CampoDoCartao[];
  /** Move o lead para `etapa`, na posição `indice` da lista sem ele. */
  aoMover: (id: string, etapa: EtapaId, indice: number) => void;
  aoAbrir: (lead: Lead) => void;
  aoAdicionar: (etapa: EtapaId) => void;
  aoEditarEtapa: (etapa: Etapa) => void;
  aoCriarEtapa: () => void;
}) {
  const [movendo, setMovendo] = React.useState<string | null>(null);
  const [porTeclado, setPorTeclado] = React.useState(false);
  const [alvo, setAlvo] = React.useState<Alvo | null>(null);
  const [anuncio, setAnuncio] = React.useState("");
  const instrucoes = React.useId().replace(/:/g, "");

  const trilho = React.useRef<HTMLDivElement>(null);
  const [bordas, setBordas] = React.useState({ esquerda: false, direita: false });
  const [arrastandoTrilho, setArrastandoTrilho] = React.useState(false);
  const pan = React.useRef({ x: 0, scroll: 0 });

  const leadPor = (id: string) => Object.values(colunas).flat().find((l) => l.id === id);
  const tamanhoSem = (etapa: EtapaId, id: string | null) => colunas[etapa].filter((l) => l.id !== id).length;

  /* Quais setas aparecem. Recalcula na rolagem, no redimensionamento e quando
     o número de cartões muda — mover um lead pode encurtar o trilho. */
  const medir = React.useCallback(() => {
    const el = trilho.current;
    if (!el) return;
    const fim = el.scrollWidth - el.clientWidth;
    setBordas({ esquerda: el.scrollLeft > 4, direita: el.scrollLeft < fim - 4 });
  }, []);

  React.useEffect(() => {
    medir();
    const el = trilho.current;
    if (!el) return;
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, [medir, colunas]);

  function limpar() {
    setMovendo(null);
    setPorTeclado(false);
    setAlvo(null);
  }

  function concluir(id: string, etapa: EtapaId, indice: number, comFoco: boolean) {
    const lead = leadPor(id);
    aoMover(id, etapa, indice);
    limpar();
    if (lead) setAnuncio(`${lead.nome} em ${etapaPor(etapas, etapa).rotulo}, posição ${indice + 1}.`);
    if (comFoco) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-cartao="${id}"]`)?.focus());
    }
  }

  /* Onde o cartão cairia: a primeira metade de cartão abaixo do ponteiro. O que
     está em movimento sai da conta — quem insere já o removeu da lista. */
  function indiceDoPonteiro(lista: HTMLElement, y: number) {
    const cartoes = Array.from(lista.querySelectorAll<HTMLElement>("[data-cartao]")).filter(
      (el) => el.dataset.cartao !== movendo,
    );
    for (let i = 0; i < cartoes.length; i++) {
      const r = cartoes[i].getBoundingClientRect();
      if (y < r.top + r.height / 2) return i;
    }
    return cartoes.length;
  }

  function pegarPeloTeclado(lead: Lead) {
    setMovendo(lead.id);
    setPorTeclado(true);
    setAlvo({ etapa: lead.etapa, indice: colunas[lead.etapa].findIndex((l) => l.id === lead.id) });
    setAnuncio(
      `${lead.nome} pego. Setas para os lados trocam de etapa, setas para cima e para baixo mudam a posição. Enter solta, Esc cancela.`,
    );
  }

  function teclas(e: React.KeyboardEvent, lead: Lead) {
    const emMao = movendo === lead.id && porTeclado;

    if (!emMao) {
      if (e.key === " ") {
        e.preventDefault();
        pegarPeloTeclado(lead);
      } else if (e.key === "Enter") {
        e.preventDefault();
        aoAbrir(lead);
      }
      return;
    }

    const atual = alvo ?? { etapa: lead.etapa, indice: 0 };
    const i = etapas.findIndex((et) => et.id === atual.etapa);

    if (e.key === "Escape") {
      e.preventDefault();
      limpar();
      setAnuncio(`Movimento cancelado. ${lead.nome} continua em ${etapaPor(etapas, lead.etapa).rotulo}.`);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      concluir(lead.id, atual.etapa, atual.indice, true);
      return;
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const destino = etapas[e.key === "ArrowLeft" ? Math.max(0, i - 1) : Math.min(etapas.length - 1, i + 1)];
      const indice = Math.min(atual.indice, tamanhoSem(destino.id, lead.id));
      setAlvo({ etapa: destino.id, indice });
      setAnuncio(`${destino.rotulo}, posição ${indice + 1} de ${tamanhoSem(destino.id, lead.id) + 1}.`);
      // a etapa escolhida precisa estar à vista, senão o cartão "some" ao soltar
      document.querySelector(`[data-coluna="${destino.id}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
      return;
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const limite = tamanhoSem(atual.etapa, lead.id);
      const indice = Math.max(0, Math.min(limite, atual.indice + (e.key === "ArrowUp" ? -1 : 1)));
      setAlvo({ etapa: atual.etapa, indice });
      setAnuncio(`Posição ${indice + 1} de ${limite + 1}.`);
    }
  }

  /* Arrastar o fundo para rolar. Só pega o vazio: em cima de cartão, botão ou
     campo, o gesto é daquele elemento. */
  function comecarPan(e: React.PointerEvent) {
    if (e.button !== 0 || movendo) return;
    const alvoDom = e.target as HTMLElement;
    if (alvoDom.closest("[data-cartao], button, a, input, select")) return;
    const el = trilho.current;
    if (!el) return;
    pan.current = { x: e.clientX, scroll: el.scrollLeft };
    setArrastandoTrilho(true);
    el.setPointerCapture(e.pointerId);
  }

  function moverPan(e: React.PointerEvent) {
    if (!arrastandoTrilho || !trilho.current) return;
    trilho.current.scrollLeft = pan.current.scroll - (e.clientX - pan.current.x);
  }

  function soltarPan(e: React.PointerEvent) {
    if (!arrastandoTrilho) return;
    setArrastandoTrilho(false);
    trilho.current?.releasePointerCapture(e.pointerId);
  }

  const rolar = (direcao: -1 | 1) => trilho.current?.scrollBy({ left: direcao * PASSO, behavior: "smooth" });

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <p id={instrucoes} className="sr-only">
        Cartão do funil. Enter abre o lead. Espaço pega o cartão para movê-lo; com ele pego, as setas escolhem a etapa
        e a posição, Enter solta e Esc cancela.
      </p>
      <p aria-live="polite" className="sr-only">
        {anuncio}
      </p>

      <div
        ref={trilho}
        onScroll={medir}
        onPointerDown={comecarPan}
        onPointerMove={moverPan}
        onPointerUp={soltarPan}
        onPointerCancel={soltarPan}
        className={cn(
          "flex min-h-0 flex-1 gap-4 overflow-x-auto pl-4 pr-4 pb-4 pt-1 lg:pl-1", rolagemDiscreta,
          arrastandoTrilho ? "cursor-grabbing select-none" : "cursor-grab",
        )}
      >
        {etapas.map((etapa) => {
          const lista = colunas[etapa.id];
          const total = lista.reduce((n, l) => n + l.valor, 0);
          const linhaAqui = Boolean(movendo) && alvo?.etapa === etapa.id;
          const cor = pintura(etapa.cor);

          const nos: React.ReactNode[] = [];
          let posicao = 0;
          for (const lead of lista) {
            const emMovimento = lead.id === movendo;
            if (!emMovimento) {
              if (linhaAqui && alvo!.indice === posicao) nos.push(<Linha key={`linha-${posicao}`} />);
              posicao++;
            }
            nos.push(
              <Cartao
                key={lead.id}
                lead={lead}
                campos={campos}
                emMovimento={emMovimento}
                pegoPeloTeclado={emMovimento && porTeclado}
                descrito={instrucoes}
                aoAbrir={() => aoAbrir(lead)}
                aoTeclar={(e) => teclas(e, lead)}
                aoIniciar={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", lead.id);
                  setMovendo(lead.id);
                  setPorTeclado(false);
                }}
                aoTerminar={() => {
                  if (!porTeclado) limpar();
                }}
              />,
            );
          }
          if (linhaAqui && alvo!.indice === posicao) nos.push(<Linha key="linha-fim" />);

          return (
            <section
              key={etapa.id}
              data-coluna={etapa.id}
              onDragOver={(e) => {
                if (!movendo || porTeclado) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setAlvo({ etapa: etapa.id, indice: indiceDoPonteiro(e.currentTarget, e.clientY) });
              }}
              onDrop={(e) => {
                e.preventDefault();
                const id = movendo ?? e.dataTransfer.getData("text/plain");
                if (!id) return;
                const indice = alvo?.etapa === etapa.id ? alvo.indice : indiceDoPonteiro(e.currentTarget, e.clientY);
                concluir(id, etapa.id, indice, false);
              }}
              data-tom={cor.tom}
              className={cn(
                // O painel da coluna: quase branco no claro, um degrau acima do
                // fundo no escuro. Separa a coluna do fundo da tela sem competir
                // com o branco do cartão. Com cor, é o degrau mais claro do tom.
                "flex h-full w-[300px] shrink-0 flex-col gap-2 rounded-xl p-2 transition-colors",
                linhaAqui ? "bg-accent" : cor.painel,
              )}
            >
              <header className="flex shrink-0 items-center gap-2 px-1 pt-0.5">
                <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", cor.ponto)} />
                {/* O título é o gesto de editar a etapa: nome e cor. */}
                <h2 className="min-w-0">
                  <button
                    type="button"
                    onClick={() => aoEditarEtapa(etapa)}
                    title={`${etapa.descricao} — clique para renomear ou trocar a cor`}
                    className={cn(
                      "block w-full truncate rounded-sm text-left text-h4 uppercase transition-colors hover:text-primary",
                      `${foco}`,
                      cor.texto,
                    )}
                  >
                    {etapa.rotulo}
                  </button>
                </h2>
                <span className="shrink-0 rounded-full bg-background px-1.5 py-0.5 text-label-sm tabular-nums text-muted-foreground">
                  {lista.length}
                </span>
                <span
                  title={`${moeda(total)} em aberto nesta etapa`}
                  className="ml-auto shrink-0 text-label-md tabular-nums text-muted-foreground"
                >
                  {moeda(total)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Adicionar lead em ${etapa.rotulo}`}
                  title={`Adicionar lead em ${etapa.rotulo}`}
                  onClick={() => aoAdicionar(etapa.id)}
                  className="size-7 shrink-0"
                >
                  <Plus size={16} weight="regular" />
                </Button>
              </header>

              <div className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto", rolagemDiscreta)}>
                {nos}
                {lista.length === 0 && !linhaAqui ? (
                  <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-body-sm text-subtle-foreground">
                    Nenhum lead nesta etapa. Arraste um cartão para cá.
                  </p>
                ) : null}
              </div>
            </section>
          );
        })}

        {/* A última coluna não é coluna: é o gesto de criar uma. */}
        <button
          type="button"
          onClick={aoCriarEtapa}
          className={cn(
            "flex h-full w-[300px] shrink-0 flex-col items-center justify-center gap-2 rounded-xl",
            "border border-dashed border-border bg-card/30 text-muted-foreground transition-colors",
            "hover:border-primary hover:text-foreground",
            `${foco}`,
          )}
        >
          <Plus size={20} weight="regular" aria-hidden="true" />
          <span className="text-h4">Nova etapa</span>
        </button>
      </div>

      {/* As setas dizem que há coluna fora da tela — e rolam uma coluna por
          clique. Somem na ponta do trilho, para não prometerem o que não há. */}
      <SetaDoTrilho lado="esquerda" visivel={bordas.esquerda} onClick={() => rolar(-1)} />
      <SetaDoTrilho lado="direita" visivel={bordas.direita} onClick={() => rolar(1)} />
    </div>
  );
}

function SetaDoTrilho({
  lado,
  visivel,
  onClick,
}: {
  lado: "esquerda" | "direita";
  visivel: boolean;
  onClick: () => void;
}) {
  const Seta = lado === "esquerda" ? CaretLeft : CaretRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-hidden={!visivel}
      tabIndex={visivel ? 0 : -1}
      aria-label={lado === "esquerda" ? "Ver etapas anteriores" : "Ver próximas etapas"}
      className={cn(
        "absolute top-1/2 z-sticky grid size-9 -translate-y-1/2 place-items-center rounded-full",
        "bg-card text-muted-foreground shadow-float transition-opacity hover:text-foreground",
        `${foco}`,
        lado === "esquerda" ? "left-2" : "right-2",
        visivel ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <Seta size={16} weight="bold" aria-hidden="true" />
    </button>
  );
}

/** Onde o cartão vai cair. Vale para o mouse e para o teclado — é o mesmo alvo. */
function Linha() {
  return <div aria-hidden="true" className="h-1 shrink-0 rounded-full bg-primary" />;
}

function Cartao({
  lead,
  campos,
  emMovimento,
  pegoPeloTeclado,
  descrito,
  aoAbrir,
  aoTeclar,
  aoIniciar,
  aoTerminar,
}: {
  lead: Lead;
  campos: readonly CampoDoCartao[];
  emMovimento: boolean;
  pegoPeloTeclado: boolean;
  descrito: string;
  aoAbrir: () => void;
  aoTeclar: (e: React.KeyboardEvent) => void;
  aoIniciar: (e: React.DragEvent) => void;
  aoTerminar: () => void;
}) {
  const Tipo = lead.tipo === "empresa" ? Buildings : User;
  const parado = lead.dias >= 7;
  const tags = tagsDe(GRUPOS_TAGS, lead.tags);
  const mostra = (c: CampoDoCartao) => campos.includes(c);
  const proximaAcao = lead.proximaAcao ? lead.proximaAcao.split("-").reverse().slice(0, 2).join("/") : null;
  // As linhas de detalhe: rótulo à esquerda em muted, valor à direita em
  // foreground (humano, 2026-09-23). Só as que a pessoa ligou e que têm valor.
  const detalhes = (
    [
      mostra("origem") ? ["Origem", lead.canal] : null,
      mostra("proximaAcao") ? ["Próxima ação", proximaAcao] : null,
      mostra("contato") && lead.contatoPrincipal
        ? ["Contato", `${lead.contatoPrincipal.nome}${lead.contatoPrincipal.cargo ? ` · ${lead.contatoPrincipal.cargo}` : ""}`]
        : null,
      mostra("email") ? ["E-mail", lead.email] : null,
    ] as ([string, string | null] | null)[]
  ).filter((par): par is [string, string] => Boolean(par && par[1]));
  const rodape = mostra("atendente") || mostra("dias");

  return (
    <article
      data-cartao={lead.id}
      draggable
      tabIndex={0}
      role="button"
      aria-roledescription="Cartão do funil"
      aria-describedby={descrito}
      aria-label={`${lead.nome}, ${lead.empresa}, ${moeda(lead.valor)}`}
      onClick={aoAbrir}
      onKeyDown={aoTeclar}
      onDragStart={aoIniciar}
      onDragEnd={aoTerminar}
      className={cn(
        "shrink-0 cursor-grab select-none rounded-lg bg-card p-3 shadow-sm transition-shadow",
        "hover:shadow-md active:cursor-grabbing",
        `${foco}`,
        emMovimento && !pegoPeloTeclado && "opacity-40",
        pegoPeloTeclado && "shadow-lg outline outline-2 outline-offset-2 outline-primary",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        {/* h3 (15px): entre os 16 que o humano pediu antes e os 13 do cartão
            cheio — um tamanho só, em todo estado (humano, 2026-09-23). */}
        <p title={lead.nome} className="min-w-0 truncate text-h3 text-foreground">
          {lead.nome}
        </p>
        <span className="shrink-0 text-label-lg tabular-nums text-foreground">{moeda(lead.valor)}</span>
      </div>

      {mostra("empresa") ? (
        <p title={`${lead.empresa} · ${lead.cidade}`} className="mt-1 flex items-center gap-1 text-body-sm text-muted-foreground">
          <Tipo size={14} weight="regular" aria-hidden="true" className="shrink-0" />
          <span className="min-w-0 truncate">{lead.empresa}</span>
          <span className="shrink-0 text-subtle-foreground">· {lead.cidade}</span>
        </p>
      ) : null}

      {detalhes.length > 0 ? (
        <dl className="mt-2.5 flex flex-col gap-1 text-label-lg">
          {detalhes.map(([rotulo, valor]) => (
            <div key={rotulo} className="flex items-baseline justify-between gap-3">
              <dt className="shrink-0 text-muted-foreground">{rotulo}</dt>
              <dd title={valor} className="min-w-0 truncate text-right tabular-nums text-foreground">
                {valor}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {mostra("tags") && tags.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap items-center gap-1">
          {tags.map((t) => (
            <Tag key={t.id} status={t.status}>
              {t.rotulo}
            </Tag>
          ))}
        </div>
      ) : null}

      {rodape ? (
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-background pt-2.5">
          {mostra("atendente") ? <Tag foto="/ds/atendente.png">{lead.responsavel}</Tag> : <span />}
          {mostra("dias") ? (
            <div className="flex shrink-0 items-center gap-2.5 text-muted-foreground">
              <span title={`Origem: ${lead.canal}`} className="flex items-center">
                <IconeDoCanal canal={lead.canal} />
                <span className="sr-only">{lead.canal}</span>
              </span>
              <span
                title={parado ? `Parado há ${lead.dias} dias nesta etapa` : `${lead.dias} dia(s) nesta etapa`}
                className={cn("flex items-center gap-1 text-caption tabular-nums", parado && "text-warning")}
              >
                {parado ? (
                  <WarningCircle size={14} weight="regular" aria-hidden="true" />
                ) : (
                  <Clock size={14} weight="regular" aria-hidden="true" />
                )}
                {lead.dias}d
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
