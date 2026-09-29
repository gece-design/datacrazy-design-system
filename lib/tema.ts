import { useEffect, useState } from "react";

export type Tema = "claro" | "escuro";

/**
 * O tema do CRM: classe `dark` no `<html>` e memória em localStorage
 * (`dc-tema`) — é o que o setup do DS instala. No produto, troque por quem já
 * cuida do tema (next-themes): o `SidebarThemeSwitch` só precisa de `tema` e
 * `onTemaChange`. Um hook só para o site, as telas de exemplo e os blocos
 * instaláveis (antes cada um tinha uma cópia).
 */
export function useTema() {
  const [escuro, setEscuro] = useState(false);
  useEffect(() => setEscuro(document.documentElement.classList.contains("dark")), []);
  function mudar(tema: Tema) {
    const novo = tema === "escuro";
    setEscuro(novo);
    document.documentElement.classList.toggle("dark", novo);
    try {
      localStorage.setItem("dc-tema", tema);
    } catch {
      /* sem memória do tema */
    }
  }
  const tema: Tema = escuro ? "escuro" : "claro";
  return { tema, escuro, mudar, alternar: () => mudar(escuro ? "claro" : "escuro") };
}
