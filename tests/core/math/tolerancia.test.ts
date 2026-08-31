import { describe, expect, it } from 'vitest';
import { EPS, ehPositivo, erroRelativo, quaseIgual, quaseZero } from '@/core/math/tolerancia';

describe('quaseIgual', () => {
  it('aceita a soma clássica de ponto flutuante', () => {
    expect(0.1 + 0.2).not.toBe(0.3);
    expect(quaseIgual(0.1 + 0.2, 0.3)).toBe(true);
  });

  it('escala com a magnitude: erro de 1e-6 em 1e12 ainda é igual', () => {
    expect(quaseIgual(1e12, 1e12 + 1e-6)).toBe(true);
  });

  it('não escala a ponto de aceitar diferença real', () => {
    expect(quaseIgual(1e12, 1.0001e12)).toBe(false);
    expect(quaseIgual(2.4, 2.5)).toBe(false);
    expect(quaseIgual(0, 1e-6)).toBe(false);
  });

  it('rejeita NaN e infinito em vez de propagá-los', () => {
    expect(quaseIgual(Number.NaN, Number.NaN)).toBe(false);
    expect(quaseIgual(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).toBe(false);
  });

  it('aceita eps explícito mais frouxo', () => {
    expect(quaseIgual(2.4, 2.401, 1e-3)).toBe(true);
  });
});

describe('quaseZero e ehPositivo', () => {
  it('trata resíduo de arredondamento como zero', () => {
    expect(quaseZero(1e-12)).toBe(true);
    expect(quaseZero(-1e-12)).toBe(true);
    expect(quaseZero(1e-6)).toBe(false);
  });

  it('exige positividade acima da tolerância', () => {
    expect(ehPositivo(1)).toBe(true);
    expect(ehPositivo(EPS / 2)).toBe(false);
    expect(ehPositivo(-1)).toBe(false);
    expect(ehPositivo(Number.NaN)).toBe(false);
  });
});

describe('erroRelativo', () => {
  it('é zero para valores idênticos e cresce com a diferença', () => {
    expect(erroRelativo(5, 5)).toBe(0);
    // Denominador é max(1, |x|, |y|): 1 / 101, não 1 / 100.
    expect(erroRelativo(100, 101)).toBeCloseTo(1 / 101, 12);
    expect(erroRelativo(0, 0.5)).toBeCloseTo(0.5, 12);
  });
});
