import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ScoreBar } from "@/components/ScoreBar";
import { VerdictBadge } from "@/components/VerdictBadge";
import type { CandidateScore } from "@/types/recruitment";
import { Trophy } from "lucide-react";

interface CandidateScoreCardProps {
  data: CandidateScore;
}

function TotalScoreRing({ score }: { score: number }) {
  const capped = Math.min(Math.max(score, 0), 100);
  const colorClass =
    capped >= 80
      ? "text-chart-1"
      : capped >= 60
        ? "text-primary"
        : capped >= 40
          ? "text-chart-2"
          : "text-destructive";

  return (
    <div className="flex flex-col items-center justify-center gap-1 py-2">
      <span
        className={`text-5xl font-display font-bold tabular-nums ${colorClass}`}
      >
        {score}
      </span>
      <span className="text-sm text-muted-foreground font-medium">
        out of 100
      </span>
    </div>
  );
}

export function CandidateScoreCard({ data }: CandidateScoreCardProps) {
  const skills = Number(data.skillsScore);
  const experience = Number(data.experienceScore);
  const communication = Number(data.communicationScore);
  const cultureFit = Number(data.cultureFitScore);
  const total = Number(data.totalScore);

  return (
    <CollapsibleSection
      title="Candidate Score"
      subtitle="Weighted evaluation across all dimensions"
      icon={<Trophy size={18} />}
      defaultOpen={true}
      badge={<VerdictBadge verdict={data.verdict} size="sm" />}
      data-ocid="candidate-score-card"
    >
      <div className="space-y-5">
        {/* Total score display */}
        <div className="rounded-xl bg-muted/40 border border-border p-4 flex flex-col sm:flex-row items-center gap-4">
          <TotalScoreRing score={total} />
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                Final Verdict
              </span>
              <VerdictBadge verdict={data.verdict} size="lg" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed text-center sm:text-left max-w-xs">
              {data.justification}
            </p>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="space-y-3" data-ocid="score-breakdown">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Score Breakdown
          </h4>
          <ScoreBar
            label="Skills Match"
            score={skills}
            maxScore={40}
            weight="40%"
            data-ocid="score-skills"
          />
          <ScoreBar
            label="Experience"
            score={experience}
            maxScore={20}
            weight="20%"
            data-ocid="score-experience"
          />
          <ScoreBar
            label="Communication"
            score={communication}
            maxScore={20}
            weight="20%"
            data-ocid="score-communication"
          />
          <ScoreBar
            label="Culture Fit"
            score={cultureFit}
            maxScore={20}
            weight="20%"
            data-ocid="score-culture-fit"
          />
        </div>
      </div>
    </CollapsibleSection>
  );
}
