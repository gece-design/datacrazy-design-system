// Roda um caso da bancada: copia a base, pede a tela ao Claude Code (headless,
// como o cliente faria no terminal) e pontua o resultado.
//
//   node scripts/bancada/rodar.mjs todos --rotulo v1
//   node scripts/bancada/rodar.mjs contatos cadastro --rotulo v2 --max-turns 80
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { BASE, RODADAS, CASOS, claudeBin, copiarBase, flags } from "./lib.mjs";

const { args, valor } = flags();
const rotulo = valor("rotulo", new Date().toISOString().slice(0, 16).replace(/[-:T]/g, ""));
const maxTurnos = valor("max-turns", "80");
const modelo = valor("modelo", null);
const ids = args.length === 0 || args.includes("todos") ? CASOS.map((c) => c.id) : args;
if (!fs.existsSync(BASE)) throw new Error("base não existe: rode preparar.mjs");
const bin = claudeBin();

for (const id of ids) {
  const caso = CASOS.find((c) => c.id === id);
  if (!caso) throw new Error(`caso desconhecido: ${id}`);
  const dir = path.join(RODADAS, rotulo, id);
  copiarBase(dir);
  fs.writeFileSync(path.join(dir, "prompt.txt"), caso.prompt + "\n");
  console.log(`\n## ${rotulo}/${id}\n> ${caso.prompt}`);
  const inicio = Date.now();
  const r = spawnSync(
    bin,
    ["-p", caso.prompt, "--output-format", "json", "--dangerously-skip-permissions", "--mcp-config", ".mcp.json", "--max-turns", maxTurnos, ...(modelo ? ["--model", modelo] : [])],
    { cwd: dir, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, env: { ...process.env, CI: "1" } },
  );
  fs.writeFileSync(path.join(dir, "claude.json"), r.stdout || "");
  fs.writeFileSync(path.join(dir, "claude.err"), r.stderr || "");
  let resumo = "";
  try { resumo = JSON.parse(r.stdout).result ?? ""; } catch { resumo = "(saída não é JSON — veja claude.err)"; }
  fs.writeFileSync(path.join(dir, "resposta.md"), resumo + "\n");
  console.log(`claude terminou em ${Math.round((Date.now() - inicio) / 1000)}s (exit ${r.status})`);
  // o agente costuma subir `next dev` para conferir e deixar no ar: derruba antes de pontuar
  spawnSync("pkill", ["-f", "next dev -p"]);
  const p = spawnSync("node", [new URL("./pontuar.mjs", import.meta.url).pathname, dir], { encoding: "utf8", stdio: "inherit" });
  if (p.status) console.log(`pontuar falhou (${p.status})`);
}
console.log(`\nrodada em ${path.join(RODADAS, rotulo)}`);
