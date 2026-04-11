"use client";

import { useState, useRef, useEffect } from "react";
import type { Package } from "@/lib/types";
import packagesData from "@/data/packages.json";

const packages = packagesData as Package[];

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; x: number; y: number }> = {
  react:        { color: "#60a5fa", bg: "rgba(59,130,246,0.08)",  x: 0.25, y: 0.3 },
  node:         { color: "#4ade80", bg: "rgba(34,197,94,0.08)",   x: 0.75, y: 0.3 },
  "general-js": { color: "#facc15", bg: "rgba(234,179,8,0.08)",   x: 0.5,  y: 0.65 },
  angular:      { color: "#f87171", bg: "rgba(239,68,68,0.08)",   x: 0.15, y: 0.7 },
  vue:          { color: "#34d399", bg: "rgba(16,185,129,0.08)",  x: 0.85, y: 0.7 },
  express:      { color: "#a78bfa", bg: "rgba(139,92,246,0.08)",  x: 0.3,  y: 0.85 },
  fastify:      { color: "#fb923c", bg: "rgba(249,115,22,0.08)",  x: 0.7,  y: 0.85 },
};

interface Node { pkg: Package; x: number; y: number; radius: number; color: string; }

function buildNodes(width: number, height: number): Node[] {
  const nodes: Node[] = [];
  const groups: Record<string, Package[]> = {};
  for (const pkg of packages) {
    if (!groups[pkg.category]) groups[pkg.category] = [];
    groups[pkg.category].push(pkg);
  }
  for (const [category, pkgs] of Object.entries(groups)) {
    const config = CATEGORY_CONFIG[category] ?? { color: "#62666d", bg: "rgba(255,255,255,0.04)", x: 0.5, y: 0.5 };
    const cx = config.x * width;
    const cy = config.y * height;
    pkgs.forEach((pkg, i) => {
      const angle = (i / pkgs.length) * Math.PI * 2;
      const spread = 40 + pkgs.length * 12;
      const downloads = pkg.weeklyDownloads ?? 0;
      let radius = 18;
      if (downloads >= 1000000) radius = 34;
      else if (downloads >= 100000) radius = 28;
      else if (downloads >= 10000) radius = 22;
      nodes.push({ pkg, x: cx + Math.cos(angle) * spread, y: cy + Math.sin(angle) * spread, radius, color: config.color });
    });
  }
  return nodes;
}

export default function EcosystemMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [selected, setSelected] = useState<Package | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setDimensions({ width: w, height: Math.max(400, w * 0.6) });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const nodes = buildNodes(dimensions.width, dimensions.height);
  const categories = Object.entries(CATEGORY_CONFIG).filter(([cat]) => packages.some((p) => p.category === cat));

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map(([cat, config]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: config.color }} />
            <span style={{ fontSize: 12, color: "#8a8f98" }}>{cat}</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div ref={containerRef} className="relative rounded-xl overflow-hidden"
        style={{ height: dimensions.height, background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <svg width={dimensions.width} height={dimensions.height} className="absolute inset-0">
          {/* Cluster halos */}
          {categories.map(([cat, config]) => {
            const catNodes = nodes.filter((n) => n.pkg.category === cat);
            if (!catNodes.length) return null;
            const cx = catNodes.reduce((s, n) => s + n.x, 0) / catNodes.length;
            const cy = catNodes.reduce((s, n) => s + n.y, 0) / catNodes.length;
            const maxDist = Math.max(...catNodes.map((n) => Math.sqrt((n.x - cx) ** 2 + (n.y - cy) ** 2)));
            return (
              <circle key={cat} cx={cx} cy={cy} r={maxDist + 60}
                fill={config.bg} stroke={config.color} strokeWidth={0.5} strokeOpacity={0.25} />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isHovered = hovered === node.pkg.name;
            const isSelected = selected?.name === node.pkg.name;
            return (
              <g key={node.pkg.name} className="cursor-pointer"
                onClick={() => setSelected(selected?.name === node.pkg.name ? null : node.pkg)}
                onMouseEnter={() => setHovered(node.pkg.name)}
                onMouseLeave={() => setHovered(null)}
              >
                <circle
                  cx={node.x} cy={node.y}
                  r={node.radius * (isHovered || isSelected ? 1.15 : 1)}
                  fill={node.color}
                  fillOpacity={isHovered || isSelected ? 0.9 : 0.65}
                  stroke={isSelected ? "#fff" : "none"}
                  strokeWidth={isSelected ? 2 : 0}
                  style={{ transition: "r 0.15s ease, fill-opacity 0.15s ease" }}
                />
                <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central"
                  fill="#08090a" fontSize={node.radius > 26 ? 10 : 8} fontWeight={600}
                  pointerEvents="none" className="select-none">
                  {node.pkg.name.length > 12 ? node.pkg.name.slice(0, 10) + "…" : node.pkg.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected detail card */}
      {selected && (
        <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 style={{ fontSize: 16, fontWeight: 590, color: "#f7f8f8", letterSpacing: "-0.24px" }}>{selected.name}</h3>
            <button onClick={() => setSelected(null)} style={{ fontSize: 12, color: "#62666d" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#8a8f98"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#62666d"; }}
            >Close</button>
          </div>
          <p style={{ fontSize: 13, color: "#8a8f98", lineHeight: 1.6, marginBottom: 12 }}>{selected.description}</p>
          <div className="flex gap-4 mb-4" style={{ fontSize: 12, color: "#62666d" }}>
            {selected.githubStars != null && <span>★ {selected.githubStars >= 1000 ? `${(selected.githubStars / 1000).toFixed(1)}k` : selected.githubStars}</span>}
            {selected.weeklyDownloads != null && <span>↓ {selected.weeklyDownloads >= 1000000 ? `${(selected.weeklyDownloads / 1000000).toFixed(1)}M/wk` : selected.weeklyDownloads >= 1000 ? `${(selected.weeklyDownloads / 1000).toFixed(1)}k/wk` : `${selected.weeklyDownloads}/wk`}</span>}
          </div>
          <div className="flex gap-1.5">
            {selected.npm && <a href={selected.npm} target="_blank" rel="noopener noreferrer" className="rounded-md px-2.5 py-1 transition-colors" style={{ fontSize: 12, fontWeight: 510, color: "#8a8f98", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>npm</a>}
            {selected.github && <a href={selected.github} target="_blank" rel="noopener noreferrer" className="rounded-md px-2.5 py-1 transition-colors" style={{ fontSize: 12, fontWeight: 510, color: "#8a8f98", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>GitHub</a>}
            {selected.docs && <a href={selected.docs} target="_blank" rel="noopener noreferrer" className="rounded-md px-2.5 py-1 transition-colors" style={{ fontSize: 12, fontWeight: 510, color: "#8a8f98", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>Docs</a>}
          </div>
        </div>
      )}
    </div>
  );
}
