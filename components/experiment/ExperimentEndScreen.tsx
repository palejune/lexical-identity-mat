interface ExperimentEndScreenProps {
  participantId: string;
  onDownload: () => void;
}

export function ExperimentEndScreen({
  participantId,
  onDownload,
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

        <button
          type="button"
          onClick={onDownload}
          className="mt-8 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          결과 다운로드
        </button>
      </main>
    </div>
  );
}
