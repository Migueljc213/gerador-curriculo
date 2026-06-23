import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import fs from 'fs';
import { BulletItem, CurriculoPayload } from './types';

/**
 * Carrega o template .docx, substitui todas as tags pelo payload e retorna
 * o buffer do novo arquivo .docx sem alterar o layout XML original.
 *
 * Sintaxe de tags no template:
 *   - Campos simples:  {resumo}, {hab_back}, {projetos_destaque}, etc.
 *   - Bullet loops:    em um parágrafo com formatação de bullet, use:
 *                      {#exp_frog_bullets}{text}{/exp_frog_bullets}
 *                      O docxtemplater cria um parágrafo por item do array,
 *                      herdando a formatação (fonte, tamanho, estilo de lista).
 */
export function processDocxTemplate(templatePath: string, payload: CurriculoPayload): Buffer {
  const content = loadFile(templatePath);
  const zip = parseZip(content, templatePath);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true, // loops de array duplicam o parágrafo inteiro
    linebreaks: true,    // \n vira <w:br/> dentro do mesmo parágrafo
  });

  doc.render(buildTemplateData(payload));

  return doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
}

function loadFile(templatePath: string): string {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template não encontrado: ${templatePath}`);
  }
  try {
    return fs.readFileSync(templatePath, 'binary');
  } catch (err: any) {
    throw new Error(`Falha ao ler o template: ${err.message}`);
  }
}

function parseZip(content: string, templatePath: string): PizZip {
  try {
    return new PizZip(content);
  } catch {
    throw new Error(
      `O arquivo não é um .docx válido (ZIP corrompido): ${templatePath}`
    );
  }
}

function toBulletItems(lines: string[]): BulletItem[] {
  return lines.map((text) => ({ text }));
}

function buildTemplateData(payload: CurriculoPayload): Record<string, unknown> {
  return {
    resumo: payload.resumo,
    exp_frog_bullets: toBulletItems(payload.exp_frog_bullets),
    exp_brasmid_bullets: toBulletItems(payload.exp_brasmid_bullets),
    exp_aapvr_bullets: toBulletItems(payload.exp_aapvr_bullets),
    hab_back: payload.hab_back,
    hab_front: payload.hab_front,
    hab_db: payload.hab_db,
    hab_devops: payload.hab_devops,
    hab_arq: payload.hab_arq,
    hab_seg: payload.hab_seg,
    projetos_destaque: payload.projetos_destaque,
  };
}
