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
  condition: {
    getRequests: (conditions, { resourceId, encounterId }) =>
      conditions.map((condition) => {
        const body: RequestTypeFor<"condition"> = {
          clinical_status: condition.clinicalStatus,
          verification_status: condition.verificationStatus,
          code: condition.code,
          onset_date_time: condition.onsetDateTime,
          recorded_date: condition.recordedDate,
          note: condition.note,
          encounter: encounterId,
        };

        return {
          url: `/api/v1/patient/${resourceId}/condition/`,
          method: "POST",
          body,
          reference_id: "condition",
        };
      }),
  },
};

export function getStructuredRequests<T extends StructuredQuestionType>(
  type: T,
  data: DataTypeFor<T>[],
  context: StructuredHandlerContext,
) {
  return handlers[type].getRequests(data, context);
}
