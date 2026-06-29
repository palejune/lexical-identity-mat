import type { FamilyResult, ParticipantResult } from "@/lib/experiment/types";
import { downloadParticipantResult } from "@/lib/experiment/downloadResult";
import { showDebugPanel } from "@/lib/showDebugPanel";

interface DebugPanelProps {
  result: FamilyResult | ParticipantResult;
}

function isParticipantResult(
  result: FamilyResult | ParticipantResult,
): result is ParticipantResult {
  return "families" in result;
}

export function DebugPanel({ result }: DebugPanelProps) {
  if (!showDebugPanel) {
    return null;
  }

  const handleDownload = () => {
    if (isParticipantResult(result)) {
      downloadParticipantResult(result);
    }
  };

  return (
    <aside
      className="absolute bottom-4 right-4 z-50 max-h-[40vh] w-80 overflow-auto rounded-lg border border-slate-300 bg-white/95 p-3 shadow-lg backdrop-blur-sm"
      aria-label="디버그 패널"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Debug
        </p>
        {isParticipantResult(result) && (
          <button
            type="button"
            onClick={handleDownload}
            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            JSON 다운로드
          </button>
        )}
      </div>
      <pre className="pointer-events-none whitespace-pre-wrap break-all font-mono text-xs text-slate-800">
        {JSON.stringify(result, null, 2)}
      </pre>
    </aside>
  );
}
