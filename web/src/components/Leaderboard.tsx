"use client";

import type { Package } from "@/lib/types";
import packagesData from "@/data/packages.json";

const packages = packagesData as Package[];

interface Contributor { username: string; packages: Package[]; }

function buildLeaderboard(): Contributor[] {
  const map = new Map<string, Package[]>();
  for (const pkg of packages) {
    if (!pkg.submittedBy) continue;
    const existing = map.get(pkg.submittedBy) ?? [];
    existing.push(pkg);
    map.set(pkg.submittedBy, existing);
  }
  return Array.from(map.entries())
    .map(([username, pkgs]) => ({ username, packages: pkgs }))
    .sort((a, b) => b.packages.length - a.packages.length);
}

const RANK_STYLE: Record<number, { bg: string; color: string }> = {
  0: { bg: "rgba(234,179,8,0.15)",   color: "#facc15" },
  1: { bg: "rgba(255,255,255,0.08)", color: "#d0d6e0" },
  2: { bg: "rgba(249,115,22,0.12)",  color: "#fb923c" },
};

const uniqueCategories = [...new Set(packages.map((p) => p.category))].length;

export default function Leaderboard() {
  const contributors = buildLeaderboard();

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: packages.length, label: "Packages" },
          { value: contributors.length, label: "Contributors" },
          { value: uniqueCategories, label: "Categories" },
        ].map(({ value, label }) => (
          <div key={label} className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 24, fontWeight: 590, color: "#f7f8f8", letterSpacing: "-0.704px" }}>{value}</div>
            <div style={{ fontSize: 12, color: "#62666d", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {contributors.length === 0 ? (
        <p style={{ fontSize: 13, fontStyle: "italic", color: "#62666d", textAlign: "center", padding: "32px 0" }}>
          No contributors attributed yet. Add your GitHub handle to the &quot;Submitted by&quot; section of your README.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {contributors.map((c, rank) => {
            const rs = RANK_STYLE[rank] ?? { bg: "rgba(255,255,255,0.03)", color: "#62666d" };
            return (
              <div key={c.username} className="flex items-center gap-4 rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ background: rs.bg, fontSize: 13, fontWeight: 590, color: rs.color }}>
                  #{rank + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <img src={`https://github.com/${c.username}.png?size=32`} alt={c.username}
                      className="h-7 w-7 rounded-full" loading="lazy" />
                    <a href={`https://github.com/${c.username}`} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 14, fontWeight: 510, color: "#d0d6e0", letterSpacing: "-0.13px" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#f7f8f8"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#d0d6e0"; }}
                    >@{c.username}</a>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {c.packages.map((pkg) => (
                      <span key={pkg.name} className="rounded-full"
                        style={{ fontSize: 11, fontWeight: 510, color: "#8a8f98", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", padding: "1px 8px" }}>
                        {pkg.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div style={{ fontSize: 20, fontWeight: 590, color: "#f7f8f8", letterSpacing: "-0.704px" }}>{c.packages.length}</div>
                  <div style={{ fontSize: 11, color: "#62666d" }}>{c.packages.length === 1 ? "package" : "packages"}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-xl p-5 text-center" style={{ border: "1px dashed rgba(255,255,255,0.08)" }}>
        <p style={{ fontSize: 13, color: "#62666d", marginBottom: 10 }}>Want to see your name here?</p>
        <a href="https://github.com/farhan523/awesome-js-starters/blob/main/CONTRIBUTING.md"
          target="_blank" rel="noopener noreferrer"
          className="inline-block rounded-md px-4 py-2 transition-colors"
          style={{ fontSize: 13, fontWeight: 510, color: "#d0d6e0", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
          Submit a package →
        </a>
      </div>
    </div>
  );
}
