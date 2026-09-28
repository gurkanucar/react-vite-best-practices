# 050 — Sports tournament showcase

Zirve Arena is an invented multi-sport tournament site. It covers football, basketball,
volleyball, tennis and chess. Its live match centre plays events as they happen, fans react
in the stands, brackets fill in as teams advance, and every sport has league tables and
rankings. Visitors can follow teams and players and pick winners.

There is no API:

- Teams, players and tournaments live in `data/esports.ts`.
- Matches are simulated by `data/esportsSports.ts` and `data/esportsSim.ts`.
- Follows, picks and the side you cheer for are kept in a persisted zustand store.

The routes still use the `esports` path and file names from the first version of the site.

## Routes

Every page is under `/showcases/esports` inside the admin and under `/preview/esports` on its
own.

| Route                                | Page                     | What it shows                                                                        |
| ------------------------------------ | ------------------------ | ------------------------------------------------------------------------------------ |
| `/esports`                           | `EsportsHomePage`        | Live hero, five sport cards with live counts, live now, featured cup, next, results  |
| `/esports/tournaments`               | `EsportsTournamentsPage` | Search, status, sport and format filters (kept in the address)                       |
| `/esports/tournaments/:tournamentId` | `EsportsTournamentPage`  | Overview, bracket or table or Swiss rounds, schedule, standings, prizes (`?tab=`)    |
| `/esports/matches/:matchId`          | `EsportsMatchPage`       | Live mode: ticker, banners, scoreboard, period table, stats, box score, feed, stands |
| `/esports/teams/:teamId`             | `EsportsTeamPage`        | A club's squad or a player's profile, form, history, achievements, follow            |
| `/esports/leaderboard`               | `EsportsLeaderboardPage` | Rankings by sport and region: power rating, Elo, tennis ranking points, trend, form  |

An unknown tournament, match or team shows a friendly not-found page.

## Invented content

- **The sports and their rules are real.** Every club, player, league and tournament is made
  up, and the site says so.
- **Squads.** Each sport has eight sides:
  - Football squads have eleven starters plus a bench, with positions and shirt numbers.
  - Basketball squads have ten players.
  - Volleyball squads have six starters, a libero and a bench.
- **Individual players.** Tennis players have ranking points and a playing hand. Chess players
  have a title and an Elo rating.
  - A test checks that no two people share a name.
- **Twelve tournaments.** Every sport has a league that never stops. There are also:
  - four knockout cups: football, basketball, volleyball, and tennis in best of three;
  - a best-of-five tennis event;
  - a chess knockout;
  - a five-round chess Swiss.

## The simulation

- **Every match has a fixed script,** worked out from the match id and the two sides. A
  seeded generator weights the result by Elo win chance.
- **The clock only decides how much of a script is visible** (`liveState`):
  - nothing before the start;
  - the events so far while the match is live;
  - everything once it is over.
  - Scores, period tables, stats, box scores and the feed are all computed from the same
    events, so they always agree.
- **Rules per sport** (`esportsSports.ts`):
  - **Football:** two 45-minute halves plus stoppage time.
    - Goals come with the scorer, the assist and the minute.
    - Shots, corners, fouls and yellow cards are all simulated; a second yellow is a red.
    - A sent-off player takes no further part, and his team plays a man down, which affects
      later chances. Each team makes two substitutions.
    - Draws count in the league. A level cup tie goes to extra time and then to penalties
      (five each, then sudden death).
  - **Basketball (FIBA):** four 10-minute quarters with 2-pointers, 3-pointers and free
    throws.
    - Team fouls put the other side in the bonus from the fifth foul of a quarter.
    - A player fouls out on five fouls.
    - A coach calls a timeout after an 8–0 run.
    - A tie after four quarters goes to 5-minute overtimes.
  - **Volleyball:** best of five sets with rally scoring, to 25 (the fifth set to 15), won by
    two.
    - Points are marked as aces, attacks, blocks or errors, and the serve rotates on a
      side-out.
    - Timeouts are called during a run.
    - Set point and match point are flagged.
  - **Tennis:** points are called 0, 15, 30, 40, deuce and advantage. Sets go to six, won by
    two, with a tie-break (to seven, won by two) at 6–6.
    - The serve alternates, and aces and double faults are marked.
    - Break points, set points, match points and breaks of serve are flagged.
    - Matches are best of three, or best of five in Kış Masters.
  - **Chess:** each game replays one of seven scripted games in SAN, including the Opera
    Game, Légal's mate and the Blackburne Shilling trap. They end in mate, resignation,
    repetition or an agreed draw.
    - Both clocks run at 25 minutes + 10 seconds a move.
    - A drawn knockout game goes to an Armageddon game with colours reversed.
- **The chess board** (`esportsChess.ts`) replays SAN on a small board model. It finds the
  single piece that can make each move, taking pins into account, and it handles castling,
  en passant and promotion. A test replays every game.
