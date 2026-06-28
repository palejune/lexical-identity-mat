"use client";

import { useCallback, useEffect, useState } from "react";
import { ExperimentBoard } from "@/components/experiment/ExperimentBoard";
import { ExperimentEndScreen } from "@/components/experiment/ExperimentEndScreen";
import { ExperimentStartScreen } from "@/components/experiment/ExperimentStartScreen";
import { DebugPanel } from "@/components/experiment/DebugPanel";
import { buildParticipantResult } from "@/lib/experiment/buildParticipantResult";
import { downloadParticipantResult } from "@/lib/experiment/downloadResult";
import {
  loadFamilyCsvFromUrl,
  loadTrialsManifest,
} from "@/lib/experiment/loadTrials";
import type {
  ExperimentData,
  FamilyResult,
  ParticipantResult,
  TrialsManifest,
} from "@/lib/experiment/types";

export default function Home() {
  const [participantId, setParticipantId] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [manifest, setManifest] = useState<TrialsManifest | null>(null);
  const [currentFamilyIndex, setCurrentFamilyIndex] = useState(0);
  const [currentTrial, setCurrentTrial] = useState<ExperimentData | null>(null);
  const [isTrialLoading, setIsTrialLoading] = useState(false);
  const [familyResults, setFamilyResults] = useState<FamilyResult[]>([]);
  const [participantResult, setParticipantResult] =
    useState<ParticipantResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrialsManifest()
      .then(setManifest)
      .catch((loadError: unknown) => {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "trials.json을 불러오지 못했습니다.";
        setError(message);
      });
  }, []);

  useEffect(() => {
    if (!manifest || !hasStarted || isFinished) {
      return;
    }

    const manifestEntry = manifest.families[currentFamilyIndex];
    if (!manifestEntry) {
      return;
    }

    let isCancelled = false;
    setIsTrialLoading(true);
    setCurrentTrial(null);

    loadFamilyCsvFromUrl(manifestEntry.file)
      .then((trialData) => {
        if (!isCancelled) {
          setCurrentTrial(trialData);
        }
      })
      .catch((loadError: unknown) => {
        if (!isCancelled) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : "family CSV를 불러오지 못했습니다.";
          setError(message);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsTrialLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [manifest, hasStarted, isFinished, currentFamilyIndex]);

  const trimmedParticipantId = participantId.trim();

  const handleFamilyComplete = useCallback(
    (result: FamilyResult) => {
      if (!manifest) {
        return;
      }

      const updatedFamilyResults = [...familyResults, result];
      setFamilyResults(updatedFamilyResults);

      const isLastFamily =
        currentFamilyIndex >= manifest.families.length - 1;

      if (isLastFamily) {
        setParticipantResult(
          buildParticipantResult(
            trimmedParticipantId,
            updatedFamilyResults,
            new Date().toISOString(),
          ),
        );
        setIsFinished(true);
        return;
      }

      setCurrentFamilyIndex((previous) => previous + 1);
    },
    [
      currentFamilyIndex,
      manifest,
      familyResults,
      trimmedParticipantId,
    ],
  );

  const handleDownload = useCallback(() => {
    if (!participantResult) {
      return;
    }

    downloadParticipantResult(participantResult);
  }, [participantResult]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      </div>
    );
  }

  if (!manifest) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-600">trials.json을 불러오는 중...</p>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <ExperimentStartScreen
        participantId={participantId}
        onParticipantIdChange={setParticipantId}
        onStart={() => setHasStarted(true)}
      />
    );
  }

  if (isFinished && participantResult) {
    return (
      <div className="relative min-h-screen">
        <ExperimentEndScreen
          participantId={trimmedParticipantId}
          onDownload={handleDownload}
        />
        <DebugPanel result={participantResult} />
      </div>
    );
  }

  if (isTrialLoading || !currentTrial) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-600">
          family CSV를 불러오는 중... ({currentFamilyIndex + 1} /{" "}
          {manifest.families.length})
        </p>
      </div>
    );
  }

  return (
    <ExperimentBoard
      key={currentTrial.trialId}
      trial={currentTrial}
      participantId={trimmedParticipantId}
      familyIndex={currentFamilyIndex}
      totalFamilies={manifest.families.length}
      onFamilyComplete={handleFamilyComplete}
    />
  );
}
