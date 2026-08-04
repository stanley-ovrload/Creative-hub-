import Anthropic from "@anthropic-ai/sdk";
import { RECIPES, RECIPE_TYPES, type Brand, type RecipeType } from "./jobs";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

export type ClassificationResult = {
  type: RecipeType;
  reasoning: string;
  plan: string[];
};

const RECIPE_DESCRIPTIONS: Record<RecipeType, string> = {
  report:
    "a written analysis/report deliverable (market research, competitor breakdown, etc.)",
  script: "a script/copy deliverable only — no video or image generation",
  statics: "static image assets (social posts, ads, graphics)",
  broll: "raw supplementary video footage, not a finished edited video",
  video: "a finished, edited video (ad, explainer, social video)",
  full_sweep:
    "a compound request spanning research, script, and multiple videos — a full campaign sweep",
};

function buildPrompt(brand: Brand, brief: string): string {
  const options = RECIPE_TYPES.map(
    (type) => `- ${type}: ${RECIPE_DESCRIPTIONS[type]}`,
  ).join("\n");

  return `Classify this creative request brief into exactly one pipeline type.

Brand: ${brand}
Brief: "${brief}"

Pipeline types:
${options}

Respond with the single best-fitting type and a one-sentence reason.`;
}

export async function classifyBrief(
  brand: Brand,
  brief: string,
): Promise<ClassificationResult> {
  const response = await getClient().messages.create({
    model: "claude-opus-4-8",
    max_tokens: 512,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            type: { type: "string", enum: RECIPE_TYPES },
            reasoning: { type: "string" },
          },
          required: ["type", "reasoning"],
          additionalProperties: false,
        },
      },
    },
    messages: [{ role: "user", content: buildPrompt(brand, brief) }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error(
      `classifyBrief: no text content in response (stop_reason=${response.stop_reason})`,
    );
  }

  const parsed = JSON.parse(textBlock.text) as {
    type: RecipeType;
    reasoning: string;
  };

  return {
    type: parsed.type,
    reasoning: parsed.reasoning,
    plan: RECIPES[parsed.type],
  };
}
