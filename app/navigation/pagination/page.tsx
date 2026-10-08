"use client";

import * as React from "react";
import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { Input } from "@/components/ui/input";
import { Pagination, ROTULOS_DA_PAGINACAO } from "@/components/ui/pagination";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { blocoDaTela, rolagemDiscreta } from "@/lib/estados";
import { POR_PAGINA, TAMANHOS_DE_PAGINA, resumoDaPaginacao, usePaginacao } from "@/lib/paginacao";
import { cn } from "@/lib/utils";

/* Uma lista de leads de mentira, só com nome e origem: o que a página precisa
   para mostrar a barra fazendo o que faz. */
const PRIMEIROS = ["Ana", "Bruno", "Carolina", "Daniel", "Eduarda", "Felipe", "Gabriela", "Henrique", "Isabela", "João", "Karina", "Leonardo", "Mariana", "Nicolas", "Olívia", "Paulo", "Rafaela", "Samuel", "Tatiane", "Vinícius", "Lúcia", "Mateo"];
const SOBRENOMES = ["Ferreira", "Souza", "Almeida", "Martins", "Ribeiro", "Andrade", "Nogueira", "Moreira", "Castro", "Lima", "Duarte", "Bastos"];
const ORIGENS = ["WhatsApp", "Instagram", "Site", "Indicação", "Google", "LinkedIn"];

type Lead = { id: string; nome: string; origem: string };

function leadsDeExemplo(quantos: number): Lead[] {
  return Array.from({ length: quantos }, (_, i) => ({
    id: `l${i + 1}`,
    nome: `${PRIMEIROS[i % PRIMEIROS.length]} ${SOBRENOMES[(i * 7) % SOBRENOMES.length]}`,
    origem: ORIGENS[(i * 5) % ORIGENS.length],
  }));
}

const OITENTA_E_QUATRO = leadsDeExemplo(84);

/** A lista de exemplo no padrão de fundo: toolbar, linhas de 36 e a barra fixa no pé. */
function Lista({ leads, children, altura = "max-h-[420px]" }: { leads: Lead[]; children?: React.ReactNode; altura?: string }) {
  return (
    <div className={cn(blocoDaTela, "flex w-full flex-col")}>
      <div className={cn("min-h-0 overflow-y-auto", altura, rolagemDiscreta)}>
        <ul className="divide-y divide-border">
          {leads.map((l) => (
            <li key={l.id} className="flex h-9 items-center gap-3 px-3">
              <span className="min-w-0 flex-1 truncate text-label-lg text-foreground">{l.nome}</span>
              <span className="text-body-sm text-muted-foreground">{l.origem}</span>
            </li>
          ))}
        </ul>
      </div>
      {children}
    </div>
  );
}

const codigo = `const paginacao = usePaginacao(linhas.length, {
  memoria: "leads",            // o tamanho fica lembrado por tela
  tamanhos: TAMANHOS_DE_PAGINA, // 20 · 50 · 100
  chave: \`\${busca}|\${JSON.stringify(filtro)}|\${JSON.stringify(ajustes.ordem)}\`, // mudou, volta à primeira
});
const daPagina = paginacao.fatiar(linhas);

<div className={cn("flex min-h-0 flex-col", blocoDaTela)}>
  <div ref={rolagem} className={cn("min-h-0 overflow-y-auto", rolagemDiscreta)}>
    <DataTableToolbar rotulo="Todos os leads" total={\`\${linhas.length} leads\`} />
    <DataTable colunas={COLUNAS} ajustes={ajustes}>{daPagina.map(linha)}</DataTable>
  </div>
  <Pagination
    className="shrink-0 border-t border-border px-3 py-2.5"
    resumo={resumoDaPaginacao(paginacao, { um: "lead", varios: "leads" })}
    paginas={paginacao.totalDePaginas}
    atual={paginacao.pagina}
    onIr={(p) => { paginacao.ir(p); rolagem.current?.scrollTo({ top: 0 }); }}
    tamanhos={TAMANHOS_DE_PAGINA}
    porPagina={paginacao.porPagina}
    aoMudarTamanho={paginacao.mudarTamanho}
  />
</div>`;

