#!/usr/bin/env python3
"""按搜索词从 Wikimedia Commons 取权威示意图/照片,下载到 src/assets/images/ 并记录署名。
用法:编辑 SETS(key -> 搜索词 / 候选标题),运行即可。SVG 会按宽度渲染成 PNG。"""
import json, os, re, html, sys, urllib.parse, urllib.request

UA = "AstroWikiBuilder/1.0 (wangyixu21@gmail.com)"
OUT = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "images")
API = "https://commons.wikimedia.org/w/api.php"
os.makedirs(OUT, exist_ok=True)

# key -> {"search": "...", "prefer": "svg|photo|any", "titles":[可选精确标题]}
SETS = {
  # 天文基础
  "fig-equatorial":   {"titles":["Ra and dec on celestial sphere.png"], "search":"equatorial coordinate system right ascension declination celestial sphere diagram"},
  "fig-altaz":        {"titles":["Azimuth-Altitude schematic.svg"], "search":"horizontal coordinate system altitude azimuth diagram"},
  "fig-ecliptic":     {"search":"ecliptic plane celestial equator obliquity diagram"},
  "fig-analemma":     {"search":"analemma sun position equation of time photograph"},
  "fig-sidereal-day": {"titles":["Sidereal day (prograde).svg","Sidereal time 01.png"], "search":"sidereal day solar day diagram earth rotation"},
  "fig-precession":   {"titles":["Earth precession.svg"], "search":"axial precession earth diagram"},
  "fig-retrograde":   {"titles":["Apparent retrograde motion.svg","Retrograde Motion.svg"], "search":"apparent retrograde motion mars diagram"},
  "fig-orion-chart":  {"titles":["Orion IAU.svg"], "search":"Orion constellation IAU star chart map"},
  "fig-magnitude":    {"search":"apparent magnitude scale chart astronomy brightness"},
  "fig-parallax":     {"titles":["Stellarparallax parsec1.svg","Parallax Example.svg"], "search":"stellar parallax diagram parsec"},
}

def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=45)

def imageinfo(title, width=1200):
    p = {"action":"query","format":"json","prop":"imageinfo","iiprop":"url|extmetadata|mime",
         "iiurlwidth":str(width),"titles":title if title.startswith("File:") else "File:"+title}
    data = json.load(get(API+"?"+urllib.parse.urlencode(p)))
    for _, page in data.get("query",{}).get("pages",{}).items():
        if "imageinfo" not in page: return None
        ii = page["imageinfo"][0]
        if ii.get("mime") not in ("image/jpeg","image/png","image/svg+xml"): return None
        meta = ii.get("extmetadata",{})
        artist = re.sub("<[^>]+>","",html.unescape(meta.get("Artist",{}).get("value",""))).strip()
        lic = re.sub("<[^>]+>","",html.unescape(meta.get("LicenseShortName",{}).get("value",""))).strip()
        return (ii.get("thumburl") or ii.get("url"), artist, lic, page.get("title",title))
    return None

def search_titles(term, n=8):
    p = {"action":"query","format":"json","list":"search","srsearch":term,"srnamespace":"6","srlimit":str(n)}
    data = json.load(get(API+"?"+urllib.parse.urlencode(p)))
    return [h["title"] for h in data.get("query",{}).get("search",[])]

cred_path = os.path.join(OUT,"_credits.json")
credits = json.load(open(cred_path)) if os.path.exists(cred_path) else {}

only = sys.argv[1:] or list(SETS.keys())
for key in only:
    spec = SETS[key]
    chosen = None
    for t in spec.get("titles",[]):
        info = imageinfo(t)
        if info and info[0]: chosen = info; break
    if not chosen:
        for t in search_titles(spec.get("search","")):
            info = imageinfo(t)
            if info and info[0]: chosen = info; break
    if not chosen:
        print(f"[MISS] {key}: {spec.get('search','')[:50]}"); continue
    thumburl, artist, lic, title = chosen
    dest = os.path.join(OUT, key+".png")  # 统一 png(svg 已渲染为 png)
    if thumburl.lower().split("?")[0].endswith(".jpg"): dest = os.path.join(OUT, key+".jpg")
    with get(thumburl) as r, open(dest,"wb") as f: f.write(r.read())
    size = os.path.getsize(dest)
    credits[key] = {"ok":True,"title":title[5:] if title.startswith("File:") else title,"artist":artist,"license":lic,"bytes":size}
    print(f"[ OK ] {key:18s} {size//1024:5d}KB  {lic:14s} | {artist[:40]} | {title[5:] if title.startswith('File:') else title}")

json.dump(credits, open(cred_path,"w"), ensure_ascii=False, indent=2)
print("done")
