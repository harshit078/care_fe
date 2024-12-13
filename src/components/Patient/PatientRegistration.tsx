import { useState } from "react";
import { useTranslation } from "react-i18next";

import SectionNavigator from "@/CAREUI/misc/SectionNavigator";

import Page from "../Common/Page";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
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

  const [form, setForm] = useState<Partial<PatientModel>>({});
  const [samePhoneNumber, setSamePhoneNumber] = useState(false);

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
          </div>
        </div>
      </div>
    </Page>
  );
}
