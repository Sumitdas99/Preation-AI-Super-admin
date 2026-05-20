import { Fragment, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

const BAR =
  "flex h-16 shrink-0 items-center gap-3  px-4 text-white shadow-sm overflow-hidden sm:gap-4 sm:px-6";

const PILL =
  "shrink-0 whitespace-nowrap rounded-md border-[1.5px] border-[#E8943A]/50 bg-[#E8943A]/10 px-4 py-1.5 text-xs font-medium text-[#F5A623]";

const SUPER_ADMIN_TAG =
  "ml-1 shrink-0 whitespace-nowrap rounded  px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0A1F44]";

interface AdminTopBarProps {
  title: string;
  breadcrumbs?: BreadcrumbSegment[];
  rightSlot?: ReactNode;
  onMenuClick?: () => void;
}

export function AdminTopBar({ title, breadcrumbs, rightSlot, onMenuClick }: AdminTopBarProps) {
  return (
    <header className={BAR}>
      {onMenuClick ? (
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="-ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-white md:hidden"
        >
          <Menu className="h-5 w-5" strokeWidth={2.5} aria-hidden />
        </button>
      ) : null}

      <span className="shrink-0 whitespace-nowrap font-display text-lg font-semibold tracking-tight">
        Praetion <span className="text-[#F5A623]">Admin</span>
      </span>

      <span className={SUPER_ADMIN_TAG}>Super Admin</span>

      <span className="h-5 w-px shrink-0 bg-white/20" aria-hidden />

      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav aria-label="Breadcrumbs" className="min-w-0 flex-1 truncate text-sm font-medium text-white/95">
          <ol className="flex items-center gap-2 overflow-hidden">
            {breadcrumbs.map((seg, idx) => (
              <Fragment key={idx}>
                {idx > 0 && <span className="text-white/40 font-normal">→</span>}
                <li className={cn(
                  "truncate",
                  idx === breadcrumbs.length - 1 ? "text-white font-semibold" : "text-white/60 font-normal"
                )}>
                  {seg.label}
                </li>
              </Fragment>
            ))}
          </ol>
        </nav>
      ) : (
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
          {title}
        </span>
      )}

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <span className={PILL}>Super Admin</span>
        {rightSlot}
      </div>
    </header>
  );
}
