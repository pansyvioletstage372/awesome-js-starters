# swr

> React Hooks library for data fetching with built-in caching, revalidation, and deduplication.

**npm:** https://www.npmjs.com/package/swr  
**GitHub:** https://github.com/vercel/swr  
**Docs:** https://swr.vercel.app

---

## The Problem

Fetching data in React without a library leads to a mess of `useEffect` + `useState` patterns scattered across components. You end up with:

- Multiple components triggering the same API call simultaneously
- No caching — every mount refetches from scratch
- Stale data shown to users after navigating back to a page
- Manual loading and error state management in every component
- No automatic refresh when the user returns to the tab

---

## What It Does

SWR (stale-while-revalidate) is a React Hooks library that handles all of this. It caches the response, deduplicates identical requests, and automatically revalidates data in the background. The name comes from the HTTP cache-control directive: return stale data immediately, then revalidate silently.

---

## Installation

```bash
npm install swr
```

---

## Usage Example

### Basic data fetching

```tsx
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function UserProfile({ userId }: { userId: string }) {
  const { data, error, isLoading } = useSWR(`/api/users/${userId}`, fetcher);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load user.</p>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}
```

### Global fetcher config (set once, use everywhere)

```tsx
// _app.tsx or layout.tsx
import { SWRConfig } from "swr";

export default function App({ children }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url) => fetch(url).then((res) => res.json()),
        revalidateOnFocus: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}

// Now in any component — no need to pass a fetcher
function Dashboard() {
  const { data } = useSWR("/api/dashboard");
  return <div>{data?.title}</div>;
}
```

### Optimistic UI with mutate

```tsx
import useSWR, { useSWRConfig } from "swr";

function LikeButton({ postId }: { postId: string }) {
  const { data } = useSWR(`/api/posts/${postId}`);
  const { mutate } = useSWRConfig();

  async function handleLike() {
    // Optimistically update the UI before the API call resolves
    mutate(
      `/api/posts/${postId}`,
      { ...data, likes: data.likes + 1 },
      false // don't revalidate yet
    );
    await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    mutate(`/api/posts/${postId}`); // revalidate after
  }

  return <button onClick={handleLike}>Like ({data?.likes})</button>;
}
```

---

## Screenshot / Demo

> Add a screenshot here showing real-time revalidation or the network deduplication in action.

---

## Why It's a Hidden Gem

Most React developers reach for React Query or manage state manually. SWR is lighter, simpler for most use cases, and comes directly from Vercel — it's deeply optimized for Next.js but works with any React app.

---

## Submitted by

<!-- @your-github-handle -->
