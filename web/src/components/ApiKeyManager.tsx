"use client";

import { useEffect, useState } from "react";
import {
  getGroqKey,
  setGroqKey,
  removeGroqKey,
  isValidGroqKeyFormat,
} from "@/lib/groq-key";

interface ApiKeyManagerProps {
  show: boolean;
  onKeyChange: () => void;
}

export default function ApiKeyManager({ show, onKeyChange }: ApiKeyManagerProps) {
  const [storedKey, setStoredKey] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setStoredKey(getGroqKey());
  }, []);

  const expanded = show || isEditing;

  function handleSave() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (!isValidGroqKeyFormat(trimmed)) {
      setValidationError(
        "Key should start with gsk_ — please check and try again.",
      );
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

  // Compact indicator when key is stored and panel is not expanded
  if (storedKey && !expanded) {
    return (
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
          />
        </svg>
        <span>Using your Groq API key</span>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          Change
        </button>
      </div>
    );
  }

  if (!expanded) return null;

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Use your own Groq API key
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          The default API key has hit its rate limit. You can use your own free
          Groq API key to continue searching.
        </p>
      </div>

      <ol className="text-xs text-zinc-600 dark:text-zinc-400 list-decimal list-inside flex flex-col gap-1.5">
        <li>
          Go to{" "}
          <a
            href="https://console.groq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            console.groq.com
          </a>{" "}
          and sign up (free)
        </li>
        <li>
          Navigate to <span className="font-medium">API Keys</span> in the
          sidebar
        </li>
        <li>Create a new API key and copy it</li>
      </ol>

      {storedKey && !inputValue && (
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-mono">{maskKey(storedKey)}</span>
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline transition-colors"
          >
            Remove key
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="password"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setValidationError(null);
          }}
          placeholder="gsk_..."
          className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={!inputValue.trim()}
          className="rounded-lg bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save key
        </button>
        {(isEditing || show) && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setInputValue("");
              setValidationError(null);
            }}
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {validationError && (
        <p className="text-xs text-red-600 dark:text-red-400">
          {validationError}
        </p>
      )}

      <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
        Your key is stored only in your browser. We never store it on our
        servers.
      </p>
    </div>
  );
}
