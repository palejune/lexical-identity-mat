import { calculateDistanceToAnchor } from "./distance";
import {
  normalizeDistance,
  normalizeX,
  normalizeY,
} from "./normalize";
import type { Position, TrialResult, VariantItem } from "./types";

export interface BuildTrialResultInput {
  trialId: string;
  anchorText: string;
  variants: VariantItem[];
  positions: Record<string, Position>;
  anchorCenter: Position;
  boardWidth: number;
  boardHeight: number;
  circleRadius: number;
  completedAt?: string;
}

export function buildTrialResult(input: BuildTrialResultInput): TrialResult {
  const completedAt = input.completedAt ?? new Date().toISOString();

  return {
    trialId: input.trialId,
    workspace: {
      boardWidth: input.boardWidth,
      boardHeight: input.boardHeight,
      circleRadius: input.circleRadius,
      circleCenter: {
        x: input.anchorCenter.x,
        y: input.anchorCenter.y,
      },
    },
    anchor: {
      text: input.anchorText,
    },
    completedAt,
    items: input.variants.map((variant) => {
      const position = input.positions[variant.id] ?? { x: 0, y: 0 };
      const distanceToAnchor = calculateDistanceToAnchor(
        position,
        input.anchorCenter,
      );

      return {
        id: variant.id,
        text: variant.text,
        x: position.x,
        y: position.y,
        distanceToAnchor,
        normalizedX: normalizeX(position.x, input.boardWidth),
        normalizedY: normalizeY(position.y, input.boardHeight),
        normalizedDistance: normalizeDistance(
          distanceToAnchor,
          input.boardWidth,
          input.boardHeight,
        ),
      };
    }),
  };
}
