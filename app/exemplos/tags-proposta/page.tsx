"use client";

/* Proposta de cor das tags (2026-09-18). Ficou pública em Telas de exemplo
   por decisão do humano em 2026-09-19 — o cliente vê o antes e o depois. */

import { Fire, Snowflake, ThermometerSimple, User } from "@phosphor-icons/react";
import { Tag, TONS, tomDe } from "@/components/ui/tag";

function Bloco({ titulo, nota, children }: { titulo: string; nota?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-label-md uppercase text-muted-foreground">{titulo}</h2>
      {nota ? <p className="mt-1 text-body-sm text-muted-foreground">{nota}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Linha({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 border-b border-border py-3 last:border-0">
      <span className="w-32 shrink-0 text-body-sm text-muted-foreground">{rotulo}</span>
      <div className="flex flex-wrap items-center gap-1.5">{children}</div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="mx-auto flex max-w-[860px] flex-col gap-6 p-8">
      <h1 className="text-heading-md text-foreground">Tags do drawer · proposta de cor</h1>

      <Bloco titulo="Antes" nota="Tudo cinza, tudo em caixa alta. A fileira do perfil hoje.">
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag foto="/ds/atendente.png">Esther</Tag>
          <Tag>Lista de leads</Tag>
          <Tag>Premium</Tag>
          <Tag status="info">Em aberto</Tag>
          <Tag status="success">Agendado</Tag>
          <Tag>Quente</Tag>
        </div>
      </Bloco>

      <Bloco titulo="Depois" nota="A mesma fileira, com a cor vindo da regra de cada grupo. Caixa alta em todas.">
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag foto="/ds/atendente.png">Esther</Tag>
          <Tag tom={tomDe("lista-de-leads")}>Lista de leads</Tag>
          <Tag tom="ambar">Premium</Tag>
          <Tag status="info" tom="azul">Em aberto</Tag>
          <Tag status="success" tom="verde">Agendado</Tag>
          <Tag tom="vermelho" icone={Fire}>Quente</Tag>
        </div>
      </Bloco>

      <Bloco titulo="A regra, por aba" nota="A forma distingue junto com a cor — quem não enxerga cor ainda separa os quatro grupos.">
        <Linha rotulo="Status · bolinha">
          <Tag status="destructive" tom="vermelho">Abandonou</Tag>
          <Tag status="success" tom="verde">Agendado</Tag>
          <Tag status="info" tom="ciano">Passou</Tag>
          <Tag status="info" tom="azul">Em aberto</Tag>
        </Linha>
        <Linha rotulo="Temperatura · ícone">
          <Tag tom="ciano" icone={Snowflake}>Frio</Tag>
          <Tag tom="ambar" icone={ThermometerSimple}>Morno</Tag>
          <Tag tom="vermelho" icone={Fire}>Quente</Tag>
        </Linha>
        <Linha rotulo="Listas · sem adorno">
          <Tag tom={tomDe("lista-de-leads")}>Lista de leads</Tag>
          <Tag tom={tomDe("isaias-123")}>Isaias 123</Tag>
          <Tag tom={tomDe("prospect-list")}>Prospect list</Tag>
          <Tag tom="ambar">Premium</Tag>
        </Linha>
        <Linha rotulo="Atendentes · foto">
          <Tag foto="/ds/atendente.png">Esther</Tag>
          <Tag foto="/ds/atendente-2.svg">Liam</Tag>
          <Tag foto="/ds/atendente-3.svg">Camila</Tag>
          <Tag foto="/ds/atendente-4.svg">Diego</Tag>
          <Tag icone={User}>Marina</Tag>
        </Linha>
        <Linha rotulo="Tipo · cor do lead">
          <div data-tom="azul" className="flex items-center gap-1.5">
            <Tag tipo="pessoa">Pessoa</Tag>
          </div>
          <div data-tom="roxo" className="flex items-center gap-1.5">
            <Tag tipo="empresa">Empresa</Tag>
          </div>
          <div data-tom="verde" className="flex items-center gap-1.5">
            <Tag tipo="pessoa">Pessoa</Tag>
          </div>
        </Linha>
      </Bloco>

      <Bloco titulo="Os catorze tons" nota="Com a tag sem tom, são quinze cores. Ao criar uma tag em Listas, a pessoa escolhe uma delas.">
        <div className="flex flex-wrap items-center gap-1.5">
          {TONS.map((t) => (
            <Tag key={t} tom={t}>
              {t}
            </Tag>
          ))}
        </div>
      </Bloco>
    </main>
  );
}
