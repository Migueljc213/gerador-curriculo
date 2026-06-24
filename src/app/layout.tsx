import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gerador de Currículo PDF',
  description: 'Gere PDFs de currículo personalizados para cada vaga em segundos.',
  applicationName: 'Gerador de Currículo',
};

export const viewport: Viewport = {
  themeColor: '#4f46e5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
