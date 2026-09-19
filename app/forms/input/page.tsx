"use client";

import { useState } from "react";
import { ArrowSquareOut, CalendarBlank, EnvelopeSimple, Minus, PencilSimple, Plus } from "@phosphor-icons/react";
import { Input, AcaoCampo, AcaoCopiar, CampoEditavel } from "@/components/ui/input";
import { InputTelefone } from "@/components/ui/telefone";
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
  const [nota, setNota] = useState(7);
  const [origem, setOrigem] = useState<string>();
  const [cargo, setCargo] = useState("Guitarrista");
  const [observacao, setObservacao] = useState("");
  const [colaboradores, setColaboradores] = useState("45");
  const [paisCartao, setPaisCartao] = useState("BR");
  const [telefoneCartao, setTelefoneCartao] = useState("");
  const [pais, setPais] = useState("BR");
  const [telefone, setTelefone] = useState("(54) 44346-5346");

  return (
    <PaginaDS
      titulo="Input"
      descricao="Campo de uma linha com rótulo: caixa de 36px, texto de 12px e raio de 6px. O arquivo desenha cinco estados nos dois temas; o mesmo corpo serve ao Select de formulário e ao Rating."
      secoes={["Como funciona", "Estados", "Ícone e ações", "Clicar para editar", "Campo em cartão", "Telefone", "Select no formulário", "Rating", "Quando usar"]}
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
    <AcaoCopiar rotulo="Copiar site" rotuloCopiado="Site copiado" />
    <AcaoCampo icone={ArrowSquareOut} rotulo="Abrir site" onClick={abrir} />
  </>}
/>`}
        nota={
          <>
            <Chip>AcaoCampo</Chip> é botão de verdade: tem foco, <Chip>aria-label</Chip> e <Chip>title</Chip>. Ícone
            de ação sem rótulo é o bug que virou a regra E7. <Chip>AcaoCopiar</Chip> é o ícone de dois quadrados: lê
            o valor do próprio campo — inclusive o que acabou de ser digitado —, copia e vira um check em{" "}
            <Chip>success</Chip> por 1,5s, anunciado ao leitor de tela. Com o campo vazio, só leva o foco para ele.
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
                <AcaoCopiar rotulo="Copiar site" rotuloCopiado="Site copiado" />
                <AcaoCampo icone={ArrowSquareOut} rotulo="Abrir site" onClick={() => window.open("https://joeljota.com.br", "_blank", "noopener,noreferrer")} />
              </>
            }
          />
          <Input
            rotulo="E-mail"
            defaultValue="contato@joeljota.com.br"
            acoes={
              <>
                <AcaoCopiar rotulo="Copiar e-mail" rotuloCopiado="E-mail copiado" />
                <AcaoCampo icone={EnvelopeSimple} rotulo="Enviar e-mail" />
              </>
            }
          />
          <Input rotulo="Observação interna" defaultValue="Prefere e-mail" acoes={<AcaoCampo icone={PencilSimple} rotulo="Editar observação" />} />
        </div>
      </Secao>

      <Secao
        titulo="Clicar para editar"
        spec="CampoEditavel"
        // o cartão é `background` a 50%: sobre a caixa cinza ele sumiria, e o
        // branco é o que o drawer tem por baixo de verdade
        fundo="card"
        descricao="Em tela de leitura o campo é cartão, não formulário: rótulo e valor na mesma margem, sem caixa. O cursor acende a superfície e o lápis; o clique põe o cursor no lugar do texto, sem nada pular. Passe o mouse nos dois abaixo e clique."
        codigo={`<CampoEditavel
  rotulo="Cargo"
  valor={cargo}
  aoSalvar={setCargo}
  rotuloEditar="Editar cargo"
  textoVazio="Adicionar"
  acoes={<AcaoCopiar rotulo="Copiar cargo" rotuloCopiado="Cargo copiado" valor={cargo} />}
/>`}
        nota={
          <>
            Enter e sair do campo salvam; Escape desfaz. O Escape não passa adiante de propósito — dentro do
            drawer ele fecharia a camada inteira. No modo leitura o <Chip>AcaoCopiar</Chip> copia pelo{" "}
            <Chip>valor</Chip>, já que ali não existe <Chip>&lt;input&gt;</Chip> para ler. A superfície do cartão é{" "}
            <Chip>background/50</Chip> — um cinza mais claro que o da página. Falta um token de superfície sutil na
            coleção; quando ele existir, é essa linha que muda.
          </>
        }
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <CampoEditavel
            rotulo="Cargo"
            valor={cargo}
            aoSalvar={setCargo}
            rotuloEditar="Editar cargo"
            textoVazio="Adicionar"
            acoes={<AcaoCopiar rotulo="Copiar cargo" rotuloCopiado="Cargo copiado" valor={cargo} />}
          />
          <CampoEditavel
            rotulo="Observação interna"
            valor={observacao}
            aoSalvar={setObservacao}
            rotuloEditar="Editar observação interna"
            textoVazio="Insira um valor"
          />
        </div>
      </Secao>

      <Secao
        titulo="Campo em cartão"
        spec="cartao"
        fundo="card"
        descricao="No drawer, campo que já é campo entra no mesmo cartão do CampoEditavel: rótulo em bold, superfície própria, caixa por dentro. Assim uma coluna de leitura não mistura dois visuais."
        codigo={`<Input
  cartao
  rotulo="Quantos colaboradores"
  inputMode="numeric"
  value={colaboradores}
  onChange={(e) => setColaboradores(e.target.value.replace(/\D/g, ""))}
  acoes={
    <>
      <AcaoCampo icone={Minus} rotulo="Diminuir" onClick={diminuir} />
      <AcaoCampo icone={Plus} rotulo="Aumentar" onClick={aumentar} />
    </>
  }
