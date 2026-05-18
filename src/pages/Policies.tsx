import { useState, useEffect } from "react";
import { Shield, Save, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toastSuccess, toastError } from "@/utils/toast";
import { getBrand, updateBrand } from "@/api/brand";
import { adminApi } from "@/api/admin";

const getZeroPolicyCategories = () => [
  {
    name: "Synthetic Content Detection",
    description: "Thresholds for synthetic media detection",
    settings: [
      { key: "synthetic_threshold", label: "Synthetic Confidence Threshold", description: "Block assets above this confidence level", value: 0, min: 0, max: 100, unit: "%" },
    ],
  },
  {
    name: "Brand Suitability",
    description: "Content safety and appropriateness checks",
    settings: [
      { key: "alcohol_threshold", label: "Alcohol Detection Threshold", description: "Flag content above this confidence level", value: 0, min: 0, max: 100, unit: "%" },
      { key: "minors_threshold", label: "Minors Detection Threshold", description: "Strict threshold for under-18 detection", value: 0, min: 0, max: 100, unit: "%" },
      { key: "violence_threshold", label: "Violence Detection Threshold", description: "Block violent content above this level", value: 0, min: 0, max: 100, unit: "%" },
    ],
  },
  {
    name: "Geo-Specific Rules",
    description: "Regulatory requirements by geography",
    settings: [
      { key: "germany_strict", label: "Germany (Strictest)", description: "EU AI Act Article 50 compliance", value: false, type: "boolean" },
      { key: "france_beauty", label: "France Beauty Standards", description: "Stricter rules for beauty/minor combinations", value: false, type: "boolean" },
    ],
  },
];

export default function Policies() {
  const [policies, setPolicies] = useState(getZeroPolicyCategories());
  const [brand, setBrand] = useState<any>(null);
  const [brandsList, setBrandsList] = useState<{ brand_id: string; brand_name: string }[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [isLoadingBrand, setIsLoadingBrand] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    adminApi.getBrandsList().then((r) => setBrandsList(r.brands || [])).catch(() => setBrandsList([]));
  }, []);

  useEffect(() => {
    if (selectedBrandId) {
      loadBrandData(selectedBrandId);
    } else {
      setPolicies(getZeroPolicyCategories());
      setBrand(null);
    }
  }, [selectedBrandId]);

  const loadBrandData = async (id: string) => {
    setIsLoadingBrand(true);
    try {
      const brandData = await getBrand(id);
      setBrand(brandData);
      setPolicies((prev) => {
        const updated = prev.map((cat) => ({ ...cat, settings: cat.settings.map((s) => ({ ...s })) }));
        const syntheticIndex = updated.findIndex((cat) => cat.name === "Synthetic Content Detection");
        if (syntheticIndex !== -1 && brandData.synthetic_threshold != null) {
          updated[syntheticIndex].settings[0].value = Math.round(brandData.synthetic_threshold * 100);
        }
        return updated;
      });
    } catch (error: any) {
      toastError(error.message || "Failed to load brand data");
      setPolicies(getZeroPolicyCategories());
    } finally {
      setIsLoadingBrand(false);
    }
  };

  const handleSliderChange = (categoryIndex: number, settingIndex: number, value: number[]) => {
    const updated = [...policies];
    updated[categoryIndex].settings[settingIndex].value = value[0];
    setPolicies(updated);
  };

  const handleSave = async () => {
    if (!selectedBrandId) {
      toastError("Select a brand to save policies", "No brand selected");
      return;
    }
    setIsSaving(true);
    try {
      const syntheticCategory = policies.find((cat) => cat.name === "Synthetic Content Detection");
      const syntheticThreshold = syntheticCategory?.settings[0]?.value != null
        ? (syntheticCategory.settings[0].value as number) / 100
        : brand?.synthetic_threshold;
      await updateBrand(selectedBrandId, { synthetic_threshold: syntheticThreshold });
      toastSuccess(`Policy configurations for ${brand?.brand_name || "brand"} have been updated`, "Policies saved");
      await loadBrandData(selectedBrandId);
    } catch (error: any) {
      toastError(error.message || "Failed to save policies");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Policies</h1>
          <p className="mt-1 text-muted-foreground">Configure compliance policies and thresholds per brand</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-[250px]">
            <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brandsList.map((b) => (
                  <SelectItem key={b.brand_id} value={b.brand_id}>{b.brand_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-gradient-primary" onClick={handleSave} disabled={!selectedBrandId || isSaving || isLoadingBrand}>
            {isSaving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : (<><Save className="mr-2 h-4 w-4" /> Save Changes</>)}
          </Button>
        </div>
      </div>

      {isLoadingBrand && selectedBrandId && (
        <Card className="border-primary bg-primary-light/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading brand policy data...</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {policies.map((category, categoryIndex) => (
          <Card key={category.name} className="card-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-display">{category.name}</CardTitle>
                  <CardDescription className="mt-1">{category.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.settings.map((setting, settingIndex) => (
                <div key={setting.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">{setting.label}</Label>
                      <p className="mt-1 text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    {"type" in setting && setting.type === "boolean" ? (
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={setting.value as boolean}
                          onCheckedChange={(checked) => {
                            const updated = [...policies];
                            updated[categoryIndex].settings[settingIndex].value = checked;
                            setPolicies(updated);
                          }}
                        />
                        <span className="text-sm">{setting.value ? "Enabled" : "Disabled"}</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold">{setting.value}{setting.unit}</span>
                    )}
                  </div>
                  {(!("type" in setting) || setting.type !== "boolean") && (
                    <Slider
                      value={[setting.value as number]}
                      onValueChange={(value) => handleSliderChange(categoryIndex, settingIndex, value)}
                      min={setting.min}
                      max={setting.max}
                      step={1}
                      className="w-full"
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-warning bg-warning-light/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <div>
              <h4 className="font-medium text-warning">Policy Changes</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Changes to policies will affect all new asset scans. Existing assets will not be re-evaluated unless manually re-scanned.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
