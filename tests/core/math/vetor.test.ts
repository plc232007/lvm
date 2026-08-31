import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { quaseIgual } from '@/core/math/tolerancia';
import { distancia, norma, pontoMedio, produtoEscalar, subtrair } from '@/core/math/vetor';

const coordenada = fc.double({ min: -100, max: 100, noNaN: true });
const ponto2d = fc.record({ x: coordenada, y: coordenada });

describe('vetor', () => {
  it('distância é simétrica', () => {
    fc.assert(
      fc.property(ponto2d, ponto2d, (p, q) => {
        expect(quaseIgual(distancia(p, q), distancia(q, p))).toBe(true);
      }),
      { numRuns: 300 },
    );
  });

  it('ponto médio é equidistante dos extremos', () => {
    fc.assert(
      fc.property(ponto2d, ponto2d, (p, q) => {
        const meio = pontoMedio(p, q);
        expect(quaseIgual(distancia(p, meio), distancia(q, meio))).toBe(true);
      }),
      { numRuns: 300 },
    );
  });

  it('produto escalar nulo indica perpendicularidade', () => {
    const u = { x: 3, y: 4 };
    const v = { x: -4, y: 3 };
    expect(produtoEscalar(u, v)).toBe(0);
    expect(norma(u)).toBe(5);
  });

  it('subtrair devolve o vetor que liga os pontos', () => {
    expect(subtrair({ x: 5, y: 2 }, { x: 1, y: 7 })).toEqual({ x: 4, y: -5 });
  });
});
