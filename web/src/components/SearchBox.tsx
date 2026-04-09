"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { EnrichedResult } from "@/lib/types";
import { getGroqKey } from "@/lib/groq-key";
import ApiKeyManager from "./ApiKeyManager";
import ResultsGrid from "./ResultsGrid";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EnrichedResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showByok, setShowByok] = useState(false);
  const [hasUserKey, setHasUserKey] = useState(false);
  const [pendingRetry, setPendingRetry] = useState(false);

  useEffect(() => {
    setHasUserKey(getGroqKey() !== null);
  }, []);

  // Auto-retry search after user saves a new key
  useEffect(() => {
    if (pendingRetry && hasUserKey && query.trim()) {
      setPendingRetry(false);
      doSearch(query.trim());
    }
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
        if (res.status === 429) {
          setShowByok(true);
        }
        if (res.status === 401 && data?.code === "INVALID_USER_KEY") {
          setShowByok(true);
        }
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    doSearch(trimmed);
  }

  function handleKeyChange() {
    const keyExists = getGroqKey() !== null;
    setHasUserKey(keyExists);
    setShowByok(false);
    if (keyExists && query.trim()) {
      setPendingRetry(true);
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. I want to send emails from React"
          className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="rounded-lg bg-zinc-900 dark:bg-zinc-100 px-5 py-3 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {!results && !loading && !showByok && (
        <div className="flex flex-wrap items-center gap-2">
          {[
            "I need a form validation library",
            "Lightweight state management for React",
            "Generate PDFs from HTML",
            "Fast date formatting and parsing",
          ].map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setQuery(example)}
              className="rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              {example}
            </button>
          ))}
          {!hasUserKey && (
            <button
              type="button"
              onClick={() => setShowByok(true)}
              className="ml-auto text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              API Key
            </button>
          )}
        </div>
      )}

      <ApiKeyManager show={showByok} onKeyChange={handleKeyChange} />

      {error && !showByok && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
        </div>
      )}

      {results !== null && !loading && <ResultsGrid results={results} />}
    </div>
  );
}
