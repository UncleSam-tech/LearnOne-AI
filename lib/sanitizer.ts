import DOMPurify from "dompurify";

// Sanitize potentially rich text; default to plain text fallback
export function sanitizeToHtml(input: string): string {
  // Truncate overly long inputs to mitigate prompt-injection vectors
  const truncated = input.slice(0, 4000);
  const windowAny: any = (globalThis as any).window;
  if (!windowAny || typeof windowAny === "undefined") {
    // Server-side: return plain text escaped
    return truncated.replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as const)[c] || c
    );
  }
  return DOMPurify.sanitize(truncated, { ALLOW_UNKNOWN_PROTOCOLS: false });
}

export function stripHtml(input: string): string {
  const withoutTags = input.replace(/<[^>]*>/g, "");
  return withoutTags.slice(0, 2000);
}


