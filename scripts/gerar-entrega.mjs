// Gera lib/entrega.json: os números da entrega, lidos do próprio repositório —
// componentes e docs, catálogo (public/r), auditoria, ADRs, kfe-state e git.
// A página /entrega mostra. Roda à mão (o git da Vercel é raso):
//
//   npm run registry && node scripts/gerar-entrega.mjs
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import { RAIZ, ler, existe, pascal, componentesUi, lerNavegacao, exportsDe, secoesDoMd } from "./lib/fonte.mjs";

const require = createRequire(import.meta.url);
const git = (cmd) => execSync(`git ${cmd}`, { cwd: RAIZ, encoding: "utf8" }).trim();
const linhasDeTabela = (secao) => (secao ?? "").split("\n").filter((l) => /^\|\s*`?[^|-]/.test(l) && !/^\|\s*(Prop|Variante|Estado|Item)\s*\|/.test(l)).length;

/* Catálogo */
const registroRel = "public/r/registry.json";
if (!existe(registroRel)) throw new Error("public/r não existe: rode `npm run registry` antes");
const registro = JSON.parse(ler(registroRel));
const porTipo = {};
for (const i of registro.items) porTipo[i.type] = (porTipo[i.type] ?? 0) + 1;

/* Componentes */
const nav = lerNavegacao();
const componentes = componentesUi().map((name) => {
  const fonte = ler(`components/ui/${name}.tsx`);
  const md = secoesDoMd(`docs/componentes/${pascal(name)}.md`) ?? {};
  const item = registro.items.find((i) => i.name === name);
  const estados = (md.Estados ?? "").match(/<!-- kfe:estados:start -->([\s\S]*?)<!-- kfe:estados:end -->/)?.[1] ?? "";
  const pagina = item?.docs?.match(/https?:\/\/[^/\s]+(\/[^\s]*)$/)?.[1] ?? null;
  // o H1 da doc é o nome do componente; o título do item do catálogo pode ser o da
  // página que o hospeda (Rating vive na página do Input)
  const h1 = (existe(`docs/componentes/${pascal(name)}.md`) ? ler(`docs/componentes/${pascal(name)}.md`) : "").match(/^# (.+)$/m)?.[1];
  return {
    name,
    titulo: h1?.replace(/^Componente:\s*/i, "").replace(/`/g, "").trim() || item?.title || pascal(name),
    descricao: item?.description ?? "",
    categoria: item?.categories?.[0] ?? null,
    pagina,
    // peças: funções, componentes e hooks exportados (sem tipos nem constantes)
    pecas: (fonte.match(/^export (?:function|const) [a-z][\w]*|^export (?:function|const) [A-Z][a-z]\w*/gm) ?? []).length,
    props: linhasDeTabela(md.Props),
    variantes: linhasDeTabela(md.Variantes),
    estados: linhasDeTabela(estados),
    acessibilidade: linhasDeTabela(md.Acessibilidade),
    linhas: fonte.split("\n").length,
  };
});

/* Tokens */
const ext = require("tailwindcss/loadConfig")(path.join(RAIZ, "tailwind.config.ts")).theme.extend;
const contar = (obj) => Object.values(obj ?? {}).reduce((n, v) => n + (typeof v === "object" && !Array.isArray(v) ? contar(v) : 1), 0);
const tokens = {
  cores: contar(ext.colors),
  tipografia: Object.keys(ext.fontSize ?? {}).length,
  raios: Object.keys(ext.borderRadius ?? {}).length,
  sombras: Object.keys(ext.boxShadow ?? {}).length,
  camadas: Object.keys(ext.zIndex ?? {}).length,
  animacoes: Object.keys(ext.animation ?? {}).length,
  duracoes: Object.keys(ext.transitionDuration ?? {}).length,
};

/* Páginas e telas */
const categorias = [];
for (const p of nav) {
  let c = categorias.find((x) => x.titulo === p.categoria);
  if (!c) categorias.push((c = { titulo: p.categoria, total: 0, prontas: 0, itens: [] }));
  c.total++;
  if (p.pronto) c.prontas++;
  c.itens.push({ titulo: p.titulo, href: p.href, pronto: p.pronto });
}

