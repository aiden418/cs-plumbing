# Photo inbox

Staging area for job photos on their way to a project page or the `/gallery`
grid. Drop originals in, run one command, and they come out resized, converted,
stripped of location data, and named to match the paths the site expects.

Raw drops are gitignored — only this file and the empty folder structure are
committed. The finished WebP files land in `public/images/projects/` and
`public/images/gallery/`, and those **are** committed. The owner's short guide
is `HOW-TO-UPDATE.md` at the top of the project.

## How to use it

1. **Drop photos** into the folder for the project and phase:

   ```
   photo-inbox/<project-slug>/<phase-slug>/
   ```

   Straight off a phone is fine — HEIC, JPG, PNG, TIFF all work, at any size,
   named anything. `IMG_9.HEIC` sorts before `IMG_10.HEIC`, not after.
   (HEIC is converted by the Mac itself, so run the ingest on a Mac.)

2. **Run the ingest:**

   ```bash
   npm run photos                           # everything in the inbox: projects and gallery
   npm run photos:ingest -- <project-slug>  # one project
   npm run photos:ingest -- --dry-run       # report only, writes nothing
   ```

3. **Describe the new photos.** There is nothing to paste into code. Each new
   photo was added to the `images.json` in its folder
   (`public/images/projects/<project-slug>/<phase-slug>/images.json`) with an
   empty `"alt"`. Write what each photo shows between the quotes. The same
   file takes a `"caption"`, `"cover": true` for the project's card photo and
   `"hidden": true` to pull a photo off the site without deleting it. For a
   project that doesn't exist yet, also send the metadata (see below).

4. **Check nothing is broken:**

   ```bash
   npm run photos:check
   ```

   Fails if a page names an image that isn't on disk, if a photo still carries
   location data, or if a HEIC/TIFF file ended up in `public/images`. It also
   lists the photos that still need a description.

5. **Originals move themselves** to `photo-inbox/_done/` once they are
   converted. Empty that folder when the WebP files are committed; the
   originals are already in Drive.

## What the ingest does to each photo

| Step | Why |
|---|---|
| Auto-rotate from the EXIF orientation flag | Phone photos otherwise render sideways |
| **Strip all metadata** | iPhone photos embed **GPS coordinates**. On a customer's home that is their address, published. This is the important one. |
| Resize to max 2400px wide (never upscales) | 4000px off a phone is ~4x the pixels any layout uses |
| Encode WebP q82 | Roughly 70% smaller than the source JPEG at the same visible quality |
| Rename `photo-1 … photo-N` | Matches the existing convention across all project folders |
| Add an entry to the folder's `images.json` | So the photo can be described without touching code; `alt` starts empty and the check lists it until it is filled in |
| Move the original to `photo-inbox/_done/` | The inbox only ever holds what is still waiting |

Re-running against a phase that already has photos **appends** — a second batch
continues at `photo-<next>` instead of overwriting the first. Nothing is ever
overwritten.

## Gallery photos

`/gallery` is a filterable grid, not a project broken into phases, so photos
are grouped by category. Same treatment of the pixels — rotate, strip GPS,
downscale, WebP.

1. **Drop photos** into the folder for the category:

   ```
   photo-inbox/gallery/<category>/
   ```

   Only four categories exist, because `GalleryItem` in `src/lib/types.ts` is a
   union and the filter chips are built from it:

   `residential` · `commercial` · `new-construction` · `remodel`

2. **Run the ingest:**

   ```bash
   npm run photos                         # everything in the inbox: projects and gallery
   npm run gallery:ingest -- commercial   # just one category
   npm run gallery:ingest -- --dry-run    # report only, writes nothing
   ```

3. **Fill in `alt` and `title`** for each new photo in
   `public/images/gallery/<category>/images.json`. The script leaves both
   blank on purpose — a filename like `IMG_4864.jpeg` says nothing about what
   the photo shows, and both fields are read by humans and by search engines.
   `title` is the caption shown when the photo is opened full screen; `alt`
   describes the image for a screen reader. The `id` and `category` are filled in for you; ids continue after
   the highest one used anywhere in the gallery, so they never collide.

Files land as `public/images/gallery/<category>/<category>-<n>.webp`. Renaming
one to something descriptive (`commercial-prerinse-faucet.webp`) is fine —
rename its entry in that folder's `images.json` to match.

A gallery photo has to stand on its own with no project page around it, so it
wants to be the strongest single frame of a job rather than one of a sequence.

## Phase slugs

Use these, because they're what the existing 13 projects already use. A new
phase slug is fine when the job genuinely has one — just keep it kebab-case.

A phase folder only shows once the project's entry in `COMPLETED_PROJECT_TEXT`
(`src/lib/constants.ts`) lists a phase with the same `slug` (with its `name`
and `description`). Until then `npm run photos:check` names the folder as
"not published". The same goes for a whole new project folder.

`underground` · `2nd-rough` · `rough-in` · `water-repipe` · `trim-out` ·
`final` · `demo` · `build` · `new-construction`

## Closing out a project

A project is "closed out" when its page stops saying *In Progress*. Three
fields of the project's entry in `COMPLETED_PROJECT_TEXT` (`src/lib/constants.ts`) do that work — set them together with the final
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

Each new project also needs an entry in `COMPLETED_PROJECT_TEXT`
(`src/lib/constants.ts`) with the same `slug` as its folder, and its phases
listed by `slug`; the photos alone do not make a page. These are the facts the
photos can't supply. Send them with the photos and they go straight in (a
`cost` with a dollar figure stops the build at the claims check unless it is
marked as documented, so "On Request" is the default):

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

1. **Local:** drop the photos in `photo-inbox/…`, run `npm run photos`,
   commit the WebP output and the `images.json` beside it under
   `public/images/projects/` (or `public/images/gallery/`) and push. Claude
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
