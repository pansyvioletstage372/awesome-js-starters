"use client";

import { useState, type FormEvent } from "react";
import type { Package } from "@/lib/types";
import { getGroqKey } from "@/lib/groq-key";
import ApiKeyManager from "./ApiKeyManager";
import packagesData from "@/data/packages.json";

const packages = packagesData as Package[];
const packageNames = packages.map((p) => p.name).sort();

interface Comparison {
  summary: string;
  packageA: { strengths: string[]; weaknesses: string[] };
  packageB: { strengths: string[]; weaknesses: string[] };
  pickA: string;
  pickB: string;
  verdict: string;
}

interface CompareResult {
  packageA: Package;
  packageB: Package;
  comparison: Comparison;
}

function StatBadge({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  if (value == null) return null;
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
        {typeof value === "number"
          ? value >= 1000000
            ? `${(value / 1000000).toFixed(1)}M`
            : value >= 1000
              ? `${(value / 1000).toFixed(1)}k`
              : value
          : value}
      </span>
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
    </div>
  );
}

function PackageColumn({
  pkg,
  side,
  strengths,
  weaknesses,
}: {
  pkg: Package;
  side: "A" | "B";
  strengths: string[];
  weaknesses: string[];
}) {
  const color =
    side === "A"
      ? "border-blue-200 dark:border-blue-800"
      : "border-emerald-200 dark:border-emerald-800";
  const headerBg =
    side === "A"
      ? "bg-blue-50 dark:bg-blue-950/40"
      : "bg-emerald-50 dark:bg-emerald-950/40";

  return (
    <div className={`flex-1 rounded-xl border ${color} overflow-hidden`}>
      <div className={`${headerBg} p-4`}>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          {pkg.name}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {pkg.description}
        </p>
        <div className="flex gap-6 mt-3">
          <StatBadge label="Stars" value={pkg.githubStars} />
          <StatBadge label="Downloads/wk" value={pkg.weeklyDownloads} />
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1.5">
            Strengths
          </h4>
          <ul className="space-y-1">
            {strengths.map((s, i) => (
              <li
                key={i}
                className="text-sm text-zinc-700 dark:text-zinc-300 flex gap-2"
              >
                <span className="text-green-500 shrink-0">+</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1.5">
            Weaknesses
          </h4>
          <ul className="space-y-1">
            {weaknesses.map((w, i) => (
              <li
                key={i}
                className="text-sm text-zinc-700 dark:text-zinc-300 flex gap-2"
              >
                <span className="text-red-500 shrink-0">-</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-2 mt-2">
          {pkg.npm && (
            <a
              href={pkg.npm}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              npm
            </a>
          )}
          {pkg.github && (
            <a
              href={pkg.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PackageCompare() {
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showByok, setShowByok] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nameA || !nameB || nameA === nameB) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const userKey = getGroqKey();
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userKey ? { "x-groq-api-key": userKey } : {}),
        },
        body: JSON.stringify({ packageA: nameA, packageB: nameB }),
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

  const POPULAR_MATCHUPS = [
    ["valibot", "ai (Vercel AI SDK)"],
    ["swr", "nuqs"],
    ["Hono", "Ky"],
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Package A
            </label>
            <select
              value={nameA}
              onChange={(e) => setNameA(e.target.value)}
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              disabled={loading}
            >
              <option value="">Select a package...</option>
              {packageNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <span className="text-sm font-bold text-zinc-400 dark:text-zinc-500 self-center py-2">
            vs
          </span>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Package B
            </label>
            <select
              value={nameB}
              onChange={(e) => setNameB(e.target.value)}
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              disabled={loading}
            >
              <option value="">Select a package...</option>
              {packageNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading || !nameA || !nameB || nameA === nameB}
            className="rounded-lg bg-zinc-900 dark:bg-zinc-100 px-5 py-2.5 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Comparing..." : "Compare"}
          </button>
        </div>
      </form>

      {!result && !loading && !error && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Popular matchups:
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_MATCHUPS.map(([a, b]) => (
              <button
                key={`${a}-${b}`}
                type="button"
                onClick={() => {
                  setNameA(a);
                  setNameB(b);
                }}
                className="rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                {a} vs {b}
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
        <div className="flex flex-col gap-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 italic border-l-2 border-zinc-300 dark:border-zinc-700 pl-3">
            {result.comparison.summary}
          </p>

          <div className="flex flex-col lg:flex-row gap-4">
            <PackageColumn
              pkg={result.packageA}
              side="A"
              strengths={result.comparison.packageA.strengths}
              weaknesses={result.comparison.packageA.weaknesses}
            />
            <PackageColumn
              pkg={result.packageB}
              side="B"
              strengths={result.comparison.packageB.strengths}
              weaknesses={result.comparison.packageB.weaknesses}
            />
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5 flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  Pick {result.packageA.name} when...
                </h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {result.comparison.pickA}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                  Pick {result.packageB.name} when...
                </h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {result.comparison.pickB}
                </p>
              </div>
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3">
              <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Verdict
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {result.comparison.verdict}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
