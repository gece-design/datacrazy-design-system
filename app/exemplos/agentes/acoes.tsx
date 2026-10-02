"use client";

import * as React from "react";
import { DotsThree } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Menu, type ItemDoMenu } from "@/components/ui/menu";

/**
 * As ações de um item — o cartão do agente, a linha de um cadastro: o botão
 * de três pontos e o `Menu` que ele abre. Menu de ações: todo item com ícone.
 */
export function AcoesDoItem({
  rotulo,
  itens,
}: {
  /** Nome do botão e do menu. Ex.: "Ações de Suporte nível 1". */
  rotulo: string;
  itens: ItemDoMenu[];
}) {
  const [aberto, setAberto] = React.useState(false);
  const botao = React.useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button
        ref={botao}
        variant="ghost"
        size="icon-xs"
        aria-label={rotulo}
        title={rotulo}
        aria-haspopup="menu"
        aria-expanded={aberto}
        onClick={() => setAberto((a) => !a)}
      >
        <DotsThree size={16} weight="bold" aria-hidden="true" />
      </Button>
      <Menu
        aberto={aberto}
        gatilho={botao}
        rotulo={rotulo}
        itens={itens}
        aoFechar={(devolver = true) => {
          setAberto(false);
          if (devolver) botao.current?.focus();
        }}
      />
    </>
  );
}
