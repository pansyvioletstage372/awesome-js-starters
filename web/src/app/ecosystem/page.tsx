import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import EcosystemMap from "@/components/EcosystemMap";

export const metadata: Metadata = {
  title: "Ecosystem Map",
  description:
    "Interactive visual map of the npm package ecosystem — explore packages grouped by category.",
};

export default function EcosystemPage() {
  return (
    <PageShell
      title="Ecosystem map"
      description="A visual map of every package in the catalog. Bubbles are sized by popularity and grouped by ecosystem. Click any node to explore."
    >
      <EcosystemMap />
    </PageShell>
  );
}