/* ADRs */
const adrs = [...ler("docs/processo/adr.md").matchAll(/^## (ADR-\d+) · (.+?) · (\d{4}-\d{2}-\d{2})\s*$/gm)].map((m) => ({ id: m[1], titulo: m[2], data: m[3] }));

/* Auditoria */
const auditoria = JSON.parse(ler("docs/processo/consistencia.json")).achados;
const porStatus = {};
const porEixo = {};
for (const a of auditoria) {
  porStatus[a.status] = (porStatus[a.status] ?? 0) + 1;
  porEixo[a.eixo] = (porEixo[a.eixo] ?? 0) + 1;
}

/* Os lotes entregues desde a primeira reunião com o cliente (2026-09-18): as
   entradas do kfe-state com título, e de onde veio cada uma. */
const PRIMEIRA_REUNIAO = "2026-09-18";
const pedidos = [];
for (const m of ler("docs/processo/kfe-state.md").matchAll(/^- (\d{4}-\d{2}-\d{2}) · (.+)$/gm)) {
  const texto = m[2];
  const titulo = texto.match(/\*\*([^*]+)\*\*/)?.[1];
  if (!titulo || m[1] < PRIMEIRA_REUNIAO) continue;
  const origem = /whatsapp/i.test(texto) ? "WhatsApp" : /reuni[ãa]o/i.test(texto) ? "Reunião" : /cliente/i.test(texto) ? "Cliente" : /humano/i.test(texto) ? "Revisão" : "Lote";
  pedidos.push({ data: m[1], origem, titulo: titulo.replace(/`/g, ""), resumo: texto.replace(/\*\*[^*]+\*\*\s*·?\s*/, "").replace(/`/g, "").replace(/\s+/g, " ").slice(0, 200) });
}
pedidos.sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));

/* Git */
const commits = Number(git("rev-list --count HEAD"));
const datas = git("log --reverse --format=%ad --date=short").split("\n");
const arquivos = git("ls-files").split("\n").filter(Boolean);
const linhasDe = (prefixo, ext = /\.(tsx?|css|mjs)$/) => arquivos.filter((f) => f.startsWith(prefixo) && ext.test(f)).reduce((n, f) => n + ler(f).split("\n").length, 0);

/* Qualidade */
const scripts = JSON.parse(ler("package.json")).scripts;
const checks = Object.keys(scripts).filter((k) => k.startsWith("check:") && !["check:completo"].includes(k)).map((k) => k.replace("check:", ""));
const capturas = nav.filter((p) => p.pronto).length * 2;

const entrega = {
  geradoEm: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10),
  periodo: { inicio: datas[0], fim: datas[datas.length - 1] },
  git: { commits, arquivos: arquivos.length, linhasUi: linhasDe("components/ui/"), linhasLib: linhasDe("lib/"), linhasDocs: linhasDe("docs/", /\.md$/) },
  catalogo: { itens: registro.items.length, porTipo },
  componentes,
  totais: {
    componentes: componentes.length,
    pecas: componentes.reduce((n, c) => n + c.pecas, 0),
    props: componentes.reduce((n, c) => n + c.props, 0),
    variantes: componentes.reduce((n, c) => n + c.variantes, 0),
    estados: componentes.reduce((n, c) => n + c.estados, 0),
    acessibilidade: componentes.reduce((n, c) => n + c.acessibilidade, 0),
    paginas: nav.filter((p) => p.pronto).length,
    docs: componentes.length,
  },
  tokens,
  categorias,
  adrs,
  auditoria: { total: auditoria.length, porStatus, porEixo },
  pedidos,
  qualidade: { checks, capturas, temas: 2 },
  bancada: null,
};
fs.writeFileSync(path.join(RAIZ, "lib/entrega.json"), JSON.stringify(entrega, null, 2) + "\n");
console.log(`lib/entrega.json · ${componentes.length} componentes · ${registro.items.length} itens · ${adrs.length} ADRs · ${auditoria.length} achados · ${pedidos.length} pedidos · ${commits} commits`);
