"use client";

import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";

type Degrau = { nome: string; valor: string; classe: string };

/* Escala da seção RAIO do Figma (node 431:2860). */
const escala: Degrau[] = [
  { nome: "none", valor: "0px", classe: "rounded-none" },
  { nome: "xs", valor: "2px", classe: "rounded-xs" },
  { nome: "sm", valor: "4px", classe: "rounded-sm" },
  { nome: "md", valor: "6px", classe: "rounded-md" },
  { nome: "lg", valor: "8px", classe: "rounded-lg" },
  { nome: "xl", valor: "12px", classe: "rounded-xl" },
  { nome: "full", valor: "999px", classe: "rounded-full" },
];

/* Atribuição semântica, copiada da nota do próprio frame. */
const semantica: { degrau: string; onde: string }[] = [
  { degrau: "xs", onde: "checkbox" },
  { degrau: "md", onde: "button · input · card · nav-item" },
  { degrau: "lg", onde: "popover" },
  { degrau: "full", onde: "badge · avatar" },
];

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Radius"
      descricao="Sete degraus de arredondamento, de reto a pílula. Todos saem de uma variável só: mudar --radius move a escala inteira, o que mantém botão, input e card sempre em relação."
      secoes={["Escala", "Onde cada um entra", "Como funciona"]}
    >
      <Secao
        titulo="Escala"
        spec="7 degraus"
        className="bg-background"
        codigo={`<div className="rounded-md" />`}
      >
        <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 lg:grid-cols-7">
          {escala.map((d) => (
            <div key={d.nome} className="flex flex-col gap-2">
              <div className={`h-16 w-full border border-border bg-card ${d.classe}`} />
              <div>
                <p className="text-label-md text-foreground">{d.nome}</p>
                <p className="font-mono text-caption text-subtle-foreground">{d.valor}</p>
              </div>
            </div>
          ))}
        </div>
        <Legenda>
          A caixa é sempre a mesma, 64px de altura. Só o canto muda.
        </Legenda>
      </Secao>

      <Secao
        titulo="Onde cada um entra"
        spec="4 atribuições"
        descricao="O Figma não deixa a escolha em aberto: cada família de componente tem seu degrau."
        semCaixa
      >
        <div className="divide-y divide-border rounded-lg border border-border">
          {semantica.map((s) => (
            <div key={s.degrau} className="flex items-center gap-4 p-4">
              <span className="w-16 shrink-0 font-mono text-label-md text-foreground">{s.degrau}</span>
              <span className="text-body-lg text-muted-foreground">{s.onde}</span>
            </div>
          ))}
        </div>
        <Legenda>
          Os degraus <Chip>none</Chip>, <Chip>sm</Chip> e <Chip>xl</Chip> existem na escala mas o
          arquivo não atribui componente a eles. Ausência é decisão: não preencha por completude.
        </Legenda>
      </Secao>

      <ComoFunciona>
          <p>
            A escala inteira é derivada. <Chip>--radius</Chip> vale 8px e é o degrau{" "}
            <Chip>lg</Chip>; os outros são <Chip>calc()</Chip> em cima dele — <Chip>md</Chip> é
            −2px, <Chip>sm</Chip> é −4px, <Chip>xs</Chip> é −6px, <Chip>xl</Chip> é +4px. A
            consequência prática: mudar uma linha reafina o produto todo, e nenhum componente
            precisa saber disso.
          </p>
          <p>
            <Chip>full</Chip> é 999px, o valor que o Figma escreve — não o 9999px que o Tailwind
            traz de fábrica. A diferença não aparece em nada que exista hoje, mas o número é o do
            arquivo.
          </p>
          <p>
            Raio não se escreve solto. <Chip>rounded-[7px]</Chip> num componente é o mesmo tipo de
            erro que um hex cru: funciona uma vez e quebra a relação com o resto. Se um desenho pede
            um degrau que não existe, o caminho é o Figma, não o CSS.
          </p>
      </ComoFunciona>
    </PaginaDS>
  );
}
