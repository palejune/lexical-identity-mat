interface CompleteButtonProps {
  onComplete: () => void | Promise<void>;
  disabled?: boolean;
  inactive?: boolean;
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

export function CompleteButton({
  onComplete,
  disabled = false,
  inactive = false,
}: CompleteButtonProps) {
  const isVisuallyInactive = inactive && !disabled;

  return (
    <button
      type="button"
      onClick={onComplete}
      disabled={disabled}
      aria-disabled={disabled || inactive}
      className={`absolute bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors disabled:cursor-not-allowed disabled:bg-slate-300 ${
        isVisuallyInactive
          ? "cursor-pointer bg-slate-300 hover:bg-slate-300"
          : "bg-violet-600 hover:bg-violet-700"
      }`}
    >
      {isVisuallyInactive && <LockIcon />}
      완료
    </button>
  );
}
