# DataCrazy · Design System

Biblioteca de componentes do CRM DataCrazy. O site **é** o design system: cada
página mostra o componente em todas as variantes.

```bash
npm install
npm run dev     # http://localhost:4321
```

## Stack

Next.js · React · TypeScript · Tailwind v3 · Radix (via shadcn) ·
**Geist** + Geist Mono · **Phosphor Icons**

Tailwind v3 e variáveis CSS em HSL de propósito: é o mesmo padrão do
`globals.css` do CRM, para que a adoção seja copiar e colar.

## De onde vêm os valores

`app/globals.css` e `tailwind.config.ts` são **espelho** das coleções `Cor` e
`Tipografia` do arquivo `DESIGN - DATA CRAZY` no Figma. Não edite valor aqui:
edite no Figma e reexporte. Mapa completo em `docs/02-design-system.md`.

Duas regras do kit aplicadas na exportação:
- entrelinha em px vira px literal, nunca o `leading-*` nomeado, que arredonda
- tracking em px vira `em`, dividido pelo tamanho da fonte

## Estados de interação

Hover, foco, active e disabled **não são desenhados no Figma** — decisão
registrada (exceção E-01). São derivados por regra, sempre ancorados num token
que existe. Ver `docs/processo/interactions.md`.

## Estrutura

```
app/            rotas do site — uma por componente
components/ui/  os componentes do design system
components/ds/  a moldura do site (sidebar, preview, tema)
scripts/        medição, screenshot e verificações (check:temas, check:paginas)
docs/           documentação — comece por docs/README.md
.kfe-kit/       o kit Kill Front-End vendorizado (v3.2): skills, templates, scripts
```

## A documentação

`docs/` segue a arquitetura do kit v3.2 — **um arquivo, um assunto; um fato,
um dono**. A raiz descreve o produto; `docs/processo/` guarda o maquinário do
ciclo (estado, plano, evidência, calibração).

Comece sempre por [docs/README.md](docs/README.md): ele tem a árvore e a
tabela "pra fazer X, leia Y". A estrutura é verificada por script:

```bash
npm run check:docs    # reprova link quebrado, órfão de índice e arquivo fora do template
npm run docs:index    # regenera os índices lendo os arquivos reais
npm run check         # tipos + temas + páginas + docs
```
