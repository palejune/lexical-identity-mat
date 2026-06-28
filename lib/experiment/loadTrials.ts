import { parseFamilyCsv } from "./parseFamilyCsv";
import type { ExperimentData, TrialsManifest } from "./types";

const DATA_BASE_URL = "/data";

export async function loadTrialsManifest(
  url = `${DATA_BASE_URL}/trials.json`,
): Promise<TrialsManifest> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch trials manifest: ${response.status}`);
  }

  const manifest = (await response.json()) as TrialsManifest;

  if (!Array.isArray(manifest.families) || manifest.families.length === 0) {
    throw new Error("trials.json must contain at least one family entry.");
  }

  return manifest;
}

export async function loadFamilyCsvFromUrl(
  filePath: string,
): Promise<ExperimentData> {
  const normalizedPath = filePath.replace(/^\/+/, "");
  const response = await fetch(`${DATA_BASE_URL}/${normalizedPath}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch family CSV (${filePath}): ${response.status}`);
  }

  const csvText = await response.text();
  return parseFamilyCsv(csvText);
}
