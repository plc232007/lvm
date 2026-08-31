import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import type { RecursosAtividade } from '@/components/activity/registry';

export function LeituraRenderer({ recursos }: { recursos: RecursosAtividade }) {
  if (!recursos.textoMdx) {
    return <p role="alert">Texto não encontrado.</p>;
  }

  return (
    <article className="texto">
      <MDXRemote
        source={recursos.textoMdx}
        options={{ mdxOptions: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] } }}
      />
    </article>
  );
}
