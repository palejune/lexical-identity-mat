#!/usr/bin/env python3
"""Export family CSV files and trials.json from the stimuli master Excel file."""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MASTER_XLSX = PROJECT_ROOT / "stimuli" / "master" / "stimuli.xlsx"
SHEET_NAME = "실험자극"
FAMILIES_DIR = PROJECT_ROOT / "public" / "data" / "families"
TRIALS_JSON = PROJECT_ROOT / "public" / "data" / "trials.json"

EXPORT_PREFIX_COLUMNS = ["family_id", "role", "id", "text"]


def normalize_layer(layer: object) -> str:
    if pd.isna(layer):
        return ""

    return str(layer).strip().lower()


def derive_role(layer: object) -> str:
    return "anchor" if normalize_layer(layer) == "anchor" else "variant"


def assign_ids(roles: pd.Series) -> list[str]:
    ids: list[str] = []
    variant_counter = 0

    for role in roles:
        if role == "anchor":
            ids.append("a1")
            continue

        variant_counter += 1
        ids.append(f"v{variant_counter}")

    return ids


def sanitize_family_code(family_code: object) -> str:
    if pd.isna(family_code):
        raise ValueError("family_code must not be empty.")

    return str(family_code).strip().replace("/", "_")


def prepare_family_export(family_df: pd.DataFrame) -> pd.DataFrame:
    export_df = family_df.copy()
    export_df["family_id"] = export_df["family_code"]
    export_df["role"] = export_df["layer"].apply(derive_role)
    export_df["id"] = assign_ids(export_df["role"])
    export_df["text"] = export_df["variant"]

    original_columns = list(family_df.columns)
    trailing_columns = [
        column
        for column in original_columns
        if column not in EXPORT_PREFIX_COLUMNS
    ]

    return export_df[EXPORT_PREFIX_COLUMNS + trailing_columns]


def load_master_sheet() -> pd.DataFrame:
    if not MASTER_XLSX.exists():
        raise FileNotFoundError(f"Master Excel file not found: {MASTER_XLSX}")

    return pd.read_excel(
        MASTER_XLSX,
        sheet_name=SHEET_NAME,
        engine="openpyxl",
    )


def export_stimuli() -> tuple[int, int]:
    master_df = load_master_sheet()

    if "family_code" not in master_df.columns:
        raise ValueError('Missing required column: "family_code"')

    FAMILIES_DIR.mkdir(parents=True, exist_ok=True)

    family_codes = master_df["family_code"].map(sanitize_family_code).tolist()
    unique_family_codes = list(dict.fromkeys(family_codes))

    trials_payload: dict[str, list[dict[str, str]]] = {"families": []}
    total_rows = 0

    for family_code in unique_family_codes:
        family_mask = master_df["family_code"].map(sanitize_family_code) == family_code
        family_df = master_df.loc[family_mask].copy()
        export_df = prepare_family_export(family_df)

        csv_path = FAMILIES_DIR / f"{family_code}.csv"
        export_df.to_csv(csv_path, index=False, encoding="utf-8")

        trials_payload["families"].append(
            {
                "familyId": family_code,
                "file": f"families/{family_code}.csv",
            }
        )
        total_rows += len(export_df)

    TRIALS_JSON.parent.mkdir(parents=True, exist_ok=True)
    with TRIALS_JSON.open("w", encoding="utf-8") as trials_file:
        json.dump(trials_payload, trials_file, ensure_ascii=False, indent=2)
        trials_file.write("\n")

    return len(unique_family_codes), total_rows


def main() -> int:
    try:
        family_count, row_count = export_stimuli()
    except Exception as error:
        print(f"Export failed: {error}", file=sys.stderr)
        return 1

    print(f"Exported {family_count} families and {row_count} rows.")
    print(f"CSV output: {FAMILIES_DIR}")
    print(f"Trials manifest: {TRIALS_JSON}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
