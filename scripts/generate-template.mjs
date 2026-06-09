import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { loadFlags, teamKey } from "./lib/countries.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const fixtures = JSON.parse(readFileSync(join(ROOT, "data", "fixtures.json"), "utf8"));
const flags = loadFlags();

const predictions = {};

for (const match of fixtures.matches) {
  predictions[match.id] = {
    [teamKey(match.home, flags)]: 0,
    [teamKey(match.away, flags)]: 0,
  };
}

const template = {
  id: "your-name",
  name: "Your Display Name",
  slack: "@your.slack.handle",
  predictions,
};

mkdirSync(join(ROOT, "data", "participants"), { recursive: true });
writeFileSync(
  join(ROOT, "data", "participants", "_template.json"),
  JSON.stringify(template, null, 2) + "\n"
);

console.log(`Template generated with ${fixtures.matches.length} matches.`);
