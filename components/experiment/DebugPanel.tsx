import type { ExperimentResult } from "@/lib/experiment/types";

interface DebugPanelProps {
  result: ExperimentResult;
}

export function DebugPanel({ result }: DebugPanelProps) {
  return (
    <aside
      className="pointer-events-none absolute bottom-4 right-4 z-50 max-h-[40vh] w-80 overflow-auto rounded-lg border border-slate-300 bg-white/95 p-3 shadow-lg backdrop-blur-sm"
      aria-label="디버그 패널"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Debug — buildResult()
      </p>
      <pre className="whitespace-pre-wrap break-all font-mono text-xs text-slate-800">
        {JSON.stringify(result, null, 2)}
      </pre>
    </aside>
  );
}
