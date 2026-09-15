"use client";

import * as React from "react";
import {
  ArrowSquareOut,
  Buildings,
  CalendarBlank,
  CaretDown,
  ChatCircleDots,
  ChatText,
  ClockCounterClockwise,
  Copy,
  EnvelopeSimple,
  File,
  FunnelSimple,
  Handshake,
  InstagramLogo,
  MapPin,
  Minus,
  Note,
  PencilSimple,
  Phone,
  Play,
  Plus,
  Pulse,
  SidebarSimple,
  SquaresFour,
  Toolbox,
  TreeStructure,
  User,
  Users,
  UsersThree,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Tag, TagAdicionar, type TagProps } from "@/components/ui/tag";
import { Avatar } from "@/components/ui/avatar";
import { Input, AcaoCampo } from "@/components/ui/input";
import { Rating } from "@/components/ui/rating";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  DataTable,
  DataTableRow,
  DataTableCell,
  DataTableToolbar,
  CelulaDupla,
  CelulaAcoes,
  type ColunaTabela,
} from "@/components/ui/data-table";
import {
  DrawerPainel,
  DrawerPerfil,
  DrawerBloco,
  DrawerMetricas,
  DrawerContato,
  DrawerMenu,
  DrawerConteudo,
  DrawerSecao,
  DrawerBotaoCanto,
  LinhaDoTempo,
  HierarquiaNo,
  HierarquiaCanvas,
  type ItemMenuDrawer,
  type LinhaContato,
  type MetricaDrawer,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

/* Composição do showcase: os dados do arquivo (Figma 565:5959) montados com os
   componentes do DS. Nada aqui é componente — é a tela de exemplo. */

type TagDoLead = { rotulo: string; status?: TagProps["status"]; foto?: string };
type Lead = {
  nome: string;
  tipo: "pessoa" | "empresa";
  telefone: string;
  email: string;
  tags: TagDoLead[];
  metricas: MetricaDrawer[];
  contato: LinhaContato[];
};

export const LEADS: Record<"rafael" | "joel", Lead> = {
  rafael: {
    nome: "Rafael Pinto Pinheiro",
    tipo: "pessoa",
    telefone: "+55 (54) 44346-5346",
    email: "contato@datacrazy.com",
    tags: [
      { rotulo: "Esther", foto: "/ds/atendente.png" },
      { rotulo: "Lista de leads" },
      { rotulo: "Isaias 123" },
      { rotulo: "Abandonou", status: "destructive" },
      { rotulo: "Agendado", status: "success" },
      { rotulo: "Frio" },
    ],
    metricas: [
      { rotulo: "Ticket médio", valor: "R$ 0,00" },
      { rotulo: "Total", valor: "R$ 0,00" },
      { rotulo: "Ciclo de compra", valor: "0d" },
      { rotulo: "Última compra", valor: "0d" },
    ],
    contato: [
      { texto: "Guitarrista", icone: User, rotulo: "Cargo" },
      { texto: "5+52 (34) 52345-3425", icone: Phone, rotulo: "Telefone" },
      { texto: "gui@queen.com", icone: EnvelopeSimple, rotulo: "E-mail" },
    ],
  },
  joel: {
    nome: "Joel Jota",
    tipo: "empresa",
    telefone: "+55 (11) 98765-4321",
    email: "contact@datawave.com",
    tags: [
      { rotulo: "Liam", foto: "/ds/atendente.png" },
      { rotulo: "Prospect list" },
      { rotulo: "Premium" },
      { rotulo: "Passou", status: "info" },
      { rotulo: "Agendado", status: "success" },
      { rotulo: "Warm" },
    ],
    metricas: [
      { rotulo: "Ticket médio", valor: "R$ 150,00" },
      { rotulo: "Total", valor: "R$ 9.877,00" },
      { rotulo: "Ciclo de compra", valor: "89d" },
      { rotulo: "Última compra", valor: "3d" },
    ],
    contato: [
      { texto: "Drummer", icone: User, rotulo: "Cargo" },
      { texto: "+55 (21) 99876-5432", icone: Phone, rotulo: "Telefone" },
      { texto: "alex@music.com", icone: EnvelopeSimple, rotulo: "E-mail" },
    ],
  },
};

export const MENU_LEAD: ItemMenuDrawer[] = [
  { id: "perfil", rotulo: "Perfil", icone: User },
  { id: "campos", rotulo: "Campos adicionais", icone: SquaresFour },
  { id: "negocios", rotulo: "Negócios", icone: Toolbox },
  { id: "atividades", rotulo: "Atividades", icone: Pulse },
  { id: "atendimentos", rotulo: "Atendimentos", icone: ChatText },
  { id: "historicos", rotulo: "Históricos", icone: ClockCounterClockwise },
  { id: "hierarquia", rotulo: "Hierarquia", icone: TreeStructure },
  { id: "pessoas", rotulo: "Pessoas", icone: Users },
  { id: "empresas", rotulo: "Empresas", icone: Buildings },
  { id: "enderecos", rotulo: "Endereços", icone: MapPin },
  { id: "arquivos", rotulo: "Arquivos", icone: File },
  { id: "notas", rotulo: "Notas", icone: Note },
];

const copiar = (texto: string) => void navigator.clipboard?.writeText(texto);
const abrir = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

/* -------------------------------------------------------------- Conteúdos -- */

function ConteudoHistorico() {
  return (
    <LinhaDoTempo
      eventos={[
        {
          id: "tag",
          titulo: "Tag [ENV] Follow-up 3 adicionada ao lead",
          detalhes: ["João Carlos Ferreira Jr", "17/08/2026", "22:15"],
          icone: ChatCircleDots,
        },
        {
          id: "criado",
          titulo: "Lead criado via importação",
          detalhes: ["Importação", "17/08/2026", "18:23"],
          icone: UsersThree,
        },
      ]}
    />
  );
}

const reclamacoes = [
  { valor: "nenhuma", rotulo: "Nenhuma" },
  { valor: "uma", rotulo: "Uma" },
  { valor: "varias", rotulo: "Mais de uma" },
];

/** Select com rótulo visível — o "Select" de formulário do arquivo (544:129). */
function CampoSelect({ rotulo, valor, aoEscolher }: { rotulo: string; valor?: string; aoEscolher: (v: string) => void }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-label-md text-input-label">{rotulo}</span>
      <Select
        size="field"
        rotulo={rotulo}
        textoVazio="Selecione uma opção"
        opcoes={reclamacoes}
        valor={valor}
        aoEscolher={aoEscolher}
        className="block w-full"
      />
    </div>
  );
}

