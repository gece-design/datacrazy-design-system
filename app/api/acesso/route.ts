import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { COOKIE_ACESSO, HASH_DA_SENHA } from "@/lib/acesso";

export async function POST(req: Request) {
  const corpo = await req.json().catch(() => null);
  const senha = typeof corpo?.senha === "string" ? corpo.senha : "";
  const hash = createHash("sha256").update(senha).digest("hex");

  if (hash !== HASH_DA_SENHA) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(COOKIE_ACESSO, HASH_DA_SENHA, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return resposta;
}
