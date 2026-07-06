import type { Position } from "@/lib/experiment/types";
import { PLACEMENT_CIRCLE_STROKE_WIDTH } from "@/lib/experiment/placementCircle";

interface PlacementCircleProps {
  center: Position;
  radius: number;
}

export function PlacementCircle({ center, radius }: PlacementCircleProps) {
  const diameter = radius * 2;

  return (
    <div
      className="pointer-events-none absolute z-[1] box-border rounded-full bg-violet-50/95 shadow-inner"
      style={{
        left: center.x - radius,
        top: center.y - radius,
        width: diameter,
        height: diameter,
        borderWidth: PLACEMENT_CIRCLE_STROKE_WIDTH,
        borderStyle: "dashed",
        borderColor: "rgb(196 181 253)",
      }}
      aria-hidden="true"
    />
  );
}
