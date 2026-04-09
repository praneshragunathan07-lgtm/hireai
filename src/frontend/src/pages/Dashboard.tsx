import { CollapsibleSection } from "@/components/CollapsibleSection";
import { JobInputForm } from "@/components/JobInputForm";
import { Layout } from "@/components/Layout";
import { ScoreBar } from "@/components/ScoreBar";
import { VerdictBadge } from "@/components/VerdictBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRecruitmentStore } from "@/store/recruitmentStore";
import type { RecruitmentResult } from "@/types/recruitment";
import {
  AlertTriangleIcon,
  BrainIcon,
  CheckCircle2Icon,
  CheckSquareIcon,
  ClipboardListIcon,
  FileTextIcon,
  HelpCircleIcon,
  ListChecksIcon,
  MessageCircleIcon,
  PrinterIcon,
  StarIcon,
  UserCheckIcon,
  XCircleIcon,
} from "lucide-react";

/* ─── Empty State ─────────────────────────────────────────────────────────── */
function EmptyResults() {
  return (
    <div
      className="card-elevated rounded-xl p-12 flex flex-col items-center justify-center text-center gap-4"
      data-ocid="empty-state-results"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
          aria-hidden="true"
        >
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
          <path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75z" />
          <path d="M5 18l.75 2.25L8 21l-2.25.75L5 24l-.75-2.25L2 21l2.25-.75z" />
        </svg>
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="font-display font-semibold text-foreground text-lg">
          Ready to generate
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Fill in the job details on the left and click{" "}
          <strong className="text-foreground">Generate Analysis</strong> to
          receive a complete recruitment package powered by AI.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {[
          "Job Description",
          "Screening Criteria",
          "Interview Questions",
          "Evaluation Rubric",
        ].map((item) => (
          <Badge key={item} variant="secondary" className="text-xs">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

/* ─── Results Panel ───────────────────────────────────────────────────────── */
function ResultsPanel({ result }: { result: RecruitmentResult }) {
  const {
    jobDescription: jd,
    screeningCriteria: sc,
    interviewQuestions: iq,
    evaluationRubric: er,
    candidateAnalysis: ca,
    candidateScore: cs,
  } = result;

  const handlePrint = () => window.print();

  const rubricCategories = [
    { key: "technical", label: "Technical Skills", rubric: er.technical },
    { key: "communication", label: "Communication", rubric: er.communication },
    {
      key: "problemSolving",
      label: "Problem Solving",
      rubric: er.problemSolving,
    },
    { key: "cultureFit", label: "Culture Fit", rubric: er.cultureFit },
  ];

  return (
    <div className="space-y-4" data-ocid="results-panel">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {ca
            ? "Full analysis with candidate evaluation"
            : "Job artifacts generated — upload a resume for candidate scoring"}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="gap-1.5 text-xs"
          data-ocid="btn-export-pdf"
        >
          <PrinterIcon size={13} />
          Export PDF
        </Button>
      </div>

      {/* Top row: JD + Screening */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Job Description */}
        <CollapsibleSection
          title="Job Description"
          subtitle={`${jd.summary.slice(0, 60)}…`}
          icon={<FileTextIcon size={16} />}
        >
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground leading-relaxed">
              {jd.summary}
            </p>
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Responsibilities
              </h4>
              <ul className="space-y-1">
                {jd.responsibilities.map((r) => (
                  <li key={r} className="flex gap-2 text-muted-foreground">
                    <CheckCircle2Icon
                      size={14}
                      className="text-primary mt-0.5 flex-shrink-0"
                    />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Required Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {jd.requiredSkills.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            {jd.preferredQualifications.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Preferred Qualifications
                </h4>
                <ul className="space-y-1">
                  {jd.preferredQualifications.map((q) => (
                    <li key={q} className="text-muted-foreground flex gap-2">
                      <StarIcon
                        size={13}
                        className="text-chart-2 mt-0.5 flex-shrink-0"
                      />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-xs text-muted-foreground italic border-t border-border pt-3">
              {jd.equalOpportunityStatement}
            </p>
          </div>
        </CollapsibleSection>

        {/* Screening Criteria */}
        <CollapsibleSection
          title="Screening Criteria"
          icon={<ListChecksIcon size={16} />}
        >
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="flex items-center gap-1.5 font-semibold text-foreground mb-2">
                <CheckSquareIcon size={14} className="text-chart-1" />
                Must-Have
              </h4>
              <ul className="space-y-1">
                {sc.mustHave.map((item) => (
                  <li key={item} className="flex gap-2 text-muted-foreground">
                    <CheckCircle2Icon
                      size={13}
                      className="text-chart-1 mt-0.5 flex-shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="flex items-center gap-1.5 font-semibold text-foreground mb-2">
                <StarIcon size={14} className="text-chart-2" />
                Good-to-Have
              </h4>
              <ul className="space-y-1">
                {sc.goodToHave.map((item) => (
                  <li key={item} className="flex gap-2 text-muted-foreground">
                    <StarIcon
                      size={13}
                      className="text-chart-2 mt-0.5 flex-shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="flex items-center gap-1.5 font-semibold text-foreground mb-2">
                <AlertTriangleIcon size={14} className="text-destructive" />
                Red Flags
              </h4>
              <ul className="space-y-1">
                {sc.redFlags.map((item) => (
                  <li key={item} className="flex gap-2 text-muted-foreground">
                    <XCircleIcon
                      size={13}
                      className="text-destructive mt-0.5 flex-shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      {/* Interview Questions */}
      <CollapsibleSection
        title="Interview Questions"
        icon={<MessageCircleIcon size={16} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-1.5">
              <BrainIcon size={14} className="text-primary" />
              Technical ({iq.technical.length})
            </h4>
            <ol className="space-y-2 list-decimal list-inside">
              {iq.technical.map((q) => (
                <li key={q} className="text-muted-foreground leading-relaxed">
                  {q}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-1.5">
              <UserCheckIcon size={14} className="text-chart-2" />
              Behavioral ({iq.behavioral.length})
            </h4>
            <ol className="space-y-2 list-decimal list-inside">
              {iq.behavioral.map((q) => (
                <li key={q} className="text-muted-foreground leading-relaxed">
                  {q}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-1.5">
              <HelpCircleIcon size={14} className="text-accent" />
              Situational ({iq.situational.length})
            </h4>
            <ol className="space-y-2 list-decimal list-inside">
              {iq.situational.map((q) => (
                <li key={q} className="text-muted-foreground leading-relaxed">
                  {q}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </CollapsibleSection>

      {/* Evaluation Rubric */}
      <CollapsibleSection
        title="Evaluation Rubric"
        icon={<ClipboardListIcon size={16} />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
          {rubricCategories.map(({ key, label, rubric }) => (
            <div key={key} className="space-y-2">
              <h4 className="font-semibold text-foreground">{label}</h4>
              <p className="text-xs text-muted-foreground">{rubric.criteria}</p>
              <div className="space-y-1">
                {rubric.scoringGuide.map((guide, scoreIdx) => (
                  <div key={guide} className="flex gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                      {scoreIdx + 1}
                    </span>
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      {guide}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Candidate Analysis + Score (only when resume provided) */}
      {ca && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Analysis */}
          <CollapsibleSection
            title="Candidate Analysis"
            icon={<UserCheckIcon size={16} />}
          >
            <div className="space-y-4 text-sm">
              <p className="text-muted-foreground leading-relaxed">
                {ca.experienceSummary}
              </p>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Identified Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {ca.identifiedSkills.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {ca.strengths.map((s) => (
                    <li key={s} className="flex gap-2 text-muted-foreground">
                      <CheckCircle2Icon
                        size={13}
                        className="text-chart-1 mt-0.5 flex-shrink-0"
                      />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {ca.skillGaps.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Skill Gaps
                  </h4>
                  <ul className="space-y-1">
                    {ca.skillGaps.map((s) => (
                      <li key={s} className="flex gap-2 text-muted-foreground">
                        <XCircleIcon
                          size={13}
                          className="text-destructive mt-0.5 flex-shrink-0"
                        />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Score + Verdict */}
          {cs && (
            <CollapsibleSection
              title="Final Score & Verdict"
              icon={<StarIcon size={16} />}
              badge={<VerdictBadge verdict={cs.verdict} size="sm" />}
            >
              <div className="space-y-5 text-sm">
                <div className="space-y-3">
                  <ScoreBar
                    label="Skills Match"
                    score={Number(cs.skillsScore)}
                    maxScore={40}
                    weight="40%"
                  />
                  <ScoreBar
                    label="Experience"
                    score={Number(cs.experienceScore)}
                    maxScore={20}
                    weight="20%"
                  />
                  <ScoreBar
                    label="Communication"
                    score={Number(cs.communicationScore)}
                    maxScore={20}
                    weight="20%"
                  />
                  <ScoreBar
                    label="Culture Fit"
                    score={Number(cs.cultureFitScore)}
                    maxScore={20}
                    weight="20%"
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                  <span className="font-semibold text-foreground">
                    Total Score
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold font-display text-foreground tabular-nums">
                      {Number(cs.totalScore)}
                    </span>
                    <span className="text-muted-foreground text-sm">/100</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1.5">
                    Verdict
                  </h4>
                  <VerdictBadge verdict={cs.verdict} size="lg" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1.5">
                    Justification
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {cs.justification}
                  </p>
                </div>
              </div>
            </CollapsibleSection>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Dashboard ───────────────────────────────────────────────────────────── */
export function Dashboard() {
  const result = useRecruitmentStore((s) => s.result);

  return (
    <Layout
      sidebarContent={<JobInputForm />}
      mainContent={result ? <ResultsPanel result={result} /> : <EmptyResults />}
    />
  );
}
