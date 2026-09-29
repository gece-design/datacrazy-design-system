import type { Metadata } from "next";
import { Tela } from "./tela";

export const metadata: Metadata = {
  title: "Atendimento · DataCrazy",
  description: "Multiatendimento em três colunas: conversas, mensagens e o lead, montado só com componentes do design system",
};

/**
 * Tela de exemplo, não componente. Roda fora da moldura do site: ocupa a
 * janela inteira, como uma tela do CRM.
 */
export default function AtendimentoPage() {
  return <Tela />;
}
