import { ExercicioRenderer } from '@/components/activity/ExercicioRenderer';
import { ExternalRenderer } from '@/components/activity/ExternalRenderer';
import { LeituraRenderer } from '@/components/activity/LeituraRenderer';
import { registrarRenderer } from '@/components/activity/registry';
import { SimuladorRenderer } from '@/components/activity/SimuladorRenderer';
import { VideoRenderer } from '@/components/activity/VideoRenderer';

registrarRenderer('simulator', (atividade) => <SimuladorRenderer atividade={atividade} />);
registrarRenderer('exercise', (atividade) => <ExercicioRenderer atividade={atividade} />);
registrarRenderer('reading', (_atividade, recursos) => <LeituraRenderer recursos={recursos} />);
registrarRenderer('video', (atividade) => <VideoRenderer atividade={atividade} />);
registrarRenderer('external', (atividade) => <ExternalRenderer atividade={atividade} />);
