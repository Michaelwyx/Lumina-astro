#!/bin/bash
# 用 Chrome headless 截图若干页面以核查布局。需先有 dist/ 并启动了预览服务。
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE="${1:-http://localhost:4321}"
OUT="$(dirname "$0")/shots"
mkdir -p "$OUT"
W="${W:-1440}"; H="${H:-2400}"

shoot() { # name  path
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size="$W,$H" --virtual-time-budget=4000 \
    --screenshot="$OUT/$1.png" "$BASE$2" >/dev/null 2>&1
  echo "shot $1  <- $2"
}

shoot home /
shoot start /start/
shoot coords /astronomy/foundations/celestial-coordinates/
shoot hemi /astronomy/observing/hemisphere-visibility/
shoot conditions /astronomy/observing/conditions/
shoot nebulae /astronomy/deep-sky/nebulae/
shoot stellar /astronomy/deep-sky/stellar-physics/
shoot catalog /reference/catalog/
shoot objdetail /reference/catalog/M42/
shoot observatories /reference/observatories/
shoot remote /astrophotography/remote-platforms/overview/
shoot optics /astrophotography/fundamentals/optics/
shoot snr /astrophotography/fundamentals/snr/
shoot narrowband /astrophotography/capture/narrowband/
shoot learningpaths /reference/learning-paths/
echo "done -> $OUT"
