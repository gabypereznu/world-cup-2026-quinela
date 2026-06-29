import type { Match } from "../types";

export function isGroupStage(match: Pick<Match, "stage">) {
  return match.stage.startsWith("Group");
}

export function isKnockoutStage(match: Pick<Match, "stage">) {
  return !isGroupStage(match);
}

export type MatchPhase = "group" | "knockout";

export function matchesPhase(match: Pick<Match, "stage">, phase: MatchPhase) {
  return phase === "group" ? isGroupStage(match) : isKnockoutStage(match);
}
