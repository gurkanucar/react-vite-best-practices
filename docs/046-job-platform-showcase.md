# 046 — Job platform showcase

`/showcases/talent` (standalone at `/preview/talent`) is **Workvia**, an invented job site
seen from both sides: candidates search, apply and follow their applications; the employer
posts listings and moves applicants through a pipeline. It replaces the old talent board at
`/showcases/jobs`, whose list, detail and editor pages became the employer area; the old
addresses redirect to `/showcases/talent/employer`.

There is no sign-in. The bar under the header switches between **Candidate** and
**Employer**, and holds each side's own pages (My applications and Profile, or Post a job),
which keeps the header to three links so it fits beside the admin sidebar.

## Routes

| Route                                  | Page                     | What it shows                                                 |
| -------------------------------------- | ------------------------ | ------------------------------------------------------------- |
| `/talent`                              | `TalentHomePage`         | Search, categories, recommended jobs, companies, pay, how-to  |
| `/talent/jobs`                         | `TalentJobsPage`         | Results with filters; a split view with the job on the right  |
| `/talent/jobs/:jobId`                  | `TalentJobPage`          | The whole listing, skill match, easy apply, similar jobs      |
| `/talent/companies`                    | `TalentCompaniesPage`    | Directory with search, industry, size, sort, follow           |
| `/talent/companies/:companyId`         | `TalentCompanyPage`      | Cover, about, culture, benefits, reviews, open jobs           |
| `/talent/profile`                      | `TalentProfilePage`      | CV builder, profile strength, CV preview that prints          |
| `/talent/applications`                 | `TalentApplicationsPage` | Every application's steps, interview invite, withdraw, notes  |
| `/talent/employer`                     | `TalentEmployerPage`     | The employer's listings, stats, actions and applicants drawer |
| `/talent/employer/new`, `/:jobId/edit` | `TalentPostJobPage`      | Post or edit a listing, with a live preview                   |

## Data

`data/careers.ts` generates 16 invented companies and 120 jobs from a seeded PRNG
(Mulberry32), so every visitor sees the same listings. A job's age is stored as "minutes
before now", so the site always looks freshly updated. Pay is monthly gross lira; a quarter
of listings do not publish it.

The logic that is not rendering lives in plain modules with tests (`data/careers.test.ts`):

- `careersSearch.ts`: filters to and from the address, keyword scoring (every word must
  match; a title hit counts more than a skill, which counts more than the company), Turkish
  letter folding (`gelistirici` finds _Geliştirici_), sorting, skill match, similar jobs and
  the salary medians on the home page.
- `careersProfile.ts`: the candidate profile, its strength (eleven equal checks), and the
  application pipeline.
- `careersEmployer.ts`: which listings exist and which are public, turning the post form into
  a listing, and the generated applicants.

## Candidate side

- **Search.** Every filter is a search param, so a search is a link and a job alert is just
  a saved query string. The split view (from `xl`, because inside the admin frame the sidebar
  takes the room) keeps the picked job in `?job=`; on narrower screens a card opens the job
  page. Cards mark jobs you have viewed or applied to.
- **Easy apply.** Four steps: contact (from the profile), CV (pick one or add a file name),
  screening questions (the standard three plus the listing's own), review. Each step checks
  only its fields.
- **Applications.** A new application moves one step a minute, so it can be watched: applied
  → viewed → in review → interview → decision. The example ones move one step a day. The
  outcome is fixed when it is sent (from its id) but never shown early: a step still to come
  is just "Decision", and an offer waits for the interview itself. The interview invite
  downloads as an `.ics` file. Withdrawing freezes the timeline.
- **Profile.** Saved as you type. The strength meter lists what is missing; the example
  profile starts at 82% (no salary expectation, no portfolio link). The CV preview prints on
  its own through a print stylesheet.

## Employer side

The employer area runs as **Orbiton Cloud**: its generated listings are the ones you manage,
plus a seeded draft and one listing closed early.

- **Listings.** Status (published, draft, closed), applicants, views, closing date; search,
  status filter and sort. Actions: edit, view, close or reopen (a past closing date moves 30
  days out), duplicate as a draft, delete with confirmation.
- **Posting.** Title, field, level, type, work mode, office, pay range with a show/hide
  switch, about, responsibilities and requirements (one per line), at least three skills,
  benefits, up to five screening questions and a closing date. The right side is the
  listing as candidates will see it. Publishing adds it to the store, and it shows up in
  search and on its job page at once; editing a generated listing stores an edited copy
  under the same id that hides the original.
- **Applicants.** Up to eight generated applicants per listing, with a skill match against
  the listing, and a stage (new, screening, interview, offer, hired, rejected) that the
  employer can change. When the candidate using the site has applied to one of these
  listings they appear first, marked "You"; moving them stores `employerStage` on their
  application, which from then on decides their timeline under My applications instead of
  the clock. Two example applications are on Orbiton Cloud listings so this can be tried
  straight away.

## Store

`useCareersStore` (persisted as `rvbp-talent`, version 1) holds the profile, saved jobs,
viewed jobs, followed companies, applications, job alerts, and the employer's changes:
`customJobs`, `postings` (status and closing date per listing), `deletedJobs` and
`applicantStages`. `useCareersJobs()` merges them with the generated catalogue into what
every page reads: all listings, the published ones, and a lookup by id.

## Layout notes

- Big headings are sized from their container and never break inside a word.
- Company marks are drawn squares with initials, sized with `aspect-ratio: 1` so a flex
  parent cannot squash them; avatars and dots are true circles.
- Only the logo overlaps the company cover; the back link sits above the cover.
- Drawers and modals render outside the site's size container, so their small-screen rules
  are media queries rather than container queries.

## Not included

Nothing is sent anywhere: applications, alerts and postings live in the browser. Alerts do
not notify, the external "apply on company site" link goes to an example domain, and
footer links are plain text. There is no dark mode.
