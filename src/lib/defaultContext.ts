import type { ProfissionalContext } from './types';

export const DEFAULT_CONTEXT: ProfissionalContext = {
  nome: 'JOSÉ MIGUEL CARDOZO',
  titulo: 'Desenvolvedor Full-Stack Júnior',
  email: 'migueljccardozo@gmail.com',
  telefone: '+55 (24) 99973-6248',
  github: 'github.com/Migueljc123',
  linkedin: 'linkedin.com/in/miguel-cardozo',
  localizacao: 'Rio de Janeiro, RJ',
  empresas: [
    {
      nome: 'Frog Summit',
      cargo: 'Desenvolvedor Júnior Full-Stack',
      periodo: 'Mar/2025 – Presente',
    },
    {
      nome: 'Brasmid Startup',
      cargo: 'Desenvolvedor Júnior Full-Stack',
      periodo: 'Mai/2024 – Dez/2025',
    },
    {
      nome: 'Projeto AAP-VR',
      cargo: 'Liderança Técnica e Mentoria',
      periodo: 'Jan/2024 – Abr/2024',
    },
  ],
  educacao: [
    {
      titulo: 'Bacharelado em Sistemas para Internet',
      instituicao: 'FAETERJ',
      periodo: 'Previsão: Jul/2026',
    },
    {
      titulo: 'Formação Full-Stack Developer',
      instituicao: 'Escola DNC',
      periodo: 'Mai/2024 – Mar/2025',
    },
  ],
};
