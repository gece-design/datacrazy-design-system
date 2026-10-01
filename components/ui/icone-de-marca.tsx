import * as React from "react";
import {
  FacebookLogo,
  GoogleLogo,
  InstagramLogo,
  LinkedinLogo,
  MetaLogo,
  TelegramLogo,
  TiktokLogo,
  WhatsappLogo,
  YoutubeLogo,
  type Icon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Ícone de marca — de onde o lead veio e por onde a conversa acontece
 * (WhatsApp, Instagram, Google…). Conjunto FECHADO: marca nova entra aqui, com
 * o glifo do Phosphor e a cor oficial em `marca/*`; a tela nunca pinta um
 * logo com cor solta (cliente, 2026-09-28: "falta um componente ícone de
 * integração com um conjunto fechado de marcas aprovadas").
 *
 * É a única exceção à regra do peso único (A8): logo é `fill`, na cor da
 * marca. `mono` devolve o glifo ao peso `regular` e à cor do texto em volta —
 * para fileira em que a cor competiria com o dado (ADR-048).
 */
const MARCAS = {
  whatsapp: { glifo: WhatsappLogo, cor: "text-marca-whatsapp" },
  instagram: { glifo: InstagramLogo, cor: "text-marca-instagram" },
  facebook: { glifo: FacebookLogo, cor: "text-marca-facebook" },
  google: { glifo: GoogleLogo, cor: "text-marca-google" },
  meta: { glifo: MetaLogo, cor: "text-marca-meta" },
  linkedin: { glifo: LinkedinLogo, cor: "text-marca-linkedin" },
  telegram: { glifo: TelegramLogo, cor: "text-marca-telegram" },
  youtube: { glifo: YoutubeLogo, cor: "text-marca-youtube" },
  // a marca é preta: acompanha o texto, que inverte com o tema
  tiktok: { glifo: TiktokLogo, cor: "text-foreground" },
} satisfies Record<string, { glifo: Icon; cor: string }>;

export type Marca = keyof typeof MARCAS;
/** As marcas do conjunto, na ordem em que aparecem num seletor. */
export const MARCAS_DISPONIVEIS = Object.keys(MARCAS) as Marca[];

export interface IconeDeMarcaProps extends Omit<React.SVGAttributes<SVGSVGElement>, "color"> {
  marca: Marca;
  /** 14 na célula da tabela, 16 em lista e botão (padrão), 20 em destaque. */
  tamanho?: 12 | 14 | 16 | 20;
  /** Sem a cor da marca: peso `regular`, na cor do texto em volta. */
  mono?: boolean;
  /** Nome da marca para leitor de tela. Só quando o ícone aparece SEM o nome ao lado. */
  rotulo?: string;
}

export function IconeDeMarca({ marca, tamanho = 16, mono = false, rotulo, className, ...props }: IconeDeMarcaProps) {
  const { glifo: Glifo, cor } = MARCAS[marca];
  return (
    <Glifo
      size={tamanho}
      weight={mono ? "regular" : "fill"}
      role={rotulo ? "img" : undefined}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : true}
      className={cn("shrink-0", !mono && cor, className)}
      {...props}
    />
  );
}
