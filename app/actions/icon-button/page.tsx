"use client";

import { Bell, MagnifyingGlass, Plus, DotsThree, PushPin } from "@phosphor-icons/react";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { Button, BotaoFechar } from "@/components/ui/button";
import { AcaoCampo } from "@/components/ui/input";

const codigoTamanhos = `<Button size="icon-xs" variant="ghost" aria-label="Fixar"><PushPin size={14} weight="regular" /></Button>
<Button size="icon-sm" variant="ghost" aria-label="Mais ações"><DotsThree size={16} weight="regular" /></Button>
<Button size="icon" variant="tertiary" aria-label="Notificações"><Bell size={16} weight="regular" /></Button>
<Button size="icon-lg" variant="secondary" aria-label="Pesquisar"><MagnifyingGlass size={16} weight="regular" /></Button>`;

const codigoFechar = `<BotaoFechar rotulo="Fechar" onClick={fechar} />                 {/* 28px, Modal */}
<BotaoFechar size="icon-xs" rotulo="Fechar notificação" onClick={fechar} />  {/* 24px, Toast */}`;

const codigoAcao = `<AcaoCampo icone={Plus} rotulo="Aumentar" onClick={aumentar} />`;

export default function IconButtonPage() {
  return (
    <PaginaDS
      titulo="Icon Button"
      descricao="Ação só de ícone: o Button em quatro quadrados — 24, 28, 32 e 36px — sempre com aria-label, porque sem texto o botão não tem nome. O X de fechar é um deles, pronto; a ação de 16px dentro de um campo é outra peça, sem caixa."
      secoes={["Como funciona", "Tamanhos", "Fechar", "Ação no campo"]}
    >
      <ComoFunciona>
        <p>
          Não existe um componente <Chip>IconButton</Chip>: é o <Chip>Button</Chip> com <Chip>size</Chip> quadrado —{" "}
          <Chip>icon-xs</Chip> (24), <Chip>icon-sm</Chip> (28), <Chip>icon</Chip> (32) e <Chip>icon-lg</Chip> (36) — e
          qualquer variante. O glifo do Phosphor vai a 16px, ou 14 no de 24. Antes da auditoria de consistência havia
          onze tamanhos de botão de ícone escritos à mão pelo DS; a escala fechou em quatro.
        </p>
        <p>
          <Chip>BotaoFechar</Chip> é o X: Button <Chip>ghost</Chip> quadrado, com o glifo e o hover de superfície
          flutuante (<Chip>overlay/item-hover</Chip>). Modal, Toast e o menu do site usam o mesmo. O canto do Drawer não:
          é um quadrado de 29px com fundo <Chip>card</Chip>, medido no arquivo.
        </p>
        <p>
          A armadilha é o nome. <Chip>aria-label</Chip> é obrigatório nos quatro tamanhos e no X — e vira também o{" "}
          <Chip>title</Chip> no <Chip>BotaoFechar</Chip>, para o cursor explicar o que o ícone não diz.
        </p>
      </ComoFunciona>

      <Secao titulo="Tamanhos" spec="24 · 28 · 32 · 36" descricao="Os quatro degraus, cada um com uma variante: ghost nos dois menores, tertiary no sino, secondary no de pesquisa." codigo={codigoTamanhos}>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="icon-xs" variant="ghost" aria-label="Fixar"><PushPin size={14} weight="regular" /></Button>
          <Button size="icon-sm" variant="ghost" aria-label="Mais ações"><DotsThree size={16} weight="regular" /></Button>
          <Button size="icon" variant="tertiary" aria-label="Notificações"><Bell size={16} weight="regular" /></Button>
          <Button size="icon-lg" variant="secondary" aria-label="Pesquisar"><MagnifyingGlass size={16} weight="regular" /></Button>
        </div>
        <Legenda>Passe o cursor: o <Chip>title</Chip> não vem de graça no Button — só o <Chip>aria-label</Chip>. Quem quer tooltip visível embrulha no <Chip>Tooltip</Chip>.</Legenda>
      </Secao>

      <Secao titulo="Fechar" spec="BotaoFechar" descricao="O X pronto, em 28px (Modal, painéis) ou 24px (Toast, glifo de 14). Hover no token de item flutuante, não no accent do ghost comum." codigo={codigoFechar}>
        <div className="flex items-center justify-center gap-4 rounded-md bg-card p-5">
          <BotaoFechar rotulo="Fechar" />
          <BotaoFechar size="icon-xs" rotulo="Fechar notificação" />
        </div>
      </Secao>

      <Secao titulo="Ação no campo" spec="AcaoCampo · 16px" descricao="Dentro de um campo ou de uma célula, a ação não tem caixa: é o glifo de 16px em muted-foreground, que sobe para foreground sob o cursor." codigo={codigoAcao}>
        <div className="flex items-center justify-center gap-3">
          <AcaoCampo icone={Plus} rotulo="Aumentar" />
          <AcaoCampo icone={DotsThree} rotulo="Ações da linha" />
        </div>
        <Legenda>É a mesma peça da tabela (<Chip>CelulaAcoes</Chip>) e do Input. Exige <Chip>rotulo</Chip>, que vira <Chip>aria-label</Chip> e <Chip>title</Chip>.</Legenda>
      </Secao>
    </PaginaDS>
  );
}
