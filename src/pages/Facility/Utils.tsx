import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

export const FACILITY_FEATURES = {
  1: { label: "Water Bed", variant: "green" },
  2: { label: "24/7 Care", variant: "blue" },
  3: { label: "Wheelchair", variant: "amber" },
  4: { label: "Mobility Aids", variant: "orange" },
  5: { label: "Pain Management Tools", variant: "teal" },
  6: { label: "Incontinence Support", variant: "teal" },
  7: { label: "Adjustable Hospital Beds", variant: "teal" },
} as const;

export type FeatureId = keyof typeof FACILITY_FEATURES;

export const FeatureBadge = ({ featureId }: { featureId: FeatureId }) => {
  console.log(featureId);
  const feature = FACILITY_FEATURES[featureId];
  const variantStyles = {
    green: "bg-green-100 text-green-800 hover:bg-green-100",
    blue: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    amber: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    orange: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    teal: "bg-teal-100 text-teal-800 hover:bg-teal-100",
  };

  return (
    <Badge
      variant="outline"
      className={cn("rounded-sm font-normal", variantStyles[feature.variant])}
    >
      {feature.label}
    </Badge>
  );
};
