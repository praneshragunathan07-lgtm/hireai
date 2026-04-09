import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RecruitmentResult {
    evaluationRubric: EvaluationRubric;
    interviewQuestions: InterviewQuestions;
    jobDescription: JobDescription;
    candidateAnalysis?: CandidateAnalysis;
    candidateScore?: CandidateScore;
    screeningCriteria: ScreeningCriteria;
}
export interface ScreeningCriteria {
    mustHave: Array<string>;
    redFlags: Array<string>;
    goodToHave: Array<string>;
}
export interface CandidateScore {
    justification: string;
    experienceScore: bigint;
    verdict: string;
    skillsScore: bigint;
    totalScore: bigint;
    cultureFitScore: bigint;
    communicationScore: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface JobDescription {
    responsibilities: Array<string>;
    preferredQualifications: Array<string>;
    summary: string;
    requiredSkills: Array<string>;
    equalOpportunityStatement: string;
}
export interface InterviewQuestions {
    situational: Array<string>;
    technical: Array<string>;
    behavioral: Array<string>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface RubricCategory {
    scoringGuide: Array<string>;
    criteria: string;
}
export interface CandidateAnalysis {
    strengths: Array<string>;
    skillGaps: Array<string>;
    identifiedSkills: Array<string>;
    experienceSummary: string;
}
export interface EvaluationRubric {
    communication: RubricCategory;
    problemSolving: RubricCategory;
    technical: RubricCategory;
    cultureFit: RubricCategory;
}
export interface GenerateInput {
    experienceLevel: string;
    resumeContent?: string;
    jobRole: string;
    companyCulture: string;
    industry: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface backendInterface {
    generateRecruitmentArtifacts(input: GenerateInput): Promise<{
        __kind__: "ok";
        ok: RecruitmentResult;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setOpenAIApiKey(key: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
