import type { Config } from "tailwindcss";
import { DURACAO, CURVA } from "./lib/movimento";

// Espelho do Figma. Regras G1 e G2 do kit aplicadas: line-height em px vira
// valor px literal; tracking em px vira em (px ÷ tamanho da fonte).
const config: Config = {
  darkMode: ["class"],
  // lib/ entra por causa de lib/estados.ts: as classes de foco e disabled moram lá (D21)
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "background": "hsl(var(--background))",
        "foreground": "hsl(var(--foreground))",
        "card": "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        "subtle-foreground": "hsl(var(--subtle-foreground))",
        "accent": "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        "surface-inverse": "hsl(var(--surface-inverse))",
        "surface-inverse-foreground": "hsl(var(--surface-inverse-foreground))",
        "primary": "hsl(var(--primary))",
        "primary-hover": "hsl(var(--primary-hover))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        "border": "hsl(var(--border))",
        "ring": "hsl(var(--ring))",
        "success": "hsl(var(--success))",
        "success-hover": "hsl(var(--success-hover))",
        "destructive": "hsl(var(--destructive))",
        "destructive-hover": "hsl(var(--destructive-hover))",
        "divider": "hsl(var(--divider))",
        // Button `soft` e opção selecionada do Segmented — tokens de componente
        // com par próprio no escuro (o arquivo repete o claro nos dois).
        "button-soft": "hsl(var(--button-soft-bg))",
        "button-soft-foreground": "hsl(var(--button-soft-foreground))",
        "button-soft-hover": "hsl(var(--button-soft-hover))",
        "segmented-item-selected": "hsl(var(--segmented-item-selected))",
        "warning": "hsl(var(--warning))",
        "warning-hover": "hsl(var(--warning-hover))",
        "info": "hsl(var(--info))",
        "info-hover": "hsl(var(--info-hover))",
        // nav/item — tokens de componente da coleção "Cor", usados pela Sidebar.
        "nav-item": "hsl(var(--nav-item-text-default))",
        "nav-item-hover": "hsl(var(--nav-item-bg-hover))",
        "nav-item-selected": "hsl(var(--nav-item-bg-selected))",
        "nav-item-selected-foreground": "hsl(var(--nav-item-text-selected))",
        "nav-item-selected-icon": "hsl(var(--nav-item-icon-selected))",
        "sidebar-avatar": "hsl(var(--sidebar-avatar))",
        "avatar-md-fundo": "hsl(var(--avatar-md-fundo))",
        "avatar-md-anel": "hsl(var(--avatar-md-anel))",
        // tom do perfil no drawer — só existem dentro de um [data-tom]
        "tom-anel": "hsl(var(--tom-anel))",
        "tom-texto": "hsl(var(--tom-texto))",
        "tom-tag": "hsl(var(--tom-tag))",
        "tom-brilho": "hsl(var(--tom-brilho))",
        // input/* e overlay/* — tokens de componente da coleção "Cor".
        "input-bg": "hsl(var(--input-bg))",
        "input-border": "hsl(var(--input-border))",
        "input-border-hover": "hsl(var(--input-border-hover))",
        "input-border-focus": "hsl(var(--input-border-focus))",
        "input-border-error": "hsl(var(--input-border-error))",
        "input-text": "hsl(var(--input-text))",
        "input-placeholder": "hsl(var(--input-placeholder))",
        "input-label": "hsl(var(--input-label))",
        "input-helper": "hsl(var(--input-helper))",
        "input-bg-disabled": "hsl(var(--input-bg-disabled))",
        "input-text-disabled": "hsl(var(--input-text-disabled))",
        "overlay-bg": "hsl(var(--overlay-bg))",
        "overlay-border": "hsl(var(--overlay-border))",
        "overlay-item-hover": "hsl(var(--overlay-item-hover))",
        "overlay-item-selected": "hsl(var(--overlay-item-selected))",
        "overlay-item-text-selected": "hsl(var(--overlay-item-text-selected))",
        "overlay-scrim": "hsl(var(--overlay-scrim))",
        base: {
          blue: {
          "50": "hsl(var(--blue-50))",
          "100": "hsl(var(--blue-100))",
          "200": "hsl(var(--blue-200))",
          "300": "hsl(var(--blue-300))",
          "400": "hsl(var(--blue-400))",
          "500": "hsl(var(--blue-500))",
          "600": "hsl(var(--blue-600))",
          "700": "hsl(var(--blue-700))",
          },
          neutral: { "800": "hsl(var(--neutral-800))", "900": "hsl(var(--neutral-900))" },
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      fontSize: {
        "display": ["26px", { lineHeight: "32px", letterSpacing: "-0.0231em", fontWeight: "600" }],
        "h1": ["22px", { lineHeight: "28px", letterSpacing: "-0.0182em", fontWeight: "600" }],
        "h2": ["18px", { lineHeight: "24px", letterSpacing: "-0.0111em", fontWeight: "600" }],
        "h3": ["15px", { lineHeight: "20px", letterSpacing: "0.0em", fontWeight: "600" }],
        "h4": ["13px", { lineHeight: "18px", letterSpacing: "0.0em", fontWeight: "600" }],
        "body-lg": ["13px", { lineHeight: "18px", letterSpacing: "0.0em", fontWeight: "400" }],
        "body-md": ["12px", { lineHeight: "17px", letterSpacing: "0.0em", fontWeight: "400" }],
        "body-sm": ["11px", { lineHeight: "16px", letterSpacing: "0.0em", fontWeight: "400" }],
        "label-lg": ["12px", { lineHeight: "16px", letterSpacing: "0.0em", fontWeight: "500" }],
        "label-md": ["11px", { lineHeight: "15px", letterSpacing: "0.0em", fontWeight: "500" }],
        "label-sm": ["10px", { lineHeight: "14px", letterSpacing: "0.0em", fontWeight: "500" }],
        "caption": ["10px", { lineHeight: "14px", letterSpacing: "0.0em", fontWeight: "400" }],
        "overline": ["10px", { lineHeight: "14px", letterSpacing: "0.05em", fontWeight: "500" }],
        "button": ["13px", { lineHeight: "18px", letterSpacing: "0.0em", fontWeight: "500" }],
        "metric": ["16px", { lineHeight: "21px", letterSpacing: "-0.0125em", fontWeight: "600" }],
      },
      boxShadow: {
        // Realce interno do gatilho md do Select (261:333). Era valor arbitrário em select.tsx.
        "select-inner": "inset 0 4px 5px 0 rgb(106 117 129 / 0.06)",
        // elevation/* do Figma, com TODAS as camadas (G4). Os nomes sm/md/lg/xl
        // sobrescrevem os do Tailwind DE PROPÓSITO: assim `shadow-md` é a nossa
        // sombra, e a da biblioteca deixa de ser alcançável por engano.
        sm: "0 1px 2px 0 rgb(10 13 20 / 0.06)",
        md: "0 1px 2px -1px rgb(10 13 20 / 0.06), 0 2px 4px -1px rgb(10 13 20 / 0.08)",
        lg: "0 2px 4px -2px rgb(10 13 20 / 0.06), 0 8px 16px -4px rgb(10 13 20 / 0.10)",
        xl: "0 4px 8px -4px rgb(10 13 20 / 0.08), 0 16px 32px -8px rgb(10 13 20 / 0.14)",
        // realce interno que o Figma aplica em toda superfície da sidebar:
        // inset 0 1px 4px #ffffff40. Nomeado para não virar valor mágico (G5).
        highlight: "inset 0 1px 4px 0 rgb(255 255 255 / 0.25)",
        // botão que flutua sobre a borda do painel (collapse toggle)
        float: "0 4px 4px 0 rgb(0 0 0 / 0.08)",
        // "button inner shadow" — estilo de efeito do Figma (269:32). Vem de
        // variável porque no escuro ele SOME: o brilho é claro e lava a
        // superfície (decisão do humano, 2026-09-18).
        "button-inner": "var(--shadow-button-inner)",
        // A exceção: sobre o azul cheio do `primary` o brilho continua relevo
        // nos dois temas, então aqui o valor é literal.
        "button-inner-primary": "inset 2px 4px 8px 0 rgb(232 241 255 / 0.4)",
      },
      backgroundImage: {
        // cartão de métrica do drawer: mesma ideia do topo do perfil, na diagonal
        "metrica": "linear-gradient(135deg, hsl(var(--card)) 30%, hsl(var(--tom-brilho)) 100%)",
        // topo do perfil no drawer (node 565:6447): card até 79,91%, brilho do tom no fim.
        "drawer-perfil":
          "linear-gradient(2.2deg, hsl(var(--card)) 79.91%, hsl(var(--tom-brilho)) 96.01%)",
      },
      // Escala do Figma: 0 · 2 · 4 · 6 · 8 · 12 · 999. `--radius` é o degrau
      // lg (8px) e os outros saem dele, então mudar a base move a escala toda.
      borderRadius: {
        none: "0px",
        xs: "calc(var(--radius) - 6px)",
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        full: "999px",
      },
      zIndex: {
        base: "0", dropdown: "10", sticky: "20", overlay: "30",
        modal: "40", popover: "50", toast: "60",
      },
      // Escalas de dimensão (auditoria de consistência, lote B2)
      // 1.5px de traço interno (D18): era `ring-[1.5px]` em três controles.
      ringWidth: { "1.5": "1.5px" },
      // Opacidade com nome: `opacity-disabled` no controle apagado (I5) e
      // `bg-overlay-scrim/scrim` no fundo de Modal e Drawer (pendência 7).
      opacity: { disabled: ".5", scrim: ".4" },

      // Motion — dono único em lib/movimento.ts (D20). Não há token do Figma:
      // os valores foram aprovados nos gates (ADR-010, ADR-019, ADR-021).
      // Redução de movimento é GLOBAL no globals.css (I12); `motion-safe:`
      // continua válido, mas não é mais o que segura a regra.
      transitionDuration: { fast: `${DURACAO.fast}ms`, base: `${DURACAO.base}ms`, slow: `${DURACAO.slow}ms` },
      transitionDelay: { fast: `${DURACAO.fast}ms`, base: `${DURACAO.base}ms`, slow: `${DURACAO.slow}ms` },
      transitionTimingFunction: { enter: CURVA.enter, exit: CURVA.exit, settle: CURVA.settle, pop: CURVA.pop },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-out": { from: { opacity: "1" }, to: { opacity: "0" } },
        // Drawer: entra deslizando da direita, sai pelo mesmo caminho.
        "drawer-entra": { from: { transform: "translateX(100%)" }, to: { transform: "translateX(0)" } },
        "drawer-sai": { from: { transform: "translateX(0)" }, to: { transform: "translateX(100%)" } },
        // abre o espaço do toast na pilha: altura por grid-template-rows e o
        // gap de 8px do container pela margem, para nada pular
        "toast-open": {
          from: { gridTemplateRows: "0fr", marginTop: "-0.5rem" },
          to: { gridTemplateRows: "1fr", marginTop: "0" },
        },
        // Rating: a estrela salta e volta ao clicar. O passo de 0,92 é o
        // contrapeso — sem ele o movimento sobe e para, e parece travar.
        "estrela-pop": {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "35%": { transform: "scale(1.45) rotate(-10deg)" },
          "70%": { transform: "scale(0.92) rotate(4deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" },
        },
        // o halo que sai da estrela clicada e some crescendo
        "estrela-brilho": {
          from: { transform: "scale(0.4)", opacity: "0.55" },
          to: { transform: "scale(2.2)", opacity: "0" },
        },
      },
      animation: {
        // fade-in é a entrada do Toast: 250 → 280 (slow) no gate B0
        "fade-in": `fade-in ${DURACAO.slow}ms ${CURVA.enter}`,
        "fade-in-fast": `fade-in ${DURACAO.fast}ms ${CURVA.enter}`,
        // 180 → 200 (base): a saída ganha o mesmo tempo das outras saídas
        "fade-out": `fade-out ${DURACAO.base}ms ${CURVA.exit} forwards`,
        // o balão do Tooltip: some rápido, senão fica por cima do próximo gatilho
        "fade-out-fast": `fade-out ${DURACAO.fast}ms ${CURVA.exit} forwards`,
        // A curva de entrada desacelera bem no fim: o painel "assenta" em vez
        // de parar seco. A saída é mais curta e acelera — sair não é evento.
        "drawer-entra": `drawer-entra ${DURACAO.slow}ms ${CURVA.settle}`,
        "drawer-sai": `drawer-sai ${DURACAO.base}ms ${CURVA.exit} forwards`,
        "toast-open": `toast-open ${DURACAO.base}ms ${CURVA.enter}`,
        // Os dois da estrela ficam com tempo próprio: são coreografia, não
        // transição de estado. Literal no config é token; literal em componente não.
        "estrela-pop": `estrela-pop 420ms ${CURVA.pop} both`,
        "estrela-brilho": `estrela-brilho 480ms ${CURVA.enter} forwards`,
      },
    },
  },
  plugins: [],
};
export default config;
