"use client";

import * as React from "react";
import {
  ArrowsClockwise,
  ArrowSquareOut,
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
  Play,
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
import { Tag, SeletorTags, tomDe, type GrupoTags, type OpcaoTag } from "@/components/ui/tag";
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
  SeletorDeVisao,
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
  type VisaoDoMenu,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

/* Composição do showcase: os dados do arquivo (Figma 565:5959) montados com os
   componentes do DS. Nada aqui é componente — é a tela de exemplo. */

/** O catálogo de tags da conta, por aba do seletor. */
export const CATALOGO_TAGS: GrupoTags[] = [
  {
    id: "status",
    rotulo: "Status",
    tags: [
      // A cor do status não é escolha: vem do significado.
      { id: "abandonou", rotulo: "Abandonou", status: "destructive", tom: "vermelho" },
      { id: "agendado", rotulo: "Agendado", status: "success", tom: "verde" },
      { id: "passou", rotulo: "Passou", status: "info", tom: "ciano" },
      { id: "em-aberto", rotulo: "Em aberto", status: "info", tom: "azul" },
    ],
  },
  {
    id: "listas",
    rotulo: "Listas",
    // a única aba em que a cor é escolha de quem cria
    corLivre: true,
    tags: [
      // Cor livre. Sem escolha, `tomDe` dá uma — a lista nunca nasce cinza.
      { id: "lista-de-leads", rotulo: "Lista de leads", tom: tomDe("lista-de-leads") },
      { id: "isaias-123", rotulo: "Isaias 123", tom: tomDe("isaias-123") },
      { id: "prospect-list", rotulo: "Prospect list", tom: tomDe("prospect-list") },
      { id: "premium", rotulo: "Premium", tom: "ambar" },
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
      // Escala, não categoria: o tom sobe junto com o ícone.
      { id: "frio", rotulo: "Frio", tom: "ciano", icone: Snowflake },
      { id: "morno", rotulo: "Morno", tom: "ambar", icone: ThermometerSimple },
      { id: "quente", rotulo: "Quente", tom: "vermelho", icone: Fire },
    ],
  },
];

/** No perfil, o atendente vem primeiro — é a ordem do arquivo. */
const ORDEM_NO_PERFIL = ["atendentes", "listas", "status", "temperatura"];

export function tagsEscolhidas(grupos: GrupoTags[], ids: string[]): OpcaoTag[] {
  return ORDEM_NO_PERFIL.flatMap((g) => grupos.find((x) => x.id === g)?.tags ?? []).filter((t) => ids.includes(t.id));
}

type Lead = {
  nome: string;
  tipo: "pessoa" | "empresa";
  telefone: string;
  email: string;
  tags: string[];
  metricas: MetricaDrawer[];
  contato: LinhaContato[];
};

export const LEADS: Record<"rafael" | "joel", Lead> = {
  rafael: {
    nome: "Rafael Pinto Pinheiro",
    tipo: "pessoa",
    telefone: "+55 (54) 44346-5346",
    email: "contato@datacrazy.com",
    tags: ["esther", "lista-de-leads", "isaias-123", "abandonou", "agendado", "frio"],
    metricas: [
      { rotulo: "Ticket médio", valor: "R$ 0,00", icone: CurrencyCircleDollar, tom: "azul" },
      { rotulo: "Total", valor: "R$ 0,00", icone: Wallet, tom: "roxo" },
      { rotulo: "Ciclo de compra", valor: "0d", icone: ArrowsClockwise, tom: "rosa" },
      { rotulo: "Última compra", valor: "0d", icone: CalendarCheck, tom: "laranja" },
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
    tags: ["liam", "prospect-list", "premium", "passou", "agendado", "warm"],
    metricas: [
      { rotulo: "Ticket médio", valor: "R$ 150,00", icone: CurrencyCircleDollar, tom: "azul" },
      { rotulo: "Total", valor: "R$ 9.877,00", icone: Wallet, tom: "roxo" },
      { rotulo: "Ciclo de compra", valor: "89d", icone: ArrowsClockwise, tom: "rosa" },
      { rotulo: "Última compra", valor: "3d", icone: CalendarCheck, tom: "laranja" },
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
        <div className="grid grid-cols-3 gap-3">
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
        <div className="grid grid-cols-3 gap-3">
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
        <div className="grid grid-cols-3 gap-3">
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
        <div className="grid grid-cols-3 gap-3">
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
        <div className="grid grid-cols-3 gap-3">
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
        <div className="grid grid-cols-3 gap-3">
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
          { rotulo: "Ticket médio", valor: "R$ 3.290,00", icone: CurrencyCircleDollar, tom: "azul" },
          { rotulo: "Total", valor: "R$ 9.877,00", icone: Wallet, tom: "roxo" },
          { rotulo: "Ciclo de compra", valor: "89d", icone: ArrowsClockwise, tom: "rosa" },
          { rotulo: "Última compra", valor: "3d", icone: CalendarCheck, tom: "laranja" },
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

export function DrawerLead({
  lead = "rafael",
  estilo = "outline",
  tom,
  menuInicial = "historicos",
  aoFechar,
  className,
}: {
  lead?: keyof typeof LEADS;
  estilo?: "outline" | "fill";
  tom?: TomPerfil;
  menuInicial?: string;
  aoFechar?: () => void;
  className?: string;
}) {
  const dados = LEADS[lead];
  const [menu, setMenu] = React.useState(menuInicial);
  const [perfilAberto, setPerfilAberto] = React.useState(true);
  // Quem fixa é a pessoa, e cada lead guarda a própria lista no CRM.
  const [fixados, setFixados] = React.useState<string[]>(["negocios"]);
  const [visaoMenu, setVisaoMenu] = React.useState<VisaoDoMenu>("lista");

  const item = MENU_LEAD.find((m) => m.id === menu) ?? MENU_LEAD[0];
  const desenhado = cabecalhos[menu];
  const Corpo = desenhado?.Corpo;

  return (
    <DrawerPainel className={className}>
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
          tags={<TagsDoLead iniciais={dados.tags} />}
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
          <DrawerBloco
            titulo="Menu"
            acoes={
              <SeletorDeVisao
                modo={visaoMenu}
                aoMudar={setVisaoMenu}
                rotulo={visaoMenu === "cards" ? "Ver o menu em lista" : "Ver o menu em cards"}
              />
            }
          >
            <DrawerMenu
              rotulo="Seções do lead"
              itens={MENU_LEAD}
              atual={menu}
              aoEscolher={setMenu}
              visao={visaoMenu}
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
  );
}
