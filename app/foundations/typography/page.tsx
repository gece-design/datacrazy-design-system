import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";

type Papel = { classe: string; spec: string; peso: string };

const titulos: Papel[] = [
  { classe: "text-display", spec: "26 / 32 · −0,6", peso: "SemiBold · 600" },
  { classe: "text-h1",      spec: "22 / 28 · −0,4", peso: "SemiBold · 600" },
  { classe: "text-h2",      spec: "18 / 24 · −0,2", peso: "SemiBold · 600" },
  { classe: "text-h3",      spec: "15 / 20",        peso: "SemiBold · 600" },
  { classe: "text-h4",      spec: "13 / 18",        peso: "SemiBold · 600" },
];

const corpo: Papel[] = [
  { classe: "text-body-lg", spec: "13 / 18", peso: "Regular · 400" },
  { classe: "text-body-md", spec: "12 / 17", peso: "Regular · 400" },
  { classe: "text-body-sm", spec: "11 / 16", peso: "Regular · 400" },
];

const rotulos: Papel[] = [
  { classe: "text-label-lg", spec: "12 / 16", peso: "Medium · 500" },
  { classe: "text-label-md", spec: "11 / 15", peso: "Medium · 500" },
  { classe: "text-label-sm", spec: "10 / 14", peso: "Medium · 500" },
  { classe: "text-button",   spec: "13 / 18", peso: "Medium · 500" },
];

const especiais: Papel[] = [
  { classe: "text-metric",   spec: "16 / 21 · −0,2", peso: "SemiBold · 600" },
  { classe: "text-caption",  spec: "10 / 14",        peso: "Regular · 400" },
  { classe: "text-overline", spec: "10 / 14 · +0,5", peso: "Medium · 500" },
];

const AMOSTRA = "Automatize seu atendimento";

/** A escala é o próprio componente da fundação: amostra na classe real, com o
 *  nome do token que se copia à direita. */
function Escala({ papeis }: { papeis: Papel[] }) {
  return (
    <div className="divide-y divide-border">
      {papeis.map((p) => (
        <div key={p.classe} className="flex items-center justify-between gap-8 px-8 py-6 first:pt-8 last:pb-8">
          <p className={`${p.classe} min-w-0 flex-1 truncate text-foreground`}>{AMOSTRA}</p>
          <p className="shrink-0 font-mono text-body-md text-muted-foreground">{p.classe}</p>
        </div>
      ))}
    </div>
  );
}

