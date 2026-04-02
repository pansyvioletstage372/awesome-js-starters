# flags

> Provider-agnostic feature flags SDK for Next.js and React — toggle features without redeploying.

**npm:** https://www.npmjs.com/package/flags  
**GitHub:** https://github.com/vercel/flags  
**Docs:** https://flags-sdk.dev

---

## The Problem

Deploying a feature flag system from scratch is deceptively complex:

- Hard-coding `if (process.env.FEATURE_X === "true")` doesn't scale and requires a redeploy to change
- Most feature flag services (LaunchDarkly, Split, etc.) lock you into their SDK and pricing
- Rolling your own database-backed flags adds latency to every request
- No standard way to preview flag states before shipping

---

## What It Does

`flags` is a provider-agnostic SDK that gives you type-safe feature flags in Next.js. It works with any backend — Vercel Edge Config, your own database, or any third-party flag service. Flags are evaluated at the edge for zero added latency, and it integrates with the Vercel Toolbar so you can override flags in production without touching code.

---

## Installation

```bash
npm install flags
```

---

## Usage Example

### Define a flag

```ts
// flags/index.ts
import { flag } from "flags/next";

export const showNewDashboard = flag<boolean>({
  key: "show-new-dashboard",
  defaultValue: false,
  async decide() {
    // Read from anywhere: env var, DB, Edge Config, LaunchDarkly, etc.
    return process.env.SHOW_NEW_DASHBOARD === "true";
  },
});
```

### Use in a Next.js Server Component

```tsx
// app/dashboard/page.tsx
import { showNewDashboard } from "@/flags";

export default async function DashboardPage() {
  const isNewDashboard = await showNewDashboard();

  if (isNewDashboard) {
    return <NewDashboard />;
  }

  return <LegacyDashboard />;
}
```

### Precompute flags for static rendering

```tsx
// app/dashboard/page.tsx
import { precompute } from "flags/next";
import { showNewDashboard } from "@/flags";

export async function generateStaticParams() {
  // Pre-renders a version of the page for each flag combination
  return precompute([showNewDashboard]);
}

export default async function DashboardPage({ params }) {
  const isNewDashboard = await showNewDashboard(params);
  return isNewDashboard ? <NewDashboard /> : <LegacyDashboard />;
}
```

### Use with Vercel Edge Config (sub-millisecond reads)

```ts
import { flag } from "flags/next";
import { createClient } from "@vercel/edge-config";

const edgeConfig = createClient(process.env.EDGE_CONFIG);

export const betaAccess = flag<boolean>({
  key: "beta-access",
  defaultValue: false,
  async decide() {
    return edgeConfig.get("beta-access") ?? false;
  },
});
```

---

## Screenshot / Demo

> Add a screenshot of the Vercel Toolbar flag override panel here.

---

## Why It's a Hidden Gem

Feature flags are usually treated as a DevOps or enterprise concern. This SDK makes them accessible for any Next.js project, provider-agnostic, and type-safe — without a heavy dependency or vendor lock-in.

---

## Submitted by

<!-- @your-github-handle -->
