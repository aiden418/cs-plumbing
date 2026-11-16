# C&S Plumbing of Lee website

The source of https://www.csplumbinglee.com: a Next.js (App Router) site with
Tailwind CSS, deployed on Vercel.

**Updating photos, words, the phone number or the homepage film:** read
[HOW-TO-UPDATE.md](HOW-TO-UPDATE.md). It is written for the owner and needs no
page code.

## Where things live

| Path | What |
|---|---|
| `public/images/` | Every published picture. Gallery and project photos are found by folder; each folder may have an `images.json` with alt text, captions, order, `hidden` and `cover`. |
| `photo-inbox/` | Drop raw photos here and run `npm run photos` (see `photo-inbox/README.md`). Originals are git-ignored. |
| `src/content/` | Page wording (`*.ts`) and the fixed picture positions (`media.json`). |
| `src/lib/business.ts` | Phone, email, address, hours and license, typed once. |
| `src/lib/constants.ts` | Services, areas, blog posts and the project text (`COMPLETED_PROJECT_TEXT`). |
| `src/generated/` | Image manifest, written by `npm run images:manifest`. Git-ignored. |
| `docs/` | Internal notes: forms and site photos (`forms-and-photos.md`), content claims, builder documents. |

## Commands

```
npm run dev              # local site at http://localhost:3000, with the photo watcher
npm run preview:review   # production build with tags off, served at http://localhost:3100
npm run build            # production build; prebuild runs the image manifest,
                         # the content-claims check and the image gate
npm run photos           # ingest photo-inbox/ (resize, strip GPS, WebP), then the manifest
npm run photos:check     # broken picture references, leftover camera data, missing alt text
npm run video:build      # rebuild the hero film copies (macOS); --check verifies them
npm run builders:pdf -- http://localhost:3100   # regenerate the builder PDFs from a running site
npm test                 # node:test suite
npm run lint
npm run check:claims
npm run check:legacy
```

`src/generated/` must exist before TypeScript, the tests or a build can run;
`npm install`, `npm run dev`, `npm test` and `npm run build` all write it
first. On a fresh clone without those, run `npm run images:manifest`.
