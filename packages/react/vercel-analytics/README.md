# @vercel/analytics

> Privacy-first, cookie-free web analytics for React and Next.js — no GDPR banner required.

**npm:** https://www.npmjs.com/package/@vercel/analytics  
**GitHub:** https://github.com/vercel/analytics  
**Docs:** https://vercel.com/docs/analytics

---

## The Problem

Adding analytics to a web app usually means:

- Setting up Google Analytics or Mixpanel and dealing with GDPR consent banners
- Cookies that slow down your page and get blocked by ad blockers
- Complex dashboards for data you mostly don't use
- Privacy concerns about passing user data to third-party trackers

For most projects, you just want to know: *how many visitors do I have, where are they coming from, and which pages are most popular?*

---

## What It Does

`@vercel/analytics` gives you real-time, privacy-friendly web analytics with zero configuration. It tracks page views and custom events without using cookies, without collecting personal data, and without getting blocked by most ad blockers. One component added to your app — that's it.

---

## Installation

```bash
npm install @vercel/analytics
```

---

## Usage Example

### Next.js App Router (add once in layout.tsx)

```tsx
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Tracking custom events

```tsx
import { track } from "@vercel/analytics";

function SignupButton() {
  return (
    <button
      onClick={() => {
        track("signup_clicked", { plan: "pro" });
      }}
    >
      Sign up for Pro
    </button>
  );
}
```

### Pages Router

```tsx
// pages/_app.tsx
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

---

## Screenshot / Demo

> Add a screenshot of the Vercel Analytics dashboard here.

---

## Why It's a Hidden Gem

Most developers default to Google Analytics out of habit. `@vercel/analytics` requires no cookie consent banner, doesn't slow the page with heavy scripts, and the dashboard is built into Vercel — no extra account or configuration needed if you're already deploying there.

---

## Submitted by

<!-- @your-github-handle -->
