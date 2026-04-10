import type { Metadata } from "next";
import PackageAnalyzer from "@/components/PackageAnalyzer";

export const metadata: Metadata = {
  title: "Analyze Your Stack",
  description:
    "Paste your package.json and get AI-powered recommendations for packages that fill gaps in your current stack.",
};

export default function AnalyzePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-4xl flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Analyze your stack
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-xl">
            Paste your <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">package.json</code> and
            we&apos;ll find packages from our catalog that fill gaps in your
            current setup.
          </p>
        </div>

        <PackageAnalyzer />
      </div>
    </main>
  );
}
