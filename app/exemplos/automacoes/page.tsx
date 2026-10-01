import type { Metadata } from "next";
import { Tela } from "./tela";

export const metadata: Metadata = {
  title: "Automações · DataCrazy",
  description: "O construtor de automações: blocos ligados num canvas, com o bloco aberto num painel ao lado, montado só com componentes do design system",
};

/**
 * Tela de exemplo, não componente. Roda fora da moldura do site: ocupa a
 * janela inteira, como uma tela do CRM.
 */
export default function AutomacoesPage() {
  return <Tela />;
}
