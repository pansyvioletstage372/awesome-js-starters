import type { Metadata } from "next";
import MigrateFrom from "@/components/MigrateFrom";

export const metadata: Metadata = {
  title: "Migrate From",
  description:
    "Find modern alternatives to outdated npm packages with migration guides and code comparisons.",
};

export default function MigratePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-4xl flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Migrate from X
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-xl">
            Want to replace an outdated package? Tell us what you&apos;re
            migrating from and get modern alternatives with difficulty ratings
            and code comparisons.
          </p>
        </div>

        <MigrateFrom />
      </div>
    </main>
  );
}
