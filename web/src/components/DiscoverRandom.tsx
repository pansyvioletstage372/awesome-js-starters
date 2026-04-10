"use client";

import { useState } from "react";
import type { Package } from "@/lib/types";
import packagesData from "@/data/packages.json";

const packages = packagesData as Package[];

const CATEGORY_COLORS: Record<string, string> = {
  react: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  node: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "general-js":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
};

export default function DiscoverRandom() {
  const [pkg, setPkg] = useState<Package | null>(null);
  const [spinning, setSpinning] = useState(false);

  function discover() {
    setSpinning(true);
    // Cycle through a few random packages for a slot-machine effect
    let count = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * packages.length);
      setPkg(packages[randomIdx]);
      count++;
      if (count >= 8) {
        clearInterval(interval);
        setSpinning(false);
      }
    }, 100);
  }

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <button
        type="button"
        onClick={discover}
        disabled={spinning}
        className={`relative rounded-full h-40 w-40 flex items-center justify-center text-6xl border-4 transition-all duration-300 ${
          spinning
            ? "border-zinc-400 dark:border-zinc-600 animate-pulse scale-95"
            : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 hover:scale-105 hover:shadow-lg cursor-pointer"
        }`}
      >
        <span className={spinning ? "animate-spin" : ""}>
          {spinning ? "🎰" : "🎲"}
        </span>
      </button>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {spinning
          ? "Shuffling..."
          : pkg
            ? "Click again to discover another gem"
            : "Click to discover a random package"}
      </p>

      {pkg && !spinning && (
        <div className="w-full max-w-lg rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-md transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {pkg.name}
            </h2>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                CATEGORY_COLORS[pkg.category] ??
                "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {pkg.category}
            </span>
          </div>

          {pkg.description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              {pkg.description}
            </p>
          )}

          {(pkg.githubStars || pkg.weeklyDownloads) && (
            <div className="flex gap-4 mb-4 text-xs text-zinc-500 dark:text-zinc-400">
              {pkg.githubStars != null && (
                <span>
                  {"★ "}
                  {pkg.githubStars >= 1000
                    ? `${(pkg.githubStars / 1000).toFixed(1)}k`
                    : pkg.githubStars}{" "}
                  stars
                </span>
              )}
              {pkg.weeklyDownloads != null && (
                <span>
                  {"↓ "}
                  {pkg.weeklyDownloads >= 1000000
                    ? `${(pkg.weeklyDownloads / 1000000).toFixed(1)}M`
                    : pkg.weeklyDownloads >= 1000
                      ? `${(pkg.weeklyDownloads / 1000).toFixed(1)}k`
                      : pkg.weeklyDownloads}
                  /wk
                </span>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {pkg.npm && (
              <a
                href={pkg.npm}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                npm
              </a>
            )}
            {pkg.github && (
              <a
                href={pkg.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                GitHub
              </a>
            )}
            {pkg.docs && (
              <a
                href={pkg.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Docs
              </a>
            )}
            <a
              href={`https://github.com/farhan523/awesome-js-starters/tree/main/${pkg.repoPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-zinc-900 dark:bg-zinc-100 px-3 py-1.5 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
            >
              View in repo →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
