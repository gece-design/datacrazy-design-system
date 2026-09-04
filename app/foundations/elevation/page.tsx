"use client";

import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";

type Nivel = { nome: string; classe: string; onde: string; camadas: string[] };

/* Estilos de efeito `elevation/*` do Figma (node 431:3016), com TODAS as
   camadas (regra G4). A cor é sempre a mesma — #0A0D14 —, só o alfa e o
   deslocamento mudam. */
const niveis: Nivel[] = [
  {
    nome: "sm",
    classe: "shadow-sm",
    onde: "Cards e superfícies em repouso.",
    camadas: ["0 1px 2px 0 · 6%"],
  },
  {
    nome: "md",
    classe: "shadow-md",
    onde: "Dropdown, tooltip e elementos flutuantes curtos.",
    camadas: ["0 1px 2px −1px · 6%", "0 2px 4px −1px · 8%"],
  },
  {
    nome: "lg",
    classe: "shadow-lg",
    onde: "Popover, datepicker e menus de contexto.",
    camadas: ["0 2px 4px −2px · 6%", "0 8px 16px −4px · 10%"],
  },
  {
    nome: "xl",
    classe: "shadow-xl",
    onde: "Modal e drawer.",
    camadas: ["0 4px 8px −4px · 8%", "0 16px 32px −8px · 14%"],
  },
];

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Elevation"
      descricao="Quatro níveis de sombra, um por altura de flutuação. A escala mede distância da página, não decoração: quanto mais alto o elemento, mais longe e mais difusa a sombra."
      secoes={["Níveis", "Camadas", "Como funciona"]}
    >
      <Secao
        titulo="Níveis"
        spec="4 níveis"
        className="bg-background"
        codigo={`<div className="rounded-md bg-card shadow-md" />`}
      >
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {niveis.map((n) => (
            <div key={n.nome} className="flex flex-col gap-2.5">
              <div className={`h-24 w-full rounded-md bg-card ${n.classe}`} />
              <p className="text-label-md text-foreground">{n.nome}</p>
              <p className="text-caption text-muted-foreground">{n.onde}</p>
            </div>
          ))}
        </div>
        <Legenda>
          Os quatro quadrados são idênticos — mesma cor, mesmo raio, mesmo tamanho. Só a sombra
          separa um do outro.
        </Legenda>
      </Secao>

      <Secao
        titulo="Camadas"
        spec="7 no total"
        descricao="Três dos quatro níveis são duas sombras empilhadas: uma curta e escura que assenta a borda, outra longa e clara que espalha. Copiar só a segunda faz o elemento parecer solto."
        semCaixa
      >
        <div className="divide-y divide-border rounded-lg border border-border">
          {niveis.map((n) => (
            <div key={n.nome} className="grid gap-1 p-4 sm:grid-cols-[80px_1fr] sm:gap-4">
              <span className="font-mono text-label-md text-foreground">{n.nome}</span>
              <div className="flex flex-col gap-1">
                {n.camadas.map((c) => (
                  <span key={c} className="font-mono text-caption text-muted-foreground">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Legenda>
          Deslocamento, desfoque, espalhamento e opacidade. A cor é <Chip>#0A0D14</Chip> nas sete —
          um azul quase preto, não preto puro.
        </Legenda>
      </Secao>

      <ComoFunciona>
          <p>
            Os nomes <Chip>sm</Chip>, <Chip>md</Chip>, <Chip>lg</Chip> e <Chip>xl</Chip>{" "}
            sobrescrevem os do Tailwind de propósito. Se ficassem com nome próprio, a sombra de
            fábrica continuaria a um <Chip>shadow-md</Chip> de distância e entraria no produto sem
            ninguém perceber. Ocupando o nome, o caminho fácil passa a ser o certo.
          </p>
          <p>
            A escala é de altura, não de ênfase. Um card em repouso é <Chip>sm</Chip> porque está
            quase encostado na página; um modal é <Chip>xl</Chip> porque está muito acima dela. Usar{" "}
            <Chip>xl</Chip> para destacar um card não o destaca — descola ele de um plano a que ele
            pertence.
          </p>
          <p>
            Sombra é o token mais fácil de inventar e o mais caro de consertar: um{" "}
            <Chip>shadow-[0_2px_8px_rgba(0,0,0,.1)]</Chip> escrito à mão nunca combina com os
            quatro daqui, e a diferença aparece no dia em que dois deles ficam lado a lado. Fora
            desta escala, e das duas sombras nomeadas que a sidebar usa, não existe sombra no
            produto.
          </p>
      </ComoFunciona>
    </PaginaDS>
  );
}
