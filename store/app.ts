import { create } from "zustand";
import { kvGet, kvSet } from "@/lib/storage";
import type { IntakeAnswer, Progress, Recommendation, UserProfile } from "@/lib/schemas";

type WizardState = {
  answers: Record<string, IntakeAnswer>;
  step: number;
  saveAnswer: (a: IntakeAnswer) => Promise<void>;
  setStep: (s: number) => Promise<void>;
  hydrate: () => Promise<void>;
};

type ProgressState = {
  progress: Record<string, Progress>;
  setProgress: (p: Progress) => Promise<void>;
  hydrate: () => Promise<void>;
};

type RecState = {
  recommendation: Recommendation | null;
  setRecommendation: (r: Recommendation | null) => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useWizardStore = create<WizardState>((set, get) => ({
  answers: {},
  step: 0,
  saveAnswer: async (a) => {
    const next = { ...get().answers, [a.qid]: a };
    set({ answers: next });
    await kvSet("wizard", "answers", next);
  },
  setStep: async (s) => {
    set({ step: s });
    await kvSet("wizard", "step", s);
  },
  hydrate: async () => {
    const saved = (await kvGet<Record<string, IntakeAnswer>>("wizard", "answers")) || {};
    const step = (await kvGet<number>("wizard", "step")) || 0;
    set({ answers: saved, step });
  },
}));

export const useProgressStore = create<ProgressState>((set) => ({
  progress: {},
  setProgress: async (p) => {
    set((s) => ({ progress: { ...s.progress, [p.courseId]: p } }));
    await kvSet("progress", p.courseId, p);
  },
  hydrate: async () => {
    // no-op minimal; could enumerate keys
  },
}));

export const useRecStore = create<RecState>((set) => ({
  recommendation: null,
  setRecommendation: async (r) => {
    set({ recommendation: r });
    await kvSet("wizard", "recommendation", r);
  },
  hydrate: async () => {
    const r = await kvGet<Recommendation>("wizard", "recommendation");
    set({ recommendation: r || null });
  },
}));


