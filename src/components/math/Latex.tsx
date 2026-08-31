import katex from 'katex';

interface LatexProps {
  tex: string;
  display?: boolean;
  className?: string;
}

/**
 * KaTeX renderiza para HTML + MathML: o MathML é o que o leitor de tela lê.
 * `throwOnError: false` evita que uma fórmula malformada derrube a página
 * inteira — ela aparece em vermelho e o resto continua de pé.
 */
export function Latex({ tex, display = false, className }: LatexProps) {
  const html = katex.renderToString(tex, {
    displayMode: display,
    throwOnError: false,
    output: 'htmlAndMathml',
  });

  return (
    <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
