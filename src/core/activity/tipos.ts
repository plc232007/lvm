export type ActivityKind = 'reading' | 'video' | 'simulator' | 'exercise' | 'external';

export interface ConfigSimulator {
  readonly simuladorId: string;
}

export interface ConfigExercise {
  readonly generatorId: string;
  readonly quantidade: number;
}

export interface ConfigReading {
  readonly arquivo: string;
}

export interface ConfigVideo {
  readonly provedor: 'youtube';
  readonly videoId: string;
}

export interface ConfigExternal {
  readonly url: string;
  readonly descricao: string;
}

export interface Atividade<K extends ActivityKind, TConfig> {
  readonly id: string;
  readonly moduleId: string;
  readonly kind: K;
  readonly title: string;
  readonly config: TConfig;
}

/** União discriminada por `kind`: o config certo vem junto com o tipo certo. */
export type Activity =
  | Atividade<'simulator', ConfigSimulator>
  | Atividade<'exercise', ConfigExercise>
  | Atividade<'reading', ConfigReading>
  | Atividade<'video', ConfigVideo>
  | Atividade<'external', ConfigExternal>;

export const TIPOS_DE_ATIVIDADE: readonly ActivityKind[] = [
  'reading',
  'video',
  'simulator',
  'exercise',
  'external',
];

export function ehTipoDeAtividade(valor: unknown): valor is ActivityKind {
  return typeof valor === 'string' && TIPOS_DE_ATIVIDADE.includes(valor as ActivityKind);
}

export interface Trilha {
  readonly id: string;
  readonly slug: string;
  readonly titulo: string;
  readonly resumo: string;
  readonly atividades: readonly Activity[];
}
