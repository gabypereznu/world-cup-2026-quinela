import type { ScoringRules as Rules } from "../types";

const TEMPLATE_URL = `${import.meta.env.BASE_URL}data/participant-template.json`;
const REPO_URL =
  "https://github.com/gabypereznu/world-cup-2026-quinela";
const INVITE_URL =
  "https://github.com/gabypereznu/world-cup-2026-quinela/invitations";

export default function InstructionsTab({ rules }: { rules: Rules }) {
  return (
    <div className="instructions">
      <section className="instructions__card">
        <h2>Engineers — push your own picks</h2>
        <p>
          If you have repo access, clone, edit your JSON, and push to{" "}
          <code>main</code>. No PR needed.
        </p>
        <p className="instructions__links">
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            Open repo
          </a>
          {" · "}
          <a href={INVITE_URL} target="_blank" rel="noreferrer">
            Accept your invite
          </a>
        </p>
        <ol className="instructions__steps">
          <li>
            Check for a collaborator invite (GitHub email or{" "}
            <a href={INVITE_URL} target="_blank" rel="noreferrer">
              pending invitations
            </a>
            ). No invite? DM <strong>@gaby.perez</strong> on Slack and ask to
            be added.
          </li>
          <li>
            Clone:{" "}
            <code>git clone git@github.com:gabypereznu/world-cup-2026-quinela.git</code>
          </li>
          <li>
            Copy <code>data/participants/_template.json</code> to{" "}
            <code>data/participants/your-name.json</code>
          </li>
          <li>
            Fill your <code>name</code>, <code>slack</code>, and prediction
            numbers
          </li>
          <li>
            Commit and push:{" "}
            <code>git add data/participants/your-name.json && git commit -m &quot;Add my picks&quot; && git push origin main</code>
          </li>
        </ol>
      </section>

      <section className="instructions__card">
        <h2>No GitHub? (PM, Design, etc.)</h2>
        <p>
          PM, Design, and anyone without repo access can play by filling a JSON
          file and sending it to <strong>@gaby.perez</strong> on Slack.
        </p>
        <ol className="instructions__steps">
          <li>
            <a href={TEMPLATE_URL} download="my-quiniela.json">
              Download the blank template
            </a>{" "}
            (or grab it from the{" "}
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              repo
            </a>
            )
          </li>
          <li>
            Open the file in <strong>TextEdit</strong> (Format → Make Plain
            Text), VS Code, or Cursor
          </li>
          <li>
            Set your <code>name</code> and <code>slack</code> handle at the top
          </li>
          <li>
            Change only the <strong>numbers</strong> for each match — keep
            country names and flags as they are
          </li>
          <li>
            DM <strong>@gaby.perez</strong> the finished file on Slack
          </li>
        </ol>
      </section>

      <section className="instructions__card">
        <h2>Example</h2>
        <pre className="instructions__code">{`"M1": {
  "🇲🇽 Mexico": 2,
  "🇿🇦 South Africa": 1
}`}</pre>
        <p className="instructions__note">
          Every match from <code>M1</code> to <code>M104</code> works the same
          way.
        </p>
      </section>

      <section className="instructions__card">
        <h2>Rules</h2>
        <ul className="instructions__list">
          <li>Predict goals for both teams in every match (0 or more)</li>
          <li>
            Picks lock at <strong>kickoff</strong> — each match on its own
            schedule
          </li>
          <li>
            Knockout matches (M73+) can be filled in later, before each match
            starts
          </li>
          <li>Don&apos;t rename countries or remove flag emojis</li>
        </ul>
      </section>

      <section className="instructions__card">
        <h2>Scoring</h2>
        <ul className="instructions__list instructions__list--scoring">
          <li>
            Exact score: <strong>{rules.exactScore} pts</strong>
          </li>
          <li>
            Correct goal difference: <strong>{rules.correctGoalDifference} pts</strong>
          </li>
          <li>
            Correct winner or draw: <strong>{rules.correctWinnerOrDraw} pts</strong>
          </li>
          <li>
            One team exact goals: <strong>+{rules.oneTeamExactGoalsBonus} pt</strong>
          </li>
          <li>Wrong winner: 0 pts</li>
        </ul>
      </section>

      <section className="instructions__card instructions__card--prize">
        <h2>The prize</h2>
        <p>
          Winner becomes <strong>El/LA FIFAS</strong> 🏆 — bragging rights only,
          no cash, maximum Slack glory.
        </p>
      </section>
    </div>
  );
}
