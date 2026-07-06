export interface Position {
  x: number;
  y: number;
}

export interface VariantItem {
  id: string;
  text: string;
}

export interface ExperimentData {
  trialId: string;
  anchor: string;
  variants: VariantItem[];
}

export interface TrialManifestEntry {
  familyId: string;
  file: string;
}

export interface TrialsManifest {
  families: TrialManifestEntry[];
}

export interface ExperimentResultItem {
  id: string;
  text: string;
  x: number;
  y: number;
  distanceToAnchor: number;
  normalizedX: number;
  normalizedY: number;
  normalizedDistance: number;
}

export interface ExperimentResultAnchor {
  text: string;
  x: number;
  y: number;
}

export interface ExperimentWorkspace {
  boardWidth: number;
  boardHeight: number;
  circleRadius: number;
  circleCenter: {
    x: number;
    y: number;
  };
}

export interface FamilyResult {
  trialId: string;
  participantId: string;
  name: string;
  age: number;
  boardWidth: number;
  boardHeight: number;
  workspace: ExperimentWorkspace;
  anchor: ExperimentResultAnchor;
  completedAt: string;
  items: ExperimentResultItem[];
}

export interface ParticipantResult {
  participantId: string;
  name: string;
  age: number;
  completedAt: string;
  families: FamilyResult[];
}
