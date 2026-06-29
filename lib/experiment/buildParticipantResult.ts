import type { FamilyResult, ParticipantResult } from "./types";

export function buildParticipantResult(
  participantId: string,
  name: string,
  age: number,
  families: FamilyResult[],
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
