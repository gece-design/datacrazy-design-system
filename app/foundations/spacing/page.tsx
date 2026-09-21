"use client";

import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";

/* Escala da seção ESPAÇAMENTO do Figma (node 431:2893). O segundo valor é a
   classe do Tailwind que entrega aquele pixel — os catorze degraus caem todos
   na escala de fábrica, sem uma linha de extensão no config. */
const escala: { px: number; classe: string }[] = [
  { px: 0, classe: "0" },
  { px: 2, classe: "0.5" },
  { px: 4, classe: "1" },
  { px: 6, classe: "1.5" },
  { px: 8, classe: "2" },
  { px: 12, classe: "3" },
  { px: 16, classe: "4" },
  { px: 20, classe: "5" },
  { px: 24, classe: "6" },
  { px: 32, classe: "8" },
  { px: 40, classe: "10" },
  { px: 48, classe: "12" },
  { px: 64, classe: "16" },
  { px: 80, classe: "20" },
];

const usos: { faixa: string; onde: string }[] = [
  { faixa: "6 – 20", onde: "padding dentro de componente" },
  { faixa: "4 – 16", onde: "gap entre itens" },
  { faixa: "24", onde: "gutter de layout" },
  { faixa: "32", onde: "entre seções" },
  { faixa: "40", onde: "respiro da página" },
];

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Spacing"
      descricao="Catorze degraus, de 0 a 80px. A escala não foi inventada aqui nem estendida: é a do Tailwind, e o Figma escolheu exatamente os degraus que ela já tinha."
      secoes={["Escala", "Onde cada faixa entra", "Como funciona"]}
    >
      <Secao
        titulo="Escala"
        spec="14 degraus"
        codigo={`<div className="flex flex-col gap-3 p-5" />`}
      >
        <div className="flex flex-col gap-2">
          {escala.map((d) => (
            <div key={d.px} className="flex items-center gap-4">
              <span className="w-10 shrink-0 text-right font-mono text-label-md text-foreground">
                {d.px}
              </span>
              <span className="h-4 shrink-0 bg-primary" style={{ width: `${d.px}px` }} />
              <span className="font-mono text-caption text-subtle-foreground">
                {d.px}px · p-{d.classe} · gap-{d.classe}
              </span>
            </div>
          ))}
        </div>
        <Legenda>
          A barra azul tem a largura exata do degrau. O 0 não desenha nada — e é degrau mesmo assim.
        </Legenda>
      </Secao>

      <Secao
        titulo="Onde cada faixa entra"
        spec="5 usos"
        descricao="O arquivo separa o espaço por papel, não por tamanho: o mesmo 16px é gap num lugar e padding no outro."
        semCaixa
      >
        <div className="divide-y divide-border rounded-lg border border-border">
          {usos.map((u) => (
            <div key={u.faixa} className="flex items-center gap-4 p-4">
              <span className="w-16 shrink-0 font-mono text-label-md text-foreground">{u.faixa}</span>
              <span className="text-body-lg text-muted-foreground">{u.onde}</span>
            </div>
          ))}
        </div>
        <Legenda>
          O Figma dá as faixas, não os apelidos de cada degrau dentro delas. Por isso a tabela
          mostra o intervalo em pixels e não um <Chip>padding-md</Chip> que o arquivo não nomeou.
        </Legenda>
      </Secao>

      <ComoFunciona>
          <p>
            Esta é a única fundação que não gerou uma linha de código. Os catorze degraus do Figma —
            0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64 e 80 — são exatamente{" "}
            <Chip>0</Chip>, <Chip>0.5</Chip>, <Chip>1</Chip>, <Chip>1.5</Chip>, <Chip>2</Chip>,{" "}
            <Chip>3</Chip>, <Chip>4</Chip>, <Chip>5</Chip>, <Chip>6</Chip>, <Chip>8</Chip>,{" "}
            <Chip>10</Chip>, <Chip>12</Chip>, <Chip>16</Chip> e <Chip>20</Chip> do Tailwind. Nada a
            estender, nada a apelidar.
          </p>
          <p>
            Isso é resultado, não coincidência: as duas escalas são múltiplos de 4 com meios-degraus
            embaixo, onde a diferença entre 6 e 8 ainda se enxerga. A consequência é que{" "}
            <Chip>gap-3</Chip> já é o token — não existe camada de tradução entre o arquivo e a
            classe, e portanto não existe onde uma tradução se perder.
          </p>
          <p>
            O que continua proibido é o valor solto. <Chip>p-[18px]</Chip> aparece no KPI Card, e
            aparece porque o Figma mediu 18 ali — não porque alguém achou que 16 era pouco. Espaço
            fora da escala precisa vir do arquivo, com o nó anotado.
          </p>
      </ComoFunciona>
    </PaginaDS>
  );
}
