import { computeScore } from '@/lib/scoring';

test('computeScore returns weighted total and top factors', () => {
  const res = computeScore({
    outcome_fit: 1,
    time_fit: 0.5,
    strength_alignment: 0.8,
    constraint_fit: 0.6,
    market_signal: 0.7,
    modality_fit: 0.4,
    horizon_fit: 0.5,
    risk_style_fit: 0.3,
  });
  expect(res.total).toBeGreaterThan(0.5);
  expect(res.topFactors.length).toBe(3);
});


