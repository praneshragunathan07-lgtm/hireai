import Types "../types/recruitment";
import Nat "mo:core/Nat";
import Char "mo:core/Char";
import Text "mo:core/Text";

module {
  // Double-quote char literal via Unicode escape (avoids malformed-operator parse bug)
  let dquote : Char = '\u{22}';

  // ── Text helpers ──────────────────────────────────────────────────────────

  // Convert text to a fixed char array for indexed access
  func chars(t : Text) : [Char] {
    t.toArray()
  };

  func slice(t : Text, from : Nat, to : Nat) : Text {
    let cs = chars(t);
    let end_ = if (to > cs.size()) cs.size() else to;
    if (from >= end_) return "";
    var r = "";
    var i = from;
    while (i < end_) { r #= cs[i].toText(); i += 1 };
    r
  };

  func sliceFrom(t : Text, from : Nat) : Text {
    slice(t, from, t.size())
  };

  func trimLeft(t : Text) : Text {
    let cs = chars(t);
    var i = 0;
    while (i < cs.size() and (cs[i] == ' ' or cs[i] == '\n' or cs[i] == '\r' or cs[i] == '\t')) {
      i += 1
    };
    sliceFrom(t, i)
  };

  // Find first occurrence of needle in haystack, return start index
  func findSub(haystack : Text, needle : Text) : ?Nat {
    let hc = chars(haystack);
    let nc = chars(needle);
    let hLen = hc.size();
    let nLen = nc.size();
    if (nLen == 0) return ?0;
    if (nLen > hLen) return null;
    var i = 0;
    while (i + nLen <= hLen) {
      var j = 0;
      var ok = true;
      while (j < nLen) {
        if (hc[i + j] != nc[j]) { ok := false };
        j += 1;
      };
      if (ok) return ?i;
      i += 1;
    };
    null
  };

  // Extract quoted string starting at position 0 (must start with '"')
  func extractQuoted(t : Text) : Text {
    let cs = chars(t);
    if (cs.size() == 0 or cs[0] != dquote) return "";
    var r = "";
    var i = 1;
    var esc = false;
    while (i < cs.size()) {
      let c = cs[i];
      if (esc) { r #= c.toText(); esc := false }
      else if (c == '\\') { esc := true }
      else if (c == dquote) { return r }
      else { r #= c.toText() };
      i += 1;
    };
    r
  };

  // Extract JSON string value for a key (e.g. "key": "value")
  func strField(json : Text, key : Text) : Text {
    let search = "\"" # key # "\":";
    switch (findSub(json, search)) {
      case null "";
      case (?start) {
        let after = trimLeft(sliceFrom(json, start + search.size()));
        extractQuoted(after)
      };
    }
  };

  // Extract JSON number value for a key (e.g. "key": 42)
  func natField(json : Text, key : Text) : Nat {
    let search = "\"" # key # "\":";
    switch (findSub(json, search)) {
      case null 0;
      case (?start) {
        let after = trimLeft(sliceFrom(json, start + search.size()));
        let cs = chars(after);
        var numStr = "";
        var i = 0;
        while (i < cs.size() and cs[i] >= '0' and cs[i] <= '9') {
          numStr #= cs[i].toText();
          i += 1;
        };
        switch (Nat.fromText(numStr)) { case (?n) n; case null 0 };
      };
    }
  };

  // Parse a JSON array of strings starting with '['
  func parseStrArray(t : Text) : [Text] {
    let cs = chars(t);
    if (cs.size() == 0 or cs[0] != '[') return [];
    var items : [Text] = [];
    var i = 1;
    while (i < cs.size()) {
      // skip whitespace and commas
      while (i < cs.size() and (cs[i] == ' ' or cs[i] == '\n' or cs[i] == '\r' or cs[i] == '\t' or cs[i] == ',')) {
        i += 1
      };
      if (i >= cs.size() or cs[i] == ']') return items;
      if (cs[i] == dquote) {
        let str = extractQuoted(sliceFrom(t, i));
        items := items.concat([str]);
        // advance past this quoted string
        i += 1; // skip opening quote
        var esc = false;
        var done = false;
        while (i < cs.size() and not done) {
          let c = cs[i];
          if (esc) { esc := false }
          else if (c == '\\') { esc := true }
          else if (c == dquote) { done := true };
          i += 1;
        };
      } else {
        i += 1;
      };
    };
    items
  };

  // Extract a JSON array of strings for a key
  func strArray(json : Text, key : Text) : [Text] {
    let search = "\"" # key # "\":";
    switch (findSub(json, search)) {
      case null [];
      case (?start) {
        let after = trimLeft(sliceFrom(json, start + search.size()));
        parseStrArray(after)
      };
    }
  };

  // Extract a balanced JSON object starting with '{'
  func extractObj(t : Text) : Text {
    let cs = chars(t);
    if (cs.size() == 0 or cs[0] != '{') return "{}";
    var depth = 0;
    var i = 0;
    var inStr = false;
    var esc = false;
    while (i < cs.size()) {
      let c = cs[i];
      if (esc) { esc := false }
      else if (inStr) {
        if (c == '\\') { esc := true }
        else if (c == dquote) { inStr := false }
      } else {
        if (c == dquote) { inStr := true }
        else if (c == '{') { depth += 1 }
        else if (c == '}') {
          depth -= 1;
          if (depth == 0) return slice(t, 0, i + 1);
        };
      };
      i += 1;
    };
    t
  };

  // Extract a JSON object for a given key
  func objField(json : Text, key : Text) : Text {
    let search = "\"" # key # "\":";
    switch (findSub(json, search)) {
      case null "{}";
      case (?start) {
        let after = trimLeft(sliceFrom(json, start + search.size()));
        extractObj(after)
      };
    }
  };

  func parseRubric(json : Text) : Types.RubricCategory {
    { criteria = strField(json, "criteria"); scoringGuide = strArray(json, "scoringGuide") }
  };

  // Strip ```json ... ``` markdown fences if present in OpenAI response
  func stripMarkdownFences(t : Text) : Text {
    let t1 = trimLeft(t);
    let cs = chars(t1);
    if (cs.size() >= 3 and cs[0] == '`' and cs[1] == '`' and cs[2] == '`') {
      var i = 3;
      while (i < cs.size() and cs[i] != '\n') { i += 1 };
      if (i < cs.size()) { i += 1 };
      let inner = sliceFrom(t1, i);
      switch (findSub(inner, "```")) {
        case null inner;
        case (?end_) slice(inner, 0, end_);
      }
    } else {
      t1
    }
  };

  // ── Public API ────────────────────────────────────────────────────────────

  // Build the single consolidated prompt for all 6 recruitment agents
  public func buildRecruitmentPrompt(input : Types.GenerateInput) : Text {
    let resumeSection = switch (input.resumeContent) {
      case null "";
      case (?content) {
        "\n\nRESUME TO ANALYZE:\n---\n" # content # "\n---\n\n" #
        "Since a resume was provided, also include these two additional keys in your JSON response:\n" #
        "\"candidateAnalysis\": {\n" #
        "  \"identifiedSkills\": [array of skill strings found in resume],\n" #
        "  \"experienceSummary\": \"2-3 sentence summary of candidate experience\",\n" #
        "  \"strengths\": [array of notable candidate strengths for this role],\n" #
        "  \"skillGaps\": [array of required skills missing from resume]\n" #
        "},\n" #
        "\"candidateScore\": {\n" #
        "  \"skillsScore\": integer 0-40 (skills match, 40% weight),\n" #
        "  \"experienceScore\": integer 0-20 (experience relevance, 20% weight),\n" #
        "  \"communicationScore\": integer 0-20 (inferred communication quality, 20% weight),\n" #
        "  \"cultureFitScore\": integer 0-20 (alignment with company culture, 20% weight),\n" #
        "  \"totalScore\": integer 0-100 (sum of the four scores above),\n" #
        "  \"verdict\": exactly one of: \"Strong Hire\", \"Hire\", \"Maybe\", \"Reject\",\n" #
        "  \"justification\": \"2-3 sentence explanation of the verdict and key deciding factors\"\n" #
        "}"
      };
    };

    "You are an expert AI recruitment system. Generate a complete set of recruitment artifacts.\n\n" #
    "ROLE DETAILS:\n" #
    "- Job Role: " # input.jobRole # "\n" #
    "- Experience Level: " # input.experienceLevel # "\n" #
    "- Industry: " # input.industry # "\n" #
    "- Company Culture: " # input.companyCulture # "\n" #
    resumeSection # "\n\n" #
    "MANDATORY LANGUAGE REQUIREMENTS:\n" #
    "- Use exclusively inclusive, bias-free language throughout all output\n" #
    "- Use gender-neutral pronouns (they/them) only — never he/she/his/her\n" #
    "- Never reference age, marital status, nationality, religion, or protected characteristics\n" #
    "- Focus solely on skills, competencies, and demonstrated professional abilities\n\n" #
    "Respond ONLY with a single valid JSON object. " #
    "Do not include markdown code fences, backticks, or any text outside the JSON.\n\n" #
    "JSON structure:\n" #
    "{\n" #
    "  \"jobDescription\": {\n" #
    "    \"summary\": \"2-3 sentence overview of the role\",\n" #
    "    \"responsibilities\": [\"at least 6 specific responsibilities\"],\n" #
    "    \"requiredSkills\": [\"at least 6 required skills\"],\n" #
    "    \"preferredQualifications\": [\"3-5 preferred qualifications\"],\n" #
    "    \"equalOpportunityStatement\": \"We are an Equal Opportunity Employer and value diversity. We do not discriminate based on race, color, religion, gender identity, sexual orientation, national origin, disability, age, or any other protected characteristic.\"\n" #
    "  },\n" #
    "  \"screeningCriteria\": {\n" #
    "    \"mustHave\": [\"5-7 non-negotiable requirements\"],\n" #
    "    \"goodToHave\": [\"4-6 desirable optional criteria\"],\n" #
    "    \"redFlags\": [\"4-6 warning signs\"]\n" #
    "  },\n" #
    "  \"interviewQuestions\": {\n" #
    "    \"technical\": [\"exactly 5 technical questions\"],\n" #
    "    \"behavioral\": [\"exactly 3 behavioral STAR questions\"],\n" #
    "    \"situational\": [\"exactly 2 situational scenario questions\"]\n" #
    "  },\n" #
    "  \"evaluationRubric\": {\n" #
    "    \"technical\": {\n" #
    "      \"criteria\": \"what technical proficiency means for this role\",\n" #
    "      \"scoringGuide\": [\"1 - No relevant technical knowledge\", \"2 - Basic familiarity\", \"3 - Solid working knowledge\", \"4 - Advanced expertise\", \"5 - Expert-level mastery\"]\n" #
    "    },\n" #
    "    \"communication\": {\n" #
    "      \"criteria\": \"ability to convey ideas clearly to diverse audiences\",\n" #
    "      \"scoringGuide\": [\"1 - Struggles to communicate clearly\", \"2 - Basic communication\", \"3 - Clear communicator\", \"4 - Excellent communicator\", \"5 - Exceptional communicator\"]\n" #
    "    },\n" #
    "    \"problemSolving\": {\n" #
    "      \"criteria\": \"analytical thinking and approach to challenges\",\n" #
    "      \"scoringGuide\": [\"1 - Cannot work independently\", \"2 - Solves simple problems with guidance\", \"3 - Methodical approach to complex problems\", \"4 - Creative solutions\", \"5 - Innovative, reframes problems\"]\n" #
    "    },\n" #
    "    \"cultureFit\": {\n" #
    "      \"criteria\": \"alignment with company values: " # input.companyCulture # "\",\n" #
    "      \"scoringGuide\": [\"1 - Values clearly misaligned\", \"2 - Some misalignment\", \"3 - Generally aligned\", \"4 - Strong alignment\", \"5 - Exceptional cultural match\"]\n" #
    "    }\n" #
    "  }\n" #
    "}"
  };

  // Parse the raw OpenAI JSON response into a RecruitmentResult
  public func parseRecruitmentResponse(jsonText : Text, hasResume : Bool) : Types.RecruitmentResult {
    let cleaned = stripMarkdownFences(jsonText);

    let jdJson = objField(cleaned, "jobDescription");
    let scJson = objField(cleaned, "screeningCriteria");
    let iqJson = objField(cleaned, "interviewQuestions");
    let erJson = objField(cleaned, "evaluationRubric");

    let jobDescription : Types.JobDescription = {
      summary = strField(jdJson, "summary");
      responsibilities = strArray(jdJson, "responsibilities");
      requiredSkills = strArray(jdJson, "requiredSkills");
      preferredQualifications = strArray(jdJson, "preferredQualifications");
      equalOpportunityStatement = strField(jdJson, "equalOpportunityStatement");
    };

    let screeningCriteria : Types.ScreeningCriteria = {
      mustHave = strArray(scJson, "mustHave");
      goodToHave = strArray(scJson, "goodToHave");
      redFlags = strArray(scJson, "redFlags");
    };

    let interviewQuestions : Types.InterviewQuestions = {
      technical = strArray(iqJson, "technical");
      behavioral = strArray(iqJson, "behavioral");
      situational = strArray(iqJson, "situational");
    };

    let evaluationRubric : Types.EvaluationRubric = {
      technical = parseRubric(objField(erJson, "technical"));
      communication = parseRubric(objField(erJson, "communication"));
      problemSolving = parseRubric(objField(erJson, "problemSolving"));
      cultureFit = parseRubric(objField(erJson, "cultureFit"));
    };

    let candidateAnalysis : ?Types.CandidateAnalysis = if (hasResume) {
      let caJson = objField(cleaned, "candidateAnalysis");
      ?{
        identifiedSkills = strArray(caJson, "identifiedSkills");
        experienceSummary = strField(caJson, "experienceSummary");
        strengths = strArray(caJson, "strengths");
        skillGaps = strArray(caJson, "skillGaps");
      }
    } else null;

    let candidateScore : ?Types.CandidateScore = if (hasResume) {
      let csJson = objField(cleaned, "candidateScore");
      ?{
        skillsScore = natField(csJson, "skillsScore");
        experienceScore = natField(csJson, "experienceScore");
        communicationScore = natField(csJson, "communicationScore");
        cultureFitScore = natField(csJson, "cultureFitScore");
        totalScore = natField(csJson, "totalScore");
        verdict = strField(csJson, "verdict");
        justification = strField(csJson, "justification");
      }
    } else null;

    {
      jobDescription;
      screeningCriteria;
      interviewQuestions;
      evaluationRubric;
      candidateAnalysis;
      candidateScore;
    }
  };
};
