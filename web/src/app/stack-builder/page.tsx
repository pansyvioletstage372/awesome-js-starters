import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import StackBuilder from "@/components/StackBuilder";

export const metadata: Metadata = {
  title: "Stack Builder",
  description:
    "Pick a project type and get a curated package stack — like pcpartpicker but for npm.",
};

export default function StackBuilderPage() {
  return (
    <PageShell
      title="Build your stack"
      description="Pick what you're building and get a curated set of packages that work well together — with install commands and tips."
    >
      <StackBuilder />
    </PageShell>
  );
}
