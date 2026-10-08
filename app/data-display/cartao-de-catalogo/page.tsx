"use client";

import Link from "next/link";
import { Copy, PencilSimple, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { CartaoDeCatalogo } from "@/components/ui/cartao-de-catalogo";
import { BotaoDeAcoes } from "@/components/ui/menu";
import { Tag } from "@/components/ui/tag";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { gradeDeCartoes } from "@/lib/campo";

/* Quatro agentes, como na tela de Agentes de IA: nome, o que fazem e as três
   métricas que se comparam. Um deles ainda sem score. */
const AGENTES = [
  { id: "a1", nome: "Qualificador de leads", descricao: "Faz as três perguntas de qualificação e marca o lead como quente, morno ou frio antes de passar para o time.", score: 92, modelo: "GPT-4o", ferramentas: 6 },
  { id: "a2", nome: "Agendador de reuniões", descricao: "Oferece os horários livres do vendedor e confirma a reunião no calendário.", score: 88, modelo: "GPT-4o mini", ferramentas: 4 },
  { id: "a3", nome: "Suporte nível 1", descricao: "Responde dúvidas comuns com a central de ajuda e abre um chamado quando não sabe.", score: 79, modelo: "Gemini Flash", ferramentas: 2 },
  { id: "a4", nome: "Resumo de conversas", descricao: "Ao fim do atendimento, grava o resumo no lead.", score: null, modelo: "Claude Haiku", ferramentas: 1 },
];

const codigo = `<ul className={gradeDeCartoes}>
  {agentes.map((a) => (
    <li key={a.id} className="min-w-0">
      <CartaoDeCatalogo
        nome={a.nome}
        descricao={a.descricao}
        acoes={
          <BotaoDeAcoes
            rotulo={\`Ações de \${a.nome}\`}
            itens={[
              { id: "editar", rotulo: "Editar", icone: PencilSimple, aoAtivar: () => editar(a) },
              { id: "excluir", rotulo: "Excluir", icone: Trash, separadorAntes: true, aoAtivar: () => excluir(a) },
            ]}
          />
        }
        metricas={[
          { rotulo: "Score", valor: a.score, titulo: a.score === null ? "Ainda sem score" : undefined },
          { rotulo: "Modelo", valor: <Tag>{a.modelo}</Tag>, cresce: true },
          { rotulo: "Ferramentas", valor: a.ferramentas },
        ]}
      />
    </li>
  ))}
</ul>`;

const codigoMetricas = `<CartaoDeCatalogo
  nome="Vazio"
  descricao="Sem score ainda e sem modelo escolhido."
  acoes={<BotaoDeAcoes rotulo="Ações de Vazio" itens={itens} />}
  vazio="n/d" // o que vai no lugar do valor vazio; padrão "—"
  metricas={[
    // número: heading-4 tabular, 22px de altura
    { rotulo: "Conversas", valor: 1284 },
    // texto curto: entra como número, no mesmo corpo
    { rotulo: "Idioma", valor: "pt-BR" },
    // Tag: a métrica cresce para a pílula não apertar as vizinhas
    { rotulo: "Situação", valor: <Tag status="success">Ativo</Tag>, cresce: true },
    // vazio: o traço apagado, com o porquê no title
    { rotulo: "Score", valor: null, titulo: "Ainda sem score" },
  ]}
/>`;

const codigoFoto = `// foto: entra no lugar das iniciais
<CartaoDeCatalogo nome="Esther Lima" descricao="Atendente humana." avatar={{ src: "/ds/atendente.png" }} acoes={<BotaoDeAcoes rotulo="Ações de Esther" itens={itens} />} />
// cor fixa: um dos catorze tons da Tag
<CartaoDeCatalogo nome="Reativação" descricao="Volta a falar com quem parou de responder." avatar={{ tom: "roxo" }} acoes={<BotaoDeAcoes rotulo="Ações de Reativação" itens={itens} />} />
// uma inicial só
<CartaoDeCatalogo nome="Suporte" descricao="Uma inicial só, na cor do nome." avatar={{ iniciais: "uma" }} acoes={<BotaoDeAcoes rotulo="Ações de Suporte" itens={itens} />} />`;

const codigoTextoLongo = `// O nome corta com reticências e a descrição em 2 linhas; o inteiro fica no title.
<CartaoDeCatalogo
  nome="Qualificador de leads do funil de eventos e parcerias institucionais"
  descricao="Faz as três perguntas de qualificação, consulta o histórico do contato no CRM, calcula a pontuação pelo porte da empresa e pela urgência declarada, e marca o lead como quente, morno ou frio antes de passar para o time comercial."
  metricas={[{ rotulo: "Modelo", valor: <Tag>Claude Sonnet 4.5 com busca na web</Tag>, cresce: true }, { rotulo: "Ferramentas", valor: 12 }]}
/>`;

const codigoNaTela = `// Agentes de IA: a grade de cartões; o menu leva editar, duplicar e excluir, e editar abre o modal
<ul className={gradeDeCartoes}>
  {agentes.map((a) => (
    <li key={a.id} className="min-w-0">
      <CartaoDeCatalogo
        nome={a.nome}
        descricao={a.descricao}
        acoes={
          <BotaoDeAcoes
            rotulo={\`Ações de \${a.nome}\`}
            itens={[
              { id: "editar", rotulo: "Editar", icone: PencilSimple, aoAtivar: () => abrirModal(a) },
              { id: "duplicar", rotulo: "Duplicar", icone: Copy, aoAtivar: () => duplicar(a) },
              { id: "excluir", rotulo: "Excluir", icone: Trash, separadorAntes: true, aoAtivar: () => confirmarExclusao(a) },
            ]}
          />
        }
        metricas={[
          { rotulo: "Score", valor: a.score, titulo: a.score === null ? "Ainda sem score" : undefined },
          { rotulo: "Modelo", valor: <Tag>{a.modelo}</Tag>, cresce: true },
          { rotulo: "Ferramentas", valor: a.ferramentas.length },
        ]}
      />
    </li>
  ))}
</ul>`;

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
  { nome: "Cartão", medida: "Card · p-3 · gap-3 · h-full", papel: "O Card do DS com recuo 12 e vão 12 — mais enxuto que o do dashboard (16). O h-full é o que iguala a altura na fileira da grade." },
  { nome: "Avatar", medida: "md · 40px · iniciais duas · tom auto", papel: "As duas iniciais no disco com a cor que o nome sorteia: a mesma pessoa tem a mesma cor em toda tela. Com src, a foto; com tom, a cor fixa. Decorativo (aria-hidden): o nome já está no título." },
  { nome: "Nome", medida: "h2 · heading-4 · truncate", papel: "Uma linha; corta com reticências e guarda o inteiro no title. É h2 para o leitor de tela navegar de cartão em cartão." },
  { nome: "Descrição", medida: "body-sm · muted-foreground · line-clamp-2", papel: "Até duas linhas; o inteiro no title. Opcional: sem ela, o cabeçalho é só o nome." },
  { nome: "Ações", medida: "BotaoDeAcoes · icon-sm · canto", papel: "O ⋮ que abre o Menu, com ícone em todo item e o foco de volta resolvido. É o único alvo clicável do cartão." },
  { nome: "Pé", medida: "dl · border-t · pt-3 · gap-4 · mt-auto", papel: "Um dl com uma coluna por métrica. O mt-auto empurra o pé para baixo: numa fileira de alturas diferentes, os números ficam alinhados." },
  { nome: "Métrica", medida: "dt caption · dd heading-4 tabular · 22px", papel: "O rótulo em caption e o valor em heading-4 tabular; com cresce, a coluna ocupa o que sobra (para uma Tag). Vazio: o traço em subtle-foreground, com o porquê no title." },
];

