import { cn } from "@/lib/utils";
import type { Verdict } from "@/types/recruitment";

interface VerdictBadgeProps {
  verdict: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function normalizeVerdict(verdict: string): Verdict {
  const v = verdict.toLowerCase().trim();
  if (v === "strong hire" || v === "stronghire") return "Strong Hire";
  if (v === "hire") return "Hire";
  if (v === "maybe") return "Maybe";
  return "Reject";
}

const verdictStyles: Record<Verdict, string> = {
  "Strong Hire": "bg-chart-1/20 text-chart-1 border border-chart-1/30",
  Hire: "bg-primary/15 text-primary border border-primary/30",
  Maybe: "bg-chart-2/20 text-chart-2 border border-chart-2/30",
  Reject: "bg-destructive/15 text-destructive border border-destructive/30",
};

const sizeStyles = {
  sm: "px-2.5 py-0.5 text-xs",
  md: "px-3.5 py-1 text-sm",
  lg: "px-5 py-2 text-base font-semibold",
};

export function VerdictBadge({
  verdict,
  size = "md",
  className,
}: VerdictBadgeProps) {
  const normalized = normalizeVerdict(verdict);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-smooth",
        verdictStyles[normalized],
        sizeStyles[size],
        className,
      )}
      data-ocid="verdict-badge"
    >
      {normalized}
    </span>
  );
}
