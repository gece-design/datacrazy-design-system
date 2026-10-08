"use client";

import * as React from "react";
import Link from "next/link";
import { ChatCircleDots, Kanban, MagnifyingGlass, Plus, Robot, UsersThree } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { Input } from "@/components/ui/input";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { blocoDaTela } from "@/lib/estados";
import { cn } from "@/lib/utils";

const codigoIcone = `// a área inteira vazia: ícone, o porquê e a ação que tira do vazio
<EstadoVazio
  icone={UsersThree}
  titulo="Nenhum lead ainda"
  descricao="Os leads que chegam pelos canais conectados aparecem aqui. Crie o primeiro ou importe uma planilha."
  acao={
    <Button onClick={abrirNovoLead}>
      <Plus size={16} weight="regular" />
      Novo lead
    </Button>
  }
/>`;

const codigoNada = `// dentro de um bloco, coluna ou cartão: só a frase, sem ilustração
<EstadoVazio tamanho="sm" titulo="Nenhuma base de conhecimento ainda." descricao="Os arquivos que o agente lê para responder." />

// a lista de conversas usa a mesma peça para o vazio de uma aba
<ListaDeConversas
  abas={[{ valor: "finalizada", rotulo: "Finalizadas" }]}
  aba="finalizada"
  aoMudarAba={setAba}
  itens={[]}
  abertaId={null}
  aoAbrir={abrir}
  rotulos={{ vazio: "Nenhuma conversa finalizada hoje." }}
/>`;

const codigoBusca = `{visiveis.length === 0 ? (
  <EstadoVazio
    icone={MagnifyingGlass}
    titulo="Nenhum lead com essa busca e esses filtros"
    descricao="Confira a grafia ou tire um filtro."
    acao={
      <Button variant="tertiary" onClick={() => { setBusca(""); setFiltro({}); }}>
        Limpar busca e filtros
      </Button>
    }
  />
) : null}`;

const codigoTamanhos = `<EstadoVazio icone={Robot} titulo="Nenhum agente ainda" descricao="Um agente responde pelos canais conectados." acao={<Button>Novo agente</Button>} />
<EstadoVazio tamanho="sm" icone={Robot} titulo="Nenhum agente ainda" descricao="Um agente responde pelos canais conectados." />`;

const codigoNaTela = `// cada tela do protótipo aceita a prop vazio: a conta nova, sem nada
const [leads, setLeads] = useState(vazio ? [] : LEADS);
// no navegador: /prototipo?tela=leads&vazio=1`;

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
  { nome: "Região", medida: "role=status · centrado · px-6 py-10 (sm: px-3 py-4)", papel: "Uma coluna centrada, no meio da área que está vazia. É status: quando a busca passa a não achar nada, o leitor de tela ouve o porquê sem sair do campo." },
  { nome: "Ícone", medida: "disco 48 · muted · ícone 20 muted-foreground (sm: 32 · 16)", papel: "Só na variação com ícone: diz o que falta (pessoas, conversas, o funil). Decorativo — o título já diz. Sem ele é a variação 'nada'." },
  { nome: "Título", medida: "heading-4 foreground (sm: body-md muted-foreground)", papel: "O que não há, em uma linha: 'Nenhum lead ainda', 'Nenhuma conversa com essa busca'. No sm é a própria frase, apagada." },
  { nome: "Descrição", medida: "body-md muted-foreground · até 40 caracteres por linha", papel: "Por que está vazio e o que fazer. Opcional; no sm quase nunca." },
  { nome: "Ação", medida: "mt-3 · um Button (sm: mt-2)", papel: "O que tira do vazio: criar o primeiro, importar, limpar a busca. Primary quando é o caminho principal da tela; tertiary quando só desfaz um filtro." },
];

const NOMES = ["Ana Beatriz Ferreira", "Bruno Henrique Souza", "Carolina Almeida", "Daniel Martins", "Eduarda Ribeiro", "Felipe Andrade"];

function semAcento(texto: string) {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase();
}

