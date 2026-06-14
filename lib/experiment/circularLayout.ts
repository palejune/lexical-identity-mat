import type { Position } from "./types";

export function generateCircularPositions(
  count: number,
  centerX: number,
  centerY: number,
  radius: number,
): Position[] {
  if (count === 0) {
    return [];
  }

  const startAngle = Math.random() * 2 * Math.PI;
  const angleStep = (2 * Math.PI) / count;

  return Array.from({ length: count }, (_, index) => {
    const angle = startAngle + index * angleStep;

    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
}
