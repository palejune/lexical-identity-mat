interface ExperimentInstructionsScreenProps {
  onStart: () => void;
}

export function ExperimentInstructionsScreen({
  onStart,
}: ExperimentInstructionsScreenProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onStart();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8 sm:px-6">
      <main className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          실험 안내
        </h1>

        <section
          aria-labelledby="experiment-instructions-body"
          className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:mt-8 sm:p-5"
        >
          <div
            id="experiment-instructions-body"
            className="space-y-3 text-sm leading-relaxed text-slate-700 sm:text-[0.9375rem]"
          >
            <p>화면 중앙에는 기준이 되는 표현이 제시됩니다.</p>
            <p>
              주변의 표현들을 중앙의 표현과 같은 대상을 가리키는 표현이라고
              느끼는 정도에 따라 자유롭게 배치해 주세요.
            </p>

            <ul className="list-none space-y-1.5 pl-0">
              <li className="font-bold text-slate-900">
                중앙의 표현과 같은 표현이라고 느낄수록 중앙에 가깝게
              </li>
              <li className="font-bold text-slate-900">
                중앙의 표현과 다른 표현이라고 느낄수록 중앙에서 멀리
              </li>
              <li className="font-bold text-slate-900">
                배치 방향에는 정답이 없습니다.
              </li>
            </ul>

            <p>중앙 표현과의 거리를 중심으로 판단해 주세요.</p>
            <p>
              빠르게 답하기보다는 자연스럽게 느껴지는 위치에 배치해 주시면
              됩니다.
            </p>

            <p className="font-medium text-red-600">
              실험 중간에 창 크기를 변경하지 마세요. 창 크기가 바뀔 경우
              변화가 감지된 실험부터 다시 시작됩니다.
            </p>
          </div>
        </section>

        <p className="mt-6 text-sm leading-relaxed text-slate-600 sm:mt-8">
          실험 요령을 확인 하셨으면 아래 버튼을 눌러 실험을 시작해주세요.
        </p>

        <form className="mt-4" onSubmit={handleSubmit}>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            실험 시작
          </button>
        </form>
      </main>
    </div>
  );
}
