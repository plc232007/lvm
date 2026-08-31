import 'katex/dist/katex.min.css';
import { SimuladorRelacoesMetricas } from '@/components/math/SimuladorRelacoesMetricas';

// Rota temporária da Fase 3: sem layout, sem tema, sem navegação.
// A Fase 4 substitui esta página pelo runtime de atividades.
export default function LaboratorioRelacoesMetricas() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-3">
      <h1 className="text-lg font-bold">Relações métricas no triângulo retângulo</h1>
      <SimuladorRelacoesMetricas />
    </main>
  );
}
