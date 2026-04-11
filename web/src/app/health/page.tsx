import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import HealthDashboard from "@/components/HealthDashboard";

export const metadata: Metadata = {
  title: "Package Health",
  description:
    "Health scores for every package in the catalog — stars, downloads, maintenance activity.",
};

export default function HealthPage() {
  return (
    <PageShell
      title="Package health"
      description="At-a-glance health scores for every package in the catalog. Stars, downloads, and maintenance activity."
    >
      <HealthDashboard />
    </PageShell>
  );
}
