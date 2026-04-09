export interface GenerateInput {
  jobRole: string;
  experienceLevel: string;
  industry: string;
  companyCulture: string;
  resumeContent?: string;
}

export interface JobDescription {
  summary: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredQualifications: string[];
  equalOpportunityStatement: string;
}

export interface ScreeningCriteria {
  mustHave: string[];
  goodToHave: string[];
  redFlags: string[];
}

export interface InterviewQuestions {
  technical: string[];
  behavioral: string[];
  situational: string[];
}

export interface RubricCategory {
  criteria: string;
  scoringGuide: string[];
}

export interface EvaluationRubric {
  technical: RubricCategory;
  communication: RubricCategory;
  problemSolving: RubricCategory;
  cultureFit: RubricCategory;
}

export interface CandidateAnalysis {
  identifiedSkills: string[];
  strengths: string[];
  skillGaps: string[];
  experienceSummary: string;
}

export interface CandidateScore {
  skillsScore: bigint;
  experienceScore: bigint;
  communicationScore: bigint;
  cultureFitScore: bigint;
  totalScore: bigint;
  verdict: string;
  justification: string;
}

export interface RecruitmentResult {
  jobDescription: JobDescription;
  screeningCriteria: ScreeningCriteria;
  interviewQuestions: InterviewQuestions;
  evaluationRubric: EvaluationRubric;
  candidateAnalysis?: CandidateAnalysis;
  candidateScore?: CandidateScore;
}

export type Verdict = "Strong Hire" | "Hire" | "Maybe" | "Reject";
