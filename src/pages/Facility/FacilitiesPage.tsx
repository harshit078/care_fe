import { useQuery } from "@tanstack/react-query";
import { useQueryParams } from "raviger";

import PaginatedList from "@/CAREUI/misc/PaginatedList";

import { Card } from "@/components/ui/card";

import {
  DistrictModel,
  FacilityModel,
  LocalBodyModel,
} from "@/components/Facility/models";

import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";
import { RequestResult } from "@/Utils/request/types";

import { FacilityCard } from "./components/FacilityCard";
import { FilterBadges } from "./components/FilterBadges";

export function FacilitiesPage() {
  const [qParams, setQueryParams] = useQueryParams<{
    district?: string;
    local_body?: string;
    page?: string;
    limit?: string;
  }>();

  const { data: districtResponse } = useQuery<RequestResult<DistrictModel>>({
    queryKey: ["district", qParams.district],
    queryFn: () =>
      request(routes.getDistrict, {
        pathParams: { id: qParams.district || "" },
      }),
    enabled: !!qParams.district,
  });

  const { data: localBodyResponse } = useQuery<RequestResult<LocalBodyModel>>({
    queryKey: ["localBody", qParams.local_body],
    queryFn: () =>
      request(routes.getLocalBody, {
        pathParams: { id: qParams.local_body || "" },
      }),
    enabled: !!qParams.local_body,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Healthcare Facilities</h1>
        <FilterBadges
          district={districtResponse?.data}
          localBody={localBodyResponse?.data}
          onRemove={(key) => {
            const { [key]: _, ...rest } = qParams;
            setQueryParams(rest);
          }}
        />
      </div>

      <PaginatedList route={routes.getAllFacilities} query={qParams}>
        {() => (
          <div className="mt-4 flex w-full flex-col gap-4">
            <div className="flex flex-col gap-4">
              <PaginatedList.WhenEmpty>
                <Card className="p-6">
                  <div className="text-lg font-medium text-muted-foreground">
                    No facilities found
                  </div>
                </Card>
              </PaginatedList.WhenEmpty>

              <PaginatedList.Items<FacilityModel> className="grid gap-4 grid-cols-1 md:grid-cols-2 3xl:grid-cols-3">
                {(facility) => (
                  <FacilityCard key={facility.id} facility={facility} />
                )}
              </PaginatedList.Items>

              <div className="flex w-full items-center justify-center">
                <PaginatedList.Paginator hideIfSinglePage />
              </div>
            </div>
          </div>
        )}
      </PaginatedList>
    </div>
  );
}
