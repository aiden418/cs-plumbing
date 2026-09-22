# Photo inbox

Staging area for job photos on their way to a project page or the `/gallery`
grid. Drop originals in, run one command, and they come out resized, converted,
stripped of location data, and named to match the paths the site expects.

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

## Gallery photos

`/gallery` is a flat filterable grid, not a project broken into phases, so it
has its own inbox and its own command. Same treatment of the pixels — rotate,
strip GPS, downscale, WebP.

1. **Drop photos** into the folder for the category:

   ```
   photo-inbox/_gallery/<category>/
   ```

   Only four categories exist, because `GalleryItem` in `src/lib/types.ts` is a
   union and the filter chips are built from it:

   `residential` · `commercial` · `new-construction` · `remodel`

2. **Run the ingest:**

   ```bash
   npm run gallery:ingest                 # every category
   npm run gallery:ingest -- commercial   # just one
   npm run gallery:ingest -- --dry-run    # report only, writes nothing
   ```

3. **Paste the generated block** from `photo-inbox/_generated/_gallery.ts.txt`
   into `galleryItems` in `src/app/gallery/GalleryPage.tsx`. Ids continue from
   the highest one already in that array, so they never collide.

4. **Fill in the two TODOs on each entry.** The script leaves `alt` and `title`
   blank on purpose — a filename like `IMG_4864.jpeg` says nothing about what
   the photo shows, and both fields are read by humans and by search engines.
   `title` is the caption on the tile; `alt` describes the image for a screen
   reader.

Files land as `<category>-<n>.webp`. Renaming them to something descriptive
(`commercial-prerinse-faucet.webp`) matches the convention of the 64 photos
already in `public/images/gallery/` — just update the `src` to match.

A gallery photo has to stand on its own with no project page around it, so it
wants to be the strongest single frame of a job rather than one of a sequence.

## Phase slugs

Use these, because they're what the existing 13 projects already use. A new
phase slug is fine when the job genuinely has one — just keep it kebab-case.

`underground` · `2nd-rough` · `rough-in` · `water-repipe` · `trim-out` ·
`final` · `demo` · `build` · `new-construction`

## Closing out a project

A project is "closed out" when its page stops saying *In Progress*. Three
fields in `COMPLETED_PROJECTS` do that work — set them together with the final
phase of photos:

```ts
timeline: "Completed",           // or a duration like "7 months"
completedOn: "2025-05-02",       // ISO date the job finished — prints as "Completed May 2025",
                                 // feeds sitemap lastmod and the page's JSON-LD dateCreated
updatedOn: "2026-09-22",         // bump whenever the page gets new photos or copy
```

Then rewrite `description` so it reads as finished work (no "will be updated
as the build progresses"), and fill `challenge` / `solution` / `scopeDetails` /
`permits` / `materials` if you have them — that block is what a GC actually
reads, and it is the text AI engines quote.

## Folders waiting on photos

**Close-outs** — these projects are live on the site but stop at an early phase,
so the page currently ends on a photo of a trench. Finishing them is the highest
-value work: the pages already exist and already rank. None of these have a
folder in Drive → Job Photos as of 2026-09-22; the photos are presumably still
on phones.

| Project | Needs | Also needs |
|---|---|---|
| `hansen-homes-cape-coral` | `2nd-rough`, `trim-out` | Is this the same house as 1210 or 2210? If so, merge the pages. |
| `hangar-97-punta-gorda-airport` | `trim-out` | completion date |
| `usps-cape-coral-remodel` | `final` | completion date |
| `1119-harvest-ave-lehigh-acres` | `trim-out` | completion date |
| `1026-halby-ave-lehigh-acres` | `trim-out` | completion date |
| `fema-home-punta-gorda` | `2nd-rough`, `trim-out` | completion date |
| `south-florida-christian-academy-bathroom-remodel` | `rough-in`, `final` | completion date |

**New projects** — photos are already in Drive → Job Photos. Slugs below are
proposed; rename the folder if you'd rather the URL read differently, since the
folder name becomes `csplumbinglee.com/projects/<slug>`.

| Drive folder | Photos there | Drop into |
|---|---|---|
| 39 Southport | 22 JPG, May 2025 (several `copy` duplicates — keep one of each) | `photo-inbox/39-southport/final/` |
| Macan New Construction | 6 JPEG, Aug 2025 | `photo-inbox/macan-new-construction/final/` |
| River House | 5 JPEG, Jul 2025 | `photo-inbox/river-house/final/` |
| 1326 Lafayette St | 12 HEIC, Jun 2025 | `photo-inbox/1326-lafayette-st/final/` |
| Naples Dock Line | 2 JPG (before / after), Oct 2025 | `photo-inbox/naples-dock-line/final/` |

Each new project needs the metadata the generated block can't infer — send it
with the photos and it goes straight in:

```
name:        # e.g. "39 Southport — New Construction (Cape Coral)"
client:      # GC or homeowner, and whether we can name them publicly
category:    # New Construction | Commercial Remodel | Commercial New Construction | Remodel
location:    # City, FL
completedOn: # ISO date the job finished
cost:        # a real figure, a range, or "On Request"
challenge:   # 1-3 sentences on the constraint on this job
solution:    # 1-3 sentences on what we did about it
scope:       # bullets — underground, repipe, fixture count, etc.
permits:     # AHJ + inspections cleared
materials:   # brands installed
```

### Working remotely (Claude on a branch)

The raw drops are gitignored, so a local `git push` never carries them. Two
ways to get photos onto a branch Claude can process:

1. **Local:** drop the photos in `photo-inbox/…`, run `npm run photos:ingest`,
   commit the WebP output under `public/images/projects/` and push. Claude
   takes it from there (captions, description, case study, close-out fields).
2. **No laptop:** upload the originals straight into
   `photo-inbox/<slug>/<phase>/` on the branch through GitHub's *Add file →
   Upload files* (the web uploader ignores `.gitignore`). Claude runs the
   ingest, commits the WebPs, and deletes the raws in the same push so they
   never reach `main`.

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
