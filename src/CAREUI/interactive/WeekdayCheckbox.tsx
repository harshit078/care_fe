import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

import { Checkbox } from "@/components/ui/checkbox";

const DAYS_OF_WEEK = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
} as const;

export type DayOfWeekValue = (typeof DAYS_OF_WEEK)[keyof typeof DAYS_OF_WEEK];

interface Props {
  value?: DayOfWeekValue[];
  onChange?: (value: DayOfWeekValue[]) => void;
}

export default function WeekdayCheckbox({ value = [], onChange }: Props) {
  const { t } = useTranslation();

  const handleDayToggle = (day: DayOfWeekValue) => {
    if (!onChange) return;

    if (value.includes(day)) {
      onChange(value.filter((d) => d !== day));
    } else {
      onChange([...value, day]);
    }
  };

  return (
    <ul className="flex justify-between">
      {Object.values(DAYS_OF_WEEK).map((day) => {
        const isChecked = value.includes(day);

        return (
          <li key={day}>
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-lg border px-8 py-6 transition-all duration-200 ease-in-out",
                isChecked
                  ? "border-primary-500 bg-white shadow"
                  : "border-gray-300",
              )}
            >
              <Checkbox
                id={`day_of_week_checkbox_${day}`}
                checked={isChecked}
                onCheckedChange={() => handleDayToggle(day)}
              />
              <label
                htmlFor={`day_of_week_checkbox_${day}`}
                className="cursor-pointer text-xs font-semibold uppercase"
                onClick={(e) => e.stopPropagation()}
              >
                {t(`DAYS_OF_WEEK_SHORT__${day}`)}
              </label>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
