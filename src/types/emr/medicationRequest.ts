import { Code } from "@/types/questionnaire/code";

export const MEDICATION_REQUEST_STATUS = [
  "active",
  "on-hold",
  "ended",
  "stopped",
  "completed",
  "cancelled",
  "entered-in-error",
  "draft",
  "unknown",
] as const;

export type MedicationRequestStatus =
  (typeof MEDICATION_REQUEST_STATUS)[number];

export const MEDICATION_REQUEST_STATUS_REASON = [
  "altchoice",
  "clarif",
  "drughigh",
  "hospadm",
  "labint",
  "non_avail",
  "preg",
  "salg",
  "sddi",
  "sdupther",
  "sintol",
  "surg",
  "washout",
] as const;

export type MedicationRequestStatusReason =
  (typeof MEDICATION_REQUEST_STATUS_REASON)[number];

export const MEDICATION_REQUEST_INTENT = [
  "proposal",
  "plan",
  "order",
  "original_order",
  "reflex_order",
  "filler_order",
  "instance_order",
] as const;

export type MedicationRequestIntent =
  (typeof MEDICATION_REQUEST_INTENT)[number];

export const MEDICATION_REQUEST_PRIORITY = [
  "routine",
  "urgent",
  "asap",
  "stat",
] as const;

export type MedicationRequestPriority =
  (typeof MEDICATION_REQUEST_PRIORITY)[number];

export const MEDICATION_REQUEST_CATEGORY = [
  "inpatient",
  "outpatient",
  "community",
  "discharge",
] as const;

export type MedicationRequestCategory =
  (typeof MEDICATION_REQUEST_CATEGORY)[number];

export type TimingUnit = "s" | "min" | "h" | "d" | "wk" | "mo" | "a";

export type DoseType = "ordered" | "calculated";

export interface DosageQuantity {
  value: number;
  unit: string;
}

export interface DoseRange {
  low: DosageQuantity;
  high: DosageQuantity;
}

export interface DoseAndRate {
  type?: DoseType | null;
  dose_range?: DoseRange | null;
  dose_quantity?: DosageQuantity | null;
}

export interface TimingRepeat {
  frequency?: number | null;
  period: number;
  period_unit: TimingUnit;
  bounds_duration?: DosageQuantity | null;
}

export interface Timing {
  repeat?: TimingRepeat | null;
  code?: Code | null;
}

export interface DosageInstruction {
  sequence?: number | null;
  text?: string | null;
  additional_instruction?: Code[] | null;
  patient_instruction?: string | null;
  timing?: Timing | null;
  as_needed_boolean?: boolean | null;
  as_needed_for?: Code | null;
  site?: Code | null;
  route?: Code | null;
  method?: Code | null;
  dose_and_rate?: DoseAndRate[] | null;
  max_dose_per_period?: DoseRange | null;
}

export interface MedicationRequest {
  readonly id?: string; // TODO: make this non nullable and use Writable once type issue with StructuredRequestMap for allergy intolerance is solved.
  status?: MedicationRequestStatus;
  status_reason?: MedicationRequestStatusReason;
  status_changed?: string | null; // DateTime
  intent?: MedicationRequestIntent;
  category?: MedicationRequestCategory;
  priority?: MedicationRequestPriority;
  do_not_perform: boolean;
  medication?: Code;
  patient?: string | null; // UUID
  encounter?: string | null; // UUID
  authored_on: string;
  dosage_instruction: DosageInstruction[];
  note?: string | null;
}
