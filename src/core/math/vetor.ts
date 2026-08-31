export interface Ponto {
  readonly x: number;
  readonly y: number;
}

export type Vetor = Ponto;

export function ponto(x: number, y: number): Ponto {
  return { x, y };
}

export function somar(p: Ponto, v: Vetor): Ponto {
  return { x: p.x + v.x, y: p.y + v.y };
}

export function subtrair(p: Ponto, q: Ponto): Vetor {
  return { x: p.x - q.x, y: p.y - q.y };
}

export function escalar(v: Vetor, k: number): Vetor {
  return { x: v.x * k, y: v.y * k };
}

export function produtoEscalar(u: Vetor, v: Vetor): number {
  return u.x * v.x + u.y * v.y;
}

export function normaQuadrada(v: Vetor): number {
  return v.x * v.x + v.y * v.y;
}

export function norma(v: Vetor): number {
  return Math.hypot(v.x, v.y);
}

export function distancia(p: Ponto, q: Ponto): number {
  return Math.hypot(p.x - q.x, p.y - q.y);
}

export function pontoMedio(p: Ponto, q: Ponto): Ponto {
  return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
}

export function ehPontoFinito(p: Ponto): boolean {
  return Number.isFinite(p.x) && Number.isFinite(p.y);
}
