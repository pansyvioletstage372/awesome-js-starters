"use client";

import { useState } from "react";
import type { Package } from "@/lib/types";
import { getGroqKey } from "@/lib/groq-key";
import ApiKeyManager from "./ApiKeyManager";

interface Alternative extends Package { difficulty: string; migrationReason: string; beforeCode: string; afterCode: string; }
interface MigrateResult { fromPackage: string; reason: string; alternatives: Alternative[]; tips: string; }

const DIFFICULTY_STYLE: Record<string, { bg: string; color: string }> = {
  Easy:     { bg: "rgba(39,166,68,0.12)",   color: "#4ade80" },
  Moderate: { bg: "rgba(234,179,8,0.12)",   color: "#facc15" },
  Hard:     { bg: "rgba(239,68,68,0.12)",   color: "#f87171" },
};

const POPULAR = ["Moment.js", "Express", "Axios", "Lodash", "Webpack", "jQuery"];

export default function MigrateFrom() {
  const [packageName, setPackageName] = useState("");
  const [result, setResult] = useState<MigrateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showByok, setShowByok] = useState(false);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!packageName.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const userKey = getGroqKey();
      const res = await fetch("/api/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(userKey ? { "x-groq-api-key": userKey } : {}) },
        body: JSON.stringify({ packageName: packageName.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429) setShowByok(true);
        if (res.status === 401 && data?.code === "INVALID_USER_KEY") setShowByok(true);
        throw new Error(data?.error ?? `Request failed: ${res.status}`);
      }
      setResult(await res.json()); setShowByok(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setLoading(false); }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input type="text" value={packageName} onChange={(e) => setPackageName(e.target.value)}
          placeholder="e.g. Moment.js, Axios, Express..." disabled={loading}
          className="flex-1 rounded-md px-4 py-2.5 outline-none transition-all"
          style={{ fontSize: 14, color: "#f7f8f8", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", caretColor: "#7170ff" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
        />
        <button type="submit" disabled={loading || !packageName.trim()}
          className="rounded-md px-5 py-2.5 transition-colors disabled:opacity-40"
          style={{ fontSize: 13, fontWeight: 510, color: "#fff", background: "#5e6ad2" }}
          onMouseEnter={(e) => { if (!(e.currentTarget as HTMLButtonElement).disabled) (e.currentTarget as HTMLElement).style.background = "#7170ff"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#5e6ad2"; }}
        >{loading ? "Finding..." : "Find Alternatives"}</button>
      </form>

      {!result && !loading && !error && (
        <div className="flex flex-col gap-2">
          <p style={{ fontSize: 12, color: "#62666d" }}>Common migrations:</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR.map((name) => (
              <button key={name} type="button" onClick={() => setPackageName(name)}
                className="rounded-full px-3 py-1.5 transition-colors"
                style={{ fontSize: 12, color: "#8a8f98", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#d0d6e0"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#8a8f98"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
              >{name}</button>
            ))}
          </div>
        </div>
      )}

      <ApiKeyManager show={showByok} onKeyChange={() => setShowByok(false)} />
      {error && !showByok && <p style={{ fontSize: 13, color: "#f87171" }}>{error}</p>}

      {loading && (
        <div className="flex justify-center py-10">
          <div className="h-5 w-5 animate-spin rounded-full" style={{ border: "2px solid rgba(255,255,255,0.08)", borderTopColor: "#5e6ad2" }} />
        </div>
      )}

      {result && !loading && (
        <div className="flex flex-col gap-5">
          <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 590, color: "#f7f8f8", letterSpacing: "-0.24px", marginBottom: 6 }}>Migrating from {result.fromPackage}</h3>
            <p style={{ fontSize: 14, color: "#8a8f98", lineHeight: 1.6 }}>{result.reason}</p>
          </div>

          {result.alternatives.length === 0 ? (
            <p style={{ fontSize: 13, fontStyle: "italic", color: "#62666d" }}>No direct alternatives found in our catalog for this package.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {result.alternatives.map((alt) => {
                const ds = DIFFICULTY_STYLE[alt.difficulty] ?? DIFFICULTY_STYLE.Moderate;
                return (
                  <div key={alt.name} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="p-5">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h4 style={{ fontSize: 15, fontWeight: 590, color: "#f7f8f8", letterSpacing: "-0.13px" }}>{alt.name}</h4>
                        <span className="rounded-full px-2.5 py-0.5" style={{ fontSize: 11, fontWeight: 510, background: ds.bg, color: ds.color }}>{alt.difficulty} migration</span>
                      </div>
                      <p style={{ fontSize: 13, color: "#8a8f98", lineHeight: 1.6, marginBottom: 16 }}>{alt.migrationReason}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <span style={{ fontSize: 11, fontWeight: 510, color: "#f87171", display: "block", marginBottom: 6 }}>Before ({result.fromPackage})</span>
                          <pre className="rounded-lg overflow-x-auto" style={{ background: "#060607", padding: "12px 14px" }}>
                            <code style={{ fontSize: 12, fontFamily: "monospace", color: "#8a8f98" }}>{alt.beforeCode}</code>
                          </pre>
                        </div>
                        <div>
                          <span style={{ fontSize: 11, fontWeight: 510, color: "#4ade80", display: "block", marginBottom: 6 }}>After ({alt.name})</span>
                          <pre className="rounded-lg overflow-x-auto" style={{ background: "#060607", padding: "12px 14px" }}>
                            <code style={{ fontSize: 12, fontFamily: "monospace", color: "#4ade80" }}>{alt.afterCode}</code>
                          </pre>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {alt.npm && <a href={alt.npm} target="_blank" rel="noopener noreferrer" className="rounded-md px-2.5 py-1 transition-colors" style={{ fontSize: 12, fontWeight: 510, color: "#8a8f98", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>npm</a>}
                        {alt.docs && <a href={alt.docs} target="_blank" rel="noopener noreferrer" className="rounded-md px-2.5 py-1 transition-colors" style={{ fontSize: 12, fontWeight: 510, color: "#8a8f98", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>Docs</a>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {result.tips && (
            <div className="rounded-xl p-4" style={{ border: "1px dashed rgba(255,255,255,0.08)" }}>
              <p style={{ fontSize: 11, fontWeight: 510, color: "#62666d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Migration Tips</p>
              <p style={{ fontSize: 13, color: "#8a8f98", lineHeight: 1.6 }}>{result.tips}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
