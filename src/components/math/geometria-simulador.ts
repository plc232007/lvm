import type { Ponto } from '@/core/math/vetor';

export const HIPOTENUSA_B: Ponto = { x: 0, y: 0 };
export const HIPOTENUSA_C: Ponto = { x: 10, y: 0 };
export const CENTRO: Ponto = { x: 5, y: 0 };
export const RAIO = 5;

/** Afasta o vértice dos extremos para que o triângulo nunca colapse ao arrastar. */
export const ANGULO_MINIMO = 0.14;
export const ANGULO_MAXIMO = Math.PI - ANGULO_MINIMO;

export function anguloParaPonto(angulo: number): [number, number] {
  return [CENTRO.x + RAIO * Math.cos(angulo), CENTRO.y + RAIO * Math.sin(angulo)];
}

export function pontoParaAngulo([x, y]: readonly [number, number]): number {
  return Math.atan2(Math.max(y, 0), x - CENTRO.x);
}

export function limitarAngulo(angulo: number): number {
  return Math.min(Math.max(angulo, ANGULO_MINIMO), ANGULO_MAXIMO);
}

/** O vértice A só existe sobre a semicircunferência de diâmetro BC (Tales). */
export function projetarNaSemicircunferencia(posicao: readonly [number, number]): [number, number] {
  return anguloParaPonto(limitarAngulo(pontoParaAngulo(posicao)));
}