const codigoQuando = `// com uma página só, a barra não existe: o total já está na toolbar
<Pagination resumo="Mostrando 1–12 de 12 leads" paginas={1} atual={1} onIr={ir} />
// → não desenha nada

// com 21 registros, duas páginas: a barra aparece
<Pagination resumo="Mostrando 1–20 de 21 leads" paginas={2} atual={1} onIr={ir} />`;

const codigoMuitas = `// até 7 páginas, todos os números; acima, a primeira, a última, a atual com as vizinhas e reticências
<Pagination paginas={12} atual={6} onIr={ir} />   // 1 ... 5 6 7 ... 12
<Pagination paginas={12} atual={2} onIr={ir} />   // 1 2 3 4 5 ... 12
<Pagination paginas={40} atual={40} onIr={ir} />  // 1 ... 36 37 38 39 40`;

const codigoTamanho = `<Pagination
  resumo={resumoDaPaginacao(paginacao, { um: "lead", varios: "leads" })}
  paginas={paginacao.totalDePaginas}
  atual={paginacao.pagina}
  onIr={paginacao.ir}
  tamanhos={TAMANHOS_DE_PAGINA}
  porPagina={paginacao.porPagina}
  aoMudarTamanho={paginacao.mudarTamanho}
/>`;

const codigoBusca = `const visiveis = leads.filter((l) => semAcento(l.nome).includes(semAcento(busca)));
// a busca entra na chave: mudou, a paginação volta à primeira página
const paginacao = usePaginacao(visiveis.length, { chave: busca });

{visiveis.length === 0 ? (
  <EstadoVazio icone={MagnifyingGlass} titulo="Nenhum lead com essa busca" acao={<Button variant="tertiary" onClick={() => setBusca("")}>Limpar busca</Button>} />
) : (
  <div className={cn("flex flex-col", blocoDaTela)}>
    <DataTable colunas={COLUNAS}>{paginacao.fatiar(visiveis).map(linha)}</DataTable>
    <Pagination className="shrink-0 border-t border-border px-3 py-2.5" resumo={resumoDaPaginacao(paginacao, { um: "lead", varios: "leads" })} paginas={paginacao.totalDePaginas} atual={paginacao.pagina} onIr={paginacao.ir} />
  </div>
)}`;

const codigoCelular = `// a largura da janela decide (sm:); \`compacta\` força a versão de celular num rodapé estreito
<Pagination compacta resumo="Mostrando 41–60 de 84 leads" paginas={5} atual={3} onIr={ir} />`;

const codigoRotulos = `<Pagination
  resumo="Mostrando 21–40 de 84 clientes potenciales"
  paginas={5}
  atual={2}
  onIr={ir}
  tamanhos={[20, 50, 100]}
  porPagina={20}
  aoMudarTamanho={mudarTamanho}
  rotulos={{
    navegacao: "Paginación",
    anterior: "Anterior",
    proxima: "Siguiente",
    pagina: (n) => \`Página \${n}\`,
    posicao: (atual, total) => \`\${atual} de \${total}\`,
    porPagina: (n) => \`\${n} por página\`,
    tamanho: "Elementos por página",
  }}
/>`;

/** Um item de lista com a chave à esquerda, como nas páginas do Button e do Input. */
function Item({ mono, children }: { mono: string; children: React.ReactNode }) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-2">
      <code className="w-44 shrink-0 font-mono chrome-meta text-foreground">{mono}</code>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

type Regra = { titulo: string; texto: string };

