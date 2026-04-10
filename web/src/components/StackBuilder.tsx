"use client";

import { useState, type FormEvent } from "react";
import type { EnrichedResult } from "@/lib/types";
import { getGroqKey } from "@/lib/groq-key";
import ApiKeyManager from "./ApiKeyManager";

interface StackPackage extends EnrichedResult {
  role: string;
}

interface StackResult {
  stackName: string;
  description: string;
  packages: StackPackage[];
  installCommand: string;
  tips: string;
}

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const type = projectType === "custom" ? customType.trim() : projectType;
    if (!type) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const userKey = getGroqKey();
      const res = await fetch("/api/stack-builder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userKey ? { "x-groq-api-key": userKey } : {}),
        },
        body: JSON.stringify({
          projectType: type,
          requirements: requirements.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429) setShowByok(true);
        if (res.status === 401 && data?.code === "INVALID_USER_KEY")
          setShowByok(true);
        throw new Error(data?.error ?? `Request failed: ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
      setShowByok(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function copyInstallCommand() {
    if (!result?.installCommand) return;
    await navigator.clipboard.writeText(result.installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 block">
            What are you building?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PROJECT_TYPES.map((pt) => (
              <button
                key={pt.value}
                type="button"
                onClick={() => setProjectType(pt.value)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  projectType === pt.value
                    ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                }`}
                disabled={loading}
              >
                <span className="text-lg block mb-1">{pt.icon}</span>
                <span className="text-xs font-medium">{pt.label}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              setProjectType(projectType === "custom" ? "" : "custom")
            }
            className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            {projectType === "custom"
              ? "Use preset"
              : "Or describe something custom..."}
          </button>
          {projectType === "custom" && (
            <input
              type="text"
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              placeholder="e.g. real-time collaborative whiteboard"
              className="mt-2 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              disabled={loading}
            />
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 block">
            Extra requirements{" "}
            <span className="text-zinc-400 dark:text-zinc-600">(optional)</span>
          </label>
          <input
            type="text"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="e.g. must support TypeScript, needs authentication, needs charts"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={
            loading ||
            (!projectType && !customType.trim()) ||
            (projectType === "custom" && !customType.trim())
          }
          className="self-start rounded-lg bg-zinc-900 dark:bg-zinc-100 px-6 py-2.5 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Building stack..." : "Build My Stack"}
        </button>
      </form>

      <ApiKeyManager show={showByok} onKeyChange={() => setShowByok(false)} />

      {error && !showByok && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
        </div>
      )}

      {result && !loading && (
        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1">
              {result.stackName}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {result.description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {result.packages.map((pkg, i) => (
              <div
                key={pkg.name}
                className="flex items-start gap-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {pkg.name}
                    </h4>
                    <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      {pkg.role}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {pkg.reason}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {pkg.npm && (
                      <a
                        href={pkg.npm}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                      >
                        npm
                      </a>
                    )}
                    {pkg.docs && (
                      <a
                        href={pkg.docs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                      >
                        Docs
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {result.installCommand && (
            <div className="rounded-lg bg-zinc-900 dark:bg-zinc-950 p-4 relative group">
              <code className="text-sm font-mono text-green-400 break-all">
                {result.installCommand}
              </code>
              <button
                onClick={copyInstallCommand}
                className="absolute top-3 right-3 rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}

          {result.tips && (
            <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-4">
              <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Getting Started Tips
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {result.tips}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
