/**
 * Quiniela scoring (5-tier + optional team bonus).
 */
export function scoreMatch(pred, actual, rules = {}) {
  const exactScore = rules.exactScore ?? 5;
  const correctGoalDifference = rules.correctGoalDifference ?? 3;
  const correctWinnerOrDraw = rules.correctWinnerOrDraw ?? 2;
  const oneTeamExactGoalsBonus = rules.oneTeamExactGoalsBonus ?? 1;
  const skipBonusOnExactScore = rules.skipBonusOnExactScore ?? true;

  const predDiff = pred.home - pred.away;
  const actualDiff = actual.home - actual.away;

  let points = 0;

  if (pred.home === actual.home && pred.away === actual.away) {
    points = exactScore;
  } else if (predDiff === actualDiff) {
    points = correctGoalDifference;
  } else if (
    (predDiff > 0 && actualDiff > 0) ||
    (predDiff < 0 && actualDiff < 0) ||
    (predDiff === 0 && actualDiff === 0)
  ) {
    points = correctWinnerOrDraw;
  }

  const homeExact = pred.home === actual.home;
  const awayExact = pred.away === actual.away;
  const isExact = pred.home === actual.home && pred.away === actual.away;

  if (
    oneTeamExactGoalsBonus > 0 &&
    points > 0 &&
    (homeExact || awayExact) &&
    !(skipBonusOnExactScore && isExact)
  ) {
    points += oneTeamExactGoalsBonus;
  }

  return points;
}
