import { useQuery } from "@tanstack/react-query";
import { Link } from "raviger";

import { cn } from "@/lib/utils";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { FacilityModel } from "@/components/Facility/models";
import { UserBareMinimum } from "@/components/Users/models";

import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";
import { RequestResult } from "@/Utils/request/types";

import { DoctorModel, getExperience, mockDoctors } from "./Utils";

interface DoctorAppointmentsPageProps {
  facilityId: string;
  doctorUsername: string;
}

export function DoctorAppointmentsPage(props: DoctorAppointmentsPageProps) {
  const { facilityId, doctorUsername } = props;

  const { data: facilityResponse } = useQuery<RequestResult<FacilityModel>>({
    queryKey: ["facility", facilityId],
    queryFn: () =>
      request(routes.getAnyFacility, {
        pathParams: { id: facilityId },
      }),
  });

  const { data: doctorResponse } = useQuery<RequestResult<UserBareMinimum>>({
    queryKey: ["doctor", doctorUsername],
    queryFn: () =>
      request(routes.getUserDetails, {
        pathParams: { username: doctorUsername },
      }),
  });

  function extendDoctor(
    doctor: UserBareMinimum | undefined,
  ): DoctorModel | undefined {
    if (!doctor) return undefined;
    const randomDoc =
      mockDoctors[Math.floor(Math.random() * mockDoctors.length)];
    return {
      ...doctor,
      role: randomDoc.role,
      education: randomDoc.education,
      experience: randomDoc.experience,
      languages: randomDoc.languages,
      specializations: randomDoc.specializations,
    };
  }

  const doctor: DoctorModel | undefined =
    extendDoctor(doctorResponse?.data) ??
    mockDoctors.find((d) => d.username === doctorUsername);

  if (!doctor) {
    return <div>Doctor not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex px-2 pb-4 justify-start">
        <Button variant="ghost" asChild>
          <Link href={`/facility/${facilityId}`}>
            <CareIcon icon="l-square-shape" className="h-4 w-4 mr-1" />
            <span className="text-sm underline">Back</span>
          </Link>
        </Button>
      </div>
      <div className="flex gap-4">
        <div className="w-1/3">
          <Card className={cn("overflow-hidden bg-white")}>
            <div className="flex flex-col">
              <div className="flex flex-col gap-4 items-center py-4">
                <div className="h-96 w-96 shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={
                      doctor.read_profile_picture_url ||
                      "/images/default-doctor.png"
                    }
                    alt={`${doctor.first_name} ${doctor.last_name}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex grow flex-col min-w-0 px-3">
                  <h3 className="truncate text-xl font-semibold">
                    {`Dr. ${doctor.first_name} ${doctor.last_name}`}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {doctor.role}
                  </p>

                  <p className="text-xs mt-4">Education: </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {doctor.education}
                  </p>

                  <p className="text-xs mt-4">Languages: </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {doctor.languages.join(", ")}
                  </p>

                  <p className="text-sm mt-6">{getExperience(doctor)}</p>
                </div>
              </div>

              <div className="mt-auto border-t border-gray-100 bg-gray-50 p-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {facilityResponse?.data?.name}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="flex-1">
          <div>Appointments</div>
        </div>
      </div>
    </div>
  );
}
