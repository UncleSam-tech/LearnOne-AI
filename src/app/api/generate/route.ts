import { NextRequest } from "next/server";
import { z } from "zod";
import { SYSTEM_PROMPT, sanitizeInput } from "@/src/lib/prompts";
import { openrouterStream } from "@/src/lib/llm/openrouter";
import {
  GenerateInputSchema, RecommendationSchema, CourseSchema,
  AssessmentSchema, LessonSchema
} from "@/src/lib/schemas";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const PurposeToSchema: Record<string, z.ZodTypeAny> = {
  skill_rationale: RecommendationSchema,
  course_outline: CourseSchema,
  quiz: AssessmentSchema,
  lesson_expand: LessonSchema,
};

function buildGuardedSystem(purpose: string) {
  const schemaHint = {
    skill_rationale: {"chosenSkillId":"string","confidence":"number","rationale":"string","suggestedPath":[{"courseId":"string","reason":"string"}]},
    course_outline: {"id":"string","skillId":"string","level":"beginner|intermediate|advanced","title":"string","estimatedHours":"number","outline":"Lesson[]","assessmentIds":"string[]"},
    quiz: {"id":"string","courseId":"string","passMark":80,"retriesAllowed":1,"questions":"Question[]"},
    lesson_expand: {"id":"string","title":"string","content":"string","activities":"string[]?","resources":"{label,url?,type?}[]?"},
  }[purpose];
  return `${SYSTEM_PROMPT}\n{{{REQUESTED PURPOSE:${purpose}}}}\n{{{SCHEMA HINT:${JSON.stringify(schemaHint)}}}}`;
}

export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

    const data = await req.json();
    const parsed = GenerateInputSchema.safeParse(data);
    if (!parsed.success) {
      return new Response("Bad Request", { status: 400 });
    }
    const { purpose, payload } = parsed.data;

    const targetSchema = PurposeToSchema[purpose];
    if (!targetSchema) {
      return new Response("Unsupported purpose", { status: 400 });
    }

    const inputJson = sanitizeInput({ purpose, payload });
    const system = buildGuardedSystem(purpose);

    return await openrouterStream(req, {
      system,
      inputJson,
      model: "openrouter/auto",
    });
  } catch (e:any) {
    return new Response(`Server error: ${String(e?.message || e)}`, { status: 500 });
  }
}


