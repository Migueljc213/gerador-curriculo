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
