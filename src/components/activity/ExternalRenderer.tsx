import type { PropsRenderer } from '@/components/activity/registry';

function dominio(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/** O destino aparece antes do clique: ninguém sai do LVM sem saber para onde vai. */
export function ExternalRenderer({ atividade }: PropsRenderer<'external'>) {
  const { url, descricao } = atividade.config;

  return (
    <div className="cartao">
      <p>{descricao}</p>
      <p className="meta">Abre fora do LVM, em {dominio(url)}</p>
      <a className="botao" href={url} target="_blank" rel="noopener noreferrer">
        Abrir em {dominio(url)}
        <span aria-hidden="true"> ↗</span>
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
    </div>
  );
}
