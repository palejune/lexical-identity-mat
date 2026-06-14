import type { Position } from "./types";

export function normalizeX(x: number, boardWidth: number): number {
  if (boardWidth <= 0) {
    return 0;
  }

  return x / boardWidth;
}

export function normalizeY(y: number, boardHeight: number): number {
  if (boardHeight <= 0) {
    return 0;
  }

  return y / boardHeight;
}

export function normalizeDistance(
  distance: number,
  boardWidth: number,
  boardHeight: number,
): number {
  const minDimension = Math.min(boardWidth, boardHeight);

  if (minDimension <= 0) {
    return 0;
  }

  return distance / minDimension;
}

export function normalizePosition(
  position: Position,
  boardWidth: number,
  boardHeight: number,
): { normalizedX: number; normalizedY: number } {
  return {
    normalizedX: normalizeX(position.x, boardWidth),
    normalizedY: normalizeY(position.y, boardHeight),
  };
}