/** As regras de paginação, como estão em docs/regras.md § Paginação (ADR-079). */
const regras: Regra[] = [
  { titulo: "O que pagina", texto: "Toda lista de registros em tabela: leads, negócios na visão de lista, bases, servidores. Não paginam o Quadro (rola por coluna), a lista de conversas (rola, com as recentes em cima), a grade de cartões, o calendário (anda por mês) e as tabelas do Início (mostram as primeiras linhas). Rolagem infinita não entra: esconde o rodapé, tira o 'onde estou' e some com a barra de seleção." },
  { titulo: "Quando aparece", texto: "Só com mais de uma página. Com uma só, a barra inteira some — o total já está na toolbar ('84 leads') e a lista acaba onde acaba. Sem registro à vista, nem tabela nem barra: é o Estado vazio." },
  { titulo: "Quanto por página", texto: "20. Vinte linhas de 36px, mais o cabeçalho, a toolbar e a barra, cabem numa janela de 900 sem rolar por dentro — a página inteira à vista é o que faz paginar valer a pena. A pessoa troca para 50 ou 100 no próprio rodapé; a escolha fica lembrada por tela, a página não: toda entrada começa na primeira." },
  { titulo: "Onde fica", texto: "No pé do bloco da tabela, fixa (não rola com a lista), com traço em cima. À esquerda, o tamanho e o resumo 'Mostrando 21–40 de 84 leads' — o nome do objeto, no plural certo; com busca ou filtro, o total é o filtrado. À direita, Anterior · números · Próxima. Uma barra por lista, nunca no topo, nunca flutuante." },
  { titulo: "O que volta à primeira", texto: "Busca, filtro, ordenação e tamanho. A lista mudou de definição: a página 3 da lista antiga não existe mais. E a página atual nunca passa da última — apagar os registros da última recua para a que sobrou." },
  { titulo: "Muitas páginas", texto: "No máximo 7 posições: a primeira, a última, a atual com uma vizinha de cada lado e '…' onde pulou (1 … 5 6 7 … 12). Até 7 páginas, todos os números. As reticências não são botão: quem quer ir longe usa a última e volta." },
  { titulo: "Trocar de página", texto: "A lista volta ao topo e o foco fica no botão clicado. O resumo é aria-live: o leitor de tela ouve 'Mostrando 21–40 de 84 leads'. Anterior e Próxima desabilitam nas pontas em vez de sumir, para a barra não mudar de largura." },
  { titulo: "Seleção entre páginas", texto: "A caixa do cabeçalho marca a página à vista. Os ids marcados ficam guardados ao trocar de página e a barra de seleção mostra o total; limpar limpa tudo. Uma ação em massa vale para todos os marcados, em qualquer página." },
  { titulo: "Agrupar", texto: "Os grupos são da página à vista: 20 leads agrupados por origem, com a contagem da página. Para ver um grupo inteiro, filtre por ele." },
  { titulo: "Carregando", texto: "A troca de página que vai ao servidor mostra o Skeleton da tabela com o mesmo número de linhas no lugar delas; a barra fica, com os botões desabilitados. Nada pula." },
  { titulo: "No CRM", texto: "A página e o tamanho vão para a API (?pagina=3&porPagina=20) e a página vai na URL da tela, para o voltar do navegador e para o link compartilhado abrir onde a pessoa estava. O servidor devolve o total: sem total não há paginação, há 'carregar mais'." },
  { titulo: "No celular", texto: "Abaixo de 640px só Anterior · '3 de 5' · Próxima. O resumo fica; o tamanho some — a página é 20 e pronto." },
];

type Parte = { nome: string; medida: string; papel: string };

const anatomia: Parte[] = [
  { nome: "Barra", medida: "nav · border-t · px-3 py-2.5 · shrink-0", papel: "A região, nomeada por rotulos.navegacao. No pé do bloco da tabela, fixa: a lista rola por dentro, a barra fica. Com uma página só, não existe." },
  { nome: "Tamanho", medida: "Button tertiary sm · Menu de rádio", papel: "'20 por página' abre o Menu com 20, 50 e 100 (tamanhos). A escolha fica lembrada por tela (memoria). Some no celular." },
  { nome: "Resumo", medida: "body-md muted-foreground · aria-live", papel: "'Mostrando 21–40 de 84 leads': onde se está e de quanto. É o que o leitor de tela ouve ao trocar de página." },
  { nome: "Botão de página", medida: "h-7 w-7 · rounded-md · label-lg tabular", papel: "Quadrado de 28, números tabulares para o 1 não estreitar o botão em relação ao 8. Nome 'Página N'." },
  { nome: "Página atual", medida: "accent + primary · aria-current", papel: "Dois sinais, não um: fundo accent e texto primary. Só a borda não bastava — no tema escuro ela quase some." },
  { nome: "Reticências", medida: "w-7 · '…' · aria-hidden", papel: "O salto entre a janela e as pontas, com a largura de um botão para a fileira não tremer. Não é botão." },
  { nome: "Extremos", medida: "Anterior · Próxima · caret 12", papel: "Desabilitam nas pontas em vez de sumir: perdem contraste e cursor, e a barra não muda de largura." },
  { nome: "Celular", medida: "'3 de 5' · sm:hidden", papel: "Abaixo de 640px os números dão lugar à posição; o tamanho some." },
];

