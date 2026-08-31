'use client';

import { useMovablePoint } from 'mafs';
import { useId } from 'react';
import { FiguraTriangulo } from '@/components/math/FiguraTriangulo';
import {
  ANGULO_MAXIMO,
  ANGULO_MINIMO,
  anguloParaPonto,
  CENTRO,
  HIPOTENUSA_B,
  HIPOTENUSA_C,
  limitarAngulo,
  pontoParaAngulo,
  projetarNaSemicircunferencia,
  RAIO,
} from '@/components/math/geometria-simulador';
import { PainelRelacoes, TabelaMedidas } from '@/components/math/PainelRelacoes';
import { formatarNumero } from '@/core/math/formato';
import { construirTriangulo } from '@/core/math/triangulo-retangulo';

const PASSO_ANGULO = 0.02;
const ANGULO_INICIAL = Math.PI / 3;

/** Cada predefinição fixa a projeção n; o ângulo sai dela. */
const PREDEFINICOES = [
  { rotulo: '6 · 8 · 10', n: 6.4, descricao: 'o 3-4-5 dobrado' },
  { rotulo: 'isósceles', n: 5, descricao: 'catetos iguais' },
  { rotulo: 'bem achatado', n: 9.5, descricao: 'a altura quase some' },
];

function anguloParaProjecao(n: number): number {
  return limitarAngulo(Math.acos((n - CENTRO.x) / RAIO));
}

export function SimuladorRelacoesMetricas() {
  const idControle = useId();
  const vertice = useMovablePoint(anguloParaPonto(ANGULO_INICIAL), {
    constrain: projetarNaSemicircunferencia,
  });

  const resultado = construirTriangulo({
    B: HIPOTENUSA_B,
    C: HIPOTENUSA_C,
    P: { x: vertice.x, y: vertice.y },
  });

  if (!resultado.ok) {
    return <p role="alert">Triângulo degenerado: {resultado.erro.detalhe}</p>;
  }

  const triangulo = resultado.valor;
  const angulo = pontoParaAngulo(vertice.point);
  const descricaoAtual =
    `altura ${formatarNumero(triangulo.h)}, ` +
    `projeções ${formatarNumero(triangulo.m)} e ${formatarNumero(triangulo.n)}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <FiguraTriangulo triangulo={triangulo} elementoVertice={vertice.element} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <label htmlFor={idControle} style={{ fontSize: '0.9375rem', fontWeight: 500 }}>
          Posição do vértice A sobre a semicircunferência
        </label>
        <input
          id={idControle}
          type="range"
          min={ANGULO_MINIMO}
          max={ANGULO_MAXIMO}
          step={PASSO_ANGULO}
          value={angulo}
          aria-valuetext={descricaoAtual}
          onChange={(evento) => vertice.setPoint(anguloParaPonto(Number(evento.target.value)))}
          style={{ width: '100%', accentColor: 'var(--azul)' }}
        />
        <p className="meta">
          Arraste o ponto, use as setas do teclado com o controle em foco, ou pule para um
          triângulo conhecido:
        </p>
        <div className="predefinicoes">
          {PREDEFINICOES.map((predefinicao) => {
            const alvo = anguloParaProjecao(predefinicao.n);
            return (
              <button
                key={predefinicao.rotulo}
                type="button"
                className="predefinicao"
                aria-pressed={Math.abs(angulo - alvo) < 0.02}
                onClick={() => vertice.setPoint(anguloParaPonto(alvo))}
                title={predefinicao.descricao}
              >
                {predefinicao.rotulo}
              </button>
            );
          })}
        </div>
      </div>

      <section aria-label="Medidas atuais" style={{ display: 'grid', gap: '0.6rem' }}>
        <h2 className="titulo-secao">Medidas</h2>
        <TabelaMedidas triangulo={triangulo} />
      </section>

      <section aria-label="Relações métricas" style={{ display: 'grid', gap: '0.6rem' }}>
        <h2 className="titulo-secao">As seis relações, com os números no lugar</h2>
        <PainelRelacoes triangulo={triangulo} />
      </section>
    </div>
  );
}
