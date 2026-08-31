export type Aleatorio = () => number;

/**
 * mulberry32: 32 bits de estado, distribuição boa o bastante para sortear
 * exercícios e curto o bastante para ser auditado a olho. Não é criptográfico
 * e não precisa ser. Existe para que a mesma semente produza sempre o mesmo
 * exercício — reprodutibilidade é requisito, não detalhe.
 */
export function mulberry32(seed: number): Aleatorio {
  let estado = seed >>> 0;
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function inteiroEntre(aleatorio: Aleatorio, min: number, max: number): number {
  return min + Math.floor(aleatorio() * (max - min + 1));
}

export function escolher<T>(aleatorio: Aleatorio, itens: readonly T[]): T {
  if (itens.length === 0) {
    throw new Error('escolher: lista vazia');
  }
  return itens[inteiroEntre(aleatorio, 0, itens.length - 1)] as T;
}
