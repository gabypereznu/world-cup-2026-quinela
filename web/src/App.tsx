import { useEffect, useState } from "react";
import type { Leaderboard } from "./types";
import LeaderboardTab from "./components/LeaderboardTab";
import MatchesTab from "./components/MatchesTab";
import InstructionsTab from "./components/InstructionsTab";
import ScoringRules from "./components/ScoringRules";
import "./App.css";

type Tab = "matches" | "leaderboard" | "instructions";

const DATA_URL = `${import.meta.env.BASE_URL}data/leaderboard.json`;

export default function App() {
  const [data, setData] = useState<Leaderboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("leaderboard");

  useEffect(() => {
    fetch(DATA_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load data (${r.status})`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="app app--center">
        <p className="error">Could not load quinela data: {error}</p>
        <p className="hint">Run <code>npm run dev</code> from the repo root.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="app app--center">
        <div className="loader" />
        <p>Loading quinela…</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header__brand">
          <span className="header__emoji">⚽</span>
          <div>
            <h1>World Cup 2026 Quinela</h1>
            <p className="header__sub">
              {data.standings.length} players · {data.matches.length} matches
            </p>
          </div>
        </div>
        <ScoringRules rules={data.rules} />
      </header>

      <nav className="tabs" role="tablist">
        <button
          role="tab"
          className={`tabs__btn ${tab === "matches" ? "tabs__btn--active" : ""}`}
          aria-selected={tab === "matches"}
          onClick={() => setTab("matches")}
        >
          All matches
        </button>
        <button
          role="tab"
          className={`tabs__btn ${tab === "leaderboard" ? "tabs__btn--active" : ""}`}
          aria-selected={tab === "leaderboard"}
          onClick={() => setTab("leaderboard")}
        >
          Leaderboard
        </button>
        <button
          role="tab"
          className={`tabs__btn ${tab === "instructions" ? "tabs__btn--active" : ""}`}
          aria-selected={tab === "instructions"}
          onClick={() => setTab("instructions")}
        >
          How to play
        </button>
      </nav>

      <main className="main">
        {tab === "matches" && (
          <MatchesTab matches={data.matches} standings={data.standings} />
        )}
        {tab === "leaderboard" && (
          <LeaderboardTab standings={data.standings} matches={data.matches} />
        )}
        {tab === "instructions" && <InstructionsTab rules={data.rules} />}
      </main>

      <footer className="footer">
        Updated {new Date(data.generatedAt).toLocaleString()}
      </footer>
    </div>
  );
}
