interface ExperimentBoardHeaderProps {
  familyIndex: number;
  totalFamilies: number;
}

export function ExperimentBoardHeader({
  familyIndex,
  totalFamilies,
}: ExperimentBoardHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
          어휘동일성 실험
        </h1>
        <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700">
          Trial {familyIndex + 1} / {totalFamilies}
        </span>
      </div>
    </header>
  );
}
