import { readFile } from "fs/promises";
import path from "path";
import { parseStimuliCsv } from "./parseStimuli";
import type { ExperimentData } from "./types";

const STIMULI_CSV_PATH = path.join(
  process.cwd(),
  "public",
  "data",
  "stimuli.csv",
);

export async function loadStimuliFromFile(): Promise<ExperimentData> {
  const csvText = await readFile(STIMULI_CSV_PATH, "utf-8");
  return parseStimuliCsv(csvText);
}
