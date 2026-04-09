import Types "../types/recruitment";
import RecruitmentLib "../lib/recruitment";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Char "mo:core/Char";
import Text "mo:core/Text";
import Error "mo:core/Error";

mixin (openAIApiKey : { var value : Text }) {
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input)
  };

  // Set the OpenAI API key — call this once after deployment with your key
  public shared func setOpenAIApiKey(key : Text) : async () {
    openAIApiKey.value := key;
  };

  public func generateRecruitmentArtifacts(input : Types.GenerateInput) : async { #ok : Types.RecruitmentResult; #err : Text } {
    if (openAIApiKey.value == "") {
      return #err("OpenAI API key is not configured. Please call setOpenAIApiKey() with your API key first.");
    };

    let prompt = RecruitmentLib.buildRecruitmentPrompt(input);
    let requestBody = buildOpenAIRequest(prompt);

    let headers : [OutCall.Header] = [
      { name = "Content-Type"; value = "application/json" },
      { name = "Authorization"; value = "Bearer " # openAIApiKey.value },
    ];

    try {
      let responseText = await OutCall.httpPostRequest(
        "https://api.openai.com/v1/chat/completions",
        headers,
        requestBody,
        transform,
      );

      let jsonContent = extractChatContent(responseText);
      if (jsonContent == "") {
        return #err("Failed to extract content from OpenAI response. Raw: " # responseText);
      };

      let hasResume = switch (input.resumeContent) {
        case null false;
        case (?_) true;
      };

      let result = RecruitmentLib.parseRecruitmentResponse(jsonContent, hasResume);
      #ok(result)
    } catch (e) {
      #err("HTTP outcall failed: " # e.message())
    }
  };

  // Build the OpenAI chat completion request body
  func buildOpenAIRequest(prompt : Text) : Text {
    "{" #
    "\"model\":\"gpt-4o-mini\"," #
    "\"temperature\":0.7," #
    "\"response_format\":{\"type\":\"json_object\"}," #
    "\"messages\":[" #
      "{\"role\":\"system\",\"content\":\"You are an expert AI recruitment system. Always respond with valid JSON only, no markdown fences.\"}," #
      "{\"role\":\"user\",\"content\":" # escapeJsonString(prompt) # "}" #
    "]" #
    "}"
  };

  // Extract the "content" string from the first choice of an OpenAI response
  func extractChatContent(response : Text) : Text {
    let search = "\"content\":";
    switch (findFirstSub(response, search)) {
      case null "";
      case (?start) {
        let after = trimL(sliceFrom(response, start + search.size()));
        extractQuoted(after)
      };
    }
  };

  func toChars(t : Text) : [Char] {
    t.toArray()
  };

  func findFirstSub(haystack : Text, needle : Text) : ?Nat {
    let hc = toChars(haystack);
    let nc = toChars(needle);
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

  func sliceFrom(t : Text, from : Nat) : Text {
    let cs = toChars(t);
    if (from >= cs.size()) return "";
    var r = "";
    var i = from;
    while (i < cs.size()) { r #= cs[i].toText(); i += 1 };
    r
  };

  func trimL(t : Text) : Text {
    let cs = toChars(t);
    var i = 0;
    while (i < cs.size() and (cs[i] == ' ' or cs[i] == '\n' or cs[i] == '\r' or cs[i] == '\t')) {
      i += 1
    };
    sliceFrom(t, i)
  };

  // Extract a JSON quoted string value (handles \n, \t, \", \\ escapes)
  func extractQuoted(t : Text) : Text {
    let cs = toChars(t);
    let dquote : Char = '\u{22}';
    if (cs.size() == 0 or cs[0] != dquote) return "";
    var r = "";
    var i = 1;
    var esc = false;
    while (i < cs.size()) {
      let c = cs[i];
      if (esc) {
        if (c == 'n') { r #= "\n" }
        else if (c == 't') { r #= "\t" }
        else if (c == 'r') { r #= "\r" }
        else if (c == dquote) { r #= "\"" }
        else if (c == '\\') { r #= "\\" }
        else { r #= c.toText() };
        esc := false;
      } else if (c == '\\') {
        esc := true;
      } else if (c == dquote) {
        return r;
      } else {
        r #= c.toText();
      };
      i += 1;
    };
    r
  };

  // Escape text for safe embedding inside a JSON string literal
  func escapeJsonString(t : Text) : Text {
    let dquote : Char = '\u{22}';
    var r = "\"";
    for (c in t.chars()) {
      if (c == dquote) { r #= "\\\"" }
      else if (c == '\\') { r #= "\\\\" }
      else if (c == '\n') { r #= "\\n" }
      else if (c == '\r') { r #= "\\r" }
      else if (c == '\t') { r #= "\\t" }
      else { r #= c.toText() };
    };
    r # "\""
  };
};
