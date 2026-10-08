// Exportado do Figma (component set `logo sidebar`, node 270:7595), com os
// fills trocados por currentColor para acompanhar o tema. Não redesenhar:
// reexportar de lá. É a marca do PRODUTO — não confundir com `components/ds/logo.tsx`,
// que é a marca do site de documentação.

/** O símbolo isolado — 32×32. É o que sobra quando a sidebar colapsa. */
export function SimboloDataCrazy({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M10.137 31.5364L8.61601 28.4486L8.86962 27.1018L23.0282 21.7612L3.10272 17.5132V13.8521L3.94205 12.8124L23.3514 6.73274L0 4.50065V0.985472L0.842614 0L30.8518 3.56642L31.5364 4.73815V7.88148L9.65047 15.2016L28.4156 19.0537L29.1265 20.1299V23.0305L10.137 31.5364Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Só a palavra — 87×17. Nunca aparece sozinha; anda com o símbolo. */
function AssinaturaDataCrazy({ className }: { className?: string }) {
  return (
    <svg
      width="87"
      height="17"
      viewBox="0 0 87 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M78.3364 16.5735V14.8544H84.4077L85.1435 14.1186V12.6941L84.4013 13.2419H79.1215L78.077 12.2868V3.54468H79.8457V11.5226H84.0479L85.1436 10.7309V3.54468H86.9123V14.9585L85.201 16.574L78.3364 16.5735ZM68.0971 13.2982L67.1601 12.2511L67.3098 10.4568L74.7086 6.01626L74.7185 5.8974L67.7434 5.25794L67.8863 3.54468L75.6066 4.25361L76.5438 5.30071L76.396 7.07305L68.9972 11.5125L68.9872 11.6323L76.0248 12.301L75.882 14.0125L68.0971 13.2982ZM57.1726 13.0352L56.8409 9.05925L57.7731 7.98663L63.8205 7.4313L63.6526 5.41875L56.9789 6.03103L56.8361 4.31777L64.2312 3.6392L65.3511 4.49512L66.0775 13.2039L64.5781 13.3416L64.3596 12.6638L63.4673 13.4437L58.2682 13.9207L57.1726 13.0352ZM58.635 9.54227L58.8501 12.1196L62.9904 11.7397L64.0975 10.7555L63.9556 9.05405L58.635 9.54227ZM40.5467 13.3005L39.5852 12.2535L40.2325 4.49607L41.3525 3.64015L48.0945 4.25881L49.0559 5.30579L48.8306 8.00873L47.09 7.84898L47.2518 5.9078L41.931 5.4191L41.4108 11.654L46.7314 12.1422L46.8934 10.2004L48.634 10.3601L48.4087 13.0631L47.2885 13.919L40.5467 13.3005ZM50.1313 4.02049L51.3818 3.90576L51.9492 4.52915L51.9579 4.63384L52.7916 3.7765L55.3162 3.54468L55.4591 5.25794L53.316 5.45455L52.1288 6.67995L52.6993 13.5189L50.937 13.6807L50.1313 4.02049ZM36.6118 13.2098L36.4504 12.5147L35.4968 13.2098H30.2778L29.2601 12.2267V8.23606L30.2778 7.25265H36.3483V5.23218H29.649V3.51301H37.0724L38.1169 4.46807V13.2098H36.6118ZM31.0072 11.4683H35.1632L36.3482 10.5891V8.88119H31.0072V11.4683ZM23.1516 13.2098L22.1072 12.2547V5.23242H20.9185V3.51301H22.1073V1.22386H23.3627L23.876 1.89735V3.51301H27.4848V5.23242H23.8759V11.4909H27.4847V13.2098H23.1516ZM18.0054 13.2098L17.8441 12.5147L16.8905 13.2098H11.6713L10.6535 12.2267V8.23606L11.6713 7.25265H17.7417V5.23218H11.0428V3.51301H18.4662L19.5106 4.46807V13.2098H18.0054ZM12.4008 11.4683H16.5572L17.7419 10.5891V8.88119H12.4008V11.4683ZM7.42861 13.2098L7.27912 12.677L6.63697 13.2098H1.04185L0 12.2291V4.49371L1.04185 3.51301H6.63618L7.10934 3.90293V0.699956L7.61821 0H8.87862V13.2098H7.42861ZM1.76872 11.4683H6.2385L7.10968 10.7373V5.96688L6.26284 5.27791H1.76872V11.4683Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * A marca completa: símbolo + assinatura, 119×32, separados por 1px — a folga
 * do Figma, que é intencional e não um `gap` de auto-layout arredondado.
 * A cor vem por `currentColor`, então quem posiciona escolhe o token.
 */
export function LogoDataCrazy({
  simbolo = false,
  className,
}: {
  /** Só o símbolo — o estado colapsado da sidebar. 32px; `[&>svg]:size-5` no `className` encolhe para 20. */
  simbolo?: boolean;
  className?: string;
}) {
  if (simbolo) {
    return (
      <span className={["inline-flex", className].filter(Boolean).join(" ")} role="img" aria-label="DataCrazy">
        <SimboloDataCrazy className="size-8" />
      </span>
    );
  }
  return (
    <span
      className={["inline-flex items-center gap-px", className].filter(Boolean).join(" ")}
      role="img"
      aria-label="DataCrazy"
    >
      <SimboloDataCrazy className="size-8 shrink-0" />
      <AssinaturaDataCrazy className="shrink-0" />
    </span>
  );
}
