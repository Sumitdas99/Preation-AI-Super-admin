import { Check } from "lucide-react";
import type { BrandContact } from "@/api/schemas/billing";
import { cn } from "@/lib/utils";

interface BrandDetailsReadOnlyProps {
  brandName: string;
  contact: BrandContact;
}

export function BrandDetailsReadOnly({
  brandName,
  contact,
}: BrandDetailsReadOnlyProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-100 bg-[#f4fbf7]/40 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
          <h3 className="text-base font-bold text-slate-800">
            Brand information — completed
          </h3>
        </div>
        <span className="flex items-center gap-1 text-sm font-bold text-emerald-700">
          ✓ Saved
        </span>
      </header>
      <dl className="grid gap-x-6 gap-y-4 px-6 py-5 md:grid-cols-2">
        <ReadField label="Brand name" value={brandName} />
        <ReadField label="Registered country" value={contact.registered_country} />
        <ReadField label="Brand admin name" value={contact.brand_admin_name} />
        <ReadField label="Brand admin email" value={contact.brand_admin_email} />
        <ReadField
          label="Registered address"
          value={contact.registered_address}
          className="md:col-span-2"
          multiline
        />
      </dl>
    </section>
  );
}

interface ReadFieldProps {
  label: string;
  value: string;
  className?: string;
  multiline?: boolean;
}

function ReadField({ label, value, className, multiline }: ReadFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 min-w-0", className)}>
      <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </dt>
      <dd className={cn(
        "break-words text-[14px] font-semibold text-slate-900 border border-emerald-100 bg-[#f4fbf7]/45 rounded-md px-4 py-2.5",
        multiline ? "min-h-[4.5rem]" : "h-10 flex items-center"
      )}>
        {value || "—"}
      </dd>
    </div>
  );
}
