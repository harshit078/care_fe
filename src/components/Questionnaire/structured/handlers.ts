import {
  DataTypeFor,
  RequestTypeFor,
} from "@/components/Questionnaire/structured/types";

import { StructuredQuestionType } from "@/types/questionnaire/question";

interface StructuredHandlerContext {
  resourceId: string;
  encounterId: string;
}

type StructuredHandler<T extends StructuredQuestionType> = {
  getRequests: (
    data: DataTypeFor<T>[],
    context: StructuredHandlerContext,
  ) => Array<{
    url: string;
    method: string;
    body: RequestTypeFor<T>;
    reference_id: string;
  }>;
};

const handlers: {
  [K in StructuredQuestionType]: StructuredHandler<K>;
} = {
  allergy_intolerance: {
    getRequests: (allergies, { resourceId, encounterId }) =>
      allergies.map((allergy) => {
        // Ensure all required fields have default values
        const body: RequestTypeFor<"allergy_intolerance"> = {
          clinical_status: allergy.clinicalStatus ?? "active",
          verification_status: allergy.verificationStatus ?? "unconfirmed",
          category: allergy.category ?? "medication",
          criticality: allergy.criticality ?? "low",
          code: allergy.code,
          last_occurrence: allergy.lastOccurrence,
          note: allergy.note,
          encounter: encounterId,
        };

        return {
          url: `/api/v1/patient/${resourceId}/allergy_intolerance/`,
          method: "POST",
          body,
          reference_id: "allergy_intolerance",
        };
      }),
  },
  medication_request: {
    getRequests: (medications, { encounterId }) => {
      return [
        {
          url: `/api/v1/consultation/${encounterId}/medication/request/upsert/`,
          method: "POST",
          body: { datapoints: medications },
          reference_id: "medication_request",
        },
      ];
    },
  },
  symptom: {
    getRequests: (symptoms, { resourceId, encounterId }) =>
      symptoms.map((symptom) => {
        const body: RequestTypeFor<"symptom"> = {
          clinical_status: symptom.clinicalStatus,
          verification_status: symptom.verificationStatus,
          code: symptom.code,
          severity: symptom.severity,
          onset_date_time: symptom.onsetDateTime,
          recorded_date: symptom.recordedDate,
          note: symptom.note,
          encounter: encounterId,
        };

        return {
          url: `/api/v1/patient/${resourceId}/symptom/`,
          method: "POST",
          body,
          reference_id: "symptom",
        };
      }),
  },
  diagnosis: {
    getRequests: (diagnoses, { resourceId, encounterId }) =>
      diagnoses.map((diagnosis) => {
        const body: RequestTypeFor<"diagnosis"> = {
          clinical_status: diagnosis.clinicalStatus,
          verification_status: diagnosis.verificationStatus,
          code: diagnosis.code,
          onset_date_time: diagnosis.onsetDateTime,
          recorded_date: diagnosis.recordedDate,
          note: diagnosis.note,
          encounter: encounterId,
        };

        return {
          url: `/api/v1/patient/${resourceId}/diagnosis/`,
          method: "POST",
          body,
          reference_id: "diagnosis",
        };
      }),
  },
};

export const getStructuredRequests = <T extends StructuredQuestionType>(
  type: T,
  data: DataTypeFor<T>[],
  context: StructuredHandlerContext,
) => handlers[type].getRequests(data, context);
