import { defineTool } from 'eve/tools';
import { z } from 'zod';

// Approved positioning shared by Atlas and every specialist. Static: no external lookup.
export const brandBrief = {
  name: 'Igor Ruan',
  instagram: '@igor_automatize',
  audience: 'Empresários e pessoas interessadas em aplicações práticas de IA',
  services: ['Desenvolvimento de CRM e SaaS', 'Agentes de IA', 'Automação de processos e integrações'],
  channels: ['Instagram', 'Threads'],
  tone: 'Natural, direto, brasileiro, prático e sem promessas de resultado garantido',
  values: ['Honestidade', 'Inovação', 'Compromisso'],
  positioning: 'Transformar tecnologia em vendas e reduzir trabalho manual',
};

export const brandBriefTool = () => defineTool({
  description: 'Consulta o posicionamento aprovado da marca de Igor Ruan. Não pesquisa fontes externas.',
  inputSchema: z.object({}),
  label: { start: () => 'Consultando o posicionamento de Igor Ruan' },
  execute: () => brandBrief,
});
