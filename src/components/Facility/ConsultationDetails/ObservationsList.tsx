import { useTranslation } from "react-i18next";

import CareIcon from "@/CAREUI/icons/CareIcon";
import PaginatedList from "@/CAREUI/misc/PaginatedList";

import { Card } from "@/components/ui/card";

import { useSlugs } from "@/hooks/useSlug";

import routes from "@/Utils/request/api";
import { formatDateTime } from "@/Utils/utils";
import { Observation } from "@/types/emr/observation";

export default function ObservationsList() {
  const [patientId, consultationId] = useSlugs("patient", "consultation");
  const { t } = useTranslation();

  return (
    <PaginatedList
      route={routes.listObservations}
      pathParams={{ patientId }}
      query={{ encounter: consultationId, ignore_group: true }}
    >
      {() => (
        <div className="mt-4 flex w-full flex-col gap-4">
          <div className="flex max-h-[85vh] flex-col gap-4 overflow-y-auto overflow-x-hidden px-3">
            <PaginatedList.WhenEmpty>
              <Card className="p-6">
                <div className="text-lg font-medium text-muted-foreground">
                  {t("no_observations")}
                </div>
              </Card>
            </PaginatedList.WhenEmpty>

            <PaginatedList.Items<Observation> className="grid gap-4">
              {(item) => (
                <Card
                  key={item.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-start gap-4">
                    <CareIcon
                      icon="l-stethoscope"
                      className="mt-1 h-5 w-5 text-muted-foreground"
                    />
                    <div>
                      <h3 className="text-lg font-medium">
                        {item.main_code.display || item.main_code.code}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <CareIcon icon="l-calender" className="h-4 w-4" />
                        <span>{formatDateTime(item.effective_datetime)}</span>
                      </div>
                      {item.value.value_quantity && (
                        <div className="mt-2 font-medium">
                          {item.value.value_quantity.value}{" "}
                          {item.value.value_quantity.code.display}
                        </div>
                      )}
                      {item.value.value && (
                        <div className="mt-2 font-medium">
                          {item.value.value}
                        </div>
                      )}
                      {item.note && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          {item.note}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </PaginatedList.Items>

            <div className="flex w-full items-center justify-center">
              <PaginatedList.Paginator hideIfSinglePage />
            </div>
          </div>
        </div>
      )}
    </PaginatedList>
  );
}
