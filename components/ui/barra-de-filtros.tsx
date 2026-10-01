"use client";

import * as React from "react";
import { CaretDown, Plus, X, type Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ComboboxPainel, type OpcaoCombobox } from "@/components/ui/combobox";

/**
 * Barra de filtros — cada filtro ativo é um chip ("Etapa: Proposta"), e o
 * "+ Filtro" lista os campos que ainda não entraram. É o padrão para tela com
 * muitos campos de filtro (cliente, 2026-09-28: "sete grupos de checkbox
 * empilhados, sem busca, sem hierarquia entre filtro de um valor e de
 * vários"): só o que está ativo ocupa espaço, cada campo abre a própria lista
 * com busca (`ComboboxPainel`), e `unico` separa o campo de um valor do de
 * vários.
 *
 * Aplica na hora: sem botão de confirmar. Chip fechado sem nenhum valor some
 * — filtro vazio não filtra nada.
 */

export type CampoDeFiltro = {
  id: string;
  /** Nome do campo no chip e no "+ Filtro". Ex.: "Etapa". */
  rotulo: string;
  /** Ícone Phosphor do campo: 14px no chip, 16 na lista de campos. */
  icone?: Icon;
  opcoes: OpcaoCombobox[];
  /** Aceita um valor só: escolher troca e fecha. Padrão: vários, com caixa de marcar. */
  unico?: boolean;
};

/** Campo → valores escolhidos. Campo fora do objeto não está na barra. */
export type FiltrosAtivos = Record<string, string[]>;

/** Quantos campos estão filtrando de fato — o número do `HeaderFiltros`. */
export const contarFiltros = (valor: FiltrosAtivos) => Object.values(valor).filter((v) => v.length > 0).length;

export type RotulosDaBarraDeFiltros = {
  /** O botão que adiciona. Ex.: "Filtro". */
  adicionar: string;
  /** O botão que tira todos. Ex.: "Limpar". */
  limpar: string;
  /** Placeholder da busca nas listas. Ex.: "Buscar". */
  busca: string;
  /** Busca sem resultado. Ex.: "Nada encontrado". */
  vazio: string;
  /** Nome do X de cada chip. Ex.: (campo) => `Remover filtro ${campo}`. */
  remover: (campo: string) => string;
};

export interface BarraDeFiltrosProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Os campos que a tela deixa filtrar. */
  campos: CampoDeFiltro[];
  valor: FiltrosAtivos;
  aoMudar: (valor: FiltrosAtivos) => void;
  rotulos: RotulosDaBarraDeFiltros;
  /** Sem nenhum filtro, já abre a lista de campos ao aparecer — para a barra que o `HeaderFiltros` mostra e esconde. */
  abrirAoMontar?: boolean;
}

const ADICIONAR = "+";

