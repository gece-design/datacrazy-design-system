import type { Metadata } from "next";
import { Tela } from "./tela";

export const metadata: Metadata = {
  title: "Dashboard · DataCrazy",
  description: "Indicadores, receita por dia, origem dos negócios e o que precisa de atenção, montado só com componentes do design system",
};

/**
 * Tela de exemplo, não componente. Roda fora da moldura do site: ocupa a
 * janela inteira, como uma tela do CRM.
 */
export default function DashboardPage() {
  return <Tela />;
}
