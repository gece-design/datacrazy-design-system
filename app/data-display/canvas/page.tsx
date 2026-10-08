"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle, Flag, GitBranch, Lightning, Play } from "@phosphor-icons/react";
import { Canvas, LARGURA_DO_BLOCO, type BlocoDoCanvas, type CanvasRef, type TipoDoCanvas } from "@/components/ui/canvas";
import { Button } from "@/components/ui/button";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";

/* Um fluxo genérico de cinco blocos — início, dois passos, uma decisão e o
   fim. O canvas não sabe o que é uma automação: recebe os blocos, o ícone e o
   rótulo de cada tipo, e devolve cada gesto para a página guardar. */

type Tipo = "inicio" | "passo" | "decisao" | "fim";

const TIPOS: Record<Tipo, TipoDoCanvas> = {
  inicio: { rotulo: "Início", icone: Play, inicio: true },
  passo: { rotulo: "Passo", icone: Lightning },
  decisao: { rotulo: "Decisão", icone: GitBranch },
  fim: { rotulo: "Fim", icone: Flag },
};

const PARA_ADICIONAR: { valor: Tipo; rotulo: string }[] = [
  { valor: "passo", rotulo: "Passo" },
  { valor: "decisao", rotulo: "Decisão" },
  { valor: "fim", rotulo: "Fim" },
];

const COLUNA = LARGURA_DO_BLOCO + 72;
const col = (n: number) => 24 + n * COLUNA;

const FLUXO: BlocoDoCanvas[] = [
  { id: "inicio", tipo: "inicio", titulo: "Pedido recebido", x: col(0), y: 96, itens: ["Formulário do site", "Importação"], saidas: [{ id: "s", rotulo: "Quando chegar", para: "conferir" }], contagem: { sucessos: 128, alertas: 0, erros: 0 } },
  { id: "conferir", tipo: "passo", titulo: "Conferir os dados", x: col(1), y: 24, itens: ["Validar o e-mail", "Buscar duplicados"], saidas: [{ id: "ok", rotulo: "Conferido", para: "decidir" }, { id: "erro", rotulo: "Dado inválido", tom: "erro", para: "avisar" }], contagem: { sucessos: 121, alertas: 0, erros: 7 } },
  { id: "decidir", tipo: "decisao", titulo: "Vale mais de R$ 10 mil?", x: col(2), y: 24, itens: ["Valor acima de R$ 10 mil"], saidas: [{ id: "sim", rotulo: "Sim", para: "fim" }, { id: "nao", rotulo: "Não", tom: "alerta" }], contagem: { sucessos: 121, alertas: 40, erros: 0 } },
  { id: "avisar", tipo: "passo", titulo: "Avisar quem cadastrou", x: col(2), y: 336, itens: ["Enviar e-mail", "Marcar para revisão"], saidas: [{ id: "depois", rotulo: "Depois do aviso" }], contagem: { sucessos: 7, alertas: 0, erros: 0 } },
  { id: "fim", tipo: "fim", titulo: "Encaminhado à equipe", x: col(3), y: 24, itens: ["Atribuir ao time de contas-chave"], saidas: [], contagem: { sucessos: 81, alertas: 0, erros: 0 } },
];

const codigo = `const canvas = useRef<CanvasRef>(null);
const [blocos, setBlocos] = useState<BlocoDoCanvas[]>(FLUXO);
const [selecionados, setSelecionados] = useState<string[]>([]);

<Canvas
  ref={canvas}
  blocos={blocos}
  tipos={{ inicio: { rotulo: "Início", icone: Play, inicio: true }, passo: { rotulo: "Passo", icone: Lightning } }}
  opcoesParaAdicionar={[{ valor: "passo", rotulo: "Passo" }]}
  selecionados={selecionados}
  aoSelecionar={setSelecionados}
  aoMover={(posicoes) => setBlocos((bs) => bs.map((b) => (posicoes[b.id] ? { ...b, ...posicoes[b.id] } : b)))}
  aoLigar={(bloco, saida, para) =>
    setBlocos((bs) => bs.map((b) => (b.id === bloco ? { ...b, saidas: b.saidas.map((s) => (s.id === saida ? { ...s, para } : s)) } : b)))
  }
  aoAdicionar={(tipo, x, y) => setBlocos((bs) => [...bs, { id: \`\${tipo}-\${Date.now()}\`, tipo, titulo: "Novo passo", x, y, itens: [], saidas: [{ id: "s", rotulo: "Depois" }] }])}
  aoRemover={(ids) => setBlocos((bs) => bs.filter((b) => !ids.includes(b.id)))}
  aoDuplicar={(ids) => duplicar(ids)}
  aoDesfazer={historico.desfazer}
  aoRefazer={historico.refazer}
  podeDesfazer={historico.podeDesfazer}
  podeRefazer={historico.podeRefazer}
  rotulos={{ canvas: "Fluxo do pedido" }}
/>`;

