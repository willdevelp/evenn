import { Crown } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Badge, badgeVariants } from "@/src/components/ui/badge";
import { getContestTiming } from "@/lib/vote-format";

export type ContestTiming = ReturnType<typeof getContestTiming>;

type StatusMeta = {
  label: string;
  variant: VariantProps<typeof badgeVariants>["variant"];
  dot: string;
};

/** Libellés et couleurs partagés par toutes les pages de vote. */
export const CONTEST_STATUS: Record<ContestTiming, StatusMeta> = {
  upcoming: { label: "Bientôt disponible", variant: "warning", dot: "bg-amber-500" },
  open: { label: "Votes ouverts", variant: "success", dot: "bg-emerald-500" },
  closed: { label: "Terminé", variant: "default", dot: "bg-slate-400" },
};

/** Badge "frost" posé sur une photo ou un visuel sombre. */
export function ContestStatusChip({
  timing,
  className,
}: {
  timing: ContestTiming;
  className?: string;
}) {
  const status = CONTEST_STATUS[timing];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90 py-1 pl-2.5 pr-3 text-xs font-bold text-slate-700 shadow-sm backdrop-blur",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          status.dot,
          timing === "closed" ? "" : "motion-safe:animate-pulse",
        )}
      />
      {status.label}
    </span>
  );
}

/** Badge plat pour un usage hors visuel. */
export function ContestStatusBadge({
  timing,
  className,
}: {
  timing: ContestTiming;
  className?: string;
}) {
  const status = CONTEST_STATUS[timing];

  return (
    <Badge variant={status.variant} className={className}>
      <Crown aria-hidden />
      {status.label}
    </Badge>
  );
}
