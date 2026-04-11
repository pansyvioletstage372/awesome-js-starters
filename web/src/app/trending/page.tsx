import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import TrendingStars from "@/components/TrendingStars";

export const metadata: Metadata = {
  title: "Rising Stars",
  description:
    "Discover npm packages with the highest momentum — downloads relative to awareness.",
};

export default function TrendingPage() {
  return (
    <PageShell
      title="Rising stars"
      description="Packages ranked by momentum — real-world usage relative to awareness. The higher the score, the more of a hidden gem it is."
    >
      <TrendingStars />
    </PageShell>
  );
}
