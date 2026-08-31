"use client";

import "mafs/core.css";
import { LaTeX as RotuloMafs, Line, Mafs, Point, Polygon, Theme } from "mafs";
import type { ReactElement } from "react";
import type { TrianguloRetangulo } from "@/core/math/triangulo-retangulo";
import {
  escalar,
  norma,
  produtoEscalar,
  somar,
  subtrair,
  type Ponto,
} from "@/core/math/vetor";

const DESLOCAMENTO_PROJECOES = -0.55;
const LADO_MARCA_RETA = 0.5;

const par = (p: Ponto): [number, number] => [p.x, p.y];

function versor(de: Ponto, para: Ponto): Ponto {
  const v = subtrair(para, de);
  return escalar(v, 1 / norma(v));
}

/** Quadradinho do ângulo reto, montado sobre os dois catetos a partir de A. */
function marcaAnguloReto(t: TrianguloRetangulo): [number, number][] {
  const paraB = escalar(versor(t.A, t.B), LADO_MARCA_RETA);
  const paraC = escalar(versor(t.A, t.C), LADO_MARCA_RETA);
  return [
    t.A,
    somar(t.A, paraB),
    somar(somar(t.A, paraB), paraC),
    somar(t.A, paraC),
  ].map(par);
}

function meio(p: Ponto, q: Ponto, deslocamentoY = 0): [number, number] {
  return [(p.x + q.x) / 2, (p.y + q.y) / 2 + deslocamentoY];
}

/** Empurra o rótulo para fora do triângulo, na normal do lado, para não colidir. */
function rotuloLado(
  p: Ponto,
  q: Ponto,
  oposto: Ponto,
  distancia = 0.5,
): [number, number] {
  const centroLado: Ponto = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
  const direcao = subtrair(q, p);
  const normal = escalar({ x: -direcao.y, y: direcao.x }, 1 / norma(direcao));
  const paraFora =
    produtoEscalar(subtrair(centroLado, oposto), normal) >= 0 ? 1 : -1;
  return par(somar(centroLado, escalar(normal, distancia * paraFora)));
}

/** A altura é vertical: o rótulo vai para o lado onde sobra espaço. */
function rotuloAltura(t: TrianguloRetangulo): [number, number] {
  const lado = t.A.x < (t.B.x + t.C.x) / 2 ? 0.45 : -0.45;
  return [(t.A.x + t.H.x) / 2 + lado, (t.A.y + t.H.y) / 2];
}

export function FiguraTriangulo({
  triangulo,
  elementoVertice,
}: {
  triangulo: TrianguloRetangulo;
  elementoVertice: ReactElement;
}) {
  const t = triangulo;
  const yProjecoes = DESLOCAMENTO_PROJECOES;

  return (
    <div className="palco-mafs quadro">
      <Mafs
        viewBox={{ x: [-0.6, 10.6], y: [-1.6, 6.2] }}
        preserveAspectRatio="contain"
        pan={false}
        zoom={false}
        height={320}
        ssr
      >
        <Polygon
          points={[par(t.A), par(t.B), par(t.C)]}
          color={Theme.blue}
          fillOpacity={0.12}
        />
        <Polygon
          points={marcaAnguloReto(t)}
          color={Theme.foreground}
          fillOpacity={0}
          weight={2}
        />

        <Line.Segment
          point1={par(t.A)}
          point2={par(t.H)}
          color={Theme.green}
          style="dashed"
        />
        <Point x={t.H.x} y={t.H.y} color={Theme.green} />

        <Line.Segment
          point1={[t.B.x, yProjecoes]}
          point2={[t.H.x, yProjecoes]}
          color={Theme.orange}
          weight={4}
        />
        <Line.Segment
          point1={[t.H.x, yProjecoes]}
          point2={[t.C.x, yProjecoes]}
          color={Theme.pink}
          weight={4}
        />

        <RotuloMafs at={rotuloLado(t.A, t.C, t.B)} tex="b" color={Theme.blue} />
        <RotuloMafs at={rotuloLado(t.A, t.B, t.C)} tex="c" color={Theme.blue} />
        <RotuloMafs at={rotuloAltura(t)} tex="h" color={Theme.green} />
        <RotuloMafs
          at={[t.B.x + (t.H.x - t.B.x) / 2, yProjecoes - 0.5]}
          tex="n"
          color={Theme.orange}
        />
        <RotuloMafs
          at={[t.H.x + (t.C.x - t.H.x) / 2, yProjecoes - 0.5]}
          tex="m"
          color={Theme.pink}
        />
        <RotuloMafs at={meio(t.B, t.C, 0.3)} tex="a" color={Theme.foreground} />

        {elementoVertice}
      </Mafs>
    </div>
  );
}
