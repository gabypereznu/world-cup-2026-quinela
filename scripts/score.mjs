import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { loadFlags, teamKey, normalizePrediction } from "./lib/countries.mjs";
import { scoreMatch } from "./lib/scoring.mjs";
import { isMatchLocked } from "./lib/match-lock.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA = join(ROOT, "data");
const OUT = join(ROOT, "web", "public", "data");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function loadParticipants() {
  const dir = join(DATA, "participants");
  const files = readdirSync(dir).filter(
    (f) => f.endsWith(".json") && !f.startsWith("_")
  );

  return files.map((file) => {
    const data = readJson(join(dir, file));
    return { file, ...data };
  });
}

function buildLeaderboard(fixtures, results, participants, rules) {
  const flags = loadFlags();

  const enrichedMatches = fixtures.matches.map((match) => {
    const result = results[match.id];
    const homeLabel = teamKey(match.home, flags);
    const awayLabel = teamKey(match.away, flags);

    return {
      ...match,
      homeLabel,
      awayLabel,
      result: result ?? null,
      scored: Boolean(result),
      locked: isMatchLocked(match.kickoff),
    };
  });

  const standings = participants.map((p) => {
    let totalPoints = 0;
    let matchesScored = 0;
    const matchPoints = {};

    for (const match of fixtures.matches) {
      const result = results[match.id];
      const rawPred = p.predictions?.[match.id];
      if (!result || !rawPred) continue;

      const pred = normalizePrediction(match, rawPred);
      if (!pred) continue;

      const pts = scoreMatch(pred, result, rules);
      matchPoints[match.id] = pts;
      totalPoints += pts;
      matchesScored += 1;
    }

    return {
      id: p.id,
      name: p.name,
      slack: p.slack,
      totalPoints,
      matchesScored,
      matchPoints,
    };
  });

  standings.sort((a, b) => b.totalPoints - a.totalPoints || a.name.localeCompare(b.name));

  return {
    generatedAt: new Date().toISOString(),
    rules,
    matches: enrichedMatches,
    standings,
  };
}

function main() {
  const fixtures = readJson(join(DATA, "fixtures.json"));
  const results = readJson(join(DATA, "results.json"));
  const rules = readJson(join(DATA, "scoring-rules.json"));
  const participants = loadParticipants();

  const leaderboard = buildLeaderboard(fixtures, results, participants, rules);

  mkdirSync(OUT, { recursive: true });
  copyFileSync(join(DATA, "fixtures.json"), join(OUT, "fixtures.json"));
  copyFileSync(join(DATA, "results.json"), join(OUT, "results.json"));
  copyFileSync(join(DATA, "countries.json"), join(OUT, "countries.json"));
  copyFileSync(
    join(DATA, "participants", "_template.json"),
    join(OUT, "participant-template.json")
  );
  writeFileSync(join(OUT, "leaderboard.json"), JSON.stringify(leaderboard, null, 2));

  console.log(`Leaderboard written for ${participants.length} participant(s).`);
  console.log(`Standings: ${leaderboard.standings.map((s) => `${s.name} (${s.totalPoints})`).join(", ") || "none yet"}`);
}

main();
