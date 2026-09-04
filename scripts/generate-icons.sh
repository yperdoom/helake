#!/usr/bin/env sh
# Gera os PNGs do manifest e do apple-touch-icon a partir dos SVGs versionados.
# Os PNGs são commitados, então só rode isto ao trocar o ícone.
#
# Duas variantes de propósito:
#   icon.svg        cantos arredondados  -> manifest (Android/Chrome)
#   icon-square.svg full-bleed quadrado  -> apple-touch-icon (o iOS aplica a própria máscara;
#                                          canto transparente viraria canto preto)
#                                       -> icone maskable do Android, que tambem recorta
#
# Requer rsvg-convert (librsvg) ou magick (ImageMagick).
set -eu

cd "$(dirname "$0")/../public/icons"

render() {
  if command -v rsvg-convert >/dev/null 2>&1; then
    rsvg-convert -w "$2" -h "$2" "$1" -o "$3"
  elif command -v magick >/dev/null 2>&1; then
    magick -background none "$1" -resize "$2x$2" "$3"
  else
    echo "error: instale librsvg (rsvg-convert) ou ImageMagick (magick)" >&2
    exit 1
  fi
}

render icon.svg 192 icon-192.png
render icon.svg 512 icon-512.png
render icon-square.svg 180 apple-touch-icon.png
render icon-square.svg 512 icon-maskable-512.png

echo "ícones gerados em public/icons"
