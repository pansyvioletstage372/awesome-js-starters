import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PackageAnalyzer from "@/components/PackageAnalyzer";

export const metadata: Metadata = {
  title: "Analyze Your Stack",
  description:
    "Paste your package.json and get AI-powered recommendations for packages that fill gaps in your current stack.",
};

export default function AnalyzePage() {
  return (
    <PageShell
      title="Analyze your stack"
      description="Paste your package.json and we'll find packages from our catalog that fill gaps in your current setup."
    >
      <PackageAnalyzer />
    </PageShell>
  );
}
