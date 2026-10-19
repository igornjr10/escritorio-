import { defineAgent } from "eve";

export default defineAgent({
  // gpt-5-mini: available on the AI Gateway free tier. Switch to a newer model after topping up credits.
  model: "openai/gpt-5-mini",
  reasoning: "high",
  defaultTools: false,
  tool: false,
  limits: { maxInputTokensPerSession: 100_000, maxOutputTokensPerSession: 12_000, maxTokenCostUsdPerSession: 1 },
});
