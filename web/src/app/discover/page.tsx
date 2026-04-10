import type { Metadata } from "next";
import DiscoverRandom from "@/components/DiscoverRandom";

export const metadata: Metadata = {
  title: "Discover",
  description: "Discover a random npm package you didn't know you needed.",
};

export default function DiscoverPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-4xl flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Surprise me
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-md">
            Click the button and discover a random package from our catalog.
            Your next favorite tool is one click away.
          </p>
        </div>

        <DiscoverRandom />
      </div>
    </main>
  );
}
