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

/**
 * Texto com matemática entre cifrões. Renderizar o enunciado inteiro como LaTeX
 * jogaria a prosa em modo matemático — itálico, espaços comidos, ilegível.
 */
export function TextoComMatematica({ texto }: { texto: string }) {
  const partes = texto.split(/\$([^$]*)\$/g);

  return (
    <>
      {partes.map((parte, indice) =>
        indice % 2 === 1 ? (
          <Latex key={indice} tex={parte} />
        ) : (
          <span key={indice}>{parte}</span>
        ),
      )}
    </>
  );
}
