// Conector de árvore da navegação — vetor, com a geometria exata do Figma
// (node 255:6522/255:6523). Cada item ganha um caminho que nasce no topo do
// grupo, desce, curva com raio 5 e sai na horizontal:
//   M0.5 0 V{c-5} C0.5 {c-1.667} 2.167 {c} 5.5 {c} H11.5
// onde c = 16 + 34n é o centro vertical do item n.
export function Tree({ itens }: { itens: number }) {
  if (itens < 1) return null;
  const centro = (n: number) => 16 + 34 * n;
  const altura = centro(itens - 1) + 1;
  const caminhos = Array.from({ length: itens }, (_, n) => {
    const c = centro(n);
    return `M0.5 0V${c - 5}C0.5 ${c - 1.6667} 2.16667 ${c} 5.5 ${c}H11.5`;
  });

  return (
    <svg
      aria-hidden
      width="12"
      height={altura}
      viewBox={`0 0 12 ${altura}`}
      fill="none"
      className="chrome-linha pointer-events-none absolute left-[12px] top-0"
    >
      {caminhos.map((d, i) => (
        <path key={i} d={d} stroke="currentColor" strokeWidth="1" />
      ))}
    </svg>
  );
}
