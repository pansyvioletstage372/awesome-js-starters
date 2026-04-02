# @vercel/edge-config

> Read global configuration at sub-millisecond speed — no database round-trips for critical runtime data.

**npm:** https://www.npmjs.com/package/@vercel/edge-config  
**GitHub:** https://github.com/vercel/storage/tree/main/packages/edge-config  
**Docs:** https://vercel.com/docs/storage/edge-config

---

## The Problem

Some data needs to be read on every request but changes rarely — feature flags, kill switches, maintenance mode toggles, allowed IP lists, A/B test configs. The typical approach is to:

- Store it in a database and add latency to every request
- Hard-code it in environment variables and redeploy every change
- Use Redis/Upstash which still adds a network round-trip

None of these are ideal when you need a change to take effect globally in under a second with near-zero read latency.

---

## What It Does

Edge Config is a global, ultra-low-latency key-value data store. Reads happen in under 1ms because the data is stored at the edge — co-located with your serverless functions and edge middleware. Updates propagate globally in seconds. It's designed specifically for configuration data that's read often but written rarely.

---

## Installation

```bash
npm install @vercel/edge-config
```

---

## Usage Example

### Read a value

```ts
import { get } from "@vercel/edge-config";

export async function middleware(request: NextRequest) {
  const isMaintenanceMode = await get("maintenance_mode");

  if (isMaintenanceMode) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}
```

### Feature flag check in a route handler

```ts
import { get } from "@vercel/edge-config";

export async function GET() {
  const newCheckoutEnabled = await get<boolean>("new_checkout");

  return Response.json({ feature: newCheckoutEnabled ?? false });
}
```

### Read multiple values at once

```ts
import { getAll } from "@vercel/edge-config";

const config = await getAll(["feature_x", "feature_y", "rate_limit"]);
// { feature_x: true, feature_y: false, rate_limit: 100 }
```

### Check if a key exists

```ts
import { has } from "@vercel/edge-config";

const exists = await has("beta_users_list");
```

---

## Screenshot / Demo

> Add a screenshot of the Edge Config dashboard or a latency comparison here.

---

## Why It's a Hidden Gem

Developers solving the "read config on every request" problem usually add Redis or hit a database. Edge Config is purpose-built for this and reads are essentially free in terms of latency — it's physically closer to your compute than any external database can be.

---

## Submitted by

<!-- @your-github-handle -->
