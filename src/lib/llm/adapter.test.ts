import { describe, it, expect } from "vitest";

describe("SSE parsing", () => {
  it("extracts last JSON object", () => {
    const sample = [
      "data: {\"partial\":\"ok\"}",
      "data: {\"final\":true}",
      "data: [DONE]"
    ].join("\n");
    const start = sample.lastIndexOf("{");
    const end = sample.lastIndexOf("}");
    const json = sample.slice(start, end + 1);
    const obj = JSON.parse(json);
    expect(obj.final).toBe(true);
  });
});


