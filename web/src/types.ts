export interface Match {
  id: string;
  date: string;
  stage: string;
  home: string;
  away: string;
  placeholder?: boolean;
  homeLabel: string;
  awayLabel: string;
  result: { home: number; away: number } | null;
  scored: boolean;
}

export interface Standing {
  id: string;
  name: string;
  slack: string;
  totalPoints: number;
  matchesScored: number;
  matchPoints: Record<string, number>;
}

export interface ScoringRules {
  exactScore: number;
  correctGoalDifference: number;
  correctWinnerOrDraw: number;
  oneTeamExactGoalsBonus: number;
  skipBonusOnExactScore: boolean;
}

export interface Leaderboard {
  generatedAt: string;
  rules: ScoringRules;
  matches: Match[];
  standings: Standing[];
}
