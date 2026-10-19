import { defineAgent } from "eve";

export default defineAgent({
  description: "Hunter, especialista em prospecção: define perfis de cliente ideal, sinais de oportunidade, perguntas de qualificação e mensagens de abordagem. Não pesquisa empresas reais.",
  model: "openai/gpt-5-mini",
  reasoning: "medium",
  defaultTools: false,
  limits: { maxInputTokensPerSession: 100_000, maxOutputTokensPerSession: 12_000, maxTokenCostUsdPerSession: 0.5 },
});
