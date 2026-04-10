"use client";

import { useState, type FormEvent, type DragEvent } from "react";
import type { EnrichedResult } from "@/lib/types";
import { getGroqKey } from "@/lib/groq-key";
import ApiKeyManager from "./ApiKeyManager";
import ResultsGrid from "./ResultsGrid";

interface AnalysisResult {
  stackSummary: string;
  currentDeps: string[];
  results: EnrichedResult[];
}

export default function PackageAnalyzer() {
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showByok, setShowByok] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  function parseDeps(raw: string): Record<string, string> | null {
    try {
      const parsed = JSON.parse(raw);
      const deps: Record<string, string> = {
        ...(parsed.dependencies ?? {}),
        ...(parsed.devDependencies ?? {}),
      };
      if (Object.keys(deps).length === 0) return null;
      return deps;
    } catch {
      return null;
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const deps = parseDeps(input);
    if (!deps) {
      setError(
        "Could not parse package.json. Make sure it contains a valid dependencies or devDependencies field.",
      );
      return;
    }
    await doAnalyze(deps);
  }

  async function doAnalyze(deps: Record<string, string>) {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const userKey = getGroqKey();
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userKey ? { "x-groq-api-key": userKey } : {}),
        },
        body: JSON.stringify({ dependencies: deps }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429) setShowByok(true);
        if (res.status === 401 && data?.code === "INVALID_USER_KEY")
          setShowByok(true);
        throw new Error(data?.error ?? `Request failed: ${res.status}`);
      }

      const data = await res.json();
      setAnalysis(data);
      setShowByok(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setInput(reader.result);
      }
    };
    reader.readAsText(file);
  }

  function handleKeyChange() {
    setShowByok(false);
  }

  const EXAMPLE_PKG = JSON.stringify(
    {
      dependencies: {
        next: "^14.0.0",
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        tailwindcss: "^3.4.0",
        typescript: "^5.0.0",
      },
    },
    null,
    2,
  );

  return (
    <div className="w-full flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative rounded-lg border-2 border-dashed transition-colors ${
            dragOver
              ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800"
              : "border-zinc-300 dark:border-zinc-700"
          }`}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your package.json here or drag & drop the file...'
            rows={12}
            className="w-full rounded-lg bg-transparent px-4 py-3 text-sm font-mono text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none resize-none"
            disabled={loading}
          />
          {!input && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-500">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-xs">
                  Drop package.json or paste contents
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-lg bg-zinc-900 dark:bg-zinc-100 px-5 py-2.5 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Analyzing..." : "Analyze My Stack"}
          </button>
          {!input && (
            <button
              type="button"
              onClick={() => setInput(EXAMPLE_PKG)}
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Try example
            </button>
          )}
          {input && (
            <button
              type="button"
              onClick={() => {
                setInput("");
                setAnalysis(null);
                setError(null);
              }}
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      <ApiKeyManager show={showByok} onKeyChange={handleKeyChange} />

      {error && !showByok && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
        </div>
      )}

      {analysis && !loading && (
        <div className="flex flex-col gap-6">
          {analysis.stackSummary && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5">
              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                Your Stack
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                {analysis.stackSummary}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.currentDeps.map((dep) => (
                  <span
                    key={dep}
                    className="rounded-full bg-zinc-200 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-mono text-zinc-700 dark:text-zinc-300"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
              Recommended Additions
            </h3>
            <ResultsGrid results={analysis.results} />
          </div>
        </div>
      )}
    </div>
  );
}