- **Broadcast pace.** Matches run faster than in real life: a football minute lasts 20
  seconds and a basketball game second 0.45 seconds. A league match is stretched or
  squeezed (`fit`) to last longer than the gap to the next fixture but shorter than two
  gaps. Pace never changes a random draw, so results stay fixed.
- **Dates count from today.**
  - Cups and the Swiss are placed in days from the start of today: football and tennis
    semi-finals and a chess Swiss round are on today, and other events are finished or
    upcoming.
  - Each league starts a fixture every 15 to 25 minutes, all day, cycling through the 28
    pairings so that neighbouring fixtures never share a side.
  - A test checks that every sport has a live match every seven minutes of a day.
- **Swiss pairing** puts players on the same score together, with no rematches (it
  backtracks when it has to). Colours go to whoever has had White less often.
- **Tables use each sport's rules:**

  | Sport      | Columns                                           | Tie-breaks                           |
  | ---------- | ------------------------------------------------- | ------------------------------------ |
  | Football   | W/D/L/GF/GA/GD/Pts                                | goal difference                      |
  | Basketball | W/L/PF/PA/win %, 2 points for a win, 1 for a loss | ranked by win %                      |
  | Volleyball | 3 points for 3–0 or 3–1; 2 and 1 for 3–2          | then wins, set ratio and point ratio |
  | Tennis     | wins, sets and games                              |                                      |
  | Chess      | 1, ½ or 0 per game                                | Buchholz                             |

- **The clock is injectable.** Pages read `esportsClock.now`, and the tests pin it to 16:20
  on 28 September 2026.

## Live mode

- **Ticker:** a sticky bar at the top of the screen with both sides, the score and the clock
  (`67'`, `45+2'`, `Q3 · 04:21`, `Set 3`, Half-time, Set break, Penalties).
- **Banners** appear for big moments that happen while you watch:
  - a goal or a red card;
  - half-time or the final whistle;
  - a player fouling out;
  - a set won, a break of serve, a break point, a set point or a match point;
  - checkmate, resignation or a draw.
  - Moments that were already over when the page opened are not replayed.
  - The banner area is a polite live region.
- **Play-by-play feed:** newest first. New lines slide in at the top with a highlight, and
  each has the stamp its sport uses (minute, quarter clock, set score or move number).
- **Scoreboard:** scores by period (halves, quarters, sets, or games in tennis with the point
  score and a serve dot). Also stats bars for each sport, box scores with shirt numbers,
  cards and fouled-out players, and line-ups before kick-off.
- **Chess view:** the board after the last move, with the move marked, both clocks (the side
  to move ticks), material and the move list.
- The page updates every second.
- `prefers-reduced-motion` turns off the slide-ins, banner motion and floaters.

## Fan reactions

- **Picking a side:** you pick a side in the stands. The choice is kept per match in the
  store. You can then tap ❤️ 🔥 👏 🎉.
- **Floating reactions:** each tap sends an emoji rising from your side of the stage in that
  team's colour.
  - Other fans' reactions stream in too, several times faster for a side that just scored
    or had a big moment.
  - Floaters have `pointer-events: none` and are removed when their animation ends. There are
    at most 36 on screen.
- **Throttling:** at most six of your own taps count per second.
- **Fan meter:** per-side counters and a bar. Counts come from the match itself (minutes
  played, each side's share of fans and its scoring moments), so every viewer sees the same
  numbers, plus the reactions sent in this session.
- **Screen readers** hear about your reaction at most every 2.5 seconds, never on every tap.
- **Reduced motion:** no floaters; the counters flash instead.
- When the match is over, the final fan meter is shown.

## Store

`hooks/useEsportsStore.ts` persists `follows`, `predictions` and `fanSides` (match id → side)
under `rvbp-esports`.

- It is at version 2.
- `migrateEsports` carries follows and picks over from version 1 and adds an empty
  `fanSides`.
- Ids that no longer exist are simply never shown.

## Tests

- **`data/esports.test.ts`** covers:
  - unique people;
  - sports matching their tournaments;
  - repeatable scripts;
  - football: no level cup ties, second yellows and sent-off players, and the score split by
    half;
  - basketball: no ties, overtime only after a level fourth quarter, and fouling out on five;
  - volleyball: set targets and the 3–2 points rule;
  - tennis: calls, set scores and tie-breaks, and point flags;
  - chess: every game replays, Armageddon, half points and Swiss without rematches;
  - live state and the clock;
  - something live in every sport all day;
  - tournament dates and brackets;
  - the crowd count;
  - the store and its migration.
- **`pages/EsportsPages.test.tsx`** renders every page. It covers:
  - Turkish;
  - filters, a tennis bracket, a basketball table and Swiss Buchholz;
  - live football with the stands and a reaction;
  - reactions disabled until you pick a side;
  - the chess board;
  - the tennis serve dot;
  - a prediction;
  - a club squad and a player profile;
  - the rankings filter and a not-found page.
