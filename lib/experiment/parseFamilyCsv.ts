import Papa from "papaparse";
import type { ExperimentData, VariantItem } from "./types";

interface FamilyCsvRow {
  family_id?: string;
  family_code?: string;
  role: string;
  id: string;
  text: string;
}

function resolveTrialId(row: FamilyCsvRow): string {
  const familyId = row.family_id?.trim();
  if (familyId) {
    return familyId;
  }

  const familyCode = row.family_code?.trim();
  if (familyCode) {
    return familyCode;
  }

  return "";
}

export function parseFamilyCsv(csvText: string): ExperimentData {
  const parsed = Papa.parse<FamilyCsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (parsed.errors.length > 0) {
    throw new Error(
      parsed.errors.map((error) => error.message).join("; "),
    );
  }

  let trialId = "";
  let anchor = "";
  const variants: VariantItem[] = [];

  parsed.data.forEach((row) => {
    if (!trialId) {
      trialId = resolveTrialId(row);
    }

    const role = row.role?.trim().toLowerCase();
    const text = row.text?.trim();

    if (!role || !text) {
      return;
    }

    if (role === "anchor") {
      if (anchor) {
        throw new Error("Each family CSV must contain exactly one anchor row.");
      }
      anchor = text;
      return;
    }

    if (role === "variant") {
      const id = row.id?.trim() || `v${variants.length + 1}`;
      variants.push({ id, text });
    }
  });

  if (!trialId) {
    throw new Error("Family CSV must include family_id or family_code.");
  }

  if (!anchor) {
    throw new Error(`Family "${trialId}" must contain one anchor row.`);
  }

  if (variants.length === 0) {
    throw new Error(`Family "${trialId}" must contain at least one variant row.`);
  }

  return {
    trialId,
    anchor,
    variants,
  };
}
