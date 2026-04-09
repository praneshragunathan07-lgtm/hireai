import { CollapsibleSection } from "@/components/CollapsibleSection";
import type { JobDescription } from "@/types/recruitment";
import {
  Briefcase,
  CheckCircle2,
  GraduationCap,
  ListChecks,
  Star,
} from "lucide-react";

interface JobDescriptionCardProps {
  data: JobDescription;
}

function BulletList({
  items,
  icon,
}: { items: string[]; icon?: React.ReactNode }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2 text-sm text-foreground leading-relaxed"
        >
          <span className="flex-shrink-0 mt-0.5 text-primary">
            {icon ?? <CheckCircle2 size={14} />}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionHeading({
  label,
  icon,
}: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-primary">{icon}</span>
      <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
        {label}
      </h4>
    </div>
  );
}

export function JobDescriptionCard({ data }: JobDescriptionCardProps) {
  return (
    <CollapsibleSection
      title="Job Description"
      subtitle="Auto-generated, bias-free role overview"
      icon={<Briefcase size={18} />}
      defaultOpen={true}
      data-ocid="job-description-card"
    >
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {data.summary}
        </p>

        <div>
          <SectionHeading
            label="Responsibilities"
            icon={<ListChecks size={14} />}
          />
          <BulletList items={data.responsibilities} />
        </div>

        <div>
          <SectionHeading label="Required Skills" icon={<Star size={14} />} />
          <BulletList items={data.requiredSkills} />
        </div>

        <div>
          <SectionHeading
            label="Preferred Qualifications"
            icon={<GraduationCap size={14} />}
          />
          <BulletList items={data.preferredQualifications} />
        </div>

        <div className="rounded-lg bg-primary/8 border border-primary/20 px-4 py-3">
          <p className="text-xs text-primary/90 leading-relaxed font-medium">
            ⚖️ {data.equalOpportunityStatement}
          </p>
        </div>
      </div>
    </CollapsibleSection>
  );
}