function ConteudoPerfil() {
  const [prosseguir, setProsseguir] = React.useState(false);
  const [colaboradores, setColaboradores] = React.useState(45);
  const [reclamacao, setReclamacao] = React.useState<string>();
  return (
    <>
      <DrawerSecao titulo="Dados cadastrais">
        <div className="grid grid-cols-3 gap-3">
          <Input rotulo="Razão social" defaultValue="Joel Jota Performance LTDA" />
          <Input rotulo="Nome fantasia" defaultValue="Joel Jota" />
          <Input rotulo="CNPJ" placeholder="00.000.000/0000-00" acoes={<AcaoCampo icone={Copy} rotulo="Copiar CNPJ" />} />
          <Input rotulo="Origem" defaultValue="Indicação" />
          <Input rotulo="Segmento" defaultValue="Educação e alta performance" />
          <Input rotulo="Data de fundação" placeholder="dd/mm/aaaa" iconeInicio={CalendarBlank} />
          <Input
            rotulo="Site"
            defaultValue="joeljota.com.br"
            acoes={
              <>
                <AcaoCampo icone={Copy} rotulo="Copiar site" onClick={() => copiar("joeljota.com.br")} />
                <AcaoCampo icone={ArrowSquareOut} rotulo="Abrir site" onClick={() => abrir("https://joeljota.com.br")} />
              </>
            }
          />
          <Input
            rotulo="Instagram"
            defaultValue="@joeljota"
            acoes={
              <>
                <AcaoCampo icone={Copy} rotulo="Copiar Instagram" onClick={() => copiar("@joeljota")} />
                <AcaoCampo icone={InstagramLogo} rotulo="Abrir Instagram" onClick={() => abrir("https://instagram.com/joeljota")} />
              </>
            }
          />
          {/* O arquivo encosta o switch no pé da coluna, 8px acima da base. */}
          <div className="flex items-end pb-2">
            <Switch checked={prosseguir} onChange={(e) => setProsseguir(e.target.checked)}>
              Deseja prosseguir
            </Switch>
          </div>
        </div>
      </DrawerSecao>

      <DrawerSecao titulo="Contatos">
        <div className="grid grid-cols-3 gap-3">
          <Input
            rotulo="E-mail"
            defaultValue="contato@joeljota.com.br"
            acoes={
              <>
                <AcaoCampo icone={Copy} rotulo="Copiar e-mail" onClick={() => copiar("contato@joeljota.com.br")} />
                <AcaoCampo icone={EnvelopeSimple} rotulo="Enviar e-mail" onClick={() => abrir("mailto:contato@joeljota.com.br")} />
              </>
            }
          />
          <Input
            rotulo="Telefone"
            placeholder="+55 (00) 00000-0000"
            acoes={
              <>
                <AcaoCampo icone={Copy} rotulo="Copiar telefone" />
                <AcaoCampo icone={Phone} rotulo="Ligar" />
              </>
            }
          />
        </div>
      </DrawerSecao>

      <DrawerSecao titulo="Contato principal">
        <div className="flex justify-center">
          <Button variant="soft">
            <Plus size={16} weight="regular" />
            Vincular pessoa
          </Button>
        </div>
      </DrawerSecao>

      <DrawerSecao titulo="Empresa mãe">
        <div className="flex items-center gap-2">
          <Avatar nome="Jojota Podcast LTDA." size="md" aria-hidden="true" />
          <p className="text-label-lg text-foreground">Jojota Podcast LTDA.</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Input
            rotulo="Telefone"
            defaultValue="+55 (45) 64564-5645"
            acoes={
              <>
                <AcaoCampo icone={Copy} rotulo="Copiar telefone" onClick={() => copiar("+55 (45) 64564-5645")} />
                <AcaoCampo icone={Phone} rotulo="Ligar" onClick={() => abrir("tel:+5545645645645")} />
              </>
            }
          />
          <Input
            rotulo="E-mail"
            defaultValue="contato@joeljota.com.br"
            acoes={
              <>
                <AcaoCampo icone={Copy} rotulo="Copiar e-mail" onClick={() => copiar("contato@joeljota.com.br")} />
                <AcaoCampo icone={EnvelopeSimple} rotulo="Enviar e-mail" onClick={() => abrir("mailto:contato@joeljota.com.br")} />
              </>
            }
          />
          <Input
            rotulo="Site"
            defaultValue="joeljota.com.br"
            acoes={
              <>
                <AcaoCampo icone={Copy} rotulo="Copiar site" onClick={() => copiar("joeljota.com.br")} />
                <AcaoCampo icone={ArrowSquareOut} rotulo="Abrir site" onClick={() => abrir("https://joeljota.com.br")} />
              </>
            }
          />
        </div>
      </DrawerSecao>

      <DrawerSecao titulo="Campos personalizados">
        <div className="grid grid-cols-3 gap-3">
          <Input
            rotulo="Quantos colaboradores"
            inputMode="numeric"
            value={String(colaboradores)}
            onChange={(e) => setColaboradores(Number(e.target.value.replace(/\D/g, "")) || 0)}
            acoes={
              <>
                <AcaoCampo icone={Minus} rotulo="Diminuir" onClick={() => setColaboradores((n) => Math.max(0, n - 1))} />
                <AcaoCampo icone={Plus} rotulo="Aumentar" onClick={() => setColaboradores((n) => n + 1)} />
              </>
            }
          />
          <CampoSelect rotulo="Reclamações" valor={reclamacao} aoEscolher={setReclamacao} />
          <Input rotulo="Data de chegada" placeholder="dd/mm/aaaa hh:mm" iconeInicio={CalendarBlank} />
        </div>
      </DrawerSecao>
    </>
  );
}

