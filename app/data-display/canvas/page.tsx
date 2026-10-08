"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Flag, GitBranch, Lightning, Play } from "@phosphor-icons/react";
import { Canvas, IconeDoBloco, LARGURA_DO_BLOCO, ROTULOS_DO_CANVAS, type BlocoDoCanvas, type CanvasRef, type RotulosDoCanvas, type TipoDoCanvas } from "@/components/ui/canvas";
import { Button } from "@/components/ui/button";
import { IconeDeMarca } from "@/components/ui/icone-de-marca";
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

/* Três blocos para mostrar o que um bloco pode ter: só itens; um corpo
   próprio; saídas com tom. */
const BLOCOS: BlocoDoCanvas[] = [
  { id: "b1", tipo: "inicio", titulo: "Com itens", x: col(0), y: 24, itens: ["Cada item vira uma linha", "Em muted, com raio"], saidas: [{ id: "s", rotulo: "Uma saída", para: "b2" }], contagem: { sucessos: 42, alertas: 0, erros: 0 } },
  {
    id: "b2",
    tipo: "passo",
    titulo: "Com corpo",
    x: col(1),
    y: 24,
    itens: [],
    corpo: (
      <div className="flex flex-col gap-1.5 px-3 pb-2.5">
        <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
          <IconeDeMarca marca="whatsapp" tamanho={12} />
          WhatsApp
        </p>
        <p className="rounded-md bg-background px-2 py-1.5 text-body-md text-foreground">Oi, {"{{nome}}"}! Posso ajudar a agendar?</p>
      </div>
    ),
    saidas: [{ id: "ok", rotulo: "Respondeu", para: "b3" }, { id: "nao", rotulo: "Não respondeu", tom: "alerta" }, { id: "erro", rotulo: "Erro no envio", tom: "erro" }],
    contagem: { sucessos: 38, alertas: 3, erros: 1 },
  },
  { id: "b3", tipo: "fim", titulo: "Sem saída", x: col(2), y: 24, itens: ["O fim do fluxo não tem saída"], saidas: [], contagem: { sucessos: 38, alertas: 0, erros: 0 } },
];

const ROTULOS_ES: Partial<RotulosDoCanvas> = {
  canvas: "Flujo",
  aproximar: "Acercar (+)",
  afastar: "Alejar (−)",
  ajustar: "Ver todo el flujo (1)",
  organizar: "Ordenar los bloques",
  desfazer: "Deshacer (Ctrl o ⌘ + Z)",
  refazer: "Rehacer (Ctrl o ⌘ + Shift + Z)",
  mapa: "Mapa del flujo",
  ajuda: "Gestos y atajos",
  sucessos: "Éxitos",
  alertas: "Alertas",
  erros: "Errores",
  adicionarBloco: "Añadir bloque",
  buscarBloco: "Buscar bloque",
  nenhumBloco: "Ningún bloque encontrado",
  adicionarAqui: "Añadir bloque aquí",
  selecionarTudo: "Seleccionar todo",
  duplicar: "Duplicar",
  desligar: "Desconectar las salidas",
  remover: "Eliminar",
  removerLigacao: "Eliminar la conexión",
  maisAcoes: "Acciones",
  atalhos: [
    { gesto: "Arrastrar el fondo", efeito: "mueve la pantalla" },
    { gesto: "Rueda o pellizco", efeito: "acerca y aleja" },
    { gesto: "Arrastrar un bloque", efeito: "lo cambia de lugar" },
    { gesto: "Arrastrar desde el punto de una salida", efeito: "conecta con otro bloque" },
  ],
};

/** Um item de lista com a chave à esquerda, como nas páginas do Button e do Input. */
function Item({ mono, children }: { mono: string; children: React.ReactNode }) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-2">
      <code className="w-52 shrink-0 font-mono chrome-meta text-foreground">{mono}</code>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

type Parte = { nome: string; medida: string; papel: string };

