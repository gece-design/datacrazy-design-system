"use client";

import Link from "next/link";
import { ChatText, ClipboardText, GitCommit, Handshake, ShieldCheck, UsersThree, WhatsappLogo } from "@phosphor-icons/react";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { KpiCard } from "@/components/ui/kpi-card";
import { Tag } from "@/components/ui/tag";
import {
  BotaoColunas,
  DataTable,
  DataTableCell,
  DataTableRow,
  DataTableToolbar,
  ordenarPor,
  useAjustesDaTabela,
  type ColunaTabela,
} from "@/components/ui/data-table";
import { LinhaDoTempo, type EventoLinhaDoTempo } from "@/components/ui/drawer";
import entrega from "@/lib/entrega.json";

/**
 * Relatório de entrega — o que foi construído, medido pelo próprio repositório:
 * `scripts/gerar-entrega.mjs` lê componentes, docs, catálogo, auditoria, ADRs,
 * kfe-state e git e grava `lib/entrega.json`. A página só mostra. Fica fora
 * do nav: é link direto para o cliente.
 */

const data = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
const dataLonga = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", { day: "numeric", month: "long" });

const COLUNAS: ColunaTabela[] = [
  { chave: "componente", rotulo: "Componente", peso: 3 },
  { chave: "categoria", rotulo: "Categoria", peso: 1.6, agrupavel: true },
  { chave: "props", rotulo: "Props", peso: 0.9, alinharFim: true },
  { chave: "variantes", rotulo: "Variantes", peso: 1, alinharFim: true },
  { chave: "estados", rotulo: "Estados", peso: 0.9, alinharFim: true },
  { chave: "acessibilidade", rotulo: "Acessibilidade", peso: 1.3, alinharFim: true },
  { chave: "pecas", rotulo: "Peças", peso: 0.8, alinharFim: true },
  { chave: "instalar", rotulo: "Instalar", peso: 2, ordenavel: false },
];

type Componente = (typeof entrega.componentes)[number];
const valorDe = (c: Componente, chave: string): string | number => {
  switch (chave) {
    case "componente": return c.titulo;
    case "categoria": return c.categoria ?? "";
    case "instalar": return c.name;
    default: return (c as unknown as Record<string, number>)[chave] ?? 0;
  }
};

const CHECKS: Record<string, string> = {
  temas: "Nenhuma variável de tema repete valor entre claro e escuro sem intenção declarada (regra E4).",
  tokens: "Valor de estilo fora dos tokens é rejeitado: hex, duração, z-index, sombra e tipografia soltos.",
  rotas: "Navegação, páginas e catálogo concordam; nenhum link publicado dá 404.",
  "doc-codigo": "Toda prop e toda peça exportada do código estão na doc, e vice-versa.",
  docs: "Auditoria do kit de processo: seções obrigatórias, registro e estados de cada componente.",
  paginas: "Cada página do site abre sem erro de console.",
  exemplos: "Todo trecho de código publicado compila contra o catálogo instalável.",
  regressao: `${entrega.qualidade.capturas} capturas (${entrega.totais.paginas} páginas × ${entrega.qualidade.temas} temas) comparadas pixel a pixel a cada lote.`,
  sidebar: "As medidas da sidebar conferidas nos dois temas.",
};

const ICONE_DA_ORIGEM = { WhatsApp: WhatsappLogo, Reunião: UsersThree, Cliente: Handshake, Revisão: ChatText, Lote: ShieldCheck } as const;

const NUMERO = "text-right tabular-nums text-label-lg text-foreground";

