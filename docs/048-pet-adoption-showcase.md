# 048 — Pet adoption showcase

`/showcases/pets` (standalone at `/preview/pets`) is **Patiyuva**, an invented adoption
platform for shelters and foster networks in seven Turkish cities. Visitors search the
animals, check how well one suits their home, apply in four steps and follow the application
until a decision.

## Routes

| Route                  | Page                | What it shows                                                                                                   |
| ---------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------- |
| `/pets`                | `PetsHomePage`      | Hero with quick search, stats, species, longest waiting, steps, stories, shelters, donate/volunteer/foster      |
| `/pets/animals`        | `PetsListPage`      | Search, filters (a sidebar on wide screens, a drawer on phones), sort, pagination, hearts                       |
| `/pets/animals/:petId` | `PetDetailPage`     | Gallery, facts, health, good with, story, special needs, live match check, shelter card, similar animals, share |
| `/pets/apply/:petId`   | `PetApplyPage`      | Four-step application with validation and a live match beside it                                                |
| `/pets/favorites`      | `PetsFavoritesPage` | Favourites and applications (`?tab=applications`), each with its steps and a withdraw                           |

"How it works" and "Shelters" in the header are anchors on the home page. The shell scrolls
to them after the lazily loaded page renders, since the browser's own jump happens too early.

## Data

`data/pets.ts` holds 8 shelters and foster networks and 64 animals (25 cats, 24 dogs, 7
rabbits, 8 birds), written one row per animal. Size, weight, health flags, fee and the
shelter are derived from the row; the story is an origin sentence for the species plus a
wish that matches the animal's energy, in both languages. Turkish templates never put a
suffix on the name, so any name drops in without breaking vowel harmony.

There are no photos. `PetsPortrait` draws each animal as an SVG from its species, breed and
coat colour (tabby stripes, calico patches, lop ears, a cockatiel's crest), and the gallery's
four pictures are four scenes of the same drawing. They always load and never shift the
layout.

The logic that is not rendering lives in `data/petsMatch.ts`, tested in `data/pets.test.ts`:

- **Search**: filters to and from the address (unknown values are dropped), Turkish letter
  folding (`sutlac` finds _Sütlaç_), five sorts.
- **Match**: `matchPet` scores 0–100 from the household (home type, children and other
  animals, hours alone, daily rhythm, experience). A clash with children or other animals
  costs the most, a large active dog in an apartment next, energy and hours alone less. It
  returns the reasons so the page can say why. The list's "Good match for my home" filter
  keeps animals at 60 or more.
- **Application**: `isTurkishMobile`, `isEmail`, `isAdult` back the form's field rules;
  `applicationIssues` is the final check before saving (renters need their landlord's
  consent, the reason needs 40 characters, all three agreements, not too long alone).
- **Status**: `applicationProgress` moves a mock application through received → review →
  phone call → meet and home visit → decision, one step every 90 seconds, and decides by
  score (60+ approved, otherwise waiting list). A withdrawn application stops where it was.

## State

`hooks/usePetsStore.ts` is a zustand store persisted under `rvbp-pets` (version 1; anything
else starts empty): favourites, applications and the last household described. The match
check on a detail page writes the household, the application form starts from it, and
sending an application updates it.

## Tests

- `data/pets.test.ts`: the catalogue's integrity, ages, search, sort, the address round
  trip, match scores, validation and the status timer.
- `pages/PetsPages.test.tsx`: home in both languages, filters from the address, favourites,
  name search, the detail page's live match, not found, the whole application with every
  validation error on the way, and withdrawing from My pets.