function ConteudoCampos() {
  const [score, setScore] = React.useState(3);
  const [restrito, setRestrito] = React.useState(4);
  const [reclamacao, setReclamacao] = React.useState<string>();
  const editar = (rotulo: string) => <AcaoCampo icone={PencilSimple} rotulo={`Editar ${rotulo.toLowerCase()}`} />;
  return (
    <>
      <DrawerSecao titulo="Campos gerais">
        <div className="grid grid-cols-3 gap-3">
          <Rating rotulo="ScoreDavi" valor={score} aoMudar={setScore} />
          <Input rotulo="Habilita empresa" placeholder="Insira um valor" acoes={editar("Habilita empresa")} />
        </div>
      </DrawerSecao>
      <DrawerSecao titulo="Suporte">
        <div className="grid grid-cols-3 gap-3">
          <CampoSelect rotulo="Reclamações" valor={reclamacao} aoEscolher={setReclamacao} />
          <Input rotulo="Data de chegada" placeholder="dd/mm/aaaa hh:mm" iconeInicio={CalendarBlank} />
          <Input rotulo="Texto de até 50 palavras" placeholder="Insira um valor" acoes={editar("Texto")} />
        </div>
      </DrawerSecao>
      <DrawerSecao titulo="Empresa restrito">
        <div className="grid grid-cols-3 gap-3">
          <Rating rotulo="Restrito 6" valor={restrito} aoMudar={setRestrito} />
          <Input rotulo="Observação interna" defaultValue="Prefere e-mail" acoes={editar("Observação interna")} />
        </div>
      </DrawerSecao>
      <div className="flex justify-center">
        <Button variant="soft">
          <Plus size={16} weight="regular" />
          Adicionar campo
        </Button>
      </div>
    </>
  );
}

