// Prepara a base da bancada: um projeto Next limpo que segue, passo a passo,
// a página de instalação do DS (SystemCrazy) — como o cliente faria. Tudo
// que a base já traz de errado é achado da instalação, não do Claude.
//
//   node scripts/bancada/preparar.mjs            (DS local em http://localhost:4321)
//   BANCADA_BASE=base-v1 DS_URL=http://localhost:4399 node scripts/bancada/preparar.mjs
//     (outra base, contra o catálogo de um commit antigo servido de um worktree — a rodada "antes")
//   DS_URL=https://… node scripts/bancada/preparar.mjs
//
// Antes: o DS precisa estar servindo com o catálogo apontando para ele mesmo
//   DS_URL=http://localhost:4321 node scripts/gerar-registry.mjs   (com `npm run start` no ar)
import fs from "node:fs";
import path from "node:path";
import { PASTA, BASE, DS_URL, rodar } from "./lib.mjs";

const NEXT = process.env.CREATE_NEXT_APP || "create-next-app@15.1.8"; // Tailwind v3, como o CRM
fs.mkdirSync(PASTA, { recursive: true });
fs.rmSync(BASE, { recursive: true, force: true });

// 1 · projeto limpo
rodar(`npx --yes ${NEXT} ${path.basename(BASE)} --ts --tailwind --no-eslint --app --no-src-dir --import-alias "@/*" --use-npm --no-turbopack --yes`, PASTA);
// 2 · shadcn iniciado (requisito da página de instalação)
rodar(`npx --yes shadcn@latest init -d -y`, BASE);
// 3 · os quatro passos da página de instalação
rodar(`npx --yes shadcn@latest registry add @datacrazy=${DS_URL}/r/{name}.json`, BASE);
rodar(`npx --yes shadcn@latest add @datacrazy/setup-v3 -y -o`, BASE);
rodar(`node scripts/ds-setup.mjs --corrigir`, BASE);
rodar(`npx --yes shadcn@latest mcp init --client claude`, BASE);
rodar(`npx --yes shadcn@latest add @datacrazy/tela -y -o`, BASE);

// o que a instalação deixou
const esperados = ["components.json", ".mcp.json", ".claude/skills/datacrazy-ds/SKILL.md", ".claude/datacrazy-ds/CLAUDE.md", ".claude/datacrazy-ds/MEMORIA.md", "CLAUDE.md", ".claude/settings.json", "scripts/ds-check.mjs", "components/ui/tela-base.tsx", "app/nova-tela/page.tsx", "lib/utils.ts"];
const faltam = esperados.filter((f) => !fs.existsSync(path.join(BASE, f)));
console.log(`\nbase em ${BASE}`);
console.log(faltam.length ? `✗ faltam: ${faltam.join(", ")}` : "✓ instalação deixou tudo que a página promete");
const layout = fs.readFileSync(path.join(BASE, "app/layout.tsx"), "utf8");
console.log(/<html[^>]*className=\{[^}]*geist/i.test(layout) ? "✓ layout declara a Geist no <html>" : "✗ layout não declara a Geist no <html> (a skill pede; o ds-setup --corrigir faz)");
// compila?
try {
  rodar("npx tsc --noEmit", BASE, { silencioso: true });
  console.log("✓ tsc");
} catch (e) {
  console.log("✗ tsc\n" + String(e.stdout).split("\n").slice(0, 12).join("\n"));
}
