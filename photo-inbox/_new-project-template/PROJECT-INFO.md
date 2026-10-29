# Project info

Fill this in and leave it in the project folder so it travels with the photos.
Lines marked `*` are what the page needs to publish. The rest is what makes the
page worth a GC's time, and it is the text AI engines quote.

**Folder name = URL.** `csplumbinglee.com/projects/<folder-name>` — lowercase,
hyphens, no spaces. `39-southport`, `naples-dock-line`, `usps-cape-coral-remodel`.

```
*name:         e.g. "39 Southport — New Construction (Cape Coral)"
*client:       GC or homeowner — and can we name them publicly? (yes / no)
clientUrl:     builder website, if we can link it
*category:     New Construction | Commercial New Construction | Commercial Remodel | Remodel
*location:     City, FL
*completedOn:  YYYY-MM-DD the job finished (blank if still in progress)
timeline:      "Completed", or a duration like "7 months"
cost:          a figure, a range, or "On Request"

challenge:     1–3 sentences on the constraint on this job
solution:      1–3 sentences on what we did about it
scope:         bullets — underground, repipe, fixture count, etc.
permits:       AHJ + inspections cleared
materials:     brands installed
```

## Phases in this folder

Delete the phase folders this job doesn't use. Add one if the job has a phase
that isn't here (kebab-case, e.g. `water-repipe`). One line per phase on what
it covered:

```
before:
underground:
rough-in:
trim-out:
final:
after:
```

## Before / after

Same angle, shot twice, is worth more than two unrelated photos. Put the
"before" frames in `before/` and the "after" frames in `after/` **in the same
order** — number them `01.jpg`, `02.jpg` … in both folders if the phone names
don't line up. The ingest keeps that order, so `before/photo-3` and
`after/photo-3` stay a pair.

## Cover photo

Filename of the one frame that should headline the page — the finished,
wide, well-lit shot:

```
cover:
```
