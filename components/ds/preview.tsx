"use client";

import { useState } from "react";
import { Eye, Code as CodeIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Colunas } from "./colunas";
import { Codigo } from "./codigo";
import { Paginacao } from "./paginacao";
import { Indice, IndiceCompacto, slug } from "./indice";

// slug e o índice moram em ./indice — quem monta o link e quem lê a âncora
// precisam da mesma função, e duplicá-la é como as duas se soltam.
export { slug };

/** Trecho de código no meio do texto. */
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    // Fora da caixa o chip é `background` sobre a página branca; dentro da
    // caixa de preview, que já é `background`, ele inverte para `card`.
    <code className="rounded bg-background px-1.5 py-0.5 font-mono chrome-chip text-foreground [[data-caixa]_&]:bg-card">
      {children}
    </code>
  );
}

export function PaginaDS({
  titulo, descricao, secoes = [], children,
}: { titulo: string; descricao: string; secoes?: string[]; children: React.ReactNode }) {
  return (
    <Colunas trilho={<Indice secoes={secoes} />}>
      <h1 className="chrome-h1 text-foreground">{titulo}</h1>
      <p className="mt-3 chrome-lead text-muted-foreground">{descricao}</p>
      <IndiceCompacto secoes={secoes} />
      <div className="mt-8 space-y-10 sm:mt-10 sm:space-y-12">{children}</div>
      <Paginacao />
    </Colunas>
  );
}

/** Bloco de abertura: explica o mecanismo antes de mostrar o resultado. */
export function ComoFunciona({ children }: { children: React.ReactNode }) {
  return (
    <section id={slug("Como funciona")} className="scroll-mt-6">
      <h2 className="chrome-h2 text-foreground">Como funciona</h2>
      <div className="mt-3 space-y-4 chrome-prose text-muted-foreground">{children}</div>
    </section>
  );
}

export function Secao({
  titulo, spec, descricao, codigo, lang = "tsx", nota, children, className, semCaixa,
}: {
  titulo: string;
  spec?: string;
  descricao?: string;
  /** Só passe quando houver código de verdade a copiar. Sem isto, a seção não
   *  ganha abas — bloco de referência ou explicação é preview e ponto. */
  codigo?: string;
  lang?: "tsx" | "bash" | "css" | "json";
  /** Anotação da seção. Fica FORA da caixa, por baixo dela — a caixa é só o
   *  componente, como na referência. Nunca coloque explicação dentro do preview. */
  nota?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  semCaixa?: boolean;
}) {
  const [aba, setAba] = useState<"preview" | "codigo">("preview");
  const temCodigo = Boolean(codigo);

  return (
    <section id={slug(titulo)} className="scroll-mt-6">
      <div className="flex items-baseline gap-3">
        <h2 className="chrome-h2 text-foreground">{titulo}</h2>
        {spec && <span className="font-mono chrome-meta text-subtle-foreground">{spec}</span>}
      </div>
      {descricao && <p className="mt-2 chrome-prose text-muted-foreground">{descricao}</p>}

      {temCodigo && (
        <div className="mt-4 inline-flex rounded-lg border border-border bg-background p-0.5">
          {([["preview", "Preview", Eye], ["codigo", "Código", CodeIcon]] as const).map(([id, rot, Icone]) => (
            <button
              key={id}
              onClick={() => setAba(id)}
              aria-pressed={aba === id}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 chrome-label transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                aba === id ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icone size={15} weight="regular" />
              {rot}
            </button>
          ))}
        </div>
      )}

      {temCodigo && aba === "codigo" ? (
        <Codigo codigo={codigo!} lang={lang} className="mt-4" />
      ) : (
        <>
          {/* a caixa é só o componente — anotação vai em `nota`, por baixo.
              Fundo `background`, não `card`: é a superfície sobre a qual o
              componente vive no produto. Em `card` a caixa se funde com a
              página e controles claros (checkbox, switch, tag) somem. */}
          <div data-caixa className={cn("mt-4 rounded-2xl border border-border bg-background", !semCaixa && "p-4 sm:p-6 lg:p-8", className)}>
            {children}
          </div>
          {nota && <div className="mt-3 chrome-meta text-subtle-foreground">{nota}</div>}
        </>
      )}
    </section>
  );
}

export function Legenda({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 chrome-meta text-subtle-foreground">{children}</p>;
}

export function CardComponente({
  titulo, descricao, href, pronto, children,
}: { titulo: string; descricao: string; href: string; pronto?: boolean; children: React.ReactNode }) {
  const conteudo = (
    <>
      <div className="grid h-44 place-items-center overflow-hidden border-b border-border bg-background px-6">
        {children}
      </div>
      <div className="p-4">
        <p className="chrome-h3 text-foreground">{titulo}</p>
        <p className="mt-1 chrome-meta text-muted-foreground">{descricao}</p>
      </div>
    </>
  );

  if (!pronto) {
    return (
      <div
        aria-disabled="true"
        title="Ainda não implementado"
        className="cursor-not-allowed overflow-hidden rounded-2xl border border-border bg-card opacity-50"
      >
        {conteudo}
      </div>
    );
  }

  return (
    <a
      href={href}
      className="block overflow-hidden rounded-2xl border border-border bg-card transition-colors
                 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {conteudo}
    </a>
  );
}
