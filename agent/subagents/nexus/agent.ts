import { defineAgent } from "eve";

export default defineAgent({
  description: "Nexus, especialista em projetos: transforma objetivos em etapas, checklists, responsáveis e cronogramas de entrega.",
  model: "openai/gpt-5-mini",
  reasoning: "medium",
  defaultTools: false,
  limits: { maxInputTokensPerSession: 100_000, maxOutputTokensPerSession: 12_000, maxTokenCostUsdPerSession: 0.5 },
});
