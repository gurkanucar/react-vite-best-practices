# 052 — Song contest showcase

`/showcases/song-contest` (standalone at `/preview/song-contest`) is **Sesin Rengi**, an invented
"Voice of"-style singing final. It is built as a display for a big screen or a projector: the live
voting and results pages fit one viewport with no page scroll, and nobody votes from the site.

## Routes

| Route                                     | Page                     | What it shows                                                                                            |
| ----------------------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------- |
| `/song-contest`                           | `SongContestHomePage`    | Screen bar, the round's status and votes so far, the four finalists, how the night works                 |
| `/song-contest/live`                      | `SongContestLivePage`    | Stats strip, the finalists, an unnamed vote split, votes per minute, a masked voter ticker               |
| `/song-contest/results`                   | `SongContestResultsPage` | The reveal, from last place to first, with medals, champion styling and a scenario switch (`?scenario=`) |
| `/song-contest/contestants/:contestantId` | `SongContestantPage`     | Photo, bio, quote, a visual "now playing" preview, song facts, the other finalists                       |

`?stage=1` on the live and results pages turns on **stage mode**: the screen alone over the whole
window, without the site header or the admin around it. The button in the screen bar also asks the
browser for full screen (that needs the click, so a `?stage=1` link gives the overlay only). Esc, or
leaving full screen, turns it off.

## The live round

Everything is worked out from the clock (`songContestClock`, which tests pin):

- A round lasts 30 minutes: 27 minutes of voting and a 3-minute break with the results ready.
- `voteRate` is the expected votes per second: a slow rise through the round, a short warm-up,
  spikes when a performance replay ends (minutes 4, 10, 16, 22), a few seeded bursts a minute and a
  rush in the last two minutes. `votesInSecond` draws a Poisson count around it, so votes arrive in
  uneven clumps of about one to eight a second.
- `liveStats` adds those up into the total, the last minute and an estimate of people voting.
  `rollingRate` gives the last six minutes in 15-second slices for a chart that scrolls left.

The page itself re-renders only when the round opens or closes (`useRoundPhase`). The strip, the
two charts and the ticker each read the clock on their own (`components/SongContestLive.tsx`), so
the singers' cards are not redrawn every second. The clock stops while the tab is hidden and
catches up when it is shown. Counters count up to their new value, the donut re-proportions and
the flow chart scrolls with recharts' own transitions.

What the live page never shows is who is ahead:

- **Unnamed split.** `anonymousSplit` turns the total into four slices sorted by size. The donut
  uses one warm ramp by slice size, not the singers' colours, has no legend, labels or tooltip, and
  only the total sits in its centre.
- **Masked voters.** `maskName` keeps the first one or two letters of a first name and the initial
  of every other name ("Ayşe Yılmaz" → "Ay\*\* Y."); short names still get two stars. Names come
  from a seeded pool of Turkish first names and surnames, never the same one twice in a row.
- **The ticker.** Each voter is a glowing note chip with the masked name and how many votes, no
  city, device or choice. New chips pop in on the left and the strip slides along; only the new
  chips are measured, and nothing on a chip changes after it appears, so the strip never jitters.
  Hovering holds it still. Every few seconds one voter's note floats up over the screen with the
  name. With reduced motion chips just fade in and nothing flies.

## Results

`data/songContestRanking.ts` is pure and tested:

- `rankEntries` uses standard competition ranking: equal votes share a place and the next place is
  skipped (1, 2, 2, 4).
- Shares are in tenths of a percent with largest-remainder rounding, so they add up to 100.0%. Tied
  contestants are evened out to the same share; the leftover tenth goes to an untied contestant.
- `revealSteps` groups contestants by place, last place first, so a tie is revealed in one step.
  The last step is the winners, so a tie at the top gives joint champions.

The results page lays the cards out from first to last, left to right, the champion card wider,
with gold, silver, bronze and dark red medals. Places open with "Reveal next", a tap on the glowing
card, or a presenter's clicker (Arrow right, Page down, Space, Enter). The scenario switch shows the
other shapes a final can take: 5 finalists, a tie for second, joint winners, 2 finalists and a
single finalist.

## Look

- Near-black stage with maroon glows, Montserrat for display type (Google Fonts), letter-spaced
  small-caps labels.
- Glowing notes in yellow, amber, orange and red: a soft layer behind the content with twinkling
  sparks, and a front layer of about 40 notes at three depths drifting over everything
  (`pointer-events: none`). Only transform and opacity animate; with reduced motion a few notes
  stay still and the confetti is skipped.
- Photos are Unsplash stock images (credited in the corner of each screen), with a focal point per
  singer for `object-position`. The champion's card is black and white and the others take a warm
  amber duotone, both done with CSS filters. If a photo fails to load, a drawn portrait replaces it.
- Team pills use `teamName`, which builds the Turkish genitive with vowel harmony and the buffer
  "n" (`turkishGenitive`: "Tan’ın", "Er’in", "Ada’nın").

## Fitting the screen

`Screen` (in `components/SongContestStage.tsx`) holds the page to `100dvh` minus the site header
on landscape displays of at least 1000×560, and to the full `100dvh` in stage mode. Panels shrink
and clip inside rather than grow the page. Checked at 1920×1080, 1440×900, 1280×720 and 1024×768 in
both languages, standalone and in stage mode. Phones, portrait tablets and the admin preview get an
ordinary scrolling layout.

## Files

- Data: `songContest.ts` (singers, round, split, feed, scenarios, team names), `songContestRanking.ts`,
  `songContestCopy.ts`.
- Hooks: `useSongContest.ts` (copy, clock, round, stage mode). Nothing is persisted.
- Components: `SongContestSiteShell`, `SongContestScreen` (bar, strip, medals, stage cards, photo
  credit), `SongContestStage` (stage mode and the fitted screen), `SongContestArt` (notes, photos,
  drawn fallback, equalizer, confetti), `SongContestBits` (round status).
- Styles: `song-contest.css`.
- Tests: `data/songContest.test.ts`, `pages/SongContestPages.test.tsx`.

An earlier build let visitors vote from the site and kept their ballot under `rvbp-song-contest`.
That was removed; the key is no longer read or written.
