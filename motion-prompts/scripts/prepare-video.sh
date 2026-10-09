#!/usr/bin/env bash
# Compresse une vidéo source en 720p (~1 Mo / 15 s) et crée son image d'aperçu.
# Usage : scripts/prepare-video.sh <video-source.mp4> <slug>
set -euo pipefail
src="$1"; slug="$2"
dir="$(cd "$(dirname "$0")/.." && pwd)/site"
ffmpeg -y -v error -i "$src" -vf "scale=-2:720,fps=30" -c:v libx264 -preset slow -crf 27 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k "$dir/videos/$slug.mp4"
ffmpeg -y -v error -ss 3 -i "$src" -frames:v 1 -vf "scale=-2:480" -q:v 4 "$dir/posters/$slug.jpg"
ls -lh "$dir/videos/$slug.mp4" "$dir/posters/$slug.jpg"
