import type { ProfissionalContext } from './types';

export const DEFAULT_CONTEXT: ProfissionalContext = {
  nome: 'JOSÉ MIGUEL CARDOZO',
  titulo: 'Desenvolvedor Full-Stack Júnior',
  email: 'migueljccardozo@gmail.com',
  telefone: '+55 (24) 99973-6248',
  github: 'github.com/Migueljc123',
  linkedin: 'www.linkedin.com/in/jose-miguelfjc',
  portfolio: 'portifolio-jose-miguel.vercel.app',
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
  cursos: [
    {
      titulo: 'DevOps — Git, Linux, Docker e Kubernetes',
      plataforma: 'Alura',
      periodo: 'Jun/2026 – Presente',
      topicos: 'Git, Linux, Windows Server, Conceitos de DevOps, Docker, Kubernetes',
    },
    {
      titulo: 'Fundamentos de Modelos de Linguagem de Grande Escala (LLMs)',
      plataforma: 'DIO',
      periodo: 'Jun/2026 – Presente',
      topicos: 'LLMs, Transformers, Prompt Engineering, Fine-tuning, RAG',
    },
    {
      titulo: 'Intensivão de Docker (2h)',
      plataforma: 'Full Cycle 3',
      periodo: 'Abr/2026',
      topicos: 'Docker, Containers, Docker Compose, Boas práticas',
    },
    {
      titulo: 'Java 10x — Curso Completo de Java (40h)',
      plataforma: 'Java 10x',
      periodo: 'Fev/2026',
      topicos: 'Java, OOP, Collections, Streams, Spring Boot, JUnit',
    },
  ],
};
