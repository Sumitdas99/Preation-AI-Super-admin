import type { BrandDetail, BrandPack } from "@/api/schemas/billing";
import {
  packConfigFormDefaults,
  type PackConfigFormValues,
} from "../forms/packConfigFormSchema";

export function toPackFormValues(
  brand: BrandDetail | undefined,
): PackConfigFormValues {
  const pack = brand?.pack;
  if (!pack) return packConfigFormDefaults;
  return {
    pack_type: (pack as any).override_type || pack.pack_type || "standard",
    trial_end: pack.trial_end ?? (pack as any).override_expiry_date?.split("T")[0] ?? "",
    trial_image_limit: pack.trial_image_limit ?? (pack as any).trial_image_limit,
    trial_video_limit: pack.trial_video_limit ?? (pack as any).trial_video_limit,
    monthly_price: pack.monthly_price ?? pack.custom_price ?? (pack as any).custom_price,
    override_reason: pack.override_reason ?? "",
    custom_image_limit: pack.custom_image_limit ?? pack.image_scan_limit ?? (pack as any).custom_image_limit,
    custom_video_limit: pack.custom_video_limit ?? pack.video_minutes_limit ?? (pack as any).custom_video_limit,
    overage_image_price: pack.overage_image_price ?? (pack as any).custom_overage_image_price,
    overage_video_price: pack.overage_video_price ?? (pack as any).custom_overage_video_price,
  };
}

export function fromPackFormValues(
  values: PackConfigFormValues,
): any {
  const isTrial = values.pack_type === "trial_override";

  let overrideType = "standard";
  if (values.pack_type === "trial_override") overrideType = "trial_override";
  else if (values.pack_type === "enterprise_override") overrideType = "enterprise_override";

  return {
    override_type: overrideType,
    override_expiry_date: isTrial && values.trial_end ? `${values.trial_end}T00:00:00` : null,
    trial_image_limit: isTrial ? (values.trial_image_limit || 0) : 0,
    trial_video_limit: isTrial ? (values.trial_video_limit || 0) : 0,
    custom_image_limit: values.custom_image_limit,
    custom_video_limit: values.custom_video_limit,
    custom_price: values.monthly_price,
    custom_overage_image_price: values.overage_image_price,
    custom_overage_video_price: values.overage_video_price,
    override_reason: values.override_reason || undefined,
  };
}
