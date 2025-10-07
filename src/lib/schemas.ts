import { z } from "zod";

export const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  activities: z.array(z.string()).optional(),
  resources: z.array(z.object({
    label: z.string(),
    url: z.string().url().optional(),
    type: z.enum(["article","video","tool"]).optional()
  })).optional(),
});
export type Lesson = z.infer<typeof LessonSchema>;

export const QuestionSchema = z.object({
  id: z.string(),
  type: z.enum(["mcq","code","short"]),
  prompt: z.string(),
  choices: z.array(z.object({
    id: z.string(),
    text: z.string(),
    correct: z.boolean().optional(),
  })).optional(),
  answerKey: z.union([z.string(), z.array(z.string())]).optional(),
  explanation: z.string().optional(),
});

export const AssessmentSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  questions: z.array(QuestionSchema),
  passMark: z.number().int().min(1).max(100).default(80),
  retriesAllowed: z.number().int().min(0).max(3).default(1),
});
export type Assessment = z.infer<typeof AssessmentSchema>;

export const CourseSchema = z.object({
  id: z.string(),
  skillId: z.string(),
  level: z.enum(["beginner","intermediate","advanced"]),
  title: z.string(),
  outline: z.array(LessonSchema),
  estimatedHours: z.number().positive(),
  assessmentIds: z.array(z.string()),
});
export type Course = z.infer<typeof CourseSchema>;

export const RecommendationSchema = z.object({
  chosenSkillId: z.string(),
  confidence: z.number().min(0).max(1),
  rationale: z.string(),
  suggestedPath: z.array(z.object({
    courseId: z.string(),
    reason: z.string(),
  })),
});
export type Recommendation = z.infer<typeof RecommendationSchema>;

// purpose routing
export const PurposeSchema = z.enum([
  "skill_rationale",
  "course_outline",
  "quiz",
  "lesson_expand",
]);
export type Purpose = z.infer<typeof PurposeSchema>;

export const GenerateInputSchema = z.object({
  purpose: PurposeSchema,
  payload: z.unknown(), // validated per-purpose after LLM returns
});
export type GenerateInput = z.infer<typeof GenerateInputSchema>;


