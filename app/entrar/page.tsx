"use client";

import { useState } from "react";
import { ModalPainel, Scrim } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// O modal do portão (middleware.ts). É o ModalPainel do próprio DS, parado:
// sem X e sem Escape, porque não há para onde voltar sem a senha.
export default function Entrar() {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string>();
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    if (!senha) {
      setErro("Digite a senha.");
      return;
    }
    setEnviando(true);
    setErro(undefined);
    try {
      const resposta = await fetch("/api/acesso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha }),
      });
      if (resposta.ok) {
        // a URL ainda é a da página pedida: recarregar já entrega o conteúdo
        window.location.reload();
        return;
      }
      setErro(resposta.status === 401 ? "Senha incorreta." : "Não foi possível entrar. Tente de novo.");
    } catch {
      setErro("Sem conexão. Tente de novo.");
    }
    setEnviando(false);
  }

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      <Scrim />
      <ModalPainel
        role="dialog"
        aria-modal="true"
        titulo="Design System DataCrazy"
        descricao="Digite a senha de acesso que você recebeu do time DataCrazy."
        className="motion-safe:animate-fade-in-fast"
        acoes={
          <Button size="sm" type="submit" form="form-acesso" disabled={enviando}>
            {enviando ? "Entrando…" : "Entrar"}
          </Button>
        }
      >
        <form id="form-acesso" onSubmit={entrar} className="pb-2">
          <Input
            rotulo="Senha"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            erro={erro}
          />
        </form>
      </ModalPainel>
    </div>
  );
}
