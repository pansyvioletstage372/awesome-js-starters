import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "npm vs yarn vs pnpm vs bun — which package manager should you use?",
  description:
    "A practical comparison of npm, yarn, pnpm, and bun. When to pick each one, how they handle monorepos, disk usage, and lockfile behavior.",
};

type Row = {
  label: string;
  npm: string;
  yarn: string;
  pnpm: string;
  bun: string;
};

const rows: Row[] = [
  {
    label: "Install speed",
    npm: "Slow–moderate",
    yarn: "Fast",
    pnpm: "Very fast",
    bun: "Fastest",
  },
  {
    label: "Disk usage",
    npm: "High (duplicates)",
    yarn: "High (duplicates)",
    pnpm: "Low (hard links)",
    bun: "Low (hard links)",
  },
  {
    label: "Lockfile",
    npm: "package-lock.json",
    yarn: "yarn.lock",
    pnpm: "pnpm-lock.yaml",
    bun: "bun.lock",
  },
  {
    label: "node_modules layout",
    npm: "Flat (hoisted)",
    yarn: "Flat (hoisted)",
    pnpm: "Nested + symlinked",
    bun: "Flat (hoisted)",
  },
  {
    label: "Monorepo workspaces",
    npm: "Yes (basic)",
    yarn: "Yes (mature, w/ PnP)",
    pnpm: "Yes (best-in-class)",
    bun: "Yes (improving)",
  },
  {
    label: "Strict peer deps",
    npm: "Warns",
    yarn: "Warns",
    pnpm: "Enforces",
    bun: "Warns",
  },
  {
    label: "Bundled runtime",
    npm: "Node only",
    yarn: "Node only",
    pnpm: "Node only",
    bun: "Bun runtime",
  },
  {
    label: "Ships with Node.js",
    npm: "Yes",
    yarn: "No (corepack)",
    pnpm: "No (corepack)",
    bun: "No (separate)",
  },
];

