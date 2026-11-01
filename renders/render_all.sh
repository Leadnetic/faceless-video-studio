#!/bin/bash
# Render the noir episodes one after another (concurrency 2 each; CPU-bound).
cd "$(dirname "$0")/.."
for k in "$@"; do
  npx remotion render src/index.ts Episode$k renders/raw-$k.mp4 --codec=h264 --crf=16 --audio-bitrate=256k --log=error > renders/log-$k.txt 2>&1
  echo "done $k exit $?"
done
