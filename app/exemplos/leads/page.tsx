import type { Metadata } from "next";
import { Tela } from "./tela";

export const metadata: Metadata = {
  title: "Leads · DataCrazy",
  description: "A lista de contatos do CRM: grade densa com ícone por coluna, tags e origem editadas na célula, filtros em chips e o lead aberto ao lado",
};

/**
 * Tela de exemplo, não componente. Roda fora da moldura do site: ocupa a
 * janela inteira, como uma tela do CRM.
 */
export default function LeadsPage() {
  return <Tela />;
}
