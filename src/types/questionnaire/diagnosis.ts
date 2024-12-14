import { Code } from "./code";

export const DIAGNOSIS_CLINICAL_STATUS = [
  "active",
  "recurrence",
  "relapse",
  "inactive",
  "remission",
  "resolved",
] as const;

export type DiagnosisClinicalStatus =
  (typeof DIAGNOSIS_CLINICAL_STATUS)[number];

export const DIAGNOSIS_VERIFICATION_STATUS = [
  "unconfirmed",
  "provisional",
  "differential",
  "confirmed",
  "refuted",
  "entered-in-error",
] as const;

export type DiagnosisVerificationStatus =
  (typeof DIAGNOSIS_VERIFICATION_STATUS)[number];

export interface Diagnosis {
  code: Code;
  clinicalStatus: DiagnosisClinicalStatus;
  verificationStatus: DiagnosisVerificationStatus;
  onsetDateTime?: string;
  recordedDate?: string;
  note?: string;
}

export interface DiagnosisRequest {
  clinical_status: DiagnosisClinicalStatus;
  verification_status: DiagnosisVerificationStatus;
  code: Code;
  onset_date_time?: string;
  recorded_date?: string;
  note?: string;
  encounter: string;
}
