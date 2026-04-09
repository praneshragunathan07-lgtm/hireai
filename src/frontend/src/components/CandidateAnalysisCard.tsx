import { CollapsibleSection } from "@/components/CollapsibleSection";
import { Badge } from "@/components/ui/badge";
import type { CandidateAnalysis } from "@/types/recruitment";
import { AlertTriangle, CheckCircle2, UserSearch, Zap } from "lucide-react";

interface CandidateAnalysisCardProps {
  data: CandidateAnalysis;
}

export function CandidateAnalysisCard({ data }: CandidateAnalysisCardProps) {
  return (
    <CollapsibleSection
      title="Candidate Analysis"
      subtitle="Resume-based skill and experience review"
      icon={<UserSearch size={18} />}
      defaultOpen={true}
      data-ocid="candidate-analysis-card"
    >
      <div className="space-y-5">
        {/* Experience Summary */}
        <div className="rounded-lg bg-muted/40 border border-border px-4 py-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Zap size={13} className="text-primary" />
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
              Experience Summary
            </h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {data.experienceSummary}
          </p>
        </div>

        {/* Identified Skills */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
              Identified Skills
            </h4>
          </div>
          <div className="flex flex-wrap gap-2" data-ocid="identified-skills">
            {data.identifiedSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-primary/10 text-primary border border-primary/20 text-xs"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={13} className="text-chart-1" />
            <h4 className="text-xs font-semibold text-chart-1 uppercase tracking-wide">
              Strengths
            </h4>
          </div>
          <ul className="space-y-1.5">
            {data.strengths.map((s) => (
              <li
                key={s}
                className="flex items-start gap-2 text-sm text-foreground"
                data-ocid={`strength-${s}`}
              >
                <CheckCircle2
                  size={14}
                  className="flex-shrink-0 mt-0.5 text-chart-1"
                />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skill Gaps */}
        {data.skillGaps.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={13} className="text-chart-2" />
              <h4 className="text-xs font-semibold text-chart-2 uppercase tracking-wide">
                Skill Gaps
              </h4>
            </div>
            <ul className="space-y-1.5">
              {data.skillGaps.map((gap) => (
                <li
                  key={gap}
                  className="flex items-start gap-2 text-sm text-foreground"
                  data-ocid={`skill-gap-${gap}`}
                >
                  <AlertTriangle
                    size={14}
                    className="flex-shrink-0 mt-0.5 text-chart-2"
                  />
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}
