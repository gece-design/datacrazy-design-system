"use client";

import * as React from "react";
import {
  ArrowsClockwise,
  ArrowSquareOut,
  Briefcase,
  Buildings,
  CalendarBlank,
  CalendarCheck,
  CurrencyCircleDollar,
  CaretDown,
  ChatCircleDots,
  ChatText,
  ClockCounterClockwise,
  EnvelopeSimple,
  File,
  Fire,
  FunnelSimple,
  Handshake,
  InstagramLogo,
  MapPin,
  Minus,
  Note,
  Phone,
  Lightning,
  Plus,
  Pulse,
  SidebarSimple,
  Snowflake,
  SquaresFour,
  ThermometerSimple,
  Toolbox,
  TreeStructure,
  User,
  Users,
  UsersThree,
  Wallet,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Tag, SeletorTags, type GrupoTags, type OpcaoTag } from "@/components/ui/tag";
import { Avatar } from "@/components/ui/avatar";
import { Input, AcaoCampo, AcaoCopiar, CampoEditavel, CartaoDeCampo } from "@/components/ui/input";
import { InputTelefone, telefoneCompleto } from "@/components/ui/telefone";
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
  type TomPerfil,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { gradeDeCartoes } from "@/lib/campo";

/* Composição do showcase: os dados do arquivo (Figma 565:5959) montados com os
   componentes do DS. Nada aqui é componente — é a tela de exemplo. */

/** O catálogo de tags da conta, por aba do seletor. */
export const CATALOGO_TAGS: GrupoTags[] = [
  {
    id: "status",
    rotulo: "Status",
    tags: [
      // A bolinha do status vem do significado; a pílula fica cinza (cliente, 2026-09-18).
      { id: "abandonou", rotulo: "Abandonou", status: "destructive" },
      { id: "agendado", rotulo: "Agendado", status: "success" },
      { id: "passou", rotulo: "Passou", status: "info" },
      { id: "em-aberto", rotulo: "Em aberto", status: "info" },
    ],
  },
  {
    id: "listas",
    rotulo: "Listas",
    tags: [
      { id: "lista-de-leads", rotulo: "Lista de leads" },
      { id: "isaias-123", rotulo: "Isaias 123" },
      { id: "prospect-list", rotulo: "Prospect list" },
      { id: "premium", rotulo: "Premium" },
    ],
  },
  {
    id: "atendentes",
    rotulo: "Atendentes",
    tags: [
      // Atendente não leva cor: a foto já distingue. Sem foto, o ícone de pessoa
      // segura o lugar — a tag não fica um texto solto no cinza.
      { id: "esther", rotulo: "Esther", foto: "/ds/atendente.png" },
      { id: "liam", rotulo: "Liam", foto: "/ds/atendente-2.svg" },
      { id: "marina", rotulo: "Marina", icone: User },
      { id: "camila", rotulo: "Camila", foto: "/ds/atendente-3.svg" },
      { id: "diego", rotulo: "Diego", foto: "/ds/atendente-4.svg" },
    ],
  },
  {
    id: "temperatura",
    rotulo: "Temperatura",
    tags: [
      // Escala, não categoria: o ícone diz o degrau, na cor dele.
      { id: "frio", rotulo: "Frio", icone: Snowflake, tom: "ciano" },
      { id: "morno", rotulo: "Morno", icone: ThermometerSimple, tom: "laranja" },
      { id: "quente", rotulo: "Quente", icone: Fire, tom: "vermelho" },
    ],
  },
];

/** No perfil, o atendente vem primeiro — é a ordem do arquivo. */
const ORDEM_NO_PERFIL = ["atendentes", "listas", "status", "temperatura"];

export function tagsEscolhidas(grupos: GrupoTags[], ids: string[]): OpcaoTag[] {
  return ORDEM_NO_PERFIL.flatMap((g) => grupos.find((x) => x.id === g)?.tags ?? []).filter((t) => ids.includes(t.id));
}

/** A pessoa por trás de um lead empresa. Lead pessoa não tem (cliente, 2026-09-18). */
export type ContatoPrincipal = { nome: string; cargo?: string; telefone?: string; email?: string };

export type LeadDoDrawer = {
  nome: string;
  tipo: "pessoa" | "empresa";
  telefone: string;
  email: string;
  tags: string[];
  metricas: MetricaDrawer[];
  /** Só faz sentido quando `tipo` é `empresa`; em pessoa é ignorado. */
  contatoPrincipal?: ContatoPrincipal;
};

