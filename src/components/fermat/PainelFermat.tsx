'use client';

import { useEffect, useRef, useState } from 'react';
import { Prosa } from '@/components/fermat/Prosa';
import { RostoFermat } from '@/components/fermat/RostoFermat';
import type { MensagemFermat } from '@/lib/fermat';
import type { ContextoFermat } from '@/lib/fermat-contexto';

const SUGESTOES_PADRAO = [
  'Por que a altura ao quadrado é o produto das projeções?',
  'Como eu sei qual projeção pertence a qual cateto?',
  'Me dá uma dica sem entregar a resposta',
];

const SUGESTOES_POR_TIPO: Record<string, string[]> = {
  exercise: [
    'Por onde eu começo?',
    'Qual relação eu uso aqui?',
    'Conferi minha conta e não bate. O que pode ter errado?',
  ],
  simulator: [
    'O que acontece com $h$ quando eu aproximo o vértice da ponta?',
    'Por que o ângulo continua reto em qualquer posição?',
  ],
  reading: ['Explica a semelhança dos três triângulos', 'Por que $a = m + n$?'],
};

export function PainelFermat({
  contexto,
  aoFechar,
}: {
  contexto: ContextoFermat | null;
  aoFechar: () => void;
}) {
  const [mensagens, setMensagens] = useState<MensagemFermat[]>([]);
  const [rascunho, setRascunho] = useState('');
  const [transmitindo, setTransmitindo] = useState(false);
  const [parcial, setParcial] = useState('');
  const [falha, setFalha] = useState<string | null>(null);
  const corpoRef = useRef<HTMLDivElement>(null);
  const campoRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    campoRef.current?.focus();
  }, []);

  useEffect(() => {
    corpoRef.current?.scrollTo({ top: corpoRef.current.scrollHeight, behavior: 'smooth' });
  }, [mensagens, parcial]);

  useEffect(() => {
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') aoFechar();
    };
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [aoFechar]);

  async function enviar(texto: string) {
    const pergunta = texto.trim();
    if (!pergunta || transmitindo) return;

    const historico: MensagemFermat[] = [...mensagens, { papel: 'aluno', texto: pergunta }];
    setMensagens(historico);
    setRascunho('');
    setFalha(null);
    setTransmitindo(true);
    setParcial('');

    try {
      const resposta = await fetch('/api/fermat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagens: historico, contexto }),
      });

      if (!resposta.ok || !resposta.body) {
        const corpo = (await resposta.json().catch(() => null)) as { erro?: string } | null;
        throw new Error(corpo?.erro ?? 'Fermat não respondeu.');
      }

      const leitor = resposta.body.getReader();
      const decodificador = new TextDecoder();
      let acumulado = '';

      for (;;) {
        const { done, value } = await leitor.read();
        if (done) break;
        acumulado += decodificador.decode(value, { stream: true });
        setParcial(acumulado);
      }

      setMensagens([...historico, { papel: 'fermat', texto: acumulado }]);
    } catch (motivo) {
      setFalha(motivo instanceof Error ? motivo.message : 'Algo deu errado.');
    } finally {
      setParcial('');
      setTransmitindo(false);
    }
  }

  const sugestoes = contexto ? (SUGESTOES_POR_TIPO[contexto.tipo] ?? SUGESTOES_PADRAO) : SUGESTOES_PADRAO;

  return (
    <section className="fermat-painel" role="dialog" aria-label="Conversa com Fermat" aria-modal="false">
      <header className="fermat-painel__topo">
        <span style={{ color: 'var(--azul)' }}>
          <RostoFermat tamanho={32} pensando={transmitindo} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2>Fermat</h2>
          <p className="meta" style={{ margin: 0 }}>
            {contexto ? contexto.titulo : 'Pergunte sobre a matéria'}
          </p>
        </div>
        <button type="button" className="botao botao--fantasma botao--compacto" onClick={aoFechar}>
          Fechar
        </button>
      </header>

      <div className="fermat-painel__corpo" ref={corpoRef}>
        {mensagens.length === 0 ? (
          <>
            <div className="balao balao--fermat">
              <Prosa texto="Pois não. Sou Fermat — não dou a resposta pronta, mas mostro o caminho. O que te travou?" />
            </div>
            {sugestoes.map((sugestao) => (
              <button
                key={sugestao}
                type="button"
                className="fermat-sugestao"
                onClick={() => void enviar(sugestao)}
              >
                {sugestao}
              </button>
            ))}
          </>
        ) : null}

        {mensagens.map((mensagem, indice) => (
          <div
            key={indice}
            className={mensagem.papel === 'aluno' ? 'balao balao--aluno' : 'balao balao--fermat'}
          >
            {mensagem.papel === 'aluno' ? <p>{mensagem.texto}</p> : <Prosa texto={mensagem.texto} />}
          </div>
        ))}

        <div aria-live="polite" aria-atomic="false">
          {transmitindo ? (
            <div className="balao balao--fermat">
              {parcial ? <Prosa texto={parcial} /> : null}
              <span className="fermat-cursor" aria-hidden="true" />
              <span className="sr-only">Fermat está escrevendo</span>
            </div>
          ) : null}
        </div>

        {falha ? (
          <p className="balao balao--erro" role="alert">
            {falha}
          </p>
        ) : null}
      </div>

      <form
        className="fermat-painel__rodape"
        onSubmit={(evento) => {
          evento.preventDefault();
          void enviar(rascunho);
        }}
      >
        <label htmlFor="fermat-campo" className="sr-only">
          Sua pergunta para o Fermat
        </label>
        <textarea
          id="fermat-campo"
          ref={campoRef}
          className="fermat-composicao"
          rows={1}
          value={rascunho}
          placeholder="Escreva sua dúvida…"
          onChange={(evento) => setRascunho(evento.target.value)}
          onKeyDown={(evento) => {
            if (evento.key === 'Enter' && !evento.shiftKey) {
              evento.preventDefault();
              void enviar(rascunho);
            }
          }}
        />
        <button type="submit" className="botao" disabled={transmitindo || rascunho.trim() === ''}>
          Enviar
        </button>
      </form>

      <p className="fermat-aviso">
        O que você escrever aqui é enviado a um modelo de IA (Groq) para gerar a resposta. Não
        mandamos seu nome nem seu progresso, e a conversa some quando você fecha a página.
      </p>
    </section>
  );
}
