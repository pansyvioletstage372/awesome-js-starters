import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Vite vs Webpack vs esbuild vs Turbopack vs Rollup — which bundler?",
  description:
    "A practical comparison of the major JavaScript bundlers. When to pick each, what each one is actually for, and why most of the decision has been made for you.",
};

type Row = {
  label: string;
  vite: string;
  webpack: string;
  esbuild: string;
  turbopack: string;
  rollup: string;
};

const rows: Row[] = [
  {
    label: "Primary use",
    vite: "Web apps",
    webpack: "Web apps (legacy)",
    esbuild: "Build primitive",
    turbopack: "Next.js dev/prod",
    rollup: "Libraries",
  },
  {
    label: "Core language",
    vite: "JS + esbuild/Rollup",
    webpack: "JavaScript",
    esbuild: "Go",
    turbopack: "Rust",
    rollup: "JavaScript",
  },
  {
    label: "Dev server speed",
    vite: "Instant (ESM)",
    webpack: "Slow at scale",
    esbuild: "Fast (no HMR)",
    turbopack: "Very fast",
    rollup: "N/A (no dev server)",
  },
  {
    label: "Config complexity",
    vite: "Low",
    webpack: "High",
    esbuild: "Low",
    turbopack: "None (framework)",
    rollup: "Medium",
  },
  {
    label: "Tree-shaking",
    vite: "Excellent (Rollup)",
    webpack: "Good",
    esbuild: "Good",
    turbopack: "Good",
    rollup: "Best-in-class",
  },
  {
    label: "Plugin ecosystem",
    vite: "Large, growing",
    webpack: "Huge (mature)",
    esbuild: "Small",
    turbopack: "Limited",
    rollup: "Large",
  },
  {
    label: "Source code output",
    vite: "ES modules",
    webpack: "Anything",
    esbuild: "ESM / CJS / IIFE",
    turbopack: "Framework-opaque",
    rollup: "ESM / CJS / UMD",
  },
  {
    label: "Best for",
    vite: "New SPAs, Vue, Svelte",
    webpack: "Existing codebases",
    esbuild: "Inside other tools",
    turbopack: "Next.js only",
    rollup: "npm libraries",
  },
];

