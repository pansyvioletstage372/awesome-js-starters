import type { Metadata } from "next";
import PackageCompare from "@/components/PackageCompare";

export const metadata: Metadata = {
  title: "Compare Packages",
  description:
    "Head-to-head comparison of npm packages — strengths, weaknesses, and when to pick which.",
};

export default function ComparePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-4xl flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Compare packages
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-xl">
            Pick two packages and get an AI-powered head-to-head breakdown — strengths,
            weaknesses, and when to use which.
          </p>
        </div>

        <PackageCompare />
      </div>
    </main>
  );
}
