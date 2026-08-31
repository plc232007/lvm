import Link from 'next/link';
import { TRILHAS } from '@/lib/conteudo';

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Laboratório Virtual de Matemática</h1>
        <p className="max-w-prose">
          Aqui você não só lê e assiste: manipula o objeto matemático, testa o que acontece e
          resolve exercícios que mudam de número a cada tentativa.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Trilhas</h2>
        {TRILHAS.map((trilha) => (
          <article key={trilha.id} className="cartao">
            <h3 className="font-medium">
              <Link href={`/trilhas/${trilha.slug}`} className="underline">
                {trilha.titulo}
              </Link>
            </h3>
            <p>{trilha.resumo}</p>
            <p className="meta">{trilha.atividades.length} atividades</p>
          </article>
        ))}
      </section>
    </main>
  );
}
