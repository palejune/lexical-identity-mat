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
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8 sm:px-6">
      <main className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">실험 시작</h1>
        <p className="mt-2 text-sm text-slate-600">
          참가자 ID를 입력한 뒤 실험 시작 버튼을 눌러 주세요.
        </p>

        <form className="mt-6 space-y-6 sm:mt-8" onSubmit={handleSubmit}>
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

          <section
            aria-labelledby="experiment-instructions-title"
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
          >
            <h2
              id="experiment-instructions-title"
              className="text-base font-semibold text-slate-900 sm:text-lg"
            >
              실험 안내
            </h2>

            <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700 sm:text-[0.9375rem]">
              <p>화면 중앙에는 기준이 되는 표현이 제시됩니다.</p>
              <p>
                주변의 표현들을 중앙의 표현과 같은 대상을 가리키는 표현이라고
                느끼는 정도에 따라 자유롭게 배치해 주세요.
              </p>

              <ul className="list-none space-y-1.5 pl-0">
                <li className="flex gap-2">
                  <span aria-hidden="true" className="shrink-0">
                    *
                  </span>
                  <span>같은 표현이라고 느낄수록 중앙에 가깝게</span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden="true" className="shrink-0">
                    *
                  </span>
                  <span>다른 표현이라고 느낄수록 중앙에서 멀리</span>
                </li>
              </ul>

              <p>배치 방향에는 정답이 없습니다.</p>
              <p>중앙 표현과의 거리를 중심으로 판단해 주세요.</p>
              <p className="font-medium text-slate-800">
                빠르게 답하기보다는 자연스럽게 느껴지는 위치에 배치해 주시면
                됩니다.
              </p>
            </div>
          </section>

          <button
            type="submit"
            disabled={!canStart}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            실험 시작
          </button>
        </form>
      </main>
    </div>
  );
}
