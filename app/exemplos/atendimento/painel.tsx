"use client";

import { Buildings, EnvelopeSimple, MapPin, Phone, User } from "@phosphor-icons/react";

import { Avatar } from "@/components/ui/avatar";
import { BotaoFechar } from "@/components/ui/button";
import { DrawerSecao } from "@/components/ui/drawer";
import { AcaoCopiar, CampoEditavel } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SeletorTags, Tag } from "@/components/ui/tag";
import { gradeDeCartoes } from "@/lib/campo";
import { rolagemDiscreta } from "@/lib/estados";
import { cn } from "@/lib/utils";
import { ATENDENTES, ETAPAS, GRUPOS_TAGS, moeda, tagsDe, type Conversa, type EtapaId } from "./dados";

/* A coluna do lead: quem é, em que etapa está, quanto vale — o cartão do lead
   ao lado da conversa, sem abrir outra tela. Os campos são os cartões do
   drawer (`CampoEditavel`, `Select cartao`), editáveis no lugar. */

export function PainelDoLead({
  conversa,
  aoEditar,
  aoFechar,
  className,
}: {
  conversa: Conversa;
  aoEditar: (campos: Partial<Conversa>) => void;
  /** Abaixo de 1280 o painel abre por cima da conversa e cobre o botão que o abriu: o X fecha. */
  aoFechar: () => void;
  className?: string;
}) {
  const Tipo = conversa.tipo === "empresa" ? Buildings : User;
  return (
    <aside aria-label={`Lead ${conversa.nome}`} className={cn("flex min-h-0 flex-col border-l border-border bg-card", className)}>
      <div className={cn("flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4", rolagemDiscreta)}>
        <div className="flex items-center gap-3">
          <Avatar nome={conversa.nome} size="md" iniciais="duas" className="shrink-0" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 className="truncate text-h4 text-foreground">{conversa.nome}</h2>
            <p className="flex min-w-0 items-center gap-1 text-caption text-muted-foreground">
              <Tipo size={12} weight="regular" aria-hidden="true" className="shrink-0" />
              <span className="truncate">{conversa.empresa}</span>
            </p>
          </div>
          <BotaoFechar rotulo="Fechar o lead" onClick={aoFechar} className="shrink-0 self-start xl:hidden" />
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {tagsDe(conversa.tags).map((t) => (
            <Tag key={t.id} status={t.status}>
              {t.rotulo}
            </Tag>
          ))}
          <SeletorTags
            grupos={GRUPOS_TAGS}
            selecionadas={conversa.tags}
            aoAlternar={(t) => aoEditar({ tags: conversa.tags.includes(t.id) ? conversa.tags.filter((x) => x !== t.id) : [...conversa.tags, t.id] })}
            rotulos={{
              gatilho: "Adicionar tag",
              busca: "Buscar tag",
              vazio: "Nenhuma tag nesta aba",
              criar: (t, g) => `Criar "${t}" em ${g}`,
              cor: "Cor da tag",
            }}
          />
        </div>

        <DrawerSecao titulo="Negócio">
          <div className={gradeDeCartoes}>
            <Select
              cartao
              rotulo="Etapa do funil"
              opcoes={ETAPAS.map((e) => ({ valor: e.id, rotulo: e.rotulo }))}
              valor={conversa.etapa}
              aoEscolher={(v) => aoEditar({ etapa: v as EtapaId })}
            />
            <CampoEditavel
              rotulo="Valor do negócio"
              valor={moeda(conversa.valor)}
              aoSalvar={(v) => {
                const n = Number(v.replace(/[^\d]/g, ""));
                if (Number.isFinite(n)) aoEditar({ valor: n });
              }}
              rotuloEditar="Editar valor do negócio"
              textoVazio="R$ 0"
              inputMode="numeric"
            />
            <Select
              cartao
              rotulo="Atendente"
              textoVazio="Sem atendente"
              opcoes={ATENDENTES.map((a) => ({ valor: a, rotulo: a }))}
              valor={conversa.atendente ?? ""}
              aoEscolher={(v) => aoEditar({ atendente: v })}
            />
          </div>
        </DrawerSecao>

        <DrawerSecao titulo="Contato">
          <div className={gradeDeCartoes}>
            <CampoEditavel
              rotulo="Telefone"
              valor={conversa.telefone}
              aoSalvar={(v) => aoEditar({ telefone: v })}
              rotuloEditar="Editar telefone"
              textoVazio="Adicionar"
              iconeInicio={Phone}
              acoes={<AcaoCopiar rotulo="Copiar telefone" rotuloCopiado="Telefone copiado" valor={conversa.telefone} />}
            />
            <CampoEditavel
              rotulo="E-mail"
              valor={conversa.email}
              aoSalvar={(v) => aoEditar({ email: v })}
              rotuloEditar="Editar e-mail"
              textoVazio="Adicionar"
              iconeInicio={EnvelopeSimple}
              acoes={<AcaoCopiar rotulo="Copiar e-mail" rotuloCopiado="E-mail copiado" valor={conversa.email} />}
            />
            <CampoEditavel
              rotulo="Cidade"
              valor={conversa.cidade}
              aoSalvar={(v) => aoEditar({ cidade: v })}
              rotuloEditar="Editar cidade"
              textoVazio="Adicionar"
              iconeInicio={MapPin}
            />
          </div>
        </DrawerSecao>
      </div>
    </aside>
  );
}
