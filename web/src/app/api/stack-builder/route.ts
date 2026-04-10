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

  let projectType: string;
  let requirements: string;
  try {
    const body = await request.json();
    projectType =
      typeof body?.projectType === "string" ? body.projectType.trim() : "";
    requirements =
      typeof body?.requirements === "string" ? body.requirements.trim() : "";
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!projectType) {
    return Response.json(
      { error: "Project type is required" },
      { status: 400 },
    );
  }

  try {
    const { text } = await generateText({
      model: activeGroq("llama-3.3-70b-versatile"),
      prompt: `You are a stack architect for awesome-js-starters.

A developer wants to build a "${projectType}" project.
${requirements ? `Additional requirements: ${requirements}` : ""}

Recommend the best combination of packages from our catalog that work well together for this project. Think about what a production-ready project of this type needs.

Our catalog:
${catalog}

Rules:
- Only recommend packages from the catalog above
- Recommend 3-7 packages that form a cohesive stack
- Explain the role each package plays in the stack
- Provide an install command with all packages

Respond with ONLY a valid JSON object (no markdown, no explanation):
{
  "stackName": "<short catchy name for this stack, e.g. 'The Full-Stack React Kit'>",
  "description": "<1-2 sentence description of what this stack enables>",
  "packages": [
    { "name": "<exact name from catalog>", "role": "<what role this package plays in the stack, e.g. 'Framework', 'Data Fetching', 'Validation'>" , "reason": "<1 sentence why it fits>" }
  ],
  "installCommand": "npm install <package1> <package2> ...",
  "tips": "<1-2 practical tips for getting started with this stack>"
}`,
    });

    const cleaned = text
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
    const parsed = JSON.parse(cleaned);

    const enrichedPackages: (EnrichedResult & { role: string })[] = (
      parsed.packages ?? []
    )
      .map(
        (match: { name: string; role: string; reason: string }) => {
          const pkg = packages.find(
            (p) => p.name.toLowerCase() === match.name.toLowerCase(),
          );
          if (!pkg) return null;
          return { ...pkg, reason: match.reason, role: match.role };
        },
      )
      .filter(Boolean);

    return Response.json({
      stackName: parsed.stackName ?? "",
      description: parsed.description ?? "",
      packages: enrichedPackages,
      installCommand: parsed.installCommand ?? "",
      tips: parsed.tips ?? "",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed";
    console.error("[stack-builder] error:", message);

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
      { error: "Failed to build stack. Please try again." },
      { status: 500 },
    );
  }
}