export default function Entrega() {
  const ajustes = useAjustesDaTabela(COLUNAS, { memoria: "entrega-componentes" });
  const linhas = ordenarPor(entrega.componentes, ajustes.ordem, valorDe);
  const { totais, tokens, git, catalogo, auditoria, adrs, pedidos, qualidade } = entrega;
  const tratados = (auditoria.porStatus.corrigido ?? 0) + (auditoria.porStatus.aceito ?? 0);
  const eventos: EventoLinhaDoTempo[] = pedidos.map((p, i) => ({
    id: `${p.data}-${i}`,
    titulo: p.titulo,
    detalhes: [dataLonga(p.data), p.origem, p.resumo],
    icone: ICONE_DA_ORIGEM[p.origem as keyof typeof ICONE_DA_ORIGEM] ?? ClipboardText,
  }));
  const porOrigem = pedidos.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.origem]: (acc[p.origem] ?? 0) + 1 }), {});

  return (
    <PaginaDS
      titulo="Entrega"
      descricao={`O que foi construído de ${dataLonga(entrega.periodo.inicio)} a ${dataLonga(entrega.periodo.fim)}, medido pelo próprio repositório. Números gerados em ${data(entrega.geradoEm)}.`}
      secoes={["Como funciona", "Em números", "Componentes", "Qualidade", "Linha do tempo", "Decisões", "SystemCrazy", "Próximos passos"]}
    >
      <ComoFunciona>
        <p>
          Nada aqui foi digitado à mão. Um script lê o código dos componentes, a doc de cada um, o catálogo instalável,
          a auditoria de consistência, as decisões registradas e o histórico do git, e grava os números em um arquivo.
          Esta página só mostra. Se um número parecer alto ou baixo, a origem dele está no repositório.
        </p>
        <p>
          O período vai do primeiro commit ao último. As entregas da linha do tempo começam na primeira reunião com o
          time ({dataLonga("2026-09-18")}): antes disso o trabalho foi de fundação — tokens, processo e os primeiros
          componentes medidos contra o Figma.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Em números"
        spec={`${git.commits} commits`}
        descricao="Cada cartão é uma contagem direta. Peças são funções, componentes e hooks exportados; estados e acessibilidade são as linhas das tabelas de cada doc."
        semCaixa
        semSeletorDeFundo
        className="border-0 bg-transparent"
      >
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard title="Componentes" value={String(totais.componentes)} caption={`${totais.pecas} peças exportadas`} />
          <KpiCard title="Páginas do design system" value={String(totais.paginas)} caption={`${entrega.categorias.length} categorias`} />
          <KpiCard title="Itens instaláveis" value={String(catalogo.itens)} caption="catálogo shadcn + skill" />
          <KpiCard title="Props documentadas" value={String(totais.props)} caption={`${totais.variantes} variantes`} />
          <KpiCard title="Estados de interação" value={String(totais.estados)} caption="hover, foco, aberto, erro…" />
          <KpiCard title="Itens de acessibilidade" value={String(totais.acessibilidade)} caption="foco, teclado, papel, rótulo" />
          <KpiCard title="Decisões registradas" value={String(adrs.length)} caption="ADRs com motivo e aprovação" />
          <KpiCard title="Achados tratados" value={String(tratados)} caption={`de ${auditoria.total} da auditoria`} />
        </div>
        <Legenda>
          Tokens: {tokens.cores} cores, {tokens.tipografia} papéis de texto, {tokens.raios} raios, {tokens.sombras} sombras, {tokens.camadas} camadas,{" "}
          {tokens.animacoes} animações. Código: {git.linhasUi.toLocaleString("pt-BR")} linhas em <Chip>components/ui</Chip>,{" "}
          {git.linhasDocs.toLocaleString("pt-BR")} linhas de documentação, {git.arquivos} arquivos versionados.
        </Legenda>
      </Secao>

      <Secao
        titulo="Componentes"
        spec={`${totais.componentes} · ${totais.docs} docs`}
        descricao="Um por linha, com o que a doc de cada um registra. Clique no cabeçalho para ordenar; o botão Colunas esconde o que não interessa."
        semSeletorDeFundo
        className="p-0"
      >
        <div className="w-full overflow-hidden rounded-md bg-card">
          <DataTableToolbar layout="compacta" rotulo="Componentes" total={`${totais.componentes} · ${totais.pecas} peças`}>
            <BotaoColunas ajustes={ajustes} />
          </DataTableToolbar>
          <DataTable layout="compacta" colunas={COLUNAS} ajustes={ajustes} className="rounded-none border-0">
            {linhas.map((c) => (
              <DataTableRow key={c.name} chave={c.name} nome={c.titulo}>
                <DataTableCell coluna="componente">
                  {c.pagina ? (
                    <Link href={c.pagina} className="text-label-lg text-foreground underline-offset-2 hover:underline">
                      {c.titulo}
                    </Link>
                  ) : (
                    <span className="text-label-lg text-foreground">{c.titulo}</span>
                  )}
                </DataTableCell>
                <DataTableCell coluna="categoria">
                  {c.categoria ? <Tag>{c.categoria}</Tag> : <span className="text-caption text-muted-foreground">base</span>}
                </DataTableCell>
                <DataTableCell coluna="props" className={NUMERO}>{c.props}</DataTableCell>
                <DataTableCell coluna="variantes" className={NUMERO}>{c.variantes}</DataTableCell>
                <DataTableCell coluna="estados" className={NUMERO}>{c.estados}</DataTableCell>
                <DataTableCell coluna="acessibilidade" className={NUMERO}>{c.acessibilidade}</DataTableCell>
                <DataTableCell coluna="pecas" className={NUMERO}>{c.pecas}</DataTableCell>
                <DataTableCell coluna="instalar">
                  <code className="font-mono text-caption text-muted-foreground">@datacrazy/{c.name}</code>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTable>
        </div>
      </Secao>

      <Secao
        titulo="Qualidade"
        spec={`${qualidade.checks.length} verificações`}
        descricao="O que roda antes de cada entrega. Verificação que falha bloqueia o lote; a base só pode melhorar (catraca)."
        semCaixa
        semSeletorDeFundo
        className="border-0 bg-transparent"
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {qualidade.checks.map((c) => (
            <li key={c} className="flex flex-col gap-1 rounded-lg bg-card p-4">
              <span className="font-mono text-label-md text-foreground">check:{c}</span>
              <span className="text-body-sm text-muted-foreground">{CHECKS[c] ?? "—"}</span>
            </li>
          ))}
        </ul>
        <Legenda>
          Mais: tema escuro em tudo por token, sem ramificação de código; texto sempre por prop (multi-idioma); foco visível,
          teclado e papel ARIA documentados em {totais.acessibilidade} itens; auditoria de consistência com {auditoria.total}{" "}
          achados numerados — {auditoria.porStatus.corrigido ?? 0} corrigidos, {auditoria.porStatus.aceito ?? 0} aceitos com decisão,{" "}
          {auditoria.porStatus.adiado ?? 0} à espera da remedição do Figma.
        </Legenda>
      </Secao>

      <Secao
        titulo="Linha do tempo"
        spec={`${pedidos.length} lotes desde 18/09`}
        descricao={`Cada lote entregue depois da primeira reunião, do mais novo ao mais antigo. Origem: ${Object.entries(porOrigem).map(([k, v]) => `${k} ${v}`).join(" · ")}.`}
        semSeletorDeFundo
      >
        <LinhaDoTempo eventos={eventos} className="w-full" />
      </Secao>

      <Secao
        titulo="Decisões"
        spec={`${adrs.length} ADRs`}
        descricao="Toda vez que o código se afasta do Figma, ou uma regra nasce, fica registrado o desvio, o motivo e quem aprovou. Do mais recente ao primeiro."
        semSeletorDeFundo
        className="p-0"
      >
        <div className="w-full overflow-hidden rounded-md bg-card">
          <DataTable
            layout="compacta"
            colunas={[
              { chave: "id", rotulo: "ADR", peso: 0.8 },
              { chave: "titulo", rotulo: "Decisão", peso: 5 },
              { chave: "data", rotulo: "Data", peso: 0.8, alinharFim: true },
            ]}
            className="rounded-none border-0"
          >
            {[...adrs].reverse().map((a) => (
              <DataTableRow key={a.id}>
                <DataTableCell coluna="id">
                  <span className="font-mono text-caption text-muted-foreground">{a.id}</span>
                </DataTableCell>
                <DataTableCell coluna="titulo">
                  <span className="text-label-lg text-foreground">{a.titulo}</span>
                </DataTableCell>
                <DataTableCell coluna="data" className="text-right tabular-nums text-label-lg text-muted-foreground">{data(a.data)}</DataTableCell>
              </DataTableRow>
            ))}
          </DataTable>
        </div>
      </Secao>

      <Secao
        titulo="SystemCrazy"
        spec={`${catalogo.itens} itens`}
        descricao="O design system como catálogo instalável: o Claude Code lista, lê e instala os componentes pelo MCP, e a skill diz como compor."
        semCaixa
        semSeletorDeFundo
        className="border-0 bg-transparent"
      >
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard title="Componentes instaláveis" value={String(catalogo.porTipo["registry:ui"] ?? 0)} caption="@datacrazy/<nome>" />
          <KpiCard title="Bibliotecas de apoio" value={String(catalogo.porTipo["registry:lib"] ?? 0)} caption="estados, campo, camada, datas…" />
          <KpiCard title="Blocos de tela" value={String(catalogo.porTipo["registry:block"] ?? 0)} caption="tela pronta em um comando" />
          <KpiCard title="Referências na skill" value={String(totais.docs)} caption="uma por componente, geradas da doc" />
        </div>
        <Legenda>
          {entrega.bancada
            ? "Bancada de geração de telas: veja os resultados abaixo."
            : "A bancada que mede o Claude gerando telas com o DS está em andamento; os números entram aqui quando fecharem."}
        </Legenda>
      </Secao>

      <Secao
        titulo="Próximos passos"
        spec="fase 2"
        descricao="O que vem depois, em três frentes. O como fica para o plano de trabalho."
        semCaixa
        semSeletorDeFundo
        className="border-0 bg-transparent"
      >
        <ol className="grid gap-3 sm:grid-cols-3">
          {[
            ["As telas do CRM", "Uma a uma, do pipeline às configurações, montadas só com o que existe aqui — cada tela nova é também um bloco instalável."],
            ["Migração sem parar o produto", "O DS entra por cima do CRM atual, tela por tela, com o antes e o depois medidos."],
            ["Governança no time", "O catálogo, a skill e as verificações passam a viver no repositório do time, com a regra de que componente novo nasce aqui."],
          ].map(([titulo, texto], i) => (
            <li key={titulo} className="flex flex-col gap-1 rounded-lg bg-card p-4">
              <span className="font-mono text-caption text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-label-lg text-foreground">{titulo}</span>
              <span className="text-body-sm text-muted-foreground">{texto}</span>
            </li>
          ))}
        </ol>
        <Legenda>
          <GitCommit size={14} weight="regular" aria-hidden="true" className="mr-1 inline align-[-2px]" />
          {git.commits} commits entre {data(entrega.periodo.inicio)} e {data(entrega.periodo.fim)}.
        </Legenda>
      </Secao>
    </PaginaDS>
  );
}
