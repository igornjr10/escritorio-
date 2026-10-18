import { defineAgent } from "eve";

export default defineAgent({
  model: "openai/gpt-6-luna-fast",
  reasoning: "high",
  defaultTools: false,
  tool: false,
  limits: { maxInputTokensPerSession: 100_000, maxOutputTokensPerSession: 12_000, maxTokenCostUsdPerSession: 1 },
});
