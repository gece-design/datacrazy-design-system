"use client";

import * as React from "react";
import { X } from "@phosphor-icons/react";
import { Switch } from "@/components/ui/switch";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";

/* Na doc os textos são literais porque a doc é escrita em português. No CRM
   cada rótulo vem do next-intl — o componente não tem nenhum embutido. */

const codigoPadrao = `<Switch checked={ativa} onChange={(e) => alternarAutomacao(e.target.checked)}>
  {t("notificacoesPorEmail")}
</Switch>`;

const codigoSemRotulo = `{/* a linha inteira é o alvo do clique: texto à esquerda, Switch à direita */}
<ul className="divide-y divide-border">
  {automacoes.map((a) => (
    <li key={a.id}>
      <Switch linha descricao={a.descricao} checked={a.ativa} onChange={(e) => ativar(a.id, e.target.checked)}>
        {a.nome}
      </Switch>
    </li>
  ))}
</ul>`;

const regras: React.ReactNode[] = [
  <>
    <span className="text-foreground">Não use Switch dentro de formulário com botão Salvar.</span> Switch promete efeito
    na hora. Se nada acontece até o <Chip>Salvar</Chip>, o controle mentiu — ali é <Chip>Checkbox</Chip>.
  </>,
  <>
    <span className="text-foreground">Não ligue sem dizer que ligou.</span> O efeito é imediato, então o retorno também
    precisa ser: a automação que começa a rodar, a integração que conecta. Se a ação vai ao back e pode falhar, o
    Switch volta para a posição anterior.
  </>,
  <>
    <span className="text-foreground">Não escreva &ldquo;Ligado&rdquo; e &ldquo;Desligado&rdquo; no rótulo.</span> O
    rótulo diz <em>o que</em> liga — &ldquo;Notificações por e-mail&rdquo;. O estado é do controle, e o leitor de tela
    já anuncia pelo <Chip>role=&quot;switch&quot;</Chip>.
  </>,
  <>
    <span className="text-foreground">Sem rótulo visível, <Chip>aria-label</Chip> é obrigatório.</span> Numa lista de
    automações, diga qual: &ldquo;Ativar Boas-vindas&rdquo;, não &ldquo;Ativar&rdquo; em toda linha.
  </>,
];

export default function SwitchPage() {
  const [email, setEmail] = React.useState(true);
  const [automacoes, setAutomacoes] = React.useState([
    { id: "boas-vindas", nome: "Boas-vindas", descricao: "Mensagem no WhatsApp assim que o lead entra", ativa: true },
    { id: "follow-up", nome: "Follow-up de 3 dias", descricao: "Lembrete para o atendente se não houver resposta", ativa: false },
    { id: "reativacao", nome: "Reativação de lead frio", descricao: "E-mail depois de 30 dias parado", ativa: true },
  ]);

  return (
    <PaginaDS
      titulo="Switch"
      descricao="Liga e desliga com efeito imediato. Trilho de 36×20, botão de 16 que anda 16px, quatro estados desenhados. É o controle das Automações e das Integrações."
      secoes={["Como funciona", "Estados", "Padrão", "Em lista", "Regras"]}
    >
      <ComoFunciona>
        <p>
          Por baixo é um <Chip>{'<input type="checkbox">'}</Chip> com <Chip>role=&quot;switch&quot;</Chip>. O papel muda
          o anúncio — &ldquo;ligado&rdquo; e &ldquo;desligado&rdquo; em vez de &ldquo;marcado&rdquo; — e o input nativo
          mantém o resto: Espaço alterna, o valor entra no <Chip>{"<form>"}</Chip> e o foco vem sem{" "}
          <Chip>tabIndex</Chip> manual.
        </p>
        <p>
          A diferença para o Checkbox <span className="text-foreground">não é visual, é de contrato</span>. Checkbox
          marca e espera um <Chip>Salvar</Chip>; Switch aplica na hora. Por isso quem usa o Switch assume uma
          obrigação que o componente não cumpre sozinho: dar retorno do efeito e desfazer a posição se o back recusar.
        </p>
        <p>
          O estado não depende só de cor (regra E7): o botão muda de lado. O curso é conta, não número solto — trilho de
          36, menos 2 de recuo de cada lado, menos 16 do botão, dá 16px, que é <Chip>translate-x-4</Chip>. Hover e foco
          seguem a regra dos três controles de formulário: <Chip>input/border</Chip> →{" "}
          <Chip>input/border-hover</Chip>, <Chip>primary</Chip> → <Chip>primary-hover</Chip>, outline D6.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Estados"
        spec="36×20 · botão 16"
        descricao="Os quatro do arquivo. O par de cima responde ao clique; o de baixo está desabilitado."
        nota={
          <p>
            Desligado usa <Chip>input/border</Chip> como trilho; ligado, <Chip>primary</Chip>. Desabilitado troca para{" "}
            <Chip>input/bg-disabled</Chip> e <Chip>subtle-foreground</Chip>. O botão é <Chip>card</Chip> nos quatro.
          </p>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Switch>Desligado</Switch>
          <Switch defaultChecked>Ligado</Switch>
          <Switch disabled>Desligado desabilitado</Switch>
          <Switch disabled defaultChecked>
            Ligado desabilitado
          </Switch>
        </div>
      </Secao>

      <Secao
        titulo="Padrão"
        spec="gap 8 · body-md"
        descricao="Rótulo à direita, dizendo o que liga. Clicar no texto também alterna."
        codigo={codigoPadrao}
      >
        <Switch checked={email} onChange={(e) => setEmail(e.target.checked)}>
          Notificações por e-mail
        </Switch>
      </Secao>

      <Secao
        titulo="Em lista"
        spec="linha"
        descricao="Uma automação por linha, o nome à esquerda e o Switch à direita — e a linha inteira é o alvo do clique, não só o controle (reunião de 2026-09-18)."
        codigo={codigoSemRotulo}
        nota={
          <p>
            Com <Chip>linha</Chip> o rótulo continua sendo o texto da linha: o leitor de tela anuncia o nome da
            automação, e o clique em qualquer ponto da linha alterna. <Chip>descricao</Chip> é a segunda linha, em
            muted.
          </p>
        }
      >
        <ul className="divide-y divide-border">
          {automacoes.map((a) => (
            <li key={a.id} className="first:[&>label]:pt-0 last:[&>label]:pb-0">
              <Switch
                linha
                descricao={a.descricao}
                checked={a.ativa}
                onChange={(e) =>
                  setAutomacoes((lista) =>
                    lista.map((x) => (x.id === a.id ? { ...x, ativa: e.target.checked } : x))
                  )
                }
              >
                {a.nome}
              </Switch>
            </li>
          ))}
        </ul>
      </Secao>

      <Secao titulo="Regras" descricao="Quatro maneiras conhecidas de usar mal um controle de efeito imediato.">
        <ul className="space-y-3">
          {regras.map((r, i) => (
            <li key={i} className="flex gap-2.5">
              <X size={14} weight="regular" className="mt-1 shrink-0 text-destructive" />
              <p className="chrome-prose text-muted-foreground">{r}</p>
            </li>
          ))}
        </ul>
      </Secao>
    </PaginaDS>
  );
}
