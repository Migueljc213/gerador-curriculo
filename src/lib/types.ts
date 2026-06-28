export interface CurriculoPayload {
  vaga: string;
  resumo: string;
  exp_frog_bullets: string[];
  exp_brasmid_bullets: string[];
  exp_aapvr_bullets: string[];
  hab_back: string;
  hab_front: string;
  hab_db: string;
  hab_devops: string;
  hab_arq: string;
  hab_seg: string;
  projetos_destaque: ProjetoDestaque[];
}

export interface ProjetoDestaque {
  titulo: string;
  descricao: string;
}

export interface Empresa {
  nome: string;
  cargo: string;
  periodo: string;
}

export interface Educacao {
  titulo: string;
  instituicao: string;
  periodo: string;
}

export interface Curso {
  titulo: string;
  plataforma: string;
  periodo: string;
  topicos?: string;
}

export interface ProfissionalContext {
  nome: string;
  titulo: string;
  email: string;
  telefone: string;
  github: string;
  linkedin: string;
  localizacao: string;
  /** Exatamente 3 entradas — mapeadas para exp_frog, exp_brasmid, exp_aapvr */
  empresas: [Empresa, Empresa, Empresa];
  educacao: Educacao[];
  cursos?: Curso[];
}

export type TemplateId = 'classico' | 'minimalista';
