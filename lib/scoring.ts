type ScoreParts = {
  outcome_fit: number;
  time_fit: number;
  strength_alignment: number;
  constraint_fit: number;
  market_signal: number;
  modality_fit: number;
  horizon_fit: number;
  risk_style_fit: number;
};

export type ScoreBreakdown = ScoreParts & {
  total: number;
  weights: Required<Record<keyof ScoreParts, number>>;
  topFactors: Array<{ key: keyof ScoreParts; weight: number; value: number }>;
};

const defaultWeights: Required<Record<keyof ScoreParts, number>> = {
  outcome_fit: 0.2,
  time_fit: 0.15,
  strength_alignment: 0.15,
  constraint_fit: 0.1,
  market_signal: 0.15,
  modality_fit: 0.1,
  horizon_fit: 0.1,
  risk_style_fit: 0.05,
};

export function computeScore(parts: ScoreParts, weights = defaultWeights): ScoreBreakdown {
  const total = (Object.keys(parts) as (keyof ScoreParts)[]).reduce((acc, key) => {
    return acc + (parts[key] ?? 0) * (weights[key] ?? 0);
  }, 0);
  const topFactors = (Object.keys(parts) as (keyof ScoreParts)[])
    .map((k) => ({ key: k, weight: weights[k], value: parts[k] }))
    .sort((a, b) => b.weight * b.value - a.weight * a.value)
    .slice(0, 3);
  return { ...parts, total, weights, topFactors };
}


