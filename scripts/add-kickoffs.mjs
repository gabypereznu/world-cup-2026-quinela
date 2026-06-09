/**
 * Assigns kickoff UTC times to fixtures that don't have one yet.
 * Same-day matches are staggered (typical World Cup schedule).
 * Update times in fixtures.json manually if FIFA publishes exact kickoffs.
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = join(__dirname, "..", "data", "fixtures.json");
const fixtures = JSON.parse(readFileSync(path, "utf8"));

const HOURS_UTC = [17, 20, 23, 14, 19, 16];

const byDate = new Map();
for (const m of fixtures.matches) {
  if (!byDate.has(m.date)) byDate.set(m.date, []);
  byDate.get(m.date).push(m);
}

for (const [, dayMatches] of byDate) {
  dayMatches.forEach((m, i) => {
    if (m.kickoff) return;
    const hour = HOURS_UTC[i % HOURS_UTC.length];
    m.kickoff = `${m.date}T${String(hour).padStart(2, "0")}:00:00Z`;
  });
}

writeFileSync(path, JSON.stringify(fixtures, null, 2) + "\n");
console.log(`Kickoffs assigned for ${fixtures.matches.length} matches.`);
