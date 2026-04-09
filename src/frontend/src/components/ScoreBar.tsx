import { cn } from "@/lib/utils";

interface ScoreBarProps {
  label: string;
  score: number;
  maxScore?: number;
  className?: string;
  weight?: string;
}

function getScoreColor(score: number, max: number): string {
  const pct = score / max;
  if (pct >= 0.8) return "from-chart-1 to-chart-1";
  if (pct >= 0.6) return "from-chart-2 via-chart-1 to-chart-1";
  if (pct >= 0.4) return "from-chart-2 to-chart-2";
  return "from-destructive to-chart-2";
}

export function ScoreBar({
  label,
  score,
  maxScore = 100,
  className,
  weight,
}: ScoreBarProps) {
  const percentage = Math.min(Math.max((score / maxScore) * 100, 0), 100);
  const colorClass = getScoreColor(score, maxScore);

  return (
    <div className={cn("space-y-1.5", className)} data-ocid="score-bar">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-foreground truncate">
            {label}
          </span>
          {weight && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              ({weight})
            </span>
          )}
        </div>
        <span className="text-sm font-semibold text-foreground flex-shrink-0 tabular-nums">
          {score}
          <span className="text-muted-foreground font-normal">/{maxScore}</span>
        </span>
      </div>
      <div
        className="h-2.5 rounded-full bg-muted overflow-hidden"
        role="progressbar"
        tabIndex={0}
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={maxScore}
        aria-label={label}
      >
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out",
            colorClass,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
