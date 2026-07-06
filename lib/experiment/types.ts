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
  workspace: ExperimentWorkspace;
  anchor: ExperimentResultAnchor;
  completedAt: string;
  items: ExperimentResultItem[];
}

export interface ParticipantInfo {
  participantId: string;
  name: string;
  age: number;
}

export interface ParticipantResult extends ParticipantInfo {
  completedAt: string;
  families: FamilyResult[];
}
