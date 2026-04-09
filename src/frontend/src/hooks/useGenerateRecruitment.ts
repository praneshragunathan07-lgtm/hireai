import { createActor } from "@/backend";
import type { GenerateInput, RecruitmentResult } from "@/types/recruitment";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";

export function useGenerateRecruitment() {
  const { actor } = useActor(createActor);

  return useMutation<RecruitmentResult, Error, GenerateInput>({
    mutationFn: async (input: GenerateInput) => {
      if (!actor) throw new Error("Backend not available");

      const result = await actor.generateRecruitmentArtifacts(input);

      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }

      return result.ok;
    },
  });
}
