import { z } from "zod";
import { SYSTEM_PROMPT } from "@/lib/llm/prompts";
import {
  AssessmentSchema,
  CourseSchema,
  LessonSchema,
  RecommendationSchema,
  GenPurpose,
} from "@/lib/schemas";

export type GenInput = { purpose: GenPurpose; payload: any };

export interface LLMAdapter {
  generate(input: GenInput, signal?: AbortSignal): Promise<unknown>;
}

export function schemaForPurpose(purpose: GenPurpose) {
  switch (purpose) {
    case "skill_rationale":
      return RecommendationSchema;
    case "course_outline":
      return CourseSchema;
    case "quiz":
      return AssessmentSchema;
    case "lesson_expand":
      return LessonSchema;
  }
}

export async function validateJson<T>(raw: string, schema: z.ZodType<T>): Promise<T> {
  const parsed = JSON.parse(raw);
  return schema.parse(parsed);
}

export function buildSystemPrompt() {
  return SYSTEM_PROMPT;
}


