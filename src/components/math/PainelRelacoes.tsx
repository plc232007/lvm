import { Latex } from '@/components/math/Latex';
import { latexNumero } from '@/core/math/formato';
import {
  medidas as medidasDe,
  relacaoVale,
  relacoesMetricas,
  substituirSimbolos,
  type Simbolo,
} from '@/core/math/relacoes';
import type { TrianguloRetangulo } from '@/core/math/triangulo-retangulo';

const NOMES: Record<Simbolo, string> = {
  a: 'hipotenusa',
  b: 'cateto b',
  c: 'cateto c',
  h: 'altura',
  m: 'projeção de b',
  n: 'projeção de c',
};

const COR: Partial<Record<Simbolo, string>> = {
  h: 'var(--verde)',
  m: 'var(--vermelho)',
  n: 'var(--ambar)',
};

export function TabelaMedidas({ triangulo }: { triangulo: TrianguloRetangulo }) {
  const valores = medidasDe(triangulo);

  return (
    <ul className="grade-medidas">
      {(Object.keys(NOMES) as Simbolo[]).map((simbolo) => (
        <li key={simbolo} className="medida-célula" style={{ borderLeftColor: COR[simbolo] }}>
          <span className="meta">{NOMES[simbolo]}</span>
          <span className="medida" style={{ fontSize: '1.05rem' }}>
            <Latex tex={`${simbolo} = ${latexNumero(valores[simbolo])}`} />
          </span>
        </li>
      ))}
    </ul>
  );
}

export function PainelRelacoes({ triangulo }: { triangulo: TrianguloRetangulo }) {
  const valores = medidasDe(triangulo);

  return (
    <ul className="grade-relacoes">
      {relacoesMetricas(triangulo).map((relacao) => {
        const vale = relacaoVale(relacao, 1e-6);

        return (
          <li key={relacao.id} className="cartao relacao">
            <div className="relacao__topo">
              <span className="meta">{relacao.nome}</span>
              <span className={vale ? 'selo selo--feito' : 'selo selo--erro'}>
                {vale ? 'confere' : 'não confere'}
              </span>
            </div>
            <span className="relacao__formula">
              <Latex tex={relacao.latex} />
            </span>
            <span className="relacao__substituida medida">
              <Latex tex={substituirSimbolos(relacao.latex, valores)} />
            </span>
            <span className="relacao__igualdade medida">
              <Latex
                tex={`${latexNumero(relacao.esquerda.valor)} = ${latexNumero(relacao.direita.valor)}`}
              />
            </span>
          </li>
        );
      })}
    </ul>
  );
}
