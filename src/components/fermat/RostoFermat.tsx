/**
 * Fermat em silhueta: cabeleira e gola do século XVII em massa cheia, rosto
 * vazado na cor do papel. Contorno fino sozinho vira borrão em 32px — a forma
 * precisa se ler pelo recorte, não pelo traço.
 */
export function RostoFermat({
  tamanho = 44,
  pensando = false,
}: {
  tamanho?: number;
  pensando?: boolean;
}) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={pensando ? 'fermat-pensando' : undefined}
    >
      {/* cabeleira: as mechas descem até os ombros, senão vira avatar genérico */}
      <path
        d="M24 4.4c9.5 0 15.9 6.6 15.9 15.9 0 6-1 11.5-2.6 15.5-.7 1.7-3 1.4-3.1-.4l-.5-13.7c0-1.3-.4-2.4-1-3.3-3 2.3-5.8 3.2-8.7 3.2s-5.7-.9-8.7-3.2c-.6.9-1 2-1 3.3l-.5 13.7c-.1 1.8-2.4 2.1-3.1.4-1.6-4-2.6-9.5-2.6-15.5C8.1 11 14.5 4.4 24 4.4Z"
        fill="currentColor"
      />
      {/* rosto */}
      <ellipse cx="24" cy="22.2" rx="8.4" ry="9.2" fill="var(--papel-alto)" />
      {/* olhos */}
      <circle cx="20.9" cy="21" r="1.25" fill="currentColor" />
      <circle cx="27.1" cy="21" r="1.25" fill="currentColor" />
      {/* bigode */}
      <path
        d="M20.2 25.4c1.3 1.1 2.4 1.5 3.8 1.5s2.5-.4 3.8-1.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      {/* gola de renda: clara sobre a cabeleira escura, é o que data o personagem */}
      <path
        d="M14.6 34c2.8 2.4 5.9 3.6 9.4 3.6s6.6-1.2 9.4-3.6c4.6 1.8 7.7 5.7 8.5 10.8H6.1c.8-5.1 3.9-9 8.5-10.8Z"
        fill="var(--papel-alto)"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M24 37.6v6.2M18.4 36.6l-2 7.2M29.6 36.6l2 7.2"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
