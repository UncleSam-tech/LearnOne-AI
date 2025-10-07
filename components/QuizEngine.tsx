type Choice = { id: string; text: string; correct?: boolean };
type Question = { id: string; type: "mcq" | "code" | "short"; prompt: string; choices?: Choice[]; answerKey?: string | string[]; explanation?: string };

type Props = {
  questions: Question[];
  passMark: number;
  retriesAllowed: number;
  onSubmit: (result: { score: number; passed: boolean }) => void;
};

import { useState } from "react";

export function QuizEngine({ questions, passMark, retriesAllowed, onSubmit }: Props) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [attempts, setAttempts] = useState(0);

  const scoreQuiz = () => {
    let correct = 0;
    for (const q of questions) {
      const a = answers[q.id];
      if (q.type === 'mcq' && typeof a === 'string') {
        const choice = q.choices?.find((c) => c.id === a);
        if (choice?.correct) correct += 1;
      }
      // minimal scoring; extend for code/short later
    }
    const score = Math.round((correct / questions.length) * 100);
    return score;
  };

  const submit = () => {
    const score = scoreQuiz();
    const passed = score >= passMark;
    setAttempts((n) => n + 1);
    onSubmit({ score, passed });
  };

  const disabled = attempts > retriesAllowed;

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <div key={q.id} className="border rounded p-3">
          <p className="font-medium">{q.prompt}</p>
          {q.type === 'mcq' && (
            <div className="mt-2 space-y-1">
              {q.choices?.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={q.id}
                    value={c.id}
                    onChange={(e) => setAnswers((s) => ({ ...s, [q.id]: e.target.value }))}
                  />
                  {c.text}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      <button disabled={disabled} onClick={submit} className="px-3 py-1.5 rounded bg-black text-white disabled:opacity-40">
        {disabled ? 'Retry limit reached' : 'Submit'}
      </button>
    </div>
  );
}


