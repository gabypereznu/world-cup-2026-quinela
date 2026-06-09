import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");

let flagsCache = null;

export function loadFlags() {
  if (!flagsCache) {
    flagsCache = JSON.parse(
      readFileSync(join(ROOT, "data", "countries.json"), "utf8")
    );
  }
  return flagsCache;
}

/** Display key for participant JSON: "🇲🇽 Mexico" */
export function teamKey(teamName, flags = loadFlags()) {
  if (!teamName) return teamName;
  const emoji = flags[teamName] ?? "🏳️";
  return `${emoji} ${teamName}`;
}

/** Resolve goals for a team from prediction keys that may include emoji */
export function goalsForTeam(prediction, teamName) {
  if (!prediction || !teamName) return undefined;

  for (const [key, goals] of Object.entries(prediction)) {
    if (key === teamName || key.endsWith(teamName) || key.includes(teamName)) {
      return goals;
    }
  }
  return undefined;
}

export function normalizePrediction(match, prediction) {
  const home = goalsForTeam(prediction, match.home);
  const away = goalsForTeam(prediction, match.away);

  if (home === undefined || away === undefined) {
    return null;
  }

  return { home: Number(home), away: Number(away) };
}
