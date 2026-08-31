import { Latex } from '@/components/math/Latex';

/**
 * A margem do caderno: as construções da própria matéria, rabiscadas em volta
 * do conteúdo e derivando devagar. É HTML e CSS estáticos — nenhum laço de
 * animação em JS, nada que pese no celular da rede da escola.
 *
 * Só transform e opacity são animados, então o trabalho fica no compositor.
 */

function TrianguloComAltura() {
  return (
    <svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path className="risco" d="M8 68h104L86 12z" strokeLinejoin="round" />
      <path className="risco risco--tarde" d="M86 12 68 68" strokeDasharray="4 4" />
      <path className="risco risco--tarde" d="M72 62h6v6" strokeWidth="1" />
      <circle cx="86" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CircunferenciaDeTales() {
  return (
    <svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path className="risco" d="M10 62a50 50 0 0 1 100 0" />
      <path className="risco risco--tarde" d="M10 62h100" />
      <path className="risco risco--tarde" d="M10 62 44 18l66 44" strokeLinejoin="round" />
      <circle cx="44" cy="18" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="60" cy="62" r="1.6" fill="currentColor" stroke="none" opacity="0.6" />
    </svg>
  );
}

function QuadradosDePitagoras() {
  return (
    <svg viewBox="0 0 110 110" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path className="risco" d="M40 62h30v-30h-30z" />
      <path className="risco risco--tarde" d="M40 62v30h30v-30" />
      <path className="risco risco--tarde" d="M40 62 10 62 10 32 40 32" />
      <path className="risco" d="M40 32 70 32 70 62 40 62Z" strokeWidth="1.4" />
    </svg>
  );
}

function ArcosDeCompasso() {
  return (
    <svg viewBox="0 0 120 90" fill="none" stroke="currentColor" strokeWidth="1.1">
      <path className="risco" d="M20 70a44 44 0 0 1 66-34" />
      <path className="risco risco--tarde" d="M100 70a44 44 0 0 0-66-34" />
      <path className="risco risco--tarde" d="M60 14v62" strokeDasharray="5 5" />
      <path className="risco" d="M20 70h80" />
    </svg>
  );
}

function Transferidor() {
  return (
    <svg viewBox="0 0 120 70" fill="none" stroke="currentColor" strokeWidth="1.1">
      <path className="risco" d="M12 62a48 48 0 0 1 96 0" />
      <path className="risco" d="M12 62h96" />
      {Array.from({ length: 9 }, (_, i) => {
        const angulo = (Math.PI * (i + 1)) / 10;
        const cx = 60;
        const cy = 62;
        return (
          <path
            key={i}
            className="risco risco--tarde"
            d={`M${cx + 42 * Math.cos(angulo)} ${cy - 42 * Math.sin(angulo)}L${
              cx + 48 * Math.cos(angulo)
            } ${cy - 48 * Math.sin(angulo)}`}
          />
        );
      })}
    </svg>
  );
}

function CurvaEsbocada() {
  return (
    <svg viewBox="0 0 130 80" fill="none" stroke="currentColor" strokeWidth="1.1">
      <path className="risco risco--tarde" d="M12 12v56h108" />
      <path className="risco" d="M18 64C42 64 40 18 66 18s24 46 48 46" />
      <path className="risco risco--tarde" d="M66 18v46" strokeDasharray="4 4" />
    </svg>
  );
}

function TriangulosSemelhantes() {
  return (
    <svg viewBox="0 0 120 90" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path className="risco" d="M12 78h96L84 20z" strokeLinejoin="round" />
      <path className="risco risco--tarde" d="M40 78 84 20" />
      <path className="risco risco--tarde" d="M62 49 40 78" opacity="0.8" />
    </svg>
  );
}

const FIGURAS = [
  { chave: 'triangulo', Componente: TrianguloComAltura },
  { chave: 'tales', Componente: CircunferenciaDeTales },
  { chave: 'pitagoras', Componente: QuadradosDePitagoras },
  { chave: 'compasso', Componente: ArcosDeCompasso },
  { chave: 'transferidor', Componente: Transferidor },
  { chave: 'curva', Componente: CurvaEsbocada },
  { chave: 'semelhantes', Componente: TriangulosSemelhantes },
] as const;

const FORMULAS = [
  'a^2 = b^2 + c^2',
  'h^2 = m \\cdot n',
  'b^2 = a \\cdot m',
  'a \\cdot h = b \\cdot c',
  'a = m + n',
  '\\frac{a}{b} = \\frac{b}{m}',
  // O recado que ele deixou na margem de Diofanto, em 1637.
  'x^n + y^n = z^n',
];

export function FundoMatematico() {
  return (
    <div className="fundo" aria-hidden="true">
      {FIGURAS.map(({ chave, Componente }, indice) => (
        <div key={chave} className={`fundo__peca fundo__figura fundo__peca--${indice + 1}`}>
          <Componente />
        </div>
      ))}
      {FORMULAS.map((formula, indice) => (
        <div
          key={formula}
          className={`fundo__peca fundo__formula fundo__peca--${indice + 8}`}
        >
          <Latex tex={formula} />
        </div>
      ))}
    </div>
  );
}