/** As linhas do bloco "Contato principal" do perfil, a partir da pessoa. */
export function linhasDoContato(c: ContatoPrincipal): LinhaContato[] {
  return [
    { texto: c.nome, icone: User, rotulo: "Nome" },
    c.cargo ? { texto: c.cargo, icone: Briefcase, rotulo: "Cargo" } : null,
    c.telefone ? { texto: c.telefone, icone: Phone, rotulo: "Telefone" } : null,
    c.email ? { texto: c.email, icone: EnvelopeSimple, rotulo: "E-mail" } : null,
  ].filter((l): l is LinhaContato => Boolean(l));
}

export const LEADS: Record<"rafael" | "joel", LeadDoDrawer> = {
  rafael: {
    nome: "Rafael Pinto Pinheiro",
    tipo: "pessoa",
    telefone: "+55 (54) 44346-5346",
    email: "contato@datacrazy.com",
    tags: ["esther", "lista-de-leads", "isaias-123", "abandonou", "agendado", "frio"],
    metricas: [
      { rotulo: "Ticket médio", valor: "R$ 0,00", icone: CurrencyCircleDollar },
      { rotulo: "Total", valor: "R$ 0,00", icone: Wallet },
      { rotulo: "Ciclo de compra", valor: "0d", icone: ArrowsClockwise },
      { rotulo: "Última compra", valor: "0d", icone: CalendarCheck },
    ],
  },
  joel: {
    nome: "Joel Jota",
    tipo: "empresa",
    telefone: "+55 (11) 98765-4321",
    email: "contact@datawave.com",
    tags: ["liam", "prospect-list", "premium", "passou", "agendado", "warm"],
    metricas: [
      { rotulo: "Ticket médio", valor: "R$ 150,00", icone: CurrencyCircleDollar },
      { rotulo: "Total", valor: "R$ 9.877,00", icone: Wallet },
      { rotulo: "Ciclo de compra", valor: "89d", icone: ArrowsClockwise },
      { rotulo: "Última compra", valor: "3d", icone: CalendarCheck },
    ],
    // Empresa tem uma pessoa por trás; é ela que atende o telefone.
    contatoPrincipal: { nome: "Alex Ferreira", cargo: "Diretor comercial", telefone: "+55 (21) 99876-5432", email: "alex@joeljota.com.br" },
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

const abrir = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

/* -------------------------------------------------------------- Conteúdos -- */

/** O lead aberto, para os conteúdos que dependem do tipo (o Perfil só mostra
 *  "Contato principal" quando o lead é empresa). */
const LeadAtual = React.createContext<LeadDoDrawer | null>(null);

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
    <CartaoDeCampo rotulo={rotulo}>
      <Select
        size="field"
        rotulo={rotulo}
        textoVazio="Selecione uma opção"
        opcoes={reclamacoes}
        valor={valor}
        aoEscolher={aoEscolher}
        className="block w-full"
      />
    </CartaoDeCampo>
  );
}

