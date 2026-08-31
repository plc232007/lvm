import type { ReactNode } from 'react';
import type { Activity, ActivityKind } from '@/core/activity/tipos';

export type AtividadeDoTipo<K extends ActivityKind> = Extract<Activity, { kind: K }>;

export interface PropsRenderer<K extends ActivityKind = ActivityKind> {
  atividade: AtividadeDoTipo<K>;
}

/**
 * O registry guarda funções que *produzem* o elemento, não componentes soltos.
 * Assim o tipo do elemento continua sendo o componente declarado no módulo — o
 * estado sobrevive entre renders — e nenhum componente nasce durante o render.
 */
/** Dados que só o servidor consegue buscar, como o conteúdo de um arquivo. */
export interface RecursosAtividade {
  readonly textoMdx?: string;
}

type Renderer<K extends ActivityKind> = (
  atividade: AtividadeDoTipo<K>,
  recursos: RecursosAtividade,
) => ReactNode;

const renderers = new Map<ActivityKind, Renderer<ActivityKind>>();

export function registrarRenderer<K extends ActivityKind>(kind: K, renderer: Renderer<K>): void {
  // Funções são contravariantes nos parâmetros; a conversão é segura porque a
  // chave do mapa é o mesmo `kind` que estreita a atividade na leitura.
  renderers.set(kind, renderer as unknown as Renderer<ActivityKind>);
}

export function renderizarAtividade(
  atividade: Activity,
  recursos: RecursosAtividade = {},
): ReactNode | undefined {
  return renderers.get(atividade.kind)?.(atividade, recursos);
}

export function temRenderer(kind: ActivityKind): boolean {
  return renderers.has(kind);
}

export function tiposRegistrados(): readonly ActivityKind[] {
  return [...renderers.keys()];
}
