"use client";

import { useState } from "react";
import { Tabs, TabPanel, type ItemTab } from "@/components/ui/tabs";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";

const secoesDoLead: ItemTab[] = [
  { valor: "historico", rotulo: "Histórico" },
  { valor: "atividades", rotulo: "Atividades" },
  { valor: "arquivos", rotulo: "Arquivos" },
  { valor: "notas", rotulo: "Notas", disabled: true },
];

const conteudo: Record<string, string[]> = {
  historico: ["Etapa mudou para Proposta · há 2 dias", "Negócio criado por Eduardo Prates · há 5 dias"],
  atividades: ["Ligação agendada para amanhã, 10h", "E-mail de follow-up enviado · ontem"],
  arquivos: ["proposta-comercial-v3.pdf", "contrato-minuta.docx"],
};

const muitas: ItemTab[] = [
  "Histórico", "Atividades", "Atendimentos", "Pessoas", "Arquivos", "Produtos", "Automações", "Campos",
].map((r) => ({ valor: r.toLowerCase(), rotulo: r }));

const codigoEstados = `<Tabs
  id="lead"
  rotulo="Seções do lead"
  itens={[
    { valor: "historico", rotulo: "Histórico" },
    { valor: "atividades", rotulo: "Atividades" },
  ]}
  atual={secao}
  aoEscolher={setSecao}
/>`;

const codigoAoVivo = `<Tabs id="lead" rotulo="Seções do lead" itens={secoes} atual={secao} aoEscolher={setSecao} />

<TabPanel id="lead" valor="historico" atual={secao}>…</TabPanel>
<TabPanel id="lead" valor="atividades" atual={secao}>…</TabPanel>`;

export default function TabsPage() {
  const [estado, setEstado] = useState("historico");
  const [secao, setSecao] = useState("historico");
  const [longa, setLonga] = useState("historico");

  return (
    <PaginaDS
      titulo="Tabs"
      descricao="Aba de 34px de altura: 8 de recuo em cima, rótulo de 12px em label-lg, 8 de vão e um traço de 2px. Dois estados — sem traço em muted-foreground, com traço em primary — e uma fileira que nunca quebra linha."
      secoes={["Como funciona", "Estados", "Ao vivo", "Quando não cabe"]}
    >
      <ComoFunciona>
        <p>
          O arquivo desenha <span className="text-foreground">uma aba</span>, não a fileira: rótulo em cima, traço
          embaixo, largura que abraça o texto. Selecionada, as duas coisas viram <Chip>primary</Chip>; nas outras, o
          rótulo fica em <Chip>muted-foreground</Chip> e o traço existe mas é transparente — por isso as abas não
          mudam de altura quando a seleção troca.
        </p>
        <p>
          O roadmap deixava abas fora do sistema pela anti-referência nº 11: abas como forma de crescer, que quebram
          e viram duas linhas. A fileira aqui responde exatamente a isso —{" "}
          <span className="text-foreground">ela nunca quebra</span>. Quando as abas não cabem, a fileira rola na
          horizontal, e a aba que recebe o foco rola junto até ficar à vista.
        </p>
        <p>
          O teclado segue o padrão de abas da WAI-ARIA. Só a aba selecionada entra no Tab; entre elas, as setas
          movem e já selecionam, e Home e End vão às pontas. Aba desabilitada é pulada. O Tab seguinte leva ao{" "}
          <Chip>TabPanel</Chip>, que é focável e anunciado com o nome da aba.
        </p>
        <p>
          O foco é um anel <span className="text-foreground">por dentro</span> da aba, e não o contorno com folga dos
          outros componentes. A fileira rola, e contêiner que rola corta o que passa da borda: o contorno de fora
          sumiria em cima e embaixo.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Estados"
        spec="default · selected"
        descricao="Os dois do arquivo, lado a lado. Passe o cursor na aba de fora: o rótulo sobe para foreground, e o traço continua só na selecionada."
        codigo={codigoEstados}
      >
        <div className="flex justify-center">
          <Tabs
            id="estados"
            rotulo="Estados da aba"
            itens={secoesDoLead.slice(0, 2)}
            atual={estado}
            aoEscolher={setEstado}
          />
        </div>
      </Secao>

      <Secao
        titulo="Ao vivo"
        spec="4 abas · 1 desabilitada"
        descricao="As seções de um lead. Clique, ou entre pelo Tab e ande com as setas. Notas está desabilitada e as setas passam por cima dela."
        codigo={codigoAoVivo}
      >
        <div className="mx-auto w-full max-w-md">
          <Tabs id="lead" rotulo="Seções do lead" itens={secoesDoLead} atual={secao} aoEscolher={setSecao} />
          {Object.entries(conteudo).map(([valor, linhas]) => (
            <TabPanel key={valor} id="lead" valor={valor} atual={secao} className="mt-4">
              <ul className="space-y-2">
                {linhas.map((l) => (
                  <li key={l} className="text-body-md text-muted-foreground">
                    {l}
                  </li>
                ))}
              </ul>
            </TabPanel>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Quando não cabe"
        spec="8 abas em 260px"
        descricao="Oito seções numa coluna estreita. Nada quebra linha: a fileira rola. Com o foco numa aba, vá até a última com End e veja a fileira acompanhar."
      >
        <div className="mx-auto w-[260px] max-w-full">
          <Tabs id="muitas" rotulo="Seções do negócio" itens={muitas} atual={longa} aoEscolher={setLonga} />
        </div>
        <Legenda>
          A barra de rolagem fica escondida; rola por trackpad, por arrasto no toque e pelo teclado.
        </Legenda>
      </Secao>
    </PaginaDS>
  );
}
