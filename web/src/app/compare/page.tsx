import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PackageCompare from "@/components/PackageCompare";

export const metadata: Metadata = {
  title: "Compare Packages",
  description:
    "Head-to-head comparison of npm packages — strengths, weaknesses, and when to pick which.",
};

export default function ComparePage() {
  return (
    <PageShell
      title="Compare packages"
      description="Pick two packages and get a head-to-head breakdown — strengths, weaknesses, and when to use which."
    >
      <PackageCompare />
    </PageShell>
  );
}
