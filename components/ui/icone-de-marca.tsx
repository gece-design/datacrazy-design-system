import * as React from "react";
import {
  FacebookLogo,
  GoogleLogo,
  InstagramLogo,
  LinkedinLogo,
  MetaLogo,
  TelegramLogo,
  TiktokLogo,
  WhatsappLogo,
  YoutubeLogo,
  Globe,
  type Icon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Ícone de marca — de onde o lead veio e por onde a conversa acontece
 * (WhatsApp, Instagram, Google…). Conjunto FECHADO: marca nova entra aqui; a
 * tela nunca cola um `<svg>` de logo nem pinta um glifo com cor solta
 * (cliente, 2026-09-28: "falta um componente ícone de integração com um
 * conjunto fechado de marcas aprovadas").
 *
 * Os desenhos são os logos de verdade, com as cores de cada marca — não um
 * glifo de biblioteca pintado (humano, 2026-10-01: "coloque os corretos").
 * Vêm prontos, nenhum desenhado à mão: coleção "SVG Logos", de Gil Barbara
 * (CC0), e o do Instagram de "Skill Icons" (MIT, © tandpfun). As cores moram
 * no próprio desenho, como numa imagem: não são tokens e não mudam com o tema.
 *
 * `mono` troca o logo pelo glifo do Phosphor em peso `regular`, na cor do
 * texto em volta — para a fileira em que a cor competiria com o dado (ADR-048).
 */
type Desenho = {
  /** O `viewBox` do arquivo de origem; o logo é centrado numa caixa quadrada. */
  caixa: string;
  /** `u` é único por instância: gradiente com id repetido some quando a primeira cópia está escondida. */
  desenho: (u: string) => React.ReactNode;
  mono: Icon;
};

const MARCAS = {
  whatsapp: {
    caixa: "0 0 256 258",
    mono: WhatsappLogo,
    desenho: (u) => (
      <>
        <defs>
          <linearGradient id={`${u}-0`} x1="50%" x2="50%" y1="100%" y2="0%">
            <stop offset="0%" stopColor="#1faf38" />
            <stop offset="100%" stopColor="#60d669" />
          </linearGradient>
          <linearGradient id={`${u}-1`} x1="50%" x2="50%" y1="100%" y2="0%">
            <stop offset="0%" stopColor="#f9f9f9" />
            <stop offset="100%" stopColor="#fff" />
          </linearGradient>
        </defs>
        <path fill={`url(#${u}-0)`} d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a123 123 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004" />
        <path fill={`url(#${u}-1)`} d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416m40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513z" />
        <path fill="#fff" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561s11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716s-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64" />
      </>
    ),
  },
  instagram: {
    caixa: "0 0 256 256",
    mono: InstagramLogo,
    desenho: (u) => (
      <>
        <g fill="none">
          <rect width="256" height="256" fill={`url(#${u}-0)`} rx="60" />
          <rect width="256" height="256" fill={`url(#${u}-1)`} rx="60" />
          <path fill="#fff" d="M128.009 28c-27.158 0-30.567.119-41.233.604c-10.646.488-17.913 2.173-24.271 4.646c-6.578 2.554-12.157 5.971-17.715 11.531c-5.563 5.559-8.98 11.138-11.542 17.713c-2.48 6.36-4.167 13.63-4.646 24.271c-.477 10.667-.602 14.077-.602 41.236s.12 30.557.604 41.223c.49 10.646 2.175 17.913 4.646 24.271c2.556 6.578 5.973 12.157 11.533 17.715c5.557 5.563 11.136 8.988 17.709 11.542c6.363 2.473 13.631 4.158 24.275 4.646c10.667.485 14.073.604 41.23.604c27.161 0 30.559-.119 41.225-.604c10.646-.488 17.921-2.173 24.284-4.646c6.575-2.554 12.146-5.979 17.702-11.542c5.563-5.558 8.979-11.137 11.542-17.712c2.458-6.361 4.146-13.63 4.646-24.272c.479-10.666.604-14.066.604-41.225s-.125-30.567-.604-41.234c-.5-10.646-2.188-17.912-4.646-24.27c-2.563-6.578-5.979-12.157-11.542-17.716c-5.562-5.562-11.125-8.979-17.708-11.53c-6.375-2.474-13.646-4.16-24.292-4.647c-10.667-.485-14.063-.604-41.23-.604zm-8.971 18.021c2.663-.004 5.634 0 8.971 0c26.701 0 29.865.096 40.409.575c9.75.446 15.042 2.075 18.567 3.444c4.667 1.812 7.994 3.979 11.492 7.48c3.5 3.5 5.666 6.833 7.483 11.5c1.369 3.52 3 8.812 3.444 18.562c.479 10.542.583 13.708.583 40.396s-.104 29.855-.583 40.396c-.446 9.75-2.075 15.042-3.444 18.563c-1.812 4.667-3.983 7.99-7.483 11.488c-3.5 3.5-6.823 5.666-11.492 7.479c-3.521 1.375-8.817 3-18.567 3.446c-10.542.479-13.708.583-40.409.583c-26.702 0-29.867-.104-40.408-.583c-9.75-.45-15.042-2.079-18.57-3.448c-4.666-1.813-8-3.979-11.5-7.479s-5.666-6.825-7.483-11.494c-1.369-3.521-3-8.813-3.444-18.563c-.479-10.542-.575-13.708-.575-40.413s.096-29.854.575-40.396c.446-9.75 2.075-15.042 3.444-18.567c1.813-4.667 3.983-8 7.484-11.5s6.833-5.667 11.5-7.483c3.525-1.375 8.819-3 18.569-3.448c9.225-.417 12.8-.542 31.437-.563zm62.351 16.604c-6.625 0-12 5.37-12 11.996c0 6.625 5.375 12 12 12s12-5.375 12-12s-5.375-12-12-12zm-53.38 14.021c-28.36 0-51.354 22.994-51.354 51.355s22.994 51.344 51.354 51.344c28.361 0 51.347-22.983 51.347-51.344c0-28.36-22.988-51.355-51.349-51.355zm0 18.021c18.409 0 33.334 14.923 33.334 33.334c0 18.409-14.925 33.334-33.334 33.334s-33.333-14.925-33.333-33.334c0-18.411 14.923-33.334 33.333-33.334" />
          <defs>
            <radialGradient id={`${u}-0`} cx="0" cy="0" r="1" gradientTransform="matrix(0 -253.715 235.975 0 68 275.717)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fd5" />
              <stop offset=".1" stopColor="#fd5" />
              <stop offset=".5" stopColor="#ff543e" />
              <stop offset="1" stopColor="#c837ab" />
            </radialGradient>
            <radialGradient id={`${u}-1`} cx="0" cy="0" r="1" gradientTransform="rotate(78.68 -32.69 -16.937)scale(113.412 467.488)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3771c8" />
              <stop offset=".128" stopColor="#3771c8" />
              <stop offset="1" stopColor="#60f" stopOpacity="0" />
            </radialGradient>
          </defs>
        </g>
      </>
    ),
  },
  facebook: {
    caixa: "0 0 256 256",
    mono: FacebookLogo,
    desenho: () => (
      <>
        <path fill="#1877f2" d="M256 128C256 57.308 198.692 0 128 0S0 57.308 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.348-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.959 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445" />
        <path fill="#fff" d="m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A129 129 0 0 0 128 256a129 129 0 0 0 20-1.555V165z" />
      </>
    ),
  },
  google: {
    caixa: "0 0 256 262",
    mono: GoogleLogo,
    desenho: () => (
      <>
        <path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
        <path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
        <path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z" />
        <path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
      </>
    ),
  },
  meta: {
    caixa: "0 0 256 171",
    mono: MetaLogo,
    desenho: (u) => (
      <>
        <defs>
          <linearGradient id={`${u}-0`} x1="13.878%" x2="89.144%" y1="55.934%" y2="58.694%">
            <stop offset="0%" stopColor="#0064e1" />
            <stop offset="40%" stopColor="#0064e1" />
            <stop offset="83%" stopColor="#0073ee" />
            <stop offset="100%" stopColor="#0082fb" />
          </linearGradient>
          <linearGradient id={`${u}-1`} x1="54.315%" x2="54.315%" y1="82.782%" y2="39.307%">
            <stop offset="0%" stopColor="#0082fb" />
            <stop offset="100%" stopColor="#0064e0" />
          </linearGradient>
        </defs>
        <path fill="#0081fb" d="M27.651 112.136c0 9.775 2.146 17.28 4.95 21.82c3.677 5.947 9.16 8.466 14.751 8.466c7.211 0 13.808-1.79 26.52-19.372c10.185-14.092 22.186-33.874 30.26-46.275l13.675-21.01c9.499-14.591 20.493-30.811 33.1-41.806C161.196 4.985 172.298 0 183.47 0c18.758 0 36.625 10.87 50.3 31.257C248.735 53.584 256 81.707 256 110.729c0 17.253-3.4 29.93-9.187 39.946c-5.591 9.686-16.488 19.363-34.818 19.363v-27.616c15.695 0 19.612-14.422 19.612-30.927c0-23.52-5.484-49.623-17.564-68.273c-8.574-13.23-19.684-21.313-31.907-21.313c-13.22 0-23.859 9.97-35.815 27.75c-6.356 9.445-12.882 20.956-20.208 33.944l-8.066 14.289c-16.203 28.728-20.307 35.271-28.408 46.07c-14.2 18.91-26.324 26.076-42.287 26.076c-18.935 0-30.91-8.2-38.325-20.556C2.973 139.413 0 126.202 0 111.148z" />
        <path fill={`url(#${u}-0)`} d="M21.802 33.206C34.48 13.666 52.774 0 73.757 0C85.91 0 97.99 3.597 110.605 13.897c13.798 11.261 28.505 29.805 46.853 60.368l6.58 10.967c15.881 26.459 24.917 40.07 30.205 46.49c6.802 8.243 11.565 10.7 17.752 10.7c15.695 0 19.612-14.422 19.612-30.927l24.393-.766c0 17.253-3.4 29.93-9.187 39.946c-5.591 9.686-16.488 19.363-34.818 19.363c-11.395 0-21.49-2.475-32.654-13.007c-8.582-8.083-18.615-22.443-26.334-35.352l-22.96-38.352C118.528 64.08 107.96 49.73 101.845 43.23c-6.578-6.988-15.036-15.428-28.532-15.428c-10.923 0-20.2 7.666-27.963 19.39z" />
        <path fill={`url(#${u}-1)`} d="M73.312 27.802c-10.923 0-20.2 7.666-27.963 19.39c-10.976 16.568-17.698 41.245-17.698 64.944c0 9.775 2.146 17.28 4.95 21.82L9.027 149.482C2.973 139.413 0 126.202 0 111.148C0 83.772 7.514 55.24 21.802 33.206C34.48 13.666 52.774 0 73.757 0z" />
      </>
    ),
  },
  linkedin: {
    caixa: "0 0 256 256",
    mono: LinkedinLogo,
    desenho: () => (
      <>
        {/* o "in" é vazado no arquivo: o branco por baixo garante o logo em qualquer fundo */}
        <path fill="#fff" d="M24 24h208v208H24z" />
        <path fill="#0a66c2" d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4c-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.91 39.91 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186zM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009s9.851-22.014 22.008-22.016c12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97zM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453" />
      </>
    ),
  },
  telegram: {
    caixa: "0 0 256 256",
    mono: TelegramLogo,
    desenho: (u) => (
      <>
        <defs>
          <linearGradient id={`${u}-0`} x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#2aabee" />
            <stop offset="100%" stopColor="#229ed9" />
          </linearGradient>
        </defs>
        <path fill={`url(#${u}-0)`} d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.04 128.04 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51s-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0" />
        <path fill="#fff" d="M57.94 126.648q55.98-24.384 74.64-32.152c35.56-14.786 42.94-17.354 47.76-17.441c1.06-.017 3.42.245 4.96 1.49c1.28 1.05 1.64 2.47 1.82 3.467c.16.996.38 3.266.2 5.038c-1.92 20.24-10.26 69.356-14.5 92.026c-1.78 9.592-5.32 12.808-8.74 13.122c-7.44.684-13.08-4.912-20.28-9.63c-11.26-7.386-17.62-11.982-28.56-19.188c-12.64-8.328-4.44-12.906 2.76-20.386c1.88-1.958 34.64-31.748 35.26-34.45c.08-.338.16-1.598-.6-2.262c-.74-.666-1.84-.438-2.64-.258c-1.14.256-19.12 12.152-54 35.686c-5.1 3.508-9.72 5.218-13.88 5.128c-4.56-.098-13.36-2.584-19.9-4.708c-8-2.606-14.38-3.984-13.82-8.41c.28-2.304 3.46-4.662 9.52-7.072" />
      </>
    ),
  },
  youtube: {
    caixa: "0 0 256 180",
    mono: YoutubeLogo,
    desenho: () => (
      <>
        <path fill="#ff0000" d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134" />
        <path fill="#fff" d="m102.421 128.06l66.328-38.418l-66.328-38.418z" />
      </>
    ),
  },
  tiktok: {
    caixa: "0 0 256 290",
    mono: TiktokLogo,
    desenho: () => (
      <>
        <path fill="#ff004f" d="M189.72 104.421c18.678 13.345 41.56 21.197 66.273 21.197v-47.53a67 67 0 0 1-13.918-1.456v37.413c-24.711 0-47.59-7.851-66.272-21.195v96.996c0 48.523-39.356 87.855-87.9 87.855c-18.113 0-34.949-5.473-48.934-14.86c15.962 16.313 38.222 26.432 62.848 26.432c48.548 0 87.905-39.332 87.905-87.857v-96.995zm17.17-47.952c-9.546-10.423-15.814-23.893-17.17-38.785v-6.113h-13.189c3.32 18.927 14.644 35.097 30.358 44.898M69.673 225.607a40 40 0 0 1-8.203-24.33c0-22.192 18.001-40.186 40.21-40.186a40.3 40.3 0 0 1 12.197 1.883v-48.593c-4.61-.631-9.262-.9-13.912-.801v37.822a40.3 40.3 0 0 0-12.203-1.882c-22.208 0-40.208 17.992-40.208 40.187c0 15.694 8.997 29.281 22.119 35.9" />
        <path fill="currentColor" d="M175.803 92.849c18.683 13.344 41.56 21.195 66.272 21.195V76.631c-13.794-2.937-26.005-10.141-35.186-20.162c-15.715-9.802-27.038-25.972-30.358-44.898h-34.643v189.843c-.079 22.132-18.049 40.052-40.21 40.052c-13.058 0-24.66-6.221-32.007-15.86c-13.12-6.618-22.118-20.206-22.118-35.898c0-22.193 18-40.187 40.208-40.187c4.255 0 8.356.662 12.203 1.882v-37.822c-47.692.985-86.047 39.933-86.047 87.834c0 23.912 9.551 45.589 25.053 61.428c13.985 9.385 30.82 14.86 48.934 14.86c48.545 0 87.9-39.335 87.9-87.857z" />
        <path fill="#00f2ea" d="M242.075 76.63V66.516a66.3 66.3 0 0 1-35.186-10.047a66.47 66.47 0 0 0 35.186 20.163M176.53 11.57a68 68 0 0 1-.728-5.457V0h-47.834v189.845c-.076 22.13-18.046 40.05-40.208 40.05a40.06 40.06 0 0 1-18.09-4.287c7.347 9.637 18.949 15.857 32.007 15.857c22.16 0 40.132-17.918 40.21-40.05V11.571zM99.966 113.58v-10.769a89 89 0 0 0-12.061-.818C39.355 101.993 0 141.327 0 189.845c0 30.419 15.467 57.227 38.971 72.996c-15.502-15.838-25.053-37.516-25.053-61.427c0-47.9 38.354-86.848 86.048-87.833" />
      </>
    ),
  },
} satisfies Record<string, Desenho>;

export type Marca = keyof typeof MARCAS;
/** As marcas do conjunto, na ordem em que aparecem num seletor. */
export const MARCAS_DISPONIVEIS = Object.keys(MARCAS) as Marca[];

export interface IconeDeMarcaProps extends Omit<React.SVGAttributes<SVGSVGElement>, "color"> {
  marca: Marca;
  /** 14 na célula da tabela, 16 em lista e botão (padrão), 20 em destaque. */
  tamanho?: 12 | 14 | 16 | 20;
  /** Sem as cores da marca: glifo em peso `regular`, na cor do texto em volta. */
  mono?: boolean;
  /** Nome da marca para leitor de tela. Só quando o ícone aparece SEM o nome ao lado. */
  rotulo?: string;
}

export function IconeDeMarca({ marca, tamanho = 16, mono = false, rotulo, className, ...props }: IconeDeMarcaProps) {
  const u = React.useId().replace(/:/g, "");
  const { caixa, desenho, mono: Glifo }: Desenho = MARCAS[marca];
  const acessivel = { role: rotulo ? "img" : undefined, "aria-label": rotulo, "aria-hidden": rotulo ? undefined : true } as const;
  if (mono) {
    return <Glifo size={tamanho} weight="regular" className={cn("shrink-0", className)} {...acessivel} {...props} />;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={tamanho}
      height={tamanho}
      viewBox={caixa}
      // o traço preto do TikTok acompanha o texto: fica branco no tema escuro
      className={cn("shrink-0 text-foreground", className)}
      {...acessivel}
      {...props}
    >
      {desenho(u)}
    </svg>
  );
}

/* ------------------------------------------------------------- Origem -- */

/** A chave da marca para um nome como o CRM escreve ("WhatsApp", "Google Ads"): sem acento, espaço nem caixa. `null` quando não é marca. */
export function marcaDe(origem: string): Marca | null {
  const chave = origem
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  if (chave in MARCAS) return chave as Marca;
  // "Google Ads", "Meta Ads": a marca é a primeira palavra
  const primeira = origem.split(/\s+/)[0]?.toLowerCase() ?? "";
  return primeira in MARCAS ? (primeira as Marca) : null;
}

export interface IconeDeOrigemProps {
  /** O nome da origem como vem do CRM: "WhatsApp", "Instagram", "Site", "Indicação". */
  origem: string;
  /** O ícone Phosphor do que não é marca, por nome ("Site" → `Globe`, "Indicação" → `Handshake`). Sem par: `Globe`. */
  outros?: Record<string, Icon>;
  /** 12 na linha de apoio, 14 na célula e no cartão (padrão), 16 em lista e campo. */
  tamanho?: 12 | 14 | 16;
  /** Nome da origem para leitor de tela. Só quando o ícone aparece SEM o nome ao lado. */
  rotulo?: string;
  className?: string;
}

/**
 * A origem de um lead como ícone: a marca de verdade quando o nome é uma
 * marca do conjunto (`marcaDe`), senão o ícone Phosphor que a tela passa em
 * `outros`, em `muted-foreground`. Era uma função copiada em quatro telas
 * (quadro, lista, dashboard, atendimento); virou peça em 2026-10-07 (ADR-073).
 */
export function IconeDeOrigem({ origem, outros, tamanho = 14, rotulo, className }: IconeDeOrigemProps) {
  const marca = marcaDe(origem);
  if (marca) return <IconeDeMarca marca={marca} tamanho={tamanho} rotulo={rotulo} className={className} />;
  const Glifo = outros?.[origem] ?? Globe;
  return (
    <Glifo
      size={tamanho}
      weight="regular"
      role={rotulo ? "img" : undefined}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : true}
      className={cn("shrink-0 text-muted-foreground", className)}
    />
  );
}
