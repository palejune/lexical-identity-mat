interface PlacementWarningModalProps {
  onClose: () => void;
}

export function PlacementWarningModal({ onClose }: PlacementWarningModalProps) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="placement-warning-title"
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <p
          id="placement-warning-title"
          className="text-base font-medium text-slate-900"
        >
          모든 단어를 원 안에 배치해 주세요.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          확인
        </button>
      </div>
    </div>
  );
}
