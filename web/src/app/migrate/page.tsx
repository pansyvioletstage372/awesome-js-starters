import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import MigrateFrom from "@/components/MigrateFrom";

export const metadata: Metadata = {
  title: "Migrate From",
  description:
    "Find modern alternatives to outdated npm packages with migration guides and code comparisons.",
};

export default function MigratePage() {
  return (
    <PageShell
      title="Migrate from X"
      description="Tell us what you're migrating away from and get modern alternatives with difficulty ratings and code comparisons."
    >
      <MigrateFrom />
    </PageShell>
  );
}
