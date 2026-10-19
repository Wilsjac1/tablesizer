# TableSizer

**Live site: [tablesizer.com](https://tablesizer.com/)**

TableSizer is a free conference table size calculator and room planner. Enter a room size and headcount, and it works out the table length and width, seats by shape, and the clearance chairs need — drawn to scale, in the browser, with nothing to install and no account.

## What it does

- **Planner** — room presets or exact room dimensions, 4–30 seats, six shapes (rectangle, boat, racetrack, round, U, V), 30″/36″/42″ space per person, and 42–54″ clearance to the wall, including a credenza/display-wall allowance
- **Live plan** — a to-scale top-down drawing with chairs, alternatives that fit the room, and a plain-English "why this size"
- **Shareable** — every plan is encoded in the URL, and can be printed, downloaded, or emailed as a size chart
- **Guides** — [conference table dimensions](https://tablesizer.com/conference-table-dimensions.html), a [size chart for 6–22 seats](https://tablesizer.com/conference-table-size-chart.html), [boardroom table sizes](https://tablesizer.com/boardroom-table-sizes.html), [reception desk dimensions](https://tablesizer.com/reception-desk-dimensions.html), and a [conference room layout guide](https://tablesizer.com/conference-room-layout-guide.html)

Sizing rules are openly sourced (Paul Downs seating guide, OFW, OfficeSimpli and others, cited on the site) and implemented in `calc.js`, which is unit-tested against the published charts.

## Run it locally

```sh
node build.js   # regenerate all HTML pages from the shared templates
node test.js    # run the test suite
```

No build framework and no dependencies — plain HTML, CSS and JavaScript, served by GitHub Pages.

## About

TableSizer is built and maintained by [Fargo Woodworks](https://fargowoodworks.com/), a solid-hardwood furniture workshop in Fargo, North Dakota. The makers page lists workshops that build conference tables to order, starting with Fargo's Hartford Conference Table.
