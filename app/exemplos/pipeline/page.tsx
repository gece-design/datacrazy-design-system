import type { Metadata } from "next";
import { Tela } from "./tela";

export const metadata: Metadata = {
  title: "Pipeline · DataCrazy",
  description: "Funil de vendas em kanban, montado só com componentes do design system",
};

/**
 * Tela de exemplo, não componente. Roda fora da moldura do site (ver o desvio
 * em `components/ds/shell.tsx`): ocupa a janela inteira, como uma tela do CRM.
 */
export default function PipelinePage() {
  return <Tela />;
}
