"use client";

import * as React from "react";
import { CaretLeft, CaretRight, Plus } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { foco, rolagemDiscreta } from "@/lib/estados";
import type { Tom } from "@/lib/tons";

/**
 * Quadro — o kanban do DS: colunas num trilho que rola e cartões que se
 * arrastam entre elas. Nasceu como o quadro do funil da tela do Pipeline
 * (cliente, 2026-09-28) e virou peça em 2026-10-07, a pedido do cliente na
 * reunião de 02/10: tudo o que o protótipo mostra é componente do design system.
 *
 * O quadro não sabe o que é um lead nem uma etapa. Recebe `colunas` com `itens`
 * de qualquer tipo, pede `chaveDe` e `nomeDe` para identificar e anunciar cada
 * um e `renderizar` para o conteúdo do cartão — a tela monta um `<QuadroCartao>`.
 * Ele é dono do movimento (arrastar, teclado, anúncios), do trilho que rola e
 * da casca da coluna e do cartão; a tela é dona dos dados e das palavras
 * (`rotulos`).
 *
 * Arrastar é HTML5 puro — `draggable` + os eventos de drag — porque a lista
 * negativa do projeto não deixa entrar biblioteca nova por causa de um quadro.
 * Arrastar com o mouse não é acessível sozinho (WCAG 2.5.7): o mesmo movimento
 * existe pelo teclado — Espaço pega, setas escolhem coluna e posição, Enter
 * solta, Esc cancela — e cada passo é anunciado numa região `aria-live`.
 * O trilho rola de três jeitos: roda do mouse, setas nas bordas e arrastando o
 * fundo do quadro, como no Trello.
 */

export type RotulosDoQuadro = {
  /** As instruções do cartão para o leitor de tela (`aria-describedby`). */
  instrucoes: string;
  /** O papel do cartão, no lugar de "botão" (`aria-roledescription`). */
  cartao: string;
  /** O botão no pé de cada coluna. */
  adicionar: string;
  /** O complemento do botão, só para o leitor de tela: "em Qualificação". */
  adicionarEm: (coluna: string) => string;
  /** O botão estreito no fim do trilho. */
  criarColuna: string;
  /** O tooltip do título da coluna, que edita: a descrição e o convite. */
  editarColuna: (descricao?: string) => string;
  /** O tooltip do resumo no cabeçalho: "R$ 12.000 em Proposta". */
  resumo: (resumo: string, coluna: string) => string;
  /** A coluna sem cartão. */
  vazio: string;
  /** As setas nas bordas do trilho. */
  anteriores: string;
  proximas: string;
  /** Anúncios do movimento pelo teclado, na ordem em que acontecem. */
  pego: (nome: string) => string;
  colunaEscolhida: (coluna: string, posicao: number, total: number) => string;
  posicao: (posicao: number, total: number) => string;
  movido: (nome: string, coluna: string, posicao: number) => string;
  cancelado: (nome: string, coluna: string) => string;
};

export const ROTULOS_DO_QUADRO: RotulosDoQuadro = {
  instrucoes:
    "Cartão do quadro. Enter abre. Espaço pega o cartão para movê-lo; com ele pego, as setas escolhem a coluna e a posição, Enter solta e Esc cancela.",
  cartao: "Cartão do quadro",
  adicionar: "Novo cartão",
  adicionarEm: (coluna) => `em ${coluna}`,
  criarColuna: "Nova coluna",
  editarColuna: (descricao) =>
    descricao ? `${descricao} — clique para renomear ou trocar a cor` : "Clique para renomear ou trocar a cor",
  resumo: (resumo, coluna) => `${resumo} em ${coluna}`,
  vazio: "Nenhum cartão nesta coluna. Arraste um para cá.",
  anteriores: "Ver colunas anteriores",
  proximas: "Ver próximas colunas",
  pego: (nome) =>
    `${nome} pego. Setas para os lados trocam de coluna, setas para cima e para baixo mudam a posição. Enter solta, Esc cancela.`,
  colunaEscolhida: (coluna, posicao, total) => `${coluna}, posição ${posicao} de ${total}.`,
  posicao: (posicao, total) => `Posição ${posicao} de ${total}.`,
  movido: (nome, coluna, posicao) => `${nome} em ${coluna}, posição ${posicao}.`,
  cancelado: (nome, coluna) => `Movimento cancelado. ${nome} continua em ${coluna}.`,
};

