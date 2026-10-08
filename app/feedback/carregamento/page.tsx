"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  Skeleton,
  SkeletonDaConversa,
  SkeletonDaTabela,
  SkeletonDaTela,
  SkeletonDeCartoes,
  SkeletonDeTexto,
  SkeletonDoCanvas,
  SkeletonDoCartao,
  SkeletonDoPainel,
  SkeletonDoQuadro,
  type ModeloDeCarregamento,
} from "@/components/ui/skeleton";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { DURACAO } from "@/lib/movimento";
import { blocoDaTela } from "@/lib/estados";
import { cn } from "@/lib/utils";

const codigoBloco = `// o bloco: dê a ele a forma do que vai chegar
<Skeleton className="h-3 w-48" />          // uma linha de texto
<Skeleton className="size-10 rounded-full" /> // um avatar
<Skeleton className="h-20 w-full" />        // um cartão`;

const codigoTexto = `<SkeletonDeTexto linhas={3} />
<SkeletonDeTexto linhas={5} />`;

const codigoTabela = `<div className={blocoDaTela}>
  <SkeletonDaTabela linhas={6} colunas={5} />
</div>`;

const codigoCartoes = `<SkeletonDeCartoes quantidade={3} />
// ou um só, no lugar de um CartaoDeCatalogo
<SkeletonDoCartao />`;

const codigoQuadro = `<SkeletonDoQuadro colunas={3} />`;

const codigoConversa = `<div className={cn(blocoDaTela, "flex h-[420px]")}>
  <SkeletonDaConversa />
</div>`;

const codigoPainel = `<SkeletonDoPainel />`;

const codigoCanvas = `<div className={cn(blocoDaTela, "flex bg-muted")}>
  <SkeletonDoCanvas />
</div>`;

const codigoTela = `// enquanto a API responde: a tela inteira com a forma do que vem
{carregando ? <SkeletonDaTela modelo="tabela" /> : tabela}

// os seis modelos: tabela · cartoes · quadro · conversa · painel · canvas
<SkeletonDaTela modelo="quadro" rotulo="Carregando o funil…" />`;

const codigoNaTela = `// o protótipo mostra o Skeleton por 600 ms ao trocar de tela pelo menu
// e segura nele com ?carregando=1
/prototipo?tela=leads&carregando=1`;

const MODELOS: { valor: ModeloDeCarregamento; rotulo: string }[] = [
  { valor: "tabela", rotulo: "Tabela" },
  { valor: "cartoes", rotulo: "Cartões" },
  { valor: "quadro", rotulo: "Quadro" },
  { valor: "conversa", rotulo: "Conversa" },
  { valor: "painel", rotulo: "Painel" },
  { valor: "canvas", rotulo: "Canvas" },
];

/** Um item de lista com a chave à esquerda, como nas páginas do Button e do Input. */
function Item({ mono, children }: { mono: string; children: React.ReactNode }) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-2">
      <code className="w-44 shrink-0 font-mono chrome-meta text-foreground">{mono}</code>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

type Parte = { nome: string; medida: string; papel: string };

const anatomia: Parte[] = [
  { nome: "Bloco", medida: "Skeleton · background · rounded-md · aria-hidden", papel: "A forma do que vai chegar: uma linha de 12px, um disco, um retângulo. A cor é o cinza da página (background) — muted sumiria sobre o branco do cartão. Quem dá a medida é quem monta." },
  { nome: "Brilho", medida: "banda card/60 · degradê de 200% · transparente nas pontas", papel: "Uma banda clara (card a 60%) com o dobro da largura do bloco, transparente nas pontas, que desliza de um lado ao outro por cima do cinza." },
  { nome: "Ciclo", medida: `${DURACAO.ciclo} ms · vaivem · infinite alternate`, papel: "A ida leva 1,4 s com a curva simétrica; o alternate traz de volta pelo mesmo caminho. Nunca para enquanto a tela carrega. Com prefers-reduced-motion, fica parado." },
  { nome: "Modelos", medida: "texto · tabela · cartão · quadro · conversa · painel · canvas", papel: "Montagens prontas com a forma de cada peça do DS: as linhas de 36 da tabela densa, o cartão de catálogo com o pé, as colunas de 240 do quadro, as três colunas do atendimento." },
  { nome: "Tela", medida: "SkeletonDaTela · role=status · aria-busy · p-3", papel: "A tela inteira no padrão de fundo (o bloco branco sobre o cinza, recuo 12), com o modelo da tela que vem. Anuncia 'Carregando…' uma vez e marca a região como ocupada." },
];

