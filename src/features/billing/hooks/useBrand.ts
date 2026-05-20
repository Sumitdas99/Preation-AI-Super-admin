import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBrandPack } from "@/api/endpoints/billing";
import { useBillingScenario } from "@/api/billingScenario";
import { billingKeys } from "./queryKeys";
import type { BrandDetail, BrandListResponse } from "@/api/schemas/billing";

export function useBrand(brandId: string | undefined) {
  const queryClient = useQueryClient();
  const scenario = useBillingScenario();

  const brandList = queryClient.getQueryData<BrandListResponse>(
    billingKeys.brandList(scenario)
  );
  const brandFromList = useMemo(() => {
    return brandList?.items.find((b) => b.brand_id === brandId);
  }, [brandList, brandId]);

  const query = useQuery({
    queryKey: brandId
      ? billingKeys.brandPack(brandId, scenario)
      : ["billing", "brand", "pending"],
    queryFn: ({ signal }) => getBrandPack(brandId!, scenario, signal),
    enabled: Boolean(brandId),
  });

  const brand = useMemo(() => {
    if (!brandId) return undefined;
    const pack = query.data;
    const defaultBrand = {
      brand_id: brandId,
      brand_name: brandFromList?.brand_name || "Loading...",
      country: brandFromList?.country,
      business_contact_email: brandFromList?.business_contact_email,
      address: brandFromList?.address,
    };
    return {
      ...defaultBrand,
      pack,
      pack_type: pack?.pack_type || brandFromList?.pack_type || "standard",
      subscription_status: pack?.status || brandFromList?.subscription_status || "ACTIVE",
    } as BrandDetail;
  }, [brandId, brandFromList, query.data]);

  return {
    brand,
    isPending: query.isPending && !brandFromList,
    error: query.error,
    refetch: query.refetch,
  };
}
