import { useQuery } from "@tanstack/react-query";
import { navigate } from "raviger";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { FacilityModel } from "@/components/Facility/models";

import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";
import { RequestResult } from "@/Utils/request/types";

import { FACILITY_FEATURES, FeatureBadge } from "./Utils";

interface Props {
  id: string;
}

export function FacilityDetailsPage({ id }: Props) {
  const { data: facilityResponse, isLoading } = useQuery<
    RequestResult<FacilityModel>
  >({
    queryKey: ["facility", id],
    queryFn: () =>
      request(routes.getAnyFacility, {
        pathParams: { id },
      }),
  });

  const facility = facilityResponse?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin">
          <CareIcon icon="l-spinner" className="h-8 w-8" />
        </div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Facility Not Found</h2>
          <Button onClick={() => navigate("/facilities")}>
            Back to Facilities
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex px-2 pb-4 justify-start">
        <Button variant="ghost" onClick={() => navigate("/facilities")}>
          <CareIcon icon="l-square-shape" className="h-4 w-4 mr-1" />
          <span className="text-sm underline">Back</span>
        </Button>
      </div>
      <Card className="overflow-hidden bg-white">
        <div className="flex flex-row m-6">
          <div className="h-64 w-64 shrink-0 overflow-hidden rounded-lg">
            <img
              src={
                facility.read_cover_image_url || "/images/default-facility.png"
              }
              alt={facility.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="px-4 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{facility.name}</h1>
              <p className="text-lg text-muted-foreground">
                {[
                  facility.address,
                  facility.local_body_object?.name,
                  facility.district_object?.name,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {facility.features?.map((featureId) => (
                <FeatureBadge
                  key={featureId}
                  featureId={featureId as keyof typeof FACILITY_FEATURES}
                />
              ))}
            </div>

            {/* Add Staff Information */}
          </div>
        </div>
      </Card>
    </div>
  );
}
