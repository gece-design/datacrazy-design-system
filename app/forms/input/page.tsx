"use client";

import { useState } from "react";
import { ArrowSquareOut, CalendarBlank, Copy, EnvelopeSimple, PencilSimple } from "@phosphor-icons/react";
import { Input, AcaoCampo } from "@/components/ui/input";
import { Rating } from "@/components/ui/rating";
import { Select } from "@/components/ui/select";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";

const estados = [
  { nome: "Repouso", props: { placeholder: "Exemplo: email@dominio.com" } },
  { nome: "Preenchido", props: { defaultValue: "rafael@datacrazy.io" } },
  { nome: "Erro", props: { defaultValue: "rafael@datacrazy", erro: "Informe um e-mail válido" } },
  { nome: "Desabilitado", props: { placeholder: "Exemplo: email@dominio.com", disabled: true } },
];

const origens = [
  { valor: "indicacao", rotulo: "Indicação" },
  { valor: "anuncio", rotulo: "Anúncio" },
  { valor: "evento", rotulo: "Evento" },
];

export default function InputPage() {
  const [nota, setNota] = useState(3);
  const [origem, setOrigem] = useState<string>();

  return (
    <PaginaDS
      titulo="Input"
      descricao="Campo de uma linha com rótulo: caixa de 36px, texto de 12px e raio de 6px. O arquivo desenha cinco estados nos dois temas; o mesmo corpo serve ao Select de formulário e ao Rating."
      secoes={["Como funciona", "Estados", "Ícone e ações", "Select no formulário", "Rating", "Quando usar"]}
    >
      <ComoFunciona>
        <p>
          O componente é um <Chip>&lt;label&gt;</Chip>, uma caixa e um <Chip>&lt;input&gt;</Chip> nativo. A caixa é
          quem tem borda, fundo e foco; o input dentro dela é transparente e sem contorno. Assim o ícone e as ações
          ficam dentro do mesmo traço, e o foco acende a caixa inteira com <Chip>focus-within</Chip>.
        </p>
        <p>
          Dos cinco estados do arquivo, <Chip>Filled</Chip> não é estado de código — é o campo com valor. Os outros
          quatro saem de pseudo-classe e de prop: <Chip>:focus-within</Chip>, <Chip>erro</Chip> e{" "}
          <Chip>disabled</Chip>. Não existe prop <Chip>state</Chip>. O foco do arquivo é traço de 2px em{" "}
          <Chip>input/border-focus</Chip>; aqui é o traço de 1px mais um anel interno de 1px, que soma os mesmos 2px
          sem empurrar o texto. O hover usa <Chip>input/border-hover</Chip>, token que já existia na coleção.
        </p>
        <p>
          Todas as cores são os onze tokens <Chip>input/*</Chip>, e eles são alias dos semânticos nos dois modos —
          por isso o campo escuro não tem uma linha de código própria. O recuo lateral é 11px e não 12: o Figma
          desenha o traço por dentro e o CSS por fora (regra D14).
        </p>
      </ComoFunciona>

      <Secao
        titulo="Estados"
        spec="36px · 5 estados"
        descricao="Repouso, preenchido, erro e desabilitado lado a lado. O foco não se congela numa imagem: clique em qualquer campo."
        codigo={`<Input rotulo="E-mail" placeholder="Exemplo: email@dominio.com" />
<Input rotulo="E-mail" defaultValue="rafael@datacrazy.io" />
<Input rotulo="E-mail" defaultValue="rafael@datacrazy" erro="Informe um e-mail válido" />
<Input rotulo="E-mail" placeholder="Exemplo: email@dominio.com" disabled />`}
        nota={
          <>
            A mensagem de erro fica sob o campo, em <Chip>caption</Chip> e <Chip>destructive</Chip>, e o input
            aponta para ela com <Chip>aria-describedby</Chip> e <Chip>aria-invalid</Chip> — quem usa leitor de tela
            ouve o erro ao chegar no campo, não só quem vê a cor (regra E6).
          </>
        }
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {estados.map((e) => (
            <div key={e.nome} className="flex flex-col gap-2">
              <span className="chrome-caption text-subtle-foreground">{e.nome}</span>
              <Input rotulo="E-mail" {...e.props} />
            </div>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Ícone e ações"
        spec="16px · gap 6"
        descricao="Um ícone antes do texto diz o formato; ações depois do texto agem sobre o valor. As duas coisas moram dentro da caixa."
        codigo={`<Input rotulo="Data de fundação" placeholder="dd/mm/aaaa" iconeInicio={CalendarBlank} />

<Input
  rotulo="Site"
  defaultValue="joeljota.com.br"
  acoes={<>
    <AcaoCampo icone={Copy} rotulo="Copiar site" onClick={copiar} />
    <AcaoCampo icone={ArrowSquareOut} rotulo="Abrir site" onClick={abrir} />
  </>}
/>`}
        nota={
          <>
            <Chip>AcaoCampo</Chip> é botão de verdade: tem foco, <Chip>aria-label</Chip> e <Chip>title</Chip>. Ícone
            de ação sem rótulo é o bug que virou a regra E7.
          </>
        }
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <Input rotulo="Data de fundação" placeholder="dd/mm/aaaa" iconeInicio={CalendarBlank} />
          <Input
            rotulo="Site"
            defaultValue="joeljota.com.br"
            acoes={
              <>
                <AcaoCampo icone={Copy} rotulo="Copiar site" onClick={() => void navigator.clipboard?.writeText("joeljota.com.br")} />
                <AcaoCampo icone={ArrowSquareOut} rotulo="Abrir site" onClick={() => window.open("https://joeljota.com.br", "_blank", "noopener,noreferrer")} />
              </>
            }
          />
          <Input
            rotulo="E-mail"
            defaultValue="contato@joeljota.com.br"
            acoes={
              <>
                <AcaoCampo icone={Copy} rotulo="Copiar e-mail" onClick={() => void navigator.clipboard?.writeText("contato@joeljota.com.br")} />
                <AcaoCampo icone={EnvelopeSimple} rotulo="Enviar e-mail" />
              </>
            }
          />
          <Input rotulo="Observação interna" defaultValue="Prefere e-mail" acoes={<AcaoCampo icone={PencilSimple} rotulo="Editar observação" />} />
        </div>
      </Secao>

      <Secao
        titulo="Select no formulário"
        spec='size="field"'
        descricao="O Select ganhou o tamanho do campo: mesma caixa de 36px, placeholder na cor do input e o caret de 16px à direita."
        codigo={`<span className="text-label-md text-input-label">Origem</span>
<Select size="field" rotulo="Origem" textoVazio="Selecione uma opção"
  opcoes={origens} valor={origem} aoEscolher={setOrigem} className="block w-full" />`}
        nota={
          <>
            A lista aberta é a mesma do <Chip>Select</Chip> dos filtros — tokens <Chip>overlay/*</Chip> e{" "}
            <Chip>shadow-lg</Chip>. O arquivo desenha só o fechado (node 544:129).
          </>
        }
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-label-md text-input-label">Origem</span>
            <Select
              size="field"
              rotulo="Origem"
              textoVazio="Selecione uma opção"
              opcoes={origens}
              valor={origem}
              aoEscolher={setOrigem}
              className="block w-full"
            />
          </div>
        </div>
      </Secao>

      <Secao
        titulo="Rating"
        spec="0–5 · estrela 20px"
        descricao="Nota de 0 a 5 na caixa do input. Clique numa estrela ou use as setas: é um grupo de rádio."
        codigo={`<Rating rotulo="ScoreDavi" valor={nota} aoMudar={setNota} />
<Rating rotulo="Satisfação" valor={4} />  {/* sem aoMudar: só leitura */}`}
        nota={
          <>
            Estrela cheia em <Chip>primary</Chip>, vazia em <Chip>base/blue/300</Chip> — é o que o arquivo pinta. A
            descrição do componente no Figma promete <Chip>foreground</Chip> e <Chip>subtle-foreground</Chip>; um dos
            dois está errado, e a divergência está na doc.
          </>
        }
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <Rating rotulo="ScoreDavi" valor={nota} aoMudar={setNota} />
          <Rating rotulo="Satisfação (só leitura)" valor={4} />
        </div>
      </Secao>

      <Secao
        titulo="Quando usar"
        descricao="Input é para valor curto que a pessoa digita. O resto tem componente próprio."
      >
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Rótulo sempre visível.</span> Placeholder some quando a pessoa começa a
            digitar; ele mostra formato, não nome.
          </li>
          <li>
            <span className="text-foreground">Erro diz o que fazer.</span> &ldquo;Informe um e-mail válido&rdquo;, não
            &ldquo;Campo inválido&rdquo;. Aparece ao sair do campo, não a cada tecla.
          </li>
          <li>
            <span className="text-foreground">Lista fechada é Select.</span> Se a resposta está numa lista curta, a
            pessoa escolhe em vez de digitar.
          </li>
          <li>
            <span className="text-foreground">Desabilitado explica por quê.</span> Campo cinza sem motivo é pergunta
            sem resposta: o motivo vai em texto perto dele (regra E1).
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
