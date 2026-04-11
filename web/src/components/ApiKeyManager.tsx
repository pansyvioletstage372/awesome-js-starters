"use client";

import { useEffect, useState } from "react";
import { getGroqKey, setGroqKey, removeGroqKey, isValidGroqKeyFormat } from "@/lib/groq-key";

interface ApiKeyManagerProps {
  show: boolean;
  onKeyChange: () => void;
}

export default function ApiKeyManager({ show, onKeyChange }: ApiKeyManagerProps) {
  const [storedKey, setStoredKey] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { setStoredKey(getGroqKey()); }, []);

  const expanded = show || isEditing;

  function handleSave() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (!isValidGroqKeyFormat(trimmed)) {
      setValidationError("Key should start with gsk_ — please check and try again.");
      return;
    }
    setGroqKey(trimmed);
    setStoredKey(trimmed);
    setInputValue("");
    setValidationError(null);
    setIsEditing(false);
    onKeyChange();
  }

  function handleRemove() {
    removeGroqKey();
    setStoredKey(null);
    setInputValue("");
    setValidationError(null);
    setIsEditing(false);
    onKeyChange();
  }

  function maskKey(key: string) {
    if (key.length <= 8) return "••••••••";
    return key.slice(0, 4) + "••••••••" + key.slice(-4);
  }

  if (storedKey && !expanded) {
    return (
      <div className="flex items-center gap-2" style={{ fontSize: 12, color: "#62666d" }}>
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
        </svg>
        <span>Using your Groq API key</span>
        <button type="button" onClick={() => setIsEditing(true)}
          style={{ color: "#8a8f98", textDecoration: "underline" }}>
          Change
        </button>
      </div>
    );
  }

  if (!expanded) return null;

  return (
    <div className="rounded-xl flex flex-col gap-4 p-5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex flex-col gap-1">
        <h3 style={{ fontSize: 14, fontWeight: 590, color: "#f7f8f8", letterSpacing: "-0.13px" }}>
          Use your own Groq API key
        </h3>
        <p style={{ fontSize: 12, color: "#62666d", lineHeight: 1.5 }}>
          The default API key has hit its rate limit. Use your own free Groq key to continue.
        </p>
      </div>

      <ol className="flex flex-col gap-1.5" style={{ fontSize: 12, color: "#8a8f98", listStyleType: "decimal", paddingLeft: 16 }}>
        <li>Go to{" "}
          <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer"
            style={{ color: "#7170ff", textDecoration: "underline" }}>
            console.groq.com
          </a>{" "}and sign up (free)
        </li>
        <li>Navigate to <span style={{ color: "#d0d6e0", fontWeight: 510 }}>API Keys</span> in the sidebar</li>
        <li>Create a new API key and copy it</li>
      </ol>

      {storedKey && !inputValue && (
        <div className="flex items-center gap-3" style={{ fontSize: 12, color: "#62666d" }}>
          <span className="font-mono">{maskKey(storedKey)}</span>
          <button type="button" onClick={handleRemove} style={{ color: "#f87171", textDecoration: "underline" }}>
            Remove key
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="password"
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); setValidationError(null); }}
          placeholder="gsk_..."
          className="flex-1 rounded-md px-3 py-2 outline-none transition-all font-mono"
          style={{
            fontSize: 13,
            color: "#f7f8f8",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
        />
        <button type="button" onClick={handleSave} disabled={!inputValue.trim()}
          className="rounded-md px-4 py-2 transition-colors disabled:opacity-40"
          style={{ fontSize: 13, fontWeight: 510, color: "#fff", background: "#5e6ad2" }}
          onMouseEnter={(e) => { if (!(e.currentTarget as HTMLButtonElement).disabled) (e.currentTarget as HTMLElement).style.background = "#7170ff"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#5e6ad2"; }}
        >
          Save key
        </button>
        {(isEditing || show) && (
          <button type="button"
            onClick={() => { setIsEditing(false); setInputValue(""); setValidationError(null); }}
            className="rounded-md px-4 py-2 transition-colors"
            style={{ fontSize: 13, fontWeight: 510, color: "#8a8f98", border: "1px solid rgba(255,255,255,0.08)", background: "transparent" }}
          >
            Cancel
          </button>
        )}
      </div>

      {validationError && (
        <p style={{ fontSize: 12, color: "#f87171" }}>{validationError}</p>
      )}

      <p style={{ fontSize: 11, color: "#62666d" }}>
        Your key is stored only in your browser. We never store it on our servers.
      </p>
    </div>
  );
}
