import { defineAgent } from "eve";

// Atlas: the root agent. Coordinates the specialists declared under agent/subagents/.
export default defineAgent({
  // gpt-5-mini: available on the AI Gateway free tier. Switch to a newer model after topping up credits.
  model: "openai/gpt-5-mini",
  reasoning: "medium",
  defaultTools: false,
  tool: false, // no copies of Atlas; delegation only to the declared specialists
  limits: { maxInputTokensPerSession: 200_000, maxOutputTokensPerSession: 20_000, maxTokenCostUsdPerSession: 1 },
});
