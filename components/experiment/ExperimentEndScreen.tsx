import type { SaveStatus } from "@/lib/experiment/saveResult";
import { SaveStatusMessage } from "./SaveStatusMessage";

interface ExperimentEndScreenProps {
  participantId: string;
  saveStatus: SaveStatus;
  saveErrorMessage?: string | null;
}

export function ExperimentEndScreen({
  participantId,
  saveStatus,
  saveErrorMessage,
}: ExperimentEndScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <main className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">실험 종료</h1>
        <p className="mt-3 text-sm text-slate-600">
          모든 family trial을 완료했습니다.
        </p>
        <p className="mt-2 text-sm font-medium text-slate-800">
          Participant ID: {participantId}
        </p>

        <div className="mt-8">
          <SaveStatusMessage
            status={saveStatus}
            errorMessage={saveErrorMessage}
          />
        </div>
      </main>
    </div>
  );
}
