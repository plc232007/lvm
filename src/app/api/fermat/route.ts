import {
  LIMITE_HISTORICO,
  LIMITE_MENSAGEM,
  MODELO_FERMAT,
  montarInstrucao,
  paraFormatoOpenAI,
  type MensagemFermat,
} from '@/lib/fermat';
import type { ContextoFermat } from '@/lib/fermat-contexto';

export const runtime = 'nodejs';
// A resposta é transmitida em fluxo; 30s cobre com folga o pior caso de fila.
export const maxDuration = 30;

const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

interface CorpoPedido {
  mensagens?: unknown;
  contexto?: unknown;
}

function ehMensagem(valor: unknown): valor is MensagemFermat {
  if (typeof valor !== 'object' || valor === null) return false;
  const registro = valor as Record<string, unknown>;
  return (
    (registro.papel === 'aluno' || registro.papel === 'fermat') &&
    typeof registro.texto === 'string' &&
    registro.texto.trim().length > 0
  );
}

function ehContexto(valor: unknown): valor is ContextoFermat {
  if (typeof valor !== 'object' || valor === null) return false;
  const registro = valor as Record<string, unknown>;
  return typeof registro.titulo === 'string' && typeof registro.tipo === 'string';
}

function erro(mensagem: string, status: number): Response {
  return Response.json({ erro: mensagem }, { status });
}

/**
 * Proxy do assistente. A chave da Groq fica no servidor: se ela fosse para o
 * navegador, qualquer aluno com o inspetor aberto sairia com ela no bolso.
 */
export async function POST(pedido: Request): Promise<Response> {
  const chave = process.env.GROQ_API_KEY;
  if (!chave) {
    return erro('Fermat está sem chave de acesso. Configure GROQ_API_KEY em .env.local.', 503);
  }

  let corpo: CorpoPedido;
  try {
    corpo = (await pedido.json()) as CorpoPedido;
  } catch {
    return erro('Pedido malformado.', 400);
  }

  const mensagens = Array.isArray(corpo.mensagens) ? corpo.mensagens.filter(ehMensagem) : [];
  if (mensagens.length === 0) return erro('Nenhuma mensagem para responder.', 400);
  if (mensagens.length > LIMITE_HISTORICO * 2) return erro('Conversa longa demais.', 413);
  if (mensagens.some((m) => m.texto.length > LIMITE_MENSAGEM)) {
    return erro(`Mensagem acima de ${LIMITE_MENSAGEM} caracteres.`, 413);
  }

  const contexto = ehContexto(corpo.contexto) ? corpo.contexto : null;

  const resposta = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODELO_FERMAT,
      stream: true,
      temperature: 0.65,
      max_tokens: 900,
      reasoning_effort: 'low',
      messages: [
        { role: 'system', content: montarInstrucao(contexto) },
        ...paraFormatoOpenAI(mensagens),
      ],
    }),
  });

  if (!resposta.ok || !resposta.body) {
    return erro('Fermat não conseguiu responder agora. Tente de novo em instantes.', 502);
  }

  return new Response(resposta.body.pipeThrough(extrairTexto()), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  });
}

/** Converte o SSE da Groq em texto puro: o cliente só precisa das palavras. */
function extrairTexto(): TransformStream<Uint8Array, Uint8Array> {
  const decodificador = new TextDecoder();
  const codificador = new TextEncoder();
  let sobra = '';

  return new TransformStream({
    transform(pedaco, controlador) {
      sobra += decodificador.decode(pedaco, { stream: true });
      const linhas = sobra.split('\n');
      sobra = linhas.pop() ?? '';

      for (const linha of linhas) {
        if (!linha.startsWith('data:')) continue;
        const dados = linha.slice(5).trim();
        if (dados === '' || dados === '[DONE]') continue;
        try {
          const evento = JSON.parse(dados) as {
            choices?: { delta?: { content?: string } }[];
          };
          const trecho = evento.choices?.[0]?.delta?.content;
          if (trecho) controlador.enqueue(codificador.encode(trecho));
        } catch {
          // pedaço incompleto de JSON: o próximo chunk completa
        }
      }
    },
  });
}
