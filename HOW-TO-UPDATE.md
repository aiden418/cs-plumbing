# How to update the C&S Plumbing of Lee website

Most updates are "put a photo in a folder" or "change a line in a text file".
You never need to open the page code. Nothing changes on the live site until
you publish (last section).

You type the commands below in the Terminal app, inside the project folder:

```
cd ~/dev/cs-plumbing
```

Use the Mac for photos: it converts iPhone HEIC photos and builds the homepage
film.

## The folders you will use

```
cs-plumbing/
  photo-inbox/                  drop new job photos here, then run: npm run photos
    gallery/residential/        gallery photos, one folder per filter
    gallery/commercial/
    gallery/new-construction/
    gallery/remodel/
    <project>/<phase>/          project photos, e.g. 1119-harvest-ave-lehigh-acres/trim-out/
  public/images/                the photos the site shows
    gallery/                    the /gallery page
    projects/<project>/<phase>/ each project page, phase by phase
    hero/                       the homepage photo
    logos/                      the logo
    team/                       team photos
    services/                   service photos
  public/videos/hero-loop.mp4   the homepage film
  src/content/                  the words on the pages
  src/content/media.json        which photo sits in each fixed spot
  src/lib/business.ts           phone, email, address, hours, license
```

The inbox originals are never uploaded. Keep your own copies.

## Add gallery photos

1. Copy the photos into the folder for their filter, for example
   `photo-inbox/gallery/remodel/`. iPhone HEIC photos are fine. Photos left
   loose in `photo-inbox/gallery/` itself are skipped.
2. Run:

   ```
   npm run photos
   ```

   Each photo is shrunk, turned upright, stripped of its hidden location data
   and saved as `public/images/gallery/remodel/remodel-1.webp` (then `-2`, and
   so on). The originals move to `photo-inbox/_done/`.
3. Open `public/images/gallery/remodel/images.json`. The command added a line
   for each new photo. Fill in the two empty quotes:

   ```json
   "remodel-1.webp": { "id": "65", "alt": "Walk-in shower with new rain head and valve trim", "title": "Shower remodel, Cape Coral", "category": "remodel" }
   ```

   `alt` says what the photo shows (read aloud to blind visitors, and used by
   Google). `title` is the caption when someone opens the photo.

New photos appear at the end of the gallery.

A small, finished JPG or WebP can also go straight into `public/images/gallery/`.
It shows under "Residential". Phone photos should go through the inbox.

## Add photos to a project

1. Copy the photos into `photo-inbox/<project>/<phase>/`, using the folder
   names already in `public/images/projects/`, for example
   `photo-inbox/ifha-community-center/trim-out/`.
2. Run `npm run photos`. They are saved as `photo-49.webp` and up, after the
   photos already there, and appear last in that phase.
3. Describe each one (`"alt"`) in that phase's `images.json`, for example
   `public/images/projects/ifha-community-center/trim-out/images.json`.

## Order, caption, hide, cover, remove

All of these are set in the `images.json` beside the photo:

```json
"photo-49.webp": {
  "alt": "Wall-hung sink and flush-valve toilet in the finished restroom",
  "caption": "Trim-out, men's restroom",
  "order": 0
}
```

| Setting | What it does |
|---|---|
| `"order": 0` | Photos with a number come first, lowest first; the rest follow by file name. To put a photo first, give it a lower number than any other. |
| `"caption"` | Shown when the photo is opened on a project page. (Gallery photos use `"title"`.) |
| `"hidden": true` | Takes the photo off every page and keeps the file. |
| `"cover": true` | The photo on the project's card on the Projects page. Use it on one photo per project. |
| `"featured": true` | Shows the photo in the "Walk the job" section of the homepage, in that phase. The two projects shown there are named in `src/content/home.ts`. |

Keep the quotes, colons and commas exactly as in the example. Every line
except the last one inside `{ }` ends with a comma.

**Remove a photo:** delete the file, then run `npm run photos:check`. If it
says a spot in `src/content/media.json` uses that photo, point that spot at
another photo (next section). `"hidden": true` takes a photo off the pages, but
anyone with its exact address can still open it; delete the file to remove it
from the internet.

## Add a phase or a new project

The words of each project live in `src/lib/constants.ts`, in the list called
`COMPLETED_PROJECT_TEXT`. Search the file for the project's folder name.

