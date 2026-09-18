"use client";

/**
 * Os mocks do cliente, transcritos como ele mandou.
 *
 * Origem: "Ícones dos botões de ação (standalone).html" — mocks 1A, 2C e 2B.
 * Aqui NÃO valem as regras do design system, e é de propósito: a cor é o hex
 * do arquivo dele, a fonte é a de sistema, a medida é o pixel que ele escreveu.
 * Vestir isto de token faria o resultado ficar melhor do que a proposta é, e a
 * página existe justamente para mostrar a proposta como ela é.
 *
 * Por isso tudo mora num `<style>` com escopo `.dcli`, longe do Tailwind: nada
 * daqui pode vazar para o DS nem virar referência de nada. Exceção única,
 * autorizada pelo humano em 2026-09-17 — não repetir.
 *
 * Esta rota é PÚBLICA — é o link que vai para o cliente. O texto que a
 * envolve mora em ./conteudo.tsx e é escrito para ele. A leitura técnica
 * do material fica em ./ds, que não sobe para produção.
 */

import * as React from "react";

/* Os `d` dos ícones são os do arquivo dele — inclusive os que não se lêem. */
const ICONES = {
  perfil: "M4 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1M12 3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7",
  campos: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  negocios: "M3 8h18v11H3zM9 8V5h6v3",
  atividades: "M3 12h4l2.5-7 4 14L16 12h5",
  atendimentos: "M4 5h16v11H9l-5 4z",
  historicos: "M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16M12 8v4.5l3 2",
  hierarquia:
    "M12 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M12 7v2M8 13V9.5h8V13M6 15a2 2 0 1 1 4 0 2 2 0 0 1-4 0M14 15a2 2 0 1 1 4 0 2 2 0 0 1-4 0",
  pessoas: "M2 20v-1a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v1M7.5 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6M16 15.2a4 4 0 0 1 6 3.8v1M16 5.5a3 3 0 0 1 0 5.5",
  empresas: "M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M15 9h3a2 2 0 0 1 2 2v10M2 21h20M8 7h3M8 11h3M8 15h3",
  enderecos: "M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11M12 8a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5",
  arquivos: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5",
  notas: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M8 13h8M8 17h5",
  etiqueta: "M3.6 11.4 11.4 3.6h6.9a2 2 0 0 1 2 2v6.9l-7.8 7.8a2 2 0 0 1-2.8 0l-6.1-6.1a2 2 0 0 1 0-2.8Z",
  lista: "M4 6h11M4 12h8M4 18h7M17 14.5v6M14 17.5h6",
  raio: "M13 2.5 4.8 13.2H11l-1 8.3 8.4-11.1H12z",
  caret: "m6 9 6 6 6-6",
} as const;

const NAV = [
  { id: "perfil", nome: "Perfil", d: ICONES.perfil },
  { id: "campos", nome: "Campos adicionais", d: ICONES.campos },
  { id: "negocios", nome: "Negócios", d: ICONES.negocios },
  { id: "atividades", nome: "Atividades", d: ICONES.atividades },
  { id: "atendimentos", nome: "Atendimentos", d: ICONES.atendimentos },
  { id: "historicos", nome: "Históricos", d: ICONES.historicos },
  { id: "hierarquia", nome: "Hierarquia", d: ICONES.hierarquia },
  { id: "pessoas", nome: "Pessoas", d: ICONES.pessoas },
  { id: "empresas", nome: "Empresas", d: ICONES.empresas },
  { id: "enderecos", nome: "Endereços", d: ICONES.enderecos },
  { id: "arquivos", nome: "Arquivos", d: ICONES.arquivos },
  { id: "notas", nome: "Notas", d: ICONES.notas },
];

