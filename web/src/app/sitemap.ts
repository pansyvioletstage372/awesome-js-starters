import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://awesome-js-starters.vercel.app";

const routes = [
  { path: "/",             priority: 1.0, freq: "weekly"  },
  { path: "/analyze",      priority: 0.9, freq: "monthly" },
  { path: "/compare",      priority: 0.9, freq: "monthly" },
  { path: "/stack-builder",priority: 0.9, freq: "monthly" },
  { path: "/chat",         priority: 0.8, freq: "monthly" },
  { path: "/discover",     priority: 0.8, freq: "weekly"  },
  { path: "/health",       priority: 0.7, freq: "weekly"  },
  { path: "/migrate",      priority: 0.8, freq: "monthly" },
  { path: "/ecosystem",    priority: 0.7, freq: "weekly"  },
  { path: "/trending",     priority: 0.7, freq: "weekly"  },
  { path: "/leaderboard",  priority: 0.6, freq: "weekly"  },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority, freq }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  }));
}
