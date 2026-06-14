export interface Position {
  x: number;
  y: number;
}

export interface VariantItem {
  id: string;
  text: string;
}

export interface ExperimentData {
  anchor: string;
  variants: VariantItem[];
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

export interface ExperimentResult {
  participantId: string;
  trialId: string;
  boardWidth: number;
  boardHeight: number;
  anchor: ExperimentResultAnchor;
  completedAt: string;
  items: ExperimentResultItem[];
}
