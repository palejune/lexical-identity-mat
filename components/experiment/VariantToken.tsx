"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { Size } from "@/lib/experiment/placementCircle";
import type { Position } from "@/lib/experiment/types";

interface VariantTokenProps {
  id: string;
  text: string;
  position: Position;
  boardRef: RefObject<HTMLDivElement | null>;
  onPositionChange: (id: string, position: Position) => void;
  onSizeChange: (id: string, size: Size) => void;
  onActivate: (id: string) => void;
  isActive?: boolean;
  interactive?: boolean;
}

export function VariantToken({
  id,
  text,
  position,
  boardRef,
  onPositionChange,
  onSizeChange,
  onActivate,
  isActive = false,
  interactive = true,
}: VariantTokenProps) {
  const tokenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = tokenRef.current;
    if (!element) {
      return;
    }

    const reportSize = () => {
      const rect = element.getBoundingClientRect();
      onSizeChange(id, {
        width: rect.width,
        height: rect.height,
      });
    };

    reportSize();

    const resizeObserver = new ResizeObserver(reportSize);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [id, onSizeChange, text]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive) {
        return;
      }

      event.preventDefault();
      onActivate(id);

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
    [boardRef, id, interactive, onActivate, onPositionChange, position.x, position.y],
  );

  return (
    <div
      ref={tokenRef}
      className={`absolute -translate-x-1/2 -translate-y-1/2 select-none rounded-xl border border-slate-200 bg-white px-5 py-3 text-center shadow-md ${
        isActive ? "z-30" : "z-20"
      } ${
        interactive
          ? "cursor-grab transition-shadow active:cursor-grabbing active:shadow-lg"
          : "pointer-events-none opacity-80"
      }`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
      role="button"
      tabIndex={0}
      aria-label={`variant: ${text}`}
    >
      <span className="whitespace-nowrap text-lg font-medium text-slate-800">
        {text}
      </span>
    </div>
  );
}
