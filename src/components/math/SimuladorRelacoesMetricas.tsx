'use client';

import { useMovablePoint } from 'mafs';
import { useId } from 'react';
import { FiguraTriangulo } from '@/components/math/FiguraTriangulo';
import {
  ANGULO_MAXIMO,
  ANGULO_MINIMO,
  anguloParaPonto,
  HIPOTENUSA_B,
  HIPOTENUSA_C,
  pontoParaAngulo,
  projetarNaSemicircunferencia,
} from '@/components/math/geometria-simulador';
import { PainelRelacoes, TabelaMedidas } from '@/components/math/PainelRelacoes';
import { formatarNumero } from '@/core/math/formato';
import { construirTriangulo } from '@/core/math/triangulo-retangulo';

const PASSO_ANGULO = 0.02;
const ANGULO_INICIAL = Math.PI / 3;

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
    <div className="flex flex-col gap-4">
      <FiguraTriangulo triangulo={triangulo} elementoVertice={vertice.element} />

      <div className="flex flex-col gap-1">
        <label htmlFor={idControle} className="text-sm">
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
          className="w-full"
        />
        <p className="text-xs text-neutral-600">
          Arraste o ponto azul ou use as setas do teclado com este controle em foco. O ângulo em A
          permanece reto em qualquer posição.
        </p>
      </div>

      <section aria-label="Medidas atuais" className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">Medidas</h2>
        <TabelaMedidas triangulo={triangulo} />
      </section>

      <section aria-label="Relações métricas" className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">Relações</h2>
        <PainelRelacoes triangulo={triangulo} />
      </section>
    </div>
  );
}
