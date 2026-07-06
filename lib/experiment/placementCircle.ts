import type { Position } from "./types";

export interface Size {
  width: number;
  height: number;
}

/** Diameter as a fraction of the board's shorter side. */
export const PLACEMENT_CIRCLE_DIAMETER_RATIO = 0.85;

export const PLACEMENT_CIRCLE_STROKE_WIDTH = 2;

export const ESTIMATED_TOKEN_SIZE: Size = {
  width: 140,
  height: 56,
};

/** Gap between the placement circle edge and waiting tokens. */
const WAITING_RING_PADDING = 8;

/** Minimum inset from the board edge for token centers. */
const BOARD_EDGE_MARGIN = 16;

export function getPlacementCircleRadius(
  boardWidth: number,
  boardHeight: number,
): number {
  return (
    (Math.min(boardWidth, boardHeight) * PLACEMENT_CIRCLE_DIAMETER_RATIO) / 2
  );
}

export function getTokenCorners(center: Position, size: Size): Position[] {
  const halfWidth = size.width / 2;
  const halfHeight = size.height / 2;

  return [
    { x: center.x - halfWidth, y: center.y - halfHeight },
    { x: center.x + halfWidth, y: center.y - halfHeight },
    { x: center.x - halfWidth, y: center.y + halfHeight },
    { x: center.x + halfWidth, y: center.y + halfHeight },
  ];
}

function distanceBetween(a: Position, b: Position): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function getPlacementBoundaryRadius(radius: number): number {
  // Match the outer edge of the dashed stroke shown in the UI.
  return radius + PLACEMENT_CIRCLE_STROKE_WIDTH / 2;
}

export function isPointInsideCircle(
  point: Position,
  circleCenter: Position,
  radius: number,
): boolean {
  return distanceBetween(point, circleCenter) <= radius;
}

export function isTokenFullyInsideCircle(
  center: Position,
  size: Size,
  circleCenter: Position,
  radius: number,
): boolean {
  const boundaryRadius = getPlacementBoundaryRadius(radius);

  return getTokenCorners(center, size).every((corner) =>
    isPointInsideCircle(corner, circleCenter, boundaryRadius),
  );
}

export function generateCircularOutsidePositions(
  count: number,
  circleCenter: Position,
  placementRadius: number,
  tokenSize: Size,
  boardWidth: number,
  boardHeight: number,
): Position[] {
  if (count === 0) {
    return [];
  }

  const halfWidth = tokenSize.width / 2;
  const halfHeight = tokenSize.height / 2;
  const tokenRadius = Math.hypot(halfWidth, halfHeight);
  const minRingRadius = placementRadius + tokenRadius + WAITING_RING_PADDING;

  const maxRingRadius = Math.min(
    circleCenter.x - BOARD_EDGE_MARGIN - halfWidth,
    boardWidth - circleCenter.x - BOARD_EDGE_MARGIN - halfWidth,
    circleCenter.y - BOARD_EDGE_MARGIN - halfHeight,
    boardHeight - circleCenter.y - BOARD_EDGE_MARGIN - halfHeight,
  );

  const ringRadius =
    maxRingRadius >= minRingRadius ? minRingRadius : maxRingRadius;

  const startAngle = Math.random() * 2 * Math.PI;
  const angleStep = (2 * Math.PI) / count;

  return Array.from({ length: count }, (_, index) => {
    const angle = startAngle + index * angleStep;

    return {
      x: circleCenter.x + ringRadius * Math.cos(angle),
      y: circleCenter.y + ringRadius * Math.sin(angle),
    };
  });
}
