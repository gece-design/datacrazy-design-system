#!/usr/bin/env node
// Liga o Claude Code ao design system neste projeto. Roda uma vez depois do
// `npx shadcn@latest add @datacrazy/setup`; pode rodar de novo quando quiser —
// não repete nada que já fez e não apaga o que é seu.
//
//   node scripts/ds-setup.mjs
//
// 1. O CLAUDE.md da raiz passa a importar .claude/datacrazy-ds/CLAUDE.md (o
//    contrato do DS, lido em toda sessão). Se o CLAUDE.md já existe, só a
//    linha de import entra no fim; se não existe, ele é criado.
// 2. .claude/settings.json ganha o hook PostToolUse do ds-check: a cada
//    arquivo que o Claude escreve em app/ ou components/, o check roda e
//    devolve as violações para ele corrigir na hora. Mescla; não sobrescreve.
// 3. Confere o que o instalador não faz sozinho e diz o que falta: a skill, o
//    `content` do Tailwind com ./lib/**, a Geist no layout, o .mcp.json.
import fs from "node:fs";
import path from "node:path";

const RAIZ = process.cwd();
const IMPORT = "@.claude/datacrazy-ds/CLAUDE.md";
const CONTRATO = ".claude/datacrazy-ds/CLAUDE.md";
const MEMORIA = ".claude/datacrazy-ds/MEMORIA.md";
const HOOK = { type: "command", command: "node scripts/ds-check.mjs --hook" };

const ok = (m) => console.log(`✓ ${m}`);
const feito = (m) => console.log(`+ ${m}`);
const falta = (m) => console.log(`✗ ${m}`);
const existe = (rel) => fs.existsSync(path.join(RAIZ, rel));
const ler = (rel) => fs.readFileSync(path.join(RAIZ, rel), "utf8");
const escrever = (rel, texto) => {
  fs.mkdirSync(path.dirname(path.join(RAIZ, rel)), { recursive: true });
  fs.writeFileSync(path.join(RAIZ, rel), texto);
};

let pendencias = 0;

// 0 · o que o setup deveria ter deixado
for (const rel of [CONTRATO, MEMORIA, ".claude/skills/datacrazy-ds/SKILL.md", "scripts/ds-check.mjs"]) {
  if (existe(rel)) ok(rel);
  else {
    falta(`${rel} não existe — rode \`npx shadcn@latest add @datacrazy/setup\` (ou setup-v3) antes`);
    pendencias++;
  }
}

// 1 · CLAUDE.md da raiz importa o contrato
if (existe("CLAUDE.md")) {
  const atual = ler("CLAUDE.md");
  if (atual.split("\n").some((l) => l.trim() === IMPORT)) ok(`CLAUDE.md já importa ${CONTRATO}`);
  else {
    escrever("CLAUDE.md", `${atual.replace(/\s*$/, "")}\n\n# Design system (SystemCrazy)\n\n${IMPORT}\n`);
    feito(`CLAUDE.md ganhou a linha \`${IMPORT}\` no fim (o resto ficou como estava)`);
  }
} else {
  escrever(
    "CLAUDE.md",
    `# Este projeto\n\n<!-- O que o Claude precisa saber sobre o seu projeto entra aqui. -->\n\n# Design system (SystemCrazy)\n\n${IMPORT}\n`,
  );
  feito(`CLAUDE.md criado na raiz, importando ${CONTRATO}`);
}

// 2 · o hook do ds-check em .claude/settings.json (mescla)
{
  const rel = ".claude/settings.json";
  let settings = {};
  if (existe(rel)) {
    try {
      settings = JSON.parse(ler(rel));
    } catch {
      falta(`${rel} não é JSON válido — corrija e rode de novo; o hook não foi ligado`);
      settings = null;
      pendencias++;
    }
  }
  if (settings) {
    settings.hooks ??= {};
    settings.hooks.PostToolUse ??= [];
    const jaTem = settings.hooks.PostToolUse.some((g) => (g.hooks ?? []).some((h) => h.command === HOOK.command));
    if (jaTem) ok(`${rel} já tem o hook do ds-check`);
    else {
      settings.hooks.PostToolUse.push({ matcher: "Write|Edit|MultiEdit", hooks: [HOOK] });
      escrever(rel, JSON.stringify(settings, null, 2) + "\n");
      feito(`${rel} ganhou o hook PostToolUse do ds-check (o resto ficou como estava)`);
    }
  }
}

// 3 · o que o instalador não faz sozinho
{
  const config = ["tailwind.config.ts", "tailwind.config.js", "tailwind.config.mjs"].find(existe);
  if (config) {
    if (/lib\/\*\*/.test(ler(config))) ok(`${config}: content inclui ./lib/**`);
    else {
      falta(`${config}: o \`content\` precisa incluir \`"./lib/**/*.{ts,tsx}"\` — as classes de foco e rolagem moram em lib/estados.ts e somem sem isso`);
      pendencias++;
    }
  } else {
    const css = ["app/globals.css", "src/app/globals.css"].find(existe);
    if (css && !/@source\s+["']\.\.?\/?lib/.test(ler(css))) {
      falta(`Tailwind v4: ${css} precisa de \`@source "../lib";\` (ou o caminho do seu lib/) para as classes de lib/estados.ts entrarem`);
      pendencias++;
    } else if (css) ok(`${css}: lib/ está no @source`);
  }

  const layout = ["app/layout.tsx", "src/app/layout.tsx"].find(existe);
  if (layout) {
    if (/GeistSans/.test(ler(layout))) ok(`${layout}: declara a Geist`);
    else {
      falta(`${layout}: a Geist não está declarada — \`import { GeistSans } from "geist/font/sans"\` e \`className={GeistSans.variable}\` no <html>; sem isso toda a tipografia cai na fonte do sistema`);
      pendencias++;
    }
  }

  if (existe(".mcp.json")) ok(".mcp.json: o MCP do shadcn está configurado");
  else {
    falta(".mcp.json não existe — rode `npx shadcn@latest mcp init --client claude` para o Claude instalar componentes sozinho");
    pendencias++;
  }
}

console.log(
  pendencias
    ? `\n${pendencias} pendência(s) acima. Depois de resolver, reinicie o Claude Code (no VS Code, recarregue a janela).`
    : "\nTudo ligado. Reinicie o Claude Code (no VS Code, recarregue a janela) e peça a tela.",
);
