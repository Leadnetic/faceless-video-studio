#!/bin/bash
# Export + loudness + platform checks + SRT + cover for finished raw renders.
cd "$(dirname "$0")/.."
S=$(ls -d /root/.claude/plugins/cache/ffmpeg-skill/ffmpeg-skill/* | head -1)/scripts
for k in "$@"; do
  python3 $S/export.py renders/raw-$k.mp4 --preset tiktok --crf 18 -o renders/exp-$k.mp4 --overwrite >/dev/null
  python3 $S/loudness.py renders/exp-$k.mp4 -I -14 -o output/psychology-video-$k.mp4 --overwrite >/dev/null
  for p in tiktok reels shorts; do echo "[$k $p]"; python3 $S/check.py output/psychology-video-$k.mp4 --platform $p 2>&1 | grep -iE "fail|warn|pass|ok" | head -4; done
  python3 tools/make_srt.py $k
  ffmpeg -y -loglevel error -i output/psychology-video-$k.mp4 -i output/psychology-video-$k.en.srt -map 0 -map 1 -c copy -c:s mov_text -metadata:s:s:0 language=eng -movflags +faststart renders/sub-$k.mp4 && cp renders/sub-$k.mp4 output/psychology-video-$k.mp4
  ffmpeg -y -loglevel error -ss 1.2 -i output/psychology-video-$k.mp4 -frames:v 1 -q:v 2 output/cover-$k.jpg
done
