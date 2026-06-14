"use client";

import { useEffect, useState } from "react";
import { ExperimentBoard } from "@/components/experiment/ExperimentBoard";
import { ExperimentStartScreen } from "@/components/experiment/ExperimentStartScreen";
import { loadStimuliFromUrl } from "@/lib/experiment/loadStimuliFromUrl";
import type { ExperimentData } from "@/lib/experiment/types";

export default function Home() {
  const [participantId, setParticipantId] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [data, setData] = useState<ExperimentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStimuliFromUrl()
      .then(setData)
      .catch((loadError: unknown) => {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "자극 데이터를 불러오지 못했습니다.";
        setError(message);
      });
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-600">자극 데이터를 불러오는 중...</p>
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

  return (
    <ExperimentBoard
      data={data}
      participantId={participantId.trim()}
      trialId="trial-001"
    />
  );
}
