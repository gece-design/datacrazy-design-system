"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Eye, Code as CodeIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Colunas } from "./colunas";
import { Codigo } from "./codigo";
import { Paginacao } from "./paginacao";
import { Indice, IndiceCompacto, slug } from "./indice";
import {
  SeletorDeFundo,
  classeDoFundo,
  lerFundoSalvo,
  primeiroFundoLimpo,
  salvarFundo,
  somemNoFundo,
  type Fundo,
} from "./fundo-preview";

export { FUNDOS, type Fundo } from "./fundo-preview";

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
  titulo, spec, descricao, codigo, lang = "tsx", nota, children, className, semCaixa, fundo, semSeletorDeFundo,
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
  /** Fixa o fundo inicial da caixa. Passar isto DESLIGA a regra de contraste:
   *  quem declarou já decidiu. O humano ainda pode trocar pelas amostras. */
  fundo?: Fundo;
  /** Esconde as amostras. Só para preview que traz o próprio palco — um mock
   *  externo, por exemplo, onde a cor da caixa não encosta em nada. */
  semSeletorDeFundo?: boolean;
}) {
  const [aba, setAba] = useState<"preview" | "codigo">("preview");
  const temCodigo = Boolean(codigo);

  const caixaRef = useRef<HTMLDivElement>(null);
  const [fundoAtual, setFundoAtual] = useState<Fundo>(fundo ?? "background");
  // `true` só enquanto ninguém tocou nas amostras: é o que autoriza a regra a
  // decidir e o que acende a etiqueta "contraste".
  const [trocadoAuto, setTrocadoAuto] = useState(false);
  const humanoEscolheu = useRef(false);

  // A caixa não tem id próprio: rota + título da seção é o par estável.
  const rota = usePathname();
  const chaveDoFundo = `${rota}#${slug(titulo)}`;

  // A escolha salva. Só depois de montar — no servidor não existe storage, e
  // ler no primeiro render trocaria o HTML por baixo da hidratação.
  useEffect(() => {
    const salvo = lerFundoSalvo(chaveDoFundo);
    if (!salvo) return;
    humanoEscolheu.current = true;
    setTrocadoAuto(false);
    setFundoAtual(salvo);
  }, [chaveDoFundo]);

  // A regra de contraste. Roda uma vez, depois da primeira pintura do preview:
  // se no fundo padrão algum elemento some, cai no primeiro neutro em que não
  // some. Ver `somemNoFundo` em ./fundo-preview.
  useEffect(() => {
    if (fundo || semSeletorDeFundo || humanoEscolheu.current) return;
    if (temCodigo && aba !== "preview") return;
    const caixa = caixaRef.current;
    if (!caixa) return;
    const id = requestAnimationFrame(() => {
      if (!somemNoFundo(caixa)) return;
      const limpo = primeiroFundoLimpo(caixa);
      if (!limpo || limpo === "background") return;
      setFundoAtual(limpo);
      setTrocadoAuto(true);
    });
    return () => cancelAnimationFrame(id);
  }, [fundo, semSeletorDeFundo, temCodigo, aba]);

  const mostrarControles = (temCodigo || !semSeletorDeFundo) && !(temCodigo && aba === "codigo" && semSeletorDeFundo);

  return (
    <section id={slug(titulo)} className="scroll-mt-6">
      <div className="flex items-baseline gap-3">
        <h2 className="chrome-h2 text-foreground">{titulo}</h2>
        {spec && <span className="font-mono chrome-meta text-subtle-foreground">{spec}</span>}
      </div>
      {descricao && <p className="mt-2 chrome-prose text-muted-foreground">{descricao}</p>}

      {mostrarControles && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {temCodigo ? (
            <div className="inline-flex rounded-lg border border-border bg-background p-0.5">
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
          ) : (
            <span />
          )}
          {!semSeletorDeFundo && aba === "preview" && (
            <SeletorDeFundo
              valor={fundoAtual}
              trocadoAuto={trocadoAuto}
              aoEscolher={(f) => {
                humanoEscolheu.current = true;
                setTrocadoAuto(false);
                setFundoAtual(f);
                salvarFundo(chaveDoFundo, f);
              }}
            />
          )}
        </div>
      )}

      {temCodigo && aba === "codigo" ? (
        <Codigo codigo={codigo!} lang={lang} className="mt-4" />
      ) : (
        <>
          {/* a caixa é só o componente — anotação vai em `nota`, por baixo.
              O fundo padrão é `background`: é a superfície sobre a qual o
              componente vive no produto. As amostras ao lado do título trocam
              esse palco por outro neutro, e a regra de contraste troca sozinha
              quando o padrão faz alguma peça sumir. */}
          <div
            ref={caixaRef}
            data-caixa
            data-fundo={fundoAtual}
            className={cn(
              "mt-4 rounded-2xl border border-border",
              classeDoFundo(fundoAtual),
              !semCaixa && "p-4 sm:p-6 lg:p-8",
              className,
            )}
          >
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
      {/* inert: o card inteiro já é o link. Botão, campo ou trilha dentro do
          preview não recebem foco nem clique, e o clique cai no card. */}
      <div inert className="grid h-44 place-items-center overflow-hidden border-b border-border bg-background px-6">
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
