import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { escolher, inteiroEntre, mulberry32 } from '@/core/math/prng';

const semente = fc.integer({ min: 0, max: 2 ** 31 - 1 });

describe('mulberry32', () => {
  it('é determinístico: mesma semente, mesma sequência', () => {
    fc.assert(
      fc.property(semente, (seed) => {
        const primeira = Array.from({ length: 20 }, mulberry32(seed));
        const segunda = Array.from({ length: 20 }, mulberry32(seed));
        expect(primeira).toEqual(segunda);
      }),
      { numRuns: 200 },
    );
  });

  it('produz valores em [0, 1)', () => {
    fc.assert(
      fc.property(semente, (seed) => {
        const aleatorio = mulberry32(seed);
        for (let i = 0; i < 50; i += 1) {
          const x = aleatorio();
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThan(1);
        }
      }),
      { numRuns: 200 },
    );
  });

  it('sementes diferentes geram sequências diferentes', () => {
    const primeiros = new Set(Array.from({ length: 500 }, (_, seed) => mulberry32(seed)()));
    expect(primeiros.size).toBe(500);
  });

  it('distribui razoavelmente entre dez faixas', () => {
    const faixas = new Array<number>(10).fill(0);
    const aleatorio = mulberry32(2026);
    for (let i = 0; i < 100_000; i += 1) {
      const indice = Math.floor(aleatorio() * 10);
      faixas[indice] = (faixas[indice] ?? 0) + 1;
    }
    for (const contagem of faixas) {
      expect(contagem).toBeGreaterThan(9_000);
      expect(contagem).toBeLessThan(11_000);
    }
  });
});

describe('inteiroEntre e escolher', () => {
  it('cobre o intervalo fechado, sem estourar', () => {
    const aleatorio = mulberry32(7);
    const vistos = new Set<number>();
    for (let i = 0; i < 5_000; i += 1) {
      const x = inteiroEntre(aleatorio, 3, 8);
      expect(Number.isInteger(x)).toBe(true);
      expect(x).toBeGreaterThanOrEqual(3);
      expect(x).toBeLessThanOrEqual(8);
      vistos.add(x);
    }
    expect(vistos.size).toBe(6);
  });

  it('escolher devolve sempre um item da lista', () => {
    const itens = ['a', 'b', 'c'] as const;
    const aleatorio = mulberry32(99);
    for (let i = 0; i < 200; i += 1) {
      expect(itens).toContain(escolher(aleatorio, itens));
    }
  });

  it('escolher recusa lista vazia em vez de devolver undefined', () => {
    expect(() => escolher(mulberry32(1), [])).toThrow(/vazia/);
  });
});
