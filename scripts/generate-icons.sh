#!/usr/bin/env sh
# Generates the manifest and apple-touch-icon PNGs from the versioned SVGs.
# The PNGs are committed, so only run this when changing the icon.
#
# Two variants, by purpose:
#   icon.svg        rounded corners  -> manifest (Android/Chrome)
#   icon-square.svg full-bleed square -> apple-touch-icon (iOS applies its own mask, so a
#                                        transparent corner would render as a dark corner)
#                                     -> Android maskable icon, which also crops
#
# Requires rsvg-convert (librsvg) or magick (ImageMagick).
set -eu

cd "$(dirname "$0")/../public/icons"

render() {
  if command -v rsvg-convert >/dev/null 2>&1; then
    rsvg-convert -w "$2" -h "$2" "$1" -o "$3"
  elif command -v magick >/dev/null 2>&1; then
    magick -background none "$1" -resize "$2x$2" "$3"
  else
    echo "error: install librsvg (rsvg-convert) or ImageMagick (magick)" >&2
    exit 1
  fi
}

render icon.svg 192 icon-192.png
render icon.svg 512 icon-512.png
render icon-square.svg 180 apple-touch-icon.png
render icon-square.svg 512 icon-maskable-512.png

echo "icons generated in public/icons"
