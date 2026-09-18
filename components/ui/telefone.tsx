"use client";

import * as React from "react";
import { CaretDown } from "@phosphor-icons/react";
import { blocoDeCampo, caixaDeCampo, caixaNoCartao, rotuloDeCampo } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * InputTelefone — o campo de telefone com país à esquerda.
 *
 * O arquivo desenha só o campo de texto; a bandeira e o DDI entraram por
 * pedido do humano (2026-09-17). Telefone de CRM é discado e comparado entre
 * países, e sem o DDI separado não dá para saber se `+55 11 …` está faltando
 * país ou faltando DDD.
 *
 * O seletor de país é um `<select>` nativo, transparente por cima da bandeira:
 * mesma escolha dos seletores de mês e ano do Date Picker. Ganha o teclado, a
 * busca por letra e a roda do sistema no celular sem nenhum código.
 *
 * A bandeira é emoji. É texto, acompanha a fonte e não pesa nada — mas o
 * Windows não desenha bandeira: lá aparece o código do país (BR, US). Por isso
 * o DDI fica escrito ao lado, e não só a bandeira.
 */

export type Pais = {
  /** ISO 3166-1 alpha-2. */
  codigo: string;
  nome: string;
  /** Com o "+". Ex.: "+55". */
  ddi: string;
  bandeira: string;
};

/** Países do CRM hoje. A lista vem de fora quando precisar de outra. */
export const PAISES: Pais[] = [
  { codigo: "BR", nome: "Brasil", ddi: "+55", bandeira: "🇧🇷" },
  { codigo: "PT", nome: "Portugal", ddi: "+351", bandeira: "🇵🇹" },
  { codigo: "US", nome: "Estados Unidos", ddi: "+1", bandeira: "🇺🇸" },
  { codigo: "AR", nome: "Argentina", ddi: "+54", bandeira: "🇦🇷" },
  { codigo: "CL", nome: "Chile", ddi: "+56", bandeira: "🇨🇱" },
  { codigo: "CO", nome: "Colômbia", ddi: "+57", bandeira: "🇨🇴" },
  { codigo: "MX", nome: "México", ddi: "+52", bandeira: "🇲🇽" },
  { codigo: "PY", nome: "Paraguai", ddi: "+595", bandeira: "🇵🇾" },
  { codigo: "UY", nome: "Uruguai", ddi: "+598", bandeira: "🇺🇾" },
  { codigo: "ES", nome: "Espanha", ddi: "+34", bandeira: "🇪🇸" },
  { codigo: "GB", nome: "Reino Unido", ddi: "+44", bandeira: "🇬🇧" },
  { codigo: "DE", nome: "Alemanha", ddi: "+49", bandeira: "🇩🇪" },
];

export interface InputTelefoneProps {
  rotulo: string;
  /** Só o número, sem DDI. */
  valor: string;
  aoMudar: (valor: string) => void;
  /** ISO 3166-1 alpha-2 do país escolhido. */
  pais: string;
  aoMudarPais: (codigo: string) => void;
  /** aria-label do seletor de país. Ex.: "País do telefone". */
  rotuloPais: string;
  paises?: Pais[];
  placeholder?: string;
  erro?: string;
  /** Ações de 16px depois do número. Use `AcaoCampo`. */
  acoes?: React.ReactNode;
  /** Põe o campo dentro do cartão do drawer — ver `Input`. */
  cartao?: boolean;
  disabled?: boolean;
  className?: string;
}

export function InputTelefone({
  rotulo,
  valor,
  aoMudar,
  pais,
  aoMudarPais,
  rotuloPais,
  paises = PAISES,
  placeholder,
  erro,
  acoes,
  cartao,
  disabled,
  className,
}: InputTelefoneProps) {
  const id = React.useId().replace(/:/g, "");
  const campoId = `telefone-${id}`;
  const erroId = `${campoId}-erro`;
  const escolhido = paises.find((p) => p.codigo === pais) ?? paises[0];

  return (
    <div className={cn(cartao ? blocoDeCampo() : "flex min-w-0 flex-col gap-1", className)}>
      <label htmlFor={campoId} className={rotuloDeCampo(cartao)}>
        {rotulo}
      </label>
      <div className={cn(caixaDeCampo({ erro: Boolean(erro), disabled }), "gap-1.5 pl-1.5", cartao && caixaNoCartao)}>
        <div className="relative flex shrink-0 items-center gap-1 rounded-sm px-1 text-body-md text-input-text focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-ring">
          <span aria-hidden="true" title={escolhido.codigo}>
            {escolhido.bandeira}
          </span>
          <span className="tabular-nums">{escolhido.ddi}</span>
          <CaretDown size={12} weight="bold" aria-hidden="true" className="text-input-placeholder" />
          {/* nativo e invisível por cima: o clique, o teclado e o seletor do
              celular são os do sistema; o que se vê é a bandeira ao lado */}
          <select
            aria-label={rotuloPais}
            value={escolhido.codigo}
            disabled={disabled}
            onChange={(e) => aoMudarPais(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          >
            {paises.map((p) => (
              <option key={p.codigo} value={p.codigo}>
                {p.bandeira} {p.nome} {p.ddi}
              </option>
            ))}
          </select>
        </div>
        <span aria-hidden="true" className="h-4 w-px shrink-0 bg-input-border" />
        <input
          id={campoId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={valor}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? erroId : undefined}
          onChange={(e) => aoMudar(e.target.value)}
          className="h-full min-w-0 flex-1 truncate bg-transparent text-body-md text-input-text outline-none placeholder:text-input-placeholder disabled:cursor-not-allowed disabled:text-input-text-disabled"
        />
        {acoes ? <div className="flex shrink-0 items-center gap-1.5">{acoes}</div> : null}
      </div>
      {erro ? (
        <p id={erroId} className="text-caption text-destructive">
          {erro}
        </p>
      ) : null}
    </div>
  );
}

/** "+55 11 98765-4321" — o que vai para o back e para o `tel:`. */
export function telefoneCompleto(pais: string, numero: string, paises: Pais[] = PAISES) {
  const p = paises.find((x) => x.codigo === pais);
  return `${p?.ddi ?? ""} ${numero}`.trim();
}
