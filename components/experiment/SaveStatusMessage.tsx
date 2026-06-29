import type { SaveStatus } from "@/lib/experiment/saveResult";

interface SaveStatusMessageProps {
  status: SaveStatus;
  errorMessage?: string | null;
}

export function SaveStatusMessage({
  status,
  errorMessage,
}: SaveStatusMessageProps) {
  if (status === "idle") {
    return null;
  }

  if (status === "saving") {
    return (
      <p
        role="status"
        className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800"
      >
        결과를 저장하는 중...
      </p>
    );
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
      >
        결과가 성공적으로 저장되었습니다.
      </p>
    );
  }

  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {errorMessage ?? "결과 저장에 실패했습니다."}
    </p>
  );
}
