interface CompleteButtonProps {
  onComplete: () => void;
  disabled?: boolean;
}

export function CompleteButton({ onComplete, disabled }: CompleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onComplete}
      disabled={disabled}
      className="absolute bottom-4 right-4 z-50 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      완료
    </button>
  );
}
