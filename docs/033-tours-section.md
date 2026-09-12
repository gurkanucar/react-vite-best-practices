# 033 — Tours

A section of its own in the sidebar, with a card list at `/tours` and a detail page at
`/tours/:tourId`. Both were built from Material UI template screenshots.

## The mosaic, and the one thing antd would not do

The card and the detail page both show a lead image beside a stack of smaller ones. No
component draws that shape, so it is a CSS grid — the only custom layout on either page:

```css
.tour-mosaic--detail {
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
```

Two rules in that block are written with the class doubled — `.tour-mosaic.tour-mosaic` —
and that is deliberate. Ant Design styles a card cover through `.ant-card-bordered
.ant-card-cover > *` and its images through `.ant-image-img`, both specific enough to beat a
single class. The first attempt rendered as three full-width images stacked vertically,
and the second filled the grid but left the lead frame short of its cell. Neither was
visible from the types or the tests; both came from looking at the page.

Below 576px the small frames are too small to show anything, so the grid drops to one
column and hides them.

## Filtering

`applyTourFilters()` filters and sorts in one pass and returns a new array, so the page
never holds a half-filtered copy and the source list is never reordered in place. It takes
the name resolver as an argument:

```ts
applyTourFilters(tours, filters, (tour) => messages.tours.names[tour.nameId])
```

The data stores a translation key, not a label. Searching has to match what the reader
actually sees, which means the search runs against the resolved name and therefore in
whichever language is selected — a test covers that.

Search and sort sit in the toolbar; country and minimum rating live in a `Drawer` behind a
`Badge` that counts how many of them are set. Only the two panel filters count, because the
other two are already on screen.

## Services are listed, not filtered

Every service a tour could include is shown, with the ones it does not struck through and
dimmed. Removing them would lose the information — "no audio guide" is something a reader
wants to know.

## The detail route

`/tours/:tourId` reads the id from the URL, and an unknown id renders a `Result` with a way
back rather than a blank page or a crash.

## Placeholder images

Six generated SVG landscapes, 0.7-1.3 KB each, shared between the cards, the mosaics and
the lightbox. No external URLs and no binaries, the same rule the rest of the project
follows.
