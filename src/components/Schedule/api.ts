import {
  ScheduleException,
  ScheduleExceptionCreate,
  ScheduleTemplate,
  ScheduleTemplateCreate,
} from "@/components/Schedule/schemas";
import { UserBareMinimum } from "@/components/Users/models";

import { Type } from "@/Utils/request/api";
import { PaginatedResponse } from "@/Utils/request/types";

export const ScheduleAPIs = {
  templates: {
    create: {
      path: "/api/v1/facility/{facility_id}/schedule/",
      method: "POST",
      TRes: Type<ScheduleTemplate>(),
      TBody: Type<ScheduleTemplateCreate>(),
    },
    list: {
      path: "/api/v1/facility/{facility_id}/schedule/",
      method: "GET",
      TRes: Type<PaginatedResponse<ScheduleTemplate>>(),
    },
  },

  exceptions: {
    create: {
      path: "/api/v1/facility/{facility_id}/schedule_exceptions/",
      method: "POST",
      TRes: Type<ScheduleException>(),
      TBody: Type<ScheduleExceptionCreate>(),
    },
    list: {
      path: "/api/v1/facility/{facility_id}/schedule_exceptions/",
      method: "GET",
      TRes: Type<PaginatedResponse<ScheduleException>>(),
    },
    delete: {
      path: "/api/v1/facility/{facility_id}/schedule_exceptions/{id}/",
      method: "DELETE",
      TRes: Type<void>(),
    },
  },

  appointments: {
    availableDoctors: {
      path: "/api/v1/facility/{facility_id}/appointments/available_doctors/",
      method: "GET",
      TRes: Type<PaginatedResponse<UserBareMinimum>>(),
    },
    availableSlots: {
      path: "/api/v1/facility/{facility_id}/appointments/slots/",
      method: "GET",
      TRes: Type<PaginatedResponse<unknown>>(),
    },
  },
} as const;
