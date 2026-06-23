export interface CurriculoPayload {
  /** Nome da vaga ou empresa — usado no nome do PDF de saída */
  vaga: string;

  /** Resumo profissional adaptado para a vaga (3–4 frases) */
  resumo: string;

  /** Bullet points da experiência na Frog Summit */
  exp_frog_bullets: string[];

  /** Bullet points da experiência na Brasmid Startup */
  exp_brasmid_bullets: string[];

  /** Bullet points da experiência na AAP-VR */
  exp_aapvr_bullets: string[];

  /** Habilidades de Backend (lista separada por vírgula) */
  hab_back: string;

  /** Habilidades de Frontend (lista separada por vírgula) */
  hab_front: string;

  /** Bancos de dados (lista separada por vírgula) */
  hab_db: string;

  /** Ferramentas DevOps (lista separada por vírgula) */
  hab_devops: string;

  /** Padrões de Arquitetura (lista separada por vírgula) */
  hab_arq: string;

  /** Práticas de Segurança (lista separada por vírgula) */
  hab_seg: string;

  /** Array de projetos em destaque — título em negrito + descrição normal */
  projetos_destaque: ProjetoDestaque[];
}

export interface CliArgs {
  template: string;
  payload: string;
  output: string;
}

/** Formato interno que o docxtemplater recebe para loops de bullet points */
export interface BulletItem {
  text: string;
}

/** Projeto em destaque com título (negrito no template) e descrição */
export interface ProjetoDestaque {
  titulo: string;
  descricao: string;
}
