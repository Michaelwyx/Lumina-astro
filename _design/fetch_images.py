#!/usr/bin/env python3
"""解析 Wikimedia Commons 文件标题 -> 缩略图 URL,下载到 src/assets/images/,并抓取署名/许可。"""
import json, os, sys, urllib.parse, urllib.request, html, re

UA = "AstroWikiBuilder/1.0 (wangyixu21@gmail.com)"
OUT = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "images")
os.makedirs(OUT, exist_ok=True)

# key -> Commons File 标题(不含 "File:")。多个候选用列表,取第一个解析成功的。
WANT = {
    # —— 深空天体 ——
    "m42-orion":      ["Orion Nebula - Hubble 2006 mosaic 18000.jpg"],
    "m31-andromeda":  ["Andromeda Galaxy (with h-alpha).jpg"],
    "m45-pleiades":   ["Pleiades large.jpg"],
    "m13-hercules":   ["Messier 13.jpg", "A Swarm of Ancient Stars - GPN-2000-000930.jpg"],
    "m51-whirlpool":  ["Messier51 sRGB.jpg"],
    "m57-ring":       ["M57 The Ring Nebula.JPG"],
    "m8-lagoon":      ["Lagoon Nebula.jpg", "VST images the Lagoon Nebula.jpg"],
    "m104-sombrero":  ["M104 ngc4594 sombrero galaxy hi-res.jpg"],
    "ngc7000-namerica":["NorthAmericaNebula 9-04-2020.jpg", "Caldwell 20.jpg"],
    "carina":         ["Carina Nebula by ESO.jpg", "Eta Carinae Nebula 1.jpg"],
    "omega-cen":      ["Omega Centauri by ESO.jpg"],
    "47tuc":          ["47 Tucanae by ESO.jpg", "NGC 104 Hubble WikiSky.jpg"],
    "lmc":            ["Large Magellanic Cloud.jpg", "VST image of the Large Magellanic Cloud.jpg"],
    "horsehead":      ["The Horsehead Nebula.jpg", "Barnard 33.jpg"],
    "eagle-pillars":  ["Pillars of Creation.jpg", "Eagle Nebula from ESO.jpg"],
    # —— 太阳系 ——
    "sun":            ["The Sun by the Atmospheric Imaging Assembly of NASA's Solar Dynamics Observatory - 20100819.jpg", "Sun920607.jpg"],
    "moon":           ["FullMoon2010.jpg"],
    "saturn":         ["Saturn during Equinox.jpg"],
    "jupiter":        ["Jupiter and its shrunken Great Red Spot.jpg", "Jupiter by Cassini-Huygens.jpg"],
    # —— 观测 / 场景 / 天文台 ——
    "milkyway":       ["The Milky Way panorama.jpg", "Milky Way Arch.jpg"],
    "vlt":            ["Paranal platform.jpg", "The Very Large Telescope.jpg", "VLT - the Very Large Telescope.jpg"],
    "alma":           ["ALMA antennas on the Chajnantor plateau.jpg", "The ALMA Array.jpg"],
    "startrails":     ["Star Trails over the ESO 3.6-metre telescope.jpg", "Startrails ESO.jpg"],
    "lasergstar":     ["Laser Towards Milky Ways Centre.jpg", "A Laser Beam Towards the Milky Way’s Centre.jpg"],
}

def api_resolve(titles):
    """批量解析 File: 标题 -> {title: (thumburl, artist, license)}"""
    out = {}
    base = "https://commons.wikimedia.org/w/api.php"
    # 一次最多 50
    for i in range(0, len(titles), 40):
        chunk = titles[i:i+40]
        params = {
            "action": "query", "format": "json",
            "prop": "imageinfo",
            "iiprop": "url|extmetadata",
            "iiurlwidth": "1280",
            "titles": "|".join("File:" + t for t in chunk),
        }
        url = base + "?" + urllib.parse.urlencode(params)
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        data = json.load(urllib.request.urlopen(req, timeout=40))
        pages = data.get("query", {}).get("pages", {})
        # normalize 处理标题大小写/空格
        norm = {}
        for n in data.get("query", {}).get("normalized", []):
            norm[n["to"]] = n["from"]
        for pid, page in pages.items():
            title = page.get("title", "")
            if "missing" in page or "imageinfo" not in page:
                continue
            ii = page["imageinfo"][0]
            meta = ii.get("extmetadata", {})
            artist = meta.get("Artist", {}).get("value", "")
            artist = re.sub("<[^>]+>", "", html.unescape(artist)).strip()
            lic = meta.get("LicenseShortName", {}).get("value", "")
            lic = re.sub("<[^>]+>", "", html.unescape(lic)).strip()
            srctitle = norm.get(title, title)[5:]  # strip "File:"
            out[srctitle] = (ii.get("thumburl") or ii.get("url"), artist, lic)
            out[title[5:]] = out[srctitle]
    return out

# 收集所有候选标题
all_titles = []
for cands in WANT.values():
    all_titles += cands
resolved = api_resolve(all_titles)

report = {}
for key, cands in WANT.items():
    picked = None
    for t in cands:
        if t in resolved and resolved[t][0]:
            picked = (t, *resolved[t]); break
    if not picked:
        report[key] = {"ok": False, "tried": cands}
        print(f"[MISS] {key}: none of {cands}")
        continue
    title, thumburl, artist, lic = picked
    dest = os.path.join(OUT, key + ".jpg")
    try:
        req = urllib.request.Request(thumburl, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as f:
            f.write(r.read())
        size = os.path.getsize(dest)
        report[key] = {"ok": True, "title": title, "artist": artist, "license": lic, "bytes": size}
        print(f"[ OK ] {key:16s} {size//1024:5d}KB  {lic:14s} | {artist[:48]} | {title}")
    except Exception as e:
        report[key] = {"ok": False, "error": str(e), "title": title}
        print(f"[FAIL] {key}: {e}")

with open(os.path.join(OUT, "_credits.json"), "w") as f:
    json.dump(report, f, ensure_ascii=False, indent=2)
print("\n== done ==", sum(1 for r in report.values() if r.get("ok")), "/", len(WANT))
