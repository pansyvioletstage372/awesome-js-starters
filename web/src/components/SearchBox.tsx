"use client";

import { useEffect, useState } from "react";
import type { EnrichedResult } from "@/lib/types";
import { getGroqKey } from "@/lib/groq-key";
import ApiKeyManager from "./ApiKeyManager";
import ResultsGrid from "./ResultsGrid";

const EXAMPLES = [
  "I need a form validation library",
  "Lightweight state management for React",
  "Generate PDFs from HTML",
  "Fast HTTP client with TypeScript support",
];

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EnrichedResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showByok, setShowByok] = useState(false);
  const [hasUserKey, setHasUserKey] = useState(false);
  const [pendingRetry, setPendingRetry] = useState(false);

  useEffect(() => { setHasUserKey(getGroqKey() !== null); }, []);

  useEffect(() => {
    if (pendingRetry && hasUserKey && query.trim()) {
      setPendingRetry(false);
      doSearch(query.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingRetry, hasUserKey]);

  async function doSearch(trimmed: string) {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const userKey = getGroqKey();
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userKey ? { "x-groq-api-key": userKey } : {}),
        },
        body: JSON.stringify({ query: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429) setShowByok(true);
        if (res.status === 401 && data?.code === "INVALID_USER_KEY") setShowByok(true);
        throw new Error(data?.error ?? `Request failed: ${res.status}`);
      }
      const data = await res.json();
      setResults(data.results ?? []);
      setShowByok(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    doSearch(trimmed);
  }

  function handleKeyChange() {
    const keyExists = getGroqKey() !== null;
    setHasUserKey(keyExists);
    setShowByok(false);
    if (keyExists && query.trim()) setPendingRetry(true);
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Search form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            width="15" height="15" viewBox="0 0 15 15" fill="none"
            style={{ color: "#62666d" }}
          >
            <path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. I want to send emails from React"
            disabled={loading}
            className="w-full rounded-md pl-9 pr-4 py-2.5 outline-none transition-all"
            style={{
              fontSize: 14,
              color: "#f7f8f8",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              caretColor: "#7170ff",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="rounded-md px-4 py-2.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontSize: 13, fontWeight: 510, color: "#fff", background: "#5e6ad2" }}
          onMouseEnter={(e) => {
            if (!(e.currentTarget as HTMLButtonElement).disabled)
              (e.currentTarget as HTMLElement).style.background = "#7170ff";
          }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#5e6ad2"; }}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {/* Example prompts */}
      {!results && !loading && !showByok && (
        <div className="flex flex-wrap items-center gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setQuery(ex)}
              className="rounded-full px-3 py-1.5 transition-colors"
              style={{
                fontSize: 12,
                color: "#8a8f98",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#d0d6e0";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#8a8f98";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
              }}
            >
              {ex}
            </button>
          ))}
          {!hasUserKey && (
            <button
              type="button"
              onClick={() => setShowByok(true)}
              className="ml-auto transition-colors"
              style={{ fontSize: 12, color: "#62666d" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#8a8f98"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#62666d"; }}
            >
              API Key
            </button>
          )}
        </div>
      )}

      <ApiKeyManager show={showByok} onKeyChange={handleKeyChange} />

      {error && !showByok && (
        <p style={{ fontSize: 13, color: "#f87171" }}>{error}</p>
      )}

      {loading && (
        <div className="flex justify-center py-10">
          <div
            className="h-5 w-5 animate-spin rounded-full"
            style={{ border: "2px solid rgba(255,255,255,0.08)", borderTopColor: "#5e6ad2" }}
          />
        </div>
      )}

      {results !== null && !loading && <ResultsGrid results={results} />}
    </div>
  );
}
