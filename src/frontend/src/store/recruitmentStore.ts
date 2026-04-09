import type { GenerateInput, RecruitmentResult } from "@/types/recruitment";
import { create } from "zustand";

interface RecruitmentState {
  // Form fields
  jobRole: string;
  experienceLevel: string;
  industry: string;
  companyCulture: string;
  resumeFile: File | null;
  resumeContent: string;

  // Results
  result: RecruitmentResult | null;
  isGenerating: boolean;

  // Form actions
  setJobRole: (value: string) => void;
  setExperienceLevel: (value: string) => void;
  setIndustry: (value: string) => void;
  setCompanyCulture: (value: string) => void;
  setResumeFile: (file: File | null, content: string) => void;
  clearResume: () => void;

  // Result actions
  setResult: (result: RecruitmentResult | null) => void;
  setIsGenerating: (value: boolean) => void;
  resetResult: () => void;

  // Derived
  getInput: () => GenerateInput;
  isFormValid: () => boolean;
}

export const useRecruitmentStore = create<RecruitmentState>((set, get) => ({
  jobRole: "",
  experienceLevel: "",
  industry: "",
  companyCulture: "",
  resumeFile: null,
  resumeContent: "",
  result: null,
  isGenerating: false,

  setJobRole: (value) => set({ jobRole: value }),
  setExperienceLevel: (value) => set({ experienceLevel: value }),
  setIndustry: (value) => set({ industry: value }),
  setCompanyCulture: (value) => set({ companyCulture: value }),

  setResumeFile: (file, content) =>
    set({ resumeFile: file, resumeContent: content }),

  clearResume: () => set({ resumeFile: null, resumeContent: "" }),

  setResult: (result) => set({ result }),
  setIsGenerating: (value) => set({ isGenerating: value }),
  resetResult: () => set({ result: null }),

  getInput: () => {
    const s = get();
    const input: GenerateInput = {
      jobRole: s.jobRole,
      experienceLevel: s.experienceLevel,
      industry: s.industry,
      companyCulture: s.companyCulture,
    };
    if (s.resumeContent) input.resumeContent = s.resumeContent;
    return input;
  },

  isFormValid: () => {
    const s = get();
    return (
      s.jobRole.trim().length > 0 &&
      s.experienceLevel.length > 0 &&
      s.industry.length > 0 &&
      s.companyCulture.trim().length > 0
    );
  },
}));
