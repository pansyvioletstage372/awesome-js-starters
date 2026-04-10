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

  let packageName: string;
  try {
    const body = await request.json();
    packageName =
      typeof body?.packageName === "string" ? body.packageName.trim() : "";
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!packageName) {
    return Response.json(
      { error: "Package name is required" },
      { status: 400 },
    );
  }

  try {
    const { text } = await generateText({
      model: activeGroq("llama-3.3-70b-versatile"),
      prompt: `You are a migration advisor for awesome-js-starters.

A developer wants to migrate away from "${packageName}". Suggest alternatives from our catalog that could replace it, and provide practical migration guidance.

Our catalog:
${catalog}

Rules:
- Only recommend packages from the catalog that are genuine alternatives
- If nothing in the catalog is a good replacement, say so honestly
- Rate migration difficulty as "Easy", "Moderate", or "Hard"
- Provide a brief code comparison showing the old vs new API

Respond with ONLY a valid JSON object (no markdown, no explanation):
{
  "fromPackage": "${packageName}",
  "reason": "<1 sentence about why developers commonly migrate away from this>",
  "alternatives": [
    {
      "name": "<exact name from catalog>",
      "difficulty": "<Easy|Moderate|Hard>",
      "reason": "<why this is a good replacement>",
      "beforeCode": "<short code snippet showing the old package usage>",
      "afterCode": "<equivalent code snippet with the new package>"
    }
  ],
  "tips": "<1-2 practical tips for the migration>"
}`,
    });

    const cleaned = text
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
    const parsed = JSON.parse(cleaned);

    const alternatives = (parsed.alternatives ?? [])
      .map(
        (alt: {
          name: string;
          difficulty: string;
          reason: string;
          beforeCode: string;
          afterCode: string;
        }) => {
          const pkg = packages.find(
            (p) => p.name.toLowerCase() === alt.name.toLowerCase(),
          );
          if (!pkg) return null;
          return {
            ...pkg,
            difficulty: alt.difficulty,
            migrationReason: alt.reason,
            beforeCode: alt.beforeCode,
            afterCode: alt.afterCode,
          };
        },
      )
      .filter(Boolean);

    return Response.json({
      fromPackage: parsed.fromPackage ?? packageName,
      reason: parsed.reason ?? "",
      alternatives,
      tips: parsed.tips ?? "",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed";
    console.error("[migrate] error:", message);

    if (userApiKey) {
      const isAuthError =
        message.includes("401") ||
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("invalid");
      if (isAuthError) {
        return Response.json(
          {
            error: "Your API key appears to be invalid.",
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
            ? "Your Groq API key has hit its rate limit."
            : "Too many requests. Please wait a moment.",
        },
        { status: 429 },
      );
    }

    return Response.json(
      { error: "Failed to generate migration guide. Please try again." },
      { status: 500 },
    );
  }
}