export type ColunaDoQuadro<T> = {
  id: string;
  rotulo: string;
  /** Vai no tooltip do título, antes do convite para editar. */
  descricao?: string;
  /** Pinta o painel, a bolinha e o título: um dos catorze tons, ou `neutro`. */
  cor: Tom | "neutro";
  itens: T[];
  /** O número à direita do cabeçalho — a soma dos valores, por exemplo. Já formatado: o quadro não conhece moeda. */
  resumo?: string;
};

export interface QuadroProps<T> {
  colunas: ColunaDoQuadro<T>[];
  /** O id de cada item: é o que `aoMover` devolve e o que `data-cartao` guarda. */
  chaveDe: (item: T) => string;
  /** O nome do item, para o leitor de tela e para os anúncios do movimento. */
  nomeDe: (item: T) => string;
  /** O que o leitor de tela ouve depois do nome (empresa, valor). */
  descricaoDe?: (item: T) => string;
  /** O conteúdo do cartão — um `<QuadroCartao>`. A casca (traço, foco, arrasto) é do quadro. */
  renderizar: (item: T) => React.ReactNode;
  /** Move o item para `colunaId`, na posição `indice` da lista sem ele. */
  aoMover: (id: string, colunaId: string, indice: number) => void;
  /** Clique ou Enter no cartão. */
  aoAbrir: (item: T) => void;
  /** Com ele, o botão de adicionar aparece no pé de cada coluna. */
  aoAdicionar?: (colunaId: string) => void;
  /** Com ele, o título da coluna vira botão. */
  aoEditarColuna?: (coluna: ColunaDoQuadro<T>) => void;
  /** Com ele, o botão de criar coluna aparece no fim do trilho. */
  aoCriarColuna?: () => void;
  rotulos?: Partial<RotulosDoQuadro>;
  className?: string;
}

/* O quadro é compacto (cliente, 2026-09-28: "colunas de 220px, cartões mais
   enxutos"): a coluna tem 220 de piso e cresce até 300 quando sobra tela, o
   vão é de 8 e o cartão mostra o essencial. Em 1440 cinco colunas cabem sem rolar. */
const VAO = 8;

/* A cor da coluna sai dos tons do DS: `data-tom` troca as variáveis e o painel
   usa o degrau mais claro (`tom-anel`). Bolinha e título saem do MESMO token —
   `tom-texto`, o degrau que se lê sobre o painel claro. `tom-tag` é o cheio:
   bonito na bolinha, fraco demais no texto (3:1 aos 13px). A coluna neutra é
   `background`: um degrau mais escuro que o `muted` do fundo da tela. */
function pintura(cor: Tom | "neutro") {
  if (cor === "neutro") return { tom: undefined, painel: "bg-background", ponto: "bg-muted-foreground", texto: "text-muted-foreground" };
  return { tom: cor, painel: "bg-tom-anel", ponto: "bg-tom-texto", texto: "text-tom-texto" };
}

type Alvo = { coluna: string; indice: number };

/* Dentro do quadro a casca do cartão é o `<article>` que arrasta; o
   `QuadroCartao` só põe o conteúdo. Solto (página do DS), ele desenha a
   própria casca. */
const DentroDoQuadro = React.createContext(false);

// cartão enxuto: traço no lugar da sombra, recuo 8, 6 entre os blocos
const CASCA_DO_CARTAO = "flex shrink-0 flex-col gap-1.5 rounded-md border border-border bg-card p-2";

