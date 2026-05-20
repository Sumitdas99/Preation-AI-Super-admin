import type { OveragePreviewResponse, UsageMetric } from "@/api/schemas/billing";
import { formatCycleRange, formatMoney } from "./format";

export interface OverageMeterVM {
  label: string;
  used: number;
  limit: number;
  overage: number;
  percent: number;
  isOverage: boolean;
  remainingLabel: string;
  unit: string;
}

export interface OveragePreviewVM {
  cycleLabel: string;
  daysRemainingLabel: string;
  estimatedTotalLabel: string;
  imagesOverageLabel: string;
  imagesUnitPriceLabel?: string;
  videoOverageLabel: string;
  videoUnitPriceLabel?: string;
  imagesMeter: OverageMeterVM;
  videoMeter: OverageMeterVM;
  calculationNote?: string;
  currency: string;
}

function meter(
  label: string,
  used: number,
  limit: number,
  overage: number,
  unit: string,
): OverageMeterVM {
  const percent = limit === 0 ? 0 : Math.min(100, Math.round((used / limit) * 100));
  return {
    label,
    used,
    limit,
    overage,
    percent,
    isOverage: overage > 0,
    remainingLabel:
      overage > 0
        ? `+${overage.toLocaleString()} ${unit} overage`
        : `${Math.max(limit - used, 0).toLocaleString()} ${unit} remaining`,
    unit,
  };
}

export function toOveragePreviewData(
  preview: OveragePreviewResponse,
): OveragePreviewVM {
  const cycleLabel = preview.billing_cycle_end ? `Ends ${preview.billing_cycle_end}` : "Current cycle";
  const daysRemainingLabel = "—";

  const imageDetail = preview.details?.find(d => d.asset_type === "image");
  const videoDetail = preview.details?.find(d => d.asset_type === "video");

  const imagesMeter = meter(
    "Images",
    imageDetail?.current_usage ?? 0,
    imageDetail?.limit ?? 0,
    imageDetail?.overage_quantity ?? 0,
    "images"
  );
  
  const videoMeter = meter(
    "Video minutes",
    videoDetail?.current_usage ?? 0,
    videoDetail?.limit ?? 0,
    videoDetail?.overage_quantity ?? 0,
    "minutes"
  );

  const currency = preview.currency ?? "EUR";

  return {
    cycleLabel,
    daysRemainingLabel,
    estimatedTotalLabel: formatMoney(
      preview.total_estimated_cost ?? 0,
      currency,
    ),
    imagesOverageLabel: imagesMeter.isOverage
      ? `${imagesMeter.overage.toLocaleString()} images`
      : "0 images",
    imagesUnitPriceLabel: imageDetail?.overage_price
      ? `Above ${imagesMeter.limit} limit @ ${formatMoney(
          imageDetail.overage_price,
          currency,
        )}/image`
      : undefined,
    videoOverageLabel: videoMeter.isOverage
      ? `${videoMeter.overage.toLocaleString()} minutes`
      : "0 minutes",
    videoUnitPriceLabel: videoDetail?.overage_price
      ? videoMeter.isOverage
        ? `Above ${videoMeter.limit} limit @ ${formatMoney(
            videoDetail.overage_price,
            currency,
          )}/min`
        : `Within ${videoMeter.limit} min limit`
      : undefined,
    imagesMeter,
    videoMeter,
    calculationNote: undefined,
    currency,
  };
}
