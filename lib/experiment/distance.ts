import type { Position } from "./types";

export function calculateDistanceToAnchor(
  position: Position,
  anchor: Position,
): number {
  const dx = position.x - anchor.x;
  const dy = position.y - anchor.y;
  return Math.hypot(dx, dy);
}