const anatomia: Parte[] = [
  { nome: "Janela", medida: "bg-muted · pontilhado de 24 · overflow-hidden", papel: "A região (role=application, nomeada por rotulos.canvas) que recebe os gestos. O fundo pontilhado em subtle-foreground anda e escala com a vista; muito afastado, dobra o vão para não virar ruído." },
  { nome: "Folha", medida: "translate + scale · sem tamanho", papel: "Uma translação e uma escala (vista): a folha não tem tamanho. Antes do primeiro enquadramento fica invisível, para não piscar fora do lugar." },
  { nome: "Bloco", medida: "264px · bg-card · border · rounded-lg", papel: "O cartão com traço, como o do Quadro: cabeçalho com o ícone do tipo num quadrado de 28 (accent + primary) e o título; o corpo (itens ou corpo); as saídas; o pé com a contagem." },
  { nome: "Entrada e saídas", medida: "bolinha de 8 · subtle-foreground", papel: "A entrada à esquerda do cabeçalho (o início não tem); uma saída por linha à direita, com o rótulo e a bolinha. A bolinha é de onde se arrasta para ligar; a cor é a do tom: alerta (warning) ou erro (destructive)." },
  { nome: "Conector", medida: "curva · 2px · subtle-foreground", papel: "Da bolinha da saída à entrada do destino: sai e chega na horizontal; quando o destino fica para trás, o laço abre mais. Marcado, engrossa em primary e ganha o botão de remover no meio." },
  { nome: "Barra", medida: "card · rounded-md · shadow · canto inferior esquerdo", papel: "Desfazer, refazer, zoom (− · % · +), enquadrar, organizar, mapa e ajuda: todos Button ghost de ícone, com nome e atalho no tooltip." },
  { nome: "Minimapa", medida: "168×112 · canto inferior direito", papel: "Os blocos como retângulos e a janela como um quadro; clicar leva a vista até ali. Liga e desliga pelo botão da barra." },
  { nome: "Menu de contexto", medida: "Menu do DS · botão direito", papel: "Adicionar aqui, selecionar tudo, duplicar, desligar as saídas, remover — os mesmos itens do teclado. Adicionar abre o ComboboxPainel com busca." },
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

const codigoBlocos = `import { type BlocoDoCanvas } from "@/components/ui/canvas";

const blocos: BlocoDoCanvas[] = [
  // só itens: cada um vira uma linha em muted
  { id: "b1", tipo: "inicio", titulo: "Com itens", x: 24, y: 24, itens: ["Cada item vira uma linha"], saidas: [{ id: "s", rotulo: "Uma saída", para: "b2" }], contagem: { sucessos: 42, alertas: 0, erros: 0 } },
  // corpo próprio: o resumo que o tipo pede, no lugar da lista
  {
    id: "b2", tipo: "passo", titulo: "Com corpo", x: 360, y: 24, itens: [],
    corpo: <p className="px-3 pb-2.5 text-body-md text-foreground">Oi, {"{{nome}}"}! Posso ajudar a agendar?</p>,
    // tom: alerta (warning) e erro (destructive) na bolinha e no conector
    saidas: [{ id: "ok", rotulo: "Respondeu", para: "b3" }, { id: "nao", rotulo: "Não respondeu", tom: "alerta" }, { id: "erro", rotulo: "Erro no envio", tom: "erro" }],
  },
  // o fim não tem saída
  { id: "b3", tipo: "fim", titulo: "Sem saída", x: 696, y: 24, itens: ["O fim do fluxo não tem saída"], saidas: [] },
];`;

const codigoRotulos = `<Canvas
  blocos={blocos}
  tipos={tipos}
  opcoesParaAdicionar={opcoes}
  selecionados={selecionados}
  aoSelecionar={setSelecionados}
  aoMover={mover}
  aoLigar={ligar}
  aoAdicionar={adicionar}
  aoRemover={remover}
  aoDuplicar={duplicar}
  aoDesfazer={deshacer}
  aoRefazer={rehacer}
  podeDesfazer={puedeDeshacer}
  podeRefazer={puedeRehacer}
  rotulos={{
    canvas: "Flujo",
    aproximar: "Acercar (+)",
    afastar: "Alejar (−)",
    ajustar: "Ver todo el flujo (1)",
    organizar: "Ordenar los bloques",
    desfazer: "Deshacer (Ctrl o ⌘ + Z)",
    refazer: "Rehacer (Ctrl o ⌘ + Shift + Z)",
    mapa: "Mapa del flujo",
    ajuda: "Gestos y atajos",
    adicionarBloco: "Añadir bloque",
    buscarBloco: "Buscar bloque",
    nenhumBloco: "Ningún bloque encontrado",
    adicionarAqui: "Añadir bloque aquí",
    selecionarTudo: "Seleccionar todo",
    duplicar: "Duplicar",
    desligar: "Desconectar las salidas",
    remover: "Eliminar",
    removerLigacao: "Eliminar la conexión",
    maisAcoes: "Acciones",
    sucessos: "Éxitos",
    alertas: "Alertas",
    erros: "Errores",
    atalhos: [{ gesto: "Arrastrar el fondo", efeito: "mueve la pantalla" }],
  }}
/>`;

/** O canvas vivo: o histórico fica na página, numa pilha simples de estados anteriores. */
function Exemplo({ inicial = FLUXO, altura = "h-[560px]", rotulos, comBotao = true }: { inicial?: BlocoDoCanvas[]; altura?: string; rotulos?: Partial<RotulosDoCanvas>; comBotao?: boolean }) {
  const canvas = useRef<CanvasRef>(null);
  const [blocos, setBlocos] = useState<BlocoDoCanvas[]>(inicial);
  const [selecionados, setSelecionados] = useState<string[]>([]);
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
    <div className={`flex flex-col gap-3 ${altura}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-body-md text-muted-foreground">
          {selecionados.length === 0 ? "Nada marcado. Arraste o fundo, role para o zoom, clique num bloco." : selecionados.length === 1 ? `Marcado: ${blocos.find((b) => b.id === selecionados[0])?.titulo ?? ""}` : `${selecionados.length} blocos marcados`}
        </p>
        {comBotao ? (
          <Button variant="tertiary" size="sm" onClick={adicionarNoMeio}>
            <Lightning size={16} weight="regular" aria-hidden="true" />
            Adicionar passo
          </Button>
        ) : null}
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
        rotulos={{ canvas: "Fluxo do pedido", ...rotulos }}
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
      secoes={["O fluxo", "Blocos e saídas", "Gestos e atalhos", "Barra e mapa", "Em outro idioma", "Estados", "Anatomia", "Na tela", "Como funciona", "Quando usar"]}
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
            <Chip>aoLigar</Chip>, <Chip>aoAdicionar</Chip> — e é a tela que guarda o fluxo e o histórico de desfazer.
          </>
        }
      >
        <Exemplo />
      </Secao>

      <Secao
        titulo="Blocos e saídas"
        spec="itens · corpo · saída com tom · contagem"
        descricao="O que um bloco pode ter. O primeiro tem só itens: cada um vira uma linha em muted. O segundo tem um corpo próprio — o resumo que o tipo pede, montado pela tela — e três saídas: a do caminho feliz, uma de alerta (warning) e uma de erro (destructive). O terceiro é um fim: não tem saída. O pé de cada um é a contagem de execuções."
        codigo={codigoBlocos}
        novidade="2026-10-08"
        semSeletorDeFundo
        nota={
          <>
            O cabeçalho é o <Chip>IconeDoBloco</Chip>{" "}
            <span className="inline-flex align-middle">
              <IconeDoBloco icone={Lightning} className="size-5 [&>svg]:size-3" />
            </span>{" "}
            — quadrado de 28 em <Chip>accent</Chip> com o ícone em <Chip>primary</Chip> — e o rótulo do tipo em caption
            sobre o título em heading-4. A tela reusa o mesmo quadrado no painel do bloco. <Chip>corpo</Chip> substitui a
            lista de <Chip>itens</Chip>; a cor só entra na saída que diz algo.
          </>
        }
      >
        <Exemplo inicial={BLOCOS} altura="h-[400px]" comBotao={false} />
      </Secao>

      <Secao
        titulo="Gestos e atalhos"
        spec="mouse · toque · teclado"
        descricao="O que a pessoa conduz com a mão segue o dedo, sem transição; o que ela pede por tecla ou botão desliza. A lista inteira está no cartão de ajuda da barra (o último botão), em rotulos.atalhos."
        novidade="2026-10-08"
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="arrastar o fundo">move a tela; dois dedos no toque movem e dão zoom ao mesmo tempo</Item>
              <Item mono="roda · pinça">zoom no ponto do cursor, de 25% a 200%</Item>
              <Item mono="arrastar um bloco">muda de lugar; com vários marcados, vão juntos; assenta na grade de 8 ao soltar</Item>
              <Item mono="arrastar da bolinha">liga a saída a outro bloco; soltar no vazio abre a lista de adicionar já ligado</Item>
              <Item mono="clicar na ligação + Delete">desfaz a ligação; o botão no meio da curva faz o mesmo</Item>
              <Item mono="dois cliques no fundo">adiciona um bloco ali, pela lista com busca</Item>
              <Item mono="Shift + arrastar">marca vários pelo laço; Ctrl ou ⌘ + A marca todos; Esc desmarca</Item>
              <Item mono="botão direito">o menu de ações do DS: adicionar aqui, selecionar tudo, duplicar, desligar, remover</Item>
              <Item mono="setas">movem o bloco marcado na grade</Item>
              <Item mono="Ctrl/⌘ + D · Delete">duplica · remove</Item>
              <Item mono="Ctrl/⌘ + Z · Shift + Z">desfaz · refaz (a tela guarda o histórico)</Item>
              <Item mono="1 · + · −">enquadra · aproxima · afasta</Item>
            </ul>
          </>
        }
      >
        <Exemplo inicial={FLUXO.slice(0, 3)} altura="h-[380px]" comBotao={false} />
      </Secao>

      <Secao
        titulo="Barra e mapa"
        spec="8 botões · mapa 168×112"
        descricao="A barra no canto inferior esquerdo: desfazer e refazer (apagados quando não há o que fazer), afastar, o zoom atual, aproximar, enquadrar o fluxo inteiro, organizar os blocos em colunas a partir do início, o mapa e a ajuda. O minimapa no canto oposto mostra os blocos e a janela; clicar nele leva a vista até ali."
        novidade="2026-10-08"
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="desfazer · refazer">chamam <Chip>aoDesfazer</Chip> e <Chip>aoRefazer</Chip>; <Chip>podeDesfazer</Chip> e <Chip>podeRefazer</Chip> apagam os botões</Item>
              <Item mono="− · 88% · +">o zoom em degraus; o número é o atual, em tabular</Item>
              <Item mono="enquadrar">a vista desliza até caber o fluxo inteiro com 48px de folga (base · enter)</Item>
              <Item mono="organizar">colunas a 72px e linhas a 32px a partir do início; devolve as posições em <Chip>aoMover</Chip></Item>
              <Item mono="mapa">liga e desliga o minimapa</Item>
              <Item mono="ajuda">o cartão com a lista de gestos e atalhos</Item>
            </ul>
          </>
        }
      >
        <Exemplo inicial={FLUXO} altura="h-[420px]" comBotao={false} />
      </Secao>

      <Secao
        titulo="Em outro idioma"
        spec="rotulos · 23 textos · fábrica pt-BR"
        descricao="O nome da região, os botões da barra, o menu do botão direito, a lista de adicionar, o pé do bloco e o cartão de ajuda vêm de rotulos. Aqui em espanhol; o que a tela não passar sai da fábrica ROTULOS_DO_CANVAS."
        codigo={codigoRotulos}
        novidade="2026-10-08"
        semSeletorDeFundo
        nota={
          <>
            Os títulos e os itens dos blocos são conteúdo: a tela os escreve no idioma de quem lê. A fábrica tem{" "}
            {Object.keys(ROTULOS_DO_CANVAS).length} textos; <Chip>atalhos</Chip> é uma lista de gesto e efeito, para o
            cartão de ajuda.
          </>
        }
      >
        <Exemplo
          inicial={[
            { ...FLUXO[0], titulo: "Pedido recibido", itens: ["Formulario del sitio", "Importación"], saidas: [{ id: "s", rotulo: "Al llegar", para: "conferir" }] },
            { ...FLUXO[1], titulo: "Revisar los datos", itens: ["Validar el correo", "Buscar duplicados"], saidas: [{ id: "ok", rotulo: "Revisado" }, { id: "erro", rotulo: "Dato inválido", tom: "erro" }] },
          ]}
          altura="h-[360px]"
          comBotao={false}
          rotulos={ROTULOS_ES}
        />
      </Secao>

      <Secao
        titulo="Estados"
        spec="7 estados · nada simulado"
        descricao="Bloco marcado, em arrasto, ligando, conector marcado, o laço de marcar vários, o zoom pedido por botão e o fundo. Tudo está vivo nas seções acima."
        novidade="2026-10-08"
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="bloco marcado">contorno de 2px <Chip>primary</Chip>; os conectores dele ficam em destaque</Item>
              <Item mono="bloco em arrasto">segue o ponteiro sem transição; assenta na grade de 8 ao soltar</Item>
              <Item mono="ligando">curva provisória da bolinha até o ponteiro; o destino acende ao passar por cima</Item>
              <Item mono="conector marcado">engrossa em <Chip>primary</Chip> e mostra o botão de remover no meio; Delete remove</Item>
              <Item mono="laço">retângulo <Chip>accent/30</Chip> com traço <Chip>primary</Chip> ao arrastar com Shift</Item>
              <Item mono="zoom por botão ou tecla">a folha desliza em <Chip>base · enter</Chip>, com os conectores remedidos a cada quadro (ADR-068)</Item>
              <Item mono="fundo">
                <Chip>muted</Chip> pontilhado em <Chip>subtle-foreground</Chip>, que anda e escala com a vista (ADR-062)
              </Item>
              <Item mono="focus-visible">o anel por dentro na janela e por fora nos blocos e nos botões (D6)</Item>
            </ul>
            <p className="mt-2.5">
              Não há &quot;bloco com erro&quot;: a cor só entra na saída, e o pé do bloco diz quantas execuções deram
              erro. Ausência é decisão, não buraco a preencher.
            </p>
          </>
        }
      >
        <Exemplo inicial={BLOCOS} altura="h-[380px]" comBotao={false} />
      </Secao>

      <Secao titulo="Anatomia" spec="8 partes" semCaixa novidade="2026-10-08">
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
        spec="Automações · painel do bloco ao lado"
        descricao="No protótipo, o canvas é a tela de Automações: o bloco marcado abre num painel lateral para editar nome, conteúdo e o destino de cada saída, e o Header traz Adicionar bloco, Salvar e o interruptor de ativa."
        semSeletorDeFundo
      >
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <p className="chrome-prose text-muted-foreground">
            A tela passa os seis tipos da automação (gatilho, mensagem, espera, condição, ação, randomizador) e monta o
            corpo da mensagem e da espera; o resto é o componente.
          </p>
          <Button asChild variant="secondary">
            <Link href="/prototipo?tela=automacoes">Abrir as Automações no protótipo</Link>
          </Button>
        </div>
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
          A armadilha é o histórico: o canvas não guarda nada. Cada gesto vira um pedido (<Chip>aoMover</Chip>,{" "}
          <Chip>aoLigar</Chip>, <Chip>aoAdicionar</Chip>…), e é a tela que grava o fluxo e empilha o desfazer — por isso{" "}
          <Chip>podeDesfazer</Chip> e <Chip>podeRefazer</Chip> são props. A outra: o <Chip>corpo</Chip> de um bloco é
          montado pela tela a cada render; memorize-o (<Chip>useMemo</Chip>), senão os conectores são remedidos à toa.
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
            <span className="text-foreground">Use</span> <Chip>corpo</Chip> no bloco quando o tipo pede um resumo próprio
            no lugar da lista de itens — a mensagem com o canal, a espera com o tempo.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para uma sequência sem ramificação: é uma lista ordenada,
            ou os passos de um formulário.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para mover registros entre estágios: é o Quadro.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para desenhar livremente (formas, texto solto): o canvas
            só conhece blocos e ligações.
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
