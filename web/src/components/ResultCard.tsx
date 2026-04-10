import type { EnrichedResult } from "@/lib/types";

const CATEGORY_COLORS: Record<string, string> = {
  react: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  node: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "general-js":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
};

const CATEGORY_LABELS: Record<string, string> = {
  react: "React",
  node: "Node.js",
  "general-js": "General JS",
  angular: "Angular",
  vue: "Vue",
  express: "posts",
  fastify: "Fastify",
};

interface Props {
  result: EnrichedResult;
}

export default function ResultCard({ result }: Props) {
  const colorClass =
    CATEGORY_COLORS[result.category] ??
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
  const categoryLabel = CATEGORY_LABELS[result.category] ?? result.category;

  const repoUrl = `https://github.com/farhan523/awesome-js-starters/tree/main/${result.repoPath}`;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {result.name}
        </h2>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
        >
          {categoryLabel}
        </span>
      </div>

      {result.description && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {result.description}
        </p>
      )}

      {(result.githubStars || result.weeklyDownloads || result.lastUpdated) && (
        <div className="flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          {result.githubStars != null && (
            <span title="GitHub stars">
              {"★ "}
              {result.githubStars >= 1000
                ? `${(result.githubStars / 1000).toFixed(1)}k`
                : result.githubStars}
            </span>
          )}
          {result.weeklyDownloads != null && (
            <span title="Weekly npm downloads">
              {"↓ "}
              {result.weeklyDownloads >= 1000000
                ? `${(result.weeklyDownloads / 1000000).toFixed(1)}M/wk`
                : result.weeklyDownloads >= 1000
                  ? `${(result.weeklyDownloads / 1000).toFixed(1)}k/wk`
                  : `${result.weeklyDownloads}/wk`}
            </span>
          )}
          {result.lastUpdated && (
            <span title="Last updated">
              {"⟳ "}
              {new Date(result.lastUpdated).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      )}

      <p className="text-sm italic text-zinc-500 dark:text-zinc-400 border-l-2 border-zinc-300 dark:border-zinc-700 pl-3">
        {result.reason}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        {result.npm && (
          <a
            href={result.npm}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            npm
          </a>
        )}
        {result.github && (
          <a
            href={result.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            GitHub
          </a>
        )}
        {result.docs && (
          <a
            href={result.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Docs
          </a>
        )}
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-zinc-900 dark:bg-zinc-100 px-3 py-1 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
        >
          View in repo →
        </a>
      </div>
    </div>
  );
}
