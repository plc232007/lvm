import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LVM — Laboratório Virtual de Matemática',
  description:
    'Laboratório de matemática do IFB: manipule, teste hipóteses e pratique com exercícios que mudam a cada tentativa.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a href="#conteudo" className="sr-only">
          Pular para o conteúdo
        </a>
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-3xl items-baseline gap-2 px-4 py-3">
            <Link href="/" className="font-semibold">
              LVM
            </Link>
            <span className="meta">Laboratório Virtual de Matemática · IFB</span>
          </div>
        </header>
        <div id="conteudo" className="flex-1">
          {children}
        </div>
        <footer className="border-t border-border">
          <p className="meta mx-auto max-w-3xl px-4 py-4">
            Conteúdo original de Victor Hugo Theodoro / IFB.
          </p>
        </footer>
      </body>
    </html>
  );
}
