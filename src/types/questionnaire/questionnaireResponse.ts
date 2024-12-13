import { QuestionnaireResponse as Response } from "./form";
import { QuestionnaireDetail } from "./questionnaire";

export interface QuestionnaireResponse {
  id: string;
  created_date: string;
  modified_date: string;
  questionnaire: QuestionnaireDetail;
  subject_id: string;
  responses: Response[];
  encounter: string;
  patient: string;
  created_by: {
    first_name: string;
    last_name: string;
    title?: string;
  };
}
