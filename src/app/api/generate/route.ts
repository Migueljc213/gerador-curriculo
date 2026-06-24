import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { buildCurriculoDocument } from '@/lib/resumeTemplate';
import type { CurriculoPayload } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as CurriculoPayload;

    if (!payload?.vaga || !payload?.resumo) {
      return NextResponse.json(
        { error: 'Payload inválido: campos "vaga" e "resumo" são obrigatórios.' },
        { status: 400 }
      );
    }

    const pdfBuffer = await renderToBuffer(buildCurriculoDocument(payload));

    const filename = `Curriculo_${payload.vaga.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    console.error('[generate]', err);
    return NextResponse.json({ error: err.message ?? 'Erro interno.' }, { status: 500 });
  }
}
