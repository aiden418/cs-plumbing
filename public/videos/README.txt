Drop the hero drone loop here as hero-loop.mp4
- 8-12s, muted loop, ~2-4MB (H.264, 1920px wide, no audio track)
- ffmpeg example: ffmpeg -i input.mov -an -vf scale=1920:-2 -c:v libx264 -crf 28 -preset slow -movflags +faststart hero-loop.mp4
Until the file exists the homepage silently keeps the static hero image.
