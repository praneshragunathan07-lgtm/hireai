import { CollapsibleSection } from "@/components/CollapsibleSection";
import { Badge } from "@/components/ui/badge";
import type { InterviewQuestions } from "@/types/recruitment";
import { Brain, Cpu, Lightbulb, MessageSquare } from "lucide-react";
import { useState } from "react";

interface InterviewQuestionsCardProps {
  data: InterviewQuestions;
}

type TabKey = "technical" | "behavioral" | "situational";

const TAB_DEFS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "technical", label: "Technical", icon: <Cpu size={14} /> },
  { key: "behavioral", label: "Behavioral", icon: <Brain size={14} /> },
  { key: "situational", label: "Situational", icon: <Lightbulb size={14} /> },
];

function QuestionList({ questions }: { questions: string[] }) {
  return (
    <ol className="space-y-3">
      {questions.map((q, i) => (
        <li
          key={q}
          className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border hover:bg-muted/70 transition-smooth"
          data-ocid={`interview-question-${i}`}
        >
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <p className="text-sm text-foreground leading-relaxed">{q}</p>
        </li>
      ))}
    </ol>
  );
}

export function InterviewQuestionsCard({ data }: InterviewQuestionsCardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("technical");

  const questions: Record<TabKey, string[]> = {
    technical: data.technical,
    behavioral: data.behavioral,
    situational: data.situational,
  };

  return (
    <CollapsibleSection
      title="Interview Questions"
      subtitle="Structured questions across all dimensions"
      icon={<MessageSquare size={18} />}
      defaultOpen={true}
      data-ocid="interview-questions-card"
    >
      <div className="space-y-4">
        <div className="flex gap-1 rounded-lg bg-muted/50 p-1 border border-border">
          {TAB_DEFS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              data-ocid={`tab-${tab.key}`}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-smooth ${
                activeTab === tab.key
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <Badge
                variant="secondary"
                className="text-xs px-1.5 py-0 h-4 min-w-[1.25rem]"
              >
                {questions[tab.key].length}
              </Badge>
            </button>
          ))}
        </div>

        <QuestionList questions={questions[activeTab]} />
      </div>
    </CollapsibleSection>
  );
}
