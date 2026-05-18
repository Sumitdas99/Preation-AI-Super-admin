import { Fragment } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepDefinition {
  id: string;
  label: string;
}

interface StepProgressProps {
  steps: StepDefinition[];
  activeIndex: number;
  className?: string;
}

export function StepProgress({
  steps,
  activeIndex,
  className,
}: StepProgressProps) {
  return (
    <nav
      aria-label="Onboarding progress"
      className={cn("w-full border-b border-slate-200 bg-white", className)}
    >
      <ol className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-[18px]">
        {steps.map((step, idx) => {
          const isComplete = idx < activeIndex;
          const isActive = idx === activeIndex;
          const prevComplete = idx > 0 && idx - 1 < activeIndex;
          const stepLabel = idx === 0 ? "Step 1 — Brand Details" : idx === 1 ? "Step 2 — Pack Configuration" : step.label;
          
          return (
            <Fragment key={step.id}>
              {idx > 0 && (
                <span
                  aria-hidden
                  className={cn(
                    "h-0.5 min-w-6 flex-1 rounded-full transition-colors",
                    prevComplete ? "bg-emerald-600" : "bg-slate-200",
                  )}
                />
              )}
              <li
                className="flex shrink-0 items-center gap-2.5"
                aria-current={isActive ? "step" : undefined}
              >
                <StepBadge
                  index={idx + 1}
                  complete={isComplete}
                  active={isActive}
                />
                <span
                  className={cn(
                    "font-display text-sm md:text-base tracking-tight transition-colors",
                    isActive && "font-semibold text-blue-900",
                    isComplete && "font-semibold text-emerald-700",
                    !isActive && !isComplete && "font-medium text-slate-400"
                  )}
                >
                  {stepLabel}
                </span>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

const BADGE_BASE =
  "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-all";

function StepBadge({
  index,
  complete,
  active,
}: {
  index: number;
  complete: boolean;
  active: boolean;
}) {
  if (complete) {
    return (
      <span className={cn(BADGE_BASE, "bg-emerald-600 text-white")}>
        <Check className="h-[17px] w-[17px]" aria-hidden strokeWidth={2.5} />
      </span>
    );
  }
  if (active) {
    return (
      <span
        className={cn(BADGE_BASE, "bg-[#0A1F44] text-white ring-[5px] ring-blue-100/80")}
      >
        {index}
      </span>
    );
  }
  return (
    <span className={cn(BADGE_BASE, "border-2 border-slate-200 bg-white text-slate-400")}>
      {index}
    </span>
  );
}
