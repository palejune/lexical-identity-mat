"use client";

import { useCallback, type RefObject } from "react";
import type { Position } from "@/lib/experiment/types";

interface VariantTokenProps {
  id: string;
  text: string;
  position: Position;
  boardRef: RefObject<HTMLDivElement | null>;
  onPositionChange: (id: string, position: Position) => void;
}

export function VariantToken({
  id,
  text,
  position,
  boardRef,
  onPositionChange,
}: VariantTokenProps) {
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();

      const board = boardRef.current;
      if (!board) {
        return;
      }

      const boardRect = board.getBoundingClientRect();
      const pointerX = event.clientX - boardRect.left;
      const pointerY = event.clientY - boardRect.top;
      const offsetX = pointerX - position.x;
      const offsetY = pointerY - position.y;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        onPositionChange(id, {
          x: moveEvent.clientX - boardRect.left - offsetX,
          y: moveEvent.clientY - boardRect.top - offsetY,
        });
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [boardRef, id, onPositionChange, position.x, position.y],
  );

  return (
    <div
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-grab select-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-center shadow-sm transition-shadow active:cursor-grabbing active:shadow-md"
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
      role="button"
      tabIndex={0}
      aria-label={`variant: ${text}`}
    >
      <span className="text-lg font-medium text-slate-800">{text}</span>
    </div>
  );
}
