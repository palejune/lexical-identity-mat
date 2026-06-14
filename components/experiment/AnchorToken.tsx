interface AnchorTokenProps {
  text: string;
}

export function AnchorToken({ text }: AnchorTokenProps) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 select-none rounded-xl border-2 border-blue-600 bg-blue-50 px-6 py-4 text-center shadow-md"
      aria-label="기준 표현"
      role="status"
    >
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-blue-600">
        Anchor
      </span>
      <span className="text-2xl font-bold text-slate-900">{text}</span>
    </div>
  );
}
