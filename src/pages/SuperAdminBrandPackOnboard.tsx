import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  createBillingBrand,
  updateBrandPack,
  sendBrandInvitation,
  updateBillingBrandPackRaw,
  sendBillingBrandInvitationRaw,
} from "@/api/endpoints/billing";
import { useBillingScenario } from "@/api/billingScenario";
import { Button } from "@/components/ui/button";
import {
  BrandDetailsForm,
  BrandDetailsReadOnly,
  StepProgress,
  type StepDefinition,
} from "@/components/billing";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DevBillingPanel,
  PackConfigurationForm,
  brandDetailsFormDefaults,
  brandDetailsFormSchema,
  fromPackFormValues,
  packConfigFormDefaults,
  useCreateBrand,
  type BrandDetailsFormValues,
  type PackConfigFormValues,
} from "@/features/billing";
import type {
  BrandPack,
  CreateBrandRequest,
  Currency,
} from "@/api/schemas/billing";

const STEPS: StepDefinition[] = [
  { id: "details", label: "Brand Details" },
  { id: "pack", label: "Pack Configuration" },
  { id: "invite", label: "Send Invitation" },
];

const PLACEHOLDER_BRAND_NAME = "New brand";

export default function SuperAdminBrandPackOnboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createMutation = useCreateBrand();
  const scenario = useBillingScenario();

  useEffect(() => {
    document.title = "Onboard new brand · Praetion AI";
  }, []);

  const detailsForm = useForm<BrandDetailsFormValues>({
    resolver: zodResolver(brandDetailsFormSchema),
    defaultValues: brandDetailsFormDefaults,
    mode: "onBlur",
  });

  const [brandDetails, setBrandDetails] = useState<BrandDetailsFormValues | null>(null);
  const [createdBrandId, setCreatedBrandId] = useState<string | null>(null);
  const [packDraft, setPackDraft] = useState<PackConfigFormValues>(
    packConfigFormDefaults,
  );

  const billingBrandMutation = useMutation({
    mutationFn: createBillingBrand,
    onSuccess: (data) => {
      console.log("Brand created successfully via React Query:", data);
      toast.success("Brand details saved successfully");
    },
    onError: (error) => {
      console.error("Failed to create brand via React Query:", error);
      toast.error("Failed to save brand details", {
        description: error instanceof Error ? error.message : "Network error occurred",
      });
    },
  });

  const stepIndex = searchParams.get("step") === "success" && brandDetails ? 2
    : searchParams.get("step") === "pack" && brandDetails ? 1
      : 0;

  const handleContinue = detailsForm.handleSubmit(async (values) => {
    try {
      const payload = {
        name: values.brand_name,
        country: values.registered_country,
        admin_name: values.brand_admin_name,
        admin_email: values.brand_admin_email,
        address: values.registered_address,
      };

      const res = await billingBrandMutation.mutateAsync(payload);
      setBrandDetails(values);
      if (res && res.brand_id) {
        setCreatedBrandId(res.brand_id);
      }
      navigate("?step=pack");
    } catch (error) {
      // Error handling is managed by onError inside useMutation
    }
  });

  const handleBack = () => {
    navigate(-1);
  };

  const submitOnboarding = async (
    values: PackConfigFormValues,
    sendInvitation: boolean,
  ) => {
    if (!brandDetails) return;
    setPackDraft(values);

    const packPayload = fromPackFormValues(values) as Omit<BrandPack, "brand_id">;

    if (createdBrandId) {
      try {
        await updateBillingBrandPackRaw(createdBrandId, packPayload);
        if (sendInvitation) {
          await sendBillingBrandInvitationRaw(createdBrandId);
          navigate("?step=success", { replace: true });
          setTimeout(() => {
            navigate("/super-admin/brand-packs", { replace: true });
          }, 3000);
        } else {
          toast.success("Brand saved — configure later");
          navigate("/super-admin/brand-packs", { replace: true });
        }
      } catch (error) {
        console.error("Failed to update brand pack:", error);
        toast.error("Could not save pack changes", {
          description: error instanceof Error ? error.message : "Network error occurred",
        });
      }
      return;
    } else {
      toast.error("Brand ID not found. Please try again.");
    }
  };

  const brandNameForSummary = useMemo(() => {
    return (
      detailsForm.getValues("brand_name") ||
      brandDetails?.brand_name ||
      PLACEHOLDER_BRAND_NAME
    );
  }, [detailsForm, brandDetails]);

  const currency: Currency = "EUR";

  const stepLabel = stepIndex === 0 ? "Step 1: Brand Details" : stepIndex === 1 ? "Step 2: Pack Configuration" : "Step 3: Success";

  return (
    <div className="flex flex-col pb-8">
      <div className="px-4 py-3 sm:px-6 sm:py-4">
        <Breadcrumb>
          <BreadcrumbList className="flex-nowrap overflow-x-auto pb-1 text-xs sm:text-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <BreadcrumbItem className="shrink-0">
              <BreadcrumbLink href="/super-admin/brand-packs">Brands</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="shrink-0" />
            <BreadcrumbItem className="shrink-0">
              <BreadcrumbPage>New Brand</BreadcrumbPage>
            </BreadcrumbItem>
            {brandDetails && (
              <>
                <BreadcrumbSeparator className="shrink-0" />
                <BreadcrumbItem className="shrink-0">
                  <BreadcrumbPage className="max-w-[100px] truncate sm:max-w-[200px]">{brandDetails.brand_name}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator className="shrink-0" />
            <BreadcrumbItem className="shrink-0">
              <BreadcrumbPage className="text-foreground font-medium max-w-[120px] truncate sm:max-w-[250px]">{stepLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <StepProgress steps={STEPS} activeIndex={stepIndex} />

      <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6 px-4 sm:px-6 py-6 sm:py-8">

        {stepIndex === 0 ? (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground tracking-tight">
                Brand Details
              </h1>
              <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                Step 1 of 2 — complete before configuring billing pack. Brand Admin invitation is sent only after pack is configured in Step 2.
              </p>
            </div>

            <form
              onSubmit={handleContinue}
              className="space-y-6"
              noValidate
            >
              <BrandDetailsForm
                control={detailsForm.control} />
              <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={billingBrandMutation.isPending}
                  onClick={() => navigate(-1)}
                  className="h-11 shrink-0 rounded-lg font-bold px-6 shadow-none"
                >
                  ← Back
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={billingBrandMutation.isPending}
                  className="h-11 shrink-0 rounded-lg font-bold px-6 shadow-none flex items-center justify-center gap-2"
                >
                  {billingBrandMutation.isPending ? "Saving..." : "Continue to Pack Configuration →"}
                </Button>
              </footer>
            </form>
          </div>
        ) : null}

        {stepIndex === 1 && brandDetails ? (
          <div className="space-y-6">
            <PackConfigurationForm
              brandName={brandNameForSummary}
              defaultValues={packDraft}
              currency={currency}
              isSubmitting={createMutation.isPending}
              topSlot={<BrandDetailsReadOnly
                brandName={brandDetails.brand_name}
                contact={{
                  brand_admin_name: brandDetails.brand_admin_name,
                  brand_admin_email: brandDetails.brand_admin_email,
                  registered_country: brandDetails.registered_country,
                  registered_address: brandDetails.registered_address,
                }} />}
              primaryLabel="Save pack & send invitation"
              onPrimarySubmit={(values) => submitOnboarding(values, true)}
              ghostLabel="Back to brand details"
              onGhost={handleBack} />
          </div>
        ) : null}

        {stepIndex === 2 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 bg-card rounded-xl border shadow-sm">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-in zoom-in duration-500">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">API call successfully completed</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Brand pack configured and invitation sent. Redirecting back to brand packs...
            </p>
          </div>
        ) : null}
      </div>
      <DevBillingPanel />
    </div>
  );
}
