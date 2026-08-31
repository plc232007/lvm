'use client';

import { useEffect } from 'react';
import { definirLugar } from '@/lib/fermat-contexto';

/** Publica no store o lugar em que o aluno está, para o Fermat saber do que se fala. */
export function RegistrarContexto({
  titulo,
  tipo,
  trilha,
}: {
  titulo: string;
  tipo: string;
  trilha?: string;
}) {
  useEffect(() => {
    definirLugar({ titulo, tipo, trilha });
    return () => definirLugar(null);
  }, [titulo, tipo, trilha]);

  return null;
}
