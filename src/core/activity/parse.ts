import {
  ehTipoDeAtividade,
  type Activity,
  type ActivityKind,
  type Trilha,
} from '@/core/activity/tipos';
import { falha, sucesso, type Resultado } from '@/core/resultado';

export interface ErroConteudo {
  readonly origem: string;
  readonly atividade: string;
  readonly campo: string;
  readonly mensagem: string;
}

type Registro = Record<string, unknown>;

function ehRegistro(valor: unknown): valor is Registro {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function textoNaoVazio(valor: unknown): boolean {
  return typeof valor === 'string' && valor.trim().length > 0;
}

/**
 * Valida os campos de `config` conforme o `kind` declarado e devolve a lista de
 * problemas. Lista, e não o primeiro erro: quem está escrevendo conteúdo prefere
 * ver tudo que precisa arrumar de uma vez.
 */
function problemasDoConfig(kind: ActivityKind, config: unknown): { campo: string; mensagem: string }[] {
  if (!ehRegistro(config)) {
    return [{ campo: 'config', mensagem: 'precisa ser um objeto' }];
  }

  const exigirTexto = (campo: string) =>
    textoNaoVazio(config[campo]) ? [] : [{ campo: `config.${campo}`, mensagem: 'texto obrigatório' }];

  switch (kind) {
    case 'simulator':
      return exigirTexto('simuladorId');
    case 'exercise': {
      const quantidade = config.quantidade;
      const problemas = exigirTexto('generatorId');
      if (typeof quantidade !== 'number' || !Number.isInteger(quantidade) || quantidade < 1) {
        problemas.push({ campo: 'config.quantidade', mensagem: 'inteiro maior que zero' });
      }
      return problemas;
    }
    case 'reading':
      return exigirTexto('arquivo');
    case 'video': {
      const problemas = exigirTexto('videoId');
      if (config.provedor !== 'youtube') {
        problemas.push({ campo: 'config.provedor', mensagem: 'apenas "youtube" na v1' });
      }
      return problemas;
    }
    case 'external': {
      const problemas = [...exigirTexto('url'), ...exigirTexto('descricao')];
      if (textoNaoVazio(config.url) && !/^https?:\/\//.test(String(config.url))) {
        problemas.push({ campo: 'config.url', mensagem: 'precisa começar com http:// ou https://' });
      }
      return problemas;
    }
  }
}

export function parseAtividades(
  bruto: unknown,
  origem: string,
): Resultado<readonly Activity[], readonly ErroConteudo[]> {
  if (!Array.isArray(bruto)) {
    return falha([
      { origem, atividade: '(raiz)', campo: '(raiz)', mensagem: 'esperava uma lista de atividades' },
    ]);
  }

  const erros: ErroConteudo[] = [];
  const atividades: Activity[] = [];
  const idsVistos = new Set<string>();

  bruto.forEach((item, indice) => {
    const rotulo = ehRegistro(item) && textoNaoVazio(item.id) ? String(item.id) : `#${indice}`;
    const registrar = (campo: string, mensagem: string) =>
      erros.push({ origem, atividade: rotulo, campo, mensagem });

    if (!ehRegistro(item)) {
      registrar('(item)', 'esperava um objeto');
      return;
    }

    for (const campo of ['id', 'moduleId', 'title']) {
      if (!textoNaoVazio(item[campo])) registrar(campo, 'texto obrigatório');
    }
    if (!ehTipoDeAtividade(item.kind)) {
      registrar('kind', `esperava um de: ${['reading', 'video', 'simulator', 'exercise', 'external'].join(', ')}`);
      return;
    }
    if (textoNaoVazio(item.id)) {
      if (idsVistos.has(String(item.id))) registrar('id', 'id repetido');
      idsVistos.add(String(item.id));
    }

    const problemas = problemasDoConfig(item.kind, item.config);
    for (const problema of problemas) registrar(problema.campo, problema.mensagem);

    if (problemas.length === 0 && erros.every((erro) => erro.atividade !== rotulo)) {
      atividades.push(item as unknown as Activity);
    }
  });

  return erros.length > 0 ? falha(erros) : sucesso(atividades);
}

export function descreverErros(erros: readonly ErroConteudo[]): string {
  return erros
    .map((erro) => `${erro.origem} → ${erro.atividade} → ${erro.campo}: ${erro.mensagem}`)
    .join('\n');
}

/**
 * A trilha injeta seu próprio id como `moduleId` das atividades: quem escreve
 * conteúdo não repete essa informação em cada parada.
 */
export function parseTrilha(
  bruto: unknown,
  origem: string,
): Resultado<Trilha, readonly ErroConteudo[]> {
  if (!ehRegistro(bruto)) {
    return falha([
      { origem, atividade: '(raiz)', campo: '(raiz)', mensagem: 'esperava um objeto de trilha' },
    ]);
  }

  const erros: ErroConteudo[] = [];
  for (const campo of ['id', 'slug', 'titulo', 'resumo']) {
    if (!textoNaoVazio(bruto[campo])) {
      erros.push({ origem, atividade: '(trilha)', campo, mensagem: 'texto obrigatório' });
    }
  }
  if (textoNaoVazio(bruto.slug) && !/^[a-z0-9-]+$/.test(String(bruto.slug))) {
    erros.push({
      origem,
      atividade: '(trilha)',
      campo: 'slug',
      mensagem: 'apenas minúsculas, números e hífen',
    });
  }
  if (!Array.isArray(bruto.atividades) || bruto.atividades.length === 0) {
    erros.push({
      origem,
      atividade: '(trilha)',
      campo: 'atividades',
      mensagem: 'esperava uma lista com pelo menos uma atividade',
    });
    return falha(erros);
  }

  const comModulo = bruto.atividades.map((item) =>
    ehRegistro(item) ? { moduleId: bruto.id, ...item } : item,
  );
  const atividades = parseAtividades(comModulo, origem);

  if (!atividades.ok) erros.push(...atividades.erro);
  if (erros.length > 0) return falha(erros);

  return sucesso({
    id: String(bruto.id),
    slug: String(bruto.slug),
    titulo: String(bruto.titulo),
    resumo: String(bruto.resumo),
    atividades: atividades.ok ? atividades.valor : [],
  });
}
