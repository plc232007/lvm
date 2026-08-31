import type { Metadata } from 'next';
import { Geist, Geist_Mono, Newsreader } from 'next/font/google';
import Link from 'next/link';
import { Fermat } from '@/components/fermat/Fermat';
import { AlternadorTema } from '@/components/site/AlternadorTema';
import { FundoMatematico } from '@/components/site/FundoMatematico';
import { Marca } from '@/components/site/Marca';
import { SCRIPT_TEMA } from '@/lib/tema';
import 'katex/dist/katex.min.css';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const serifada = Newsreader({
  variable: '--font-serif',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: {
    default: 'LVM — Laboratório Virtual de Matemática',
    template: '%s · LVM',
  },
  description:
    'Laboratório de matemática do IFB: arraste o triângulo, veja as relações valerem e pratique com exercícios que mudam a cada tentativa.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${serifada.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <FundoMatematico />
        <a href="#conteudo" className="sr-only pular-para-conteudo">
          Pular para o conteúdo
        </a>

        <header className="cabecalho">
          <div className="cabecalho__conteudo">
            <Link href="/" className="cabecalho__marca">
              <Marca />
              <span>LVM</span>
            </Link>
            <p className="cabecalho__nota">Laboratório Virtual de Matemática · IFB</p>
            <div style={{ marginLeft: 'auto' }}>
              <AlternadorTema />
            </div>
          </div>
        </header>

        <main id="conteudo" className="flex-1">
          {children}
        </main>

        <footer className="rodape">
          <div className="envolucro" style={{ paddingBottom: '1.5rem' }}>
            <p className="meta">
              Conteúdo original de Victor Hugo Theodoro / IFB. Reescrito como laboratório
              interativo — o progresso fica só no seu navegador.
            </p>
          </div>
        </footer>

        <Fermat />
      </body>
    </html>
  );
}