/>

{/* quem traz a própria caixa entra no cartão por fora */}
<CartaoDeCampo rotulo="Reclamações">
  <Select size="field" rotulo="Reclamações" textoVazio="Selecione uma opção" opcoes={motivos} valor={motivo} aoEscolher={setMotivo} className="block w-full" />
</CartaoDeCampo>`}
        nota={
          <>
            A caixa sangra 8px para os lados: o rótulo fica nos 12px de respiro do cartão — é ele que alinha a
            grade — e a caixa recupera a largura que o cartão tirou. Sem isso, um telefone com máscara trunca na
            coluna de 232px do drawer. Em formulário aberto não use <Chip>cartao</Chip>: ali o campo é o campo.
          </>
        }
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <Input
            cartao
            rotulo="Quantos colaboradores"
            inputMode="numeric"
            value={colaboradores}
            onChange={(e) => setColaboradores(e.target.value.replace(/\D/g, ""))}
            acoes={
              <>
                <AcaoCampo
                  icone={Minus}
                  rotulo="Diminuir"
                  onClick={() => setColaboradores(String(Math.max(0, Number(colaboradores || 0) - 1)))}
                />
                <AcaoCampo
                  icone={Plus}
                  rotulo="Aumentar"
                  onClick={() => setColaboradores(String(Number(colaboradores || 0) + 1))}
                />
              </>
            }
          />
          <InputTelefone
            cartao
            rotulo="Telefone"
            rotuloPais="País do telefone em cartão"
            pais={paisCartao}
            aoMudarPais={setPaisCartao}
            valor={telefoneCartao}
            aoMudar={setTelefoneCartao}
            placeholder="(00) 00000-0000"
          />
        </div>
      </Secao>

      <Secao
        titulo="Telefone"
        spec="bandeira + DDI"
        descricao="País à esquerda, número à direita. O DDI fica escrito ao lado da bandeira — em Windows a bandeira não desenha, e o código é o que sobra."
        codigo={`<InputTelefone
  rotulo="Telefone"
  rotuloPais="País do telefone"
  pais={pais}
  aoMudarPais={setPais}
  valor={telefone}
  aoMudar={setTelefone}
  acoes={<AcaoCampo icone={Phone} rotulo="Ligar" onClick={ligar} />}
/>`}
        nota={
          <>
            O seletor de país é um <Chip>&lt;select&gt;</Chip> nativo invisível por cima da bandeira — a mesma
            escolha dos seletores de mês e ano do Date Picker. Ganha teclado, busca por letra e a roda do
            sistema no celular sem código. <Chip>telefoneCompleto(pais, numero)</Chip> monta o{" "}
            <Chip>+55 …</Chip> que vai para o back e para o <Chip>tel:</Chip>.
          </>
        }
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <InputTelefone
            rotulo="Telefone"
            rotuloPais="País do telefone"
            pais={pais}
            aoMudarPais={setPais}
            valor={telefone}
            aoMudar={setTelefone}
            placeholder="(00) 00000-0000"
          />
          <InputTelefone
            rotulo="WhatsApp"
            rotuloPais="País do WhatsApp"
            pais="PT"
            aoMudarPais={() => undefined}
            valor=""
            aoMudar={() => undefined}
            placeholder="000 000 000"
          />
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
        spec="0–10 · estrela 16px"
        fundo="card"
        descricao="Nota de 0 a 10 no mesmo bloco do campo editável — cartão, nunca caixa de campo. Clique numa estrela ou use as setas: é um grupo de rádio. O cursor mostra a nota que o clique daria, e o clique responde com o pulo das estrelas."
        codigo={`<Rating rotulo="ScoreDavi" valor={nota} aoMudar={setNota} />        {/* 0–10 */}
<Rating rotulo="Satisfação" valor={4} max={5} />                  {/* só leitura, 0–5 */}`}
        nota={
          <>
            Estrela cheia em <Chip>primary</Chip>, vazia em <Chip>base/blue/300</Chip> — é o que o arquivo pinta. A
            descrição do componente no Figma promete <Chip>foreground</Chip> e <Chip>subtle-foreground</Chip>; um dos
            dois está errado, e a divergência está na doc. A animação vive sob <Chip>motion-safe:</Chip>: quem pede
            menos movimento ao sistema vê a nota mudar sem pulo nenhum.
          </>
        }
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <Rating rotulo="ScoreDavi" valor={nota} aoMudar={setNota} />
          <Rating rotulo="Satisfação (só leitura, 0–5)" valor={4} max={5} />
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
