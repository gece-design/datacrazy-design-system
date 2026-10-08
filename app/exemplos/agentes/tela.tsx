"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ChatCircleDots,
  FlowArrow,
  Gear,
  House,
  Kanban,
  Lightning,
  Plus,
  Question,
  Robot,
  Star,
  Trash,
  UsersThree,
} from "@phosphor-icons/react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { HeaderBusca, Notificacoes, type Notificacao } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { SidebarBrand, SidebarGrupo, SidebarItem, SidebarRodape, SidebarThemeSwitch, SidebarTopo, SidebarUser } from "@/components/ui/sidebar";
import { TelaBase } from "@/components/ui/tela-base";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "@/components/ui/toast";
import { formulario, gradeDeCartoes } from "@/lib/campo";
import { useTema } from "@/lib/tema";
import { cn } from "@/lib/utils";
import { Cadastros, type Aba } from "./cadastros";
import { CartaoAgente } from "./cartao-agente";
import { AGENTES, BASES, MODELOS, SERVIDORES, contar, type Agente, type BaseDeConhecimento, type ServidorMcp } from "./dados";

/* ---------------------------------------------------------------------------
   Tela de exemplo — NÃO é componente do design system.

   Os agentes de IA da conta, só com peças do DS. É a tela de referência para
   CATÁLOGO EM CARTÕES com cadastros ao lado: os agentes em cartões (score,
   modelo e ferramentas no pé de cada um) e, num bloco à direita, o que eles
   usam — bases de conhecimento e servidores MCP, uma aba para cada. Uma busca
   só, no Header, filtra os três. Criar e editar é um modal curto.
--------------------------------------------------------------------------- */

const PRINCIPAIS = [
  { rotulo: "Início", icone: House },
  { rotulo: "Pipelines", icone: Kanban },
  { rotulo: "Leads", icone: UsersThree },
  { rotulo: "Impulso", icone: Lightning },
  { rotulo: "Automações", icone: FlowArrow },
  { rotulo: "Chat ao vivo", icone: ChatCircleDots },
  { rotulo: "Agentes de IA", icone: Robot },
];

const FAVORITOS = ["Pipeline comercial", "Leads quentes", "Propostas da semana"];

const APOIO = [
  { rotulo: "Ajuda", icone: Question },
  { rotulo: "Configurações", icone: Gear },
];

const NOTIFICACOES: Notificacao[] = [
  { id: "1", icone: Robot, titulo: "Score atualizado", detalhe: "Qualificador de leads subiu para 92.", quando: "agora", lida: false },
  { id: "2", icone: BookOpen, titulo: "Base atualizada", detalhe: "Central de ajuda recebeu dois arquivos novos.", quando: "há 2 h", lida: true },
];

/** Os modelos como opções: cada um como a Tag que aparece no cartão do agente. */
const OPCOES_DE_MODELO = MODELOS.map((m) => ({ valor: m, rotulo: m }));

/* Buscar "pos-venda" tem que achar "Pós-venda": quem digita rápido não põe acento. */
function semAcento(texto: string) {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase();
}

/** O último valor que não foi nulo. O modal sai dissolvendo: enquanto some, continua mostrando o que tinha. */
function useUltimo<T>(valor: T | null) {
  const ultimo = React.useRef(valor);
  if (valor !== null) ultimo.current = valor;
  return valor ?? ultimo.current;
}

/* Os três formulários. Com `id`, é edição; sem, é um registro novo. */
type FormDeAgente = { id?: string; nome: string; descricao: string; modelo: string };
type FormDeBase = { id?: string; nome: string; descricao: string };
type FormDeServidor = { id?: string; nome: string; url: string };
/** O que está para ser excluído, à espera da confirmação. */
type Exclusao = { tipo: "agente" | "base" | "servidor"; id: string; nome: string };

const agenteVazio: FormDeAgente = { nome: "", descricao: "", modelo: MODELOS[0] };
const baseVazia: FormDeBase = { nome: "", descricao: "" };
const servidorVazio: FormDeServidor = { nome: "", url: "" };

const NOME_DO_TIPO = { agente: "agente", base: "base de conhecimento", servidor: "servidor MCP" } as const;