function Glifo({ d, s = 17, w = 1.7 }: { d: string; s?: number; w?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

function Etiqueta({ s = 13 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONES.etiqueta} />
      <circle cx="16" cy="8" r="1.3" />
    </svg>
  );
}

/* O arquivo dele importa um `ActionMenu` que veio empacotado e não abre aqui.
   Este é um substituto mínimo, na mesma paleta, só para o clique ter destino. */
function Menu({ titulo, itens, alinhar }: { titulo: string; itens: string[]; alinhar: "esq" | "dir" }) {
  return (
    <div className={`dcli-menu dcli-menu--${alinhar}`}>
      <div className="dcli-menu-topo">{titulo}</div>
      {itens.map((i) => (
        <div key={i} className="dcli-menu-item">
          {i}
        </div>
      ))}
    </div>
  );
}

const AUTOMACOES = ["Boas-vindas", "Follow-up 3 dias", "Recuperar carrinho", "Reengajamento"];
const ATENDENTES = ["Davi Baldin", "Esther Moreira", "Liam Souza", "Marina Albuquerque"];

/* ------------------------------------------------------------------ 1A -- */

export function Mock1A() {
  const [aberto, setAberto] = React.useState<"auto" | "att" | null>(null);
  const alterna = (q: "auto" | "att") => () => setAberto((a) => (a === q ? null : q));

  return (
    <div className="dcli">
      <div className="dcli-card">
        <div className="dcli-cab">
          <span className="dcli-badge">1A</span>
          <span className="dcli-nome">Barra de ícones</span>
        </div>
        <div className="dcli-desc">Quatro ícones em linha, sem texto. Ocupa uma linha só e o cartão fica com respiro.</div>

        <div className="dcli-painel">
          <div className="dcli-capa" />
          <div className="dcli-corpo">
            <div className="dcli-av92">X</div>
            <div className="dcli-titulo">XBOX</div>
            <div className="dcli-pills">
              <span className="dcli-pill dcli-pill--lead">Lead</span>
              <span className="dcli-pill dcli-pill--empresa">Empresa</span>
            </div>
            <div className="dcli-tags">
              <span className="dcli-t dcli-t--vermelho">Abandoned ...</span>
              <span className="dcli-t dcli-t--verde">agendado</span>
              <span className="dcli-t dcli-t--agua">First Purchase</span>
              <span className="dcli-t dcli-t--cinza">+2</span>
            </div>

            <div className="dcli-acoes">
              <button type="button" className="dcli-ib" title="Adicionar tags">
                <Etiqueta s={19} />
              </button>
              <button type="button" className="dcli-ib" title="Adicionar lista">
                <Glifo d={ICONES.lista} s={19} />
              </button>
              <button type="button" className="dcli-ib" title="Executar automação" onClick={alterna("auto")}>
                <Glifo d={ICONES.raio} s={19} />
              </button>
              <button type="button" className="dcli-ib" title="Atendente: Davi Baldin" onClick={alterna("att")}>
                <span className="dcli-av24">D</span>
              </button>
              {aberto === "auto" ? <Menu titulo="Executar automação" itens={AUTOMACOES} alinhar="esq" /> : null}
              {aberto === "att" ? <Menu titulo="Atribuir atendente" itens={ATENDENTES} alinhar="dir" /> : null}
            </div>
            <div className="dcli-legenda">Tags · Lista · Automação · Atendente</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 2C -- */

export function Mock2C() {
  const [sel, setSel] = React.useState("historicos");

  return (
    <div className="dcli">
      <div className="dcli-card">
        <div className="dcli-cab">
          <span className="dcli-badge">2C</span>
          <span className="dcli-nome">Trilho de ícones</span>
        </div>
        <div className="dcli-desc">
          A navegação vira uma coluna estreita de ícones ao lado do conteúdo do contato. Rótulo no hover.
        </div>

        <div className="dcli-quadro dcli-quadro--linha">
          <div className="dcli-trilho">
            {NAV.map((it) => (
              <button
                key={it.id}
                type="button"
                title={it.nome}
                onClick={() => setSel(it.id)}
                className={`dcli-trilho-item${sel === it.id ? " is-sel" : ""}`}
              >
                <Glifo d={it.d} s={18} />
              </button>
            ))}
          </div>

          <div className="dcli-trilho-conteudo">
            <div className="dcli-av72-wrap">
              <div className="dcli-av72">X</div>
              <span className="dcli-flag">Lead</span>
            </div>
            <div className="dcli-titulo16">XBOX</div>
            <div className="dcli-tags">
              <span className="dcli-t dcli-t--vermelho">Abandoned ...</span>
              <span className="dcli-t dcli-t--verde">agendado</span>
              <span className="dcli-t dcli-t--cinza">+3</span>
            </div>
            <div className="dcli-col">
              <button type="button" className="dcli-linha-btn">
                <span className="dcli-av18">D</span>Davi Baldin
              </button>
              <button type="button" className="dcli-linha-btn">
                <Glifo d={ICONES.raio} s={15} w={1.8} />
                Executar automação
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 2B -- */

export function Mock2B() {
  const [sel, setSel] = React.useState("perfil");

  return (
    <div className="dcli">
      <div className="dcli-card">
        <div className="dcli-cab">
          <span className="dcli-badge">2B</span>
          <span className="dcli-nome">Grade de duas colunas</span>
        </div>
        <div className="dcli-desc">
          Os 12 itens cabem em 6 linhas: normalmente nem chega a rolar, e o cabeçalho fica inteiro.
        </div>

        <div className="dcli-quadro">
          <div className="dcli-cabecalho">
            <div className="dcli-av64-wrap">
              <div className="dcli-av64">X</div>
              <span className="dcli-flag dcli-flag--64">Lead</span>
            </div>
            <div className="dcli-titulo15">XBOX</div>
            <div className="dcli-cab-botoes">
              <button type="button" className="dcli-chip">
                <span className="dcli-av18">D</span>Davi Baldin
              </button>
              <button type="button" className="dcli-chip dcli-chip--so-icone" title="Executar automação">
                <Glifo d={ICONES.raio} s={15} w={1.8} />
              </button>
            </div>
          </div>

          <div className="dcli-grade">
            {NAV.map((it) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setSel(it.id)}
                className={`dcli-grade-item${sel === it.id ? " is-sel" : ""}`}
              >
                <Glifo d={it.d} s={17} />
                {it.nome}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- Folha de estilo -- */

/** Os hex do arquivo do cliente, escopados em `.dcli`. Um `<style>` só, montado
 *  uma vez pela página — nenhuma destas regras alcança nada fora daqui. */
export function EstiloDosMocks() {
  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}

const CSS = `
.dcli{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#eef1f6;padding:28px;display:flex;justify-content:center;color:#0f172a}
.dcli *{box-sizing:border-box}
.dcli button{font:inherit;cursor:pointer;background:none;border:0;padding:0;color:inherit}

.dcli-card{width:360px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px}
.dcli-cab{display:flex;align-items:center;gap:10px;margin-bottom:4px}
.dcli-badge{font-size:11px;font-weight:700;letter-spacing:.08em;color:#2f6fed;background:#eaf1fe;padding:3px 8px;border-radius:6px}
.dcli-nome{font-size:15px;font-weight:650;color:#0f172a}
.dcli-desc{font-size:13px;color:#64748b;line-height:1.5;margin-bottom:18px}

.dcli-painel{background:#f8fafc;border:1px solid #eef2f7;border-radius:12px}
.dcli-capa{height:64px;background:linear-gradient(180deg,#8fdcc9,#7ed2bd);border-radius:11px 11px 0 0}
.dcli-corpo{padding:0 20px 22px;text-align:center}

.dcli-av92{width:92px;height:92px;border-radius:50%;background:#e4f7f1;color:#3cb99b;font-size:38px;font-weight:600;display:flex;align-items:center;justify-content:center;margin:-46px auto 10px}
.dcli-titulo{font-size:17px;font-weight:700;color:#0f172a;margin-bottom:10px}
.dcli-pills{display:flex;gap:8px;justify-content:center;margin-bottom:10px}
.dcli-pill{font-size:12px;font-weight:600;border-radius:999px;padding:4px 12px}
.dcli-pill--lead{color:#e11d6f;border:1px solid #f9c6da}
.dcli-pill--empresa{color:#7c3aed;border:1px solid #d9c9fb}

.dcli-tags{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:16px}
.dcli-t{font-size:12px;border-radius:999px;padding:4px 10px}
.dcli-t--vermelho{background:#fde2e2;color:#c2410c}
.dcli-t--verde{background:#dcfce7;color:#15803d}
.dcli-t--agua{background:#d7f5f2;color:#0f766e}
.dcli-t--cinza{background:#f1f5f9;color:#64748b}

.dcli-acoes{display:flex;gap:10px;justify-content:center;position:relative}
.dcli .dcli-ib{width:38px;height:38px;border-radius:10px;background:#fff;border:1px solid #e2e8f0;color:#475569;display:flex;align-items:center;justify-content:center}
.dcli .dcli-ib:hover{border-color:#2f6fed;color:#2f6fed}
.dcli-av24{width:24px;height:24px;border-radius:50%;background:#fde2e4;color:#be123c;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center}
.dcli-legenda{font-size:11px;color:#94a3b8;margin-top:10px}

.dcli-menu{position:absolute;top:46px;width:240px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;box-shadow:0 8px 24px rgba(15,23,42,.14);padding:6px;z-index:20;text-align:left}
.dcli-menu--esq{left:0}
.dcli-menu--dir{right:0}
.dcli-menu-topo{font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#94a3b8;padding:6px 8px}
.dcli .dcli-menu-item{font-size:12.5px;color:#475569;padding:7px 8px;border-radius:7px}
.dcli .dcli-menu-item:hover{background:#f4f7fb;color:#0f172a}

.dcli-quadro{height:520px;display:flex;flex-direction:column;background:#fff;border:1px solid #eef2f7;border-radius:12px;overflow:hidden}
.dcli-quadro--linha{flex-direction:row}

.dcli-trilho{flex:none;width:52px;background:#f8fafc;border-right:1px solid #eef2f7;overflow-y:auto;padding:8px 0;display:flex;flex-direction:column;align-items:center;gap:4px}
.dcli .dcli-trilho-item{background:none;width:36px;height:36px;border-radius:9px;color:#64748b;display:flex;align-items:center;justify-content:center;flex:none}
.dcli .dcli-trilho-item:hover{background:#eef2f7;color:#0f172a}
.dcli .dcli-trilho-item.is-sel{background:#eaf1fe;color:#2f6fed}
.dcli-trilho-conteudo{flex:1;min-width:0;padding:16px;text-align:center;overflow-y:auto}

.dcli-av72-wrap{position:relative;width:72px;margin:0 auto 8px}
.dcli-av72{width:72px;height:72px;border-radius:50%;background:#e4f7f1;color:#3cb99b;font-size:30px;font-weight:600;display:flex;align-items:center;justify-content:center}
.dcli-flag{position:absolute;top:4px;left:58px;font-size:10.5px;font-weight:700;color:#fff;background:#e11d6f;border-radius:5px;padding:2px 7px;white-space:nowrap;box-shadow:0 2px 6px rgba(15,23,42,.12)}
.dcli-flag--64{top:2px;left:52px}
.dcli-titulo16{font-size:16px;font-weight:700;color:#0f172a;margin-bottom:10px}
.dcli-col{display:flex;flex-direction:column;gap:6px;margin-top:10px}
.dcli .dcli-linha-btn{background:#fff;display:flex;align-items:center;gap:7px;height:32px;padding:0 10px;border-radius:8px;border:1px solid #e2e8f0;color:#475569;font-size:12px;font-weight:600}
.dcli .dcli-linha-btn:hover{border-color:#2f6fed;color:#2f6fed}

.dcli-cabecalho{flex:none;background:#f8fafc;border-bottom:1px solid #eef2f7;padding:16px;text-align:center}
.dcli-av64-wrap{position:relative;width:64px;margin:0 auto 8px}
.dcli-av64{width:64px;height:64px;border-radius:50%;background:#e4f7f1;color:#3cb99b;font-size:26px;font-weight:600;display:flex;align-items:center;justify-content:center}
.dcli-titulo15{font-size:15px;font-weight:700;color:#0f172a;margin-bottom:8px}
.dcli-cab-botoes{display:flex;gap:6px;justify-content:center}
.dcli .dcli-chip{display:flex;align-items:center;gap:6px;height:30px;padding:0 10px;border-radius:8px;background:#fff;border:1px solid #e2e8f0;color:#0f172a;font-size:12px;font-weight:600}
.dcli .dcli-chip--so-icone{color:#475569}
.dcli-av18{width:18px;height:18px;border-radius:50%;background:#fde2e4;color:#be123c;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex:none}

.dcli-grade{flex:1;min-height:0;overflow-y:auto;padding:10px;display:grid;grid-template-columns:1fr 1fr;gap:6px;align-content:start}
.dcli .dcli-grade-item{background:#fff;display:flex;flex-direction:column;align-items:flex-start;gap:5px;padding:10px;border-radius:9px;border:1px solid #eef2f7;color:#475569;font-size:12px;font-weight:600;line-height:1.2;text-align:left}
.dcli .dcli-grade-item:hover{border-color:#c9d8f5;background:#f8fafc;color:#0f172a}
.dcli .dcli-grade-item.is-sel{border-color:transparent;background:#eaf1fe;color:#2f6fed}
`;
