# ai (Vercel AI SDK)

> Unified TypeScript SDK for building AI-powered apps — switch between 20+ LLM providers without rewriting code.

**npm:** https://www.npmjs.com/package/ai  
**GitHub:** https://github.com/vercel/ai  
**Docs:** https://ai-sdk.dev

---

## The Problem

Every AI provider (OpenAI, Anthropic, Google, Mistral, etc.) has a different SDK, different API response shapes, and different ways to handle streaming. Building an AI feature means:

- Learning a new SDK for each provider
- Rewriting your code if you want to switch models
- Implementing streaming from scratch with each provider's format
- No standardized way to handle tool calls, structured outputs, or multi-step agents across providers

---

## What It Does

The Vercel AI SDK provides a single, consistent API for text generation, streaming, structured outputs, tool calling, and agentic workflows — regardless of which model provider you use. Swap from GPT-4o to Claude 3.5 Sonnet by changing one import. It handles streaming, token usage, error handling, and React hooks for real-time UI updates.

---

## Installation

```bash
npm install ai
# Plus the provider you want:
npm install @ai-sdk/openai        # OpenAI / ChatGPT
npm install @ai-sdk/anthropic     # Claude
npm install @ai-sdk/google        # Gemini
```

---

## Usage Example

### Generate text (works with any provider)

```ts
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
// Swap this import to switch providers — nothing else changes
// import { anthropic } from "@ai-sdk/anthropic";
// import { google } from "@ai-sdk/google";

const { text } = await generateText({
  model: openai("gpt-4o"),
  prompt: "Explain monorepos in one paragraph.",
});

console.log(text);
```

### Streaming response in a Next.js route handler

```ts
// app/api/chat/route.ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
  });

  return result.toDataStreamResponse();
}
```

### Streaming chat UI with useChat hook

```tsx
"use client";
import { useChat } from "@ai-sdk/react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          <strong>{m.role}:</strong> {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} placeholder="Ask something..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

### Structured output (type-safe JSON from LLMs)

```ts
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const { object } = await generateObject({
  model: openai("gpt-4o"),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    sentiment: z.enum(["positive", "negative", "neutral"]),
  }),
  prompt: "Analyse this review: 'Great product, fast shipping!'",
});

console.log(object); // { title: "...", tags: [...], sentiment: "positive" }
```

---

## Screenshot / Demo

> Add a screenshot of a streaming chat UI or structured output demo here.

---

## Why It's a Hidden Gem

Most developers pick one provider SDK and stick with it, locking themselves in. The AI SDK makes provider-switching trivial and its React hooks handle the stream-to-UI plumbing that every AI chat app needs to build from scratch otherwise.

---

## Submitted by

<!-- @your-github-handle -->
