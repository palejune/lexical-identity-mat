interface AnchorTokenProps {
  text: string;
}

export function AnchorToken({ text }: AnchorTokenProps) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 select-none flex-col items-center justify-center rounded-full border border-violet-200 bg-white text-center shadow-md"
      aria-label="기준 표현"
      role="status"
    >
      <span className="px-2 text-lg font-bold leading-tight text-slate-900">
        {text}
      </span>
    </div>
  );
}
