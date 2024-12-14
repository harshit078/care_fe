import { DayOfWeekValue } from "@/CAREUI/interactive/WeekdayCheckbox";

import { Time, WritableOnly } from "@/Utils/types";

interface ScheduleResourceUser {
  readonly id: string;
  readonly name: string;
}

type ScheduleResource = ScheduleResourceUser;

export interface ScheduleTemplate {
  readonly id: string;
  readonly resource: ScheduleResource;
  name: string;
  valid_from: string;
  valid_to: string;
  availability: ScheduleAvailability[];
}

export interface ScheduleTemplateCreate extends WritableOnly<ScheduleTemplate> {
  doctor_username: string;
}

export const ScheduleSlotTypes = ["Open", "Appointment"] as const;

export interface ScheduleAvailability {
  readonly id: string;
  name: string;
  reason: string; // TODO: integrate this
  slot_type: (typeof ScheduleSlotTypes)[number];
  slot_size_in_minutes: number;
  tokens_per_slot: number;
  days_of_week: DayOfWeekValue[];
  start_time: Time;
  end_time: Time;
}

export interface ScheduleException {
  readonly id: string;
  name: string;
  is_available: boolean;
  reason: string;
  valid_from: string;
  valid_to: string;
  start_time: Time;
  end_time: Time;
  slot_type?: (typeof ScheduleSlotTypes)[number];
  slot_size_in_minutes?: number;
  tokens_per_slot?: number;
}

export interface ScheduleExceptionCreate
  extends WritableOnly<ScheduleException> {
  doctor_username: string;
}
