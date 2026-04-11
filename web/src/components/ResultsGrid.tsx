import type { EnrichedResult } from "@/lib/types";
import ResultCard from "./ResultCard";

interface Props {
  results: EnrichedResult[];
}

export default function ResultsGrid({ results }: Props) {
  if (results.length === 0) {
    return (
      <p className="text-center py-10" style={{ fontSize: 13, color: "#62666d" }}>
        No matching packages found. Try describing your use case differently.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {results.map((result) => (
        <ResultCard key={result.repoPath} result={result} />
      ))}
    </div>
  );
}
