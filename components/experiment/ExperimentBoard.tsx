"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { downloadExperimentResult } from "@/lib/experiment/downloadResult";
import { calculateDistanceToAnchor } from "@/lib/experiment/distance";
import { generateCircularPositions } from "@/lib/experiment/circularLayout";
import {
  normalizeDistance,
  normalizeX,
  normalizeY,
} from "@/lib/experiment/normalize";
import type {
  ExperimentData,
  ExperimentResult,
  Position,
} from "@/lib/experiment/types";
import { AnchorToken } from "./AnchorToken";
import { CompleteButton } from "./CompleteButton";
import { DebugPanel } from "./DebugPanel";
import { VariantToken } from "./VariantToken";

interface ExperimentBoardProps {
  data: ExperimentData;
  participantId: string;
  trialId: string;
}

export function ExperimentBoard({
  data,
  participantId,
  trialId,
}: ExperimentBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const initialBoardSizeRef = useRef<{ width: number; height: number } | null>(
    null,
  );
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [anchorPosition, setAnchorPosition] = useState<Position | null>(null);
  const [boardSize, setBoardSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasResized, setHasResized] = useState(false);

  const initializePositions = useCallback(() => {
    const board = boardRef.current;
    if (!board) {
      return;
    }

    const { width, height } = board.getBoundingClientRect();
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.32;

    const circularPositions = generateCircularPositions(
      data.variants.length,
      centerX,
      centerY,
      radius,
    );

    const initialPositions: Record<string, Position> = {};
    data.variants.forEach((variant, index) => {
      initialPositions[variant.id] = circularPositions[index];
    });

    setPositions(initialPositions);
    setAnchorPosition({ x: centerX, y: centerY });
    setBoardSize({ width, height });
    initialBoardSizeRef.current = { width, height };
    setIsReady(true);
  }, [data.variants]);

  useEffect(() => {
    initializePositions();
  }, [initializePositions]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const board = boardRef.current;
    if (!board) {
      return;
    }

    const handleResize = () => {
      const initialSize = initialBoardSizeRef.current;
      if (!initialSize) {
        return;
      }

      const { width, height } = board.getBoundingClientRect();
      if (width !== initialSize.width || height !== initialSize.height) {
        setHasResized(true);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(board);
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [isReady]);

  const handlePositionChange = useCallback((id: string, position: Position) => {
    setPositions((previous) => ({
      ...previous,
      [id]: position,
    }));
  }, []);

  const buildResult = useCallback((): ExperimentResult => {
    const anchor = anchorPosition ?? { x: 0, y: 0 };
    const boardWidth = boardSize?.width ?? 0;
    const boardHeight = boardSize?.height ?? 0;

    return {
      participantId,
      trialId,
      boardWidth,
      boardHeight,
      anchor: {
        text: data.anchor,
        x: anchor.x,
        y: anchor.y,
      },
      completedAt: new Date().toISOString(),
      items: data.variants.map((variant) => {
        const position = positions[variant.id] ?? { x: 0, y: 0 };
        const distanceToAnchor = calculateDistanceToAnchor(position, anchor);

        return {
          id: variant.id,
          text: variant.text,
          x: position.x,
          y: position.y,
          distanceToAnchor,
          normalizedX: normalizeX(position.x, boardWidth),
          normalizedY: normalizeY(position.y, boardHeight),
          normalizedDistance: normalizeDistance(
            distanceToAnchor,
            boardWidth,
            boardHeight,
          ),
        };
      }),
    };
  }, [participantId, trialId, data, positions, anchorPosition, boardSize]);

  const handleComplete = useCallback(() => {
    downloadExperimentResult(buildResult());
  }, [buildResult]);

  return (
    <div
      ref={boardRef}
      className="relative h-screen w-full overflow-hidden bg-slate-100"
    >
      <AnchorToken text={data.anchor} />

      {isReady &&
        data.variants.map((variant) => {
          const position = positions[variant.id];
          if (!position) {
            return null;
          }

          return (
            <VariantToken
              key={variant.id}
              id={variant.id}
              text={variant.text}
              position={position}
              boardRef={boardRef}
              onPositionChange={handlePositionChange}
            />
          );
        })}

      {hasResized && (
        <div
          role="alert"
          className="absolute left-1/2 top-4 z-50 -translate-x-1/2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 shadow-md"
        >
          실험 도중 창 크기를 변경하지 마십시오
        </div>
      )}

      {isReady && <DebugPanel result={buildResult()} />}

      {isReady && (
        <CompleteButton onComplete={handleComplete} disabled={hasResized} />
      )}
    </div>
  );
}
