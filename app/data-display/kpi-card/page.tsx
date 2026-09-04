"use client";

import { KpiCard } from "@/components/ui/kpi-card";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";

type Parte = { nome: string; medida: string; papel: string };

const anatomia: Parte[] = [
  {
    nome: "Card",
    medida: "border + p-[15px] · gap-3 · rounded-md",
    papel:
      "Recuo de 16 e gap de 12 agora saem de variável no Figma (space/16 e space/12). O padding é 15 porque o arquivo desenha o traço por dentro da caixa e o CSS soma por fora: 1 de borda mais 15 dá os 16. A altura não é fixada — fecha em 139 no Neutral e 140 com seta, e numa fileira todos esticam para o mais alto.",
  },
  {
    nome: "Header",
    medida: "flex items-center justify-between",
    papel:
      "Rótulo à esquerda, slot de ícone à direita. O rótulo trunca com tooltip nativo: es e pt-br são 20–30% mais longos que en, e truncar mudo é bug conhecido do CRM.",
  },
  {
    nome: "Icon slot",
    medida: "hug · rounded-md · 27–28px",
    papel:
      "Deixou de ser quadrado fixo: agora abraça o glifo. Seta de 16 com 6 de recuo dá 28; as três barras do neutral medem 13 de altura com 7 de recuo e dão 27. É por isso que o card do neutral é 1px mais baixo.",
  },
  {
    nome: "Valor",
    medida: "text-display · tabular-nums",
    papel:
      "26/32, peso 600, tracking −0.0231em. O tabular-nums alinha as colunas de dígitos sem trocar a família — trocar para mono seria o código decidindo o que o Figma não decidiu.",
  },
  {
    nome: "Meta chip",
    medida: "px-2 py-1 · rounded-sm",
    papel:
      "Legenda de apoio. Some quando caption não é passado — o card não deixa um chip vazio no lugar.",
  },
];

