import { defineAgent } from "eve";

export default defineAgent({
  description: "Pulse, especialista em tráfego e métricas: monta planos de teste, define métricas e analisa números fornecidos pelo usuário. Não acessa contas de anúncios.",
  model: "openai/gpt-5-mini",
  reasoning: "medium",
  defaultTools: false,
  limits: { maxInputTokensPerSession: 100_000, maxOutputTokensPerSession: 12_000, maxTokenCostUsdPerSession: 0.5 },
});
