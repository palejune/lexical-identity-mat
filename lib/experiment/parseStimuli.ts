import Papa from "papaparse";
import type { ExperimentData, VariantItem } from "./types";

interface StimuliRow {
  role: string;
  id: string;
  text: string;
}

export function parseStimuliCsv(csvText: string): ExperimentData {
  const parsed = Papa.parse<StimuliRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (parsed.errors.length > 0) {
    throw new Error(
      parsed.errors.map((error) => error.message).join("; "),
    );
  }

  let anchor = "";
  const variants: VariantItem[] = [];

  parsed.data.forEach((row) => {
    const role = row.role?.trim().toLowerCase();
    const text = row.text?.trim();

    if (!role || !text) {
      return;
    }

    if (role === "anchor") {
      if (anchor) {
        throw new Error("stimuli.csv must contain exactly one anchor row.");
      }
      anchor = text;
      return;
    }

    if (role === "variant") {
      const id = row.id?.trim() || `v${variants.length + 1}`;
      variants.push({ id, text });
    }
  });

  if (!anchor) {
    throw new Error("stimuli.csv must contain one anchor row.");
  }

  if (variants.length === 0) {
    throw new Error("stimuli.csv must contain at least one variant row.");
  }

  return { anchor, variants };
}
