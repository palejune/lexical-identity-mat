"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildTrialResult } from "@/lib/experiment/buildTrialResult";
import {
  ESTIMATED_TOKEN_SIZE,
  generateCircularOutsidePositions,
  getPlacementCircleRadius,
  isTokenFullyInsideCircle,
  type Size,
} from "@/lib/experiment/placementCircle";
import type {
  ExperimentData,
  Position,
  TrialResult,
} from "@/lib/experiment/types";
import { AnchorToken } from "./AnchorToken";
import { CompleteButton } from "./CompleteButton";
import { DebugPanel } from "./DebugPanel";
import { ExperimentBoardHeader } from "./ExperimentBoardHeader";
import { PlacementCircle } from "./PlacementCircle";
import { PlacementWarningModal } from "./PlacementWarningModal";
import { ResizeRestartModal } from "./ResizeRestartModal";
import { VariantToken } from "./VariantToken";

interface ExperimentBoardProps {
  trial: ExperimentData;
  familyIndex: number;
  totalFamilies: number;
  onFamilyComplete: (result: TrialResult) => void | Promise<void>;
}

export function ExperimentBoard({
  trial,
  familyIndex,
  totalFamilies,
  onFamilyComplete,
}: ExperimentBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const stableBoardSizeRef = useRef<{ width: number; height: number } | null>(
    null,
  );
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [tokenSizes, setTokenSizes] = useState<Record<string, Size>>({});
  const [anchorPosition, setAnchorPosition] = useState<Position | null>(null);
  const [placementRadius, setPlacementRadius] = useState(0);
  const [boardSize, setBoardSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasResized, setHasResized] = useState(false);
  const [showPlacementWarning, setShowPlacementWarning] = useState(false);
  const [layoutKey, setLayoutKey] = useState(0);
  const [activeTokenId, setActiveTokenId] = useState<string | null>(null);

  const applyTrialLayout = useCallback(
    (options?: { clearTokenSizes?: boolean }) => {
      const board = boardRef.current;
      if (!board) {
        return null;
      }

      const { width, height } = board.getBoundingClientRect();
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = getPlacementCircleRadius(width, height);
      const outsidePositions = generateCircularOutsidePositions(
        trial.variants.length,
        { x: centerX, y: centerY },
        radius,
        ESTIMATED_TOKEN_SIZE,
        width,
        height,
      );

      const nextPositions: Record<string, Position> = {};
      trial.variants.forEach((variant, index) => {
        nextPositions[variant.id] = outsidePositions[index] ?? {
          x: centerX,
          y: centerY,
        };
      });

      setPositions(nextPositions);
      if (options?.clearTokenSizes) {
        setTokenSizes({});
        setLayoutKey((previous) => previous + 1);
      }
      setActiveTokenId(null);
      setAnchorPosition({ x: centerX, y: centerY });
      setPlacementRadius(radius);
      setBoardSize({ width, height });

      return { width, height };
    },
    [trial.variants],
  );

  const initializeTrial = useCallback(() => {
    const size = applyTrialLayout({ clearTokenSizes: true });
    if (size) {
      stableBoardSizeRef.current = size;
    }
    setHasResized(false);
    setShowPlacementWarning(false);
    setIsReady(true);
  }, [applyTrialLayout]);

  const handleRestartSession = useCallback(() => {
    const size = applyTrialLayout({ clearTokenSizes: false });
    if (size) {
      stableBoardSizeRef.current = size;
    }
    setHasResized(false);
    setShowPlacementWarning(false);
  }, [applyTrialLayout]);

  useEffect(() => {
    setIsReady(false);
    initializeTrial();
  }, [initializeTrial, trial.trialId]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const board = boardRef.current;
    if (!board) {
      return;
    }

    const handleResize = () => {
      const stableSize = stableBoardSizeRef.current;
      if (!stableSize) {
        return;
      }

      const { width, height } = board.getBoundingClientRect();
      if (stableSize.width === width && stableSize.height === height) {
        return;
      }

      applyTrialLayout({ clearTokenSizes: true });
      setHasResized(true);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(board);
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [applyTrialLayout, isReady, trial.trialId]);

  const handlePositionChange = useCallback((id: string, position: Position) => {
    setPositions((previous) => ({
      ...previous,
      [id]: position,
    }));
  }, []);

  const handleTokenSizeChange = useCallback((id: string, size: Size) => {
    setTokenSizes((previous) => {
      const current = previous[id];
      if (
        current?.width === size.width &&
        current?.height === size.height
      ) {
        return previous;
      }

      return {
        ...previous,
        [id]: size,
      };
    });
  }, []);

  const allTokenSizesMeasured = useMemo(
    () =>
      trial.variants.every((variant) => {
        const size = tokenSizes[variant.id];
        return size !== undefined && size.width > 0 && size.height > 0;
      }),
    [trial.variants, tokenSizes],
  );

  const allTokensInside = useMemo(() => {
    if (!anchorPosition || !allTokenSizesMeasured || placementRadius <= 0) {
      return false;
    }

    return trial.variants.every((variant) => {
      const position = positions[variant.id];
      const size = tokenSizes[variant.id];

      if (!position || !size) {
        return false;
      }

      return isTokenFullyInsideCircle(
        position,
        size,
        anchorPosition,
        placementRadius,
      );
    });
  }, [
    allTokenSizesMeasured,
    anchorPosition,
    placementRadius,
    positions,
    tokenSizes,
    trial.variants,
  ]);

  const buildTrialResultForBoard = useCallback((): TrialResult => {
    return buildTrialResult({
      trialId: trial.trialId,
      anchorText: trial.anchor,
      variants: trial.variants,
      positions,
      anchorCenter: anchorPosition ?? { x: 0, y: 0 },
      boardWidth: boardSize?.width ?? 0,
      boardHeight: boardSize?.height ?? 0,
      circleRadius: placementRadius,
    });
  }, [trial, positions, anchorPosition, boardSize, placementRadius]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCompleteClick = useCallback(async () => {
    if (isSubmitting || hasResized) {
      return;
    }

    if (!allTokensInside) {
      setShowPlacementWarning(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await onFamilyComplete(buildTrialResultForBoard());
    } finally {
      setIsSubmitting(false);
    }
  }, [
    allTokensInside,
    buildTrialResultForBoard,
    hasResized,
    isSubmitting,
    onFamilyComplete,
  ]);

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      <ExperimentBoardHeader
        familyIndex={familyIndex}
        totalFamilies={totalFamilies}
      />

      <div ref={boardRef} className="relative min-h-0 flex-1 overflow-hidden">
        {isReady && anchorPosition && placementRadius > 0 && (
          <PlacementCircle
            center={anchorPosition}
            radius={placementRadius}
          />
        )}

        <AnchorToken text={trial.anchor} />

        {isReady &&
          trial.variants.map((variant) => {
            const position = positions[variant.id];
            if (!position) {
              return null;
            }

            return (
              <VariantToken
                key={`${variant.id}-${layoutKey}`}
                id={variant.id}
                text={variant.text}
                position={position}
                boardRef={boardRef}
                onPositionChange={handlePositionChange}
                onSizeChange={handleTokenSizeChange}
                onActivate={setActiveTokenId}
                isActive={activeTokenId === variant.id}
                interactive={!hasResized}
              />
            );
          })}

        {isReady && !hasResized && (
          <DebugPanel result={buildTrialResultForBoard()} />
        )}

        {isReady && !hasResized && (
          <CompleteButton
            onComplete={handleCompleteClick}
            disabled={isSubmitting}
            inactive={!allTokensInside}
          />
        )}

        {showPlacementWarning && (
          <PlacementWarningModal
            onClose={() => setShowPlacementWarning(false)}
          />
        )}

        {hasResized && (
          <ResizeRestartModal onRestart={handleRestartSession} />
        )}
      </div>
    </div>
  );
}
