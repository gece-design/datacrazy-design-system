"use client";

import { useState } from "react";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { Button } from "@/components/ui/button";
import { DURACAO, CURVA } from "@/lib/movimento";
import { cn } from "@/lib/utils";

/* Os valores vêm de lib/movimento.ts — o mesmo arquivo que o tailwind.config
   lê. A página não repete número nenhum: se o token mudar, ela muda junto. */
const duracoes = [
  { nome: "fast", classe: "duration-fast", ms: DURACAO.fast, onde: "Cor e opacidade: todo hover, o balão do Tooltip, o fade dos painéis." },
  { nome: "base", classe: "duration-base", ms: DURACAO.base, onde: "Tamanho e posição, e toda saída: o Toast fecha o vão, o Drawer sai." },
  { nome: "slow", classe: "duration-slow", ms: DURACAO.slow, onde: "Entrada de painel: o Drawer assenta, o Toast aparece." },
] as const;

const curvas = [
  { nome: "enter", classe: "ease-enter", valor: CURVA.enter, onde: "Entrada: desacelera no fim." },
  { nome: "exit", classe: "ease-exit", valor: CURVA.exit, onde: "Saída: acelera — sair não é evento." },
  { nome: "settle", classe: "ease-settle", valor: CURVA.settle, onde: "Painel que desliza e assenta em vez de parar seco." },
  { nome: "pop", classe: "ease-pop", valor: CURVA.pop, onde: "Overshoot: passa do ponto e volta (a estrela do Rating)." },
] as const;

const animacoes = [
  { nome: "fade-in", tempo: `${DURACAO.slow}ms · enter`, onde: "Toast entrando" },
  { nome: "fade-in-fast", tempo: `${DURACAO.fast}ms · enter`, onde: "Tooltip, Modal, scrim, painéis" },
  { nome: "fade-out", tempo: `${DURACAO.base}ms · exit`, onde: "Scrim do Drawer saindo" },
  { nome: "drawer-entra", tempo: `${DURACAO.slow}ms · settle`, onde: "Drawer" },
  { nome: "drawer-sai", tempo: `${DURACAO.base}ms · exit`, onde: "Drawer" },
  { nome: "toast-open", tempo: `${DURACAO.base}ms · enter`, onde: "Toast abrindo espaço na pilha" },
  { nome: "estrela-pop", tempo: "420ms · pop", onde: "Rating, ao escolher a nota" },
  { nome: "estrela-brilho", tempo: "480ms · enter", onde: "Rating, o halo que some crescendo" },
];

/** Um bloco que anda para a direita e volta, com a duração ou a curva pedida.
 *  O botão reproduz: movimento que só acontece no hover não dá para comparar. */
