import {
  AllergyIntolerance,
  AllergyIntoleranceRequest,
} from "@/types/emr/allergyIntolerance";
import { MedicationRequest } from "@/types/emr/medicationRequest";
import { Condition, ConditionRequest } from "@/types/questionnaire/condition";
import { StructuredQuestionType } from "@/types/questionnaire/question";

// Map structured types to their data types
export interface StructuredDataMap {
  allergy_intolerance: AllergyIntolerance;
  medication_request: MedicationRequest;
  condition: Condition;
}

// Map structured types to their request types
export interface StructuredRequestMap {
  allergy_intolerance: AllergyIntoleranceRequest;
  medication_request: { datapoints: MedicationRequest[] };
  condition: ConditionRequest;
}

export type RequestTypeFor<T extends StructuredQuestionType> =
  StructuredRequestMap[T];

export type DataTypeFor<T extends StructuredQuestionType> =
  StructuredDataMap[T];