export default function PackageManagersGuidePage() {
  return (
    <PageShell
      title="npm vs yarn vs pnpm vs bun"
      description="Four package managers, four philosophies. Here's how to pick one without agonizing — and when the choice actually matters."
    >
      <div className="flex flex-col gap-10">
        <section className="flex flex-col gap-3">
          <p className="text-[15px] leading-relaxed text-secondary-foreground">
            If you are starting a new project and do not want to think about
            this: use <strong className="font-[590] text-foreground">pnpm</strong>.
            It is fast, disk-efficient, strict about dependencies, and behaves
            predictably in monorepos. Everything else on this page is the longer
            answer.
          </p>
          <div className="rounded-lg border border-white/8 bg-white/2 p-4 text-[14px] leading-relaxed text-muted-foreground">
            The choice matters less than the internet claims. All four install
            the same packages from the same registry. The differences are disk
            usage, install speed, how strict they are about dependency
            declarations, and how they handle workspaces. Pick one per repo and
            commit the lockfile.
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-[20px] font-[590] tracking-tight text-foreground">
            At a glance
          </h2>
          <div className="overflow-x-auto rounded-lg border border-white/8">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-white/3 text-left text-muted-foreground">
                  <th className="px-3 py-2 font-[510]">&nbsp;</th>
                  <th className="px-3 py-2 font-[510]">npm</th>
                  <th className="px-3 py-2 font-[510]">yarn</th>
                  <th className="px-3 py-2 font-[510]">pnpm</th>
                  <th className="px-3 py-2 font-[510]">bun</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={r.label}
                    className={
                      i % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"
                    }
                  >
                    <td className="border-t border-white/5 px-3 py-2 font-[510] text-secondary-foreground">
                      {r.label}
                    </td>
                    <td className="border-t border-white/5 px-3 py-2 text-muted-foreground">
                      {r.npm}
                    </td>
                    <td className="border-t border-white/5 px-3 py-2 text-muted-foreground">
                      {r.yarn}
                    </td>
                    <td className="border-t border-white/5 px-3 py-2 text-muted-foreground">
                      {r.pnpm}
                    </td>
                    <td className="border-t border-white/5 px-3 py-2 text-muted-foreground">
                      {r.bun}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-[20px] font-[590] tracking-tight text-foreground">
            When to choose which
          </h2>

          <PMCard
            name="npm"
            tagline="The default. Ships with Node.js."
            use="Tutorials, small projects, CI where you want zero setup, or when a hosted environment only supports npm."
            avoid="Large monorepos (workspaces work but are less ergonomic) and disk-constrained CI where you need every second back."
            note="npm has closed most of the historical speed gap. For a single-package repo in 2025, the install-time difference is often invisible."
          />

          <PMCard
            name="yarn"
            tagline="The 'modern alternative' that spawned this whole category."
            use="Teams already on Yarn Classic (1.x) that do not want to migrate, or projects that benefit from Yarn Berry's Plug'n'Play (no node_modules at all)."
            avoid="New projects with no history. There is no compelling reason to start on yarn in 2025 unless your org standardizes on it."
            note="Yarn 1.x (Classic) is effectively frozen. Yarn 2+ (Berry) is a different product — powerful but opinionated, and PnP breaks tools that scan node_modules."
          />

          <PMCard
            name="pnpm"
            tagline="Content-addressable store + symlinks. The dependency-hygiene default."
            use="Monorepos. Any project where you want strict peer dependency enforcement. CI/CD on limited disk. Anywhere install speed matters across many projects."
            avoid="Environments that can't follow symlinks (rare; some legacy build tools). Tools that assume a flat node_modules with hoisted phantom dependencies."
            note="The strictness is a feature. pnpm will surface packages you imported without declaring — npm/yarn silently let these work until they don't."
          />

          <PMCard
            name="bun"
            tagline="Runtime + package manager + bundler + test runner."
            use="Install speed is the top priority. You're already using Bun as a runtime. Simple scripts where the 'all-in-one' ergonomics pay off."
            avoid="Production apps that rely on Node-specific behavior you have not verified under Bun. Anything where you need boring, battle-tested install semantics."
            note="As a pure package manager for Node projects, `bun install` is the fastest option available. That alone is a reasonable reason to use it in CI."
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-[20px] font-[590] tracking-tight text-foreground">
            Common commands
          </h2>
          <div className="overflow-x-auto rounded-lg border border-white/8">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-white/3 text-left text-muted-foreground">
                  <th className="px-3 py-2 font-[510]">Task</th>
                  <th className="px-3 py-2 font-[510]">npm</th>
                  <th className="px-3 py-2 font-[510]">yarn</th>
                  <th className="px-3 py-2 font-[510]">pnpm</th>
                  <th className="px-3 py-2 font-[510]">bun</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Install all deps", "npm install", "yarn", "pnpm install", "bun install"],
                  ["Add a dep", "npm i foo", "yarn add foo", "pnpm add foo", "bun add foo"],
                  ["Add dev dep", "npm i -D foo", "yarn add -D foo", "pnpm add -D foo", "bun add -d foo"],
                  ["Remove a dep", "npm uninstall foo", "yarn remove foo", "pnpm remove foo", "bun remove foo"],
                  ["Run a script", "npm run build", "yarn build", "pnpm build", "bun run build"],
                  ["Run binary", "npx cmd", "yarn dlx cmd", "pnpm dlx cmd", "bunx cmd"],
                  ["Upgrade", "npm update", "yarn up", "pnpm update", "bun update"],
                ].map((row, i) => (
                  <tr
                    key={row[0]}
                    className={
                      i % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"
                    }
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={
                          "border-t border-white/5 px-3 py-2 " +
                          (j === 0
                            ? "font-[510] text-secondary-foreground"
                            : "font-mono text-muted-foreground")
                        }
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-[20px] font-[590] tracking-tight text-foreground">
            Monorepos
          </h2>
          <p className="text-[15px] leading-relaxed text-secondary-foreground">
            Every package manager now supports workspaces, but the experience
            varies. For anything with more than 3–4 packages, pnpm is the
            path-of-least-regret. Its symlinked layout cleanly isolates each
            workspace's dependencies and its filter syntax (<code className="rounded bg-white/5 px-1 py-0.5 font-mono text-[12px]">pnpm --filter web build</code>)
            is ergonomic. Yarn Berry with workspaces is powerful but introduces
            PnP complications. npm workspaces work fine for small setups but
            hoisting quirks surface at scale. Bun workspaces are functional but
            still maturing — fine for side projects, cautious for production.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-[20px] font-[590] tracking-tight text-foreground">
            A decision shortcut
          </h2>
          <ul className="flex flex-col gap-2 text-[15px] leading-relaxed text-secondary-foreground">
            <li>
              <strong className="font-[590] text-foreground">Starting fresh, solo or small team?</strong> Use pnpm.
            </li>
            <li>
              <strong className="font-[590] text-foreground">Monorepo with multiple packages?</strong> Use pnpm.
            </li>
            <li>
              <strong className="font-[590] text-foreground">Tutorial, demo, or one-off script?</strong> Use npm.
            </li>
            <li>
              <strong className="font-[590] text-foreground">Install speed is the bottleneck?</strong> Use bun.
            </li>
            <li>
              <strong className="font-[590] text-foreground">Already on yarn?</strong> Stay on yarn until there is a concrete reason to migrate.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-[20px] font-[590] tracking-tight text-foreground">
            Things that trip people up
          </h2>
          <ul className="flex flex-col gap-3 text-[14px] leading-relaxed text-muted-foreground">
            <li>
              <strong className="font-[590] text-foreground">Mixing managers in one repo.</strong> Don't.
              Pick one, commit its lockfile, and add the others to
              <code className="mx-1 rounded bg-white/5 px-1 py-0.5 font-mono text-[12px]">.gitignore</code>
              or a pre-commit check. Mixed lockfiles silently produce different trees.
            </li>
            <li>
              <strong className="font-[590] text-foreground">Phantom dependencies.</strong> On npm/yarn, hoisting lets you
              import a package you never declared. It works until it doesn't.
              pnpm refuses to allow this by default — which is why switching to
              it often surfaces bugs that were always there.
            </li>
            <li>
              <strong className="font-[590] text-foreground">Corepack.</strong> Node.js ships with a tool called
              <code className="mx-1 rounded bg-white/5 px-1 py-0.5 font-mono text-[12px]">corepack</code>
              that pins a specific yarn/pnpm version per project via the
              <code className="mx-1 rounded bg-white/5 px-1 py-0.5 font-mono text-[12px]">packageManager</code>
              field in package.json. This is the recommended way to lock the
              manager version across contributors.
            </li>
            <li>
              <strong className="font-[590] text-foreground">CI caching.</strong> All four support lockfile-based cache
              keys in GitHub Actions and most CI systems. If installs are slow
              in CI, cache the store (not
              <code className="mx-1 rounded bg-white/5 px-1 py-0.5 font-mono text-[12px]">node_modules</code>).
            </li>
          </ul>
        </section>

        <div className="rounded-lg border border-white/8 bg-white/2 p-4">
          <Link
            href="/guides"
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← All guides
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

function PMCard({
  name,
  tagline,
  use,
  avoid,
  note,
}: {
  name: string;
  tagline: string;
  use: string;
  avoid: string;
  note: string;
}) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/2 p-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-mono text-[15px] font-[590] text-foreground">
            {name}
          </h3>
          <p className="text-[13px] text-muted-foreground">{tagline}</p>
        </div>
        <dl className="flex flex-col gap-2 text-[14px] leading-relaxed">
          <div className="flex flex-col gap-0.5">
            <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Use when
            </dt>
            <dd className="text-secondary-foreground">{use}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Avoid when
            </dt>
            <dd className="text-secondary-foreground">{avoid}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Note
            </dt>
            <dd className="text-muted-foreground">{note}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
