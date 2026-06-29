import type { ScoringRules as Rules } from "../types";

export default function ScoringRules({ rules }: { rules: Rules }) {
  return (
    <details className="rules">
      <summary>Scoring rules</summary>
      <ul>
        <li>Exact score: <strong>{rules.exactScore} pts</strong></li>
        <li>Correct goal difference: <strong>{rules.correctGoalDifference} pts</strong></li>
        <li>Correct winner or draw: <strong>{rules.correctWinnerOrDraw} pts</strong></li>
        <li>One team exact goals: <strong>+{rules.oneTeamExactGoalsBonus} pt</strong> (only if you already scored above)</li>
      </ul>
    </details>
  );
}
