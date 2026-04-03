import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import type { EnrichedResult, Package } from "@/lib/types";
import packagesData from "@/data/packages.json";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

const packages = packagesData as Package[];

const catalog = packages
  .map((p) => `- ${p.name} (${p.category}): ${p.description}`)
  .join("\n");

export async function POST(request: Request) {
  let query: string;
  try {
    const body = await request.json();
    query = typeof body?.query === "string" ? body.query.trim() : "";
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!query) {
    return Response.json({ error: "Query is required" }, { status: 400 });
  }

  let matches: Array<{ name: string; reason: string }>;
  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `You are a package recommendation assistant for awesome-js-starters, a community-curated list of battle-tested npm packages.

Given a developer's use case, recommend the most relevant packages from the catalog below.
Only recommend packages that genuinely match. If nothing matches, return an empty array.
Limit to 5 results maximum.

Available packages:
${catalog}

Developer's use case: ${query}

Respond with ONLY a valid JSON array (no markdown, no explanation):
[{ "name": "<exact name from catalog>", "reason": "<1-2 sentence explanation>" }]`,
    });

    const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
    matches = JSON.parse(cleaned);
    if (!Array.isArray(matches)) matches = [];
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed";
    console.error("[search] error:", message);
    const isQuota = message.includes("quota") || message.includes("rate") || message.includes("429");
    return Response.json(
      { error: isQuota ? "Too many requests. Please wait a moment and try again." : "Failed to get recommendations. Please try again." },
      { status: isQuota ? 429 : 500 }
    );
  }

  const results: EnrichedResult[] = matches
    .slice(0, 5)
    .map((match) => {
      const pkg = packages.find(
        (p) => p.name.toLowerCase() === match.name.toLowerCase()
      );
      if (!pkg) return null;
      return { ...pkg, reason: match.reason };
    })
    .filter((r): r is EnrichedResult => r !== null);

  return Response.json({ results });
}
