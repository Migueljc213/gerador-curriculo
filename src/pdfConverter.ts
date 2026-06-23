import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);
const CONVERSION_TIMEOUT_MS = 60_000;

/**
 * Converte um arquivo .docx para .pdf usando o LibreOffice em modo headless.
 * Retorna o caminho absoluto do PDF gerado.
 *
 * Pré-requisito: `sudo apt-get install libreoffice`
 */
export async function convertDocxToPdf(
  docxPath: string,
  outputDir: string
): Promise<string> {
  const loPath = await resolveLibreOfficeBin();

  if (!fs.existsSync(docxPath)) {
    throw new Error(`Arquivo DOCX não encontrado para conversão: ${docxPath}`);
  }

  const command = `"${loPath}" --headless --convert-to pdf --outdir "${outputDir}" "${docxPath}"`;

  try {
    await execAsync(command, { timeout: CONVERSION_TIMEOUT_MS });
  } catch (err: any) {
    if (err.killed || err.signal === 'SIGTERM') {
      throw new Error(
        `Timeout na conversão para PDF (limite: ${CONVERSION_TIMEOUT_MS / 1000}s). ` +
        'Verifique se o LibreOffice não está travado.'
      );
    }
    throw new Error(`LibreOffice falhou na conversão:\n${err.message}`);
  }

  const pdfPath = path.join(outputDir, path.basename(docxPath, '.docx') + '.pdf');

  if (!fs.existsSync(pdfPath)) {
    throw new Error(
      'O PDF não foi gerado após a conversão. ' +
      'Execute manualmente para depurar: ' +
      `libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${docxPath}"`
    );
  }

  return pdfPath;
}

async function resolveLibreOfficeBin(): Promise<string> {
  for (const candidate of ['libreoffice', 'soffice']) {
    try {
      const { stdout } = await execAsync(`which ${candidate}`);
      return stdout.trim();
    } catch {
      // tenta o próximo candidato
    }
  }
  throw new Error(
    'LibreOffice não encontrado no PATH.\n' +
    'Instale com: sudo apt-get install libreoffice\n' +
    'Ou no macOS:  brew install --cask libreoffice'
  );
}