/** Métrica de cada papel. Fica na nota, fora da caixa: é spec, não componente. */
function Metricas({ papeis }: { papeis: Papel[] }) {
  return (
    <dl className="mt-2.5 grid gap-x-8 gap-y-1 sm:grid-cols-2">
      {papeis.map((p) => (
        <div key={p.classe} className="flex items-baseline justify-between gap-3">
          <dt className="font-mono text-muted-foreground">{p.classe}</dt>
          <dd>
            {p.spec} · {p.peso}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function Typography() {
  return (
    <PaginaDS
      titulo="Typography"
      descricao="Quinze papéis, de display (26px) a caption (10px), em Geist e Geist Mono — espelho 1:1 das variáveis text/* do Figma."
      secoes={["Como funciona", "Títulos", "Corpo", "Rótulos", "Especiais", "Mono"]}
    >
      <ComoFunciona>
        <p>
          Cada papel é um <span className="text-foreground">token composto</span>: uma classe como{" "}
          <Chip>text-body-md</Chip> define tamanho, entrelinha, tracking <span className="text-foreground">e</span> peso
          de uma vez, gerada em <Chip>tailwind.config.ts</Chip> a partir das variáveis do Figma. Você nunca combina{" "}
          <Chip>text-sm</Chip> com <Chip>font-medium</Chip> e <Chip>leading-5</Chip> na mão — um token só garante a
          métrica exata que o Figma especifica.
        </p>
        <p>
          A nomenclatura é <Chip>text-&#123;papel&#125;</Chip>, e o peso já vem embutido: títulos em SemiBold, rótulos
          e botão em Medium, corpo em Regular. <span className="text-foreground">Hierarquia se faz por peso, não por
          tamanho</span> — o maior título tem 26px, e isso é intencional: fonte exagerada em título é anti-referência
          registrada do time.
        </p>
        <p>
          Duas regras de conversão valem sempre. Entrelinha vem em px do Figma e vira px literal, nunca o{" "}
          <Chip>leading-*</Chip> nomeado do Tailwind, que arredonda. Tracking vem em px e vira <Chip>em</Chip>,
          dividido pelo tamanho da fonte.
        </p>
        <p>
          E uma armadilha real: como essas classes vivem no namespace <Chip>text-*</Chip>, elas precisam estar
          registradas no <Chip>tailwind-merge</Chip> como utilitários de tamanho. Sem isso, um merge com classe de cor
          descarta a tipografia <span className="text-foreground">em silêncio</span> e o componente cai nos 16px do
          navegador. Se você adicionar um papel novo, espelhe em <Chip>lib/utils.ts</Chip>.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Títulos"
        spec="26 → 13px"
        descricao="Cinco níveis, todos SemiBold. O tracking negativo cresce com o tamanho — tratamento óptico."
        semCaixa
        nota={
          <>
            <p>
              O tracking só existe nos três maiores: <Chip>text-display</Chip> em −0,6, <Chip>text-h1</Chip> em −0,4 e{" "}
              <Chip>text-h2</Chip> em −0,2. De <Chip>text-h3</Chip> para baixo ele é zero.
            </p>
            <Metricas papeis={titulos} />
          </>
        }
      >
        <Escala papeis={titulos} />
      </Secao>

      <Secao
        titulo="Corpo"
        spec="13 → 11px"
        descricao="Texto corrido. Pequeno de propósito: num CRM a densidade é estrutural, não estética."
        semCaixa
        nota={
          <>
            <p>
              <Chip>text-body-lg</Chip> tem a mesma métrica de <Chip>text-h4</Chip> — 13 / 18. O que separa os dois é o
              peso: Regular contra SemiBold.
            </p>
            <Metricas papeis={corpo} />
          </>
        }
      >
        <Escala papeis={corpo} />
      </Secao>

      <Secao
        titulo="Rótulos"
        spec="13 → 10px"
        descricao="Medium. É o peso que separa rótulo de conteúdo sem precisar aumentar o tamanho."
        semCaixa
        nota={
          <>
            <p>
              <Chip>text-button</Chip> mora aqui porque é Medium, não porque é rótulo. Três papéis dividem a métrica
              13 / 18 e só se distinguem pelo peso: <Chip>text-h4</Chip> em SemiBold, <Chip>text-button</Chip> em
              Medium e <Chip>text-body-lg</Chip> em Regular.
            </p>
            <Metricas papeis={rotulos} />
          </>
        }
      >
        <Escala papeis={rotulos} />
      </Secao>

      <Secao
        titulo="Especiais"
        spec="16 → 10px"
        descricao="Métrica de BI, legenda e sobrelinha. Papéis próprios porque têm trabalho próprio."
        semCaixa
        nota={
          <>
            <p>
              <Chip>text-caption</Chip> e <Chip>text-overline</Chip> partem da mesma métrica, 10 / 14. A sobrelinha soma
              tracking de +0,5 e peso Medium; a legenda fica em Regular, sem tracking.
            </p>
            <Metricas papeis={especiais} />
          </>
        }
      >
        <Escala papeis={especiais} />
      </Secao>

      <Secao
        titulo="Mono"
        spec="Geist Mono"
        descricao="Número tabular e código. Alinha coluna de valor sem o texto dançar."
        nota={
          <>
            A família vem da variável <Chip>font/family/mono</Chip> do Figma. <Chip>font-mono</Chip> não é um papel da
            escala: troca só a família, e por isso compõe com qualquer <Chip>text-&#123;papel&#125;</Chip> — as duas
            linhas acima são <Chip>text-body-lg</Chip> e <Chip>text-body-md</Chip>.
          </>
        }
      >
        <div className="space-y-2">
          <p className="font-mono text-body-lg text-foreground">R$ 3.000,00 · 37 negócios · 100,0%</p>
          <p className="font-mono text-body-md text-muted-foreground">--primary · --foreground · --border</p>
        </div>
      </Secao>
    </PaginaDS>
  );
}
