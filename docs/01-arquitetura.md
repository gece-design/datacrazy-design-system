# DataCrazy — Stack (etapa 1 · STACKS) — **v3**

Produto: CRM DataCrazy, **já existente** · Entrega deste ciclo: **refazer o
design system** (refazer e melhorar os componentes); telas depois.
Decidido com o humano em 2026-09-01.

> **Histórico das versões.** v1 decidiu uma stack do zero, presumindo produto
> novo — errado. v2 virou puro retrato do CRM existente — incompleto, porque a
> biblioteca de componentes **é** uma decisão nova. v3 separa as duas coisas:
> o que é herdado do CRM e o que se escolhe agora.

---

## Parte 1 · O que é herdado (não se escolhe)

O CRM vai consumir esta biblioteca, então ela precisa caber nele.

| Camada | Valor | Por quê é herdado |
|---|---|---|
| Biblioteca de UI | **React** | O CRM é React |
| Linguagem | **TypeScript** | Idem |
| Estilo | **Tailwind** | Base de estilo do produto, confirmada pelo Gava |
| Ambiente do CRM | **Next.js** | Onde os componentes vão viver |
| ~~Ícones~~ | movido para a Parte 2 — **decisão nova do humano**, não herança | — |
| Tipografia | **Geist** + **Geist Mono** | Definida no Figma (72 variáveis `text/*`) |

⚠️ **A versão do Tailwind precisa ser confirmada.** v3 e v4 declaram tokens e
variáveis CSS de formas diferentes. Se eu construir a biblioteca numa versão e
o CRM estiver na outra, a adoção quebra em cima da hora. É a única incógnita
herdada que pode custar caro — e depende de olhar o repo (bloqueio B1).

---

## Parte 2 · O que foi decidido agora

| Decisão | Escolha | Motivo |
|---|---|---|
| **Onde a biblioteca nasce** | Aqui, em `datacrazy-frontend` | Destrava agora; o repo do CRM não está acessível. Depois é portada |
| **Como chega no CRM** | **Código dentro do projeto, estilo shadcn/ui** | O time vira dono e edita direto, sem publicar nada. É o padrão que o CRM já usa — continuidade, não mudança |
| **Base dos componentes** | **shadcn/ui sobre Radix** | Acessibilidade e comportamento vêm do Radix; a aparência é nossa |
| **Showcase** | Uma página única com todo componente em todas as variantes | Simples de abrir e de mandar link. **Referência visual a definir** — o humano vai enviar |
| **Ambiente de desenvolvimento daqui** | **Next.js** | Espelha o destino. Mesmo runtime, mesmo carregamento de fonte (`next/font` para a Geist), showcase como rota. Vite seria mais leve, mas criaria diferença com o lugar onde os componentes vão morar |

### Ícones — **Phosphor** (decidido pelo humano em 2026-09-01)

`@phosphor-icons/react` · 9.000+ ícones · 6 pesos (thin, light, regular, bold,
fill, duotone) · licença MIT · import individual com tree-shaking.

⚠️ **Conflito com a anti-referência nº 14.** O board registra: *"ícones muito
arredondados (respond.io) — manter o padrão atual, Lucide"*. A decisão do
humano é Phosphor, que é uma família de terminações arredondadas. A decisão
vale; o que ela exige é cuidado na execução:

- **Fixar UM peso** para toda a interface. Seis pesos soltos viram exatamente a
  "quebra de padronização" da anti-referência nº 2.
- Proposta a aprovar: **`regular`** como padrão e **`fill`** só para item
  selecionado — casa com os tokens `nav/item/*-selected`, que já existem.
- Se o resultado ficar arredondado demais aos olhos do time, o ajuste é trocar
  o peso, não trocar ícone a ícone.

### Ferramental que vem junto do padrão shadcn

`class-variance-authority` (variantes) · `tailwind-merge` + `clsx` (composição
de classes) · `@phosphor-icons/react` (ícones) · `@radix-ui/*` (primitivos).

---

## Parte 3 · Lista negativa (proibido sem aprovação registrada)

**Gerais**
- CSS-in-JS (`styled-components` e similares)
- Redux e derivados
- CSS solto fora do padrão de tokens/Tailwind
- Valor de estilo mágico: cor, medida, sombra ou fonte fora dos tokens
- Biblioteca fora da base sem desvio aprovado
- Ícone ou imagem redesenhado à mão — sai do Figma ou do repo
- Componente do design system que conhece o domínio (`<LeadCard>` é do produto)
- Componente novo que duplique um existente

**Do DataCrazy — cada uma nasce de bug real**
| Proibido | Tickets |
|---|---|
| Truncar texto sem tooltip | #83283 · #83274 · #59567 |
| Número solto de sobreposição (`z-index`) — só a escala de camadas | #86338 · #86178 |
| Layout que só fecha em zoom 100% | #83285 · #80170 · #79852 · #53179 |
| Variável de tema com o mesmo valor no claro e no escuro | #80174 |
| Texto fixo na interface — tudo traduzível | requisito R3 |
| Adotar `@tanstack/react-query` — está instalado, mas o time usa `fetch` com hook próprio | confirmado pelo Gava |

**De direção visual** (das anti-referências — detalhe em `docs/regras.md`)
Arredondamento forte · cor preenchendo superfície · saturação alta · amarelo
como cor de marca · gradiente de fundo · glass · dois menus ao mesmo tempo ·
abas para crescer.

---

## Parte 4 · Fronteira com o back-end

**Fora deste ciclo.** A entrega é biblioteca de componentes: componente de
design system não conhece domínio nem faz requisição. O que se sabe da API
está registrado, sem nada presumido, em `docs/api-contract.yaml`.

---

## Pendências

1. **Versão do Tailwind do CRM** — depende de acesso ao repo (B1)
2. **Referência visual do showcase** — o humano vai enviar
3. Caminho de carregamento da Geist (pacote `geist` ou Google Fonts) —
   ver `docs/processo/fonts-checklist.md`
