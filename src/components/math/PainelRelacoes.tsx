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

export function TabelaMedidas({ triangulo }: { triangulo: TrianguloRetangulo }) {
  const valores = medidasDe(triangulo);

  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {(Object.keys(NOMES) as Simbolo[]).map((simbolo) => (
        <li key={simbolo} className="rounded border border-neutral-300 px-2 py-1">
          <span className="block text-xs text-neutral-600">{NOMES[simbolo]}</span>
          <Latex tex={`${simbolo} = ${latexNumero(valores[simbolo])}`} />
        </li>
      ))}
    </ul>
  );
}

export function PainelRelacoes({ triangulo }: { triangulo: TrianguloRetangulo }) {
  const valores = medidasDe(triangulo);

  return (
    <ul className="flex flex-col gap-3">
      {relacoesMetricas(triangulo).map((relacao) => {
        const vale = relacaoVale(relacao, 1e-6);
        const esquerda = latexNumero(relacao.esquerda.valor);
        const direita = latexNumero(relacao.direita.valor);

        return (
          <li key={relacao.id} className="rounded border border-neutral-300 p-2">
            <p className="text-xs text-neutral-600">{relacao.nome}</p>
            <p className="text-base">
              <Latex tex={relacao.latex} />
            </p>
            <p className="text-sm text-neutral-800">
              <Latex tex={substituirSimbolos(relacao.latex, valores)} />
            </p>
            <p className="text-sm">
              <Latex tex={`${esquerda} = ${direita}`} />{' '}
              <span aria-label={vale ? 'relação confirmada' : 'relação não confere'}>
                {vale ? '✓' : '✗'}
              </span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}
