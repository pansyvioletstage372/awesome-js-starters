import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import DiscoverRandom from "@/components/DiscoverRandom";

export const metadata: Metadata = {
  title: "Discover",
  description: "Discover a random npm package you didn't know you needed.",
};

export default function DiscoverPage() {
  return (
    <PageShell
      title="Surprise me"
      description="Click the button and discover a random package from our catalog. Your next favorite tool is one click away."
    >
      <div className="flex justify-center">
        <DiscoverRandom />
      </div>
    </PageShell>
  );
}
