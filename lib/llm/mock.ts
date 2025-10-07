import { LLMAdapter, buildSystemPrompt, schemaForPurpose, validateJson } from "@/lib/llm/adapter";

export class MockAdapter implements LLMAdapter {
  async generate(input: { purpose: any; payload: any }): Promise<unknown> {
    const schema = schemaForPurpose(input.purpose);
    const system = buildSystemPrompt();
    void system; // not used but ensures parity with proxy adapter
    const deterministic = this.mockResponse(input.purpose, input.payload);
    // Validate; retry once on failure with a note
    try {
      return await validateJson(JSON.stringify(deterministic), schema as any);
    } catch (err: any) {
      const retry = { ...deterministic, Note: `Last output failed schema: ${String(err?.message ?? err)}` };
      return await validateJson(JSON.stringify(retry), schema as any).catch(() => deterministic);
    }
  }

  private mockResponse(purpose: string, payload: any): any {
    switch (purpose) {
      case "skill_rationale":
        return {
          chosenSkillId: "data-analysis",
          rationale: "Strong alignment with problem-solving and market demand in Nigeria.",
          suggestedPath: [
            { courseId: "data-analysis-beginner", reason: "Foundations with Sheets and SQL" },
            { courseId: "data-analysis-intermediate", reason: "Pandas projects on low bandwidth" },
          ],
          confidence: 0.78,
        };
      case "course_outline":
        return {
          id: payload?.id ?? "data-analysis-beginner",
          skillId: payload?.skillId ?? "data-analysis",
          level: "beginner",
          title: "Data Analysis Foundations (Sheets → SQL)",
          estimatedHours: 10,
          outline: [
            { id: "l1", title: "What is data analysis?", content: "Overview and examples in Nigeria." },
            { id: "l2", title: "Sheets basics", content: "Sorting, filtering, formulas." },
          ],
          assessmentIds: ["assess-da-beg-1"],
        };
      case "quiz":
        return {
          id: payload?.id ?? "assess-da-beg-1",
          courseId: payload?.courseId ?? "data-analysis-beginner",
          passMark: 80,
          retriesAllowed: 1,
          questions: [
            {
              id: "q1",
              type: "mcq",
              prompt: "Which function sums numbers in Sheets?",
              choices: [
                { id: "a", text: "SUM", correct: true },
                { id: "b", text: "ADD" },
                { id: "c", text: "COUNT" },
              ],
              explanation: "SUM totals values.",
            },
          ],
        };
      case "lesson_expand":
        return {
          id: payload?.id ?? "l1",
          title: payload?.title ?? "Topic",
          content: "Compact guidance with offline-first tips.",
        };
      default:
        return {};
    }
  }
}