export function Tela({
  aoNavegar,
  memoria = "agentes",
}: {
  /** Só no protótipo, que junta as telas: recebe o destino clicado na navegação e devolve `true` quando troca de tela. */
  aoNavegar?: (destino: string) => boolean;
  /** Chave da memória da sidebar. No protótipo é uma só, para ela não mudar de estado entre as telas. */
  memoria?: string;
} = {}) {
  const [rota, setRota] = React.useState("Agentes de IA");
  const [agentes, setAgentes] = React.useState(AGENTES);
  const [bases, setBases] = React.useState(BASES);
  const [servidores, setServidores] = React.useState(SERVIDORES);
  const [busca, setBusca] = React.useState("");
  const [aba, setAba] = React.useState<Aba>("bases");
  const [formAgente, setFormAgente] = React.useState<FormDeAgente | null>(null);
  const [formBase, setFormBase] = React.useState<FormDeBase | null>(null);
  const [formServidor, setFormServidor] = React.useState<FormDeServidor | null>(null);
  /** O erro do formulário aberto: qual campo e o que falta. Só um modal abre por vez. */
  const [erro, setErro] = React.useState<{ campo: "nome" | "url"; texto: string } | null>(null);
  const [exclusao, setExclusao] = React.useState<Exclusao | null>(null);
  const [notificacoes, setNotificacoes] = React.useState(NOTIFICACOES);
  const { tema, mudar } = useTema();
  // o que cada modal desenha: o formulário aberto ou, na saída, o último que esteve aberto
  const agenteNoModal = useUltimo(formAgente);
  const baseNoModal = useUltimo(formBase);
  const servidorNoModal = useUltimo(formServidor);
  const exclusaoNoModal = useUltimo(exclusao);

  /* Uma busca para a tela toda: o mesmo texto filtra os agentes, as bases e os servidores. */
  const termo = semAcento(busca);
  const acha = (...campos: string[]) => !termo || semAcento(campos.join(" ")).includes(termo);
  const agentesVisiveis = agentes.filter((a) => acha(a.nome, a.descricao, a.modelo));
  const basesVisiveis = bases.filter((b) => acha(b.nome, b.descricao, ...b.arquivos));
  const servidoresVisiveis = servidores.filter((s) => acha(s.nome, s.url));

  const erroDe = (campo: "nome" | "url") => (erro?.campo === campo ? erro.texto : undefined);
  const fecharAgente = () => {
    setFormAgente(null);
    setErro(null);
  };
  const fecharBase = () => {
    setFormBase(null);
    setErro(null);
  };
  const fecharServidor = () => {
    setFormServidor(null);
    setErro(null);
  };

  function salvarAgente() {
    if (!formAgente) return;
    const nome = formAgente.nome.trim();
    if (!nome) return setErro({ campo: "nome", texto: "Dê um nome para o agente" });
    const campos = { nome, descricao: formAgente.descricao.trim(), modelo: formAgente.modelo };
    if (formAgente.id) {
      setAgentes((lista) => lista.map((a) => (a.id === formAgente.id ? { ...a, ...campos } : a)));
      toast({ variant: "success", titulo: "Agente atualizado", descricao: `${nome} já está com os dados novos.` });
    } else {
      // agente novo: ainda sem score e sem ferramentas
      setAgentes((lista) => [{ id: `a-${Date.now()}`, ...campos, score: null, ferramentas: 0 }, ...lista]);
      toast({ variant: "success", titulo: "Agente criado", descricao: `${nome} entrou no começo da lista.` });
    }
    fecharAgente();
  }

  function duplicarAgente(agente: Agente) {
    const copia = { ...agente, id: `a-${Date.now()}`, nome: `${agente.nome} (cópia)`, score: null };
    // a cópia entra logo depois do original
    setAgentes((lista) => lista.flatMap((a) => (a.id === agente.id ? [a, copia] : [a])));
    toast({ variant: "success", titulo: "Agente duplicado", descricao: `${copia.nome} entrou ao lado do original.` });
  }

  function salvarBase() {
    if (!formBase) return;
    const nome = formBase.nome.trim();
    if (!nome) return setErro({ campo: "nome", texto: "Dê um nome para a base" });
    const campos = { nome, descricao: formBase.descricao.trim() };
    if (formBase.id) {
      setBases((lista) => lista.map((b) => (b.id === formBase.id ? { ...b, ...campos } : b)));
      toast({ variant: "success", titulo: "Base atualizada", descricao: `${nome} já está com os dados novos.` });
    } else {
      setBases((lista) => [{ id: `b-${Date.now()}`, ...campos, arquivos: [] }, ...lista]);
      toast({ variant: "success", titulo: "Base criada", descricao: `${nome} entrou no começo da lista.` });
    }
    setAba("bases");
    fecharBase();
  }

  function salvarServidor() {
    if (!formServidor) return;
    const nome = formServidor.nome.trim();
    const url = formServidor.url.trim();
    if (!nome) return setErro({ campo: "nome", texto: "Dê um nome para o servidor" });
    if (!url) return setErro({ campo: "url", texto: "Informe a URL do servidor" });
    if (!/^https?:\/\/\S+$/i.test(url)) return setErro({ campo: "url", texto: "A URL começa com https://" });
    if (formServidor.id) {
      setServidores((lista) => lista.map((s) => (s.id === formServidor.id ? { ...s, nome, url } : s)));
      toast({ variant: "success", titulo: "Servidor atualizado", descricao: `${nome} já está com os dados novos.` });
    } else {
      setServidores((lista) => [{ id: `s-${Date.now()}`, nome, url }, ...lista]);
      toast({ variant: "success", titulo: "Servidor criado", descricao: `${nome} entrou no começo da lista.` });
    }
    setAba("servidores");
    fecharServidor();
  }

  function excluir() {
    if (!exclusao) return;
    const fica = <T extends { id: string }>(lista: T[]) => lista.filter((item) => item.id !== exclusao.id);
    if (exclusao.tipo === "agente") setAgentes(fica);
    if (exclusao.tipo === "base") setBases(fica);
    if (exclusao.tipo === "servidor") setServidores(fica);
    toast({ variant: "success", titulo: "Excluído", descricao: `${exclusao.nome} saiu da lista.` });
    setExclusao(null);
  }

  return (
    <>
      <TelaBase
        memoria={memoria}
        navegacao={
          <>
            <SidebarTopo>
              <SidebarBrand />
              <SidebarGrupo>
                {PRINCIPAIS.map((r) => (
                  <SidebarItem
                    key={r.rotulo}
                    icone={r.icone}
                    componente="button"
                    selecionado={r.rotulo === rota}
                    onClick={() => {
                      if (!aoNavegar?.(r.rotulo)) setRota(r.rotulo);
                    }}
                  >
                    {r.rotulo}
                  </SidebarItem>
                ))}
              </SidebarGrupo>
              {/* Favoritos: atalhos que a pessoa fixou. Recolhida, o grupo some — estrela sem rótulo não diz nada. */}
              <SidebarGrupo rotulo="Favoritos" ocultarRecolhida>
                {FAVORITOS.map((f) => (
                  <SidebarItem key={f} icone={Star} componente="button" selecionado={f === rota} onClick={() => setRota(f)}>
                    {f}
                  </SidebarItem>
                ))}
              </SidebarGrupo>
            </SidebarTopo>
            <SidebarRodape>
              <SidebarGrupo>
                <li>
                  <SidebarThemeSwitch tema={tema} onTemaChange={mudar} />
                </li>
                {APOIO.map((r) => (
                  <SidebarItem key={r.rotulo} icone={r.icone} componente="button" selecionado={r.rotulo === rota} onClick={() => setRota(r.rotulo)}>
                    {r.rotulo}
                  </SidebarItem>
                ))}
                <SidebarItem icone={ArrowLeft} componente={Link} href="/">
                  Voltar ao design system
                </SidebarItem>
              </SidebarGrupo>
              <SidebarUser
                nome="Gabriel Correa"
                email="gece@datacrazy.com"
                onClick={() => toast({ variant: "info", titulo: "Menu do usuário", descricao: "No CRM: perfil, preferências e sair." })}
              />
            </SidebarRodape>
          </>
        }
        cabecalho={{
          titulo: "Agentes de IA",
          trilha: (
            <Breadcrumb
              ancestrais
              rotulo="Trilha de navegação"
              rotuloRecolhidos={(n) => `Mostrar ${n} níveis ocultos`}
              itens={[{ rotulo: "Início" }]}
            />
          ),
          utilitarios: (
            <Notificacoes
              itens={notificacoes}
              aoMarcarLida={(id) => setNotificacoes((l) => l.map((n) => (n.id === id ? { ...n, lida: true } : n)))}
              aoMarcarTodas={() => setNotificacoes((l) => l.map((n) => ({ ...n, lida: true })))}
            />
          ),
          acoes: (
            <>
              {/* A fileira só tem botões: busca aberta (regra da HeaderBusca). Uma busca só, para os dois lados da tela. */}
              <HeaderBusca
                rotulo="Pesquisar agentes, bases e servidores"
                placeholder="Pesquisar"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <Button onClick={() => setFormAgente({ ...agenteVazio })}>
                <Plus size={16} weight="regular" aria-hidden="true" />
                Criar agente
              </Button>
            </>
          ),
        }}
      >
        {/* Dois lados a partir de 1280: os agentes e, ao lado, o que eles usam. Abaixo disso, um sobre o outro.
            `items-start`: cada lado termina onde o conteúdo termina. */}
        <div className="grid min-w-0 grid-cols-1 items-start gap-3 xl:grid-cols-2">
          <section aria-label="Agentes" className="flex min-w-0 flex-col gap-2">
            <p className="text-label-lg text-muted-foreground">{contar(agentesVisiveis.length, "agente", "agentes")}</p>
            {agentesVisiveis.length ? (
              // quantos cartões de 220 couberem: o lado muda de largura com a janela e com a navegação
              <ul className={cn(gradeDeCartoes, "gap-3")}>
                {agentesVisiveis.map((a) => (
                  <li key={a.id} className="min-w-0 motion-safe:animate-surgir">
                    <CartaoAgente
                      agente={a}
                      aoEditar={() => setFormAgente({ id: a.id, nome: a.nome, descricao: a.descricao, modelo: a.modelo })}
                      aoDuplicar={() => duplicarAgente(a)}
                      aoExcluir={() => setExclusao({ tipo: "agente", id: a.id, nome: a.nome })}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-body-md text-muted-foreground">
                {termo ? "Nenhum agente com essa busca." : "Nenhum agente ainda."}
              </p>
            )}
          </section>

          <Cadastros
            aba={aba}
            aoMudarAba={setAba}
            bases={basesVisiveis}
            servidores={servidoresVisiveis}
            buscando={Boolean(termo)}
            aoCriarBase={() => setFormBase({ ...baseVazia })}
            aoEditarBase={(b: BaseDeConhecimento) => setFormBase({ id: b.id, nome: b.nome, descricao: b.descricao })}
            aoExcluirBase={(b) => setExclusao({ tipo: "base", id: b.id, nome: b.nome })}
            aoCriarServidor={() => setFormServidor({ ...servidorVazio })}
            aoEditarServidor={(s: ServidorMcp) => setFormServidor({ id: s.id, nome: s.nome, url: s.url })}
            aoExcluirServidor={(s) => setExclusao({ tipo: "servidor", id: s.id, nome: s.nome })}
          />
        </div>
      </TelaBase>

      {/* Agente: nome, o que ele faz e o modelo. Score e ferramentas não se digitam — vêm do uso e da configuração. */}
      <Modal
        aberto={Boolean(formAgente)}
        aoFechar={fecharAgente}
        titulo={agenteNoModal?.id ? "Editar agente" : "Criar agente"}
        size="md"
        acoes={
          <>
            <Button size="sm" variant="secondary" onClick={fecharAgente}>
              Cancelar
            </Button>
            <Button size="sm" onClick={salvarAgente}>
              {agenteNoModal?.id ? "Salvar" : "Criar agente"}
            </Button>
          </>
        }
      >
        {agenteNoModal ? (
          <div className={formulario}>
            <Input
              rotulo="Nome"
              obrigatorio
              ajuda="Como o agente aparece na lista e nas conversas."
              value={agenteNoModal.nome}
              erro={erroDe("nome")}
              placeholder="Ex.: Qualificador de leads"
              onChange={(e) => {
                setErro(null);
                setFormAgente({ ...agenteNoModal, nome: e.target.value });
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                // sem isto o Enter segue para o botão que recebe o foco de volta e reabre o modal
                e.preventDefault();
                salvarAgente();
              }}
            />
            <Textarea
              rotulo="Descrição"
              ajuda="O que ele faz e quando entra em ação."
              value={agenteNoModal.descricao}
              placeholder="O que este agente faz"
              onChange={(e) => setFormAgente({ ...agenteNoModal, descricao: e.target.value })}
            />
            <Select
              size="field"
              rotulo="Modelo de IA"
              ajuda="O modelo que responde por este agente."
              valor={agenteNoModal.modelo}
              aoEscolher={(v) => setFormAgente({ ...agenteNoModal, modelo: v })}
              opcoes={OPCOES_DE_MODELO}
            />
          </div>
        ) : null}
      </Modal>

      {/* Base de conhecimento: nome e descrição. Os arquivos entram depois, na própria base. */}
      <Modal
        aberto={Boolean(formBase)}
        aoFechar={fecharBase}
        titulo={baseNoModal?.id ? "Editar base de conhecimento" : "Nova base de conhecimento"}
        size="md"
        acoes={
          <>
            <Button size="sm" variant="secondary" onClick={fecharBase}>
              Cancelar
            </Button>
            <Button size="sm" onClick={salvarBase}>
              {baseNoModal?.id ? "Salvar" : "Criar base"}
            </Button>
          </>
        }
      >
        {baseNoModal ? (
          <div className={formulario}>
            <Input
              rotulo="Nome"
              obrigatorio
              value={baseNoModal.nome}
              erro={erroDe("nome")}
              placeholder="Ex.: Central de ajuda"
              onChange={(e) => {
                setErro(null);
                setFormBase({ ...baseNoModal, nome: e.target.value });
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                // sem isto o Enter segue para o botão que recebe o foco de volta e reabre o modal
                e.preventDefault();
                salvarBase();
              }}
            />
            <Textarea
              rotulo="Descrição"
              ajuda="Os arquivos entram depois, na própria base."
              value={baseNoModal.descricao}
              placeholder="O que os agentes encontram nesta base"
              onChange={(e) => setFormBase({ ...baseNoModal, descricao: e.target.value })}
            />
          </div>
        ) : null}
      </Modal>

      {/* Servidor MCP: nome e endereço. */}
      <Modal
        aberto={Boolean(formServidor)}
        aoFechar={fecharServidor}
        titulo={servidorNoModal?.id ? "Editar servidor MCP" : "Novo servidor MCP"}
        size="md"
        acoes={
          <>
            <Button size="sm" variant="secondary" onClick={fecharServidor}>
              Cancelar
            </Button>
            <Button size="sm" onClick={salvarServidor}>
              {servidorNoModal?.id ? "Salvar" : "Criar servidor"}
            </Button>
          </>
        }
      >
        {servidorNoModal ? (
          <div className={formulario}>
            <Input
              rotulo="Nome"
              obrigatorio
              value={servidorNoModal.nome}
              erro={erroDe("nome")}
              placeholder="Ex.: Agenda da equipe"
              onChange={(e) => {
                setErro(null);
                setFormServidor({ ...servidorNoModal, nome: e.target.value });
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                // sem isto o Enter segue para o botão que recebe o foco de volta e reabre o modal
                e.preventDefault();
                salvarServidor();
              }}
            />
            <Input
              rotulo="URL do servidor"
              obrigatorio
              ajuda="O endereço que o agente chama para usar as ferramentas."
              value={servidorNoModal.url}
              erro={erroDe("url")}
              inputMode="url"
              placeholder="https://"
              onChange={(e) => {
                setErro(null);
                setFormServidor({ ...servidorNoModal, url: e.target.value });
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                // sem isto o Enter segue para o botão que recebe o foco de volta e reabre o modal
                e.preventDefault();
                salvarServidor();
              }}
            />
          </div>
        ) : null}
      </Modal>

      {/* Excluir pede confirmação: não dá para desfazer. O foco abre no Cancelar. */}
      <Modal
        aberto={Boolean(exclusao)}
        aoFechar={() => setExclusao(null)}
        variant="destructive"
        titulo={exclusaoNoModal ? `Excluir ${NOME_DO_TIPO[exclusaoNoModal.tipo]}?` : ""}
        descricao={exclusaoNoModal ? `${exclusaoNoModal.nome} sai da lista. Não dá para desfazer.` : undefined}
        size="sm"
        acoes={
          <>
            <Button size="sm" variant="secondary" autoFocus onClick={() => setExclusao(null)}>
              Cancelar
            </Button>
            <Button size="sm" variant="destructive" onClick={excluir}>
              <Trash size={16} weight="regular" aria-hidden="true" />
              Excluir
            </Button>
          </>
        }
      />
      <Toaster />
    </>
  );
}
