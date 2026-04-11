import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Leaderboard from "@/components/Leaderboard";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "See who has contributed the most packages to the awesome-js-starters catalog.",
};

export default function LeaderboardPage() {
  return (
    <PageShell
      title="Contributor leaderboard"
      description="The people who make this catalog great. Every package submission earns a spot on the board."
    >
      <Leaderboard />
    </PageShell>
  );
}