function ConteudoPerfil() {
  const lead = React.useContext(LeadAtual);
  const pessoa = lead?.tipo === "empresa" ? lead.contatoPrincipal : undefined;
  const [contato, setContato] = React.useState({ telefone: pessoa?.telefone ?? "", email: pessoa?.email ?? "" });
  const [prosseguir, setProsseguir] = React.useState(false);
  const [reclamacao, setReclamacao] = React.useState<string>();
  const [pais, setPais] = React.useState("BR");
  const [paisMae, setPaisMae] = React.useState("BR");
  const [dados, setDados] = React.useState({
    razao: "Joel Jota Performance LTDA",
    fantasia: "Joel Jota",
    cnpj: "",
    origem: "Indicação",
    segmento: "Educação e alta performance",
    fundacao: "",
    site: "joeljota.com.br",
    instagram: "@joeljota",
    email: "contato@joeljota.com.br",
    telefone: "",
    maeTelefone: "(45) 64564-5645",
    maeEmail: "contato@joeljota.com.br",
    maeSite: "joeljota.com.br",
    colaboradores: "45",
    chegada: "",
  });

  /** valor + aoSalvar de um campo, para não repetir o setState em cada um. */
  const campo = (chave: keyof typeof dados) => ({
    valor: dados[chave],
    aoSalvar: (v: string) => setDados((d) => ({ ...d, [chave]: v })),
  });

  return (
    <>
      <DrawerSecao titulo="Dados cadastrais">
        <div className={gradeDeCartoes}>
          <CampoEditavel rotulo="Razão social" {...campo("razao")} rotuloEditar="Editar razão social" textoVazio="Adicionar" />
          <CampoEditavel rotulo="Nome fantasia" {...campo("fantasia")} rotuloEditar="Editar nome fantasia" textoVazio="Adicionar" />
          <CampoEditavel
            rotulo="CNPJ"
            {...campo("cnpj")}
            rotuloEditar="Editar CNPJ"
            textoVazio="00.000.000/0000-00"
            inputMode="numeric"
            acoes={<AcaoCopiar rotulo="Copiar CNPJ" rotuloCopiado="CNPJ copiado" valor={dados.cnpj} />}
          />
          <CampoEditavel rotulo="Origem" {...campo("origem")} rotuloEditar="Editar origem" textoVazio="Adicionar" />
          <CampoEditavel rotulo="Segmento" {...campo("segmento")} rotuloEditar="Editar segmento" textoVazio="Adicionar" />
          <CampoEditavel
            rotulo="Data de fundação"
            {...campo("fundacao")}
            rotuloEditar="Editar data de fundação"
            textoVazio="dd/mm/aaaa"
            iconeInicio={CalendarBlank}
          />
          <CampoEditavel
            rotulo="Site"
            {...campo("site")}
            rotuloEditar="Editar site"
            textoVazio="Adicionar"
            acoes={
              <>
                <AcaoCopiar rotulo="Copiar site" rotuloCopiado="Site copiado" valor={dados.site} />
                <AcaoCampo icone={ArrowSquareOut} rotulo="Abrir site" onClick={() => abrir(`https://${dados.site}`)} />
              </>
            }
          />
          <CampoEditavel
            rotulo="Instagram"
            {...campo("instagram")}
            rotuloEditar="Editar Instagram"
            textoVazio="Adicionar"
            acoes={
              <>
                <AcaoCopiar rotulo="Copiar Instagram" rotuloCopiado="Instagram copiado" valor={dados.instagram} />
                <AcaoCampo
                  icone={InstagramLogo}
                  rotulo="Abrir Instagram"
                  onClick={() => abrir(`https://instagram.com/${dados.instagram.replace("@", "")}`)}
                />
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
        <div className={gradeDeCartoes}>
          <CampoEditavel
            rotulo="E-mail"
            {...campo("email")}
            rotuloEditar="Editar e-mail"
            textoVazio="Adicionar"
            acoes={
              <>
                <AcaoCopiar rotulo="Copiar e-mail" rotuloCopiado="E-mail copiado" valor={dados.email} />
                <AcaoCampo icone={EnvelopeSimple} rotulo="Enviar e-mail" onClick={() => abrir(`mailto:${dados.email}`)} />
              </>
            }
          />
          <InputTelefone
            cartao
            rotulo="Telefone"
            rotuloPais="País do telefone"
            pais={pais}
            aoMudarPais={setPais}
            valor={dados.telefone}
            aoMudar={(v) => setDados((d) => ({ ...d, telefone: v }))}
            placeholder="(00) 00000-0000"
            acoes={
              <AcaoCampo
                icone={Phone}
                rotulo="Ligar"
                onClick={() => abrir(`tel:${telefoneCompleto(pais, dados.telefone).replace(/\D/g, "")}`)}
              />
            }
          />
        </div>
      </DrawerSecao>

      {/* Só lead empresa tem contato principal — a pessoa que atende por ela.
          Lead pessoa não tem: ele é o próprio contato (cliente, 2026-09-18). */}
      {lead?.tipo === "empresa" ? (
        <DrawerSecao titulo="Contato principal">
          {pessoa ? (
            <>
              <div className="flex items-center gap-2">
                <Avatar nome={pessoa.nome} size="md" iniciais="duas" aria-hidden="true" />
                <div className="flex min-w-0 flex-col">
                  <p className="truncate text-label-lg text-foreground">{pessoa.nome}</p>
                  {pessoa.cargo ? <p className="truncate text-caption text-muted-foreground">{pessoa.cargo}</p> : null}
                </div>
              </div>
              <div className={gradeDeCartoes}>
                <CampoEditavel
                  rotulo="Telefone"
                  valor={contato.telefone}
                  aoSalvar={(v) => setContato((c) => ({ ...c, telefone: v }))}
                  rotuloEditar="Editar telefone do contato principal"
                  textoVazio="Adicionar"
                  acoes={
                    <>
                      <AcaoCopiar rotulo="Copiar telefone" rotuloCopiado="Telefone copiado" valor={contato.telefone} />
                      <AcaoCampo icone={Phone} rotulo="Ligar" onClick={() => abrir(`tel:${contato.telefone.replace(/\D/g, "")}`)} />
                    </>
                  }
                />
                <CampoEditavel
                  rotulo="E-mail"
                  valor={contato.email}
                  aoSalvar={(v) => setContato((c) => ({ ...c, email: v }))}
                  rotuloEditar="Editar e-mail do contato principal"
                  textoVazio="Adicionar"
                  acoes={
                    <>
                      <AcaoCopiar rotulo="Copiar e-mail" rotuloCopiado="E-mail copiado" valor={contato.email} />
                      <AcaoCampo icone={EnvelopeSimple} rotulo="Enviar e-mail" onClick={() => abrir(`mailto:${contato.email}`)} />
                    </>
                  }
                />
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <Button variant="soft">
                <Plus size={16} weight="regular" />
                Vincular pessoa
              </Button>
            </div>
          )}
        </DrawerSecao>
      ) : null}

      <DrawerSecao titulo="Empresa mãe">
        <div className="flex items-center gap-2">
          <Avatar nome="Jojota Podcast LTDA." size="md" aria-hidden="true" />
          <p className="text-label-lg text-foreground">Jojota Podcast LTDA.</p>
        </div>
        <div className={gradeDeCartoes}>
          <InputTelefone
            cartao
            rotulo="Telefone"
            rotuloPais="País do telefone da empresa mãe"
            pais={paisMae}
            aoMudarPais={setPaisMae}
            valor={dados.maeTelefone}
            aoMudar={(v) => setDados((d) => ({ ...d, maeTelefone: v }))}
            acoes={
              <AcaoCampo
                icone={Phone}
                rotulo="Ligar"
                onClick={() => abrir(`tel:${telefoneCompleto(paisMae, dados.maeTelefone).replace(/\D/g, "")}`)}
              />
            }
          />
          <CampoEditavel
            rotulo="E-mail"
            {...campo("maeEmail")}
            rotuloEditar="Editar e-mail da empresa mãe"
            textoVazio="Adicionar"
            acoes={
              <>
                <AcaoCopiar rotulo="Copiar e-mail" rotuloCopiado="E-mail copiado" valor={dados.maeEmail} />
                <AcaoCampo icone={EnvelopeSimple} rotulo="Enviar e-mail" onClick={() => abrir(`mailto:${dados.maeEmail}`)} />
              </>
            }
          />
          <CampoEditavel
            rotulo="Site"
            {...campo("maeSite")}
            rotuloEditar="Editar site da empresa mãe"
            textoVazio="Adicionar"
            acoes={
              <>
                <AcaoCopiar rotulo="Copiar site" rotuloCopiado="Site copiado" valor={dados.maeSite} />
                <AcaoCampo icone={ArrowSquareOut} rotulo="Abrir site" onClick={() => abrir(`https://${dados.maeSite}`)} />
              </>
            }
          />
        </div>
      </DrawerSecao>

      <DrawerSecao titulo="Campos personalizados">
        <div className={gradeDeCartoes}>
          {/* Contador segue campo aberto: o + e o − são a ação principal aqui. */}
          <Input
            cartao
            rotulo="Quantos colaboradores"
            inputMode="numeric"
            value={dados.colaboradores}
            onChange={(e) => setDados((d) => ({ ...d, colaboradores: e.target.value.replace(/\D/g, "") }))}
            acoes={
              <>
                <AcaoCampo
                  icone={Minus}
                  rotulo="Diminuir"
                  onClick={() => setDados((d) => ({ ...d, colaboradores: String(Math.max(0, Number(d.colaboradores || 0) - 1)) }))}
                />
                <AcaoCampo
                  icone={Plus}
                  rotulo="Aumentar"
                  onClick={() => setDados((d) => ({ ...d, colaboradores: String(Number(d.colaboradores || 0) + 1) }))}
                />
              </>
            }
          />
          <CampoSelect rotulo="Reclamações" valor={reclamacao} aoEscolher={setReclamacao} />
          <CampoEditavel
            rotulo="Data de chegada"
            {...campo("chegada")}
            rotuloEditar="Editar data de chegada"
            textoVazio="dd/mm/aaaa hh:mm"
            iconeInicio={CalendarBlank}
          />
        </div>
      </DrawerSecao>
    </>
  );
}

function ConteudoCampos() {
  const [score, setScore] = React.useState(7);
  const [restrito, setRestrito] = React.useState(9);
  const [reclamacao, setReclamacao] = React.useState<string>();
  const [textos, setTextos] = React.useState({ habilita: "", palavras: "", observacao: "Prefere e-mail" });
  const campo = (chave: keyof typeof textos) => ({
    valor: textos[chave],
    aoSalvar: (v: string) => setTextos((t) => ({ ...t, [chave]: v })),
  });
  return (
    <>
      <DrawerSecao titulo="Campos gerais">
        <div className={gradeDeCartoes}>
          <Rating rotulo="ScoreDavi" valor={score} aoMudar={setScore} />
          <CampoEditavel
            rotulo="Habilita empresa"
            {...campo("habilita")}
            rotuloEditar="Editar habilita empresa"
            textoVazio="Insira um valor"
          />
        </div>
      </DrawerSecao>
      <DrawerSecao titulo="Suporte">
        <div className={gradeDeCartoes}>
          <CampoSelect rotulo="Reclamações" valor={reclamacao} aoEscolher={setReclamacao} />
          <CampoEditavel
            rotulo="Data de chegada"
            valor=""
            aoSalvar={() => undefined}
            rotuloEditar="Editar data de chegada"
            textoVazio="dd/mm/aaaa hh:mm"
            iconeInicio={CalendarBlank}
          />
          <CampoEditavel
            rotulo="Texto de até 50 palavras"
            {...campo("palavras")}
            rotuloEditar="Editar texto"
            textoVazio="Insira um valor"
          />
        </div>
      </DrawerSecao>
      <DrawerSecao titulo="Empresa restrito">
        <div className={gradeDeCartoes}>
          <Rating rotulo="Restrito 6" valor={restrito} aoMudar={setRestrito} />
          <CampoEditavel
            rotulo="Observação interna"
            {...campo("observacao")}
            rotuloEditar="Editar observação interna"
            textoVazio="Insira um valor"
          />
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
        itens={[
          { rotulo: "Ticket médio", valor: "R$ 3.290,00", icone: CurrencyCircleDollar },
          { rotulo: "Total", valor: "R$ 9.877,00", icone: Wallet },
          { rotulo: "Ciclo de compra", valor: "89d", icone: ArrowsClockwise },
          { rotulo: "Última compra", valor: "3d", icone: CalendarCheck },
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

/* Exportado: a tela do pipeline (app/exemplos/pipeline) monta o MESMO drawer,
   com este menu e estes conteúdos. Duplicar lá seria uma segunda verdade. */
export const cabecalhos: Record<string, { titulo: string; descricao: string; Corpo: () => React.ReactElement }> = {
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

/* ------------------------------------------------------------ Tags do lead -- */

/** Fileira de tags do perfil com o seletor no fim. O catálogo é estado da
 *  tela: tag criada no seletor entra na aba e já sai escolhida. */
export function TagsDoLead({ iniciais }: { iniciais: string[] }) {
  const [grupos, setGrupos] = React.useState(CATALOGO_TAGS);
  const [escolhidas, setEscolhidas] = React.useState(iniciais);

  return (
    <>
      {tagsEscolhidas(grupos, escolhidas).map((t) => (
        <Tag key={t.id} status={t.status} foto={t.foto} tom={t.tom} icone={t.icone}>
          {t.rotulo}
        </Tag>
      ))}
      <SeletorTags
        grupos={grupos}
        selecionadas={escolhidas}
        aoAlternar={(t) => setEscolhidas((ids) => (ids.includes(t.id) ? ids.filter((x) => x !== t.id) : [...ids, t.id]))}
        aoCriar={(rotulo, grupoId, tom) => {
          const id = `${grupoId}-${Date.now()}`;
          setGrupos((gs) => gs.map((g) => (g.id === grupoId ? { ...g, tags: [...g.tags, { id, rotulo, tom }] } : g)));
          setEscolhidas((ids) => [...ids, id]);
        }}
        rotulos={{
          gatilho: "Adicionar tag",
          busca: "Buscar ou criar tag",
          vazio: "Nenhuma tag nesta aba",
          criar: (texto, grupo) => `Criar "${texto}" em ${grupo}`,
          cor: "Cor",
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ Tela -- */

export type SecaoDoDrawer = { titulo: string; descricao: string; Corpo: () => React.ReactElement };

/* `dados`, `tags` e `secoes` existem para a tela do pipeline (app/exemplos)
   abrir ESTE drawer com o lead clicado no quadro, em vez de montar um segundo.
   Sem eles, é o showcase: os dois leads do arquivo. */
export function DrawerLead({
  lead = "rafael",
  dados: dadosDeFora,
  tags,
  secoes,
  estilo = "outline",
  tom,
  menuInicial = "historicos",
  aoFechar,
  memoria,
  className,
}: {
  lead?: keyof typeof LEADS;
  /** O lead a mostrar. Sem ele, um dos dois do arquivo. */
  dados?: LeadDoDrawer;
  /** A fileira de tags do perfil. Sem ela, a do arquivo, com o seletor. */
  tags?: React.ReactNode;
  /** Seções com conteúdo próprio, por id do menu. As outras vêm do arquivo. */
  secoes?: Partial<Record<string, SecaoDoDrawer>>;
  estilo?: "outline" | "fill";
  tom?: TomPerfil;
  menuInicial?: string;
  aoFechar?: () => void;
  /** Chave do navegador que lembra a largura arrastada do painel. */
  memoria?: string;
  className?: string;
}) {
  const dados = dadosDeFora ?? LEADS[lead];
  const [menu, setMenu] = React.useState(menuInicial);
  const [perfilAberto, setPerfilAberto] = React.useState(true);
  // Quem fixa é a pessoa, e cada lead guarda a própria lista no CRM.
  const [fixados, setFixados] = React.useState<string[]>(["negocios"]);

  const item = MENU_LEAD.find((m) => m.id === menu) ?? MENU_LEAD[0];
  const desenhado = secoes?.[menu] ?? cabecalhos[menu];
  const Corpo = desenhado?.Corpo;

  return (
    <LeadAtual.Provider value={dados}>
    <DrawerPainel className={className} memoria={memoria}>
      {perfilAberto ? (
        <DrawerPerfil
          nome={dados.nome}
          tipo={dados.tipo}
          tom={tom}
          rotuloTipo={dados.tipo === "pessoa" ? "Pessoa" : "Empresa"}
          telefone={dados.telefone}
          email={dados.email}
          estilo={estilo}
          rotulosRolagem={{ subir: "Subir no perfil", descer: "Descer no perfil" }}
          aoFechar={aoFechar}
          aoRecolher={() => setPerfilAberto(false)}
          tags={tags ?? <TagsDoLead iniciais={dados.tags} />}
          acoes={
            <>
              {/* Raio, não Play: o triângulo "parecia uma seta" (Ryan, 2026-09-18). */}
              <Button>
                <Lightning size={16} weight="regular" />
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
          {/* Só empresa tem contato principal (a pessoa por trás); lead pessoa
              é o próprio contato e o bloco não existe (cliente, 2026-09-18). */}
          {dados.tipo === "empresa" ? (
            <DrawerBloco titulo="Contato principal">
              {dados.contatoPrincipal ? (
                <DrawerContato linhas={linhasDoContato(dados.contatoPrincipal)} />
              ) : (
                <div className="flex justify-center py-1">
                  <Button variant="soft" size="sm">
                    <Plus size={16} weight="regular" />
                    Vincular pessoa
                  </Button>
                </div>
              )}
            </DrawerBloco>
          ) : null}
          {/* O menu é o bloco que rola: ocupa o que sobra e nome, telefone,
              métricas e contato ficam sempre à vista (cliente, 2026-09-18). */}
          <DrawerBloco titulo="Menu" rolagem={{ subir: "Subir no menu", descer: "Descer no menu" }}>
            <DrawerMenu
              rotulo="Seções do lead"
              itens={MENU_LEAD}
              atual={menu}
              aoEscolher={setMenu}
              fixacao={{
                fixados,
                aoAlternar: (id) => setFixados((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
                rotuloFixar: (item) => `Fixar ${item.rotulo} no topo`,
                rotuloDesafixar: (item) => `Desafixar ${item.rotulo}`,
              }}
            />
          </DrawerBloco>
        </DrawerPerfil>
      ) : null}

      <DrawerConteudo
        titulo={desenhado?.titulo ?? item.rotulo}
        descricao={desenhado?.descricao}
        rotulosRolagem={{ subir: "Subir no conteúdo", descer: "Descer no conteúdo" }}
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
    </LeadAtual.Provider>
  );
}
