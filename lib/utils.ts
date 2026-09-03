import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// O tailwind-merge não conhece a nossa escala tipográfica: sem isto ele trata
// `text-body-md` e `text-muted-foreground` como o mesmo grupo e descarta um dos
// dois — o componente perde o tamanho e cai nos 16px do navegador.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display", "h1", "h2", "h3", "h4",
            "body-lg", "body-md", "body-sm",
            "label-lg", "label-md", "label-sm",
            "caption", "overline", "button", "metric",
          ],
        },
      ],
      "text-color": [
        {
          text: [
            "foreground", "muted-foreground", "subtle-foreground",
            "primary", "primary-foreground", "accent-foreground",
            "surface-inverse-foreground", "card-foreground",
            "success", "warning", "destructive", "info",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
