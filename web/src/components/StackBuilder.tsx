"use client";

import { useState } from "react";
import type { EnrichedResult } from "@/lib/types";
import { getGroqKey } from "@/lib/groq-key";
import ApiKeyManager from "./ApiKeyManager";

interface StackPackage extends EnrichedResult { role: string; }
interface StackResult { stackName: string; description: string; packages: StackPackage[]; installCommand: string; tips: string; }

const PROJECT_TYPES = [
  { value: "SaaS web app", label: "SaaS Web App", icon: "🏢" },
  { value: "personal blog", label: "Blog / Portfolio", icon: "📝" },
  { value: "REST API backend", label: "REST API", icon: "🔌" },
  { value: "CLI tool", label: "CLI Tool", icon: "⌨" },
  { value: "e-commerce store", label: "E-Commerce", icon: "🛒" },
  { value: "real-time dashboard", label: "Dashboard", icon: "📊" },
  { value: "AI-powered app", label: "AI App", icon: "🤖" },
  { value: "mobile app with React Native", label: "Mobile App", icon: "📱" },
];

export default function StackBuilder() {
  const [projectType, setProjectType] = useState("");
  const [customType, setCustomType] = useState("");
  const [requirements, setRequirements] = useState("");
  const [result, setResult] = useState<StackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showByok, setShowByok] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const type = projectType === "custom" ? customType.trim() : projectType;
    if (!type) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const userKey = getGroqKey();
      const res = await fetch("/api/stack-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(userKey ? { "x-groq-api-key": userKey } : {}) },
        body: JSON.stringify({ projectType: type, requirements: requirements.trim() }),
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

  async function copyInstallCommand() {
    if (!result?.installCommand) return;
    await navigator.clipboard.writeText(result.installCommand);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label style={{ fontSize: 12, fontWeight: 510, color: "#62666d", display: "block", marginBottom: 10 }}>What are you building?</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PROJECT_TYPES.map((pt) => {
              const active = projectType === pt.value;
              return (
                <button key={pt.value} type="button" onClick={() => setProjectType(pt.value)} disabled={loading}
                  className="rounded-lg p-3 text-left transition-all"
                  style={{
                    border: active ? "1px solid #5e6ad2" : "1px solid rgba(255,255,255,0.08)",
                    background: active ? "rgba(94,106,210,0.12)" : "rgba(255,255,255,0.02)",
                  }}
                >
                  <span className="text-lg block mb-1">{pt.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: active ? 510 : 400, color: active ? "#f7f8f8" : "#8a8f98" }}>{pt.label}</span>
                </button>
              );
            })}
          </div>
          <button type="button" onClick={() => setProjectType(projectType === "custom" ? "" : "custom")}
            className="mt-3 transition-colors" style={{ fontSize: 12, color: "#62666d" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#8a8f98"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#62666d"; }}
          >
            {projectType === "custom" ? "Use preset" : "Or describe something custom..."}
          </button>
          {projectType === "custom" && (
            <input type="text" value={customType} onChange={(e) => setCustomType(e.target.value)}
              placeholder="e.g. real-time collaborative whiteboard" disabled={loading}
              className="mt-2 w-full rounded-md px-4 py-2.5 outline-none transition-all"
              style={{ fontSize: 13, color: "#f7f8f8", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            />
          )}
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 510, color: "#62666d", display: "block", marginBottom: 6 }}>
            Extra requirements <span style={{ color: "#3e3e44" }}>(optional)</span>
          </label>
          <input type="text" value={requirements} onChange={(e) => setRequirements(e.target.value)}
            placeholder="e.g. must support TypeScript, needs authentication, needs charts" disabled={loading}
            className="w-full rounded-md px-4 py-2.5 outline-none transition-all"
            style={{ fontSize: 13, color: "#f7f8f8", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />
        </div>

        <button type="submit"
          disabled={loading || (!projectType && !customType.trim()) || (projectType === "custom" && !customType.trim())}
          className="self-start rounded-md px-5 py-2.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontSize: 13, fontWeight: 510, color: "#fff", background: "#5e6ad2" }}
          onMouseEnter={(e) => { if (!(e.currentTarget as HTMLButtonElement).disabled) (e.currentTarget as HTMLElement).style.background = "#7170ff"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#5e6ad2"; }}
        >
          {loading ? "Building stack..." : "Build My Stack"}
        </button>
      </form>

      <ApiKeyManager show={showByok} onKeyChange={() => setShowByok(false)} />
      {error && !showByok && <p style={{ fontSize: 13, color: "#f87171" }}>{error}</p>}

      {loading && (
        <div className="flex justify-center py-10">
          <div className="h-5 w-5 animate-spin rounded-full" style={{ border: "2px solid rgba(255,255,255,0.08)", borderTopColor: "#5e6ad2" }} />
        </div>
      )}

      {result && !loading && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ fontSize: 17, fontWeight: 590, color: "#f7f8f8", letterSpacing: "-0.24px", marginBottom: 6 }}>{result.stackName}</h3>
            <p style={{ fontSize: 14, color: "#8a8f98", lineHeight: 1.6 }}>{result.description}</p>
          </div>

          <div className="flex flex-col gap-2">
            {result.packages.map((pkg, i) => (
              <div key={pkg.name} className="flex items-start gap-4 rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(94,106,210,0.15)", fontSize: 12, fontWeight: 590, color: "#7170ff" }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 style={{ fontSize: 14, fontWeight: 590, color: "#f7f8f8", letterSpacing: "-0.13px" }}>{pkg.name}</h4>
                    <span className="rounded-full px-2 py-0.5" style={{ fontSize: 11, fontWeight: 510, color: "#8a8f98", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}>{pkg.role}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#8a8f98", lineHeight: 1.5 }}>{pkg.reason}</p>
                  <div className="flex gap-3 mt-2">
                    {pkg.npm && <a href={pkg.npm} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#62666d", textDecoration: "underline" }}>npm</a>}
                    {pkg.docs && <a href={pkg.docs} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#62666d", textDecoration: "underline" }}>Docs</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {result.installCommand && (
            <div className="rounded-lg p-4 relative group" style={{ background: "#060607" }}>
              <code style={{ fontSize: 13, fontFamily: "monospace", color: "#4ade80", wordBreak: "break-all" }}>{result.installCommand}</code>
              <button onClick={copyInstallCommand}
                className="absolute top-3 right-3 rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ fontSize: 11, color: "#8a8f98", background: "rgba(255,255,255,0.08)" }}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}

          {result.tips && (
            <div className="rounded-xl p-4" style={{ border: "1px dashed rgba(255,255,255,0.08)" }}>
              <p style={{ fontSize: 11, fontWeight: 510, color: "#62666d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Getting Started</p>
              <p style={{ fontSize: 13, color: "#8a8f98", lineHeight: 1.6 }}>{result.tips}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
