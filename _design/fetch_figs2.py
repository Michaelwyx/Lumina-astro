#!/usr/bin/env python3
"""第二批示意图:覆盖太阳系/深空/宇宙学/观测/摄影。直接合并进 src/data/credits.json。"""
import json, os, re, html, urllib.parse, urllib.request

UA = "AstroWikiBuilder/1.0 (wangyixu21@gmail.com)"
IMG = "src/assets/images"
CRED = "src/data/credits.json"
API = "https://commons.wikimedia.org/w/api.php"

SETS = {
  # 太阳系
  "fig-sun-structure":  {"titles":["Sun poster.svg","Anatomy of the Sun.jpg"], "search":"sun internal structure layers core photosphere corona diagram"},
  "fig-sunspot-cycle":  {"titles":["Sunspot Numbers.png","Solar-cycle-data.png"], "search":"sunspot butterfly diagram solar cycle"},
  "fig-moon-phases":    {"titles":["Moon phases en.png","Lunar phase.svg"], "search":"moon phases diagram lunar phase sun earth"},
  "fig-comet-structure":{"titles":["Cometorbit01.svg"], "search":"comet structure nucleus coma ion dust tail diagram"},
  "fig-meteor-radiant": {"search":"meteor shower radiant perspective diagram"},
  "fig-solar-system":   {"titles":["Planets2013.svg"], "search":"solar system planets size comparison"},
  # 深空
  "fig-hr-real":        {"titles":["HRDiagram.png","Hertzsprung-Russel StarData.png"], "search":"Hertzsprung Russell diagram observational stars"},
  "fig-stellar-evolution":{"search":"stellar evolution tracks mass life cycle diagram"},
  "fig-tuning-fork":    {"titles":["Hubble - de Vaucouleurs Galaxy Morphology Diagram.png","HubbleTuningFork.jpg"], "search":"Hubble tuning fork galaxy morphology classification"},
  "fig-eclipsing-binary":{"titles":["Eclipsing binary star animation 3.gif"], "search":"eclipsing binary light curve diagram"},
  # 宇宙学
  "fig-cmb":            {"titles":["Ilc 9yr moll4096.png","WMAP 2012.png"], "search":"cosmic microwave background map Planck WMAP"},
  "fig-hubble-law":     {"search":"Hubble law redshift recession velocity distance diagram"},
  "fig-cosmic-timeline":{"titles":["CMB Timeline300 no WMAP.jpg"], "search":"history of the universe big bang timeline diagram"},
  # 观测
  "fig-extinction":     {"search":"atmospheric extinction airmass altitude diagram astronomy"},
  # 摄影基础
  "fig-telescopes":     {"titles":["Newtonian telescope2.svg","Schmidt-Cassegrain-Telescope.svg"], "search":"telescope optical design refractor reflector cassegrain diagram"},
  "fig-bayer":          {"titles":["Bayer pattern on sensor.svg","Bayer pattern.svg"], "search":"Bayer filter mosaic color sensor diagram"},
  "fig-emission-lines": {"search":"hydrogen alpha OIII SII narrowband emission line nebula filter"},
}

def get(u): return urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=45)

def imageinfo(title, width=1200):
    t = title if title.startswith("File:") else "File:"+title
    p = {"action":"query","format":"json","prop":"imageinfo","iiprop":"url|extmetadata|mime","iiurlwidth":str(width),"titles":t}
    d = json.load(get(API+"?"+urllib.parse.urlencode(p)))
    for _, pg in d.get("query",{}).get("pages",{}).items():
        if "imageinfo" not in pg: return None
        ii = pg["imageinfo"][0]
        if ii.get("mime") not in ("image/jpeg","image/png","image/svg+xml"): return None
        m = ii.get("extmetadata",{})
        a = re.sub("<[^>]+>","",html.unescape(m.get("Artist",{}).get("value",""))).strip()
        l = re.sub("<[^>]+>","",html.unescape(m.get("LicenseShortName",{}).get("value",""))).strip()
        return (ii.get("thumburl") or ii.get("url"), a, l, pg.get("title",t))
    return None

def search(term, n=8):
    p = {"action":"query","format":"json","list":"search","srsearch":term,"srnamespace":"6","srlimit":str(n)}
    return [h["title"] for h in json.load(get(API+"?"+urllib.parse.urlencode(p))).get("query",{}).get("search",[])]

cred = json.load(open(CRED))
for key, spec in SETS.items():
    chosen = None
    for t in spec.get("titles", []):
        i = imageinfo(t)
        if i and i[0]: chosen = i; break
    if not chosen:
        for t in search(spec.get("search","")):
            i = imageinfo(t)
            if i and i[0]: chosen = i; break
    if not chosen:
        print(f"[MISS] {key}"); continue
    url, a, l, title = chosen
    dest = os.path.join(IMG, key + (".jpg" if url.lower().split("?")[0].endswith(".jpg") else ".png"))
    with get(url) as r, open(dest, "wb") as f: f.write(r.read())
    sz = os.path.getsize(dest)
    cred[key] = {"ok": True, "title": title[5:], "artist": a, "license": l, "bytes": sz}
    print(f"[ OK ] {key:20s} {sz//1024:5d}KB  {l:14s} | {a[:34]} | {title[5:]}")

json.dump(cred, open(CRED, "w"), ensure_ascii=False, indent=2)
print("merged ->", CRED, "| total keys:", len(cred))
