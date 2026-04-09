module {
  public type GenerateInput = {
    jobRole : Text;
    experienceLevel : Text;
    industry : Text;
    companyCulture : Text;
    resumeContent : ?Text;
  };

  public type JobDescription = {
    summary : Text;
    responsibilities : [Text];
    requiredSkills : [Text];
    preferredQualifications : [Text];
    equalOpportunityStatement : Text;
  };

  public type ScreeningCriteria = {
    mustHave : [Text];
    goodToHave : [Text];
    redFlags : [Text];
  };

  public type InterviewQuestions = {
    technical : [Text];
    behavioral : [Text];
    situational : [Text];
  };

  public type RubricCategory = {
    criteria : Text;
    scoringGuide : [Text];
  };

  public type EvaluationRubric = {
    technical : RubricCategory;
    communication : RubricCategory;
    problemSolving : RubricCategory;
    cultureFit : RubricCategory;
  };

  public type CandidateAnalysis = {
    identifiedSkills : [Text];
    experienceSummary : Text;
    strengths : [Text];
    skillGaps : [Text];
  };

  public type CandidateScore = {
    skillsScore : Nat;
    experienceScore : Nat;
    communicationScore : Nat;
    cultureFitScore : Nat;
    totalScore : Nat;
    verdict : Text;
    justification : Text;
  };

  public type RecruitmentResult = {
    jobDescription : JobDescription;
    screeningCriteria : ScreeningCriteria;
    interviewQuestions : InterviewQuestions;
    evaluationRubric : EvaluationRubric;
    candidateAnalysis : ?CandidateAnalysis;
    candidateScore : ?CandidateScore;
  };
};
