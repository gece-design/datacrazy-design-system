"use client";

import * as React from "react";
import { X } from "@phosphor-icons/react";
import { Checkbox } from "@/components/ui/checkbox";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";

/* Na doc os textos são literais porque a doc é escrita em português. No CRM
   cada rótulo vem do next-intl — o componente não tem nenhum embutido. */

const colunas = ["Lead", "Produto", "Atividades", "Atendente", "Etapa"];

const codigoPadrao = `<Checkbox checked={aceito} onChange={(e) => setAceito(e.target.checked)}>
  {t("aceitoNovidades")}
</Checkbox>`;

const codigoIndeterminado = `const marcadas = colunas.filter((c) => visiveis.includes(c));
const todas = marcadas.length === colunas.length;

<Checkbox
  checked={todas}
  indeterminado={marcadas.length > 0 && !todas}
  onChange={() => setVisiveis(todas ? [] : colunas)}
>
  {t("todasAsColunas")}
</Checkbox>`;

const codigoSemRotulo = `<Checkbox
  aria-label={t("selecionarLinha", { lead: negocio.lead })}
  checked={selecionadas.has(negocio.id)}
  onChange={() => alternar(negocio.id)}
/>`;

const regras: React.ReactNode[] = [
  <>
    <span className="text-foreground">Não use Checkbox para efeito imediato.</span> Marcar e só valer depois de{" "}
    <Chip>Salvar</Chip> é Checkbox; ligar e já valer é <Chip>Switch</Chip>. Trocar um pelo outro muda o que o usuário
    espera que aconteça no clique.
  </>,
  <>
    <span className="text-foreground">Não use Checkbox para escolha exclusiva.</span> Se marcar um desmarca o outro, é{" "}
    <Chip>RadioGroup</Chip> — e o teclado muda junto: setas em vez de Tab.
  </>,
  <>
    <span className="text-foreground">Não monte o indeterminado com <Chip>aria-checked</Chip> à mão.</span> Passe{" "}
    <Chip>indeterminado</Chip>. O componente liga a propriedade de DOM, e o navegador anuncia &ldquo;misto&rdquo;
    sozinho. <Chip>aria-checked=&quot;mixed&quot;</Chip> num input nativo é ignorado.
  </>,
  <>
    <span className="text-foreground">Sem rótulo visível, <Chip>aria-label</Chip> é obrigatório.</span> Na seleção de
    linha ele diz <em>qual</em> linha: &ldquo;Selecionar Maria Souza&rdquo;, não &ldquo;Selecionar&rdquo; repetido 37
    vezes.
  </>,
  <>
    <span className="text-foreground">Não trave o rótulo em uma linha.</span> Em <Chip>es</Chip> e <Chip>pt-br</Chip> o
    texto é 20–30% maior que em <Chip>en</Chip>. O rótulo quebra; truncar sem tooltip é o bug #83283.
  </>,
];

