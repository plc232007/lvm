'use client';

import { useId, useMemo, useState } from 'react';
import type { PropsRenderer } from '@/components/activity/registry';
import { TextoComMatematica } from '@/components/math/Latex';
import { obterGerador } from '@/core/exercise/generators';
import type { Verificacao } from '@/core/exercise/tipos';
import { concluirAtividade, registrarTentativa } from '@/core/progress';
import { useProgresso } from '@/lib/use-progresso';

/** Semente inicial derivada do id: mesma no servidor e no cliente, sem hidratação torta. */
function sementeDe(texto: string): number {
  let hash = 2166136261;
  for (let i = 0; i < texto.length; i += 1) {
    hash = Math.imul(hash ^ texto.charCodeAt(i), 16777619);
  }
  return hash >>> 0;
}

export function ExercicioRenderer({ atividade }: PropsRenderer<'exercise'>) {
  const { generatorId, quantidade } = atividade.config;
  const idCampo = useId();
  const [passo, setPasso] = useState(0);
  const [resposta, setResposta] = useState('');
  const [verificacao, setVerificacao] = useState<Verificacao | null>(null);
  const { estado, atualizar } = useProgresso(atividade.id);

  const gerador = obterGerador(generatorId);
  const exercicio = useMemo(
    () => gerador?.generate(sementeDe(atividade.id) + passo),
    [gerador, atividade.id, passo],
  );

  if (!gerador || !exercicio) {
    return (
      <p role="alert">
        Gerador desconhecido: <code>{generatorId}</code>
      </p>
    );
  }

  const acertosNaAtividade = estado.acertos;
  const concluida = estado.concluida || acertosNaAtividade >= quantidade;

  function conferir(evento: React.FormEvent) {
    evento.preventDefault();
    if (!exercicio) return;
    const valor = Number(resposta.replace(',', '.'));
    const resultado = exercicio.check(valor);
    setVerificacao(resultado);

    atualizar((progresso) => {
      const comTentativa = registrarTentativa(progresso, atividade.id, resultado.correct);
      const acertos = comTentativa.atividades[atividade.id]?.acertos ?? 0;
      return acertos >= quantidade ? concluirAtividade(comTentativa, atividade.id) : comTentativa;
    });
  }

  function proximo() {
    setPasso((atual) => atual + 1);
    setResposta('');
    setVerificacao(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-neutral-600">
        {`${Math.min(acertosNaAtividade, quantidade)} de ${quantidade} acertos`}
        {concluida ? ' · atividade concluída' : ''}
      </p>

      <p className="text-base">
        <TextoComMatematica texto={exercicio.statement} />
      </p>

      <form onSubmit={conferir} className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col">
          <label htmlFor={idCampo} className="text-sm">
            Sua resposta
          </label>
          <input
            id={idCampo}
            inputMode="decimal"
            value={resposta}
            onChange={(evento) => setResposta(evento.target.value)}
            className="rounded border border-neutral-400 px-2 py-1"
          />
        </div>
        <button type="submit" className="rounded border border-neutral-400 px-3 py-1">
          Conferir
        </button>
        <button type="button" onClick={proximo} className="rounded border border-neutral-400 px-3 py-1">
          Gerar outro
        </button>
      </form>

      {verificacao ? (
        <p role="status" className={verificacao.correct ? 'text-green-700' : 'text-red-700'}>
          {verificacao.correct ? 'Correto.' : <TextoComMatematica texto={verificacao.hint ?? ''} />}
        </p>
      ) : null}
    </div>
  );
}
