import type { Metadata } from "next";
import HealthDashboard from "@/components/HealthDashboard";

export const metadata: Metadata = {
  title: "Package Health",
  description:
    "Health scores for every package in the catalog — stars, downloads, maintenance activity.",
};

export default function HealthPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-4xl flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Package health
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-xl">
            At-a-glance health scores for every package in the catalog.
            Stars, downloads, and maintenance activity — so you can trust what you install.
          </p>
        </div>

        <HealthDashboard />
      </div>
    </main>
  );
}
