"use client";

import { BookOpen, Files, LinkSimple, PencilSimple, Plugs, Plus, TextAlignLeft, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { DataTable, DataTableCell, DataTableRow, DataTableToolbar, type ColunaTabela } from "@/components/ui/data-table";
import { TabPanel, Tabs } from "@/components/ui/tabs";
import { blocoDaTela } from "@/lib/estados";
import { cn } from "@/lib/utils";
import { BotaoDeAcoes } from "@/components/ui/menu";
import { contar, type BaseDeConhecimento, type ServidorMcp } from "./dados";

/* ---------------------------------------------------------------------------
   Os cadastros que os agentes usam, num bloco só: bases de conhecimento e
   servidores MCP, uma aba para cada. Cada aba é uma lista de registros —
   Table densa, total na barra e o botão de criar ao lado. Clicar na linha
   abre o cadastro para editar.
--------------------------------------------------------------------------- */

export type Aba = "bases" | "servidores";

const ID = "agentes-cadastros";

/* `minimo` é o piso de cada coluna: abaixo da soma deles a lista rola de lado, dentro do bloco. */
const COLUNAS_DE_BASES: ColunaTabela[] = [
  { chave: "nome", rotulo: "Nome", icone: BookOpen, peso: 2, minimo: 150 },
  { chave: "descricao", rotulo: "Descrição", icone: TextAlignLeft, peso: 3, minimo: 170 },
  { chave: "arquivos", rotulo: "Arquivos", icone: Files, peso: 1.3, minimo: 96 },
  { chave: "acoes", rotulo: "", peso: 0.5, minimo: 44, alinharFim: true },
];

const COLUNAS_DE_SERVIDORES: ColunaTabela[] = [
  { chave: "nome", rotulo: "Nome", icone: Plugs, peso: 2, minimo: 150 },
  { chave: "url", rotulo: "URL do servidor", icone: LinkSimple, peso: 4.3, minimo: 220 },
  { chave: "acoes", rotulo: "", peso: 0.5, minimo: 44, alinharFim: true },
];

/** Texto de uma linha na célula: corta com reticências e guarda o valor inteiro no `title`. */
function Texto({ children, apagado }: { children: string; apagado?: boolean }) {
  return (
    <span title={children} className={cn("block truncate text-label-lg", apagado ? "text-muted-foreground" : "text-foreground")}>
      {children}
    </span>
  );
}

/** Sem valor na célula: um traço apagado, não um buraco. */
function Vazio() {
  return <span className="text-label-lg text-subtle-foreground">—</span>;
}

export function Cadastros({
  aba,
  aoMudarAba,
  bases,
  servidores,
  buscando,
  aoCriarBase,
  aoEditarBase,
  aoExcluirBase,
  aoCriarServidor,
  aoEditarServidor,
  aoExcluirServidor,
  className,
}: {
  aba: Aba;
  aoMudarAba: (aba: Aba) => void;
  /** As bases e os servidores já com a busca aplicada. */
  bases: BaseDeConhecimento[];
  servidores: ServidorMcp[];
  /** Há texto na busca: cada aba diz quantos achou, para a pessoa saber onde está o resultado. */
  buscando: boolean;
  aoCriarBase: () => void;
  aoEditarBase: (base: BaseDeConhecimento) => void;
  aoExcluirBase: (base: BaseDeConhecimento) => void;
  aoCriarServidor: () => void;
  aoEditarServidor: (servidor: ServidorMcp) => void;
  aoExcluirServidor: (servidor: ServidorMcp) => void;
  className?: string;
}) {
  const comContagem = (rotulo: string, n: number) => (buscando ? `${rotulo} · ${n}` : rotulo);
  return (
    <section aria-label="Cadastros dos agentes" className={cn("flex min-w-0 flex-col", blocoDaTela, className)}>
      <Tabs
        id={ID}
        rotulo="Cadastros dos agentes"
        atual={aba}
        aoEscolher={(v) => aoMudarAba(v as Aba)}
        itens={[
          { valor: "bases", rotulo: comContagem("Bases de conhecimento", bases.length) },
          { valor: "servidores", rotulo: comContagem("Servidores MCP", servidores.length) },
        ]}
        className="shrink-0 border-b border-border px-3"
      />

      <TabPanel id={ID} valor="bases" atual={aba}>
        <DataTableToolbar rotulo="Todas as bases" total={contar(bases.length, "base", "bases")}>
          <Button variant="tertiary" size="sm" onClick={aoCriarBase}>
            <Plus size={16} weight="regular" aria-hidden="true" />
            Nova base
          </Button>
        </DataTableToolbar>
        <DataTable colunas={COLUNAS_DE_BASES} className="rounded-none border-0 border-t">
          {bases.map((b) => (
            <DataTableRow key={b.id} aoSelecionar={() => aoEditarBase(b)}>
              <DataTableCell coluna="nome">
                <Texto>{b.nome}</Texto>
              </DataTableCell>
              <DataTableCell coluna="descricao">{b.descricao ? <Texto apagado>{b.descricao}</Texto> : <Vazio />}</DataTableCell>
              <DataTableCell coluna="arquivos">
                {b.arquivos.length ? (
                  // o número na célula, os nomes no `title`
                  <span title={b.arquivos.join("\n")} className="block truncate text-label-lg tabular-nums text-foreground">
                    {contar(b.arquivos.length, "arquivo", "arquivos")}
                  </span>
                ) : (
                  <Vazio />
                )}
              </DataTableCell>
              <DataTableCell coluna="acoes">
                <div className="flex justify-end">
                  <BotaoDeAcoes
                    rotulo={`Ações de ${b.nome}`}
                    itens={[
                      { id: "editar", rotulo: "Editar", icone: PencilSimple, aoAtivar: () => aoEditarBase(b) },
                      { id: "excluir", rotulo: "Excluir", icone: Trash, separadorAntes: true, aoAtivar: () => aoExcluirBase(b) },
                    ]}
                  />
                </div>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
        {/* dentro do bloco, sem ícone: a frase basta (ADR-077) */}
        {bases.length === 0 ? (
          <EstadoVazio tamanho="sm" titulo={buscando ? "Nenhuma base com essa busca." : "Nenhuma base de conhecimento ainda."} descricao={buscando ? undefined : "Os arquivos que o agente lê para responder."} />
        ) : null}
      </TabPanel>

      <TabPanel id={ID} valor="servidores" atual={aba}>
        <DataTableToolbar rotulo="Todos os servidores" total={contar(servidores.length, "servidor", "servidores")}>
          <Button variant="tertiary" size="sm" onClick={aoCriarServidor}>
            <Plus size={16} weight="regular" aria-hidden="true" />
            Novo servidor
          </Button>
        </DataTableToolbar>
        <DataTable colunas={COLUNAS_DE_SERVIDORES} className="rounded-none border-0 border-t">
          {servidores.map((s) => (
            <DataTableRow key={s.id} aoSelecionar={() => aoEditarServidor(s)}>
              <DataTableCell coluna="nome">
                <Texto>{s.nome}</Texto>
              </DataTableCell>
              <DataTableCell coluna="url">
                <Texto apagado>{s.url}</Texto>
              </DataTableCell>
              <DataTableCell coluna="acoes">
                <div className="flex justify-end">
                  <BotaoDeAcoes
                    rotulo={`Ações de ${s.nome}`}
                    itens={[
                      { id: "editar", rotulo: "Editar", icone: PencilSimple, aoAtivar: () => aoEditarServidor(s) },
                      { id: "excluir", rotulo: "Excluir", icone: Trash, separadorAntes: true, aoAtivar: () => aoExcluirServidor(s) },
                    ]}
                  />
                </div>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
        {servidores.length === 0 ? (
          <EstadoVazio tamanho="sm" titulo={buscando ? "Nenhum servidor com essa busca." : "Nenhum servidor MCP ainda."} descricao={buscando ? undefined : "As ferramentas externas que o agente pode usar."} />
        ) : null}
      </TabPanel>
    </section>
  );
}
