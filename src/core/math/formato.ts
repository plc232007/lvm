const CASAS_MAXIMAS = 6;

export function casasDecimais(x: number, limite: number = CASAS_MAXIMAS): number {
  for (let casas = 0; casas < limite; casas += 1) {
    if (Math.abs(x - Number(x.toFixed(casas))) <= 1e-9) return casas;
  }
  return limite;
}

/** Notação pt-BR: separador decimal é vírgula, sem zeros à direita. */
export function formatarNumero(x: number, casas: number = 2): string {
  return x.toFixed(casas).replace(/\.?0+$/, '').replace('.', ',');
}

/** A vírgula precisa de chaves em LaTeX, senão vira separador de milhar. */
export function latexNumero(x: number, casas: number = 2): string {
  return formatarNumero(x, casas).replace(',', '{,}');
}
