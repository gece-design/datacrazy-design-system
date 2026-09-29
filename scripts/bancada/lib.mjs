// O que os três scripts da bancada compartilham: pastas, execução e o binário
// do Claude Code (o da extensão do VS Code, quando não há `claude` no PATH).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync, spawnSync } from "node:child_process";

export const PASTA = process.env.BANCADA || path.join(os.homedir(), "datacrazy-bancada");
// BANCADA_BASE troca a base: a rodada com a skill antiga usa `base-v1`, preparada
// contra o catálogo de um commit anterior (ver README).
export const BASE = path.join(PASTA, process.env.BANCADA_BASE || "base");
export const RODADAS = path.join(PASTA, "rodadas");
export const DS_URL = process.env.DS_URL || "http://localhost:4321";
export const CASOS = JSON.parse(fs.readFileSync(new URL("./casos.json", import.meta.url), "utf8"));

export function claudeBin() {
  if (process.env.CLAUDE_BIN) return process.env.CLAUDE_BIN;
  const no = spawnSync("which", ["claude"], { encoding: "utf8" });
  if (no.status === 0 && no.stdout.trim()) return no.stdout.trim();
  const ext = path.join(os.homedir(), ".vscode/extensions");
  const versoes = fs.existsSync(ext) ? fs.readdirSync(ext).filter((d) => d.startsWith("anthropic.claude-code-")).sort() : [];
  for (const v of versoes.reverse()) {
    const bin = path.join(ext, v, "resources/native-binary/claude");
    if (fs.existsSync(bin)) return bin;
  }
  throw new Error("claude não encontrado: instale o CLI ou aponte CLAUDE_BIN");
}

export function rodar(cmd, cwd, opts = {}) {
  console.log(`\n$ ${cmd}`);
  return execSync(cmd, { cwd, stdio: opts.silencioso ? "pipe" : "inherit", encoding: "utf8", env: { ...process.env, CI: "1", ...(opts.env ?? {}) }, timeout: opts.timeout ?? 0 });
}

export function flags() {
  const a = process.argv.slice(2);
  const valor = (nome, padrao) => {
    const i = a.indexOf(`--${nome}`);
    return i >= 0 ? a[i + 1] : padrao;
  };
  return { args: a.filter((x, i) => !x.startsWith("--") && !(i > 0 && a[i - 1].startsWith("--"))), valor, tem: (n) => a.includes(`--${n}`) };
}

/** Copia a base para uma rodada sem duplicar node_modules (link simbólico). */
export function copiarBase(destino) {
  fs.rmSync(destino, { recursive: true, force: true });
  fs.mkdirSync(destino, { recursive: true });
  execSync(`rsync -a --exclude node_modules --exclude .next "${BASE}/" "${destino}/"`);
  fs.symlinkSync(path.join(BASE, "node_modules"), path.join(destino, "node_modules"));
}

export function listar(dir, filtro = (f) => /\.(tsx?|css)$/.test(f), rel = "") {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next" || e.name.startsWith(".")) continue;
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...listar(path.join(dir, e.name), filtro, r));
    else if (filtro(e.name)) out.push(r);
  }
  return out;
}
