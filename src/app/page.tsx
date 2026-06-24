'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { DEFAULT_CONTEXT } from '@/lib/defaultContext';
import { TEMPLATES } from '@/lib/resumeTemplate';
import type { TemplateId } from '@/lib/types';

const EXAMPLE_PAYLOAD = {
  vaga: 'Full_stack_Coodesh',
  resumo:
    'Desenvolvedor Full-Stack com foco na criação de soluções escaláveis utilizando back-end em PHP (Laravel) e front-end moderno com React.js e Next.js. Possui forte espírito de equipe e atua de maneira colaborativa em ambientes dinâmicos, com experiência prática na construção de APIs RESTful e modelagem em PostgreSQL. Destaca-se pela aplicação de padrões de arquitetura de frontend, rotina de code reviews constantes e vivência com serviços cloud como AWS.',
  exp_frog_bullets: [
    'Realizou sessões de Pair Programming e intenso code review, assegurando a qualidade técnica e fortalecendo o espírito de equipe de maneira colaborativa.',
    'Aplicou padrões de arquitetura de frontend e backend utilizando princípios SOLID e Domain-Driven Design (DDD) para manter o código testável e escalável.',
    'Desenvolveu novas funcionalidades e integrações críticas, demonstrando rápida adaptação e resolução proativa em desafios de um ambiente dinâmico.',
  ],
  exp_brasmid_bullets: [
    'Desenvolveu o ciclo completo de plataformas Micro-SaaS e painéis administrativos utilizando back-end PHP com Laravel e front-end em Next.js e React.js.',
    'Criou APIs RESTful seguras e eficientes, conectando serviços a bases de dados estruturadas em PostgreSQL e otimizando consultas.',
    'Implementou fluxos de deploys automatizados, lidando com serviços cloud (AWS) sob prazos desafiadores em um ambiente dinâmico de startup.',
  ],
  exp_aapvr_bullets: [
    'Liderou a definição da arquitetura técnica de um sistema ERP em Next.js, atuando de maneira colaborativa na mentoria e treinamento técnico de estagiários.',
    'Trabalhou na automação de processos através da criação de scripts de dados, provando capacidade de liderança em ambientes focados em desenvolvimento contínuo.',
  ],
  hab_back: 'PHP, Laravel, Node.js, Nest.js, APIs RESTful, TypeScript, Express.js',
  hab_front: 'React.js, Next.js, Padrões de arquitetura de frontend, Vue.js, Tailwind CSS, JavaScript',
  hab_db: 'PostgreSQL, MySQL, MongoDB, Redis',
  hab_devops: 'AWS, Docker, Kubernetes, CI/CD, GitHub Flow',
  hab_arq: 'Code review, SOLID, DDD, Clean Architecture, Design Patterns',
  hab_seg: 'Integração de LLMs, OWASP Top 10, JWT, OAuth 2.0, HTTPS/TLS',
  projetos_destaque: [
    {
      titulo: 'SGE - Gestão Acadêmica — Projeto Full-Stack (2024)',
      descricao:
        'Solução focada em regras de negócio complexas, desenvolvida com back-end estruturado e banco de dados PostgreSQL. Utilizou Next.js e padrões de arquitetura de frontend para criar uma interface de alta performance.',
    },
    {
      titulo: 'Micro-SaaS Administrativo — Brasmid Startup (2024)',
      descricao:
        'Desenvolvimento do design ao deploy de uma plataforma escalável integrando React.js e Laravel (PHP). O projeto consumiu APIs próprias operando em ambiente cloud com alta disponibilidade para os clientes.',
    },
  ],
};

const CONTEXT_STORAGE_KEY = 'curriculo_context';

function loadStoredContext(): string {
  if (typeof window === 'undefined') return JSON.stringify(DEFAULT_CONTEXT, null, 2);
  return localStorage.getItem(CONTEXT_STORAGE_KEY) ?? JSON.stringify(DEFAULT_CONTEXT, null, 2);
}

