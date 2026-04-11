"use client";

import type { Package } from "@/lib/types";
import packagesData from "@/data/packages.json";

const packages = packagesData as Package[];

type Freshness = "hot" | "warm" | "stable" | "stale";

const FRESHNESS: Record<Freshness, { label: string; bg: string; color: string; bar: string }> = {
  hot:    { label: "Hot",     bg: "rgba(239,68,68,0.12)",   color: "#f87171", bar: "#ef4444" },
  warm:   { label: "Active",  bg: "rgba(249,115,22,0.12)",  color: "#fb923c", bar: "#f97316" },
  stable: { label: "Stable",  bg: "rgba(94,106,210,0.12)",  color: "#818cf8", bar: "#5e6ad2" },
  stale:  { label: "Dormant", bg: "rgba(255,255,255,0.05)", color: "#62666d", bar: "#3e3e44" },
};

function getFreshness(pkg: Package): Freshness {
  if (!pkg.lastUpdated) return "stable";
  const d = Math.floor((Date.now() - new Date(pkg.lastUpdated).getTime()) / 86400000);
  if (d <= 7) return "hot";
  if (d <= 30) return "warm";
  if (d <= 180) return "stable";
  return "stale";
}

function fmt(n: number | undefined): string {
  if (n == null) return "-";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function TrendingStars() {
  const ranked = packages
    .filter((p) => p.weeklyDownloads && p.githubStars)
    .map((pkg) => ({
      pkg,
      momentum: (pkg.weeklyDownloads ?? 0) / (pkg.githubStars ?? 1),
      freshness: getFreshness(pkg),
    }))
    .sort((a, b) => b.momentum - a.momentum);

  const maxMomentum = ranked[0]?.momentum ?? 1;

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Explanation */}
      <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <span style={{ fontSize: 13, fontWeight: 510, color: "#d0d6e0" }}>How momentum works: </span>
        <span style={{ fontSize: 13, color: "#8a8f98" }}>
          Momentum = weekly downloads ÷ GitHub stars. A high score means real-world traction relative to awareness — the hidden gem signal.
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        {ranked.map((item, i) => {
          const f = FRESHNESS[item.freshness];
          const barWidth = (item.momentum / maxMomentum) * 100;
          return (
            <div key={item.pkg.name} className="rounded-xl p-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono shrink-0 w-6 text-right" style={{ fontSize: 12, color: "#62666d" }}>{i + 1}</span>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 510, color: "#d0d6e0", letterSpacing: "-0.13px" }}>{item.pkg.name}</h3>
                    <span style={{ fontSize: 11, color: "#62666d" }}>{item.pkg.category}</span>
                  </div>
                </div>
                <span className="rounded-full px-2.5 py-0.5 shrink-0" style={{ fontSize: 11, fontWeight: 510, background: f.bg, color: f.color }}>{f.label}</span>
              </div>

              {/* Momentum bar */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${barWidth}%`, background: f.bar }} />
                </div>
                <span className="font-mono w-14 text-right" style={{ fontSize: 11, color: "#62666d" }}>{item.momentum.toFixed(1)}x</span>
              </div>

              <div className="flex gap-4" style={{ fontSize: 12, color: "#62666d" }}>
                <span>★ {fmt(item.pkg.githubStars)}</span>
                <span>↓ {fmt(item.pkg.weeklyDownloads)}/wk</span>
                {item.pkg.lastUpdated && (
                  <span>Updated {new Date(item.pkg.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {ranked.length === 0 && (
        <p style={{ fontSize: 13, fontStyle: "italic", color: "#62666d", textAlign: "center", padding: "32px 0" }}>
          No packages with both download and star data. Run the build with --fetch-metadata.
        </p>
      )}
    </div>
  );
}
