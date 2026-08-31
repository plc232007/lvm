import { falha, sucesso, type Resultado } from '@/core/resultado';
import { ehPositivo } from '@/core/math/tolerancia';
import {
  distancia,
  ehPontoFinito,
  escalar,
  norma,
  normaQuadrada,
  pontoMedio,
  produtoEscalar,
  somar,
  subtrair,
  type Ponto,
} from '@/core/math/vetor';

/**
 * Triângulo retângulo com o ângulo reto no vértice A.
 *
 *  a — hipotenusa (BC)          h — altura relativa à hipotenusa (A até H)
 *  b — cateto AC                m — projeção de b sobre a hipotenusa (HC)
 *  c — cateto AB                n — projeção de c sobre a hipotenusa (HB)
 */
export interface TrianguloRetangulo {
  readonly A: Ponto;
  readonly B: Ponto;
  readonly C: Ponto;
  readonly H: Ponto;
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly h: number;
  readonly m: number;
  readonly n: number;
}

export interface EntradaTriangulo {
  readonly B: Ponto;
  readonly C: Ponto;
  readonly P: Ponto;
}

export type MotivoDegenerado =
  | 'entrada-nao-finita'
  | 'hipotenusa-nula'
  | 'ponto-no-centro'
  | 'altura-nula';

export interface ErroDegenerado {
  readonly motivo: MotivoDegenerado;
  readonly detalhe: string;
}

const MINIMO_ABSOLUTO = 1e-9;
const ALTURA_MINIMA_RELATIVA = 1e-9;

/**
 * Constrói o triângulo a partir dos extremos da hipotenusa (B, C) e de um ponto
 * livre P. O ângulo reto é garantido por construção, não verificado: A é a
 * projeção de P sobre o círculo de diâmetro BC, e pelo teorema de Tales todo
 * ponto desse círculo enxerga BC sob 90°. Assim nenhuma posição de P produz
 * estado inválido enquanto o aluno arrasta.
 */
export function construirTriangulo({ B, C, P }: EntradaTriangulo): Resultado<
  TrianguloRetangulo,
  ErroDegenerado
> {
  if (!ehPontoFinito(B) || !ehPontoFinito(C) || !ehPontoFinito(P)) {
    return falha({
      motivo: 'entrada-nao-finita',
      detalhe: 'B, C e P precisam ter coordenadas finitas.',
    });
  }

  const a = distancia(B, C);
  if (!ehPositivo(a, MINIMO_ABSOLUTO)) {
    return falha({
      motivo: 'hipotenusa-nula',
      detalhe: 'B e C coincidem: não há hipotenusa.',
    });
  }

  const centro = pontoMedio(B, C);
  const raio = a / 2;
  const direcao = subtrair(P, centro);
  const alcance = norma(direcao);
  if (!ehPositivo(alcance, MINIMO_ABSOLUTO * Math.max(1, raio))) {
    return falha({
      motivo: 'ponto-no-centro',
      detalhe: 'P está no centro da hipotenusa: a direção do vértice A é indefinida.',
    });
  }

  const A = somar(centro, escalar(direcao, raio / alcance));

  const bc = subtrair(C, B);
  const t = produtoEscalar(subtrair(A, B), bc) / normaQuadrada(bc);
  const H = somar(B, escalar(bc, t));

  const h = distancia(A, H);
  if (!ehPositivo(h, ALTURA_MINIMA_RELATIVA * raio)) {
    return falha({
      motivo: 'altura-nula',
      detalhe: 'A caiu sobre a hipotenusa: o triângulo colapsou em um segmento.',
    });
  }

  return sucesso({
    A,
    B,
    C,
    H,
    a,
    b: distancia(A, C),
    c: distancia(A, B),
    h,
    m: distancia(H, C),
    n: distancia(H, B),
  });
}

export function construirDeCatetos(
  b: number,
  c: number,
): Resultado<TrianguloRetangulo, ErroDegenerado> {
  if (!ehPositivo(b) || !ehPositivo(c)) {
    return falha({
      motivo: 'altura-nula',
      detalhe: 'Catetos precisam ser positivos.',
    });
  }
  const a = Math.hypot(b, c);
  // Coloca a hipotenusa sobre o eixo x e A no ponto que realiza b e c.
  const n = (c * c) / a;
  const h = (b * c) / a;
  return construirTriangulo({
    B: { x: 0, y: 0 },
    C: { x: a, y: 0 },
    P: { x: n, y: h },
  });
}
