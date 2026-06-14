interface ExperimentStartScreenProps {
  participantId: string;
  onParticipantIdChange: (value: string) => void;
  onStart: () => void;
}

export function ExperimentStartScreen({
  participantId,
  onParticipantIdChange,
  onStart,
}: ExperimentStartScreenProps) {
  const trimmedParticipantId = participantId.trim();
  const canStart = trimmedParticipantId.length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canStart) {
      onStart();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <main className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">실험 시작</h1>
        <p className="mt-2 text-sm text-slate-600">
          참가자 ID를 입력한 뒤 Start 버튼을 눌러 실험을 시작하세요.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="participantId"
              className="block text-sm font-medium text-slate-700"
            >
              Participant ID
            </label>
            <input
              id="participantId"
              type="text"
              value={participantId}
              onChange={(event) => onParticipantIdChange(event.target.value)}
              placeholder="예: P001"
              autoComplete="off"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            disabled={!canStart}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Start
          </button>
        </form>
      </main>
    </div>
  );
}
