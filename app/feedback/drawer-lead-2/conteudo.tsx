"use client";

import { PaginaDS, Secao } from "@/components/ds/preview";
import { EstiloDosMocks, Mock1A, Mock2B, Mock2C } from "./mocks-cliente";

/* Página voltada ao CLIENTE: é o link que vai para a reunião. O texto aqui é
   escrito para quem enviou as propostas — observação de uso, não crítica, e
   sem vocabulário interno (token, DS, Tailwind, "os piores"). A leitura
   técnica do material fica em ./ds, que não sobe para produção. */

export function Conteudo() {
  return (
    <PaginaDS
      titulo="Drawer · propostas"
      descricao="Três das telas do arquivo que vocês enviaram, reproduzidas aqui como protótipos navegáveis, com as mesmas cores, medidas e ícones do original."
      secoes={["Sobre estas telas", "Barra de ícones", "Trilho de ícones", "Grade de duas colunas", "Recomendação"]}
    >
      <EstiloDosMocks />

      <Secao titulo="Sobre estas telas" semCaixa semSeletorDeFundo>
        <div className="space-y-4 p-4 chrome-prose text-muted-foreground sm:p-6 lg:p-8">
          <p>
            As três telas abaixo estão funcionando: dá para clicar nos ícones, trocar de seção e abrir os menus. A
            reprodução é fiel ao arquivo original, sem ajustes nossos, para que a avaliação seja sobre a proposta em
            si.
          </p>
          <p>
            Depois de cada tela há uma nota com os pontos de atenção que identificamos.{" "}
            <span className="text-foreground">São observações de navegação</span> — sobre o que a pessoa consegue ler
            antes de clicar — e não sobre aparência. A recomendação está no fim da página.
          </p>
        </div>
      </Secao>

      <Secao
        titulo="Barra de ícones"
        spec="tela 1A"
        descricao="As quatro ações do contato — tags, lista, automação e atendente — como botões quadrados com ícone, e uma linha de legenda embaixo identificando cada um. Clique nos dois últimos para abrir o menu."
        semCaixa
        semSeletorDeFundo
        nota={
          <>
            Sem rótulo no botão, a identificação depende da linha de legenda — que diz quais são as quatro ações, mas
            não qual ícone corresponde a qual. Em uso, <span className="text-foreground">adicionar tag</span> e{" "}
            <span className="text-foreground">adicionar à lista</span> tendem a ser confundidos. Vale notar também que
            o quarto botão é o avatar do atendente: dentro de um cartão de contato, ele pode ser lido como uma segunda
            pessoa em vez de um seletor.
          </>
        }
      >
        <Mock1A />
      </Secao>

      <Secao
        titulo="Trilho de ícones"
        spec="tela 2C"
        descricao="A navegação do lead como uma coluna de 52px só com ícones, ao lado do conteúdo do contato. O rótulo aparece ao passar o mouse."
        semCaixa
        semSeletorDeFundo
        nota={
          <>
            São doze destinos sem texto. O rótulo no hover resolve no desktop com mouse, mas{" "}
            <span className="text-foreground">não aparece em tela de toque</span>. Como várias seções não têm um ícone
            convencional — Campos adicionais, Hierarquia, Históricos —, a identificação passa a depender de
            memorização. A coluna de 52px também reduz o espaço disponível para o conteúdo do contato ao lado.
          </>
        }
      >
        <Mock2C />
      </Secao>

      <Secao
        titulo="Grade de duas colunas"
        spec="tela 2B"
        descricao="O menu em grade de duas colunas, com o ícone acima do rótulo, para os doze itens caberem sem rolagem."
        semCaixa
        semSeletorDeFundo
        nota={
          <>
            A grade resolve a rolagem. Em contrapartida, muda o sentido de leitura: menu costuma ser varrido de cima
            para baixo, e a grade pede leitura em zigue-zague. Os rótulos mais longos — Campos adicionais,
            Atendimentos — quebram em duas linhas, e as células perdem o alinhamento entre si.
          </>
        }
      >
        <Mock2B />
      </Secao>

      <Secao titulo="Recomendação" semCaixa semSeletorDeFundo>
        <div className="space-y-4 p-4 chrome-prose text-muted-foreground sm:p-6 lg:p-8">
          <p>
            Nossa recomendação é <span className="text-foreground">manter a lista do drawer atual</span>, com
            cabeçalho fixo e rolagem só dentro da lista. Ela resolve o ponto que motivou as propostas — o menu ficar
            comprido — sem custo de leitura, porque o rótulo continua visível ao lado do ícone. É a mesma abordagem da
            tela 2A do arquivo de vocês.
          </p>
          <p>
            Se doze seções ainda parecerem muitas, sugerimos{" "}
            <span className="text-foreground">agrupar em vez de esconder</span>: Relacionamento, Cadastro e
            Documentos, com um grupo aberto por vez. É o formato das telas 2D e 2F, que encurta a lista e mantém o
            texto visível. Podemos prototipar essa opção se fizer sentido para vocês.
          </p>
        </div>
      </Secao>
    </PaginaDS>
  );
}
