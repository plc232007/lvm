'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import type { PropsRenderer } from '@/components/activity/registry';
import { TextoComMatematica } from '@/components/math/Latex';
import { obterGerador } from '@/core/exercise/generators';
import type { Verificacao } from '@/core/exercise/tipos';
import { concluirAtividade, registrarTentativa } from '@/core/progress';
import { definirEnunciado } from '@/lib/fermat-contexto';
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

  useEffect(() => {
    definirEnunciado(exercicio?.statement);
    return () => definirEnunciado(undefined);
  }, [exercicio]);

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

  const feitos = Math.min(acertosNaAtividade, quantidade);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          className="barra"
          style={{ flex: 1, maxWidth: '12rem' }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={quantidade}
          aria-valuenow={feitos}
          aria-label="Acertos nesta atividade"
        >
          <div className="barra__preenchido" style={{ width: `${(feitos / quantidade) * 100}%` }} />
        </div>
        <span className="meta medida">
          {feitos} de {quantidade}
        </span>
        {concluida ? <span className="selo selo--feito">concluída</span> : null}
      </div>

      <div className="cartao enunciado">
        <span className="meta">Enunciado</span>
        <p style={{ fontSize: '1.0625rem' }}>
          <TextoComMatematica texto={exercicio.statement} />
        </p>
      </div>

      <form onSubmit={conferir} className="linha-resposta">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label htmlFor={idCampo} style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            Sua resposta
          </label>
          <input
            id={idCampo}
            inputMode="decimal"
            autoComplete="off"
            placeholder="0,00"
            value={resposta}
            onChange={(evento) => setResposta(evento.target.value)}
            className="campo"
            style={{ width: '9rem' }}
          />
        </div>
        <button type="submit" className="botao">
          Conferir
        </button>
        <button type="button" onClick={proximo} className="botao botao--fantasma">
          Gerar outro
        </button>
      </form>

      {verificacao ? (
        <p
          role="status"
          className={verificacao.correct ? 'aviso aviso--certo' : 'aviso aviso--dica'}
        >
          {verificacao.correct ? (
            <>
              <strong>Correto.</strong> {feitos >= quantidade ? 'Atividade fechada.' : 'Vá para o próximo.'}
            </>
          ) : (
            <TextoComMatematica texto={verificacao.hint ?? ''} />
          )}
        </p>
      ) : null}
    </div>
  );
}
