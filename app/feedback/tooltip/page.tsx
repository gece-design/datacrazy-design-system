"use client";

import { Copy } from "@phosphor-icons/react";
import { Tooltip, TooltipContent, type TooltipPosition } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";

import { foco } from "@/lib/estados";
const posicoes: TooltipPosition[] = ["top", "bottom", "left", "right"];

const codigoPosicoes = `<TooltipContent position="top">Copiar para a área de transferência</TooltipContent>
<TooltipContent position="bottom">…</TooltipContent>
<TooltipContent position="left">…</TooltipContent>
<TooltipContent position="right">…</TooltipContent>`;

const codigoAoVivo = `<Tooltip content="Copiar para a área de transferência">
  <Button variant="secondary" aria-label="Copiar">
    <Copy size={16} weight="regular" />
  </Button>
</Tooltip>`;

const codigoTruncado = `<Tooltip content={empresa}>
  <span tabIndex={0} className="block truncate">
    {empresa}
  </span>
</Tooltip>`;

const empresa = "Ferraz Odontologia Especializada e Estética Avançada Ltda.";

export default function TooltipPage() {
  return (
    <PaginaDS
      titulo="Tooltip"
      descricao="Um balão de texto de 10px sobre surface-inverse, com recuo de 10 × 6, raio de 6px e uma seta de 10 × 6 que entra 2px por baixo dele. Quatro posições; abre pelo cursor depois de 400ms e pelo teclado na hora."
      secoes={["Como funciona", "Posições", "Ao vivo", "No texto truncado"]}
    >
      <ComoFunciona>
        <p>
          São duas peças. <Chip>TooltipContent</Chip> é o desenho — o balão e a seta, sem comportamento — e é o que
          a seção Posições mostra parado. <Chip>Tooltip</Chip> embrulha um gatilho: escuta cursor e foco, espera,
          mede, e renderiza o balão num portal no <Chip>body</Chip>, na camada <Chip>z-popover</Chip>. O portal não
          é detalhe: dentro de uma célula de tabela com <Chip>overflow-hidden</Chip> o balão seria cortado, e dentro
          de um card com <Chip>transform</Chip> o <Chip>fixed</Chip> deixaria de ser relativo à janela.
        </p>
        <p>
          <Chip>position</Chip> é o lado do gatilho onde o balão aparece, e a seta aponta para o gatilho. É o{" "}
          <span className="text-foreground">lado preferido</span>, não uma ordem: o balão nasce invisível, mede, e
          se não couber vira para o lado oposto antes de pintar. Com zoom acima de 100% a janela encolhe em px de CSS
          e o lado que cabia deixa de caber — é a família de bugs da regra E3.
        </p>
        <p>
          O balão é a superfície invertida do tema: <Chip>surface-inverse</Chip> com texto{" "}
          <Chip>primary-foreground</Chip>. No claro, azul-escuro com texto branco; no escuro, quase branco com texto
          quase preto. A seta é o vetor exportado do arquivo em <Chip>currentColor</Chip>, então troca junto sem uma
          linha de <Chip>dark:</Chip>.
        </p>
        <p>
          A armadilha é o toque. Não existe &ldquo;passar por cima&rdquo; num celular, e um balão que abre no toque
          fica preso porque o <Chip>pointerleave</Chip> nunca chega. Aqui o toque é ignorado de propósito — o que
          está no balão <span className="text-foreground">não pode ser a única via</span> para a informação. Botão
          só com ícone continua precisando de <Chip>aria-label</Chip>; o tooltip é complemento.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Posições"
        spec="4 · position"
        descricao="As quatro, paradas. Top e Bottom medem 181 × 30 com este texto; Left e Right, 185 × 26 — a seta ocupa 6px no eixo dela e devolve 2 para dentro do balão."
        codigo={codigoPosicoes}
      >
        <div className="grid grid-cols-1 place-items-center gap-6 sm:grid-cols-2">
          {posicoes.map((p) => (
            <div key={p} className="flex flex-col items-center gap-2">
              <TooltipContent position={p}>Copiar para a área de transferência</TooltipContent>
              <span className="font-mono text-caption text-subtle-foreground">{p}</span>
            </div>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Ao vivo"
        spec="hover · foco"
        descricao="Passe o cursor ou chegue pelo Tab. Pelo teclado abre na hora; Escape fecha."
        codigo={codigoAoVivo}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          {posicoes.map((p) => (
            <Tooltip key={p} content="Copiar para a área de transferência" position={p}>
              <Button variant="secondary" aria-label={`Copiar (${p})`}>
                <Copy size={16} weight="regular" />
                {p}
              </Button>
            </Tooltip>
          ))}
        </div>
        <Legenda>Leve um dos botões até a borda da janela: o balão vira para o outro lado.</Legenda>
      </Secao>

      <Secao
        titulo="No texto truncado"
        spec="E1"
        descricao="O motivo de o componente existir: texto que corta mostra o conteúdo inteiro. O nome da empresa não cabe na coluna."
        codigo={codigoTruncado}
        nota={
          <>
            Aqui o tooltip está sempre ligado, cortando ou não. Ligar só quando corta exige medir o overflow — é o
            primitivo <Chip>Truncate</Chip> do roadmap, que ainda não existe. O <Chip>tabIndex</Chip> é o que deixa
            o teclado chegar ao texto.
          </>
        }
      >
        <div className="mx-auto w-48 rounded-md border border-border p-3">
          <p className="text-caption text-subtle-foreground">Empresa</p>
          <Tooltip content={empresa}>
            <span
              tabIndex={0}
              className={`block truncate rounded-sm text-body-lg text-foreground ${foco}`}
            >
              {empresa}
            </span>
          </Tooltip>
        </div>
      </Secao>
    </PaginaDS>
  );
}