export default function BundlersGuidePage() {
  return (
    <PageShell
      title="Vite vs Webpack vs esbuild vs Turbopack vs Rollup"
      description="Five tools, five jobs. Here's how the modern bundler landscape actually divides up — and the one-question test for picking yours."
    >
      <div className="flex flex-col gap-10">
        <section className="flex flex-col gap-3">
          <p className="text-[15px] leading-relaxed text-secondary-foreground">
            If you are building a new web app and a framework hasn't already
            chosen for you: use{" "}
            <strong className="font-[590] text-foreground">Vite</strong>. If
            you are publishing a library to npm: use{" "}
            <strong className="font-[590] text-foreground">Rollup</strong>{" "}
            (usually via <code className="rounded bg-white/5 px-1 py-0.5 font-mono text-[12px]">tsup</code>).
            If you maintain a Webpack codebase that works: leave it alone. Most
            of this page is explaining why.
          </p>
          <div className="rounded-lg border border-white/8 bg-white/2 p-4 text-[14px] leading-relaxed text-muted-foreground">
            These tools are not all competing for the same job. Vite is an
            app-dev experience; Rollup is a library packager; esbuild is a
            compiler primitive other tools embed; Turbopack is a Next.js
            implementation detail; Webpack is the incumbent most of them were
            built to replace. Pick by role first, benchmarks second.
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
                  <th className="px-3 py-2 font-[510]">Vite</th>
                  <th className="px-3 py-2 font-[510]">Webpack</th>
                  <th className="px-3 py-2 font-[510]">esbuild</th>
                  <th className="px-3 py-2 font-[510]">Turbopack</th>
                  <th className="px-3 py-2 font-[510]">Rollup</th>
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
                      {r.vite}
                    </td>
                    <td className="border-t border-white/5 px-3 py-2 text-muted-foreground">
                      {r.webpack}
                    </td>
                    <td className="border-t border-white/5 px-3 py-2 text-muted-foreground">
                      {r.esbuild}
                    </td>
                    <td className="border-t border-white/5 px-3 py-2 text-muted-foreground">
                      {r.turbopack}
                    </td>
                    <td className="border-t border-white/5 px-3 py-2 text-muted-foreground">
                      {r.rollup}
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

          <BundlerCard
            name="Vite"
            tagline="The default app bundler. Native ESM dev server, Rollup-powered prod build."
            use="New single-page apps. Vue, Svelte, Solid, and framework-free React projects. Anywhere you want a fast dev server with near-zero config."
            avoid="Publishing an npm library — Vite's library mode works but Rollup directly (or tsup) gives cleaner output. Next.js projects (they don't use Vite)."
            note="Vite is two bundlers stitched together: esbuild for dev transforms, Rollup for production bundling. Most 'Vite plugins' are Rollup plugins with extra hooks."
          />

          <BundlerCard
            name="Webpack"
            tagline="The incumbent. Powerful, complex, entrenched."
            use="Existing apps where migration cost outweighs the pain. Apps with heavy custom loader/plugin logic that has no equivalent yet. Legacy CRA ejections."
            avoid="New projects — there's almost no scenario in 2025 where starting on Webpack beats Vite or a framework's built-in bundler. Federation and module-level code-splitting are now supported elsewhere."
            note="Webpack 5 is stable and supported, not abandoned. 'Legacy' here means 'not the default for new work', not 'broken'. Most of the world's production JavaScript still ships through it."
          />

          <BundlerCard
            name="esbuild"
            tagline="A bundler written in Go. Fast enough to be a primitive."
            use="You need programmatic bundling inside another tool. You're bundling server-side code where dev ergonomics don't matter. You're building a CLI, lambda, or worker and want sub-second builds."
            avoid="As your only bundler for a serious client app. It lacks the plugin maturity and tree-shaking nuance of Rollup, and its HMR story is delegated to whatever wraps it."
            note="You are probably already using esbuild. Vite uses it. tsx uses it. tsup uses it. Deno uses it. Bun uses a fork. It is the water, not the fish."
          />

          <BundlerCard
            name="Turbopack"
            tagline="Next.js's Rust-based bundler. Not really a standalone product."
            use="You're using Next.js. That's the scenario. It became the default in Next 15+ and is the only tuned path forward in that ecosystem."
            avoid="Treating it as a general-purpose Webpack replacement — it isn't exposed that way yet. Do not try to adopt it outside Next.js in production."
            note="Turbopack is best understood as 'the bundler Next.js ships', not a tool you choose. If you're evaluating it, you're really evaluating Next.js."
          />

          <BundlerCard
            name="Rollup"
            tagline="The library bundler. Clean ESM output, best-in-class tree-shaking."
            use="Publishing packages to npm. Anywhere output shape matters — ESM + CJS dual builds, preserved module structure, or minimal wrapper code."
            avoid="Application development with a dev server requirement. Rollup produces builds, not dev experiences. Use Vite (which uses Rollup under the hood) for that."
            note="In practice, most people use Rollup through a wrapper: tsup, unbuild, or Vite's library mode. Direct Rollup configs are still common for complex libraries. Rolldown (Rust rewrite) is in progress and will eventually replace it inside Vite."
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-[20px] font-[590] tracking-tight text-foreground">
            The one-question test
          </h2>
          <div className="rounded-lg border border-white/8 bg-white/2 p-5">
            <p className="text-[15px] leading-relaxed text-secondary-foreground">
              <strong className="font-[590] text-foreground">
                What are you shipping?
              </strong>
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-[14px] leading-relaxed text-secondary-foreground">
              <li>
                <strong className="font-[590] text-foreground">A web app</strong> → Vite (or whatever your framework picked).
              </li>
              <li>
                <strong className="font-[590] text-foreground">A Next.js app</strong> → Turbopack (you don't choose).
              </li>
              <li>
                <strong className="font-[590] text-foreground">An npm library</strong> → Rollup via tsup.
              </li>
              <li>
                <strong className="font-[590] text-foreground">A CLI / server / worker</strong> → esbuild or tsup.
              </li>
              <li>
                <strong className="font-[590] text-foreground">An existing Webpack app</strong> → Webpack. Migrate only with a real reason.
              </li>
            </ul>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-[20px] font-[590] tracking-tight text-foreground">
            Things that trip people up
          </h2>
          <ul className="flex flex-col gap-3 text-[14px] leading-relaxed text-muted-foreground">
            <li>
              <strong className="font-[590] text-foreground">Benchmarking the wrong thing.</strong> Cold-start build
              speed matters less than HMR latency, which matters less than
              production bundle quality. A bundler that cold-builds in 50ms but
              ships 400KB of unused code is worse than one that takes 3s and
              ships 80KB.
            </li>
            <li>
              <strong className="font-[590] text-foreground">Library mode ≠ app mode.</strong> Don't ship an app
              bundler's output to npm. It will inline dependencies, mangle
              exports, and break tree-shaking in consumers. Libraries should
              externalize peer deps and emit readable ESM.
            </li>
            <li>
              <strong className="font-[590] text-foreground">Dual CJS/ESM is a trap.</strong> If you can, ship ESM-only.
              The dual-package hazard (two instances of the same module, one
              per format) is real and painful. tsup and unbuild handle it well
              when you must do both.
            </li>
            <li>
              <strong className="font-[590] text-foreground">Webpack migrations often aren't worth it.</strong> The ROI
              calculation rarely favors a rewrite for a working app. Migrate
              when dev-server speed is blocking productivity, not because Vite
              is fashionable.
            </li>
            <li>
              <strong className="font-[590] text-foreground">Rolldown is coming.</strong> The Vite team is replacing
              Rollup with a Rust rewrite (Rolldown). It will land in Vite
              transparently. You don't need to pick it — you'll just get
              faster prod builds.
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

function BundlerCard({
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