const colunasNegocios: ColunaTabela[] = [
  { chave: "negocio", rotulo: "Negócio / Pipeline", peso: 248 },
  { chave: "produto", rotulo: "Produto", peso: 116 },
  { chave: "etapa", rotulo: "Etapa", peso: 106 },
  { chave: "status", rotulo: "Status", peso: 116 },
  { chave: "data", rotulo: "Data", peso: 92 },
  { chave: "acoes", rotulo: "", peso: 40, alinharFim: true },
];

const negocios = [
  { id: "8", empresa: "Satay", etapa: "Payment" },
  { id: "7", empresa: "Microsoft", etapa: "Cart" },
  { id: "6", empresa: "Tio Bill Gates", etapa: "Visitor" },
];

function ConteudoNegocios() {
  return (
    <>
      <DrawerMetricas
        colunas={4}
        estilo="fill"
        itens={[
          { rotulo: "Ticket médio", valor: "R$ 3.290,00" },
          { rotulo: "Total", valor: "R$ 9.877,00" },
          { rotulo: "Ciclo de compra", valor: "89d" },
          { rotulo: "Última compra", valor: "3d" },
        ]}
      />
      <DataTableToolbar layout="compacta" rotulo="Total de negócios" total="3 negócios">
        <Button variant="outline">
          <CaretDown size={16} weight="regular" />
          Todas as pipelines
        </Button>
        <Button variant="outline">
          <FunnelSimple size={16} weight="regular" />
          Filtros
        </Button>
      </DataTableToolbar>
      <DataTable layout="compacta" colunas={colunasNegocios}>
        {negocios.map((n) => (
          <DataTableRow key={n.id}>
            <DataTableCell primeira>
              <CelulaDupla principal={`#${n.id} · E-commerce Sales`} apoio={n.empresa} />
            </DataTableCell>
            <DataTableCell>
              <p className="truncate text-body-md text-muted-foreground">Sem produto</p>
            </DataTableCell>
            <DataTableCell>
              <p className="truncate text-body-md text-foreground">{n.etapa}</p>
            </DataTableCell>
            <DataTableCell>
              <Tag status="info">Em aberto</Tag>
            </DataTableCell>
            <DataTableCell>
              <p className="text-body-md tabular-nums text-foreground">20/08/2026</p>
            </DataTableCell>
            <DataTableCell ultima>
              <CelulaAcoes rotulo={`Ações do negócio #${n.id}`} />
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTable>
      <div className="flex justify-center">
        <Button variant="soft">
          <Handshake size={16} weight="regular" />
          Criar negócio
        </Button>
      </div>
    </>
  );
}

function ConteudoHierarquia() {
  const [fechados, setFechados] = React.useState<string[]>([]);
  const alternar = (id: string) =>
    setFechados((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const maeFechada = fechados.includes("microsoft");
  const atualFechada = maeFechada || fechados.includes("xbox");
  const linha = "absolute bg-base-blue-200";

  return (
    <HierarquiaCanvas rotulos={{ aproximar: "Aproximar", afastar: "Afastar", ajustar: "Voltar ao tamanho original" }}>
      {maeFechada ? null : (
        <>
          <div className={cn(linha, "left-[328px] top-[156px] h-6 w-px")} />
          <div className={cn(linha, "left-[120px] top-[180px] h-px w-[416px]")} />
          <div className={cn(linha, "left-[120px] top-[180px] h-6 w-px")} />
          <div className={cn(linha, "left-[536px] top-[180px] h-6 w-px")} />
          <HierarquiaNo
            className="absolute left-8 top-[204px]"
            nome="XBOX"
            subtitulo="Empresa"
            tipo="Empresa atual"
            atual
            recolher={{
              rotulo: fechados.includes("xbox") ? "Mostrar empresas filhas de XBOX" : "Recolher empresas filhas de XBOX",
              aoClicar: () => alternar("xbox"),
              recolhido: fechados.includes("xbox"),
            }}
          />
          <HierarquiaNo className="absolute left-[448px] top-[204px]" nome="BMG Ariola" subtitulo="Empresa" tipo="Parceiro" />
        </>
      )}
      {atualFechada ? null : (
        <>
          <div className={cn(linha, "left-[120px] top-[336px] h-6 w-px")} />
          <div className={cn(linha, "left-[120px] top-[360px] h-px w-[416px]")} />
          <div className={cn(linha, "left-[328px] top-[360px] h-6 w-px")} />
          <div className={cn(linha, "left-[536px] top-[360px] h-6 w-px")} />
          <HierarquiaNo className="absolute left-[240px] top-[384px]" nome="Azure" subtitulo="Empresa" tipo="Empresa filha" />
          <HierarquiaNo className="absolute left-[448px] top-[384px]" nome="QUEEN" subtitulo="Empresa" tipo="Empresa filha" />
        </>
      )}
      <HierarquiaNo
        className="absolute left-[240px] top-6"
        nome="Microsoft"
        subtitulo="Empresa"
        tipo="Empresa mãe"
        recolher={{
          rotulo: maeFechada ? "Mostrar empresas ligadas à Microsoft" : "Recolher empresas ligadas à Microsoft",
          aoClicar: () => alternar("microsoft"),
          recolhido: maeFechada,
        }}
      />
    </HierarquiaCanvas>
  );
}

const cabecalhos: Record<string, { titulo: string; descricao: string; Corpo: () => React.ReactElement }> = {
  historicos: { titulo: "Histórico", descricao: "Veja o histórico do seu lead", Corpo: ConteudoHistorico },
  perfil: { titulo: "Perfil", descricao: "Dados cadastrais e contatos do lead", Corpo: ConteudoPerfil },
  campos: {
    titulo: "Campos adicionais",
    descricao: "Informações personalizadas configuradas para este lead",
    Corpo: ConteudoCampos,
  },
  negocios: { titulo: "Negócios", descricao: "Negócios e pipelines vinculados ao lead", Corpo: ConteudoNegocios },
  hierarquia: {
    titulo: "Hierarquia",
    descricao: "Relações entre empresas mãe, filhas e parceiras",
    Corpo: ConteudoHierarquia,
  },
};

/* ------------------------------------------------------------------ Tela -- */

export function DrawerLead({
  lead = "rafael",
  estilo = "outline",
  menuInicial = "historicos",
  aoFechar,
  className,
}: {
  lead?: keyof typeof LEADS;
  estilo?: "outline" | "fill";
  menuInicial?: string;
  aoFechar?: () => void;
  className?: string;
}) {
  const dados = LEADS[lead];
  const [menu, setMenu] = React.useState(menuInicial);
  const [perfilAberto, setPerfilAberto] = React.useState(true);
  const [tags, setTags] = React.useState(dados.tags);

  const item = MENU_LEAD.find((m) => m.id === menu) ?? MENU_LEAD[0];
  const desenhado = cabecalhos[menu];
  const Corpo = desenhado?.Corpo;

  return (
    <DrawerPainel className={className}>
      {perfilAberto ? (
        <DrawerPerfil
          nome={dados.nome}
          tipo={dados.tipo}
          rotuloTipo={dados.tipo === "pessoa" ? "Pessoa" : "Empresa"}
          telefone={dados.telefone}
          email={dados.email}
          estilo={estilo}
          aoFechar={aoFechar}
          aoRecolher={() => setPerfilAberto(false)}
          tags={
            <>
              {tags.map((t) => (
                <Tag key={t.rotulo} status={t.status} foto={t.foto}>
                  {t.rotulo}
                </Tag>
              ))}
              <TagAdicionar
                rotulo="Adicionar tag"
                onClick={() => setTags((ts) => [...ts, { rotulo: `Nova ${ts.length - dados.tags.length + 1}` }])}
              />
            </>
          }
          acoes={
            <>
              <Button>
                <Play size={16} weight="regular" />
                Automação
              </Button>
              <Button variant="soft">
                <Plus size={16} weight="regular" />
                Atendimento
              </Button>
            </>
          }
        >
          <DrawerBloco titulo="Métricas">
            <DrawerMetricas itens={dados.metricas} />
          </DrawerBloco>
          <DrawerBloco titulo="Contato principal">
            <DrawerContato linhas={dados.contato} />
          </DrawerBloco>
          <DrawerBloco titulo="Menu">
            <DrawerMenu rotulo="Seções do lead" itens={MENU_LEAD} atual={menu} aoEscolher={setMenu} />
          </DrawerBloco>
        </DrawerPerfil>
      ) : null}

      <DrawerConteudo
        titulo={desenhado?.titulo ?? item.rotulo}
        descricao={desenhado?.descricao}
        antesDoTitulo={
          perfilAberto ? null : (
            <DrawerBotaoCanto rotulo="Mostrar perfil" onClick={() => setPerfilAberto(true)} className="bg-background">
              <SidebarSimple size={12} weight="regular" aria-hidden="true" />
            </DrawerBotaoCanto>
          )
        }
        acoes={
          <>
            <Button variant="outline">
              <FunnelSimple size={16} weight="regular" />
              Todos
            </Button>
            <Button variant="soft">
              <ChatText size={16} weight="regular" />
              Comentário
            </Button>
          </>
        }
      >
        {Corpo ? (
          <Corpo />
        ) : (
          <p className="text-body-md text-muted-foreground">
            O arquivo ainda não desenha o conteúdo de {item.rotulo}.
          </p>
        )}
      </DrawerConteudo>
    </DrawerPainel>
  );
}
