'use client';
import { usingMock } from "@/lib/llm";

export function MockBanner() {
  if (!usingMock) return null;
  return (
    <div className="w-full bg-amber-100 text-amber-900 text-sm px-4 py-2 text-center">
      Offline/preview mode (MockAdapter). Set NEXT_PUBLIC_API_PROXY_URL to use proxy.
    </div>
  );
}


