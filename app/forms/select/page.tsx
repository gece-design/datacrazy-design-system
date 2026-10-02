"use client";

import { useState } from "react";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { Select, SelectTrigger } from "@/components/ui/select";
import { CampoEditavel, CartaoDeCampo } from "@/components/ui/input";
import { IconeDeMarca } from "@/components/ui/icone-de-marca";
import { Globe, Handshake } from "@phosphor-icons/react";

const etapas = [
  { valor: "prospeccao", rotulo: "Prospecção" },
  { valor: "qualificacao", rotulo: "Qualificação" },
  { valor: "proposta", rotulo: "Proposta" },
  { valor: "negociacao", rotulo: "Negociação" },
  { valor: "fechado", rotulo: "Fechado" },
];

const origens = [
  { valor: "whatsapp", rotulo: "WhatsApp", grupo: "Redes sociais", icone: <IconeDeMarca marca="whatsapp" /> },
  { valor: "instagram", rotulo: "Instagram", grupo: "Redes sociais", icone: <IconeDeMarca marca="instagram" /> },
  { valor: "google", rotulo: "Google", grupo: "Redes sociais", icone: <IconeDeMarca marca="google" /> },
  { valor: "meta", rotulo: "Meta", grupo: "Redes sociais", icone: <IconeDeMarca marca="meta" /> },
  { valor: "linkedin", rotulo: "LinkedIn", grupo: "Redes sociais", icone: <IconeDeMarca marca="linkedin" /> },
  { valor: "site", rotulo: "Site", grupo: "Outras", icone: <Globe size={16} weight="regular" aria-hidden="true" /> },
  { valor: "indicacao", rotulo: "Indicação", grupo: "Outras", icone: <Handshake size={16} weight="regular" aria-hidden="true" /> },
];

const codigoGrupos = `const origens = [
  { valor: "whatsapp", rotulo: "WhatsApp", grupo: "Redes sociais", icone: <IconeDeMarca marca="whatsapp" /> },
  { valor: "instagram", rotulo: "Instagram", grupo: "Redes sociais", icone: <IconeDeMarca marca="instagram" /> },
  { valor: "site", rotulo: "Site", grupo: "Outras", icone: <Globe size={16} weight="regular" aria-hidden="true" /> },
  { valor: "indicacao", rotulo: "Indicação", grupo: "Outras", icone: <Handshake size={16} weight="regular" aria-hidden="true" /> },
];

<Select size="field" rotulo="Origem" textoVazio="Selecione a origem" opcoes={origens} valor={origem} aoEscolher={setOrigem} />`;

const codigoTamanhos = `<Select size="md" rotulo="Ver por" opcoes={porValor} valor={por} aoEscolher={setPor} />
<Select size="sm" rotulo="Filtrar por etapa" opcoes={etapas} valor={etapa} aoEscolher={setEtapa} />`;

const codigoCartao = `<Select cartao rotulo="Etapa do funil" opcoes={etapas} valor={etapa} aoEscolher={setEtapa} />`;

const codigoCampo = `<CartaoDeCampo rotulo="Etapa">
  <Select size="field" rotulo="Etapa" textoVazio="Selecione uma opção" opcoes={etapas} valor={etapa} aoEscolher={setEtapa} className="block w-full" />
</CartaoDeCampo>`;

const codigoGatilho = `<SelectTrigger size="sm" aberto={aberto} onClick={() => setAberto((a) => !a)}>
  Todas as etapas
</SelectTrigger>`;