/** A barra do jeito que fica na tela de Leads: 84 registros, 20 por página, tamanho lembrado. */
function ExemploPadrao() {
  const paginacao = usePaginacao(OITENTA_E_QUATRO.length, { tamanhos: TAMANHOS_DE_PAGINA });
  const rolagem = React.useRef<HTMLDivElement>(null);
  return (
    <div className={cn(blocoDaTela, "flex w-full flex-col")}>
      <div className="flex h-11 items-center gap-2 border-b border-border px-3">
        <span className="text-label-lg text-foreground">Todos os leads</span>
        <span className="text-caption text-muted-foreground">84 leads</span>
      </div>
      <div ref={rolagem} className={cn("max-h-[324px] min-h-0 overflow-y-auto", rolagemDiscreta)}>
        <ul className="divide-y divide-border">
          {paginacao.fatiar(OITENTA_E_QUATRO).map((l) => (
            <li key={l.id} className="flex h-9 items-center gap-3 px-3">
              <span className="min-w-0 flex-1 truncate text-label-lg text-foreground">{l.nome}</span>
              <span className="text-body-sm text-muted-foreground">{l.origem}</span>
            </li>
          ))}
        </ul>
      </div>
      <Pagination
        className="shrink-0 border-t border-border px-3 py-2.5"
        resumo={resumoDaPaginacao(paginacao, { um: "lead", varios: "leads" })}
        paginas={paginacao.totalDePaginas}
        atual={paginacao.pagina}
        onIr={(p) => {
          paginacao.ir(p);
          rolagem.current?.scrollTo({ top: 0 });
        }}
        tamanhos={TAMANHOS_DE_PAGINA}
        porPagina={paginacao.porPagina}
        aoMudarTamanho={paginacao.mudarTamanho}
      />
    </div>
  );
}

const QUANTIDADES = [
  { valor: "12", rotulo: "12 leads" },
  { valor: "20", rotulo: "20 leads" },
  { valor: "21", rotulo: "21 leads" },
  { valor: "84", rotulo: "84 leads" },
];

/** Troque a quantidade: a barra só existe quando a lista passa de uma página. */
function ExemploQuando() {
  const [quantos, setQuantos] = React.useState("20");
  const leads = React.useMemo(() => leadsDeExemplo(Number(quantos)), [quantos]);
  const paginacao = usePaginacao(leads.length, { chave: quantos });
  return (
    <div className="flex w-full flex-col gap-3">
      <SegmentedControl rotulo="Quantos leads" itens={QUANTIDADES} atual={quantos} aoEscolher={setQuantos} />
      <div className={cn(blocoDaTela, "flex w-full flex-col")}>
        <div className="flex h-11 items-center gap-2 border-b border-border px-3">
          <span className="text-label-lg text-foreground">Todos os leads</span>
          <span className="text-caption text-muted-foreground">{leads.length} leads</span>
        </div>
        <div className={cn("max-h-[252px] min-h-0 overflow-y-auto", rolagemDiscreta)}>
          <ul className="divide-y divide-border">
            {paginacao.fatiar(leads).map((l) => (
              <li key={l.id} className="flex h-9 items-center gap-3 px-3">
                <span className="min-w-0 flex-1 truncate text-label-lg text-foreground">{l.nome}</span>
                <span className="text-body-sm text-muted-foreground">{l.origem}</span>
              </li>
            ))}
          </ul>
        </div>
        <Pagination
          className="shrink-0 border-t border-border px-3 py-2.5"
          resumo={resumoDaPaginacao(paginacao, { um: "lead", varios: "leads" })}
          paginas={paginacao.totalDePaginas}
          atual={paginacao.pagina}
          onIr={paginacao.ir}
        />
      </div>
      <p aria-live="polite" className="text-body-md text-muted-foreground">
        {paginacao.totalDePaginas > 1 ? (
          <>
            {leads.length} leads em {paginacao.totalDePaginas} páginas de {POR_PAGINA}: a barra aparece.
          </>
        ) : (
          <>{leads.length} leads cabem numa página: sem barra — o total está na toolbar.</>
        )}
      </p>
    </div>
  );
}