export default function Home() {
  const [contextText, setContextText] = useState('');
  const [contextError, setContextError] = useState<string | null>(null);
  const [contextOpen, setContextOpen] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('classico');

  const [payloadText, setPayloadText] = useState(JSON.stringify(EXAMPLE_PAYLOAD, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('curriculo.pdf');
  const [error, setError] = useState<string | null>(null);

  const [showPrompt, setShowPrompt] = useState(false);
  const [promptContent, setPromptContent] = useState('');
  const [promptLoading, setPromptLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setContextText(loadStoredContext());
  }, []);

  const handleContextChange = (value: string) => {
    setContextText(value);
    setContextError(null);
    try {
      JSON.parse(value);
      localStorage.setItem(CONTEXT_STORAGE_KEY, value);
    } catch {
      setContextError('JSON inválido');
    }
  };

  const handleContextReset = () => {
    const fresh = JSON.stringify(DEFAULT_CONTEXT, null, 2);
    setContextText(fresh);
    setContextError(null);
    localStorage.setItem(CONTEXT_STORAGE_KEY, fresh);
  };

  const handleContextFormat = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(contextText), null, 2);
      setContextText(formatted);
      setContextError(null);
      localStorage.setItem(CONTEXT_STORAGE_KEY, formatted);
    } catch {
      setContextError('Não foi possível formatar: JSON inválido');
    }
  };

  const handlePayloadChange = (value: string) => {
    setPayloadText(value);
    setJsonError(null);
    try { JSON.parse(value); } catch { setJsonError('JSON inválido'); }
  };

  const handleFormat = () => {
    try {
      setPayloadText(JSON.stringify(JSON.parse(payloadText), null, 2));
      setJsonError(null);
    } catch { setJsonError('Não foi possível formatar: JSON inválido'); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => handlePayloadChange(ev.target?.result as string);
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleOpenPrompt = useCallback(async () => {
    setShowPrompt(true);
    if (promptContent) return;
    setPromptLoading(true);
    try {
      const res = await fetch('/api/prompt');
      setPromptContent(await res.text());
    } catch { setPromptContent('Erro ao carregar o prompt.'); }
    finally { setPromptLoading(false); }
  }, [promptContent]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    setError(null);
    setDownloadUrl(null);

    let parsedPayload: unknown;
    let parsedContext: unknown;

    try { parsedPayload = JSON.parse(payloadText); }
    catch { setError('O JSON da vaga está inválido. Corrija antes de gerar.'); return; }

    try { parsedContext = JSON.parse(contextText); }
    catch { setError('O JSON do contexto profissional está inválido. Corrija antes de gerar.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: parsedPayload,
          context: parsedContext,
          template: selectedTemplate,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Erro desconhecido ao gerar o PDF.');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const p = parsedPayload as { vaga?: string };
      setDownloadUrl(url);
      setDownloadName(`Curriculo_${p?.vaga ?? 'gerado'}.pdf`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar PDF.');
    } finally { setLoading(false); }
  };

  const contextSummary = (() => {
    try {
      const ctx = JSON.parse(contextText) as { nome?: string; titulo?: string };
      return `${ctx.nome ?? '—'} · ${ctx.titulo ?? '—'}`;
    } catch { return 'Contexto inválido'; }
  })();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 leading-tight">Gerador de Currículo PDF</h1>
            <p className="text-xs text-slate-500">Powered by React PDF</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        {/* ── Contexto Profissional ─────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <button
            onClick={() => setContextOpen((o) => !o)}
            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Contexto Profissional</h2>
                <p className="text-xs text-slate-500 mt-0.5">{contextSummary}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {contextError && (
                <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">JSON inválido</span>
              )}
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform ${contextOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </button>

          {contextOpen && (
            <div className="px-6 pb-5 border-t border-slate-100">
              <p className="text-xs text-slate-500 mt-4 mb-3 leading-relaxed">
                Edite seus dados pessoais, empresas e formação. Salvo automaticamente no navegador.
                As <strong>empresas[0,1,2]</strong> mapeiam para os campos <code className="bg-slate-100 px-1 rounded">exp_frog_bullets</code>, <code className="bg-slate-100 px-1 rounded">exp_brasmid_bullets</code> e <code className="bg-slate-100 px-1 rounded">exp_aapvr_bullets</code> do payload.
              </p>
              <div className="relative">
                <textarea
                  value={contextText}
                  onChange={(e) => handleContextChange(e.target.value)}
                  spellCheck={false}
                  rows={22}
                  className={`w-full font-mono text-xs bg-slate-950 text-slate-100 rounded-lg px-4 py-3 resize-none outline-none focus:ring-2 transition-all ${contextError ? 'ring-2 ring-red-500' : 'focus:ring-violet-500'}`}
                />
                {contextError && (
                  <div className="absolute bottom-3 right-3 text-xs text-red-400 bg-slate-900 px-2 py-1 rounded">{contextError}</div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={handleContextFormat}
                  className="text-xs px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                  Formatar JSON
                </button>
                <button onClick={handleContextReset}
                  className="text-xs px-3 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                  Restaurar padrão
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Seletor de Template ───────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                </svg>
              </div>
              <h2 className="text-sm font-semibold text-slate-800">Template de Layout</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(TEMPLATES) as [TemplateId, { label: string; description: string }][]).map(([id, tpl]) => (
                <button
                  key={id}
                  onClick={() => setSelectedTemplate(id)}
                  className={`relative text-left p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate === id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {id === 'classico' && selectedTemplate === 'classico' && (
                    <span className="absolute top-2 right-2 text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-medium">PADRÃO</span>
                  )}
                  {id === 'classico' && selectedTemplate !== 'classico' && (
                    <span className="absolute top-2 right-2 text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-medium">PADRÃO</span>
                  )}

                  {/* Mini preview */}
                  <div className="mb-3 w-full h-16 rounded overflow-hidden border border-slate-200">
                    {id === 'classico' ? (
                      <div className="w-full h-full bg-white p-1.5 flex flex-col gap-0.5">
                        <div className="flex justify-between items-start">
                          <div className="h-2.5 bg-slate-800 rounded w-2/5" />
                          <div className="flex flex-col gap-0.5 items-end">
                            <div className="h-1 bg-slate-300 rounded w-10" />
                            <div className="h-1 bg-slate-300 rounded w-8" />
                          </div>
                        </div>
                        <div className="h-px bg-slate-400 rounded w-full mt-0.5" />
                        <div className="h-1 bg-slate-200 rounded w-full" />
                        <div className="h-1 bg-slate-200 rounded w-4/5" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-white p-1.5 flex flex-col gap-0.5">
                        <div className="h-2 bg-slate-800 rounded w-1/2" />
                        <div className="h-0.5 bg-slate-300 rounded w-full" />
                        <div className="h-1 bg-slate-200 rounded w-full" />
                        <div className="h-1 bg-slate-200 rounded w-4/5" />
                        <div className="h-0.5 bg-slate-300 rounded w-full mt-0.5" />
                        <div className="h-1 bg-slate-200 rounded w-full" />
                      </div>
                    )}
                  </div>

                  <p className={`text-sm font-semibold mb-0.5 ${selectedTemplate === id ? 'text-indigo-700' : 'text-slate-800'}`}>
                    {tpl.label}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">{tpl.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Step 1: Gere o JSON com IA ───────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center">1</span>
              <h2 className="text-base font-semibold text-slate-800">Gere o JSON com IA</h2>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Use o prompt abaixo em qualquer LLM (Claude, ChatGPT, Gemini). Cole a descrição da vaga no final e o modelo retorna o JSON pronto.
            </p>
            <button onClick={handleOpenPrompt}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
              Ver Prompt de Exemplo
            </button>
          </div>
        </div>

        {/* ── Step 2: Cole o JSON ──────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center">2</span>
                <h2 className="text-base font-semibold text-slate-800">Cole o JSON gerado</h2>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleFormat}
                  className="text-xs px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                  Formatar JSON
                </button>
                <button onClick={() => fileInputRef.current?.click()}
                  className="text-xs px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                  Carregar arquivo
                </button>
                <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleFileUpload} />
              </div>
            </div>
            <div className="relative">
              <textarea value={payloadText} onChange={(e) => handlePayloadChange(e.target.value)}
                spellCheck={false}
                className={`w-full h-80 font-mono text-xs bg-slate-950 text-slate-100 rounded-lg px-4 py-3 resize-none outline-none focus:ring-2 transition-all ${jsonError ? 'ring-2 ring-red-500' : 'focus:ring-indigo-500'}`} />
              {jsonError && (
                <div className="absolute bottom-3 right-3 text-xs text-red-400 bg-slate-900 px-2 py-1 rounded">{jsonError}</div>
              )}
            </div>
          </div>
        </div>

        {/* ── Step 3: Gere o PDF ───────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center">3</span>
              <h2 className="text-base font-semibold text-slate-800">Gere o PDF</h2>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 mb-5 text-xs text-slate-600">
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <span>
                Usando template <strong>{TEMPLATES[selectedTemplate].label}</strong> com o contexto de <strong>{contextSummary.split(' · ')[0]}</strong>
              </span>
            </div>

            <button onClick={handleGenerate} disabled={loading || !!jsonError || !!contextError}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Gerando PDF...</>
              ) : (
                <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>Gerar PDF</>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-700">Erro ao gerar o PDF</p>
                  <p className="text-xs text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {downloadUrl && (
              <div className="mt-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-800">PDF gerado com sucesso!</p>
                    <p className="text-xs text-emerald-600">{downloadName}</p>
                  </div>
                </div>
                <a href={downloadUrl} download={downloadName}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Baixar PDF
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal prompt */}
      {showPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPrompt(false); }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">Prompt de Exemplo</h3>
              <div className="flex items-center gap-2">
                <button onClick={handleCopyPrompt} disabled={promptLoading}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50">
                  {copied ? (
                    <><svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>Copiado!</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>Copiar</>
                  )}
                </button>
                <button onClick={() => setShowPrompt(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              {promptLoading ? (
                <div className="flex items-center justify-center py-12">
                  <svg className="w-6 h-6 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : (
                <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">{promptContent}</pre>
              )}
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 rounded-b-xl">
              <p className="text-xs text-slate-500">
                Cole em qualquer LLM, substitua o bloco <code className="bg-slate-200 px-1 rounded">[COLE AQUI A DESCRIÇÃO DA VAGA]</code> e obtenha o JSON pronto.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
