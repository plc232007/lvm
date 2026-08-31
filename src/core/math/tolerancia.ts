export const EPS = 1e-9;

/**
 * Tolerância relativa à magnitude dos operandos. Comparação absoluta com 1e-9
 * quebraria para valores grandes: em um triângulo de lado 100, `a²` já vale 1e4
 * e o erro de arredondamento acompanha a escala do número, não uma constante.
 */
export function quaseIgual(x: number, y: number, eps: number = EPS): boolean {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
  if (x === y) return true;
  return Math.abs(x - y) <= eps * Math.max(1, Math.abs(x), Math.abs(y));
}

export function quaseZero(x: number, eps: number = EPS): boolean {
  return Number.isFinite(x) && Math.abs(x) <= eps;
}

export function ehPositivo(x: number, eps: number = EPS): boolean {
  return Number.isFinite(x) && x > eps;
}

export function erroRelativo(x: number, y: number): number {
  if (x === y) return 0;
  return Math.abs(x - y) / Math.max(1, Math.abs(x), Math.abs(y));
}
