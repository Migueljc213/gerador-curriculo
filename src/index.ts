/**
 * Gerador de Currículos em PDF
 *
 * Uso:
 *   npm run generate -- --template ./Curriculo-Jose.docx --payload ./payload.json
 *   npm run generate -- --template ./Curriculo-Jose.docx --payload ./payload.json --output ./saida
 *
 * Sintaxe de tags no arquivo .docx:
 *   Campos simples (texto direto):
 *     {resumo}            → bloco de texto do resumo profissional
 *     {hab_back}          → habilidades de backend
 *     {hab_front}         → habilidades de frontend
 *     {hab_db}            → bancos de dados
 *     {hab_devops}        → ferramentas DevOps
 *     {hab_arq}           → padrões de arquitetura
 *     {hab_seg}           → segurança
 *     {projetos_destaque} → bloco de projetos (use \n no JSON para separar)
 *
 *   Bullet loops (parágrafo com formatação de bullet no Word):
 *     {#exp_frog_bullets}{text}{/exp_frog_bullets}
 *     {#exp_brasmid_bullets}{text}{/exp_brasmid_bullets}
 *     {#exp_aapvr_bullets}{text}{/exp_aapvr_bullets}
 *     → Cada item do array cria um novo parágrafo herdando o estilo do parágrafo template.
 */

import fs from 'fs';
import path from 'path';
import { parseArgs, validatePayload, buildOutputFilename } from './utils';
import { processDocxTemplate } from './docxHandler';
import { convertDocxToPdf } from './pdfConverter';

async function main(): Promise<void> {
  const args = parseArgs(process.argv);

  // Garante que o diretório de saída existe
  fs.mkdirSync(args.output, { recursive: true });

  // Lê e valida o payload JSON
  const payload = loadPayload(args.payload);

  console.log(`\n🎯 Vaga: ${payload.vaga}`);
  console.log(`📄 Template: ${args.template}`);
  console.log(`📂 Saída: ${args.output}\n`);

  // Passo 1: processa o template DOCX
  console.log('⚙️  Substituindo tags no template DOCX...');
  const docxBuffer = processDocxTemplate(args.template, payload);

  // Passo 2: salva DOCX temporário
  const tempName = `_temp_cv_${Date.now()}.docx`;
  const tempPath = path.join(args.output, tempName);
  fs.writeFileSync(tempPath, docxBuffer);
  console.log('✅ DOCX processado.');

  // Passo 3: converte para PDF (cleanup garantido no finally)
  let rawPdfPath: string;
  try {
    console.log('🔄 Convertendo para PDF via LibreOffice...');
    rawPdfPath = await convertDocxToPdf(tempPath, args.output);
  } finally {
    safeDelete(tempPath);
  }

  // Passo 4: renomeia o PDF para o nome final
  const finalFilename = buildOutputFilename(payload.vaga);
  const finalPath = path.join(args.output, finalFilename);

  if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);
  fs.renameSync(rawPdfPath, finalPath);

  console.log(`\n✅ PDF gerado com sucesso!`);
  console.log(`   📁 ${finalPath}\n`);
}

function loadPayload(payloadPath: string) {
  if (!fs.existsSync(payloadPath)) {
    throw new Error(`Arquivo de payload não encontrado: ${payloadPath}`);
  }

  let raw: string;
  try {
    raw = fs.readFileSync(payloadPath, 'utf-8');
  } catch (err: any) {
    throw new Error(`Falha ao ler o payload: ${err.message}`);
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (err: any) {
    throw new Error(`Payload não é um JSON válido: ${err.message}`);
  }

  validatePayload(data);
  return data;
}

function safeDelete(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('🧹 Arquivo temporário removido.');
    }
  } catch {
    // não bloqueia o fluxo principal se a limpeza falhar
  }
}

main().catch((err: Error) => {
  console.error(`\n❌ Erro: ${err.message}\n`);
  process.exit(1);
});
