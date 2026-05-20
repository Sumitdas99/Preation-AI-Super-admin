import { cn } from "@/lib/utils";
import { StatusBadgeList } from "../primitives/StatusBadge";
import type { BrandSummaryRow } from "../types";

interface BrandListRowProps {
  row: BrandSummaryRow;
  selected: boolean;
  onSelect: (brandId: string) => void;
}

export function BrandListRow({ row, selected, onSelect }: BrandListRowProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(row.brandId)}
      aria-current={selected}
      className={cn(
        "flex min-w-0 flex-1 flex-col items-start border-r border-border md:border-r-0 md:border-b px-4 py-3 md:px-6 md:py-4 text-left text-sm transition-colors",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        selected
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted/50",
      )}
    >
      <div className="min-w-0 flex-1 space-y-2">
        <div
          className={cn(
            "truncate font-bold text-sm",
            selected ? "text-primary" : "text-foreground",
          )}
        >
          {row.brandName}
        </div>

        {(row.email || row.country) && (
          <div className="hidden space-y-0.5 md:block">
            {row.email && (
              <div className="truncate text-xs text-muted-foreground/85 font-medium">
                {row.email}
              </div>
            )}
            {row.country && (
              <div className="truncate text-[11px] text-muted-foreground/65">
                {row.country}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-1 pt-0.5">
          <StatusBadgeList badges={row.badges} size="compact" />
        </div>
        {row.trialExpiresLabel ? (
          <p
            className={cn(
              "hidden md:block text-[11px] font-semibold leading-tight",
              selected ? "text-primary/60" : "text-muted-foreground",
            )}
          >
            {row.trialExpiresLabel}
          </p>
        ) : null}
      </div>
    </button>
  );
}
