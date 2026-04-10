import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import type { EnrichedResult, Package } from "@/lib/types";
import packagesData from "@/data/packages.json";

const defaultGroq = createGroq({ apiKey: process.env.GROQ_API_KEY });

const packages = packagesData as Package[];

const catalog = packages
  .map((p) => `- ${p.name} (${p.category}): ${p.description}`)
  .join("\n");

export async function POST(request: Request) {
  const userApiKey = request.headers.get("x-groq-api-key")?.trim() || null;

  if (userApiKey && !userApiKey.startsWith("gsk_")) {
    return Response.json(
      { error: "Invalid API key format.", code: "INVALID_USER_KEY" },
      { status: 400 },
    );
  }

  const activeGroq = userApiKey
    ? createGroq({ apiKey: userApiKey })
    : defaultGroq;

  let deps: Record<string, string>;
  try {
    const body = await request.json();
    deps = body?.dependencies ?? {};
    if (typeof deps !== "object" || Array.isArray(deps)) {
      return Response.json({ error: "Invalid dependencies" }, { status: 400 });
    }
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const depNames = Object.keys(deps);
  if (depNames.length === 0) {
    return Response.json(
      { error: "No dependencies found in your package.json" },
      { status: 400 },
    );
  }

  let analysis: Array<{ name: string; reason: string }>;
  try {
    const { text } = await generateText({
      model: activeGroq("llama-3.3-70b-versatile"),
      prompt: `You are a stack analyzer for awesome-js-starters, a community-curated catalog of battle-tested npm packages.

A developer has shared their package.json dependencies. Analyze their current stack and recommend packages from our catalog that would complement it — filling gaps, improving DX, or replacing weaker alternatives.

Their current dependencies:
${depNames.join(", ")}

Our available catalog:
${catalog}

Rules:
- Do NOT recommend packages they already have installed
- Focus on gaps: what are they likely missing based on their stack?
- Maximum 5 recommendations
- Be specific about WHY each package fits their stack

Respond with ONLY a valid JSON object (no markdown, no explanation):
{
  "stackSummary": "<1-2 sentence summary of what they're building based on their deps>",
  "recommendations": [{ "name": "<exact name from catalog>", "reason": "<1-2 sentence explanation of why this fills a gap in their stack>" }]
}`,
    });

    const cleaned = text
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
    const parsed = JSON.parse(cleaned);
    analysis = Array.isArray(parsed.recommendations)
      ? parsed.recommendations
      : [];

    const enrichedResults: EnrichedResult[] = analysis
      .slice(0, 5)
      .map((match) => {
        const pkg = packages.find(
          (p) => p.name.toLowerCase() === match.name.toLowerCase(),
        );
        if (!pkg) return null;
        return { ...pkg, reason: match.reason };
      })
      .filter((r): r is EnrichedResult => r !== null);

    return Response.json({
      stackSummary: parsed.stackSummary ?? "",
      currentDeps: depNames,
      results: enrichedResults,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed";
    console.error("[analyze] error:", message);

    if (userApiKey) {
      const isAuthError =
        message.includes("401") ||
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("invalid");
      if (isAuthError) {
        return Response.json(
          {
            error:
              "Your API key appears to be invalid. Please check it and try again.",
            code: "INVALID_USER_KEY",
          },
          { status: 401 },
        );
      }
    }

    const isQuota =
      message.includes("quota") ||
      message.includes("rate") ||
      message.includes("429");
    if (isQuota) {
      return Response.json(
        {
          error: userApiKey
            ? "Your Groq API key has hit its rate limit. Please wait a moment and try again."
            : "Too many requests. Please wait a moment and try again.",
        },
        { status: 429 },
      );
    }

    return Response.json(
      { error: "Failed to analyze your stack. Please try again." },
      { status: 500 },
    );
  }
}
