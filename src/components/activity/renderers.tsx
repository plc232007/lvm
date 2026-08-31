import { ExercicioRenderer } from '@/components/activity/ExercicioRenderer';
import { registrarRenderer } from '@/components/activity/registry';
import { SimuladorRenderer } from '@/components/activity/SimuladorRenderer';

// Fase 4 registra os dois tipos que já existem. `reading`, `video` e `external`
// entram na Fase 5 — até lá o runtime avisa em vez de quebrar.
registrarRenderer('simulator', (atividade) => <SimuladorRenderer atividade={atividade} />);
registrarRenderer('exercise', (atividade) => <ExercicioRenderer atividade={atividade} />);
