"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const primaryLinks = [
  { href: "/", label: "Search" },
  { href: "/analyze", label: "Analyze" },
  { href: "/compare", label: "Compare" },
  { href: "/stack-builder", label: "Stack Builder" },
  { href: "/chat", label: "Chat" },
];

const moreLinks = [
  { href: "/discover", label: "Discover" },
  { href: "/health", label: "Health" },
  { href: "/migrate", label: "Migrate" },
  { href: "/ecosystem", label: "Ecosystem Map" },
  { href: "/trending", label: "Rising Stars" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const moreActive = moreLinks.some((l) => l.href === pathname);

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        background: "#0f1011",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 sm:px-6 h-11">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          style={{ fontWeight: 590, fontSize: 14, letterSpacing: "-0.13px", color: "#f7f8f8" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect width="18" height="18" rx="5" fill="#5e6ad2" />
            <path d="M4 9h10M4 6h7M4 12h5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>awesome-js-starters</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-0.5">
          {primaryLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="rounded-md px-2.5 py-1.5 transition-colors"
                style={{
                  fontSize: 13,
                  fontWeight: 510,
                  letterSpacing: "-0.13px",
                  color: active ? "#f7f8f8" : "#8a8f98",
                  background: active ? "rgba(255,255,255,0.06)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = "#d0d6e0";
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = "#8a8f98";
                }}
              >
                {label}
              </Link>
            );
          })}

          {/* More dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="rounded-md px-2.5 py-1.5 transition-colors flex items-center gap-1"
              style={{
                fontSize: 13,
                fontWeight: 510,
                letterSpacing: "-0.13px",
                color: moreActive ? "#f7f8f8" : "#8a8f98",
                background: moreActive ? "rgba(255,255,255,0.06)" : "transparent",
              }}
            >
              More
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.6, transition: "transform 0.15s", transform: open ? "rotate(180deg)" : "none" }}>
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {open && (
              <div
                className="absolute right-0 top-full mt-1.5 w-44 py-1 z-50"
                style={{
                  background: "#191a1b",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  boxShadow: "rgba(0,0,0,0.4) 0px 8px 24px",
                }}
              >
                {moreLinks.map(({ href, label }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className="block px-3 py-2 transition-colors"
                      style={{
                        fontSize: 13,
                        fontWeight: active ? 510 : 400,
                        color: active ? "#f7f8f8" : "#8a8f98",
                        background: active ? "rgba(255,255,255,0.05)" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                        (e.currentTarget as HTMLElement).style.color = "#d0d6e0";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = active ? "rgba(255,255,255,0.05)" : "transparent";
                        (e.currentTarget as HTMLElement).style.color = active ? "#f7f8f8" : "#8a8f98";
                      }}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* CTA */}
          <a
            href="https://github.com/farhan523/awesome-js-starters/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 rounded-md px-3 py-1.5 transition-colors text-white"
            style={{
              fontSize: 13,
              fontWeight: 510,
              letterSpacing: "-0.13px",
              background: "#5e6ad2",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#7170ff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#5e6ad2"; }}
          >
            Submit
          </a>
        </div>
      </div>
    </nav>
  );
}
