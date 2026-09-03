import type { Config } from "tailwindcss";

// Espelho do Figma. Regras G1 e G2 do kit aplicadas: line-height em px vira
// valor px literal; tracking em px vira em (px ÷ tamanho da fonte).
const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
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
          neutral: { "900": "hsl(var(--neutral-900))" },
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
        // realce interno que o Figma aplica em toda superfície da sidebar:
        // inset 0 1px 4px #ffffff40. Nomeado para não virar valor mágico (G5).
        highlight: "inset 0 1px 4px 0 rgb(255 255 255 / 0.25)",
        // botão que flutua sobre a borda do painel (collapse toggle)
        float: "0 4px 4px 0 rgb(0 0 0 / 0.08)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      zIndex: {
        base: "0", dropdown: "10", sticky: "20", overlay: "30",
        modal: "40", popover: "50", toast: "60",
      },
    },
  },
  plugins: [],
};
export default config;
