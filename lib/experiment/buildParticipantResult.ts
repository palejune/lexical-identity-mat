import type { ParticipantResult, TrialResult } from "./types";

export function buildParticipantResult(
  participantId: string,
  name: string,
  age: number,
  families: TrialResult[],
  completedAt: string,
): ParticipantResult {
  return {
    participantId,
    name,
    age,
    completedAt,
    families,
  };
}