function Amostra({ classe, rotulo, spec }: { classe: string; rotulo: string; spec: string }) {
  const [ido, setIdo] = useState(false);
  return (
    <div className="flex flex-col gap-3 rounded-md bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-label-md text-foreground">{rotulo}</p>
          <p className="truncate font-mono text-caption text-subtle-foreground">{spec}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setIdo((v) => !v)}>
          Reproduzir
        </Button>
      </div>
      <div className="h-8 w-full rounded-sm bg-background">
        <div
          aria-hidden="true"
          className={cn("size-8 rounded-sm bg-primary transition-transform", classe, ido && "translate-x-[calc(100%*5)]")}
          style={{ transform: ido ? "translateX(calc(var(--pista, 100%) - 100%))" : undefined }}
        />
      </div>
    </div>
  );
}

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Motion"
      descricao={`Três durações (${DURACAO.fast}, ${DURACAO.base} e ${DURACAO.slow}ms), quatro curvas e oito animações nomeadas, com um dono só: lib/movimento.ts. O CSS e o JavaScript que espera a animação acabar leem o mesmo número. Quem pede menos movimento ao sistema não vê nenhum.`}
      secoes={["Durações", "Curvas", "Animações nomeadas", "Redução de movimento", "Como funciona"]}
    >
      <Secao
        titulo="Durações"
        spec={`${DURACAO.fast} · ${DURACAO.base} · ${DURACAO.slow}`}
        descricao="Cor e opacidade em fast; tamanho, posição e toda saída em base; entrada de painel em slow. Os três blocos percorrem a mesma pista com a curva de entrada."
        codigo={`<div className="transition-colors duration-fast" />
<div className="transition-transform duration-base ease-enter" />
<div className="motion-safe:animate-drawer-entra" />  {/* slow + settle */}`}
      >
        <div className="grid grid-cols-1 gap-4 [--pista:100%] sm:grid-cols-3">
          {duracoes.map((d) => (
            <Amostra key={d.nome} classe={`${d.classe} ease-enter`} rotulo={d.nome} spec={`${d.ms}ms · ${d.classe}`} />
          ))}
        </div>
        <Legenda>
          {duracoes.map((d) => `${d.nome}: ${d.onde}`).join(" ")} Os valores foram aprovados nos gates de
          2026-09-15 e 09-18 (Tooltip, Toast, Drawer) e desviam da regra I10 do kit por decisão
          registrada (ADR-021).
        </Legenda>
      </Secao>

      <Secao
        titulo="Curvas"
        spec="4 curvas"
        descricao="A mesma pista e a mesma duração (slow) para as quatro; só a aceleração muda. Entrada desacelera, saída acelera, settle assenta, pop passa do ponto."
        codigo={`<div className="transition-transform duration-slow ease-settle" />`}
      >
        <div className="grid grid-cols-1 gap-4 [--pista:100%] sm:grid-cols-2">
          {curvas.map((c) => (
            <Amostra key={c.nome} classe={`duration-slow ${c.classe}`} rotulo={c.nome} spec={c.valor} />
          ))}
        </div>
        <Legenda>{curvas.map((c) => `${c.nome}: ${c.onde}`).join(" ")}</Legenda>
      </Secao>

      <Secao
        titulo="Animações nomeadas"
        spec="8 nomes"
        descricao="Keyframes com nome no config, montados a partir das durações e curvas acima. Os nomes são públicos no registry: só se acrescenta, nunca se renomeia."
        codigo={`<div className="motion-safe:animate-fade-in-fast" />`}
      >
        <div className="overflow-x-auto rounded-md bg-card">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border text-label-md text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Nome</th>
                <th className="px-4 py-2.5 font-medium">Tempo · curva</th>
                <th className="px-4 py-2.5 font-medium">Onde</th>
              </tr>
            </thead>
            <tbody>
              {animacoes.map((a) => (
                <tr key={a.nome} className="border-b border-border last:border-0">
                  <td className="px-4 py-2 font-mono text-label-lg text-foreground">animate-{a.nome}</td>
                  <td className="px-4 py-2 font-mono text-label-lg text-muted-foreground">{a.tempo}</td>
                  <td className="px-4 py-2 text-body-md text-muted-foreground">{a.onde}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Legenda>
          As duas da estrela têm tempo próprio (420 e 480ms): são coreografia, não transição de estado. Literal
          no config é token; literal em componente é o que o check:tokens reprova.
        </Legenda>
      </Secao>

      <Secao
        titulo="Redução de movimento"
        spec="I12 · global"
        descricao="Uma regra no globals.css zera toda animação e transição quando o sistema pede menos movimento — de todo componente, inclusive os que ainda não existem. O JavaScript que espera uma animação acabar pergunta antes."
        codigo={`import { DURACAO, reduzido } from "@/lib/movimento";

// Drawer: fica montado só o tempo da saída — e nenhum, se o sistema pediu menos movimento
if (reduzido()) return;
setSaindo(true);
const fim = setTimeout(() => setSaindo(false), DURACAO.base);`}
      >
        <div className="rounded-md bg-card p-4 text-body-md text-muted-foreground">
          Ative <Chip>Reduzir movimento</Chip> nas preferências do sistema e recarregue: os blocos das seções
          acima passam a saltar para o fim da pista sem percorrer o caminho. É o mesmo que acontece com o
          Drawer, o Toast e o Modal do produto.
        </div>
      </Secao>

      <ComoFunciona>
        <p>
          {/* check-tokens:ignore duracao-literal — o texto explica o antipadrão, não o aplica */}
          Antes deste token, cada componente escolhia o próprio tempo: <Chip>duration-200</Chip> numa classe,{" "}
          <Chip>setTimeout(…, 200)</Chip> no JavaScript ao lado, e oito durações diferentes soltas no config. Os
          dois números precisam ser o mesmo — o Drawer fica montado durante a saída exatamente o tempo do
          <Chip>drawer-sai</Chip>; um milissegundo a menos e o painel some antes do último quadro. Por isso o dono
          é um arquivo TypeScript, <Chip>lib/movimento.ts</Chip>, que o <Chip>tailwind.config</Chip> importa e o
          componente também.
        </p>
        <p>
          A armadilha é a redução de movimento. A regra I12 diz que todo movimento tem versão reduzida, e a
          disciplina por classe (<Chip>motion-safe:</Chip>) segurava 5 de 40 arquivos. A regra global no CSS
          segura todos, mas não resolve o JavaScript: um <Chip>setTimeout</Chip> não sabe que a animação durou
          0,01ms. Quem espera um fim de animação pergunta <Chip>reduzido()</Chip> e desmonta na hora.
        </p>
        <p>
          O que não é token: os 420 e 480ms da estrela do Rating. São coreografia — uma sequência com
          overshoot e um halo que some — e não uma transição de estado. Ficam literais no config, com nome,
          onde literal é token. Em componente, número solto é o que o <Chip>check:tokens</Chip> reprova.
        </p>
      </ComoFunciona>
    </PaginaDS>
  );
}
