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
  /** Soft skills e metodologias reais do candidato (comunicação, liderança, mentoria, Scrum/Kanban etc.), com ênfase nas pedidas pela vaga. */
  hab_soft: string;
  /** 0 a N entradas — a IA decide quantas incluir de acordo com a relevância para a vaga. */
  projetos_destaque: ProjetoDestaque[];
  /** 0 a N entradas — a IA seleciona apenas os cursos/certificações relevantes para a vaga (pode ser omitido). */
  cursos?: Curso[];
  /** Sobrescreve o título abaixo do nome no cabeçalho (ex.: remover "Júnior" para vagas Pleno/Sênior). Se omitido, usa ctx.titulo. */
  titulo?: string;
  /** Sobrescreve o cargo exibido na experiência Frog Summit. Se omitido, usa ctx.empresas[0].cargo. */
  cargo_frog?: string;
  /** Sobrescreve o cargo exibido na experiência Brasmid Startup. Se omitido, usa ctx.empresas[1].cargo. */
  cargo_brasmid?: string;
  /** Sobrescreve o cargo exibido na experiência Projeto AAP-VR. Se omitido, usa ctx.empresas[2].cargo. */
  cargo_aapvr?: string;
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
  portfolio?: string;
  localizacao: string;
  /** Exatamente 3 entradas — mapeadas para exp_frog, exp_brasmid, exp_aapvr */
  empresas: [Empresa, Empresa, Empresa];
  educacao: Educacao[];
}

export type TemplateId = 'classico' | 'moderno';
