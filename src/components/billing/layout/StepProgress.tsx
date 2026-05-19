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
      className={cn("w-full border-b border-border bg-card", className)}
    >
      <ol className="mx-auto flex max-w-6xl items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-[18px] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                    prevComplete ? "bg-primary" : "bg-muted",
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
                    "font-display text-xs sm:text-sm md:text-base tracking-tight transition-colors whitespace-nowrap",
                    isActive && "font-semibold text-primary",
                    isComplete && "font-semibold text-primary/80",
                    !isActive && !isComplete && "font-medium text-muted-foreground"
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
      <span className={cn(BADGE_BASE, "bg-primary text-primary-foreground")}>
        <Check className="h-[17px] w-[17px]" aria-hidden strokeWidth={2.5} />
      </span>
    );
  }
  if (active) {
    return (
      <span
        className={cn(BADGE_BASE, "bg-primary text-primary-foreground ring-[5px] ring-primary/20")}
      >
        {index}
      </span>
    );
  }
  return (
    <span className={cn(BADGE_BASE, "border-2 border-border bg-card text-muted-foreground")}>
      {index}
    </span>
  );
}
