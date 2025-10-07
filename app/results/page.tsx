"use client";
import { useEffect } from "react";
import { useRecStore } from "@/store/app";

export default function ResultsPage() {
  const { recommendation, hydrate } = useRecStore();
  useEffect(() => { void hydrate(); }, [hydrate]);
  if (!recommendation) return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <p className="text-gray-600">No recommendation yet. Run the wizard.</p>
    </main>
  );
  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-2xl font-semibold">Your recommendation</h1>
      <div className="mt-4 border rounded p-4">
        <p className="font-medium">Skill: {recommendation.chosenSkillId}</p>
        <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{recommendation.rationale}</p>
        <p className="text-sm text-gray-500 mt-2">Confidence: {(recommendation.confidence * 100).toFixed(0)}%</p>
      </div>
    </main>
  );
}

