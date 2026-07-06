interface ResizeRestartModalProps {
  onRestart: () => void;
}

export function ResizeRestartModal({ onRestart }: ResizeRestartModalProps) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="resize-restart-title"
        aria-describedby="resize-restart-description"
        className="w-full max-w-md rounded-2xl border border-amber-200 bg-white p-6 text-center shadow-lg"
      >
        <p
          id="resize-restart-title"
          className="text-base font-semibold text-amber-900"
        >
          실험 도중 창 크기를 변경하지 마십시오
        </p>
        <p
          id="resize-restart-description"
          className="mt-3 text-sm leading-relaxed text-slate-600"
        >
          창 크기가 변경되어 배치가 초기화되었습니다. 현재 trial을 다시
          시작하려면 아래 버튼을 눌러 주세요.
        </p>
        <button
          type="button"
          onClick={onRestart}
          className="mt-6 w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
        >
          현재 세션 다시 시작
        </button>
      </div>
    </div>
  );
}
