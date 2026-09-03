# Photo inbox

Staging area for job photos on their way to a project page. Drop originals in,
run one command, and they come out resized, converted, stripped of location
data, and named to match the paths `src/lib/constants.ts` expects.

Raw drops are gitignored — only this file and the empty folder structure are
committed. The finished WebP files land in `public/images/projects/` and those
**are** committed.

## How to use it

1. **Drop photos** into the folder for the project and phase:

   ```
   photo-inbox/<project-slug>/<phase-slug>/
   ```

   Straight off a phone is fine — HEIC, JPG, PNG, TIFF all work, at any size,
   named anything. `IMG_9.HEIC` sorts before `IMG_10.HEIC`, not after.

2. **Run the ingest:**

   ```bash
   npm run photos:ingest                    # everything in the inbox
   npm run photos:ingest -- <project-slug>  # one project
   npm run photos:ingest -- --dry-run       # report only, writes nothing
   ```

3. **Paste the generated block.** Each project gets a ready-made phase block at
   `photo-inbox/_generated/<project-slug>.ts.txt`. Paste it into that project's
   `phases: [...]` array in `src/lib/constants.ts` and replace the `TODO`
   description line. For a project that doesn't exist yet, also fill in the
   metadata (see below).

4. **Check nothing is broken:**

   ```bash
   npm run photos:check
   ```

   Fails if any page references an image that isn't on disk. Next.js only
   surfaces a bad image path at request time, so this is what catches a typo
   before a customer does.

5. **Empty the inbox** once the WebP files are committed. The originals are
   already in Drive; keeping a second copy here just bloats the working tree.

## What the ingest does to each photo

| Step | Why |
|---|---|
| Auto-rotate from the EXIF orientation flag | Phone photos otherwise render sideways |
| **Strip all metadata** | iPhone photos embed **GPS coordinates**. On a customer's home that is their address, published. This is the important one. |
| Resize to max 2400px wide (never upscales) | 4000px off a phone is ~4x the pixels any layout uses |
| Encode WebP q82 | Roughly 70% smaller than the source JPEG at the same visible quality |
| Rename `photo-1 … photo-N` | Matches the existing convention across all project folders |

Re-running against a phase that already has photos **appends** — a second batch
continues at `photo-<next>` instead of overwriting the first.

## Phase slugs

Use these, because they're what the existing 13 projects already use. A new
phase slug is fine when the job genuinely has one — just keep it kebab-case.

`underground` · `2nd-rough` · `rough-in` · `water-repipe` · `trim-out` ·
`final` · `demo` · `build` · `new-construction`

## Folders waiting on photos

**Close-outs** — these projects are live on the site but stop at an early phase,
so the page currently ends on a photo of a trench. Finishing them is the highest
-value work: the pages already exist and already rank.

| Project | Needs |
|---|---|
| `hansen-homes-cape-coral` | `2nd-rough`, `trim-out` |
| `hangar-97-punta-gorda-airport` | `trim-out` |
| `usps-cape-coral-remodel` | `final` |
| `1119-harvest-ave-lehigh-acres` | `trim-out` |
| `1026-halby-ave-lehigh-acres` | `trim-out` |
| `fema-home-punta-gorda` | `2nd-rough`, `trim-out` |
| `south-florida-christian-academy-bathroom-remodel` | `rough-in`, `final` |

**New projects** — jobs sitting in Drive with no page yet. Slugs below are
proposed; rename the folder if you'd rather the URL read differently, since the
folder name becomes `csplumbinglee.com/projects/<slug>`.

`39-southport` · `macan-new-construction` · `river-house` ·
`1326-lafayette-st` · `naples-dock-line`

Each new project needs the metadata the generated block can't infer — send it
with the photos and it goes straight in:

```
name:        # e.g. "39 Southport — New Construction (Cape Coral)"
client:      # GC or homeowner, and whether we can name them publicly
category:    # New Construction | Commercial Remodel | Commercial New Construction | Remodel
location:    # City, FL
timeline:    # "Completed" or a duration like "7 months"
cost:        # a real figure, a range, or "On Request"
challenge:   # 1-3 sentences on the constraint on this job
solution:    # 1-3 sentences on what we did about it
scope:       # bullets — underground, repipe, fixture count, etc.
permits:     # AHJ + inspections cleared
materials:   # brands installed
```

## What actually converts

A GC scrolling a project page is checking whether we can be trusted on their
job. Ranked by what does that work:

1. **Finished fixtures, wide, well lit.** The trim-out shot is the money shot —
   it's the only one that reads as "this job is done and it looks good."
2. **A clean rough-in.** Straight runs, even hanger spacing, tidy stub-outs. A
   plumber's photo that another plumber respects.
3. **Passed-inspection and pressure-test shots.** Gauge holding, green tag in
   frame. Proof, not a claim.
4. **The same angle before and after.** Worth more than two unrelated photos.
5. Wide establishing shot of the building or slab, for context.

Skip: dark phone shots, a hand blocking the fixture, anything with a customer's
face, house number, or vehicle plate visible. Roughly 8–15 photos per phase is
plenty — past that a gallery reads as padding.