export function Quadro<T>({
  colunas,
  chaveDe,
  nomeDe,
  descricaoDe,
  renderizar,
  aoMover,
  aoAbrir,
  aoAdicionar,
  aoEditarColuna,
  aoCriarColuna,
  rotulos,
  className,
}: QuadroProps<T>) {
  const r = { ...ROTULOS_DO_QUADRO, ...rotulos };
  const [movendo, setMovendo] = React.useState<string | null>(null);
  const [porTeclado, setPorTeclado] = React.useState(false);
  const [alvo, setAlvo] = React.useState<Alvo | null>(null);
  const [anuncio, setAnuncio] = React.useState("");
  const instrucoes = React.useId().replace(/:/g, "");

  const trilho = React.useRef<HTMLDivElement>(null);
  const [bordas, setBordas] = React.useState({ esquerda: false, direita: false });
  const [arrastandoTrilho, setArrastandoTrilho] = React.useState(false);
  const pan = React.useRef({ x: 0, scroll: 0 });

  const colunaPor = (id: string) => colunas.find((c) => c.id === id) ?? colunas[0];
  const colunaDe = (id: string) => colunas.find((c) => c.itens.some((i) => chaveDe(i) === id));
  const itemPor = (id: string) => colunas.flatMap((c) => c.itens).find((i) => chaveDe(i) === id);
  const tamanhoSem = (colunaId: string, id: string | null) => colunaPor(colunaId).itens.filter((i) => chaveDe(i) !== id).length;

  /* Quais setas aparecem. Recalcula na rolagem, no redimensionamento e quando
     o número de cartões muda — mover um cartão pode encurtar o trilho. */
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

  function concluir(id: string, colunaId: string, indice: number, comFoco: boolean) {
    const item = itemPor(id);
    aoMover(id, colunaId, indice);
    limpar();
    if (item) setAnuncio(r.movido(nomeDe(item), colunaPor(colunaId).rotulo, indice + 1));
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
      const rect = cartoes[i].getBoundingClientRect();
      if (y < rect.top + rect.height / 2) return i;
    }
    return cartoes.length;
  }

  function pegarPeloTeclado(item: T) {
    const id = chaveDe(item);
    const coluna = colunaDe(id);
    if (!coluna) return;
    setMovendo(id);
    setPorTeclado(true);
    setAlvo({ coluna: coluna.id, indice: coluna.itens.findIndex((i) => chaveDe(i) === id) });
    setAnuncio(r.pego(nomeDe(item)));
  }

  function teclas(e: React.KeyboardEvent, item: T) {
    const id = chaveDe(item);
    const emMao = movendo === id && porTeclado;

    if (!emMao) {
      if (e.key === " ") {
        e.preventDefault();
        pegarPeloTeclado(item);
      } else if (e.key === "Enter") {
        e.preventDefault();
        aoAbrir(item);
      }
      return;
    }

    const origem = colunaDe(id) ?? colunas[0];
    const atual = alvo ?? { coluna: origem.id, indice: 0 };
    const i = colunas.findIndex((c) => c.id === atual.coluna);

    if (e.key === "Escape") {
      e.preventDefault();
      limpar();
      setAnuncio(r.cancelado(nomeDe(item), origem.rotulo));
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      concluir(id, atual.coluna, atual.indice, true);
      return;
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const destino = colunas[e.key === "ArrowLeft" ? Math.max(0, i - 1) : Math.min(colunas.length - 1, i + 1)];
      const indice = Math.min(atual.indice, tamanhoSem(destino.id, id));
      setAlvo({ coluna: destino.id, indice });
      setAnuncio(r.colunaEscolhida(destino.rotulo, indice + 1, tamanhoSem(destino.id, id) + 1));
      // a coluna escolhida precisa estar à vista, senão o cartão "some" ao soltar
      document.querySelector(`[data-coluna="${destino.id}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
      return;
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const limite = tamanhoSem(atual.coluna, id);
      const indice = Math.max(0, Math.min(limite, atual.indice + (e.key === "ArrowUp" ? -1 : 1)));
      setAlvo({ coluna: atual.coluna, indice });
      setAnuncio(r.posicao(indice + 1, limite + 1));
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

  // Um clique na seta anda exatamente uma coluna: a largura dela, hoje, mais o vão.
  const rolar = (direcao: -1 | 1) => {
    const coluna = trilho.current?.querySelector<HTMLElement>("[data-coluna]");
    trilho.current?.scrollBy({ left: direcao * ((coluna?.offsetWidth ?? 220) + VAO), behavior: "smooth" });
  };

  return (
    <DentroDoQuadro.Provider value={true}>
      <div className={cn("relative flex min-h-0 flex-1 flex-col", className)}>
        <p id={instrucoes} className="sr-only">
          {r.instrucoes}
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
            // `relative`: os textos só para o leitor de tela (sr-only, absolutos) ficam
            // presos ao trilho e recortados por ele — sem isso, os das colunas escondidas
            // à direita alargam a página inteira
            "relative flex min-h-0 flex-1 gap-2 overflow-x-auto p-3",
            rolagemDiscreta,
            arrastandoTrilho ? "cursor-grabbing select-none" : "cursor-grab",
          )}
        >
          {colunas.map((coluna) => {
            const linhaAqui = Boolean(movendo) && alvo?.coluna === coluna.id;
            const cor = pintura(coluna.cor);
            const titulo = (
              <>
                <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", cor.ponto)} />
                {/* O título é o gesto de editar a coluna: nome e cor. */}
                <h2 className="min-w-0">
                  {aoEditarColuna ? (
                    <button
                      type="button"
                      onClick={() => aoEditarColuna(coluna)}
                      title={r.editarColuna(coluna.descricao)}
                      className={cn(
                        "block w-full truncate rounded-sm text-left text-h4 transition-colors hover:text-primary",
                        `${foco}`,
                        cor.texto,
                      )}
                    >
                      {coluna.rotulo}
                    </button>
                  ) : (
                    <span title={coluna.descricao} className={cn("block w-full truncate text-left text-h4", cor.texto)}>
                      {coluna.rotulo}
                    </span>
                  )}
                </h2>
                <span className="shrink-0 text-label-md tabular-nums text-muted-foreground">{coluna.itens.length}</span>
                {coluna.resumo ? (
                  <span
                    title={r.resumo(coluna.resumo, coluna.rotulo)}
                    className="ml-auto shrink-0 text-label-md tabular-nums text-muted-foreground"
                  >
                    {coluna.resumo}
                  </span>
                ) : null}
              </>
            );

            const nos: React.ReactNode[] = [];
            let posicao = 0;
            for (const item of coluna.itens) {
              const id = chaveDe(item);
              const emMovimento = id === movendo;
              if (!emMovimento) {
                if (linhaAqui && alvo!.indice === posicao) nos.push(<Linha key={`linha-${posicao}`} />);
                posicao++;
              }
              const pegoPeloTeclado = emMovimento && porTeclado;
              nos.push(
                <article
                  key={id}
                  data-cartao={id}
                  draggable
                  tabIndex={0}
                  role="button"
                  aria-roledescription={r.cartao}
                  aria-describedby={instrucoes}
                  aria-label={descricaoDe ? `${nomeDe(item)}, ${descricaoDe(item)}` : nomeDe(item)}
                  onClick={() => aoAbrir(item)}
                  onKeyDown={(e) => teclas(e, item)}
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", id);
                    setMovendo(id);
                    setPorTeclado(false);
                  }}
                  onDragEnd={() => {
                    if (!porTeclado) limpar();
                  }}
                  className={cn(
                    // levanta no hover (sombra) e assenta ao entrar na coluna — ao soltar, o cartão "chega"
                    CASCA_DO_CARTAO,
                    "cursor-grab select-none transition-[border-color,box-shadow] motion-safe:animate-surgir",
                    "hover:border-input-border-hover hover:shadow-sm active:cursor-grabbing",
                    `${foco}`,
                    emMovimento && !pegoPeloTeclado && "opacity-40",
                    pegoPeloTeclado && "shadow-lg outline outline-2 outline-offset-2 outline-primary",
                  )}
                >
                  {renderizar(item)}
                </article>,
              );
            }
            if (linhaAqui && alvo!.indice === posicao) nos.push(<Linha key="linha-fim" />);

            return (
              <section
                key={coluna.id}
                data-coluna={coluna.id}
                onDragOver={(e) => {
                  if (!movendo || porTeclado) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  setAlvo({ coluna: coluna.id, indice: indiceDoPonteiro(e.currentTarget, e.clientY) });
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = movendo ?? e.dataTransfer.getData("text/plain");
                  if (!id) return;
                  const indice = alvo?.coluna === coluna.id ? alvo.indice : indiceDoPonteiro(e.currentTarget, e.clientY);
                  concluir(id, coluna.id, indice, false);
                }}
                data-tom={cor.tom}
                className={cn(
                  // O painel da coluna: quase branco no claro, um degrau acima do
                  // fundo no escuro. Separa a coluna do fundo da tela sem competir
                  // com o branco do cartão. Com cor, é o degrau mais claro do tom.
                  "flex h-full min-w-[220px] max-w-[300px] flex-1 basis-0 flex-col gap-1.5 rounded-lg p-1.5 transition-colors",
                  linhaAqui ? "bg-accent" : cor.painel,
                )}
              >
                <header className="flex h-6 shrink-0 items-center gap-1.5 px-1">{titulo}</header>

                <div className={cn("flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto", rolagemDiscreta)}>
                  {nos}
                  {coluna.itens.length === 0 && !linhaAqui ? (
                    <p className="rounded-md border border-dashed border-border px-2 py-4 text-center text-body-sm text-subtle-foreground">
                      {r.vazio}
                    </p>
                  ) : null}
                  {/* Adicionar fica no pé da lista, com rótulo: o cabeçalho de 220 não tem lugar para mais um botão. */}
                  {aoAdicionar ? (
                    <Button variant="ghost" size="sm" onClick={() => aoAdicionar(coluna.id)} className="shrink-0 justify-start gap-1.5 px-1.5">
                      <Plus size={16} weight="regular" />
                      {r.adicionar}
                      <span className="sr-only">{` ${r.adicionarEm(coluna.rotulo)}`}</span>
                    </Button>
                  ) : null}
                </div>
              </section>
            );
          })}

          {/* Criar coluna: um botão estreito no fim do trilho, não uma coluna inteira de espaço vazio. */}
          {aoCriarColuna ? (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={r.criarColuna}
              title={r.criarColuna}
              onClick={aoCriarColuna}
              className="shrink-0 border border-dashed border-border"
            >
              <Plus size={16} weight="regular" />
            </Button>
          ) : null}
        </div>

        {/* As setas dizem que há coluna fora da tela — e rolam uma coluna por
            clique. Somem na ponta do trilho, para não prometerem o que não há. */}
        <SetaDoTrilho lado="esquerda" rotulo={r.anteriores} visivel={bordas.esquerda} onClick={() => rolar(-1)} />
        <SetaDoTrilho lado="direita" rotulo={r.proximas} visivel={bordas.direita} onClick={() => rolar(1)} />
      </div>
    </DentroDoQuadro.Provider>
  );
}

function SetaDoTrilho({
  lado,
  rotulo,
  visivel,
  onClick,
}: {
  lado: "esquerda" | "direita";
  rotulo: string;
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
      aria-label={rotulo}
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

/* ------------------------------------------------------------ O cartão -- */

export type DetalheDoCartao = {
  icone: Icon;
  /** O nome do campo: vai no `title` e no leitor de tela. O que se vê é o ícone. */
  rotulo: string;
  valor: string;
};

export interface QuadroCartaoProps {
  titulo: string;
  /** As iniciais na cor que o nome sorteia (`Avatar size="xs" iniciais="duas" tom="auto"`), ou a foto. */
  avatar?: { nome: string; src?: string };
  /** Já formatado: o quadro não conhece moeda. */
  valor?: string;
  /** O canto direito da linha do valor: origem, dias parado. */
  sinais?: React.ReactNode;
  /** Linhas de 16px com o ícone do campo e o valor. Só as que têm valor. */
  detalhes?: DetalheDoCartao[];
  /** O pé: as tags. */
  rodape?: React.ReactNode;
  /** Só vale fora do quadro, onde o cartão desenha a própria casca. */
  className?: string;
}

/**
 * O conteúdo do cartão: quem é (avatar e título), quanto vale e os sinais no
 * canto, as linhas de detalhe e o pé com as tags. Dentro do `Quadro` a casca
 * — traço, foco, arrasto — é do `<article>` que ele desenha; solto, o cartão
 * desenha a mesma casca, sem arrastar.
 */
export function QuadroCartao({ titulo, avatar, valor, sinais, detalhes = [], rodape, className }: QuadroCartaoProps) {
  const dentro = React.useContext(DentroDoQuadro);
  const conteudo = (
    <>
      {/* quem é: as iniciais na cor que o nome sorteia, como na lista */}
      <div className="flex items-center gap-1.5">
        {avatar ? <Avatar nome={avatar.nome} src={avatar.src} size="xs" iniciais="duas" tom="auto" aria-hidden="true" /> : null}
        <p title={titulo} className="min-w-0 flex-1 truncate text-h4 text-foreground">
          {titulo}
        </p>
      </div>

      {/* quanto vale, e os sinais do canto */}
      {valor || sinais ? (
        <div className="flex items-center justify-between gap-2">
          <span className="text-label-lg tabular-nums text-foreground">{valor}</span>
          {sinais ? <span className="flex shrink-0 items-center gap-2 text-muted-foreground">{sinais}</span> : null}
        </div>
      ) : null}

      {/* as linhas de detalhe: o ícone do campo e o valor, numa linha de 16 — o nome do campo vai no `title` */}
      {detalhes.length > 0 ? (
        <dl className="flex flex-col gap-1">
          {detalhes.map(({ icone: Glifo, rotulo, valor: v }) => (
            <div key={rotulo} title={`${rotulo}: ${v}`} className="flex items-center gap-1.5 text-body-sm text-muted-foreground">
              <dt className="flex shrink-0 items-center">
                <Glifo size={14} weight="regular" aria-hidden="true" />
                <span className="sr-only">{rotulo}</span>
              </dt>
              <dd className="min-w-0 truncate">{v}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {rodape ? <div className="flex flex-wrap items-center gap-1">{rodape}</div> : null}
    </>
  );
  if (dentro) return conteudo;
  return <article className={cn(CASCA_DO_CARTAO, className)}>{conteudo}</article>;
}
