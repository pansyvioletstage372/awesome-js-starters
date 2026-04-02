# nuqs

> Type-safe URL search params as React state — keep filters, sorting, and pagination in the URL.

**npm:** https://www.npmjs.com/package/nuqs  
**GitHub:** https://github.com/47ng/nuqs  
**Docs:** https://nuqs.47ng.com

---

## The Problem

Building a page with filters, sorting, or pagination that survives a browser refresh is harder than it should be. The usual approaches are:

- **Local state (`useState`)** — filters reset on refresh and can't be shared via URL
- **Manual `URLSearchParams` parsing** — verbose, error-prone, no type safety
- **Redux/Zustand + URL sync** — overkill for this use case, lots of boilerplate

The result: users can't bookmark a filtered view, share a link to specific results, or use the browser back button naturally.

---

## What It Does

`nuqs` gives you a `useQueryState` hook — a drop-in replacement for `useState` that reads from and writes to the URL query string. It's type-safe, supports serialization of complex types (numbers, booleans, arrays, dates), and works with Next.js App Router, Pages Router, and other React frameworks.

With ~300K weekly npm downloads, it's widely used but rarely talked about.

---

## Installation

```bash
npm install nuqs
```

---

## Usage Example

### Basic string search param

```tsx
"use client";
import { useQueryState } from "nuqs";

export function SearchInput() {
  const [query, setQuery] = useQueryState("q");

  return (
    <input
      value={query ?? ""}
      onChange={(e) => setQuery(e.target.value || null)}
      placeholder="Search..."
    />
  );
  // URL becomes: /products?q=shoes
}
```

### Typed params with parsers (number, boolean, array)

```tsx
"use client";
import { useQueryState, parseAsInteger, parseAsBoolean, parseAsArrayOf, parseAsString } from "nuqs";

export function ProductFilters() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [inStock, setInStock] = useQueryState("inStock", parseAsBoolean.withDefault(false));
  const [tags, setTags] = useQueryState("tags", parseAsArrayOf(parseAsString).withDefault([]));

  return (
    <div>
      <button onClick={() => setPage(page + 1)}>Page {page}</button>
      <label>
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
        />
        In stock only
      </label>
    </div>
  );
  // URL becomes: /products?page=2&inStock=true&tags=sale,new
}
```

### Server-side parsing in Next.js App Router

```tsx
// app/products/page.tsx (Server Component)
import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server";

const searchParamsCache = createSearchParamsCache({
  q: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
});

export default async function ProductsPage({ searchParams }) {
  const { q, page } = searchParamsCache.parse(searchParams);

  const products = await fetchProducts({ query: q, page });
  return <ProductList products={products} />;
}
```

---

## Screenshot / Demo

> Add a gif showing the URL updating in real-time as filters are changed.

---

## Why It's a Hidden Gem

URL state management is a common need but most developers either ignore it (local state only) or over-engineer it. `nuqs` is the cleanest solution in the React ecosystem and is actively maintained with full Next.js App Router support.

---

## Submitted by

<!-- @your-github-handle -->
