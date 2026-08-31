/** Marca do LVM: o próprio objeto de estudo — triângulo retângulo com a altura. */
export function Marca({ tamanho = 26 }: { tamanho?: number }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 27h26L20.5 6z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M20.5 6 15.3 27" stroke="currentColor" strokeWidth="1.25" strokeDasharray="2.5 2.5" opacity="0.75" />
      <path d="M17.9 24.4h2.6v2.6" stroke="currentColor" strokeWidth="1.25" opacity="0.75" />
      <circle cx="20.5" cy="6" r="2" fill="currentColor" />
    </svg>
  );
}
