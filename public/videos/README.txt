HOMEPAGE HERO VIDEO
===================

What is in this folder

  hero-loop.mp4        The original clip. This is the only file you ever replace.
                       Nothing edits it: the build below reads it and checks,
                       before and after, that it has not changed.
  hero/                Smaller copies of that clip, one per kind of screen, made
                       by a script. Do not edit, rename or add files here by hand.
  hero/variants.json   The list of those files: size, format, checksum, and which
                       kind of screen each one is meant for.

  Without hero-loop.mp4 the homepage keeps its still photo.


Which screen is meant to get which file

  portrait-phone   hero/hero-portrait.hevc.<hash>.mp4   608 x 1080   about 0.73 MB
                   hero/hero-portrait.h264.<hash>.mp4   608 x 1080   about 1.17 MB
  up-to-1023       hero/hero-mid.hevc.<hash>.mp4        1280 x 720   about 0.90 MB
                   hero/hero-mid.h264.<hash>.mp4        1280 x 720   about 1.36 MB
  desktop          hero-loop.mp4 (the original)         1920 x 1080  about 2.27 MB

  HEVC is the smaller, newer format (iPhone, iPad, Safari, recent Chrome); H.264
  plays everywhere and is the fallback. The phone file is an upright 9:16 cut
  from the original at its full sharpness. <hash> is a fingerprint of the file's
  content, so a changed file always gets a new name and nobody is ever served a
  stale copy. variants.json has the exact names and sizes.


Replacing the clip

  1. Save the new clip over public/videos/hero-loop.mp4 (same name).
     Best: 8-12 seconds, H.264 .mp4, 1920 pixels wide, no sound track, 2-4 MB.
  2. On the Mac, in the project folder, run:

         npm run video:build -- --new-clip

     It makes the new copies, removes the old ones and rewrites variants.json.
  3. Check the phone framing. The command prints a folder of stills showing
     the upright phone cut at four moments of the clip. If the subject is cut
     off, move the cut and look again (0 = left edge, 0.5 = middle, 1 = right):

         npm run video:build -- --portrait-center 0.40

     The setting is remembered for that clip.
  4. Commit hero-loop.mp4 together with everything in hero/.

  If the command stops with "is not the clip the current videos were made
  from", the original changed without --new-clip. Either that was step 1
  (run it with --new-clip) or it was an accident (the message says how to put
  the file back).


Other commands

  npm run video:build               Builds only what is missing or out of date.
                                    Safe to run at any time; usually it reports
                                    "up to date" and changes nothing.
  npm run video:build -- --check    Checks every file against variants.json
                                    (size, checksum, starts playing before it has
                                    fully downloaded, phone size limits). Works on
                                    any computer; needs no Mac.
  npm run video:build -- --stills   Only writes the phone-framing stills.
  npm run video:build -- --force    Re-encodes everything. The pictures come out
                                    the same but the files get new names, because
                                    the encoder stamps each file it writes.

  (npm run video:build is the same as: node scripts/build-hero-video.mjs)


For developers

  Building needs a Mac. The script compiles scripts/video/herovideo.swift
  (Apple's AVFoundation and VideoToolbox; no ffmpeg, nothing downloaded) into
  .next/cache/cs-tools and drives it. Settings live at the top of
  scripts/build-hero-video.mjs: the list of copies with their sizes and limits,
  which encoder makes each, the phone crop, and the keyframe spacing. The
  reasons for each choice, with the measurements, are in the comments there.

  What every copy is: MP4 with the index first (moov before mdat), H.264 High or
  HEVC Main tagged hvc1, 8-bit BT.709, 30 frames a second, B-frames, no audio,
  keyframes where the original has them. A copy that fails any of that, runs
  over its size limit or does not match the original picture is not written.

  variants.json is a list, in the order a page should try the files (smallest
  screen first, HEVC before H.264). Each entry:

      file             site path, usable as a <source src>
      audience         "portrait-phone" | "up-to-1023" | "desktop"
      width, height    pixels
      codec            RFC 6381 string read back from the file
      type             full MIME type for <source type> / canPlayType
      bytes, sha256    of the file as committed
      durationSeconds
      cropCenterX      phone cuts only: where the 9:16 cut sits (0-1)
      recipe           fingerprint of the settings it was built with; the build
                       reuses a file whose recipe has not changed
      original         true on the untouched hero-loop.mp4 entry

  The copies as first built (Apple M5 Pro, macOS 27.2), measured against the
  original picture. H.264: the Mac's hardware encoder, variable bit rate.
  HEVC: Apple's software encoder held to one quality level for the whole clip.

      hero-portrait.hevc   734,511 bytes   PSNR 37.6 dB   SSIM 0.962
      hero-portrait.h264 1,172,526 bytes   PSNR 39.6 dB   SSIM 0.969
      hero-mid.hevc        895,579 bytes   PSNR 34.6 dB   SSIM 0.929
      hero-mid.h264      1,358,881 bytes   PSNR 35.0 dB   SSIM 0.929

  The phone cuts are hard to tell from the original. The 1280 x 720 copies are
  a little softer than it when enlarged, most in the last three seconds while
  the camera pushes in. There is no 1920-wide HEVC copy: at a clearly smaller
  size it does not look as good as the original, so desktop keeps the original.

  Preparing a new original from raw footage, if ffmpeg is at hand:
      ffmpeg -i input.mov -an -vf scale=1920:-2 -c:v libx264 -crf 28 -preset slow -movflags +faststart hero-loop.mp4
