import { LLMAdapter, buildSystemPrompt, schemaForPurpose, validateJson } from "@/lib/llm/adapter";

const API_URL = process.env.NEXT_PUBLIC_API_PROXY_URL || "";

export class ProxyAdapter implements LLMAdapter {
  async generate(input: { purpose: any; payload: any }, signal?: AbortSignal): Promise<unknown> {
    const schema = schemaForPurpose(input.purpose);
    if (!API_URL) {
      throw new Error("Proxy disabled: NEXT_PUBLIC_API_PROXY_URL not set");
    }
    const sys = buildSystemPrompt();
    const body = sys + "\n" + JSON.stringify(input);
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: sys, input }),
      signal,
      credentials: "omit",
      cache: "no-store",
    });
    const text = await res.text();
    try {
      return await validateJson(text, schema as any);
    } catch (err: any) {
      const retryNote = { Note: `Last output failed schema: ${String(err?.message ?? err)}` };
      const res2 = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: sys, input: { ...input, ...retryNote } }),
        signal,
        credentials: "omit",
        cache: "no-store",
      });
      const text2 = await res2.text();
      return await validateJson(text2, schema as any);
    }
  }
}


