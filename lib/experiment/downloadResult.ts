import type { ExperimentResult } from "./types";

export function downloadExperimentResult(result: ExperimentResult): void {
  const json = JSON.stringify(result, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "experiment-result.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
