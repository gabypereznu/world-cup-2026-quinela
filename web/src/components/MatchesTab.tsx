import { useMemo, useState } from "react";
import type { Match, Standing } from "../types";

interface Props {
  matches: Match[];
  standings: Standing[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function scoreLine(result: { home: number; away: number } | null) {
  if (!result) return "—";
  return `${result.home} – ${result.away}`;
}

export default function MatchesTab({ matches, standings }: Props) {
  const stages = useMemo(() => {
    const set = new Set(matches.map((m) => m.stage));
    return Array.from(set);
  }, [matches]);

  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? matches : matches.filter((m) => m.stage === filter);

  const topByMatch = useMemo(() => {
    const map: Record<string, { name: string; points: number }[]> = {};
    for (const s of standings) {
      for (const [matchId, pts] of Object.entries(s.matchPoints)) {
        if (!map[matchId]) map[matchId] = [];
        map[matchId].push({ name: s.name, points: pts });
      }
    }
    for (const id of Object.keys(map)) {
      map[id].sort((a, b) => b.points - a.points);
    }
    return map;
  }, [standings]);

  return (
    <div className="matches">
      <div className="matches__filters">
        <button
          className={`filter-btn ${filter === "all" ? "filter-btn--active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        {stages.map((stage) => (
          <button
            key={stage}
            className={`filter-btn ${filter === stage ? "filter-btn--active" : ""}`}
            onClick={() => setFilter(stage)}
          >
            {stage}
          </button>
        ))}
      </div>

      <ul className="matches__list">
        {filtered.map((match) => {
          const tops = topByMatch[match.id]?.slice(0, 3) ?? [];
          return (
            <li key={match.id} className="match-card">
              <div className="match-card__meta">
                <span className="match-card__id">{match.id}</span>
                <span className="match-card__date">{formatDate(match.date)}</span>
                <span className="match-card__stage">{match.stage}</span>
                {match.locked && !match.scored && (
                  <span className="match-card__lock">Locked</span>
                )}
              </div>
              <div className="match-card__teams">
                <span className="match-card__team">{match.homeLabel}</span>
                <span className={`match-card__score ${match.scored ? "match-card__score--done" : ""}`}>
                  {scoreLine(match.result)}
                </span>
                <span className="match-card__team match-card__team--away">{match.awayLabel}</span>
              </div>
              {tops.length > 0 && (
                <div className="match-card__tops">
                  Top: {tops.map((t) => `${t.name} (${t.points})`).join(" · ")}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
