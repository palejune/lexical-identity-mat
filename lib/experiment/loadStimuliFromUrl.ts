import { parseStimuliCsv } from "./parseStimuli";
import type { ExperimentData } from "./types";

export async function loadStimuliFromUrl(
  url = "/data/stimuli.csv",
): Promise<ExperimentData> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch stimuli CSV: ${response.status}`);
  }

  const csvText = await response.text();
  return parseStimuliCsv(csvText);
}
