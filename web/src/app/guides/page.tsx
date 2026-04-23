import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Opinionated guides for picking JavaScript tooling — package managers, bundlers, runtimes, and more.",
};

const guides = [
  {
    href: "/guides/package-managers",
    title: "npm vs yarn vs pnpm vs bun",
    blurb:
      "Four package managers, four philosophies. When to pick each one, what breaks in monorepos, and why disk usage matters.",
    tags: ["tooling", "package managers"],
  },
];

export default function GuidesIndexPage() {
  return (
    <PageShell
      title="Guides"
      description="Opinionated walkthroughs for the tooling decisions that actually matter — written so you can skim and decide, not memorize."
    >
      <div className="flex flex-col gap-3">
        {guides.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="group rounded-lg border border-white/8 bg-white/2 p-5 transition-colors hover:border-white/12 hover:bg-white/4"
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-[17px] font-[590] tracking-tight text-foreground">
                {g.title}
              </h2>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                {g.blurb}
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {g.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/8 px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
