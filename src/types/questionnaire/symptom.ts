import { Code } from "./code";

export const SYMPTOM_CLINICAL_STATUS = [
  "active",
  "recurrence",
  "relapse",
  "inactive",
  "remission",
  "resolved",
] as const;

export type SymptomClinicalStatus = (typeof SYMPTOM_CLINICAL_STATUS)[number];

export const SYMPTOM_VERIFICATION_STATUS = [
  "unconfirmed",
  "provisional",
  "differential",
  "confirmed",
  "refuted",
  "entered-in-error",
] as const;

export type SymptomVerificationStatus =
  (typeof SYMPTOM_VERIFICATION_STATUS)[number];

export const SYMPTOM_SEVERITY = ["severe", "moderate", "mild"] as const;

export type SymptomSeverity = (typeof SYMPTOM_SEVERITY)[number];

export interface Symptom {
  code: Code;
  clinicalStatus: SymptomClinicalStatus;
  verificationStatus: SymptomVerificationStatus;
  severity?: SymptomSeverity;
  onsetDateTime?: string;
  recordedDate?: string;
  note?: string;
}

export interface SymptomRequest {
  clinical_status: SymptomClinicalStatus;
  verification_status: SymptomVerificationStatus;
  code: Code;
  severity?: SymptomSeverity;
  onset_date_time?: string;
  recorded_date?: string;
  note?: string;
  encounter: string;
}
