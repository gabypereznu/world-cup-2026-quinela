import type { Match, Standing } from "../types";

interface Props {
  standings: Standing[];
  matches: Match[];
}

function medalRank(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return rank;
}

export default function LeaderboardTab({ standings, matches }: Props) {
  const scoredCount = matches.filter((m) => m.scored).length;

  if (standings.length === 0) {
    return (
      <div className="empty">
        <p>No participants yet.</p>
        <p className="empty__hint">
          Add a JSON file in <code>data/participants/</code> and push to main.
        </p>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <p className="section-meta">
        {scoredCount} of {matches.length} matches scored
      </p>
      <ol className="leaderboard__list">
        {standings.map((s, i) => {
          const rank = i + 1;
          return (
            <li
              key={s.id}
              className={`leaderboard__row ${rank <= 3 ? `leaderboard__row--top${rank}` : ""}`}
            >
              <span className="leaderboard__rank">{medalRank(rank)}</span>
              <div className="leaderboard__info">
                <span className="leaderboard__name">{s.name}</span>
                <span className="leaderboard__slack">{s.slack}</span>
              </div>
              <div className="leaderboard__stats">
                <span className="leaderboard__points">{s.totalPoints}</span>
                <span className="leaderboard__matches">
                  {s.matchesScored} matches
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