function ExemploMuitas() {
  const [doze, setDoze] = React.useState(6);
  const [quarenta, setQuarenta] = React.useState(40);
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="w-full rounded-md bg-card p-5">
        <Pagination resumo={`Página ${doze} de 12`} paginas={12} atual={doze} onIr={setDoze} />
      </div>
      <div className="w-full rounded-md bg-card p-5">
        <Pagination resumo={`Página ${quarenta} de 40`} paginas={40} atual={quarenta} onIr={setQuarenta} />
      </div>
    </div>
  );
}

function ExemploTamanho() {
  const paginacao = usePaginacao(OITENTA_E_QUATRO.length, { memoria: "ds-pagination", tamanhos: TAMANHOS_DE_PAGINA });
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="w-full rounded-md bg-card p-5">
        <Pagination
          resumo={resumoDaPaginacao(paginacao, { um: "lead", varios: "leads" })}
          paginas={paginacao.totalDePaginas}
          atual={paginacao.pagina}
          onIr={paginacao.ir}
          tamanhos={TAMANHOS_DE_PAGINA}
          porPagina={paginacao.porPagina}
          aoMudarTamanho={paginacao.mudarTamanho}
        />
      </div>
      <p className="text-body-md text-muted-foreground">
        {paginacao.porPagina} por página → {paginacao.totalDePaginas} {paginacao.totalDePaginas === 1 ? "página" : "páginas"}. Recarregue a página: a escolha continua.
      </p>
    </div>
  );
}

function semAcento(texto: string) {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase();
}

/** Busque um nome: o total do resumo vira o filtrado e a página volta à primeira. */
function ExemploBusca() {
  const [busca, setBusca] = React.useState("");
  const visiveis = OITENTA_E_QUATRO.filter((l) => semAcento(l.nome).includes(semAcento(busca)));
  const paginacao = usePaginacao(visiveis.length, { chave: busca });
  return (
    <div className="flex w-full flex-col gap-3">
      <Input rotulo="Pesquisar leads" placeholder="Nome do lead" value={busca} onChange={(e) => setBusca(e.target.value)} className="max-w-xs" />
      {visiveis.length === 0 ? (
        <div className={cn(blocoDaTela, "flex min-h-[200px] w-full flex-col")}>
          <EstadoVazio
            icone={MagnifyingGlass}
            titulo="Nenhum lead com essa busca"
            descricao="Confira a grafia ou limpe a busca."
            acao={
              <Button variant="tertiary" onClick={() => setBusca("")}>
                Limpar busca
              </Button>
            }
            className="flex-1"
          />
        </div>
      ) : (
        <Lista leads={paginacao.fatiar(visiveis)} altura="max-h-[252px]">
          <Pagination
            className="shrink-0 border-t border-border px-3 py-2.5"
            resumo={resumoDaPaginacao(paginacao, { um: "lead", varios: "leads" })}
            paginas={paginacao.totalDePaginas}
            atual={paginacao.pagina}
            onIr={paginacao.ir}
          />
        </Lista>
      )}
    </div>
  );
}

function ExemploPontas() {
  const [pagina, setPagina] = React.useState(1);
  return (
    <div className="w-full rounded-md bg-card p-5">
      <Pagination resumo={`Página ${pagina} de 4`} paginas={4} atual={pagina} onIr={setPagina} />
    </div>
  );
}

/** A barra numa largura de celular: só Anterior · "3 de 5" · Próxima. */
function ExemploCelular() {
  const [pagina, setPagina] = React.useState(3);
  return (
    <div className="flex w-full justify-center">
      {/* `compacta` força a versão de celular: o `sm:` do componente lê a janela, não a caixa */}
      <div className="w-full max-w-[360px] rounded-md border border-border bg-card">
        <div className="border-b border-border px-3 py-2 text-label-lg text-foreground">Leads</div>
        <ul className="divide-y divide-border">
          {OITENTA_E_QUATRO.slice(40, 44).map((l) => (
            <li key={l.id} className="flex h-9 items-center px-3 text-label-lg text-foreground">
              {l.nome}
            </li>
          ))}
        </ul>
        <Pagination compacta className="border-t border-border px-3 py-2.5" resumo="Mostrando 41–60 de 84 leads" paginas={5} atual={pagina} onIr={setPagina} />
      </div>
    </div>
  );
}

