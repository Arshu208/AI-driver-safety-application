export function calculateSafetyScore(data: {
  criticalAlerts: number;
  highAlerts: number;
  avgPerclos: number;
  maxFatigue: number;
}) {
  let score = 100;

  score -= data.criticalAlerts * 20;
  score -= data.highAlerts * 10;
  // Perclos is stored as a percentage (0-100)
  score -= data.avgPerclos * 0.5;
  score -= data.maxFatigue * 0.3;

  return Math.max(0, Math.round(score));
}
