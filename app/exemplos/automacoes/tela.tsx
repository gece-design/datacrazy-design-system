"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChatCircleDots,
  DotsThree,
  FlowArrow,
  Gear,
  House,
  Kanban,
  Lightning,
  Plus,
  Question,
  Robot,
  Star,
  UsersThree,
} from "@phosphor-icons/react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ComboboxPainel } from "@/components/ui/combobox";
import { HeaderDivisor, Notificacoes, type Notificacao } from "@/components/ui/header";
import { Menu } from "@/components/ui/menu";
import { SidebarBrand, SidebarGrupo, SidebarItem, SidebarRodape, SidebarThemeSwitch, SidebarTopo, SidebarUser } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { TelaBase } from "@/components/ui/tela-base";
import { Toaster, toast } from "@/components/ui/toast";
import { useTema } from "@/lib/tema";
import { Canvas, ICONES_DOS_BLOCOS } from "./canvas";
import { AUTOMACAO, TIPOS, saidasDe, type Bloco, type TipoDeBloco } from "./dados";
import { PainelDoBloco } from "./painel-bloco";

/* ---------------------------------------------------------------------------
   Tela de exemplo — NÃO é componente do design system.

   O construtor de automações do CRM: os blocos do fluxo num canvas, ligados
   por conectores, e o bloco aberto num painel ao lado. A tela de hoje abre
   cada bloco por cima do fluxo; aqui o fluxo continua à vista enquanto a
   pessoa edita, e clicar em outro bloco troca o painel sem fechar nada.

   Peças do DS: TelaBase, Header de uma linha, PainelLateral, Input, Textarea,
   Select, ComboboxPainel, Menu, Switch, Button, IconeDeMarca. O canvas é o
   arranjo desta tela (./canvas), como o quadro é o do pipeline.
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

const FAVORITOS = ["Boas-vindas pelo WhatsApp", "Lembrete de proposta"];

const APOIO = [
  { rotulo: "Ajuda", icone: Question },
  { rotulo: "Configurações", icone: Gear },
];

const NOTIFICACOES: Notificacao[] = [
  { id: "1", icone: Lightning, titulo: "Automação com erro", detalhe: "Boas-vindas pelo WhatsApp: 3 mensagens não foram enviadas hoje.", quando: "há 20 min", lida: false },
];

/** Os blocos que dá para adicionar: o gatilho já existe e é um só. */
const BLOCOS_PARA_ADICIONAR = (Object.keys(TIPOS) as TipoDeBloco[])
  .filter((t) => t !== "gatilho")
  .map((t) => {
    const Icone = ICONES_DOS_BLOCOS[t];
    return { valor: t, rotulo: TIPOS[t].rotulo, icone: <Icone size={16} weight="regular" aria-hidden="true" className="shrink-0" /> };
  });

