"use client";

import { useState } from "react";
import type { Package } from "@/lib/types";
import packagesData from "@/data/packages.json";

const packages = packagesData as Package[];
type SortKey = "name" | "stars" | "downloads" | "grade";

const GRADES = [
  { min: 80, grade: "A", bg: "rgba(39,166,68,0.15)", color: "#4ade80" },
  { min: 60, grade: "B", bg: "rgba(94,106,210,0.15)", color: "#818cf8" },
  { min: 40, grade: "C", bg: "rgba(234,179,8,0.12)", color: "#facc15" },
  { min: 0,  grade: "D", bg: "rgba(239,68,68,0.12)", color: "#f87171" },
];

function computeGrade(pkg: Package): { grade: string; bg: string; color: string; score: number } {
  let score = 0;
  if (pkg.githubStars) score += pkg.githubStars >= 10000 ? 30 : pkg.githubStars >= 5000 ? 25 : pkg.githubStars >= 1000 ? 20 : pkg.githubStars >= 100 ? 10 : 5;
  if (pkg.weeklyDownloads) score += pkg.weeklyDownloads >= 1000000 ? 30 : pkg.weeklyDownloads >= 100000 ? 25 : pkg.weeklyDownloads >= 10000 ? 20 : pkg.weeklyDownloads >= 1000 ? 10 : 5;
  if (pkg.lastUpdated) {
    const d = Math.floor((Date.now() - new Date(pkg.lastUpdated).getTime()) / 86400000);
    score += d <= 30 ? 20 : d <= 90 ? 15 : d <= 365 ? 10 : 5;
  }
  if (pkg.docs) score += 10;
  if (pkg.description) score += 10;
  const g = GRADES.find((x) => score >= x.min)!;
  return { grade: g.grade, bg: g.bg, color: g.color, score };
}

function fmt(n: number | undefined): string {
  if (n == null) return "—";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function daysAgo(date: string | undefined): string {
  if (!date) return "—";
  const d = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (d === 0) return "today";
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

export default function HealthDashboard() {
  const [sortBy, setSortBy] = useState<SortKey>("grade");
  const [filterCategory, setFilterCategory] = useState("all");
  const categories = ["all", ...new Set(packages.map((p) => p.category))];
  const graded = packages.map((pkg) => ({ pkg, ...computeGrade(pkg) }));
  const filtered = filterCategory === "all" ? graded : graded.filter((g) => g.pkg.category === filterCategory);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") return a.pkg.name.localeCompare(b.pkg.name);
    if (sortBy === "stars") return (b.pkg.githubStars ?? 0) - (a.pkg.githubStars ?? 0);
    if (sortBy === "downloads") return (b.pkg.weeklyDownloads ?? 0) - (a.pkg.weeklyDownloads ?? 0);
    return b.score - a.score;
  });

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {categories.map((cat) => {
            const active = filterCategory === cat;
            return (
              <button key={cat} onClick={() => setFilterCategory(cat)}
                className="rounded-full px-3 py-1 transition-colors"
                style={{ fontSize: 12, fontWeight: active ? 510 : 400, color: active ? "#f7f8f8" : "#8a8f98", background: active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >{cat === "all" ? "All" : cat}</button>
            );
          })}
        </div>
        <div className="flex items-center gap-1">
          <span style={{ fontSize: 12, color: "#62666d", marginRight: 4 }}>Sort:</span>
          {(["grade", "stars", "downloads", "name"] as SortKey[]).map((key) => {
            const active = sortBy === key;
            return (
              <button key={key} onClick={() => setSortBy(key)}
                className="rounded-md px-2 py-1 transition-colors"
                style={{ fontSize: 12, fontWeight: active ? 510 : 400, color: active ? "#f7f8f8" : "#62666d", background: active ? "rgba(255,255,255,0.06)" : "transparent" }}
              >{key.charAt(0).toUpperCase() + key.slice(1)}</button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Grade", "Package", "Stars", "Downloads/wk", "Last Updated"].map((h, i) => (
                <th key={h} className={i >= 2 ? "text-right" : ""} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 510, color: "#62666d", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(({ pkg, grade, bg, color }) => (
              <tr key={pkg.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <td style={{ padding: "12px 16px" }}>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md" style={{ fontSize: 12, fontWeight: 590, background: bg, color }}>{grade}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 13, fontWeight: 510, color: "#d0d6e0" }}>{pkg.name}</span>
                  <span style={{ fontSize: 11, color: "#62666d", marginLeft: 8 }}>{pkg.category}</span>
                </td>
                <td className="text-right font-mono" style={{ padding: "12px 16px", fontSize: 13, color: "#8a8f98" }}>{fmt(pkg.githubStars)}</td>
                <td className="text-right font-mono" style={{ padding: "12px 16px", fontSize: 13, color: "#8a8f98" }}>{fmt(pkg.weeklyDownloads)}</td>
                <td className="text-right" style={{ padding: "12px 16px", fontSize: 13, color: "#62666d" }}>{daysAgo(pkg.lastUpdated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
