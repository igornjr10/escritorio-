import { defineAgent } from "eve";

export default defineAgent({
  description: "Maya, especialista em conteúdo: cria roteiros de Reels, carrosséis e posts para Threads sobre IA, agentes, CRM e automação para empresários.",
  model: "openai/gpt-5-mini",
  reasoning: "medium",
  defaultTools: false,
  limits: { maxInputTokensPerSession: 100_000, maxOutputTokensPerSession: 12_000, maxTokenCostUsdPerSession: 0.5 },
});
