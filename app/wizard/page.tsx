"use client";
import { useEffect, useState } from "react";
import { useWizardStore, useRecStore } from "@/store/app";
import { generateViaProxy } from "@/src/lib/llm/adapter";

export default function WizardPage() {
  const { answers, step, saveAnswer, setStep, hydrate } = useWizardStore();
  const { recommendation, setRecommendation, hydrate: hydrateRec } = useRecStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void hydrate();
    void hydrateRec();
  }, [hydrate, hydrateRec]);

  async function generate() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await generateViaProxy("skill_rationale", { answers });
      await setRecommendation(res as any);
      window.location.href = "/results";
    } catch (e: any) {
      setError("Generation failed. Please retry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Quick wizard (10 steps)</h1>
        <p className="text-sm text-gray-600">Autosaves each step. Offline-ready.</p>
      </div>
      <div className="rounded-lg border p-6 text-gray-700 space-y-4">
        <div className="flex items-center justify-between">
          <p>Step {step + 1} / 10</p>
          <button onClick={() => setStep(Math.max(0, step - 1))} className="text-sm underline">Back</button>
        </div>
        <label className="block text-sm">90-day outcome
          <input className="mt-1 w-full border rounded p-2" defaultValue={(answers["q1"] as any)?.answer || ""} onBlur={(e) => saveAnswer({ qid: "q1", answer: e.target.value })} />
        </label>
        <button disabled={loading} onClick={generate} className="px-4 py-2 rounded bg-black text-white disabled:opacity-40">
          {loading ? "Generating..." : "Generate recommendation"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </main>
  );
}

