import type { Metadata } from "next";
import StackBuilder from "@/components/StackBuilder";

export const metadata: Metadata = {
  title: "Stack Builder",
  description:
    "Pick a project type and get a curated package stack — like pcpartpicker but for npm.",
};

export default function StackBuilderPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-4xl flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Build your stack
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-xl">
            Pick what you&apos;re building and get a curated set of packages
            that work well together — with install commands and tips.
          </p>
        </div>

        <StackBuilder />
      </div>
    </main>
  );
}