export function Tela() {
  const [rota, setRota] = React.useState("Automações");
  const [blocos, setBlocos] = React.useState<Bloco[]>(AUTOMACAO);
  const [selecionado, setSelecionado] = React.useState<string | null>(null);
  const [ativa, setAtiva] = React.useState(true);
  const [adicionando, setAdicionando] = React.useState(false);
  const [maisAcoes, setMaisAcoes] = React.useState(false);
  const [notificacoes, setNotificacoes] = React.useState(NOTIFICACOES);
  const botaoAdicionar = React.useRef<HTMLButtonElement>(null);
  const botaoMais = React.useRef<HTMLButtonElement>(null);
  const { tema, mudar } = useTema();

  const aberto = blocos.find((b) => b.id === selecionado) ?? null;
  const editar = (id: string, campos: Partial<Bloco>) => setBlocos((bs) => bs.map((b) => (b.id === id ? { ...b, ...campos } : b)));

  function adicionar(tipo: TipoDeBloco) {
    const id = `${tipo}-${Date.now()}`;
    // o bloco novo nasce à direita de tudo, sem ligação: quem liga é a saída de outro bloco
    const x = Math.max(...blocos.map((b) => b.x)) + 336;
    const itens = tipo === "randomizador" ? ["Oferta A", "Oferta B"] : [];
    const novo: Bloco = {
      id,
      tipo,
      titulo: TIPOS[tipo].rotulo,
      x,
      y: 24,
      itens,
      saidas: saidasDe(tipo, itens),
      ...(tipo === "mensagem" ? { canal: "WhatsApp" as const, texto: "" } : {}),
      ...(tipo === "espera" ? { espera: { valor: 1, unidade: "horas" as const } } : {}),
    };
    setBlocos((bs) => [...bs, novo]);
    setSelecionado(id);
  }

  function remover(id: string) {
    // quem apontava para o bloco fica sem destino
    setBlocos((bs) => bs.filter((b) => b.id !== id).map((b) => ({ ...b, saidas: b.saidas.map((s) => (s.para === id ? { ...s, para: undefined } : s)) })));
    setSelecionado(null);
    toast({ variant: "info", titulo: "Bloco removido", descricao: "As saídas que chegavam nele ficaram sem destino." });
  }

  return (
    <TelaBase
      memoria="automacoes"
      recuo={false}
      lateral={
        aberto ? (
          <PainelDoBloco
            bloco={aberto}
            blocos={blocos}
            aoEditar={(campos) => editar(aberto.id, campos)}
            aoRemover={() => remover(aberto.id)}
            aoFechar={() => setSelecionado(null)}
          />
        ) : null
      }
      navegacao={
        <>
          <SidebarTopo>
            <SidebarBrand />
            <SidebarGrupo>
              {PRINCIPAIS.map((r) => (
                <SidebarItem key={r.rotulo} icone={r.icone} componente="button" selecionado={r.rotulo === rota} onClick={() => setRota(r.rotulo)}>
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
            <SidebarUser nome="Gabriel Correa" email="gece@datacrazy.com" />
          </SidebarRodape>
        </>
      }
      cabecalho={{
        titulo: "Boas-vindas pelo WhatsApp",
        trilha: (
          <Breadcrumb
            ancestrais
            rotulo="Trilha de navegação"
            rotuloRecolhidos={(n) => `Mostrar ${n} níveis ocultos`}
            itens={[{ rotulo: "Início" }, { rotulo: "Automações", icone: FlowArrow }]}
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
            {/* liga e desliga na hora: é Switch, não botão de salvar */}
            <Switch
              checked={ativa}
              onChange={(e) => {
                setAtiva(e.target.checked);
                toast({ variant: "info", titulo: e.target.checked ? "Automação ativa" : "Automação pausada", descricao: e.target.checked ? "Novos leads entram no fluxo." : "Quem já está no fluxo termina; ninguém novo entra." });
              }}
            >
              Ativa
            </Switch>
            <Button ref={botaoAdicionar} variant="tertiary" aria-haspopup="dialog" aria-expanded={adicionando} onClick={() => setAdicionando((a) => !a)}>
              <Plus size={16} weight="regular" aria-hidden="true" />
              Bloco
            </Button>
            <ComboboxPainel
              aberto={adicionando}
              aoFechar={(devolver = true) => {
                setAdicionando(false);
                if (devolver) botaoAdicionar.current?.focus();
              }}
              gatilho={botaoAdicionar}
              rotulo="Adicionar bloco"
              opcoes={BLOCOS_PARA_ADICIONAR}
              selecionados={[]}
              aoAlternar={(tipo) => adicionar(tipo as TipoDeBloco)}
              rotulos={{ busca: "Buscar bloco", vazio: "Nenhum bloco encontrado" }}
            />
            <Button
              ref={botaoMais}
              variant="tertiary"
              size="icon"
              aria-label="Mais ações"
              title="Mais ações"
              aria-haspopup="menu"
              aria-expanded={maisAcoes}
              onClick={() => setMaisAcoes((a) => !a)}
            >
              <DotsThree size={16} weight="bold" aria-hidden="true" />
            </Button>
            <Menu
              aberto={maisAcoes}
              gatilho={botaoMais}
              rotulo="Mais ações"
              itens={["Duplicar automação", "Exportar automação", "Adicionar anotação"].map((rotulo) => ({
                id: rotulo,
                rotulo,
                aoAtivar: () => toast({ variant: "info", titulo: rotulo, descricao: "No CRM: a ação da automação." }),
              }))}
              aoFechar={(devolver = true) => {
                setMaisAcoes(false);
                if (devolver) botaoMais.current?.focus();
              }}
            />
            <HeaderDivisor />
            <Button onClick={() => toast({ titulo: "Automação salva", descricao: `${blocos.length} blocos no fluxo.` })}>Salvar</Button>
          </>
        ),
      }}
    >
      <Canvas
        blocos={blocos}
        selecionado={selecionado}
        aoSelecionar={setSelecionado}
        aoMover={(id, x, y) => editar(id, { x, y })}
        rotulos={{
          aproximar: "Aproximar",
          afastar: "Afastar",
          ajustar: "Ajustar à tela",
          sucessos: "Sucessos",
          alertas: "Alertas",
          erros: "Erros",
        }}
      />
      <Toaster />
    </TelaBase>
  );
}
