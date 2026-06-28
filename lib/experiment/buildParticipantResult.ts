import type { FamilyResult, ParticipantResult } from "./types";

export function buildParticipantResult(
  participantId: string,
  families: FamilyResult[],
  completedAt: string,
): ParticipantResult {
  return {
    participantId,
    completedAt,
    families,
  };
}
