import careConfig from "@careConfig";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import SectionNavigator from "@/CAREUI/misc/SectionNavigator";

import useDebounce from "@/hooks/useDebounce";

import {
  GENDER_TYPES,
  OCCUPATION_TYPES,
  RATION_CARD_CATEGORY,
} from "@/common/constants";
import countryList from "@/common/static/countries.json";
import { validatePincode } from "@/common/validation";

import routes from "@/Utils/request/api";
import query from "@/Utils/request/query";
import request from "@/Utils/request/request";
import useTanStackQueryInstead from "@/Utils/request/useQuery";
import { getPincodeDetails, includesIgnoreCase } from "@/Utils/utils";

import Page from "../Common/Page";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { PatientModel } from "./models";

interface PatientRegistrationPageProps {
  facilityId: string;
  patientId?: string;
}

export default function PatientRegistration(
  props: PatientRegistrationPageProps,
) {
  const { patientId } = props;
  const { t } = useTranslation();

  const sidebarItems = [
    { label: t("patient__general-info"), id: "general-info" },
    { label: t("social_profile"), id: "social-profile" },
    { label: t("volunteer_contact"), id: "volunteer-contact" },
    { label: t("patient__insurance-details"), id: "insurance-details" },
  ];

  const [form, setForm] = useState<Partial<PatientModel>>({
    nationality: "India",
  });

  const statesQuery = useQuery({
    queryKey: ["states"],
    queryFn: query(routes.statesList),
  });

  const districtsQuery = useQuery({
    queryKey: ["districts", form.state],
    enabled: !!form.state,
    queryFn: query(routes.getDistrictByState, {
      pathParams: { id: form.state?.toString() || "" },
    }),
  });

  const localBodyQuery = useQuery({
    queryKey: ["localbodies", form.district],
    enabled: !!form.district,
    queryFn: query(routes.getLocalbodyByDistrict, {
      pathParams: { id: form.district?.toString() || "" },
    }),
  });

  const wardsQuery = useQuery({
    queryKey: ["wards", form.local_body],
    enabled: !!form.local_body,
    queryFn: query(routes.getWardByLocalBody, {
      pathParams: { id: form.local_body?.toString() || "" },
    }),
  });

  const [samePhoneNumber, setSamePhoneNumber] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const [ageDob, setAgeDob] = useState<"dob" | "age">("dob");
  const [showAutoFilledPincode, setShowAutoFilledPincode] = useState(false);

  const handlePincodeChange = async (value: string) => {
    if (!validatePincode(value)) return;

    const pincodeDetails = await getPincodeDetails(
      value,
      careConfig.govDataApiKey,
    );
    if (!pincodeDetails) return;

    const matchedState = statesQuery.data?.results?.find((state) => {
      return includesIgnoreCase(state.name, pincodeDetails.statename);
    });
    if (!matchedState) return;

    const fetchedDistricts = await request(routes.getDistrictByState, {
      pathParams: { id: matchedState.id?.toString() || "" },
    });
    if (!fetchedDistricts.data) return;

    const matchedDistrict = fetchedDistricts.data.find((district) => {
      return includesIgnoreCase(district.name, pincodeDetails.districtname);
    });
    if (!matchedDistrict) return;

    setForm((f) => ({
      ...f,
      state: matchedState.id,
      district: matchedDistrict.id,
    }));
    setShowAutoFilledPincode(true);
    setTimeout(() => {
      setShowAutoFilledPincode(false);
    }, 2000);
  };

  useEffect(() => {
    const timeout = setTimeout(
      () => handlePincodeChange(form.pincode?.toString() || ""),
      1000,
    );
    return () => clearTimeout(timeout);
  }, [form.pincode]);

  const title = !patientId
    ? t("add_details_of_patient")
    : t("update_patient_details");

  const fieldProps = (field: keyof typeof form) => ({
    value: form[field] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value })),
  });

  return (
    <Page title={title}>
      <hr className="mt-4" />
      <div className="relative mt-4 flex gap-4">
        <SectionNavigator sections={sidebarItems} />
        <div className="md:w-[500px]">
          <div id={"general-info"}>
            <h2 className="text-lg font-semibold">
              {t("patient__general-info")}
            </h2>
            <div className="text-sm">{t("general_info_detail")}</div>
            <br />
            <Input
              {...fieldProps("name")}
              required
              label={t("name")}
              placeholder={t("type_patient_name")}
            />
            <br />
            <Input
              {...fieldProps("phone_number")}
              required
              label={t("phone_number")}
            />
            <div className="mt-1">
              <Checkbox
                checked={samePhoneNumber}
                onCheckedChange={() => setSamePhoneNumber(!samePhoneNumber)}
                id="same-phone-number"
                label={t("use_phone_number_for_emergency")}
              />
            </div>
            <br />
            <Input
              {...fieldProps("emergency_phone_number")}
              required
              disabled={samePhoneNumber}
              value={
                samePhoneNumber
                  ? form.phone_number
                  : form.emergency_phone_number
              }
              label={t("emergency_phone_number")}
            />
            <br />
            <Input
              // TODO: add this to the backend?
              required
              label={t("emergency_contact_person_name_details")}
              placeholder={t("emergency_contact_person_name")}
            />
            <br />
            <RadioGroup
              label={t("sex")}
              required
              value={form.gender?.toString()}
              onValueChange={(value) =>
                setForm((f) => ({ ...f, gender: Number(value) }))
              }
              className="flex items-center gap-4"
            >
              {GENDER_TYPES.map((g) => (
                <>
                  <RadioGroupItem
                    value={g.id.toString()}
                    id={"gender_" + g.id}
                  />
                  <Label htmlFor={"gender_" + g.id}>
                    {t(`GENDER__${g.id}`)}
                  </Label>
                </>
              ))}
            </RadioGroup>
            <br />
            <Tabs
              value={ageDob}
              onValueChange={(value: string) =>
                setAgeDob(value as typeof ageDob)
              }
            >
              <TabsList className="mb-4">
                {[
                  ["dob", t("date_of_birth")],
                  ["age", t("age")],
                ].map(([key, label]) => (
                  <TabsTrigger value={key}>{label}</TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="dob">
                <div className="flex items-center gap-2">
                  <Input
                    required
                    type="number"
                    label={t("day")}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        date_of_birth: `${e.target.value}-${form.date_of_birth?.split("-")[1] || ""}-${form.date_of_birth?.split("-")[2] || ""}`,
                      }))
                    }
                  />
                  <Input
                    required
                    type="number"
                    label={t("month")}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        date_of_birth: `${form.date_of_birth?.split("-")[0] || ""}-${e.target.value}-${form.date_of_birth?.split("-")[2] || ""}`,
                      }))
                    }
                  />
                  <Input
                    required
                    type="number"
                    label={t("year")}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        date_of_birth: `${form.date_of_birth?.split("-")[0] || ""}-${form.date_of_birth?.split("-")[1] || ""}-${e.target.value}`,
                      }))
                    }
                  />
                </div>
              </TabsContent>
              <TabsContent value="age">
                <Input required type="number" label={t("age")} />
              </TabsContent>
            </Tabs>
            <br />
            <Textarea
              {...fieldProps("address")}
              label={t("current_address")}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
            />
            <div className="mt-1">
              <Checkbox
                checked={sameAddress}
                onCheckedChange={() => setSameAddress(!sameAddress)}
                id="same-address"
                label={t("use_address_as_permanent")}
              />
            </div>
            <br />
            <Textarea
              {...fieldProps("permanent_address")}
              label={t("permanent_address")}
              value={sameAddress ? form.address : form.permanent_address}
              onChange={(e) =>
                setForm((f) => ({ ...f, permanent_address: e.target.value }))
              }
              disabled={sameAddress}
            />
            <br />
            <Input
              // TODO: add this to the backend?
              required
              label={t("landmark")}
            />
            <br />
            <Input
              {...fieldProps("pincode")}
              type="number"
              required
              label={t("pincode")}
            />
            <br />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2">
                  {t("nationality")} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.nationality}
                  onValueChange={(value) =>
                    setForm((f) => ({ ...f, nationality: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryList.map((country) => (
                      <SelectItem value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2">
                  {t("state")} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.state?.toString()}
                  disabled={statesQuery.isLoading}
                  onValueChange={(value) =>
                    setForm((f) => ({
                      ...f,
                      state: Number(value),
                      district: undefined,
                      local_body: undefined,
                      ward: undefined,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statesQuery.data?.results.map((state) => (
                      <SelectItem value={state.id.toString()}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2">
                  {t("district")} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.district?.toString()}
                  onValueChange={(value) =>
                    setForm((f) => ({
                      ...f,
                      district: Number(value),
                      local_body: undefined,
                      ward: undefined,
                    }))
                  }
                  disabled={
                    !form.state ||
                    districtsQuery.isLoading ||
                    !districtsQuery.data?.length
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {districtsQuery.data?.map((district) => (
                      <SelectItem value={district.id.toString()}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2">
                  {t("local_body")} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.local_body?.toString()}
                  onValueChange={(value) =>
                    setForm((f) => ({
                      ...f,
                      local_body: Number(value),
                      ward: undefined,
                    }))
                  }
                  disabled={
                    !form.district ||
                    localBodyQuery.isLoading ||
                    !localBodyQuery.data?.length
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {localBodyQuery.data?.map((localbody) => (
                      <SelectItem value={localbody.id.toString()}>
                        {localbody.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2">{t("ward")}</Label>
                <Select
                  value={form.ward?.toString()}
                  onValueChange={(value) =>
                    setForm((f) => ({ ...f, ward: value }))
                  }
                  disabled={
                    !form.local_body ||
                    wardsQuery.isLoading ||
                    !wardsQuery.data?.results.length
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {wardsQuery.data?.results.map((ward) => (
                      <SelectItem value={ward.id.toString()}>
                        {ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input {...fieldProps("village")} label={t("village")} />
            </div>
          </div>
          <div id="social-profile" className="mt-10">
            <h2 className="text-lg font-semibold">
              {t("patient__social-profile")}
            </h2>
            <div className="text-sm">{t("social_profile_detail")}</div>
            <br />
            <div>
              <Label className="mb-2">{t("occupation")}</Label>
              <Select
                value={form.occupation}
                onValueChange={(value) =>
                  setForm((f) => ({ ...f, occupation: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OCCUPATION_TYPES.map((occupation) => (
                    <SelectItem value={occupation.id.toString()}>
                      {occupation.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <br />
            <div>
              <Label className="mb-2">{t("ration_card_category")}</Label>
              <Select
                value={form.ration_card_category || ""}
                onValueChange={(value) =>
                  setForm((f) => ({ ...f, ration_card_category: value as any }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RATION_CARD_CATEGORY.map((rcg) => (
                    <SelectItem value={rcg}>
                      {t(`ration_card__${rcg}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
