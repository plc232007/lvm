import { TextoComMatematica } from '@/components/math/Latex';
import { normalizarDelimitadores } from '@/lib/fermat';

function Negrito({ texto }: { texto: string }) {
  const partes = texto.split(/(\*\*[^*]+\*\*)/g).filter((parte) => parte !== '');

  return (
    <>
      {partes.map((parte, indice) =>
        parte.startsWith('**') && parte.endsWith('**') ? (
          <strong key={indice}>
            <TextoComMatematica texto={parte.slice(2, -2)} />
          </strong>
        ) : (
          <TextoComMatematica key={indice} texto={parte} />
        ),
      )}
    </>
  );
}

/** Markdown mínimo — parágrafo, lista e negrito — mais matemática. Nada além. */
export function Prosa({ texto }: { texto: string }) {
  const blocos = normalizarDelimitadores(texto)
    .split(/\n{2,}/)
    .map((bloco) => bloco.trim())
    .filter(Boolean);

  return (
    <>
      {blocos.map((bloco, indice) => {
        const linhas = bloco.split('\n');
        const ehLista = linhas.every((linha) => /^\s*[-*]\s+/.test(linha));

        if (ehLista) {
          return (
            <ul key={indice}>
              {linhas.map((linha, i) => (
                <li key={i}>
                  <Negrito texto={linha.replace(/^\s*[-*]\s+/, '')} />
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={indice}>
            <Negrito texto={bloco} />
          </p>
        );
      })}
    </>
  );
}