function Acoes({ nome }: { nome: string }) {
  return (
    <BotaoDeAcoes
      rotulo={`Ações de ${nome}`}
      itens={[
        { id: "editar", rotulo: "Editar", icone: PencilSimple, aoAtivar: () => {} },
        { id: "duplicar", rotulo: "Duplicar", icone: Copy, aoAtivar: () => {} },
        { id: "excluir", rotulo: "Excluir", icone: Trash, separadorAntes: true, aoAtivar: () => {} },
      ]}
    />
  );
}

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Cartão de catálogo"
      descricao="Um registro num catálogo em cartões: iniciais na cor do nome, nome, descrição de até 2 linhas, o menu de ações no canto e, embaixo do traço, 2 a 3 métricas que se comparam de um cartão para o outro. Recuo 12, vão 12."
      novidade="2026-10-07"
      secoes={["Na grade", "Métricas", "Foto e cor", "Sem métricas", "Texto longo", "Estados", "Anatomia", "Na tela", "Como funciona", "Quando usar"]}
    >
      <Secao
        titulo="Na grade"
        spec="gradeDeCartoes · 3 métricas · pé alinhado"
        descricao="Quatro agentes em cartões: a fileira tem a mesma altura e as métricas alinham no pé. O quarto ainda não tem score — o traço apagado diz por quê no title. O ⋮ abre o menu de ações, com ícone em todo item."
        codigo={codigo}
        novidade="2026-10-07"
        nota={
          <>
            O cartão não sabe o que é um agente: recebe <Chip>nome</Chip>, <Chip>descricao</Chip>, <Chip>acoes</Chip>{" "}
            (um <Chip>BotaoDeAcoes</Chip>) e <Chip>metricas</Chip> — <Chip>rotulo</Chip> e <Chip>valor</Chip>, que pode
            ser número, <Chip>Tag</Chip> ou <Chip>null</Chip>. A métrica com <Chip>cresce</Chip> ocupa o que sobra;
            as outras ficam no tamanho do conteúdo. O <Chip>mt-auto</Chip> do pé é o que alinha os números entre
            cartões de alturas diferentes.
          </>
        }
      >
        <ul className={gradeDeCartoes}>
          {AGENTES.map((a) => (
            <li key={a.id} className="min-w-0">
              <CartaoDeCatalogo
                nome={a.nome}
                descricao={a.descricao}
                acoes={<Acoes nome={a.nome} />}
                metricas={[
                  { rotulo: "Score", valor: a.score, titulo: a.score === null ? "Ainda sem score" : undefined },
                  { rotulo: "Modelo", valor: <Tag title={a.modelo}>{a.modelo}</Tag>, cresce: true },
                  { rotulo: "Ferramentas", valor: a.ferramentas },
                ]}
              />
            </li>
          ))}
        </ul>
      </Secao>

      <Secao
        titulo="Métricas"
        spec="número · Tag · texto · vazio · cresce"
        descricao="O que vai no valor de uma métrica. Número e texto curto entram em heading-4 tabular, 22px de altura. Uma Tag pede cresce, para a coluna ocupar o que sobra e a pílula não apertar as vizinhas. Vazio (null) é o traço apagado em subtle-foreground, com o porquê no title — e o traço pode ser outro texto, por vazio."
        codigo={codigoMetricas}
        novidade="2026-10-08"
        nota={
          <>
            Duas ou três métricas: o pé é para o que se compara de um cartão para o outro, não para a ficha inteira. A
            ordem importa — a mesma em todo cartão da grade, senão o olho não compara. Só uma métrica com{" "}
            <Chip>cresce</Chip>; duas crescendo dividem o que sobra e nada fica no tamanho do conteúdo.
          </>
        }
      >
        <ul className={gradeDeCartoes}>
          <li className="min-w-0">
            <CartaoDeCatalogo
              nome="Números e texto"
              descricao="Conversas e tempo médio como número; o idioma como texto curto."
              acoes={<Acoes nome="Números e texto" />}
              metricas={[
                { rotulo: "Conversas", valor: 1284 },
                { rotulo: "Tempo médio", valor: "2m 40s" },
                { rotulo: "Idioma", valor: "pt-BR", cresce: true },
              ]}
            />
          </li>
          <li className="min-w-0">
            <CartaoDeCatalogo
              nome="Com Tag"
              descricao="A métrica da Tag cresce; as outras ficam no tamanho do conteúdo."
              acoes={<Acoes nome="Com Tag" />}
              metricas={[
                { rotulo: "Score", valor: 88 },
                { rotulo: "Situação", valor: <Tag status="success">Ativo</Tag>, cresce: true },
                { rotulo: "Ferramentas", valor: 4 },
              ]}
            />
          </li>
          <li className="min-w-0">
            <CartaoDeCatalogo
              nome="Vazio"
              descricao="Sem score ainda e sem modelo escolhido: traço apagado e o porquê no title."
              acoes={<Acoes nome="Vazio" />}
              vazio="n/d"
              metricas={[
                { rotulo: "Score", valor: null, titulo: "Ainda sem score" },
                { rotulo: "Modelo", valor: null, titulo: "Nenhum modelo escolhido", cresce: true },
                { rotulo: "Ferramentas", valor: 0 },
              ]}
            />
          </li>
        </ul>
        <Legenda>
          Passe o cursor nos traços do terceiro cartão: o <Chip>title</Chip> diz por que está vazio. <Chip>vazio</Chip>{" "}
          trocou o traço por &quot;n/d&quot;. Zero é um número, não vazio.
        </Legenda>
      </Secao>

      <Secao
        titulo="Foto e cor"
        spec="avatar.src · avatar.tom · avatar.iniciais"
        descricao="Sem nada, as duas iniciais na cor que o nome sorteia — a mesma pessoa tem a mesma cor na lista, no quadro e aqui. Com src, a foto no lugar; com tom, uma cor fixa entre os catorze tons da Tag; iniciais escolhe uma ou duas letras."
        codigo={codigoFoto}
        novidade="2026-10-08"
      >
        <ul className={gradeDeCartoes}>
          <li className="min-w-0">
            <CartaoDeCatalogo nome="Esther Lima" descricao="Atendente humana que o agente aciona quando não sabe responder." avatar={{ src: "/ds/atendente.png" }} acoes={<Acoes nome="Esther Lima" />} metricas={[{ rotulo: "Conversas", valor: 312 }, { rotulo: "Canal", valor: <Tag>WhatsApp</Tag>, cresce: true }]} />
          </li>
          <li className="min-w-0">
            <CartaoDeCatalogo nome="Reativação" descricao="Volta a falar com quem parou de responder há mais de 30 dias." avatar={{ tom: "roxo" }} acoes={<Acoes nome="Reativação" />} metricas={[{ rotulo: "Score", valor: 71 }, { rotulo: "Modelo", valor: <Tag>GPT-4o mini</Tag>, cresce: true }]} />
          </li>
          <li className="min-w-0">
            <CartaoDeCatalogo nome="Suporte" descricao="Uma inicial só, na cor do nome." avatar={{ iniciais: "uma" }} acoes={<Acoes nome="Suporte" />} metricas={[{ rotulo: "Score", valor: 79 }, { rotulo: "Modelo", valor: <Tag>Gemini Flash</Tag>, cresce: true }]} />
          </li>
        </ul>
        <Legenda>
          O Avatar é decorativo (<Chip>aria-hidden</Chip>): o nome já está no <Chip>h2</Chip>. A cor fixa é para
          catálogo sem pessoa — uma automação, um produto — em que &quot;a cor do nome&quot; não diz nada.
        </Legenda>
      </Secao>

      <Secao
        titulo="Sem métricas"
        spec="nome + descrição · sem pé"
        descricao="Quando só o nome e a descrição importam, o cartão fecha logo abaixo do texto. A descrição corta em 2 linhas e guarda o texto inteiro no title."
        codigo={`<CartaoDeCatalogo
  nome="Boas-vindas pelo WhatsApp"
  descricao="Responde o primeiro contato em até um minuto e pergunta o que a pessoa precisa."
  acoes={<BotaoDeAcoes rotulo="Ações de Boas-vindas" itens={itens} />}
/>`}
      >
        <ul className={gradeDeCartoes}>
          <li className="min-w-0">
            <CartaoDeCatalogo
              nome="Boas-vindas pelo WhatsApp"
              descricao="Responde o primeiro contato em até um minuto e pergunta o que a pessoa precisa, antes de qualquer atendente entrar."
              acoes={<Acoes nome="Boas-vindas pelo WhatsApp" />}
            />
          </li>
          <li className="min-w-0">
            <CartaoDeCatalogo nome="Lembrete de proposta" descricao="Três dias depois da proposta sem resposta, manda um lembrete curto." acoes={<Acoes nome="Lembrete de proposta" />} />
          </li>
          <li className="min-w-0">
            <CartaoDeCatalogo nome="Reativação" avatar={{ tom: "roxo" }} acoes={<Acoes nome="Reativação" />} />
          </li>
        </ul>
        <Legenda>
          O terceiro cartão não tem descrição nem métricas: só o cabeçalho. Sem <Chip>metricas</Chip> (ou com a lista
          vazia), o traço do pé não aparece.
        </Legenda>
      </Secao>

      <Secao
        titulo="Texto longo"
        spec="truncate · line-clamp-2 · title"
        descricao="Nome que não cabe corta com reticências; descrição corta na segunda linha; a Tag longa corta por dentro. Nos três, o texto inteiro fica no title — a regra da casa: truncou, tem tooltip. A grade de 220 por coluna no espanhol e no português, que são 20 a 30% maiores que o inglês, continua fechando."
        codigo={codigoTextoLongo}
        novidade="2026-10-08"
      >
        <ul className={gradeDeCartoes}>
          <li className="min-w-0">
            <CartaoDeCatalogo
              nome="Qualificador de leads do funil de eventos e parcerias institucionais"
              descricao="Faz as três perguntas de qualificação, consulta o histórico do contato no CRM, calcula a pontuação pelo porte da empresa e pela urgência declarada, e marca o lead como quente, morno ou frio antes de passar para o time comercial."
              acoes={<Acoes nome="Qualificador de leads do funil de eventos" />}
              metricas={[
                { rotulo: "Score", valor: 92 },
                { rotulo: "Modelo", valor: <Tag title="Claude Sonnet 4.5 com busca na web">Claude Sonnet 4.5 com busca na web</Tag>, cresce: true },
                { rotulo: "Ferramentas", valor: 12 },
              ]}
            />
          </li>
          <li className="min-w-0">
            <CartaoDeCatalogo
              nome="Calificador de clientes potenciales"
              descricao="Hace las tres preguntas de calificación y marca al cliente potencial como caliente, tibio o frío antes de pasarlo al equipo comercial."
              acoes={<Acoes nome="Calificador de clientes potenciales" />}
              metricas={[
                { rotulo: "Puntuación", valor: 92 },
                { rotulo: "Modelo", valor: <Tag>GPT-4o</Tag>, cresce: true },
                { rotulo: "Herramientas", valor: 6 },
              ]}
            />
          </li>
          <li className="min-w-0">
            <CartaoDeCatalogo
              nome="Curto"
              descricao="Uma linha."
              acoes={<Acoes nome="Curto" />}
              metricas={[
                { rotulo: "Score", valor: 65 },
                { rotulo: "Modelo", valor: <Tag>GPT-4o</Tag>, cresce: true },
                { rotulo: "Ferramentas", valor: 1 },
              ]}
            />
          </li>
        </ul>
        <Legenda>
          O terceiro cartão é curto de propósito: a fileira tem a altura do mais alto e o pé dele desce junto (
          <Chip>mt-auto</Chip>), para os números ficarem na mesma linha.
        </Legenda>
      </Secao>

      <Secao
        titulo="Estados"
        spec="repouso · hover e foco no ⋮ · menu aberto · vazio"
        descricao="O cartão não é clicável — o estado é do botão de ações. Está tudo vivo nas seções acima: passe o cursor no ⋮, dê Tab até ele, abra o menu."
        novidade="2026-10-08"
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="repouso">
                <Chip>card</Chip> com traço <Chip>border</Chip>, raio <Chip>lg</Chip>; sem sombra, sem hover
              </Item>
              <Item mono="hover no ⋮">o Button ghost acende em <Chip>accent</Chip>; o cartão não muda</Item>
              <Item mono="focus-visible">o anel de 2px no ⋮ (D6); o cartão não recebe foco</Item>
              <Item mono="menu aberto">o Menu do DS abaixo do ⋮, com Escape e o foco de volta no botão</Item>
              <Item mono="métrica vazia">o traço em <Chip>subtle-foreground</Chip>, com o porquê no <Chip>title</Chip></Item>
              <Item mono="sem métricas">o cartão fecha abaixo do texto, sem o traço do pé</Item>
            </ul>
            <p className="mt-2.5">
              Não há cartão selecionado nem cartão desabilitado: catálogo não se seleciona em massa, e um item
              desativado aparece como uma Tag na métrica (&quot;Situação: Pausado&quot;), não como cartão apagado.
              Ausência é decisão.
            </p>
          </>
        }
      >
        <ul className={gradeDeCartoes}>
          <li className="min-w-0">
            <CartaoDeCatalogo
              nome="Agendador de reuniões"
              descricao="Oferece os horários livres do vendedor e confirma a reunião no calendário."
              acoes={<Acoes nome="Agendador de reuniões" />}
              metricas={[
                { rotulo: "Score", valor: 88 },
                { rotulo: "Situação", valor: <Tag status="success">Ativo</Tag>, cresce: true },
                { rotulo: "Ferramentas", valor: 4 },
              ]}
            />
          </li>
          <li className="min-w-0">
            <CartaoDeCatalogo
              nome="Resumo de conversas"
              descricao="Ao fim do atendimento, grava o resumo no lead."
              acoes={<Acoes nome="Resumo de conversas" />}
              metricas={[
                { rotulo: "Score", valor: null, titulo: "Ainda sem score" },
                { rotulo: "Situação", valor: <Tag>Pausado</Tag>, cresce: true },
                { rotulo: "Ferramentas", valor: 1 },
              ]}
            />
          </li>
        </ul>
      </Secao>

      <Secao titulo="Anatomia" spec="7 partes" semCaixa novidade="2026-10-08">
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
        spec="/prototipo?tela=agentes"
        descricao="Na tela de Agentes de IA, cada agente é um cartão deste na gradeDeCartoes; o ⋮ leva editar, duplicar e excluir, e editar abre o modal com o formulário do agente. As bases de conhecimento e os servidores MCP, nas abas ao lado, são a Table — não cartões."
        codigo={codigoNaTela}
        semSeletorDeFundo
      >
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <p className="chrome-prose text-muted-foreground">
            A tela embrulha o cartão num <Chip>CartaoDeAgente</Chip> que sabe o que é um agente: monta as três métricas
            e o menu. O componente do DS continua sem domínio.
          </p>
          <Button asChild variant="secondary">
            <Link href="/prototipo?tela=agentes">Abrir os Agentes de IA no protótipo</Link>
          </Button>
        </div>
      </Secao>

      <ComoFunciona>
        <p>
          Não há desenho no arquivo: o cartão nasceu na tela de Agentes de IA (2026-10-02) e virou peça em 2026-10-07,
          quando o cliente pediu que tudo o que o protótipo mostra fosse componente do design system — para a
          geração de telas novas reusar a peça em vez de montar outra. É o <Chip>Card</Chip> com recuo 12 e vão 12
          (mais enxuto que o do dashboard), o <Chip>Avatar</Chip> md com <Chip>tom=&quot;auto&quot;</Chip> e um{" "}
          <Chip>&lt;dl&gt;</Chip> no pé.
        </p>
        <p>
          O cartão não é clicável: as ações ficam no <Chip>BotaoDeAcoes</Chip> (o ⋮ que abre um <Chip>Menu</Chip>, com o
          foco de volta resolvido), e o hover é do botão. O nome é <Chip>&lt;h2&gt;</Chip> e cada métrica um par{" "}
          <Chip>dt</Chip>/<Chip>dd</Chip>: o leitor de tela lê &quot;Score, 88&quot;.
        </p>
        <p>
          A armadilha é a grade: o cartão tem <Chip>h-full</Chip> e o pé tem <Chip>mt-auto</Chip>, mas quem iguala a
          altura da fileira é o <Chip>gradeDeCartoes</Chip> (grid com <Chip>items-stretch</Chip>). Num{" "}
          <Chip>flex-wrap</Chip> ou numa lista sem grid, os pés desalinham. A outra: uma Tag numa métrica sem{" "}
          <Chip>cresce</Chip> estica a coluna e aperta as vizinhas.
        </p>
      </ComoFunciona>

      <Secao titulo="Quando usar" descricao="Catálogo comparável em cartões; a lista densa é a Table, o número em destaque é o KpiCard.">
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Use</span> para um catálogo em que cada item tem nome, descrição e 2 a 3
            números que se comparam: agentes de IA, modelos de mensagem, produtos.
          </li>
          <li>
            <span className="text-foreground">Use</span> <Chip>cresce</Chip> na métrica que leva uma Tag, e{" "}
            <Chip>titulo</Chip> em toda métrica vazia: o traço sem porquê é dúvida.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para muitos registros com várias colunas: é a Table
            densa, com ícone por coluna.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para o cartão do funil, que se arrasta: é o cartão do
            Quadro.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para um número só em destaque: é o KpiCard.
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