export default function CheckboxPage() {
  const [aceito, setAceito] = React.useState(true);
  const [visiveis, setVisiveis] = React.useState<string[]>(["Lead", "Etapa"]);

  const todas = visiveis.length === colunas.length;
  const alternar = (c: string) =>
    setVisiveis((v) => (v.includes(c) ? v.filter((x) => x !== c) : [...v, c]));

  return (
    <PaginaDS
      titulo="Checkbox"
      descricao="Caixa de marcação de 18px com três valores — desmarcado, marcado e indeterminado — e dois desenhados como desabilitados. Serve à seleção de linha da tabela e à lista do botão “Colunas ▾”."
      secoes={["Como funciona", "Estados", "Com rótulo", "Indeterminado", "Sem rótulo", "Texto longo", "Regras"]}
    >
      <ComoFunciona>
        <p>
          Por baixo da caixa desenhada existe um <Chip>{'<input type="checkbox">'}</Chip> de verdade, escondido só da
          vista. É ele que responde ao Espaço, entra no <Chip>{"<form>"}</Chip> com <Chip>name</Chip> e{" "}
          <Chip>value</Chip>, e é anunciado pelo leitor de tela. A caixa não guarda estado nenhum: ela lê o input por
          CSS (<Chip>peer-checked</Chip>, <Chip>peer-disabled</Chip>) e se pinta. Por isso o componente funciona igual
          controlado, com <Chip>checked</Chip>, ou solto, com <Chip>defaultChecked</Chip>.
        </p>
        <p>
          O <span className="text-foreground">indeterminado</span> é a armadilha. Ele não existe como atributo de HTML —
          só como propriedade de DOM (<Chip>input.indeterminate = true</Chip>). Não dá para escrever no JSX e não dá
          para ler por atributo; por isso é uma prop, <Chip>indeterminado</Chip>, que o componente aplica depois de
          renderizar. E o clique do usuário limpa a propriedade sozinho, sem avisar o React — o componente reaplica a
          cada render, então quem manda continua sendo a prop.
        </p>
        <p>
          O arquivo desenha repouso e desabilitado. Hover e foco saem por regra, a mesma nos três controles de
          formulário: <span className="text-foreground">cada token troca pelo <Chip>-hover</Chip> do mesmo papel</span>{" "}
          — <Chip>input/border</Chip> vira <Chip>input/border-hover</Chip>, <Chip>primary</Chip> vira{" "}
          <Chip>primary-hover</Chip> — e o foco é o outline da regra D6, que deixa o respiro transparente.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Estados"
        spec="18px · raio 4 · traço 1.5"
        descricao="Os quatro estados do arquivo e o indeterminado, que o arquivo não desenha. Todos clicáveis, menos os desabilitados. Troque o tema no topo: o escuro sai dos mesmos tokens."
        nota={
          <p>
            Marcado desabilitado não é o marcado com opacidade: o fundo troca de <Chip>primary</Chip> para{" "}
            <Chip>subtle-foreground</Chip>, que é o que o arquivo pinta. O glifo é o <Chip>Check</Chip> do Phosphor a
            12px — o mesmo desenho que o Figma exporta — em <Chip>primary-foreground</Chip>. O indeterminado usa o{" "}
            <Chip>Minus</Chip> na mesma medida.
          </p>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Checkbox>Desmarcado</Checkbox>
          <Checkbox defaultChecked>Marcado</Checkbox>
          <Checkbox indeterminado>Indeterminado</Checkbox>
          <span className="hidden sm:block" />
          <Checkbox disabled>Desmarcado desabilitado</Checkbox>
          <Checkbox disabled defaultChecked>
            Marcado desabilitado
          </Checkbox>
        </div>
      </Secao>

      <Secao
        titulo="Com rótulo"
        spec="gap 8 · body-md"
        descricao="A forma de formulário: a caixa e o rótulo são um alvo só, e clicar no texto marca."
        codigo={codigoPadrao}
        nota={
          <p>
            O rótulo é filho do componente, então chega já traduzido. O <Chip>{"<label>"}</Chip> que envolve os dois é o
            que torna o texto clicável — e é o que aumenta o alvo de toque para além dos 18px da caixa.
          </p>
        }
      >
        <Checkbox checked={aceito} onChange={(e) => setAceito(e.target.checked)}>
          Aceito receber novidades
        </Checkbox>
      </Secao>

      <Secao
        titulo="Indeterminado"
        spec="indeterminado"
        descricao="O caso da lista “Colunas ▾”: o pai marca e desmarca todos, e fica indeterminado quando só uma parte está marcada."
        codigo={codigoIndeterminado}
        nota={
          <p>
            O pai não tem estado próprio: <Chip>checked</Chip> e <Chip>indeterminado</Chip> são calculados a partir dos
            filhos. Guardar os dois separado é como eles se desencontram — o pai marcado com um filho vazio.
          </p>
        }
      >
        <div className="flex flex-col gap-3">
          <Checkbox
            checked={todas}
            indeterminado={visiveis.length > 0 && !todas}
            onChange={() => setVisiveis(todas ? [] : colunas)}
          >
            Todas as colunas
          </Checkbox>
          <div className="flex flex-col gap-3 pl-[26px]">
            {colunas.map((c) => (
              <Checkbox key={c} checked={visiveis.includes(c)} onChange={() => alternar(c)}>
                {c}
              </Checkbox>
            ))}
          </div>
        </div>
      </Secao>

      <Secao
        titulo="Sem rótulo"
        spec="aria-label"
        descricao="Seleção de linha: a caixa sozinha, com o nome da linha dito só para o leitor de tela."
        codigo={codigoSemRotulo}
        nota={
          <p>
            A tabela de negócios nasce com a seleção desligada: ela liga junto com a barra de ações em massa, no lote 7.
            Seleção sem lugar para a ação aparecer é meia funcionalidade.
          </p>
        }
      >
        <div className="flex items-center gap-4">
          <Checkbox aria-label="Selecionar Maria Souza" />
          <Checkbox aria-label="Selecionar João Lima" defaultChecked />
          <Checkbox aria-label="Selecionar todas as linhas" indeterminado />
        </div>
      </Secao>

      <Secao
        titulo="Texto longo"
        spec="max-w-full"
        descricao="O rótulo em espanhol, numa coluna de 240px. Ele quebra linha em vez de cortar."
      >
        <div className="w-60 max-w-full">
          <Checkbox defaultChecked>
            Acepto recibir novedades y comunicaciones comerciales por correo electrónico
          </Checkbox>
        </div>
      </Secao>

      <Secao titulo="Regras" descricao="Cinco maneiras conhecidas de usar mal uma caixa de marcação.">
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
