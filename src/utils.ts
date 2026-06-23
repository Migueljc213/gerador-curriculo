import path from 'path';
import { CliArgs, CurriculoPayload } from './types';

export function parseArgs(argv: string[]): CliArgs {
  const args = argv.slice(2);
  const map: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg.startsWith('--')) {
      throw new Error(`Argumento inesperado: "${arg}". Use o formato --chave valor.`);
    }
    const key = arg.slice(2);
    const value = args[i + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Valor ausente para o argumento: ${arg}`);
    }
    map[key] = value;
    i++;
  }

  if (!map['template']) throw new Error('Argumento obrigatório ausente: --template <caminho>');
  if (!map['payload']) throw new Error('Argumento obrigatório ausente: --payload <caminho>');

  return {
    template: path.resolve(map['template']),
    payload: path.resolve(map['payload']),
    output: map['output'] ? path.resolve(map['output']) : path.resolve('./output'),
  };
}

export function validatePayload(data: unknown): asserts data is CurriculoPayload {
  if (typeof data !== 'object' || data === null) {
    throw new Error('O payload deve ser um objeto JSON válido.');
  }

  const obj = data as Record<string, unknown>;

  const requiredStrings: Array<keyof CurriculoPayload> = [
    'vaga', 'resumo', 'hab_back', 'hab_front', 'hab_db',
    'hab_devops', 'hab_arq', 'hab_seg',
  ];

  for (const key of requiredStrings) {
    if (typeof obj[key] !== 'string' || (obj[key] as string).trim() === '') {
      throw new Error(`Campo obrigatório inválido: "${key}" deve ser uma string não vazia.`);
    }
  }

  const requiredStringArrays: Array<keyof CurriculoPayload> = [
    'exp_frog_bullets', 'exp_brasmid_bullets', 'exp_aapvr_bullets',
  ];

  for (const key of requiredStringArrays) {
    const arr = obj[key];
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error(`Campo obrigatório inválido: "${key}" deve ser um array não vazio.`);
    }
    const invalid = arr.find((item) => typeof item !== 'string' || item.trim() === '');
    if (invalid !== undefined) {
      throw new Error(`Todos os itens de "${key}" devem ser strings não vazias.`);
    }
  }

  // Valida projetos_destaque como array de { titulo, descricao }
  const projetos = obj['projetos_destaque'];
  if (!Array.isArray(projetos) || projetos.length === 0) {
    throw new Error('Campo obrigatório inválido: "projetos_destaque" deve ser um array não vazio.');
  }
  for (const p of projetos) {
    if (typeof p !== 'object' || p === null) {
      throw new Error('Cada item de "projetos_destaque" deve ser um objeto { titulo, descricao }.');
    }
    const proj = p as Record<string, unknown>;
    if (typeof proj['titulo'] !== 'string' || (proj['titulo'] as string).trim() === '') {
      throw new Error('Cada projeto em "projetos_destaque" deve ter um campo "titulo" não vazio.');
    }
    if (typeof proj['descricao'] !== 'string' || (proj['descricao'] as string).trim() === '') {
      throw new Error('Cada projeto em "projetos_destaque" deve ter um campo "descricao" não vazio.');
    }
  }
}

export function sanitizeFilename(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')  // remove acentos
    .replace(/[^a-zA-Z0-9\s_-]/g, '') // remove caracteres especiais
    .trim()
    .replace(/\s+/g, '_');
}

export function buildOutputFilename(vaga: string): string {
  return `Jose_Cardozo_CV_${sanitizeFilename(vaga)}.pdf`;
}
