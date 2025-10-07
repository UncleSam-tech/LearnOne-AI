import { z } from "zod";
import { Purpose } from "@/src/lib/schemas";
import {
  RecommendationSchema, CourseSchema, AssessmentSchema, LessonSchema
} from "@/src/lib/schemas";

const PurposeToSchema: Record<Purpose, z.ZodTypeAny> = {
  skill_rationale: RecommendationSchema,
  course_outline: CourseSchema,
  quiz: AssessmentSchema,
  lesson_expand: LessonSchema,
};

type GenPurpose = Purpose;
type GenInput = { purpose: GenPurpose; payload: any };

async function readSSEToString(res: Response): Promise<string> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let full = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split(/\r?\n/)) {
      if (line.startsWith("data: ")) {
        const datum = line.slice(6);
        if (datum === "[DONE]") continue;
        full += datum;
      }
    }
  }
  return full.trim();
}

export async function generateViaProxy<TPurpose extends GenPurpose>(
  purpose: TPurpose,
  payload: any,
): Promise<z.infer<typeof PurposeToSchema[TPurpose]>> {
  const schema = PurposeToSchema[purpose];

  const attempt = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purpose, payload })
    });
    if (!res.ok) {
      throw new Error(`Proxy error ${res.status}`);
    }
    const raw = await readSSEToString(res);
    let parsed: unknown;
    const start = raw.lastIndexOf("{");
    const end = raw.lastIndexOf("}");
    if (start < 0 || end < start) throw new Error("No JSON object found");
    parsed = JSON.parse(raw.slice(start, end + 1));
    const validated = schema.safeParse(parsed);
    if (!validated.success) throw new Error("Schema validation failed");
    return validated.data;
  };

  try {
    return await attempt();
  } catch {
    return await attempt();
  }
}


