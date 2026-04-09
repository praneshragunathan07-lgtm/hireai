import { CollapsibleSection } from "@/components/CollapsibleSection";
import type { EvaluationRubric, RubricCategory } from "@/types/recruitment";
import { ClipboardList, Cpu, Heart, MessageCircle, Puzzle } from "lucide-react";

interface EvaluationRubricCardProps {
  data: EvaluationRubric;
}

const SCORE_COLORS = [
  "bg-destructive/70",
  "bg-chart-2/70",
  "bg-chart-3/70",
  "bg-chart-1/50",
  "bg-chart-1",
];

function RubricRow({
  label,
  icon,
  category,
}: {
  label: string;
  icon: React.ReactNode;
  category: RubricCategory;
}) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 bg-muted/40 px-4 py-2.5 border-b border-border">
        <span className="text-primary">{icon}</span>
        <h4 className="text-sm font-semibold text-foreground">{label}</h4>
        <span className="ml-auto text-xs text-muted-foreground">
          {category.criteria}
        </span>
      </div>
      <div className="px-4 py-3">
        <div className="grid grid-cols-5 gap-2">
          {category.scoringGuide.slice(0, 5).map((guide, i) => (
            <div
              key={guide}
              className="space-y-1.5"
              data-ocid={`rubric-score-${i + 1}`}
            >
              <div className={`h-1.5 rounded-full ${SCORE_COLORS[i]}`} />
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-foreground">
                  {i + 1}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-tight">
                {guide}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EvaluationRubricCard({ data }: EvaluationRubricCardProps) {
  return (
    <CollapsibleSection
      title="Evaluation Rubric"
      subtitle="1–5 scoring guide per competency"
      icon={<ClipboardList size={18} />}
      defaultOpen={false}
      data-ocid="evaluation-rubric-card"
    >
      <div className="space-y-3">
        <RubricRow
          label="Technical"
          icon={<Cpu size={14} />}
          category={data.technical}
        />
        <RubricRow
          label="Communication"
          icon={<MessageCircle size={14} />}
          category={data.communication}
        />
        <RubricRow
          label="Problem Solving"
          icon={<Puzzle size={14} />}
          category={data.problemSolving}
        />
        <RubricRow
          label="Culture Fit"
          icon={<Heart size={14} />}
          category={data.cultureFit}
        />
      </div>
    </CollapsibleSection>
  );
}
