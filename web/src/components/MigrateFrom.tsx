"use client";

import { useState, type FormEvent } from "react";
import type { Package } from "@/lib/types";
import { getGroqKey } from "@/lib/groq-key";
import ApiKeyManager from "./ApiKeyManager";

interface Alternative extends Package {
  difficulty: string;
  migrationReason: string;
  beforeCode: string;
  afterCode: string;
}

interface MigrateResult {
  fromPackage: string;
  reason: string;
  alternatives: Alternative[];
  tips: string;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Moderate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  Hard: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const POPULAR_MIGRATIONS = [
  "Moment.js",
  "Express",
  "Axios",
  "Lodash",
  "Webpack",
  "jQuery",
];

export default function MigrateFrom() {
  const [packageName, setPackageName] = useState("");
  const [result, setResult] = useState<MigrateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showByok, setShowByok] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!packageName.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const userKey = getGroqKey();
      const res = await fetch("/api/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userKey ? { "x-groq-api-key": userKey } : {}),
        },
        body: JSON.stringify({ packageName: packageName.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429) setShowByok(true);
        if (res.status === 401 && data?.code === "INVALID_USER_KEY")
          setShowByok(true);
        throw new Error(data?.error ?? `Request failed: ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
      setShowByok(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
          placeholder="e.g. Moment.js, Axios, Express..."
          className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !packageName.trim()}
          className="rounded-lg bg-zinc-900 dark:bg-zinc-100 px-5 py-3 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Finding..." : "Find Alternatives"}
        </button>
      </form>

      {!result && !loading && !error && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Common migrations:
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_MIGRATIONS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setPackageName(name)}
                className="rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      <ApiKeyManager show={showByok} onKeyChange={() => setShowByok(false)} />

      {error && !showByok && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
        </div>
      )}

      {result && !loading && (
        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1">
              Migrating from {result.fromPackage}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {result.reason}
            </p>
          </div>

          {result.alternatives.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
              No direct alternatives found in our catalog for this package.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {result.alternatives.map((alt) => (
                <div
                  key={alt.name}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                        {alt.name}
                      </h4>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          DIFFICULTY_COLORS[alt.difficulty] ??
                          DIFFICULTY_COLORS.Moderate
                        }`}
                      >
                        {alt.difficulty} migration
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      {alt.migrationReason}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs font-medium text-red-600 dark:text-red-400 mb-1 block">
                          Before ({result.fromPackage})
                        </span>
                        <pre className="rounded-lg bg-zinc-950 p-3 text-xs font-mono text-zinc-300 overflow-x-auto">
                          <code>{alt.beforeCode}</code>
                        </pre>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400 mb-1 block">
                          After ({alt.name})
                        </span>
                        <pre className="rounded-lg bg-zinc-950 p-3 text-xs font-mono text-green-300 overflow-x-auto">
                          <code>{alt.afterCode}</code>
                        </pre>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      {alt.npm && (
                        <a
                          href={alt.npm}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                          npm
                        </a>
                      )}
                      {alt.docs && (
                        <a
                          href={alt.docs}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                          Docs
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {result.tips && (
            <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-4">
              <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Migration Tips
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {result.tips}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
