"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const FIREBASE_ENV_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

type FirebaseEnvKey = (typeof FIREBASE_ENV_KEYS)[number];

function readFirebaseEnvValues(): Record<FirebaseEnvKey, string | undefined> {
  // Next.js only inlines NEXT_PUBLIC_* when accessed with static property names.
  return {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

export function getMissingFirebaseEnvKeys(): FirebaseEnvKey[] {
  const envValues = readFirebaseEnvValues();

  return FIREBASE_ENV_KEYS.filter((key) => !envValues[key]?.trim());
}

function getFirebaseConfig() {
  const envValues = readFirebaseEnvValues();
  const missingKeys = getMissingFirebaseEnvKeys();

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missingKeys.join(", ")}`,
    );
  }

  return {
    apiKey: envValues.NEXT_PUBLIC_FIREBASE_API_KEY!.trim(),
    authDomain: envValues.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!.trim(),
    projectId: envValues.NEXT_PUBLIC_FIREBASE_PROJECT_ID!.trim(),
    storageBucket: envValues.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!.trim(),
    messagingSenderId:
      envValues.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!.trim(),
    appId: envValues.NEXT_PUBLIC_FIREBASE_APP_ID!.trim(),
  };
}

let firebaseApp: FirebaseApp | undefined;
let firestoreDb: Firestore | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    firebaseApp =
      getApps().length === 0 ? initializeApp(getFirebaseConfig()) : getApp();
  }

  return firebaseApp;
}

export function getFirestoreDb(): Firestore {
  if (!firestoreDb) {
    firestoreDb = getFirestore(getFirebaseApp());
  }

  return firestoreDb;
}
