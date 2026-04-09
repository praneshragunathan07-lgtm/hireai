import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateRecruitment } from "@/hooks/useGenerateRecruitment";
import { cn } from "@/lib/utils";
import { useRecruitmentStore } from "@/store/recruitmentStore";
import {
  FileTextIcon,
  Loader2Icon,
  SparklesIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

const EXPERIENCE_LEVELS = [
  { value: "Entry", label: "Entry Level" },
  { value: "Mid-Level", label: "Mid-Level" },
  { value: "Senior", label: "Senior" },
  { value: "Lead/Principal", label: "Lead / Principal" },
];

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Other",
];

async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === "application/pdf") {
    // Attempt basic text extraction from PDF binary
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result;
        if (arrayBuffer instanceof ArrayBuffer) {
          const bytes = new Uint8Array(arrayBuffer);
          let text = "";
          // Extract readable ASCII strings from PDF binary
          let chunk = "";
          for (let i = 0; i < bytes.length; i++) {
            const b = bytes[i];
            if (b >= 32 && b < 127) {
              chunk += String.fromCharCode(b);
            } else {
              if (chunk.length > 4) {
                text += `${chunk} `;
              }
              chunk = "";
            }
          }
          if (chunk.length > 4) text += chunk;
          const extracted = text.slice(0, 8000).trim();
          resolve(extracted || "[PDF content — text extraction unavailable]");
        } else {
          resolve("[PDF content — text extraction unavailable]");
        }
      };
      reader.onerror = () =>
        resolve("[PDF content — text extraction unavailable]");
      reader.readAsArrayBuffer(file);
    });
  }
  // Plain text
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || "");
    reader.onerror = () => resolve("");
    reader.readAsText(file);
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function JobInputForm() {
  const {
    jobRole,
    experienceLevel,
    industry,
    companyCulture,
    resumeFile,
    isGenerating,
    setJobRole,
    setExperienceLevel,
    setIndustry,
    setCompanyCulture,
    setResumeFile,
    clearResume,
    setResult,
    setIsGenerating,
    getInput,
    isFormValid,
  } = useRecruitmentStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync } = useGenerateRecruitment();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const content = await extractTextFromFile(file);
    setResumeFile(file, content);
    // Reset input value so same file can be re-selected
    e.target.value = "";
  };

  const handleDrop = async (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".pdf") && !file.name.endsWith(".txt")) {
      toast.error("Please upload a .txt or .pdf file");
      return;
    }
    const content = await extractTextFromFile(file);
    setResumeFile(file, content);
  };

  const handleGenerate = async () => {
    if (!isFormValid()) return;
    setIsGenerating(true);
    try {
      const result = await mutateAsync(getInput());
      setResult(result);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Generation failed. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const valid = isFormValid();

  return (
    <div className="card-elevated rounded-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2 pb-1 border-b border-border">
        <SparklesIcon size={15} className="text-primary flex-shrink-0" />
        <h2 className="font-display font-semibold text-sm text-foreground">
          Job Details
        </h2>
      </div>

      {/* Job Role */}
      <div className="space-y-1.5">
        <Label htmlFor="job-role" className="text-sm font-medium">
          Job Role <span className="text-destructive">*</span>
        </Label>
        <Input
          id="job-role"
          placeholder="e.g. Senior Software Engineer"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          data-ocid="input-job-role"
          className="bg-input"
        />
      </div>

      {/* Experience Level */}
      <div className="space-y-1.5">
        <Label htmlFor="experience-level" className="text-sm font-medium">
          Experience Level <span className="text-destructive">*</span>
        </Label>
        <Select value={experienceLevel} onValueChange={setExperienceLevel}>
          <SelectTrigger
            id="experience-level"
            className="bg-input"
            data-ocid="select-experience-level"
          >
            <SelectValue placeholder="Select level…" />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_LEVELS.map((lvl) => (
              <SelectItem key={lvl.value} value={lvl.value}>
                {lvl.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Industry */}
      <div className="space-y-1.5">
        <Label htmlFor="industry" className="text-sm font-medium">
          Industry <span className="text-destructive">*</span>
        </Label>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger
            id="industry"
            className="bg-input"
            data-ocid="select-industry"
          >
            <SelectValue placeholder="Select industry…" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((ind) => (
              <SelectItem key={ind} value={ind}>
                {ind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Company Culture */}
      <div className="space-y-1.5">
        <Label htmlFor="company-culture" className="text-sm font-medium">
          Company Culture <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="company-culture"
          placeholder="e.g. Fast-paced startup focused on innovation, collaboration, and continuous learning…"
          value={companyCulture}
          onChange={(e) => setCompanyCulture(e.target.value)}
          rows={3}
          data-ocid="textarea-company-culture"
          className="bg-input resize-none text-sm"
        />
      </div>

      {/* Resume Upload */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">
          Upload Resume{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>

        {resumeFile ? (
          <div
            className="flex items-center gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5"
            data-ocid="resume-uploaded"
          >
            <FileTextIcon size={18} className="text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {resumeFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(resumeFile.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={clearResume}
              aria-label="Remove resume"
              className="flex-shrink-0 p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
              data-ocid="btn-remove-resume"
            >
              <XIcon size={15} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-5 rounded-lg border-2 border-dashed border-border w-full",
              "hover:border-primary/50 hover:bg-muted/40 cursor-pointer transition-smooth text-center",
            )}
            data-ocid="resume-dropzone"
            aria-label="Upload resume file"
          >
            <UploadIcon size={22} className="text-muted-foreground" />
            <div>
              <p className="text-sm text-foreground font-medium">
                Drop file here or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                PDF or TXT files only
              </p>
            </div>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf"
          className="sr-only"
          onChange={handleFileChange}
          data-ocid="input-resume-file"
          aria-label="Upload resume"
        />
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={!valid || isGenerating}
        className="w-full font-semibold"
        size="lg"
        data-ocid="btn-generate"
        aria-disabled={!valid || isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2Icon size={16} className="animate-spin mr-2" />
            Analyzing…
          </>
        ) : (
          <>
            <SparklesIcon size={16} className="mr-2" />
            Generate Analysis
          </>
        )}
      </Button>

      {!valid && (
        <p className="text-xs text-muted-foreground text-center -mt-2">
          Fill in all required fields to continue
        </p>
      )}
    </div>
  );
}