export default function Pagina() {
  return (
    <PaginaDS
      titulo="KPI Card"
      descricao="Card de métrica do topo do dashboard: um número em destaque, o rótulo do que ele mede e uma legenda de apoio. Dois eixos — tendência (neutral, up, down) e estilo (fill, outline) —, seis combinações, e o tema sai dos tokens."
      secoes={["Tendência", "Fill e Outline", "Em grade", "Anatomia", "Como funciona"]}
    >
      <Secao
        titulo="Tendência"
        className="bg-background"
        spec="3 variantes"
        descricao="O glifo do slot muda; a cor, não. Os três são primary, exatamente como estão pintados no Figma."
        codigo={`<KpiCard title="Total ganhos" value="R$ 0,00" caption="0 negócios" trend="up" />`}
        nota={
          <>
            A descrição do componente no Figma promete <Chip>success</Chip> para up e{" "}
            <Chip>destructive</Chip> para down, mas os glifos do arquivo estão os dois em{" "}
            <Chip>primary</Chip>. O código segue o arquivo — decisão do humano em 2026-09-03.
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard title="Total criados" value="R$ 3,00K" caption="37 negócios" trend="neutral" />
          <KpiCard title="Total ganhos" value="R$ 0,00" caption="0 negócios" trend="up" />
          <KpiCard title="Total perdidos" value="R$ 0,00" caption="0 negócios" trend="down" />
        </div>
      </Secao>

      <Secao
        titulo="Fill e Outline"
        className="bg-background"
        spec="2 estilos"
        descricao="Outline não é uma versão mais clara: é a mesma cor saindo do fundo e entrando na borda, nas três superfícies ao mesmo tempo — card, slot e chip. Só a legenda muda de token, de muted para subtle."
        codigo={`<KpiCard variant="outline" title="Total perdidos" value="R$ 0,00" caption="0 negócios" trend="down" />`}
        nota={
          <>
            No Figma o Outline está desenhado só para <Chip>trend=&quot;down&quot;</Chip>. As outras
            duas tendências saem daqui pela mesma regra das três superfícies — derivação, não desenho.
            Pendente de aprovação no gate.
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <KpiCard title="Total perdidos" value="R$ 0,00" caption="0 negócios" trend="down" />
          <KpiCard
            variant="outline"
            title="Total perdidos"
            value="R$ 0,00"
            caption="0 negócios"
            trend="down"
          />
        </div>
        <Legenda>À esquerda fill, à direita outline. Mesma altura, mesma caixa.</Legenda>
      </Secao>

      <Secao
        titulo="Em grade"
        className="bg-background"
        spec="piso de 164px"
        descricao="É para isso que ele existe: a faixa de métricas no topo do dashboard. O card ocupa a largura da coluna — não tem largura própria, e por isso a fileira conta em piso, não em número de colunas."
        nota={
          <>
            <Chip>lg:grid-cols-5</Chip> era o erro: cinco colunas fixas numa coluna de leitura de 820px dão
            110px livres por card, e <Chip>R$ 480,00</Chip> em 26/600 mede 123 — o número sangrava para fora.
            O piso de 164px é essa medida mais os 36 de traço e recuo do card, arredondados. Com{" "}
            <Chip>auto-fit</Chip> quem decide quantas colunas cabem é a largura real: cinco no dashboard,
            quatro aqui, uma no celular. Nenhum breakpoint precisa ser mantido à mão.
          </>
        }
        codigo={`<div
  className="grid gap-4"
  style={{ gridTemplateColumns: "repeat(auto-fit, minmax(164px, 1fr))" }}
>
  {metricas.map((m) => (
    <KpiCard key={m.title} {...m} />
  ))}
</div>`}
      >
        <div
          className="grid w-full gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(164px, 1fr))" }}
        >
          <KpiCard title="Criados" value="R$ 3,00K" caption="37 negócios" trend="neutral" />
          <KpiCard title="Ganhos" value="R$ 1,20K" caption="12 negócios" trend="up" />
          <KpiCard title="Perdidos" value="R$ 480,00" caption="5 negócios" trend="down" />
          <KpiCard title="Em aberto" value="R$ 1,32K" caption="20 negócios" trend="neutral" />
          <KpiCard title="Ticket médio" value="R$ 81,08" caption="média" trend="up" />
        </div>
      </Secao>

      <Secao titulo="Anatomia" spec="5 partes" semCaixa>
        <div className="divide-y divide-border rounded-lg border border-border">
          {anatomia.map((p) => (
            <div key={p.nome} className="grid gap-1 p-4 sm:grid-cols-[160px_1fr] sm:gap-4">
              <div>
                <p className="text-h4 text-foreground">{p.nome}</p>
                <p className="mt-1 font-mono text-label-md text-subtle-foreground">{p.medida}</p>
              </div>
              <p className="text-body-lg text-muted-foreground">{p.papel}</p>
            </div>
          ))}
        </div>
      </Secao>

      <ComoFunciona>
          <p>
            O Figma tem três eixos neste componente: <Chip>Trend</Chip>, <Chip>Style</Chip> e{" "}
            <Chip>theme</Chip>. Só os dois primeiros viraram prop. Tema como variante de componente é
            justamente o bug que o design system existe para eliminar — o mesmo{" "}
            <Chip>&lt;KpiCard&gt;</Chip> serve claro e escuro porque os tokens é que mudam sob{" "}
            <Chip>.dark</Chip>, e não há uma linha de código ramificando por tema.
          </p>
          <p>
            Os glifos não foram redesenhados nem trocados por ícones equivalentes do Phosphor: são os
            caminhos exportados do próprio arquivo. A única mudança é o <Chip>fill</Chip>, que saiu do{" "}
            <Chip>#3385FF</Chip> fixo para <Chip>currentColor</Chip> — assim quem manda na cor é o
            token, e um componente atende os dois temas. Mesmo tratamento dado ao logo.
          </p>
          <p>
            O card não fixa altura. Os 148px do Figma são a soma exata do conteúdo com o padding de 18
            e os dois gaps de 14, então deixá-la calcular dá o mesmo número e ainda aguenta um rótulo
            que quebre em duas linhas. Largura também é do contêiner: numa grade de cinco colunas o
            card preenche a coluna, que é o uso descrito no Figma.
          </p>
          <p>
            Não há hover, foco nem estado desabilitado. O Figma não desenhou nenhum e o{" "}
            <Chip>interactions.md</Chip> não declara nenhum — e a regra do kit é que estado não
            desenhado e não declarado significa que o componente não tem aquele estado. Se um dia o
            card virar link para o funil filtrado, aí ele passa a ser interativo e ganha foco visível;
            hoje ele é leitura.
          </p>
      </ComoFunciona>
    </PaginaDS>
  );
}
