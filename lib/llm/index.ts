import { MockAdapter } from "@/lib/llm/mock";
import { ProxyAdapter } from "@/lib/llm/proxy";
import type { LLMAdapter } from "@/lib/llm/adapter";

export function getLLMAdapter(): LLMAdapter {
  if (process.env.NEXT_PUBLIC_API_PROXY_URL) {
    return new ProxyAdapter();
  }
  return new MockAdapter();
}

export const usingMock = !process.env.NEXT_PUBLIC_API_PROXY_URL;


