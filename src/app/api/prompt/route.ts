import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROMPT_PATH = path.join(process.cwd(), 'prompt-rh.md');

export async function GET() {
  try {
    const content = fs.readFileSync(PROMPT_PATH, 'utf-8');
    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch {
    return NextResponse.json({ error: 'Prompt não encontrado.' }, { status: 404 });
  }
}
