"use client";

import { useState, type DragEvent } from "react";
import type { EnrichedResult } from "@/lib/types";
import { getGroqKey } from "@/lib/groq-key";
import ApiKeyManager from "./ApiKeyManager";
import ResultsGrid from "./ResultsGrid";

interface AnalysisResult {
  stackSummary: string;
  currentDeps: string[];
  results: EnrichedResult[];
}

const GHOST_BTN = {
  fontSize: 13, fontWeight: 510, color: "#d0d6e0",
  border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)",
  borderRadius: 6, padding: "8px 16px", cursor: "pointer",
} as const;

const PRIMARY_BTN = {
  fontSize: 13, fontWeight: 510, color: "#fff",
  background: "#5e6ad2", border: "none",
  borderRadius: 6, padding: "8px 16px", cursor: "pointer",
} as const;

export default function PackageAnalyzer() {
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showByok, setShowByok] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  function parseDeps(raw: string): Record<string, string> | null {
    try {
      const parsed = JSON.parse(raw);
      const deps: Record<string, string> = {
        ...(parsed.dependencies ?? {}),
        ...(parsed.devDependencies ?? {}),
      };
      return Object.keys(deps).length === 0 ? null : deps;
    } catch { return null; }
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const deps = parseDeps(input);
    if (!deps) {
      setError("Could not parse package.json. Make sure it contains a valid dependencies or devDependencies field.");
      return;
    }
    doAnalyze(deps);
  }

  async function doAnalyze(deps: Record<string, string>) {
    setLoading(true); setError(null); setAnalysis(null);
    try {
      const userKey = getGroqKey();
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(userKey ? { "x-groq-api-key": userKey } : {}) },
        body: JSON.stringify({ dependencies: deps }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429) setShowByok(true);
        if (res.status === 401 && data?.code === "INVALID_USER_KEY") setShowByok(true);
        throw new Error(data?.error ?? `Request failed: ${res.status}`);
      }
      setAnalysis(await res.json());
      setShowByok(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setLoading(false); }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") setInput(reader.result); };
    reader.readAsText(file);
  }

  const EXAMPLE_PKG = JSON.stringify({ dependencies: { next: "^14.0.0", react: "^18.2.0", "react-dom": "^18.2.0", tailwindcss: "^3.4.0", typescript: "^5.0.0" } }, null, 2);

  return (
    <div className="w-full flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className="relative rounded-lg transition-colors"
          style={{
            border: dragOver ? "2px dashed #7170ff" : "2px dashed rgba(255,255,255,0.08)",
            background: dragOver ? "rgba(113,112,255,0.05)" : "transparent",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your package.json here or drag & drop the file..."
            rows={12}
            className="w-full rounded-lg bg-transparent px-4 py-3 outline-none resize-none font-mono"
            style={{ fontSize: 13, color: "#f7f8f8" }}
            disabled={loading}
          />
          {!input && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center gap-2" style={{ color: "#62666d" }}>
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span style={{ fontSize: 12 }}>Drop package.json or paste contents</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button type="submit" disabled={loading || !input.trim()} style={{ ...PRIMARY_BTN, opacity: loading || !input.trim() ? 0.4 : 1 }}
            onMouseEnter={(e) => { if (!loading && input.trim()) (e.currentTarget as HTMLElement).style.background = "#7170ff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#5e6ad2"; }}
          >
            {loading ? "Analyzing..." : "Analyze My Stack"}
          </button>
          {!input && (
            <button type="button" onClick={() => setInput(EXAMPLE_PKG)} style={GHOST_BTN}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
            >Try example</button>
          )}
          {input && (
            <button type="button" onClick={() => { setInput(""); setAnalysis(null); setError(null); }} style={GHOST_BTN}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
            >Clear</button>
          )}
        </div>
      </form>

      <ApiKeyManager show={showByok} onKeyChange={() => setShowByok(false)} />
      {error && !showByok && <p style={{ fontSize: 13, color: "#f87171" }}>{error}</p>}

      {loading && (
        <div className="flex justify-center py-10">
          <div className="h-5 w-5 animate-spin rounded-full" style={{ border: "2px solid rgba(255,255,255,0.08)", borderTopColor: "#5e6ad2" }} />
        </div>
      )}

      {analysis && !loading && (
        <div className="flex flex-col gap-6">
          {analysis.stackSummary && (
            <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p style={{ fontSize: 12, fontWeight: 510, color: "#62666d", marginBottom: 6, letterSpacing: "-0.13px", textTransform: "uppercase" }}>Your Stack</p>
              <p style={{ fontSize: 14, color: "#d0d6e0", lineHeight: 1.6, marginBottom: 12 }}>{analysis.stackSummary}</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.currentDeps.map((dep) => (
                  <span key={dep} className="rounded-full font-mono" style={{ fontSize: 11, fontWeight: 510, color: "#8a8f98", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", padding: "2px 8px" }}>{dep}</span>
                ))}
              </div>
            </div>
          )}
          <div>
            <p style={{ fontSize: 12, fontWeight: 510, color: "#62666d", marginBottom: 12, letterSpacing: "-0.13px", textTransform: "uppercase" }}>Recommended Additions</p>
            <ResultsGrid results={analysis.results} />
          </div>
        </div>
      )}
    </div>
  );
}
