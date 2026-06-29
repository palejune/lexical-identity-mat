"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import type { FamilyResult, ParticipantResult } from "./types";

export type SaveStatus = "idle" | "saving" | "success" | "error";

export async function saveFamilyResult(result: FamilyResult): Promise<string> {
  const docRef = await addDoc(collection(getFirestoreDb(), "responses"), {
    ...result,
    savedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function saveParticipantSession(
  result: ParticipantResult,
): Promise<string> {
  const docRef = await addDoc(collection(getFirestoreDb(), "sessions"), {
    ...result,
    savedAt: serverTimestamp(),
  });

  return docRef.id;
}
