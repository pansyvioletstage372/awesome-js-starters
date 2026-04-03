import SearchBox from "@/components/SearchBox";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-4xl flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Find the right npm package
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-xl">
            Describe what you&apos;re trying to build and we&apos;ll recommend
            community-curated packages from our catalog — not just tags.
          </p>
        </div>

        <SearchBox />

        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Found a package others should know about?
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              If you&apos;ve shipped a great npm package or discovered one that
              saved you hours — add it to the catalog so others can find it too.
            </p>
          </div>
          <a
            href="https://github.com/farhan523/awesome-js-starters/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Submit a package →
          </a>
        </div>

        <footer className="text-xs text-zinc-400 dark:text-zinc-600 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          Powered by{" "}
          <a
            href="https://github.com/farhan523/awesome-js-starters"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zinc-600 dark:hover:text-zinc-400"
          >
            awesome-js-starters
          </a>{" "}
          · AI suggestions via Groq + Llama 3
        </footer>
      </div>
    </main>
  );
}