function ExemploEmEspanhol() {
  const paginacao = usePaginacao(84, { tamanhos: TAMANHOS_DE_PAGINA });
  return (
    <div className="w-full rounded-md bg-card p-5">
      <Pagination
        resumo={`Mostrando ${paginacao.inicio}–${paginacao.fim} de 84 clientes potenciales`}
        paginas={paginacao.totalDePaginas}
        atual={paginacao.pagina}
        onIr={paginacao.ir}
        tamanhos={TAMANHOS_DE_PAGINA}
        porPagina={paginacao.porPagina}
        aoMudarTamanho={paginacao.mudarTamanho}
        rotulos={{
          navegacao: "Paginación",
          anterior: "Anterior",
          proxima: "Siguiente",
          pagina: (n) => `Página ${n}`,
          posicao: (atual, total) => `${atual} de ${total}`,
          porPagina: (n) => `${n} por página`,
          tamanho: "Elementos por página",
        }}
      />
    </div>
  );
}

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Pagination"
      novidade="2026-10-08"
      descricao="Os controles de página de uma lista de registros, com o resumo do que está à vista. 20 por página; a barra só existe com mais de uma página; fica fixa no pé do bloco, com o tamanho e o resumo à esquerda e Anterior · números · Próxima à direita. Com muitas páginas, 7 posições e reticências; no celular, só a posição."
      secoes={["A barra", "Quando aparece", "As regras", "Muitas páginas", "Tamanho da página", "Com busca e filtros", "Nas pontas", "No celular", "Em outro idioma", "Estados", "Anatomia", "Na tela", "Como funciona", "Quando usar"]}
    >
      <Secao
        titulo="A barra"
        spec="20 por página · resumo · Anterior · números · Próxima"
        descricao="A barra como fica na tela de Leads: 84 registros, 20 por página. Clique nos números — a lista troca e volta ao topo; troque o tamanho para 50 e veja a barra encolher para 2 páginas."
        codigo={codigo}
        novidade="2026-10-08"
        nota={
          <>
            O estado mora na tela, no <Chip>usePaginacao</Chip> de <Chip>lib/paginacao.ts</Chip>: a página, o tamanho
            (lembrado por <Chip>memoria</Chip>), o total de páginas, <Chip>inicio</Chip> e <Chip>fim</Chip> para o
            resumo e <Chip>fatiar</Chip>, que devolve os registros da página. <Chip>chave</Chip> é o que define a
            lista — busca, filtros, ordenação —: quando muda, volta à primeira. O componente só desenha.
          </>
        }
      >
        <ExemploPadrao />
      </Secao>

      <Secao
        titulo="Quando aparece"
        spec="só com mais de uma página"
        descricao="Troque a quantidade. Com 12 ou 20 leads a lista cabe numa página e a barra não existe — o total já está na toolbar. Com 21, duas páginas: a barra aparece, com 'Mostrando 1–20 de 21 leads'."
        codigo={codigoQuando}
        novidade="2026-10-08"
        nota={
          <>
            A regra mora no componente: <Chip>paginas</Chip> igual a 1 não desenha nada. A tela não precisa decidir —
            e nenhuma lista fica com uma barra de uma página só, que só diria &quot;você está na 1 de 1&quot;.
          </>
        }
      >
        <ExemploQuando />
      </Secao>

      <Secao titulo="As regras" spec="12 regras · docs/regras.md § Paginação · ADR-079" semCaixa novidade="2026-10-08">
        <div className="divide-y divide-border rounded-lg border border-border">
          {regras.map((r, i) => (
            <div key={r.titulo} className="grid gap-1 p-4 sm:grid-cols-[180px_1fr] sm:gap-4">
              <p className="text-h4 text-foreground">
                <span className="mr-2 font-mono text-label-md text-subtle-foreground">{String(i + 1).padStart(2, "0")}</span>
                {r.titulo}
              </p>
              <p className="text-body-lg text-muted-foreground">{r.texto}</p>
            </div>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Muitas páginas"
        spec="7 posições · 1 … 5 6 7 … 12"
        descricao="Até 7 páginas, todos os números. Acima disso, a primeira, a última, a atual com uma vizinha de cada lado e reticências onde pulou. Perto das pontas a janela estica para manter as 7 posições. Clique e veja a janela andar."
        codigo={codigoMuitas}
        novidade="2026-10-08"
        nota={
          <>
            As reticências têm a largura de um botão e não são clicáveis: um &quot;pular 5&quot; escondido ali é o
            tipo de alvo que ninguém descobre. Quem quer ir longe clica na última e volta, ou usa a busca.
          </>
        }
      >
        <ExemploMuitas />
      </Secao>

      <Secao
        titulo="Tamanho da página"
        spec="20 · 50 · 100 · lembrado por tela"
        descricao="'20 por página' abre um Menu de rádio com 20, 50 e 100. Trocar volta à primeira página e fica lembrado para esta tela (memoria). 20 é o padrão porque 20 linhas de 36px cabem numa janela de 900 sem rolar por dentro."
        codigo={codigoTamanho}
        novidade="2026-10-08"
        nota={
          <>
            Sem <Chip>tamanhos</Chip> não há o botão: uma lista curta ou um rodapé apertado passam só o resumo. O
            tamanho não aparece no celular — ali a página é 20 e pronto.
          </>
        }
      >
        <ExemploTamanho />
      </Secao>

      <Secao
        titulo="Com busca e filtros"
        spec="chave · volta à primeira · total filtrado"
        descricao="Vá para a página 3 e busque 'ana': a lista volta à primeira página e o resumo passa a contar o filtrado. Busque algo que não existe: nem lista nem barra — o Estado vazio com o caminho de volta."
        codigo={codigoBusca}
        novidade="2026-10-08"
      >
        <ExemploBusca />
      </Secao>

      <Secao
        titulo="Nas pontas"
        spec="1 e última"
        descricao="Na primeira página, Anterior desabilita. Na última, Próxima. O botão perde contraste e perde o cursor junto — e fica no lugar, para a barra não mudar de largura."
      >
        <ExemploPontas />
      </Secao>

      <Secao
        titulo="No celular"
        spec="< 640px · Anterior · 3 de 5 · Próxima"
        descricao="Abaixo de 640px os números não cabem: a posição '3 de 5' fica no lugar deles, e o tamanho some. Anterior e Próxima continuam com o nome inteiro — são o que a pessoa mais usa com o polegar."
        codigo={codigoCelular}
        novidade="2026-10-08"
        nota={
          <>
            Na tela, quem decide é a largura da janela (<Chip>sm:</Chip>): estreite a janela nas outras seções para ver
            o mesmo. <Chip>compacta</Chip> força esta versão em qualquer largura — para um rodapé estreito, como o de
            um painel lateral.
          </>
        }
      >
        <ExemploCelular />
      </Secao>

      <Secao
        titulo="Em outro idioma"
        spec="rotulos · 7 textos · fábrica pt-BR"
        descricao="O nome da região, Anterior e Próxima, o nome de cada número, a posição do celular, o botão do tamanho e o nome do menu vêm de rotulos. O resumo é conteúdo: a tela escreve no idioma de quem lê."
        codigo={codigoRotulos}
        novidade="2026-10-08"
        nota={
          <>
            A fábrica <Chip>ROTULOS_DA_PAGINACAO</Chip> tem {Object.keys(ROTULOS_DA_PAGINACAO).length} textos;{" "}
            <Chip>pagina</Chip>, <Chip>posicao</Chip> e <Chip>porPagina</Chip> são funções porque levam número.{" "}
            <Chip>resumoDaPaginacao</Chip> escreve o resumo em pt-BR; em outro idioma a tela monta o dela com{" "}
            <Chip>inicio</Chip>, <Chip>fim</Chip> e <Chip>total</Chip>.
          </>
        }
      >
        <ExemploEmEspanhol />
      </Secao>

      <Secao
        titulo="Estados"
        spec="7 estados · nada simulado"
        descricao="Repouso, sob o cursor, em foco, a atual, desabilitado nas pontas, as reticências e o celular. Tudo está vivo nas seções acima."
        novidade="2026-10-08"
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="repouso">botão de 28 em <Chip>background</Chip> com traço <Chip>card</Chip>, número em <Chip>muted-foreground</Chip></Item>
              <Item mono="hover">fundo <Chip>overlay/item-hover</Chip> e número em <Chip>foreground</Chip></Item>
              <Item mono="focus-visible">o anel de 2px com respiro (D6)</Item>
              <Item mono="atual">fundo <Chip>accent</Chip>, número <Chip>primary</Chip>, <Chip>aria-current</Chip></Item>
              <Item mono="disabled">Anterior na primeira, Próxima na última: opacidade e cursor de não dá; ficam no lugar</Item>
              <Item mono="reticências">texto <Chip>muted-foreground</Chip> com a largura de um botão; não é alvo</Item>
              <Item mono="celular">os números somem, fica &quot;3 de 5&quot;; o tamanho some</Item>
            </ul>
            <p className="mt-2.5">Não há &quot;ir para a página N&quot; por campo nem rolagem infinita. Ausência é decisão.</p>
          </>
        }
      >
        <ExemploMuitas />
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
        spec="/prototipo?tela=leads · Pipeline em lista"
        descricao="A tela de Leads é a referência: 84 leads, 20 por página, o tamanho lembrado, busca e filtros voltando à primeira. A visão de lista do Pipeline tem a mesma barra — e, com 14 negócios, não a mostra: é a regra funcionando."
        semSeletorDeFundo
      >
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <p className="chrome-prose text-muted-foreground">
            Vá para a página 3, busque um nome, troque para 50 por página, marque linhas em duas páginas e veja a
            barra de seleção somar.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild variant="secondary">
              <Link href="/prototipo?tela=leads">Abrir os Leads no protótipo</Link>
            </Button>
            <Button asChild variant="tertiary">
              <Link href="/prototipo?tela=pipeline">Pipeline</Link>
            </Button>
          </div>
        </div>
      </Secao>

      <ComoFunciona>
        <p>
          A página atual se distingue por <strong>dois</strong> sinais: fundo <Chip>accent</Chip> e texto{" "}
          <Chip>primary</Chip>. O arquivo marcava só a borda, e no tema escuro ela quase desaparecia contra o fundo do
          próprio botão — quem estivesse na página 3 não saberia. Dois sinais também é o que a WCAG pede quando a cor
          carrega informação.
        </p>
        <p>
          As regras de quando aparece e como se comporta nasceram em 2026-10-08 (ADR-079), quando a tela de Leads
          passou a paginar e o humano pediu que a paginação tivesse regra pensada na experiência, não só o
          componente. A parte que o componente garante sozinho: com uma página não há barra; acima de 7 páginas, a
          janela com reticências; no celular, a posição no lugar dos números; o resumo em <Chip>aria-live</Chip>. A
          parte que a tela faz, pelo <Chip>usePaginacao</Chip>: 20 por página, o tamanho lembrado por tela, a volta à
          primeira quando a busca, o filtro ou a ordenação mudam, e a atual que nunca passa da última.
        </p>
        <p>
          A armadilha é a rolagem: a barra precisa ficar fixa no pé do bloco (<Chip>shrink-0</Chip> fora da área
          que rola), senão ela some embaixo das 20 linhas e a pessoa rola a lista inteira para descobrir que há mais.
          E, ao trocar de página, a tela rola a lista de volta ao topo — o componente não conhece a lista.
        </p>
        <p>
          Os rótulos são props (<Chip>rotulos</Chip>, fábrica <Chip>ROTULOS_DA_PAGINACAO</Chip>). A UI do CRM é
          multi-idioma, e texto fixo dentro de componente é a forma mais silenciosa de quebrar isso — some do arquivo
          de tradução e ninguém percebe até um cliente em espanhol abrir a tela.
        </p>
      </ComoFunciona>

      <Secao titulo="Quando usar" descricao="Pagination responde “onde estou e quanto falta”; a rolagem responde “o que vem a seguir”.">
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Use</span> em toda lista de registros em tabela: leads, negócios na visão
            de lista, bases, servidores. O componente some sozinho com uma página só.
          </li>
          <li>
            <span className="text-foreground">Use</span> com <Chip>usePaginacao</Chip>: 20 por página, tamanho lembrado
            por tela, a <Chip>chave</Chip> com busca, filtros e ordenação.
          </li>
          <li>
            <span className="text-foreground">Não use</span> no Quadro, na lista de conversas, na grade de cartões nem no
            calendário: cada um tem a própria forma de andar.
          </li>
          <li>
            <span className="text-foreground">Não use</span> rolagem infinita no lugar: esconde o rodapé, tira o
            &quot;onde estou&quot; e some com a barra de seleção.
          </li>
          <li>
            <span className="text-foreground">Não use</span> no topo da lista nem flutuando: uma barra, no pé do bloco.
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
