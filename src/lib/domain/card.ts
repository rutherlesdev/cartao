export type PregnancyCardView = {
  pregnancy: Record<string, unknown>;
  patient: Record<string, unknown>;
  clinical_snapshot: Record<string, unknown> | null;
  history: Record<string, unknown> | null;
  antecedents: Record<string, unknown> | null;
  vaccines: Record<string, unknown>[];
  medications: Record<string, unknown>[];
  consultations: Record<string, unknown>[];
  exams: Record<string, unknown>[];
  ultrasounds: Record<string, unknown>[];
  observations: Record<string, unknown>[];
};
