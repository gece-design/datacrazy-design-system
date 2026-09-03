import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Shell } from "@/components/ds/shell";

export const metadata: Metadata = {
  title: "DataCrazy · Design System",
  description: "Biblioteca de componentes do CRM DataCrazy",
};

// Evita o flash de tema claro antes do React hidratar.
const temaInicial = `(function(){try{var t=localStorage.getItem("dc-tema");
if(t==="escuro"||(!t&&matchMedia("(prefers-color-scheme:dark)").matches))
document.documentElement.classList.add("dark")}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: temaInicial }} /></head>
      <body className="font-sans">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
