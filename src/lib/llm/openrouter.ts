import { NextRequest } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";
const APP_TITLE = process.env.APP_TITLE || "LearnOne AI";

const hits = new Map<string,{count:number, ts:number}>();
function rateLimit(ip:string, limit=30, windowMs=60_000) {
  const now = Date.now();
  const prev = hits.get(ip);
  if (!prev || now - prev.ts > windowMs) {
    hits.set(ip, {count:1, ts:now});
    return true;
  }
  prev.count++;
  if (prev.count > limit) return false;
  return true;
}

export const ALLOWED_MODELS = [
  "openrouter/auto",
];

export type LlmRequest = {
  model?: string;
  system: string;
  inputJson: unknown;
};

export async function openrouterStream(req: NextRequest, body: LlmRequest) {
  if (!OPENROUTER_API_KEY) {
    throw new Error("Missing OPENROUTER_API_KEY");
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip)) {
    return new Response("Too Many Requests", { status: 429 });
  }

  const model = body.model && ALLOWED_MODELS.includes(body.model) ? body.model : "openrouter/auto";

  const payload = {
    model,
    stream: true,
    temperature: 0.5,
    messages: [
      { role: "system", content: body.system },
      { role: "user", content: JSON.stringify(body.inputJson) }
    ],
    response_format: { type: "json_object" }
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const r = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": APP_BASE_URL,
        "X-Title": APP_TITLE
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!r.ok) {
      const t = await r.text().catch(() => "");
      return new Response(`Provider error: ${r.status} ${t}`, { status: 502 });
    }

    const readable = r.body;
    if (!readable) return new Response("No stream", { status: 502 });

    const transform = new TransformStream();
    const writer = transform.writable.getWriter();
    const reader = readable.getReader();

    let bytes = 0;
    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          bytes += value?.byteLength || 0;
          if (bytes > 1_000_000) {
            writer.write(new TextEncoder().encode("data: [TRUNCATED]\n\n"));
            break;
          }
          await writer.write(value);
        }
      } catch {
      } finally {
        await writer.close();
      }
    })();

    return new Response(transform.readable, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "Transfer-Encoding": "chunked",
      }
    });
  } catch (err:any) {
    if (err?.name === "AbortError") {
      return new Response("Timeout", { status: 504 });
    }
    return new Response(`Upstream error: ${String(err?.message || err)}`, { status: 500 });
  } finally {
    clearTimeout(timeout);
  }
}


