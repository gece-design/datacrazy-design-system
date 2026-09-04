"use client";

import { useState } from "react";
import { Pagination } from "@/components/ui/pagination";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";

type Parte = { nome: string; medida: string; papel: string };

const anatomia: Parte[] = [
  {
    nome: "Resumo",
    medida: "text-body-md",
    papel:
      "Quantos itens estão à vista e de quantos. Fica à esquerda e é opcional: numa lista curta ele só ocupa espaço.",
  },
  {
    nome: "Botão de página",
    medida: "h-7 w-7 · rounded-md",
    papel:
      "Quadrado de 28. Usa tabular-nums para o 1 não estreitar o botão em relação ao 8 — sem isso os quadrados dançam.",
  },
  {
    nome: "Página atual",
    medida: "bg-accent + text-primary",
    papel:
      "Dois sinais, não um: fundo accent e texto primary. Só a borda não bastava — no tema escuro ela quase some contra o fundo do botão.",
  },
  {
    nome: "Extremos",
    medida: "gap-1 + caret",
    papel:
      "Anterior e Próxima têm seta e desabilitam nas pontas. Desabilitado perde contraste e perde o cursor junto, para ninguém clicar num alvo que não responde.",
  },
];

export default function Pagina() {
  const [poucas, setPoucas] = useState(1);
  const [muitas, setMuitas] = useState(4);
  const [semResumo, setSemResumo] = useState(2);

  return (
    <PaginaDS
      titulo="Pagination"
      descricao="Os controles de página de uma lista longa, com o resumo do que está à vista. Saiu de dentro da Data Table porque não é dela: qualquer lista que não cabe numa tela pagina."
      secoes={["Padrão", "Nas pontas", "Sem resumo", "Anatomia", "Como funciona"]}
    >
      <Secao
        titulo="Padrão"
        className="bg-background"
        spec="4 páginas"
        descricao="Resumo à esquerda, controles à direita. Clique nos números: a página atual muda de verdade."
        codigo={`<Pagination
  resumo="Mostrando 10 de 37 negócios"
  paginas={4}
  atual={pagina}
  onIr={setPagina}
/>`}
      >
        <div className="w-full rounded-md bg-card p-5">
          <Pagination
            resumo="Mostrando 10 de 37 negócios"
            paginas={4}
            atual={muitas}
            onIr={setMuitas}
          />
        </div>
      </Secao>

      <Secao
        titulo="Nas pontas"
        className="bg-background"
        spec="1 e última"
        descricao="Na primeira página, Anterior desabilita. Na última, Próxima. O botão perde contraste e perde o cursor junto — não adianta parecer clicável e não responder."
      >
        <div className="flex w-full flex-col gap-4">
          <div className="w-full rounded-md bg-card p-5">
            <Pagination resumo="Página 1 de 4" paginas={4} atual={poucas} onIr={setPoucas} />
          </div>
        </div>
        <Legenda>
          Vá para a primeira ou para a última e repare no botão da ponta correspondente.
        </Legenda>
      </Secao>

      <Secao
        titulo="Sem resumo"
        className="bg-background"
        spec="só controles"
        descricao="Numa lista curta o resumo só ocupa espaço. Sem ele os controles vão para a direita sozinhos."
        codigo={`<Pagination paginas={3} atual={pagina} onIr={setPagina} />`}
      >
        <div className="w-full rounded-md bg-card p-5">
          <Pagination paginas={3} atual={semResumo} onIr={setSemResumo} />
        </div>
      </Secao>

      <Secao titulo="Anatomia" spec="4 partes" semCaixa>
        <div className="divide-y divide-border rounded-lg border border-border">
          {anatomia.map((p) => (
            <div key={p.nome} className="grid gap-1 p-4 sm:grid-cols-[180px_1fr] sm:gap-4">
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
          A página atual se distingue por <strong>dois</strong> sinais: fundo <Chip>accent</Chip> e
          texto <Chip>primary</Chip>. O arquivo marcava só a borda, e no tema escuro ela quase
          desaparecia contra o fundo do próprio botão — quem estivesse na página 3 não saberia. Dois
          sinais também é o que a WCAG pede quando a cor carrega informação.
        </p>
        <p>
          O hover do botão inativo usa <Chip>overlay/item-hover</Chip>, o token que existe para
          &quot;item sob o cursor&quot;. Ele clareia nos dois temas — <Chip>accent</Chip> no claro,{" "}
          <Chip>base/neutral/800</Chip> no escuro —, então o realce funciona sem o componente saber
          em qual tema está.
        </p>
        <p>
          Para quem não vê a cor, quem diz &quot;você está aqui&quot; é o{" "}
          <Chip>aria-current=&quot;page&quot;</Chip>. Sem ele o leitor de tela anuncia seis botões
          idênticos e a pessoa fica sem referência. Cada número também tem{" "}
          <Chip>aria-label</Chip>, porque &quot;3&quot; sozinho não diz que é uma página.
        </p>
        <p>
          Os rótulos de Anterior e Próxima são props. A UI do CRM é multi-idioma, e texto fixo dentro
          de componente é a forma mais silenciosa de quebrar isso — some do arquivo de tradução e
          ninguém percebe até um cliente em espanhol abrir a tela.
        </p>
      </ComoFunciona>
    </PaginaDS>
  );
}