- **New phase:** copy one phase block inside that project's `phases: [ ... ]`
  and change it. The `slug` must match the photo folder name:

  ```ts
  {
    name: "Trim-Out",
    slug: "trim-out",
    description: "Fixtures, faucets and water heater set and tested.",
  },
  ```

- **New project:** copy a whole project block (from `{` to `},`) and change
  `slug` (the folder name, lowercase with dashes; it becomes
  `/projects/<slug>`), `name`, `client`, `category`, `timeline`,
  `description`, `location`, `phases`, `metaTitle` and `metaDescription`.
  Leave `cost: "On Request"`.

Then put the photos in `photo-inbox/<slug>/<phase>/` and run `npm run photos`.
Until the words are added, `npm run photos:check` says the folder "is not
published", and no page shows it.

## Replace the logo, homepage photo, team or service photos

These are fixed spots. Save the new file **with the same name in the same
folder**, replacing the old one. The site gives the picture a new address, so
nobody sees the old one from a cache.

| Spot | File | Size |
|---|---|---|
| Homepage photo | `public/images/hero/drone-construction.jpg` | landscape, 2400 x 1800 |
| Logo (header and footer) | `public/images/logos/logo-new.png` | 2048 x 2048 PNG, see-through background, emblem in the same place |
| Team photos | `public/images/team/aiden.jpg` and the others there | same shape as the one you replace |
| Family photo on the homepage | `public/images/team/sam-and-aiden.jpg` | upright, 4 wide by 5 tall (for example 1280 x 1600). It is shown whole, so nobody is cut off |
| Service photos | the file named for that service in `src/content/media.json` | same size as the one you replace |

The phone version of the homepage photo is cut automatically. After replacing
it, also update its `"alt"` under `"home.hero"` in `src/content/media.json`,
and the line under the photo (`caption` in `src/content/home.ts`).

**Use a different photo for a spot:** open `src/content/media.json`, find the
spot (for example `"service.header.tankless-water-heaters"` is the top photo of
the tankless page, and `"home.service.repiping"` the repiping card on
`/services`), and change `"image"` to another photo's path, such as
`"/images/services/project-6.jpg"`. Change its `"alt"` to match.

## Add or replace a builder logo

Builder logos show in the gliding row on the homepage and on the Builders page.

1. Save the logo in `public/images/builders/` (PNG, SVG, WebP or JPG; a
   see-through background looks best).
2. Open `src/lib/builders-data.ts`. The list at the top has one line per
   builder. Copy a line and change the name, the file name, and `logoWidth` /
   `logoHeight` to the picture's size in pixels (in Finder: Get Info).
3. If the logo is drawn in white on a see-through background, add
   `darkTile: true` to its line. It then sits on a navy tile instead of
   vanishing on white. If you forget, `npm test` stops and names the builder.

To replace a logo, save the new file under a **new name** and change the file
name in that builder's line, so nobody sees the old one from a cache.

## Replace the homepage film

1. Save the new clip over `public/videos/hero-loop.mp4` (same name). Best:
   8 to 12 seconds, `.mp4`, 1920 pixels wide, no sound, 2 to 4 MB.
2. Run `npm run video:build -- --new-clip`. It takes about two minutes and
   makes the phone and tablet copies.
3. It prints a folder of stills of the phone cut. If the subject is cut off,
   run `npm run video:build -- --portrait-center 0.40` (0 is the left edge,
   1 the right) and look again.

## Change words, phone number and hours

| What | File |
|---|---|
| Homepage headline and buttons | `src/content/home.ts` |
| Projects and Gallery page headings | `src/content/projects.ts` |
| Services pages, About, Builders, Areas | `src/content/services.ts`, `about.ts`, `builders.ts`, `areas.ts` |
| Contact, booking, quote, emergency pages | `src/content/conversion.ts` |
| Blog list, FAQ, privacy, page-not-found | `src/content/reading.ts` |
| Menu | `src/content/navigation.ts` |
| Long text of each service, area, blog post and project | `src/lib/constants.ts` |

Change only the words between the quotes. A page headline is what Google
shows, so change those rarely.

