interface ParticipantInfoScreenProps {
  name: string;
  age: string;
  onNameChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onContinue: () => void;
}

export function ParticipantInfoScreen({
  name,
  age,
  onNameChange,
  onAgeChange,
  onContinue,
}: ParticipantInfoScreenProps) {
  const trimmedName = name.trim();
  const trimmedAge = age.trim();
  const canContinue = trimmedName.length > 0 && trimmedAge.length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canContinue) {
      onContinue();
    }
  };

  const handleAgeChange = (value: string) => {
    onAgeChange(value.replace(/\D/g, ""));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8 sm:px-6">
      <main className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          어휘동일성 실험
        </h1>

        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700 sm:text-[0.9375rem]">
          <p>
            본 실험은 어휘의 동일성 판단의 인지과정을 확인하기 위한
            실험입니다.
          </p>
          <p>
            본 실험을 위해 제공된 개인정보는 실험 이외의 목적으로는 절대
            사용되지 않으며, 연구가 종결되는 즉시 폐기됩니다.
          </p>
        </div>

        <form className="mt-6 space-y-6 sm:mt-8" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="participantName"
              className="block text-sm font-medium text-slate-700"
            >
              이름
            </label>
            <input
              id="participantName"
              type="text"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              autoComplete="name"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="participantAge"
              className="block text-sm font-medium text-slate-700"
            >
              나이
            </label>
            <input
              id="participantAge"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={age}
              onChange={(event) => handleAgeChange(event.target.value)}
              autoComplete="off"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <p className="text-sm leading-relaxed text-slate-600">
            실험에 참여하시려면 아래 버튼을 눌러 실험 안내 페이지를
            확인해주세요.
          </p>

          <button
            type="submit"
            disabled={!canContinue}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            실험 안내 페이지로 이동
          </button>
        </form>
      </main>
    </div>
  );
}
