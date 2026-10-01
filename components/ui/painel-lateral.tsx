"use client";

import * as React from "react";
import { ArrowsInSimple, ArrowsOutSimple, type Icon } from "@phosphor-icons/react";
import { BotaoFechar, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { rolagemDiscreta } from "@/lib/estados";

/**
 * PainelLateral — o registro aberto AO LADO da lista, sem cobri-la.
 *
 * Mora dentro do painel da tela (o encaixe `lateral` da `TelaBase`), à
 * direita, com 480px e um traço à esquerda: abrir um lead EMPURRA a lista em
 * vez de escondê-la, e a pessoa continua vendo e trocando de registro
 * (mestre-detalhe, como no Twenty e no Attio). É a quinta parte da proposta
 * visual (humano, 2026-10-01, ADR-056). Sem par no arquivo.
 *
 * Não é diálogo: não prende o foco nem escurece a tela. O foco continua na
 * linha que abriu o registro; Tab entra no painel, Escape (com o foco dentro)
 * fecha. `telaCheia` faz o painel ocupar a tela toda — a `TelaBase` esconde a
 * lista (`lateralCheia`). Abaixo de 1024px ele já ocupa a tela toda.
 *
 * Peças: `PainelLateral` (a casca com o cabeçalho de 48px), `PainelLateralCorpo`
 * (a área que rola), `ListaDeCampos` + `LinhaDeCampo` (rótulo à esquerda, valor
 * à direita, 32px por linha — no lugar do cartão do drawer).
 */

export type RotulosDoPainelLateral = {
  /** Nome do X. Ex.: "Fechar o lead". */
  fechar: string;
  /** Nome do botão que leva à tela cheia. Ex.: "Abrir em tela cheia". */
  expandir: string;
  /** Nome do mesmo botão, na volta. Ex.: "Voltar ao painel". */
  recolher: string;
};

const Contexto = React.createContext<{ telaCheia: boolean }>({ telaCheia: false });

export interface PainelLateralProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Nome do registro: o título do painel e o nome da região. Ex.: "Marina Alvarenga". */
  titulo: string;
  /** Linha de apoio sob o título. Ex.: a empresa. */
  subtitulo?: React.ReactNode;
  /** Antes do título: o avatar ou o ícone do registro. */
  inicio?: React.ReactNode;
  /** Botões a mais no cabeçalho, antes de tela cheia e fechar. */
  acoes?: React.ReactNode;
  aoFechar: () => void;
  /** Ocupa a tela toda. Passe o mesmo valor em `lateralCheia` da `TelaBase`. */
  telaCheia?: boolean;
  /** Sem ela, o botão de tela cheia não aparece. */
  aoAlternarTelaCheia?: () => void;
  rotulos: RotulosDoPainelLateral;
  /** Largura do painel ao lado da lista, em px. Padrão 480. */
  largura?: number;
}

export function PainelLateral({
  titulo,
  subtitulo,
  inicio,
  acoes,
  aoFechar,
  telaCheia = false,
  aoAlternarTelaCheia,
  rotulos,
  largura = 480,
  className,
  style,
  children,
  onKeyDown,
  ...props
}: PainelLateralProps) {
  const Expandir = telaCheia ? ArrowsInSimple : ArrowsOutSimple;
  const nomeDoExpandir = telaCheia ? rotulos.recolher : rotulos.expandir;
  return (
    <Contexto.Provider value={{ telaCheia }}>
      <aside
        aria-label={titulo}
        // a largura só vale de 1024 para cima (a classe `lg:w-…` lê a variável); abaixo, o painel é a tela
        style={{ "--largura-do-painel": `${largura}px`, ...style } as React.CSSProperties}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          // um Escape que ninguém de dentro tratou (campo em edição, lista aberta) fecha o painel
          if (e.key === "Escape" && !e.defaultPrevented) {
            e.stopPropagation();
            aoFechar();
          }
        }}
        className={cn(
          "flex min-h-0 w-full flex-col bg-card motion-safe:animate-fade-in-fast",
          telaCheia ? "min-w-0 flex-1" : "shrink-0 lg:w-[var(--largura-do-painel)] lg:border-l lg:border-border",
          className,
        )}
        {...props}
      >
        {/* 48px, como a faixa do Header ao lado: as duas se alinham pelo traço de baixo */}
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
          {inicio}
          <div className="flex min-w-0 flex-1 flex-col">
            <h2 title={titulo} className="truncate text-h4 text-foreground">
              {titulo}
            </h2>
            {subtitulo ? <div className="flex min-w-0 items-center gap-1 text-caption text-muted-foreground">{subtitulo}</div> : null}
          </div>
          {acoes}
          {aoAlternarTelaCheia ? (
            // de 1024 para cima: abaixo disso o painel já ocupa a tela
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={nomeDoExpandir}
              title={nomeDoExpandir}
              aria-pressed={telaCheia}
              onClick={aoAlternarTelaCheia}
              className="hidden shrink-0 lg:inline-flex"
            >
              <Expandir size={16} weight="regular" aria-hidden="true" />
            </Button>
          ) : null}
          <BotaoFechar rotulo={rotulos.fechar} onClick={aoFechar} />
        </header>
        {children}
      </aside>
    </Contexto.Provider>
  );
}

/** A área que rola, com recuo de 12. Em tela cheia o conteúdo não estica: fica numa coluna de leitura, ao centro. */
export function PainelLateralCorpo({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { telaCheia } = React.useContext(Contexto);
  return (
    <div className={cn("min-h-0 flex-1 overflow-y-auto", rolagemDiscreta)} {...props}>
      <div className={cn("flex flex-col gap-4 p-3", telaCheia && "mx-auto w-full max-w-[720px]", className)}>{children}</div>
    </div>
  );
}

/** A lista de campos do registro: uma `LinhaDeCampo` por dado, sem vão entre elas. */
export function ListaDeCampos({ className, ...props }: React.HTMLAttributes<HTMLDListElement>) {
  return <dl className={cn("flex flex-col", className)} {...props} />;
}

export interface LinhaDeCampoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Nome do campo, à esquerda. Ex.: "Etapa". */
  rotulo: string;
  /** Ícone Phosphor de 14px antes do rótulo. */
  icone?: Icon;
  /** O valor: texto, `Tag`, ou o controle que edita no lugar (`CelulaEditavel`, `CelulaEscolha`). */
  children: React.ReactNode;
}

/** Um campo em linha: rótulo à esquerda (144px), valor à direita, 32px de altura — no lugar do cartão de 68. */
export function LinhaDeCampo({ rotulo, icone: Icone, className, children, ...props }: LinhaDeCampoProps) {
  return (
    <div className={cn("flex min-h-8 items-center gap-2", className)} {...props}>
      <dt className="flex w-36 shrink-0 items-center gap-2 text-body-md text-muted-foreground">
        {Icone ? <Icone size={14} weight="regular" aria-hidden="true" className="shrink-0" /> : null}
        <span className="truncate" title={rotulo}>
          {rotulo}
        </span>
      </dt>
      <dd className="min-w-0 flex-1 text-body-md text-foreground">{children}</dd>
    </div>
  );
}
