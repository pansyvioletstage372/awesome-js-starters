"use client";

import { useState } from "react";
import type { Package } from "@/lib/types";
import packagesData from "@/data/packages.json";

const packages = packagesData as Package[];

type SortKey = "name" | "stars" | "downloads" | "grade";

function computeGrade(pkg: Package): { grade: string; color: string; score: number } {
  let score = 0;

  // Stars scoring (max 30)
  if (pkg.githubStars) {
    if (pkg.githubStars >= 10000) score += 30;
    else if (pkg.githubStars >= 5000) score += 25;
    else if (pkg.githubStars >= 1000) score += 20;
    else if (pkg.githubStars >= 100) score += 10;
    else score += 5;
  }

  // Downloads scoring (max 30)
  if (pkg.weeklyDownloads) {
    if (pkg.weeklyDownloads >= 1000000) score += 30;
    else if (pkg.weeklyDownloads >= 100000) score += 25;
    else if (pkg.weeklyDownloads >= 10000) score += 20;
    else if (pkg.weeklyDownloads >= 1000) score += 10;
    else score += 5;
  }

  // Freshness scoring (max 20)
  if (pkg.lastUpdated) {
    const daysAgo = Math.floor(
      (Date.now() - new Date(pkg.lastUpdated).getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysAgo <= 30) score += 20;
    else if (daysAgo <= 90) score += 15;
    else if (daysAgo <= 365) score += 10;
    else score += 5;
  }

  // Has docs (10)
  if (pkg.docs) score += 10;

  // Has description (10)
  if (pkg.description) score += 10;

  if (score >= 80) return { grade: "A", color: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40", score };
  if (score >= 60) return { grade: "B", color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40", score };
  if (score >= 40) return { grade: "C", color: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/40", score };
  return { grade: "D", color: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40", score };
}

function formatNum(n: number | undefined): string {
  if (n == null) return "-";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function daysAgo(date: string | undefined): string {
  if (!date) return "-";
  const d = Math.floor(
    (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (d === 0) return "today";
  if (d === 1) return "1 day ago";
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

export default function HealthDashboard() {
  const [sortBy, setSortBy] = useState<SortKey>("grade");
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = ["all", ...new Set(packages.map((p) => p.category))];

  const graded = packages.map((pkg) => ({
    pkg,
    ...computeGrade(pkg),
  }));

  const filtered =
    filterCategory === "all"
      ? graded
      : graded.filter((g) => g.pkg.category === filterCategory);

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.pkg.name.localeCompare(b.pkg.name);
      case "stars":
        return (b.pkg.githubStars ?? 0) - (a.pkg.githubStars ?? 0);
      case "downloads":
        return (b.pkg.weeklyDownloads ?? 0) - (a.pkg.weeklyDownloads ?? 0);
      case "grade":
        return b.score - a.score;
      default:
        return 0;
    }
  });

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filterCategory === cat
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
        <div className="flex gap-1 text-xs">
          <span className="text-zinc-500 dark:text-zinc-400 self-center mr-1">
            Sort:
          </span>
          {(["grade", "stars", "downloads", "name"] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`rounded-md px-2 py-1 font-medium transition-colors ${
                sortBy === key
                  ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left">
              <th className="pb-2 font-medium text-zinc-500 dark:text-zinc-400">
                Grade
              </th>
              <th className="pb-2 font-medium text-zinc-500 dark:text-zinc-400">
                Package
              </th>
              <th className="pb-2 font-medium text-zinc-500 dark:text-zinc-400 text-right">
                Stars
              </th>
              <th className="pb-2 font-medium text-zinc-500 dark:text-zinc-400 text-right">
                Downloads/wk
              </th>
              <th className="pb-2 font-medium text-zinc-500 dark:text-zinc-400 text-right">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(({ pkg, grade, color }) => (
              <tr
                key={pkg.name}
                className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              >
                <td className="py-3 pr-3">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ${color}`}
                  >
                    {grade}
                  </span>
                </td>
                <td className="py-3">
                  <div>
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      {pkg.name}
                    </span>
                    <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-500">
                      {pkg.category}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-right font-mono text-zinc-700 dark:text-zinc-300">
                  {formatNum(pkg.githubStars)}
                </td>
                <td className="py-3 text-right font-mono text-zinc-700 dark:text-zinc-300">
                  {formatNum(pkg.weeklyDownloads)}
                </td>
                <td className="py-3 text-right text-zinc-500 dark:text-zinc-400">
                  {daysAgo(pkg.lastUpdated)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
