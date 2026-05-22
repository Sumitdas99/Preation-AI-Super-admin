import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {

  BrandListPanel,
  EditPanelHeader,
  OveragePreviewCard,
  type BreadcrumbSegment,
} from "@/components/billing";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  BrandPackEmptyState,
  BrandPackErrorScreen,
  BrandPackSkeleton,

  PackConfigurationForm,
  filterBrandList,
  toBrandListData,
  toOveragePreviewData,
  toPackFormValues,
  fromPackFormValues,
  useBrand,
  useBrands,
  useOveragePreview,
  useUpdateBrandPack,
} from "@/features/billing";
import type {
  Currency,
  UpdateBrandPackRequest,
} from "@/api/schemas/billing";

export default function SuperAdminBrandPacks() {
  const navigate = useNavigate();
  const params = useParams<{ brandId?: string }>();

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.title = "Brand Pack Manager · Praetion AI";
  }, []);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 768) setDrawerOpen(false);
    };
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  const {
    brands,
    isPending: brandsPending,
    error: brandsError,
    refetch: refetchBrands,
  } = useBrands();

  const [query, setQuery] = useState("");
  const [resetTick, setResetTick] = useState(0);

  const rows = useMemo(() => toBrandListData(brands), [brands]);
  const filteredRows = useMemo(
    () => filterBrandList(rows, query),
    [rows, query],
  );

  const selectedBrandId =
    params.brandId ?? (brands.length > 0 ? brands[0].brand_id : undefined);

  const {
    brand,
    isPending: brandPending,
    error: brandError,
    refetch: refetchBrand,
  } = useBrand(selectedBrandId);

  const isActiveSubscription = brand?.subscription_status === "ACTIVE";

  const {
    preview,
    isPending: previewPending,
  } = useOveragePreview(selectedBrandId, { enabled: !!selectedBrandId });

  const updateMutation = useUpdateBrandPack(selectedBrandId);

  const formDefaults = useMemo(() => toPackFormValues(brand), [brand]);
  const currency: Currency = (brand?.pack?.currency as Currency) ?? "EUR";

  const handleSelect = (brandId: string) => {
    navigate(`/super-admin/brand-packs/${brandId}`, { replace: true });
  };

  const handleOnboard = () => {
    navigate("/super-admin/brand-packs/new");
  };

  const handleSave = async (
    values: Parameters<typeof fromPackFormValues>[0],
  ) => {
    if (!selectedBrandId) return;
    const payload = fromPackFormValues(values) as UpdateBrandPackRequest;
    await updateMutation.mutateAsync(payload);
  };

  const handleDiscard = () => {
    setResetTick((t) => t + 1);
  };

  const overageVM = preview ? toOveragePreviewData(preview) : undefined;

  const breadcrumbs: BreadcrumbSegment[] = brand
    ? [{ label: "Brands" }, { label: brand.brand_name }]
    : [{ label: "Brands" }];

  const handleSelectAndClose = (brandId: string) => {
    handleSelect(brandId);
    setDrawerOpen(false);
  };

  return (
    <div className="flex h-screen flex-col bg-background">


      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="left"
          className="w-80 max-w-[85vw] border-r p-0 md:hidden"
        >
          <BrandListPanel
            rows={filteredRows}
            selectedBrandId={selectedBrandId}
            onSelect={handleSelectAndClose}
            query={query}
            onQueryChange={setQuery}
            onOnboardClick={() => { setDrawerOpen(false); handleOnboard(); }}
            isPending={brandsPending}
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row overflow-hidden bg-background">
        <BrandListPanel
          rows={filteredRows}
          selectedBrandId={selectedBrandId}
          onSelect={handleSelect}
          query={query}
          onQueryChange={setQuery}
          onOnboardClick={handleOnboard}
          isPending={brandsPending}
          className="w-full md:w-80 shrink-0 border-b md:border-b-0 md:border-r"
        />

        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {!selectedBrandId ? (
            <BrandPackEmptyState />
          ) : brandError ? (
            <BrandPackErrorScreen
              description={
                brandError instanceof Error ? brandError.message : undefined
              }
              onRetry={() => refetchBrand()}
            />
          ) : !brand || brandPending ? (
            <div className="overflow-y-auto p-6">
              <BrandPackSkeleton />
            </div>
          ) : (
            <>
              <EditPanelHeader brand={brand} />
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-none scrollbar-hide px-6 pt-5">
                <PackConfigurationForm
                  brandName={brand.brand_name}
                  defaultValues={formDefaults}
                  currency={currency}
                  resetKey={resetTick}
                  isSubmitting={updateMutation.isPending}
                  trialEnd={brand.pack?.trial_end}
                  subscriptionActive={isActiveSubscription}
                  usageCrossRef={
                    preview
                      ? {
                        imageUsed: preview.details?.find(d => d.asset_type === "image")?.current_usage ?? 0,
                        imageOverage: preview.details?.find(d => d.asset_type === "image")?.overage_quantity ?? 0,
                        videoUsed: preview.details?.find(d => d.asset_type === "video")?.current_usage ?? 0,
                        videoOverage: preview.details?.find(d => d.asset_type === "video")?.overage_quantity ?? 0,
                      }
                      : undefined
                  }
                  topSlot={
                    <OveragePreviewCard
                      vm={overageVM}
                      isPending={previewPending}
                    />
                  }
                  primaryLabel="Save pack changes"
                  onPrimarySubmit={handleSave}
                />
              </div>
            </>
          )}
        </main>
      </div>


    </div>
  );
}