function Exemplo() {
  const canvas = useRef<CanvasRef>(null);
  const [blocos, setBlocos] = useState<BlocoDoCanvas[]>(FLUXO);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  // o histórico fica na tela: aqui, uma pilha simples de estados anteriores
  const [passado, setPassado] = useState<BlocoDoCanvas[][]>([]);
  const [futuro, setFuturo] = useState<BlocoDoCanvas[][]>([]);

  function mudar(proximo: (bs: BlocoDoCanvas[]) => BlocoDoCanvas[]) {
    setBlocos((atual) => {
      setPassado((p) => [...p.slice(-30), atual]);
      setFuturo([]);
      return proximo(atual);
    });
  }
  function desfazer() {
    const anterior = passado[passado.length - 1];
    if (!anterior) return;
    setPassado((p) => p.slice(0, -1));
    setFuturo((f) => [...f, blocos]);
    setBlocos(anterior);
  }
  function refazer() {
    const proximo = futuro[futuro.length - 1];
    if (!proximo) return;
    setFuturo((f) => f.slice(0, -1));
    setPassado((p) => [...p, blocos]);
    setBlocos(proximo);
  }

  function adicionar(tipo: Tipo, x: number, y: number, ligar?: { bloco: string; saida: string }) {
    const id = `${tipo}-${Date.now()}`;
    const novo: BlocoDoCanvas = {
      id,
      tipo,
      titulo: `${TIPOS[tipo].rotulo} novo`,
      x,
      y,
      itens: [],
      saidas: tipo === "fim" ? [] : tipo === "decisao" ? [{ id: "sim", rotulo: "Sim" }, { id: "nao", rotulo: "Não", tom: "alerta" }] : [{ id: "s", rotulo: "Depois" }],
    };
    mudar((bs) => [...bs.map((b) => (ligar && b.id === ligar.bloco ? { ...b, saidas: b.saidas.map((s) => (s.id === ligar.saida ? { ...s, para: id } : s)) } : b)), novo]);
    setSelecionados([id]);
  }

  function adicionarNoMeio() {
    const c = canvas.current?.centro() ?? { x: 24, y: 24 };
    adicionar("passo", Math.round((c.x - LARGURA_DO_BLOCO / 2) / 8) * 8, Math.round((c.y - 80) / 8) * 8);
  }

  return (
    <div className="flex h-[560px] flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-body-md text-muted-foreground">
          {selecionados.length === 0 ? "Nada marcado. Arraste o fundo, role para o zoom, clique num bloco." : selecionados.length === 1 ? `Marcado: ${blocos.find((b) => b.id === selecionados[0])?.titulo ?? ""}` : `${selecionados.length} blocos marcados`}
        </p>
        <Button variant="tertiary" size="sm" onClick={adicionarNoMeio}>
          <Lightning size={16} weight="regular" aria-hidden="true" />
          Adicionar passo
        </Button>
      </div>
      <Canvas
        ref={canvas}
        blocos={blocos}
        tipos={TIPOS}
        opcoesParaAdicionar={PARA_ADICIONAR}
        selecionados={selecionados}
        aoSelecionar={setSelecionados}
        aoMover={(posicoes) => mudar((bs) => bs.map((b) => (posicoes[b.id] ? { ...b, ...posicoes[b.id] } : b)))}
        aoLigar={(bloco, saida, para) => mudar((bs) => bs.map((b) => (b.id === bloco ? { ...b, saidas: b.saidas.map((s) => (s.id === saida ? { ...s, para } : s)) } : b)))}
        aoAdicionar={(tipo, x, y, ligar) => adicionar(tipo as Tipo, x, y, ligar)}
        aoRemover={(ids) => {
          const alvos = ids.filter((id) => blocos.find((b) => b.id === id)?.tipo !== "inicio");
          if (!alvos.length) return;
          mudar((bs) => bs.filter((b) => !alvos.includes(b.id)).map((b) => ({ ...b, saidas: b.saidas.map((s) => (s.para && alvos.includes(s.para) ? { ...s, para: undefined } : s)) })));
          setSelecionados([]);
        }}
        aoDuplicar={(ids) => {
          const originais = blocos.filter((b) => ids.includes(b.id) && b.tipo !== "inicio");
          if (!originais.length) return;
          const agora = Date.now();
          const copias = originais.map((b, i) => ({ ...b, id: `${b.tipo}-${agora}-${i}`, titulo: `${b.titulo} (cópia)`, x: b.x + 32, y: b.y + 32, contagem: undefined, saidas: b.saidas.map((s) => ({ ...s, para: undefined })) }));
          mudar((bs) => [...bs, ...copias]);
          setSelecionados(copias.map((c) => c.id));
        }}
        aoDesfazer={desfazer}
        aoRefazer={refazer}
        podeDesfazer={passado.length > 0}
        podeRefazer={futuro.length > 0}
        rotulos={{ canvas: "Fluxo do pedido" }}
        className="min-h-0 flex-1"
      />
    </div>
  );
}

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Canvas"
      descricao="O editor visual de fluxo: blocos de 264px numa folha sem tamanho, ligados por curvas. Arrastar o fundo move a tela, rolar ou pinçar dá zoom de 25% a 200%, arrastar da bolinha de uma saída liga os blocos; com marcar vários, menu no botão direito, desfazer, enquadrar, organizar e mapa."
      novidade="2026-10-07"
      secoes={["O fluxo", "Na tela", "Como funciona", "Quando usar"]}
    >
      <Secao
        titulo="O fluxo"
        spec="5 blocos · zoom 0,25–2 · grade de 8"
        descricao="Cinco blocos genéricos: início, dois passos, uma decisão e o fim. Arraste um bloco; puxe da bolinha de 'Não' até o passo de baixo para ligar; clique numa ligação e aperte Delete; dois cliques no fundo adicionam um bloco ali; Ctrl ou ⌘ + Z desfaz. A barra embaixo tem zoom, enquadrar, organizar, mapa e os atalhos."
        codigo={codigo}
        novidade="2026-10-07"
        semSeletorDeFundo
        nota={
          <>
            O canvas não sabe o que é uma automação: recebe <Chip>blocos</Chip> (id, tipo, título, posição, itens e
            saídas), <Chip>tipos</Chip> (o ícone e o rótulo de cada tipo; <Chip>inicio</Chip> marca o começo, que não se
            remove) e <Chip>opcoesParaAdicionar</Chip>. Cada gesto vira um pedido para a tela — <Chip>aoMover</Chip>,{" "}
            <Chip>aoLigar</Chip>, <Chip>aoAdicionar</Chip> — e é a tela que guarda o fluxo e o histórico de desfazer. Um{" "}
            <Chip>corpo</Chip> pronto no bloco substitui a lista de itens quando o tipo pede um resumo próprio (a mensagem
            com o canal, a espera com o tempo).
          </>
        }
      >
        <Exemplo />
      </Secao>

      <Secao
        titulo="Na tela"
        spec="Automações · painel do bloco ao lado"
        descricao="No protótipo, o canvas é a tela de Automações: o bloco marcado abre num painel lateral para editar nome, conteúdo e o destino de cada saída, e o Header traz Adicionar bloco, Salvar e o interruptor de ativa."
        semSeletorDeFundo
      >
        <p className="text-body-md text-muted-foreground">
          <Link href="/prototipo?tela=automacoes" className="text-primary underline-offset-2 hover:underline">
            Abrir a tela de Automações no protótipo
          </Link>
          . A tela passa os seis tipos da automação (gatilho, mensagem, espera, condição, ação, randomizador) e monta o
          corpo da mensagem e da espera; o resto é o componente.
        </p>
        <Legenda>
          O bloco é um cartão com traço, como o do Quadro; o conector é um traço em <Chip>subtle-foreground</Chip>, e a cor só
          entra onde quer dizer algo: <Chip>warning</Chip> na saída de alerta, <Chip>destructive</Chip> na de erro.
        </Legenda>
      </Secao>

      <ComoFunciona>
        <p>
          Não há desenho no arquivo: o canvas nasceu na tela de Automações (2026-10-01) e virou peça em 2026-10-07, a
          pedido do cliente na reunião de 02/10. Não há biblioteca de grafo: a folha é uma translação e uma escala (
          <Chip>vista</Chip>), e o fundo pontilhado anda e escala junto. Os conectores não guardam geometria — são
          medidos na tela, da bolinha da saída até a entrada do destino, e remedidos quando algo muda.
        </p>
        <p>
          O que a pessoa conduz com a mão (arrasto, roda, pinça) segue o dedo, sem transição; o que ela pede por botão
          ou tecla (zoom, enquadrar, organizar) desliza com a duração <Chip>base</Chip> da escala de movimento. Os blocos
          assentam numa grade de 8 ao soltar. Com <Chip>prefers-reduced-motion</Chip> nada desliza.
        </p>
        <p>
          Todo texto vem de <Chip>rotulos</Chip> (fábrica <Chip>ROTULOS_DO_CANVAS</Chip>, em português): o nome da região,
          os botões da barra, o menu do botão direito e a lista de atalhos do cartão de ajuda.
        </p>
      </ComoFunciona>

      <Secao titulo="Quando usar" descricao="Canvas responde “por onde o fluxo passa”; o Quadro responde “em que etapa está”; a lista responde “quais”.">
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Use</span> para editar um fluxo com ramificações: automação, jornada,
            árvore de decisão do agente de IA.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para uma sequência sem ramificação: é uma lista ordenada,
            ou os passos de um formulário.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para mover registros entre estágios: é o Quadro.
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
