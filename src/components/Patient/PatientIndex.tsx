import dayjs from "dayjs";
import { Link } from "raviger";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import CareIcon from "@/CAREUI/icons/CareIcon";
import { KeyboardShortcutKey } from "@/CAREUI/interactive/KeyboardShortcut";

import useFilters from "@/hooks/useFilters";

import { GENDER_TYPES } from "@/common/constants";

import routes from "@/Utils/request/api";
import useQuery from "@/Utils/request/useQuery";
import { formatPatientAge, parsePhoneNumber } from "@/Utils/utils";

import Page from "../Common/Page";
import SearchByMultipleFields from "../Common/SearchByMultipleFields";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TabbedSections } from "../ui/tabs";
import PatientFilter, { PatientFilterBadges } from "./PatientFilter";

export default function PatientIndex() {
  const { t } = useTranslation();

  const {
    qParams,
    updateQuery,
    advancedFilter,
    Pagination,
    resultsPerPage,
    clearSearch,
  } = useFilters({
    limit: 12,
    cacheBlacklist: [
      "name",
      "patient_no",
      "phone_number",
      "emergency_phone_number",
    ],
  });

  const searchOptions = [
    {
      key: "name",
      type: "text" as const,
      placeholder: "search_by_patient_name",
      value: qParams.name || "",
      shortcutKey: "n",
    },
    {
      key: "patient_no",
      type: "text" as const,
      placeholder: "search_by_patient_no",
      value: qParams.patient_no || "",
      shortcutKey: "u",
    },
    {
      key: "phone_number",
      type: "phone" as const,
      placeholder: "Search_by_phone_number",
      value: qParams.phone_number || "",
      shortcutKey: "p",
    },

    {
      key: "emergency_contact_number",
      type: "phone" as const,
      placeholder: "search_by_emergency_phone_number",
      value: qParams.emergency_phone_number || "",
      shortcutKey: "e",
    },
  ];

  const handleSearch = useCallback(
    (key: string, value: string) => {
      const updatedQuery = {
        phone_number:
          key === "phone_number"
            ? value.length >= 13 || value === ""
              ? value
              : undefined
            : undefined,
        name: key === "name" ? value : undefined,
        patient_no: key === "patient_no" ? value : undefined,
        emergency_phone_number:
          key === "emergency_contact_number"
            ? value.length >= 13 || value === ""
              ? value
              : undefined
            : undefined,
      };

      updateQuery(updatedQuery);
    },
    [updateQuery],
  );

  const getCleanedParams = (
    params: Record<string, string | number | undefined>,
  ) => {
    const cleaned: typeof params = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== 0 && params[key] !== "") {
        cleaned[key] = params[key];
      }
    });
    return cleaned;
  };

  const params = getCleanedParams({
    ...qParams,
    page: qParams.page || 1,
    limit: resultsPerPage,
    is_active:
      !qParams.last_consultation__new_discharge_reason &&
      (qParams.is_active || "True"),
    phone_number: qParams.phone_number
      ? parsePhoneNumber(qParams.phone_number)
      : undefined,
    emergency_phone_number: qParams.emergency_phone_number
      ? parsePhoneNumber(qParams.emergency_phone_number)
      : undefined,
    local_body: qParams.lsgBody || undefined,
    offset: (qParams.page ? qParams.page - 1 : 0) * resultsPerPage,
    last_menstruation_start_date_after:
      (qParams.is_antenatal === "true" &&
        dayjs().subtract(9, "month").format("YYYY-MM-DD")) ||
      undefined,
  });

  const isValidSearch = searchOptions.some((o) => !!o.value);

  const listingQuery = useQuery(routes.patientList, {
    query: params,
    prefetch: isValidSearch,
  });

  return (
    <Page title="Patients" hideBack breadcrumbs={false}>
      <TabbedSections
        tabs={[
          {
            label: t("search_patients"),
            value: "search",
            section: (
              <div className="flex items-center flex-col w-[800px] mx-auto">
                <div className="w-full mt-4">
                  <div className="flex justify-between mb-2 items-center">
                    <div>
                      <PatientFilterBadges />
                    </div>
                    <Button
                      variant={"secondary"}
                      className="gap-1 text-gray-700"
                      onClick={() => advancedFilter.setShow(true)}
                    >
                      <CareIcon icon="l-filter" />
                      Filters
                    </Button>
                  </div>
                  <SearchByMultipleFields
                    id="patient-search"
                    options={searchOptions}
                    onSearch={handleSearch}
                    clearSearch={clearSearch}
                    className="w-full"
                  />
                </div>
                {isValidSearch && !listingQuery.data?.results.length && (
                  <div className="py-10 text-gray-400">
                    {t("no_records_found")}
                  </div>
                )}
                {isValidSearch && !!listingQuery.data?.results.length && (
                  <Table className="mt-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="">Name/IP/OP</TableHead>
                        <TableHead className="">Primary Ph. No.</TableHead>
                        <TableHead className="">DOB</TableHead>
                        <TableHead className="">Sex</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listingQuery.data?.results.map((patient, i) => (
                        <TableRow className="bg-white" key={i}>
                          <TableCell className="min-w-[200px]">
                            <Link
                              href=""
                              className="font-semibold text-black underline underline-offset-2 hover:text-green-500"
                            >
                              {patient.name}
                            </Link>
                            <br />
                            <span>{patient.last_consultation?.patient_no}</span>
                          </TableCell>
                          <TableCell className="">
                            {patient.phone_number}
                          </TableCell>
                          <TableCell className="">
                            {patient.date_of_birth} ({formatPatientAge(patient)}
                            )
                          </TableCell>
                          <TableCell className="">
                            {
                              GENDER_TYPES.find((g) => g.id === patient.gender)
                                ?.text
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {listingQuery.data && (
                  <Pagination totalCount={listingQuery?.data?.count} />
                )}
                <div className="w-full mt-6">
                  <Button variant={"outline_primary"} className="gap-3">
                    <CareIcon icon="l-plus" />
                    Add new patient
                    <KeyboardShortcutKey shortcut={["Shift", "P"]} />
                  </Button>
                </div>
              </div>
            ),
          },
          { label: t("all_patients"), value: "all", section: <>todo</> },
        ]}
      />
      <PatientFilter
        {...advancedFilter}
        key={JSON.stringify(advancedFilter.filter)}
      />
    </Page>
  );
}
