# @vercel/functions

> Utilities for Vercel Serverless and Edge Functions — geolocation, IP detection, and background tasks made easy.

**npm:** https://www.npmjs.com/package/@vercel/functions  
**GitHub:** https://github.com/vercel/vercel/tree/main/packages/functions  
**Docs:** https://vercel.com/docs/functions/vercel-functions-package

---

## The Problem

When building serverless functions on Vercel, common tasks like reading the visitor's IP address, geolocation data, or running background work after a response is sent require digging through raw headers or using workarounds. There's no standard utility for:

- Getting a reliable client IP from behind a proxy/CDN
- Reading geolocation headers (country, city, region) in a clean API
- Keeping a function alive after the response is sent for background processing (e.g. analytics, logging)

---

## What It Does

`@vercel/functions` provides a set of typed helper functions purpose-built for Vercel's runtime. It handles the edge cases (pun intended) of running in a CDN-proxied environment: IP spoofing protection, geolocation header parsing, and `waitUntil` for post-response background work.

---

## Installation

```bash
npm install @vercel/functions
```

---

## Usage Example

### Get visitor IP address

```ts
import { ipAddress } from "@vercel/functions";

export function GET(request: Request) {
  const ip = ipAddress(request);
  // Returns the real client IP, handles Vercel's proxy headers automatically
  return Response.json({ ip });
}
```

### Geolocation data

```ts
import { geolocation } from "@vercel/functions";

export function GET(request: Request) {
  const { city, country, region, latitude, longitude } = geolocation(request);

  return Response.json({
    message: `Hello from ${city}, ${country}!`,
    coords: { latitude, longitude },
  });
}
```

### waitUntil — run background work after response is sent

```ts
import { waitUntil } from "@vercel/functions";

export async function POST(request: Request) {
  const body = await request.json();

  // Send response immediately — don't make the user wait
  const response = Response.json({ status: "ok" });

  // This runs AFTER the response is sent, up to the function timeout
  waitUntil(
    logAnalyticsEvent({ event: "form_submitted", data: body })
  );

  return response;
}
```

---

## Screenshot / Demo

> Add a screenshot showing geolocation in action or a latency comparison with/without waitUntil.

---

## Why It's a Hidden Gem

Developers building on Vercel often reinvent these utilities themselves — manually parsing `x-forwarded-for` headers and guessing at geolocation keys. This package gives you the correct, tested implementation for Vercel's specific infrastructure.

---

## Submitted by

<!-- @your-github-handle -->
