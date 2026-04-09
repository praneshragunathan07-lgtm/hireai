import { CollapsibleSection } from "@/components/CollapsibleSection";
import type { ScreeningCriteria } from "@/types/recruitment";
import { AlertTriangle, CheckCircle2, Filter, Plus } from "lucide-react";

interface ScreeningCriteriaCardProps {
  data: ScreeningCriteria;
}

interface CriteriaColumnProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
  iconClass: string;
  titleClass: string;
  bgClass: string;
  borderClass: string;
}

function CriteriaColumn({
  title,
  items,
  icon,
  iconClass,
  titleClass,
  bgClass,
  borderClass,
}: CriteriaColumnProps) {
  return (
    <div
      className={`rounded-lg border p-4 space-y-3 ${bgClass} ${borderClass}`}
    >
      <div className="flex items-center gap-2">
        <span className={iconClass}>{icon}</span>
        <h4 className={`text-sm font-semibold ${titleClass}`}>{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm text-foreground leading-snug"
          >
            <span className={`flex-shrink-0 mt-0.5 ${iconClass}`}>{icon}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ScreeningCriteriaCard({ data }: ScreeningCriteriaCardProps) {
  return (
    <CollapsibleSection
      title="Screening Criteria"
      subtitle="Qualification benchmarks and red flags"
      icon={<Filter size={18} />}
      defaultOpen={true}
      data-ocid="screening-criteria-card"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <CriteriaColumn
          title="Must-Have"
          items={data.mustHave}
          icon={<CheckCircle2 size={13} />}
          iconClass="text-chart-1"
          titleClass="text-chart-1"
          bgClass="bg-chart-1/5"
          borderClass="border-chart-1/20"
        />
        <CriteriaColumn
          title="Good-to-Have"
          items={data.goodToHave}
          icon={<Plus size={13} />}
          iconClass="text-primary"
          titleClass="text-primary"
          bgClass="bg-primary/5"
          borderClass="border-primary/20"
        />
        <CriteriaColumn
          title="Red Flags"
          items={data.redFlags}
          icon={<AlertTriangle size={13} />}
          iconClass="text-destructive"
          titleClass="text-destructive"
          bgClass="bg-destructive/5"
          borderClass="border-destructive/20"
        />
      </div>
    </CollapsibleSection>
  );
}