export function BarraDeFiltros({ campos, valor, aoMudar, rotulos, abrirAoMontar = false, className, ...props }: BarraDeFiltrosProps) {
  const [abertoEm, setAbertoEm] = React.useState<string | null>(null);
  const botaoAdicionar = React.useRef<HTMLButtonElement>(null);
  /* Escolher e fechar acontecem no mesmo clique (campo `unico`): quem fecha
     precisa ler o valor que acabou de ser escolhido, não o da última pintura. */
  const atual = React.useRef(valor);
  atual.current = valor;
  function mudar(novo: FiltrosAtivos) {
    atual.current = novo;
    aoMudar(novo);
  }
  const naBarra = Object.keys(valor)
    .map((id) => campos.find((c) => c.id === id))
    .filter((c): c is CampoDeFiltro => Boolean(c));
  const foraDaBarra = campos.filter((c) => !(c.id in valor));

  React.useEffect(() => {
    if (abrirAoMontar && Object.keys(valor).length === 0) setAbertoEm(ADICIONAR);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function remover(id: string) {
    if (!(id in atual.current)) return;
    const resto = { ...atual.current };
    delete resto[id];
    mudar(resto);
  }

  function alternar(campo: CampoDeFiltro, opcao: string) {
    const atuais = atual.current[campo.id] ?? [];
    const novos = campo.unico ? [opcao] : atuais.includes(opcao) ? atuais.filter((v) => v !== opcao) : [...atuais, opcao];
    mudar({ ...atual.current, [campo.id]: novos });
  }

  return (
    <div className={cn("flex min-w-0 flex-wrap items-center gap-1.5", className)} {...props}>
      {naBarra.map((campo) => (
        <ChipDeFiltro
          key={campo.id}
          campo={campo}
          valores={valor[campo.id] ?? []}
          aberto={abertoEm === campo.id}
          aoAbrir={() => setAbertoEm(campo.id)}
          aoFechar={() => {
            setAbertoEm(null);
            // fechou sem escolher nada: o chip não fica
            if (!(atual.current[campo.id] ?? []).length) remover(campo.id);
          }}
          aoAlternar={(opcao) => alternar(campo, opcao)}
          aoRemover={() => {
            setAbertoEm(null);
            remover(campo.id);
          }}
          rotulos={rotulos}
        />
      ))}

      {foraDaBarra.length ? (
        <>
          <Button
            ref={botaoAdicionar}
            variant="ghost"
            size="sm"
            aria-haspopup="dialog"
            aria-expanded={abertoEm === ADICIONAR}
            onClick={() => setAbertoEm((a) => (a === ADICIONAR ? null : ADICIONAR))}
          >
            <Plus size={14} weight="regular" aria-hidden="true" />
            {rotulos.adicionar}
          </Button>
          <ComboboxPainel
            aberto={abertoEm === ADICIONAR}
            aoFechar={(devolver = true) => {
              setAbertoEm((a) => (a === ADICIONAR ? null : a));
              if (devolver) botaoAdicionar.current?.focus();
            }}
            gatilho={botaoAdicionar}
            rotulo={rotulos.adicionar}
            opcoes={foraDaBarra.map((c) => ({
              valor: c.id,
              rotulo: c.rotulo,
              icone: c.icone ? <c.icone size={16} weight="regular" aria-hidden="true" className="shrink-0" /> : undefined,
            }))}
            selecionados={[]}
            // o campo entra na barra vazio e já abre a própria lista
            aoAlternar={(id) => {
              mudar({ ...atual.current, [id]: [] });
              setAbertoEm(id);
            }}
            rotulos={rotulos}
          />
        </>
      ) : null}

      {naBarra.length ? (
        <Button variant="ghost" size="sm" onClick={() => { setAbertoEm(null); mudar({}); }}>
          {rotulos.limpar}
        </Button>
      ) : null}
    </div>
  );
}

/** Resumo do que o campo filtra: um ou dois por extenso, depois "primeiro +n". */
function resumoDe(campo: CampoDeFiltro, valores: string[]) {
  const escolhidas = campo.opcoes.filter((o) => valores.includes(o.valor)).map((o) => o.rotulo);
  if (escolhidas.length <= 2) return escolhidas.join(", ");
  return `${escolhidas[0]} +${escolhidas.length - 1}`;
}

function ChipDeFiltro({
  campo,
  valores,
  aberto,
  aoAbrir,
  aoFechar,
  aoAlternar,
  aoRemover,
  rotulos,
}: {
  campo: CampoDeFiltro;
  valores: string[];
  aberto: boolean;
  aoAbrir: () => void;
  aoFechar: () => void;
  aoAlternar: (opcao: string) => void;
  aoRemover: () => void;
  rotulos: RotulosDaBarraDeFiltros;
}) {
  const gatilho = React.useRef<HTMLButtonElement>(null);
  const Icone = campo.icone;
  const resumo = resumoDe(campo, valores);
  return (
    // dois botões colados: o que abre a lista e o X — clicável dentro de clicável não existe
    <div className="inline-flex min-w-0 max-w-full items-stretch gap-px">
      <Button
        ref={gatilho}
        variant="soft"
        size="sm"
        aria-haspopup="dialog"
        aria-expanded={aberto}
        onClick={() => (aberto ? aoFechar() : aoAbrir())}
        className="min-w-0 gap-1.5 rounded-r-none pr-2"
      >
        {Icone ? <Icone size={14} weight="regular" aria-hidden="true" className="shrink-0" /> : null}
        <span className="shrink-0 font-normal">
          {campo.rotulo}
          {resumo ? ":" : ""}
        </span>
        {resumo ? (
          <span className="min-w-0 max-w-48 truncate" title={resumo}>
            {resumo}
          </span>
        ) : null}
        <CaretDown size={12} weight="bold" aria-hidden="true" className={cn("shrink-0 transition-transform", aberto && "rotate-180")} />
      </Button>
      <Button
        variant="soft"
        size="icon-sm"
        aria-label={rotulos.remover(campo.rotulo)}
        title={rotulos.remover(campo.rotulo)}
        onClick={aoRemover}
        className="rounded-l-none"
      >
        <X size={12} weight="bold" aria-hidden="true" />
      </Button>
      <ComboboxPainel
        aberto={aberto}
        aoFechar={(devolver = true) => {
          aoFechar();
          if (devolver) gatilho.current?.focus();
        }}
        gatilho={gatilho}
        rotulo={campo.rotulo}
        opcoes={campo.opcoes}
        selecionados={valores}
        aoAlternar={aoAlternar}
        multiplo={!campo.unico}
        rotulos={rotulos}
      />
    </div>
  );
}