**Phone number:** in `src/lib/business.ts` change the three lines that hold
it: `PHONE_DIGITS` (ten digits), `PHONE_VANITY` (how customers read it) and
`phoneDigits`. The header, the call bar on phones, the footer, every service
page, the Google data and `/llms.txt` all follow. Then refresh the two builder
PDFs (below). Email, address and license are in the same file.

**License check:** the site says what the state's own record showed on a
named day ("current and active through August 31, 2028, record checked
November 16, 2026"). After a renewal, open the two record links in
`src/lib/claims.ts` (`LICENSE_RECORD`), then update `checkedOn`, `status` and
`activeThrough` there. The About page, the FAQ, the footer link, the Google
data and `/llms.txt` all follow.

**Hours:** in `src/lib/business.ts`, under `hours`. `open` is the line
customers read ("Open 24 hours, 7 days a week"). `schema` just below it is the
same hours as Google reads them (days, `opens`, `closes`). Change both together.

## Preview on your Mac and phone

- **While working:** `npm run dev`, then open http://localhost:3000. A photo
  you add, replace or delete shows when you refresh the page. Stop it with
  Ctrl+C.
- **Exactly as it will go live:** `npm run preview:review`. It runs every check
  and builds the whole site (about a minute), then serves it at
  http://localhost:3100 until you press Ctrl+C. On your phone, on the same Wi-Fi, open the "Network"
  address it prints, ending in `:3100`. Run it again after each change.
- **Builder PDFs** (after a phone, email or license change): while
  `preview:review` is running, in a second Terminal window run
  `npm run builders:pdf -- http://localhost:3100`.

## Publish

```
git switch -c update/trim-out-photos
git add public src
git commit -m "Add trim-out photos for 1119 Harvest Ave"
git push -u origin update/trim-out-photos
```

Open the link the push prints and create a pull request on GitHub. Vercel
builds a preview of it in a few minutes and posts the link on the pull
request. When it looks right, merge the pull request; the live site updates a
few minutes later. Everything needs this step, even a one-word change. If an
old photo still shows, reload with Cmd+Shift+R.

**Bing is told automatically.** A few minutes after each merge, GitHub runs
"Tell Bing what changed" (the Actions tab of the repository). It reads the
live pages and sends Bing the addresses of the ones whose words changed.
ChatGPT and Copilot read Bing's copy of the site, so this is what keeps their
answers current. There is nothing to run. To send one page yourself:
`npm run indexnow -- https://www.csplumbinglee.com/services/water-heaters`.
Add `--dry-run` to see what would be sent without sending it.

## What not to touch

`src/app/`, `src/components/`, `src/generated/`, `scripts/`, `tests/`,
`public/videos/hero/`, `.github/`, `package.json`, `next.config.ts`,
`vercel.json`, the one `.txt` file in `public/` with a long name of letters and
numbers (Bing checks it before it accepts a notice), and any file whose name
starts with `.env`. Do not type the phone number anywhere
except `src/lib/business.ts`. `images.json` files can be read by anyone on the
internet: no private notes in them.

## If something goes wrong

Run `npm run photos:check`. Lines marked **x** stop publishing; lines marked
**-** do not.

| Message | Fix |
|---|---|
| "still carries hidden camera data, including the GPS location" | `npm run photos:strip`, then check again. |
| "`src/content/media.json` has a typo (line 7, column 7: a comma (,) is missing...)" | Add the comma at that spot. Nothing publishes until it is fixed. |
| "the picture for "home.door.home" ... is not in public/images" | Put the photo back, or point that `"image"` at another photo. |
| "`images.json` has a typo (line 5...)" | Add the missing comma or quote at that spot. Nothing publishes until it is fixed, so the site can never go live without that folder's descriptions. |
| "is not published because no project or phase ... is named" | Add the phase or project words (above), or rename the folder. |
| "has no description (alt text) yet" | Fill in `"alt"`. |
| "larger than 1.5 MB" | It works, but put big photos through `npm run photos`. |
| "the box for the crop ... was trimmed to fit" | The new picture is a different size from the old one. Look at the page; if the framing is wrong, use a file the same size as the old one. |
| "is not the clip the current videos were made from" | Run `npm run video:build -- --new-clip`, or undo with `git checkout -- public/videos/hero-loop.mp4`. |

File names with spaces or capital letters work. Anything else: ask your
developer, and send the message you see.
