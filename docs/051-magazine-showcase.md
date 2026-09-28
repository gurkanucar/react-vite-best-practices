# 051 — Magazine showcase

`/showcases/magazine` (standalone at `/preview/magazine`) is **Satır Arası**, an invented
online magazine. Readers browse by topic and writer and read articles with a table of contents
that follows them. They can switch to a distraction-free reading mode, save articles and pick
up where they left off.

## Routes

| Route                         | Page                    | What it shows                                                                                                           |
| ----------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `/magazine`                   | `MagazineHomePage`      | Cover story with the latest beside it, continue reading, latest, most read, editor's picks, topics, writers, newsletter |
| `/magazine/articles/:slug`    | `MagazineArticlePage`   | Progress bar, header with reading time, contents, the article, author card, read next, reading mode (`?mode=read`)      |
| `/magazine/topics/:topicId`   | `MagazineTopicPage`     | Topic switcher, search, sort, length and writer filters, all kept in the address                                        |
| `/magazine/authors/:authorId` | `MagazineAuthorPage`    | Bio, city, topics, stats (articles, minutes, reads), articles with a sort                                               |
| `/magazine/bookmarks`         | `MagazineBookmarksPage` | Saved articles and reading history with progress (`?tab=history`), remove one or clear all                              |

"Latest", "Topics" and "Authors" in the header are anchors on the home page. The shell scrolls to
them, and to an article heading in the address, once the lazily loaded page has rendered.

## Content

The data lives in these files:

- `data/magazine.ts` has the 6 topics and 6 fictional writers, plus the logic.
- `data/magazineArticlesTech.ts` and `data/magazineArticlesCulture.ts` hold 15 articles in
  English and Turkish, written for the showcase.

An article body is a list of blocks: paragraphs, `h2`/`h3` headings with fixed ids, quotes, lists,
code, figures and notes. Heading ids do not depend on the language, so `#spacing` works in both.

Real-world facts are kept to what is well established, for example:

- the 2018 honeybee "zero" study;
- the three twilight bands at 6°, 12° and 18°;
- the roughly 20° best angle for a skipping stone;
- Turkish coffee on UNESCO's list since 2013.

Anything that changes, such as timetables or opening hours, is left to "check before you go".

There are no photos. `MagazineArt` draws the covers (seven patterns in the topic's colour) and 15
figures as SVG. The figures use CSS variables, so they follow the reading mode's page colour.

## Reading

- **Reading time.** Words in prose, headings, lists and captions are counted; code is not.
  English is read at 200 words per minute and Turkish at 160. Each code block adds half a minute
  and each figure 12 seconds, and the result is never less than one minute.
- **Progress.** `useReadingPosition` (`hooks/useMagazineReading.ts`) measures how far through the
  article body the reader is (`progressFromRect`). It also finds the current heading
  (`activeHeading`, with the reading line 96px below the top). It works on the window or on a
  scrolling element and re-measures on resize.
- **Contents.** The contents list is a sticky rail on wide screens and a collapse on phones.
  Links are `Link to={{ hash }}`, so the global `ScrollRestoration` scrolls to the heading.
- **Sticky offset.** Headings have `scroll-margin-top: calc(var(--mag-top) + 24px)`.
  `--mag-top` is 0 on the standalone site and the admin bar's height inside the admin. There the
  preview frame switches to `overflow: clip` so sticky parts keep working.
- **Continue reading.** Progress is saved 400ms after scrolling stops. A started, unfinished
  article appears under "Continue reading" on the home page, and the article offers to resume.
  The `?resume=1` links jump there after the global scroll reset.
- **Reading mode.** Reading mode is a full-screen `<dialog>` in a portal, with its own
  scroller. It has text size (15–24px), line width, page colour (light, sepia, dark) and
  typeface, and these settings are saved.
  - It opens at the reader's current position and, when closed with the button or Esc, returns
    the page to where they stopped.
  - The page behind does not scroll while it is open.

## State

`hooks/useMagazineStore.ts` is a zustand store saved under `rvbp-magazine` (version 1; anything
else starts empty). It holds:

- bookmarks;
- reading history (`progress`, `finished`, `readAt` per article);
- reading mode settings.

On load it drops bookmarks and history for articles that no longer exist and fills in any
settings added later.

## Tests

- `data/magazine.test.ts` covers the catalogue's integrity and both languages, reading time,
  related articles, author stats, the filters' round trip through the address, Turkish letter
  folding, the progress maths and the store.
- `pages/MagazinePages.test.tsx` covers home, Turkish, continue reading, the article page, saving,
  resume, reading mode settings and Esc, not found, topic filters from the address, the author
  page, and saved articles and history.