export default function SelectPage() {
  const [por, setPor] = useState("valor");
  const [etapa, setEtapa] = useState("proposta");
  const [campo, setCampo] = useState("");
  const [cartao, setCartao] = useState("qualificacao");
  const [gatilho, setGatilho] = useState(false);
  const [origem, setOrigem] = useState("whatsapp");

  return (
    <PaginaDS
      titulo="Select"
      descricao="Escolha numa lista curta: três tamanhos de gatilho (32, 29 e 36px) e uma lista aberta em overlay/bg com elevation/lg, teclado completo e foco que volta ao gatilho. Só o gatilho está desenhado no arquivo; a lista é derivação — o Select Menu do Figma segue no backlog."
      secoes={["Como funciona", "Tamanhos", "No cartão do drawer", "No formulário", "Grupos e ícones", "Só o gatilho", "Teclado"]}
    >
      <ComoFunciona>
        <p>
          O <Chip>Select</Chip> junta duas peças: <Chip>SelectTrigger</Chip>, o gatilho com o caret, e a lista aberta,
          que é a casca de todo painel flutuante do DS (<Chip>PainelFlutuante</Chip>): camada <Chip>z-popover</Chip>,
          superfície <Chip>overlay/bg</Chip>, traço <Chip>overlay/border</Chip> e o degrau <Chip>shadow-lg</Chip> da
          elevação. Entra dissolvendo, sai dissolvendo, e fecha no clique fora e no Escape sem levar junto o drawer
          de trás.
        </p>
        <p>
          O <Chip>md</Chip> é o gatilho do Card, com o realce interno que o arquivo aplica (<Chip>shadow-select-inner</Chip>);
          o <Chip>sm</Chip> é o da barra de filtros da tabela, 29px por medida; o <Chip>field</Chip> é campo de formulário
          e usa a mesma caixa do Input (<Chip>caixaDeCampo</Chip> de <Chip>lib/campo.ts</Chip>) — no foco ganha o traço e o
          anel interno do campo, não o outline do botão.
        </p>
        <p>
          A armadilha: <Chip>valor</Chip> é obrigatório e controlado. Sem uma escolha, passe string vazia e um{" "}
          <Chip>textoVazio</Chip> — é ele que o gatilho mostra, na cor de placeholder quando é campo. O caret é o{" "}
          <Chip>CaretDown</Chip> do Phosphor, nunca um triângulo desenhado (decisão de 2026-09-04).
        </p>
      </ComoFunciona>

      <Secao
        titulo="Tamanhos"
        spec="32 · 29"
        descricao="md no cabeçalho do Card, sm na barra de filtros da tabela. Os dois abrem a mesma lista."
        codigo={codigoTamanhos}
      >
        <div className="flex flex-wrap items-start gap-6">
          <Select size="md" rotulo="Ver por" opcoes={[{ valor: "valor", rotulo: "Valor" }, { valor: "quantidade", rotulo: "Quantidade" }]} valor={por} aoEscolher={setPor} />
          <Select size="sm" rotulo="Filtrar por etapa" opcoes={etapas} valor={etapa} aoEscolher={setEtapa} />
        </div>
      </Secao>

      <Secao
        titulo="No cartão do drawer"
        spec="cartao · 68"
        descricao="O cartão inteiro é o gatilho: rótulo em bold, valor na linha de 24 e o caret à direita — a mesma casca do CampoEditavel ao lado (cliente, 2026-09-28)."
        codigo={codigoCartao}
      >
        <div className="rounded-md bg-card p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <CampoEditavel rotulo="Atendente" valor="Esther" aoSalvar={() => {}} rotuloEditar="Editar atendente" textoVazio="Adicionar" />
            <Select cartao rotulo="Etapa do funil" textoVazio="Selecione" opcoes={etapas} valor={cartao} aoEscolher={setCartao} />
          </div>
        </div>
        <Legenda>
          Ao lado de um <Chip>CampoEditavel</Chip>, o Select entra como <Chip>cartao</Chip>, não como <Chip>field</Chip> dentro
          de um <Chip>CartaoDeCampo</Chip>: mesmo fundo, mesmo respiro, mesma linha de 24.
        </Legenda>
      </Secao>
      <Secao
        titulo="No formulário"
        spec="36 · field"
        descricao="A caixa do Input com um caret: mesma altura, mesmo recuo, mesmo foco. No cartão do drawer, entra pelo CartaoDeCampo, que traz o rótulo em bold e a sangria de 8px."
        codigo={codigoCampo}
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="rounded-md bg-card p-5">
            <CartaoDeCampo rotulo="Etapa">
              <Select size="field" rotulo="Etapa" textoVazio="Selecione uma opção" opcoes={etapas} valor={campo} aoEscolher={setCampo} className="block w-full" />
            </CartaoDeCampo>
          </div>
        </div>
        <Legenda>
          Vazio, o gatilho mostra o <Chip>textoVazio</Chip> em <Chip>input/placeholder</Chip>. Escolhido, o rótulo da opção em{" "}
          <Chip>input/text</Chip>.
        </Legenda>
      </Secao>

      <Secao
        titulo="Grupos e ícones"
        novidade="2026-10-01"
        spec="grupo · icone"
        descricao="Lista com mais de um assunto ganha cabeçalho por grupo; opção com marca ou símbolo ganha ícone, que aparece também no gatilho. O cabeçalho não é opção: o teclado passa direto por ele."
        codigo={codigoGrupos}
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="rounded-md bg-card p-5">
            <CartaoDeCampo rotulo="Origem">
              <Select size="field" rotulo="Origem" textoVazio="Selecione a origem" opcoes={origens} valor={origem} aoEscolher={setOrigem} className="block w-full" />
            </CartaoDeCampo>
          </div>
        </div>
        <Legenda>
          Marca é <Chip>IconeDeMarca</Chip>, na cor da marca; o que não é marca é Phosphor de 16px. Passou de umas
          dez opções, ou precisa de busca ou de várias escolhas? É <Chip>Combobox</Chip>.
        </Legenda>
      </Secao>

      <Secao
        titulo="Só o gatilho"
        spec="SelectTrigger"
        descricao="Exportado à parte para quando a abertura é controlada por outro componente: aberto gira o caret e marca o gatilho como ativo."
        codigo={codigoGatilho}
      >
        <div className="flex justify-center">
          <SelectTrigger size="sm" aberto={gatilho} onClick={() => setGatilho((a) => !a)}>
            Todas as etapas
          </SelectTrigger>
        </div>
      </Secao>

      <Secao
        titulo="Teclado"
        spec="WAI-ARIA listbox"
        descricao="Setas abrem e movem, Home e End vão às pontas, Enter e Espaço escolhem, Escape fecha. O foco entra na lista ao abrir e volta ao gatilho ao fechar."
      >
        <div className="flex justify-center">
          <Select size="md" rotulo="Filtrar por etapa" opcoes={etapas} valor={etapa} aoEscolher={setEtapa} />
        </div>
        <Legenda>
          <Chip>role=&quot;listbox&quot;</Chip> com <Chip>aria-activedescendant</Chip> na opção em foco; o gatilho anuncia{" "}
          <Chip>aria-haspopup</Chip> e <Chip>aria-expanded</Chip>. Verificado com Playwright: abre, cinco opções, seta + Enter escolhe, Escape e clique fora fecham.
        </Legenda>
      </Secao>
    </PaginaDS>
  );
}
