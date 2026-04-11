"use client";

import { useState, useRef, useEffect } from "react";
import { getGroqKey } from "@/lib/groq-key";
import ApiKeyManager from "./ApiKeyManager";

interface Message { role: "user" | "assistant"; content: string; }

const STARTERS = [
  "I need help building a full-stack app",
  "What's good for data visualization?",
  "I need a lightweight HTTP client",
  "Help me pick a validation library",
];

export default function ChatMode() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showByok, setShowByok] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function sendMessage(content: string) {
    if (!content.trim()) return;
    const userMessage: Message = { role: "user", content: content.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages); setInput(""); setLoading(true); setError(null);
    try {
      const userKey = getGroqKey();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(userKey ? { "x-groq-api-key": userKey } : {}) },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429) setShowByok(true);
        if (res.status === 401 && data?.code === "INVALID_USER_KEY") setShowByok(true);
        throw new Error(data?.error ?? `Request failed: ${res.status}`);
      }
      const data = await res.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.reply }]);
      setShowByok(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setLoading(false); }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Messages */}
      <div
        className="flex flex-col gap-3 overflow-y-auto p-4 rounded-xl"
        style={{ minHeight: 300, maxHeight: 500, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {messages.length === 0 && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
            <p style={{ fontSize: 13, color: "#62666d" }}>Start a conversation to find the right packages</p>
            <div className="flex flex-wrap justify-center gap-2">
              {STARTERS.map((s) => (
                <button key={s} type="button" onClick={() => sendMessage(s)}
                  className="rounded-full px-3 py-1.5 transition-colors"
                  style={{ fontSize: 12, color: "#8a8f98", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#d0d6e0"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#8a8f98"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                >{s}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[80%] rounded-2xl px-4 py-2.5"
              style={{
                fontSize: 14, lineHeight: 1.6,
                ...(msg.role === "user"
                  ? { background: "#5e6ad2", color: "#fff", borderBottomRightRadius: 4 }
                  : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#d0d6e0", borderBottomLeftRadius: 4 }),
              }}
            >
              {msg.role === "assistant" ? (
                <div className="whitespace-pre-wrap">
                  {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                    part.startsWith("**") && part.endsWith("**")
                      ? <strong key={j} style={{ fontWeight: 590, color: "#f7f8f8" }}>{part.slice(2, -2)}</strong>
                      : <span key={j}>{part}</span>
                  )}
                </div>
              ) : msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderBottomLeftRadius: 4 }}>
              <div className="flex gap-1">
                {[0, 150, 300].map((delay) => (
                  <div key={delay} className="h-2 w-2 rounded-full animate-bounce" style={{ background: "#62666d", animationDelay: `${delay}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ApiKeyManager show={showByok} onKeyChange={() => setShowByok(false)} />
      {error && !showByok && <p style={{ fontSize: 13, color: "#f87171" }}>{error}</p>}

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
        <input
          type="text" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about packages..." disabled={loading}
          className="flex-1 rounded-md px-4 py-2.5 outline-none transition-all"
          style={{ fontSize: 14, color: "#f7f8f8", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", caretColor: "#7170ff" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
        />
        <button type="submit" disabled={loading || !input.trim()}
          className="rounded-md px-5 py-2.5 transition-colors disabled:opacity-40"
          style={{ fontSize: 13, fontWeight: 510, color: "#fff", background: "#5e6ad2" }}
          onMouseEnter={(e) => { if (!(e.currentTarget as HTMLButtonElement).disabled) (e.currentTarget as HTMLElement).style.background = "#7170ff"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#5e6ad2"; }}
        >Send</button>
      </form>

      {messages.length > 0 && (
        <button type="button" onClick={() => { setMessages([]); setError(null); }}
          className="self-center transition-colors" style={{ fontSize: 12, color: "#62666d" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#8a8f98"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#62666d"; }}
        >Clear conversation</button>
      )}
    </div>
  );
}