function ExemploTela() {
  const [modelo, setModelo] = React.useState<ModeloDeCarregamento>("tabela");
  return (
    <div className="flex w-full flex-col gap-3">
      <SegmentedControl rotulo="Modelo" itens={MODELOS} atual={modelo} aoEscolher={(v) => setModelo(v as ModeloDeCarregamento)} />
      <div className="flex h-[520px] w-full flex-col overflow-hidden rounded-md bg-muted">
        <SkeletonDaTela key={modelo} modelo={modelo} />
      </div>
    </div>
  );
}

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Carregamento"
      novidade="2026-10-08"
      descricao="O modelo de carregamento de página: Skeleton. Blocos cinza com a forma do que vai chegar — a linha de 12px, o disco do avatar, as linhas de 36 da tabela — e um brilho que vai de uma ponta à outra e volta, num ciclo de 1,4 s. Sem spinner: a pessoa vê onde cada coisa vai aparecer."
      secoes={["O bloco", "Texto", "Tabela", "Cartões", "Quadro", "Conversa", "Painel", "Canvas", "A tela inteira", "Movimento", "Anatomia", "Na tela", "Como funciona", "Quando usar"]}
    >
      <Secao
        titulo="O bloco"
        spec="background · banda card/60 · brilho de 1,4 s"
        descricao="O Skeleton é um bloco: dê a ele a forma do que vai chegar — uma linha de texto, um avatar, um cartão. A cor é o cinza da página (background) e o brilho é uma banda clara que desliza por cima, indo e voltando."
        codigo={codigoBloco}
        novidade="2026-10-08"
        nota={
          <>
            O bloco é <Chip>aria-hidden</Chip>: o leitor de tela não ouve &quot;retângulo cinza&quot; dezenas de vezes.
            Quem anuncia é a montagem (<Chip>SkeletonDaTela</Chip>), uma vez, com <Chip>role=&quot;status&quot;</Chip>.
          </>
        }
      >
        <div className="flex w-full max-w-xl flex-col gap-4">
          <Skeleton className="h-3 w-48" />
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-2.5 w-24" />
            </div>
          </div>
          <Skeleton className="h-20 w-full" />
        </div>
      </Secao>

      <Secao
        titulo="Texto"
        spec="linhas de 12 · a última em 60%"
        descricao="Um parágrafo que vem: linhas de 12px com vão de 8, a última mais curta — como texto de verdade termina."
        codigo={codigoTexto}
        novidade="2026-10-08"
      >
        <div className="grid w-full max-w-2xl gap-6 md:grid-cols-2">
          <SkeletonDeTexto linhas={3} />
          <SkeletonDeTexto linhas={5} />
        </div>
      </Secao>

      <Secao
        titulo="Tabela"
        spec="cabeçalho + linhas de 36 · iniciais na primeira coluna"
        descricao="A tabela densa que vem: o cabeçalho, as linhas de 36px com traço, a primeira coluna com o disco das iniciais e o nome. As larguras variam um pouco por linha, como dados de verdade."
        codigo={codigoTabela}
        novidade="2026-10-08"
      >
        <div className={cn(blocoDaTela, "w-full")}>
          <SkeletonDaTabela linhas={6} colunas={5} />
        </div>
      </Secao>

      <Secao
        titulo="Cartões"
        spec="gradeDeCartoes · o cartão de catálogo"
        descricao="A grade de cartões de catálogo que vem: o disco de 40, o nome, duas linhas de descrição e as três métricas no pé, embaixo do traço."
        codigo={codigoCartoes}
        novidade="2026-10-08"
      >
        <SkeletonDeCartoes quantidade={3} />
      </Secao>

      <Secao
        titulo="Quadro"
        spec="colunas de 240 · 2 a 3 cartões"
        descricao="O funil que vem: colunas de 240 com o cabeçalho (bolinha, nome, contagem) e dois ou três cartões cada, com título, valor e a tag."
        codigo={codigoQuadro}
        novidade="2026-10-08"
      >
        <div className="w-full overflow-hidden rounded-md bg-muted">
          <SkeletonDoQuadro colunas={3} />
        </div>
      </Secao>

      <Secao
        titulo="Conversa"
        spec="3 colunas · lista 320 · balões · painel 300"
        descricao="O atendimento que vem: a lista de conversas à esquerda, os balões alternando de lado no meio, o lead à direita. As colunas das pontas somem nas larguras em que a tela também as esconde."
        codigo={codigoConversa}
        novidade="2026-10-08"
      >
        <div className={cn(blocoDaTela, "flex h-[420px] w-full")}>
          <SkeletonDaConversa />
        </div>
      </Secao>

      <Secao
        titulo="Painel"
        spec="4 KPIs · gráfico de barras · lista"
        descricao="O Início que vem: a fileira de quatro KPIs, o gráfico de barras (as alturas variam, como um mês de verdade) e o cartão da lista."
        codigo={codigoPainel}
        novidade="2026-10-08"
      >
        <SkeletonDoPainel />
      </Secao>

      <Secao
        titulo="Canvas"
        spec="3 blocos de 264 · folha muted"
        descricao="A automação que vem: três blocos de 264 na folha cinza, o do meio mais abaixo, como um fluxo com ramificação."
        codigo={codigoCanvas}
        novidade="2026-10-08"
      >
        <div className={cn(blocoDaTela, "flex w-full bg-muted")}>
          <SkeletonDoCanvas />
        </div>
      </Secao>

      <Secao
        titulo="A tela inteira"
        spec="SkeletonDaTela · 6 modelos · padrão de fundo"
        descricao="O que vai no lugar do conteúdo enquanto a API responde: a tela inteira no padrão de fundo, com o modelo da tela que vem. Troque o modelo para ver cada um."
        codigo={codigoTela}
        novidade="2026-10-08"
        semSeletorDeFundo
        nota={
          <>
            O Header e a Sidebar não carregam: o título da tela já se sabe. O que carrega é o conteúdo — por isso o
            Skeleton entra no lugar do bloco, não da tela. <Chip>rotulo</Chip> é o que o leitor de tela ouve
            (&quot;Carregando…&quot;), no idioma de quem lê.
          </>
        }
      >
        <ExemploTela />
      </Secao>

      <Secao
        titulo="Movimento"
        spec={`duration/ciclo ${DURACAO.ciclo} ms · ease/vaivem · infinite alternate`}
        descricao="O brilho é uma banda clara com o dobro da largura do bloco; a animação desliza a posição dela de uma ponta à outra em 1,4 s, com a curva simétrica, e o alternate traz de volta pelo mesmo caminho. Um bloco sozinho basta para ver o vai e vem."
        novidade="2026-10-08"
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="duration/ciclo">
                {DURACAO.ciclo} ms, novo na escala de movimento (<Chip>lib/movimento.ts</Chip>): o tempo de uma onda
                contínua, não de uma transição de estado
              </Item>
              <Item mono="ease/vaivem">a curva simétrica, que acelera e desacelera igual: sem solavanco nas pontas, porque a volta começa onde a ida parou</Item>
              <Item mono="infinite alternate">não para enquanto a tela carrega; vai e volta em vez de recomeçar do zero</Item>
              <Item mono="reduced-motion">a redução é global no CSS: o degradê fica parado, o bloco cinza continua dizendo o lugar</Item>
            </ul>
            <p className="mt-2.5">Todos os blocos da mesma tela começam juntos: um só relógio, nada pisca fora de hora.</p>
          </>
        }
      >
        <div className="flex w-full max-w-xl flex-col gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-2/3" />
        </div>
      </Secao>

      <Secao titulo="Anatomia" spec="5 partes" semCaixa novidade="2026-10-08">
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

      <Secao
        titulo="Na tela"
        spec="/prototipo?tela=…&carregando=1"
        descricao="No protótipo, trocar de tela pelo menu mostra o Skeleton da tela que vem por 600 ms — o tempo de uma API responder. Com carregando=1 na URL, a tela fica nele, para olhar com calma."
        codigo={codigoNaTela}
        semSeletorDeFundo
      >
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <p className="chrome-prose text-muted-foreground">
            Cada tela tem o seu modelo: Início é o painel, Pipelines o quadro, Leads a tabela, Chat a conversa,
            Automações o canvas, Agentes os cartões.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild variant="secondary">
              <Link href="/prototipo?tela=leads&carregando=1">Leads carregando</Link>
            </Button>
            <Button asChild variant="tertiary">
              <Link href="/prototipo?tela=pipeline&carregando=1">Pipeline</Link>
            </Button>
            <Button asChild variant="tertiary">
              <Link href="/prototipo?tela=atendimento&carregando=1">Chat</Link>
            </Button>
            <Button asChild variant="tertiary">
              <Link href="/prototipo?tela=dashboard&carregando=1">Início</Link>
            </Button>
          </div>
        </div>
        <Legenda>
          No CRM, o Skeleton entra enquanto o <Chip>fetch</Chip> da tela não voltou; a <Chip>TelaBase</Chip> fica, o
          conteúdo troca. Nada de spinner no meio da página.
        </Legenda>
      </Secao>

      <ComoFunciona>
        <p>
          Não há desenho no arquivo: o cliente pediu em 2026-10-08 um &quot;modelo de carregamento de página&quot; e o
          humano definiu a forma — &quot;skeleton loading com animação de gradient indo e voltando&quot; (ADR-078). O
          bloco é um <Chip>div</Chip> com fundo <Chip>background</Chip> (o cinza da página: <Chip>muted</Chip> sumiria
          sobre o branco do cartão) e uma banda de <Chip>card</Chip> a 60% com 200% de largura; a animação{" "}
          <Chip>brilho</Chip> (keyframes no tailwind.config) desliza a posição do fundo, e o <Chip>alternate</Chip> faz
          a volta.
        </p>
        <p>
          O tempo entrou na escala de movimento como <Chip>duration/ciclo</Chip> ({DURACAO.ciclo} ms) e a curva como{" "}
          <Chip>ease/vaivem</Chip>: literal no config é token, literal em componente não. Com{" "}
          <Chip>prefers-reduced-motion</Chip> a redução global do <Chip>globals.css</Chip> para a banda — o bloco
          cinza continua marcando o lugar.
        </p>
        <p>
          As montagens (<Chip>SkeletonDaTabela</Chip>, <Chip>SkeletonDoQuadro</Chip>…) copiam as medidas das peças de
          verdade: 36px por linha, 240 por coluna, 264 por bloco. É o que evita o pulo quando o conteúdo chega — a
          armadilha de todo skeleton. A outra armadilha é o tempo: abaixo de 300 ms o Skeleton pisca e incomoda mais do
          que ajuda; a tela decide se mostra, o componente só desenha.
        </p>
      </ComoFunciona>

      <Secao titulo="Quando usar" descricao="Skeleton responde “ainda não chegou”; o Estado vazio responde “não há”.">
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Use</span> <Chip>SkeletonDaTela</Chip> no lugar do conteúdo enquanto a
            tela espera a API: a tabela, o quadro, o chat, o painel.
          </li>
          <li>
            <span className="text-foreground">Use</span> os blocos soltos para uma parte que carrega sozinha: o gráfico
            de um cartão, o painel do lead.
          </li>
          <li>
            <span className="text-foreground">Use</span> a montagem com a forma certa: a tela de lista carrega como
            tabela, não como cartões — senão o conteúdo pula ao chegar.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para uma ação curta (salvar, enviar): é o botão
            desabilitado e o Toast.
          </li>
          <li>
            <span className="text-foreground">Não use</span> quando a resposta já veio vazia: é o Estado vazio.
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