/** A busca que não acha nada: digite um nome que não está na lista. */
function ExemploBusca() {
  const [busca, setBusca] = React.useState("");
  const visiveis = NOMES.filter((n) => semAcento(n).includes(semAcento(busca)));
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Input rotulo="Pesquisar leads" placeholder="Nome do lead" value={busca} onChange={(e) => setBusca(e.target.value)} />
      <div className={cn(blocoDaTela, "flex min-h-[220px] flex-col")}>
        {visiveis.length ? (
          <ul className="divide-y divide-border">
            {visiveis.map((n) => (
              <li key={n} className="flex h-9 items-center px-3 text-label-lg text-foreground">
                {n}
              </li>
            ))}
          </ul>
        ) : (
          <EstadoVazio
            icone={MagnifyingGlass}
            titulo="Nenhum lead com essa busca"
            descricao="Confira a grafia ou tire um filtro."
            acao={
              <Button variant="tertiary" onClick={() => setBusca("")}>
                Limpar busca
              </Button>
            }
            className="flex-1"
          />
        )}
      </div>
    </div>
  );
}

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Estado vazio"
      novidade="2026-10-08"
      descricao="A tela, ou a área, quando não há nada para mostrar. Duas variações: com ícone — o disco de 48 em muted, o título, a frase do porquê e a ação que tira do vazio — e sem ícone, só a frase, para dentro de uma lista, coluna ou cartão. Quem escreve o porquê é a tela."
      secoes={["Com ícone", "Sem ícone", "Busca sem resultado", "Tamanhos", "O que escrever", "Anatomia", "Na tela", "Como funciona", "Quando usar"]}
    >
      <Secao
        titulo="Com ícone"
        spec="disco 48 · heading-4 · body-md · ação"
        descricao="A área inteira está vazia: a conta nova, sem lead. O ícone diz o que falta, o título diz que não há, a frase diz de onde viria e a ação abre o caminho para o primeiro."
        codigo={codigoIcone}
        novidade="2026-10-08"
        nota={
          <>
            A ação é <Chip>primary</Chip> quando é o caminho principal da tela (criar o primeiro lead) e{" "}
            <Chip>tertiary</Chip> quando só desfaz algo (limpar a busca). Sem ação quando não há o que a pessoa possa
            fazer ali — as conversas chegam sozinhas.
          </>
        }
      >
        <div className={cn(blocoDaTela, "flex min-h-[280px] w-full flex-col")}>
          <EstadoVazio
            icone={UsersThree}
            titulo="Nenhum lead ainda"
            descricao="Os leads que chegam pelos canais conectados aparecem aqui. Crie o primeiro ou importe uma planilha."
            acao={
              <Button>
                <Plus size={16} weight="regular" />
                Novo lead
              </Button>
            }
            className="flex-1"
          />
        </div>
      </Secao>

      <Secao
        titulo="Sem ícone"
        spec="tamanho sm · body-md muted-foreground"
        descricao="O 'nada' de dentro: a aba sem conversa, a tabela de bases sem linha, o cartão do gráfico sem negócio. Uma frase apagada no lugar do conteúdo — a ilustração ali seria ruído, e a tela em volta já diz onde se está."
        codigo={codigoNada}
        novidade="2026-10-08"
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <div className={cn(blocoDaTela, "flex flex-col")}>
            <div className="flex h-10 items-center gap-2 border-b border-border px-3">
              <span className="text-label-lg text-foreground">Bases de conhecimento</span>
              <span className="text-caption text-muted-foreground">0 bases</span>
            </div>
            <EstadoVazio tamanho="sm" titulo="Nenhuma base de conhecimento ainda." descricao="Os arquivos que o agente lê para responder." />
          </div>
          <div className={cn(blocoDaTela, "flex flex-col")}>
            <div className="flex h-10 items-center gap-3 border-b border-border px-3 text-label-lg">
              <span className="text-muted-foreground">Abertas · 0</span>
              <span className="text-muted-foreground">Pendentes · 0</span>
              <span className="text-primary">Finalizadas · 0</span>
            </div>
            <EstadoVazio tamanho="sm" titulo="Nenhuma conversa finalizada hoje." />
          </div>
        </div>
        <Legenda>
          A <Chip>ListaDeConversas</Chip>, as tabelas de bases e servidores dos Agentes e os cartões do Início usam esta
          variação por dentro. A coluna do Quadro tem o próprio vazio tracejado, porque ali é alvo de soltar.
        </Legenda>
      </Secao>

      <Secao
        titulo="Busca sem resultado"
        spec="ícone de busca · ação tertiary"
        descricao="Digite um nome que não está na lista. O vazio da busca é diferente do vazio da conta: diz o que a pessoa fez e como desfaz — limpar a busca, tirar um filtro."
        codigo={codigoBusca}
        novidade="2026-10-08"
        nota={
          <>
            A região é <Chip>role=&quot;status&quot;</Chip>: quando a lista passa a não ter nada, o leitor de tela ouve
            &quot;Nenhum lead com essa busca&quot; sem a pessoa sair do campo. Por isso o título precisa dizer o porquê,
            não só &quot;Nada encontrado&quot;.
          </>
        }
      >
        <ExemploBusca />
      </Secao>

      <Secao
        titulo="Tamanhos"
        spec="md · sm"
        descricao="O mesmo conteúdo nos dois tamanhos. md é para a área da tela (altura de uma tabela, de um quadro); sm para dentro de coluna, lista ou cartão — o disco cai para 32, o título vira a frase apagada."
        codigo={codigoTamanhos}
        novidade="2026-10-08"
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <div className={cn(blocoDaTela, "flex min-h-[240px] flex-col")}>
            <EstadoVazio
              icone={Robot}
              titulo="Nenhum agente ainda"
              descricao="Um agente responde pelos canais conectados, com a base e as ferramentas que você der a ele."
              acao={
                <Button>
                  <Plus size={16} weight="regular" />
                  Novo agente
                </Button>
              }
              className="flex-1"
            />
          </div>
          <div className={cn(blocoDaTela, "flex min-h-[240px] flex-col")}>
            <EstadoVazio tamanho="sm" icone={Robot} titulo="Nenhum agente ainda" descricao="Um agente responde pelos canais conectados." className="flex-1" />
          </div>
        </div>
      </Secao>

      <Secao
        titulo="O que escrever"
        spec="título diz o que não há · frase diz o porquê e o que fazer"
        descricao="O componente não decide o texto: a tela diz. Três regras, para o vazio não virar um 'Nada encontrado' genérico."
        novidade="2026-10-08"
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="o que não há">
                &quot;Nenhum lead ainda&quot;, &quot;Nenhuma conversa finalizada hoje&quot; — o objeto da tela, no singular,
                com o &quot;ainda&quot; quando vai chegar
              </Item>
              <Item mono="por quê">
                a conta é nova, a busca não achou, o filtro cortou, o período não teve — uma das quatro, nunca &quot;nada
                encontrado&quot;
              </Item>
              <Item mono="o que fazer">
                a ação que tira do vazio: criar, importar, limpar a busca; ou nada, quando o conteúdo chega sozinho
              </Item>
              <Item mono="idioma">tudo é prop: a tela escreve no idioma de quem lê (next-intl); o componente não tem texto</Item>
            </ul>
          </>
        }
      >
        <div className="grid w-full gap-4 md:grid-cols-3">
          <div className={cn(blocoDaTela, "flex min-h-[200px] flex-col")}>
            <EstadoVazio icone={ChatCircleDots} titulo="Nenhuma conversa ainda" descricao="As mensagens dos canais conectados chegam aqui." className="flex-1" />
          </div>
          <div className={cn(blocoDaTela, "flex min-h-[200px] flex-col")}>
            <EstadoVazio
              icone={Kanban}
              titulo="Nenhum negócio no funil"
              descricao="Os negócios entram pela primeira etapa."
              acao={<Button size="sm">Novo negócio</Button>}
              className="flex-1"
            />
          </div>
          <div className={cn(blocoDaTela, "flex min-h-[200px] flex-col")}>
            <EstadoVazio
              icone={MagnifyingGlass}
              titulo="Nenhum agente com essa busca"
              descricao="Confira a grafia ou limpe a busca."
              acao={
                <Button size="sm" variant="tertiary">
                  Limpar busca
                </Button>
              }
              className="flex-1"
            />
          </div>
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
        spec="/prototipo?tela=…&vazio=1"
        descricao="Cada tela do protótipo tem a variação sem nada — a conta nova: Início com os números em zero, o funil sem negócio, a lista de leads vazia, o chat sem conversa, a automação só com o gatilho, nenhum agente."
        codigo={codigoNaTela}
        semSeletorDeFundo
      >
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <p className="chrome-prose text-muted-foreground">
            As telas recebem <Chip>vazio</Chip> e começam sem dados; o resto é o mesmo código.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild variant="secondary">
              <Link href="/prototipo?tela=leads&vazio=1">Leads sem nada</Link>
            </Button>
            <Button asChild variant="tertiary">
              <Link href="/prototipo?tela=dashboard&vazio=1">Início</Link>
            </Button>
            <Button asChild variant="tertiary">
              <Link href="/prototipo?tela=pipeline&vazio=1">Pipeline</Link>
            </Button>
            <Button asChild variant="tertiary">
              <Link href="/prototipo?tela=atendimento&vazio=1">Chat</Link>
            </Button>
            <Button asChild variant="tertiary">
              <Link href="/prototipo?tela=automacoes&vazio=1">Automações</Link>
            </Button>
            <Button asChild variant="tertiary">
              <Link href="/prototipo?tela=agentes&vazio=1">Agentes</Link>
            </Button>
          </div>
        </div>
      </Secao>

      <ComoFunciona>
        <p>
          Não há desenho no arquivo: o cliente pediu em 2026-10-08 as &quot;variações de telas sem nada — ícone e
          nada&quot;, e as telas já tinham cada uma a sua frase solta (&quot;Nenhum lead com essa busca&quot;, &quot;Escolha
          uma conversa na lista&quot;). A peça junta as duas variações num lugar só, e as telas passam a usá-la: com
          ícone quando a área inteira está vazia, sem ícone dentro de um bloco (ADR-077).
        </p>
        <p>
          A região é <Chip>role=&quot;status&quot;</Chip> — quando a busca passa a não achar nada, o leitor de tela ouve
          o título sem a pessoa sair do campo. O ícone é decorativo (<Chip>aria-hidden</Chip>): o título já diz. O
          componente não tem texto nenhum: título, frase e ação vêm da tela, no idioma de quem lê.
        </p>
        <p>
          A armadilha é a altura: a peça centra o conteúdo no espaço que recebe. Dentro de um bloco com{" "}
          <Chip>flex-col</Chip>, passe <Chip>className=&quot;flex-1&quot;</Chip> para ela ocupar a área da tabela que
          não veio; sem isso, ela fica colada no topo com o recuo de 40px.
        </p>
      </ComoFunciona>

      <Secao titulo="Quando usar" descricao="Estado vazio responde “por que não há nada aqui”; o Skeleton responde “ainda não chegou”.">
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Use</span> com ícone quando a área inteira da tela está vazia: a conta
            nova, a busca que não achou, o período sem negócio.
          </li>
          <li>
            <span className="text-foreground">Use</span> sem ícone (<Chip>tamanho=&quot;sm&quot;</Chip>) dentro de
            uma lista, aba, coluna ou cartão, onde a tela em volta já situa a pessoa.
          </li>
          <li>
            <span className="text-foreground">Use</span> a ação para o que tira do vazio: criar o primeiro, importar,
            limpar a busca.
          </li>
          <li>
            <span className="text-foreground">Não use</span> enquanto os dados ainda estão chegando: é o Skeleton da
            página de Carregamento.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para erro (a API falhou): é o Toast, ou a mensagem de erro
            do campo.
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
