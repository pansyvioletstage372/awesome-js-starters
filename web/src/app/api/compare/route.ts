import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import type { Package } from "@/lib/types";
import packagesData from "@/data/packages.json";

const defaultGroq = createGroq({ apiKey: process.env.GROQ_API_KEY });

const packages = packagesData as Package[];

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

  let packageA: string;
  let packageB: string;
  try {
    const body = await request.json();
    packageA = typeof body?.packageA === "string" ? body.packageA.trim() : "";
    packageB = typeof body?.packageB === "string" ? body.packageB.trim() : "";
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!packageA || !packageB) {
    return Response.json(
      { error: "Two package names are required" },
      { status: 400 },
    );
  }

  const pkgA = packages.find(
    (p) => p.name.toLowerCase() === packageA.toLowerCase(),
  );
  const pkgB = packages.find(
    (p) => p.name.toLowerCase() === packageB.toLowerCase(),
  );

  if (!pkgA || !pkgB) {
    return Response.json(
      { error: "Both packages must exist in the catalog" },
      { status: 400 },
    );
  }

  try {
    const { text } = await generateText({
      model: activeGroq("llama-3.3-70b-versatile"),
      prompt: `You are a package comparison expert for awesome-js-starters.

Compare these two npm packages head-to-head:

Package A: ${pkgA.name} (${pkgA.category}) - ${pkgA.description}
${pkgA.weeklyDownloads ? `Weekly downloads: ${pkgA.weeklyDownloads.toLocaleString()}` : ""}
${pkgA.githubStars ? `GitHub stars: ${pkgA.githubStars.toLocaleString()}` : ""}

Package B: ${pkgB.name} (${pkgB.category}) - ${pkgB.description}
${pkgB.weeklyDownloads ? `Weekly downloads: ${pkgB.weeklyDownloads.toLocaleString()}` : ""}
${pkgB.githubStars ? `GitHub stars: ${pkgB.githubStars.toLocaleString()}` : ""}

Provide an honest, balanced comparison. Respond with ONLY a valid JSON object (no markdown, no explanation):
{
  "summary": "<1-2 sentence overview of how they differ>",
  "packageA": {
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "weaknesses": ["<weakness 1>", "<weakness 2>"]
  },
  "packageB": {
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "weaknesses": ["<weakness 1>", "<weakness 2>"]
  },
  "pickA": "<When to choose ${pkgA.name} — 1 sentence>",
  "pickB": "<When to choose ${pkgB.name} — 1 sentence>",
  "verdict": "<Balanced 1-sentence verdict>"
}`,
    });

    const cleaned = text
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
    const comparison = JSON.parse(cleaned);

    return Response.json({
      packageA: pkgA,
      packageB: pkgB,
      comparison,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed";
    console.error("[compare] error:", message);

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
      { error: "Failed to compare packages. Please try again." },
      { status: 500 },
    );
  }
}
