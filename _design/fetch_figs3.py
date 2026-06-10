#!/usr/bin/env python3
"""第三批:常见深空天体 + 著名恒星 的公共版权图。合并进 src/data/credits.json。"""
import json, os, re, html, urllib.parse, urllib.request

UA = "AstroWikiBuilder/1.0 (wangyixu21@gmail.com)"
IMG = "src/assets/images"; CRED = "src/data/credits.json"
API = "https://commons.wikimedia.org/w/api.php"

SETS = {
  # 常见深空天体(梅西耶/NGC)
  "m27-dumbbell":   {"titles":["M27 - Dumbbell Nebula.jpg","Messier 27.jpg"], "search":"Dumbbell Nebula Messier 27 Hubble"},
  "m1-crab":        {"titles":["Crab Nebula.jpg"], "search":"Crab Nebula Messier 1 Hubble"},
  "m33-triangulum": {"titles":["VST snaps a very detailed view of the Triangulum Galaxy.jpg"], "search":"Triangulum Galaxy Messier 33"},
  "m81-bode":       {"titles":["Messier 81 HST.jpg"], "search":"Bode Galaxy Messier 81 Hubble"},
  "m82-cigar":      {"titles":["M82 HST ACS 2006-14-a-large web.jpg"], "search":"Cigar Galaxy Messier 82 Hubble"},
  "m101-pinwheel":  {"titles":["M101 hires STScI-PRC2006-10a.jpg"], "search":"Pinwheel Galaxy Messier 101 Hubble"},
  "m20-trifid":     {"titles":["Trifid.Nebula.full.jpg"], "search":"Trifid Nebula Messier 20"},
  "m64-blackeye":   {"titles":["Messier 64 Hubble.jpg"], "search":"Black Eye Galaxy Messier 64 Hubble"},
  "rosette":        {"titles":["Rosette Nebula.jpg","NGC 2237.jpg"], "search":"Rosette Nebula NGC 2237"},
  "veil":           {"titles":["Veil Nebula - NGC6960.jpg"], "search":"Veil Nebula NGC 6960 Hubble"},
  "heart-nebula":   {"titles":["Heart Nebula.jpg","IC 1805.jpg"], "search":"Heart Nebula IC 1805"},
  "helix":          {"titles":["NGC7293 (2004).jpg"], "search":"Helix Nebula NGC 7293 Hubble"},
  "rho-ophiuchi":   {"titles":["Rho Ophiuchi.jpg"], "search":"Rho Ophiuchi cloud complex Antares"},
  "flame-nebula":   {"titles":["Flame Nebula.jpg","NGC 2024.jpg"], "search":"Flame Nebula NGC 2024"},
  "leo-triplet":    {"titles":["Leo Triplet.jpg"], "search":"Leo Triplet galaxies M65 M66 NGC 3628"},
  # 著名恒星 / 相关图
  "betelgeuse":     {"titles":["Betelgeuse captured by the SPHERE instrument.jpg"], "search":"Betelgeuse red supergiant surface SPHERE"},
  "sirius":         {"titles":["Sirius A and B Hubble photo.jpg","Sirius A and B artwork.jpg"], "search":"Sirius A B Hubble white dwarf"},
  "star-sizes":     {"titles":["Star-sizes.jpg","Comparison of the size of the planets with the stars.jpg"], "search":"star size comparison sun giants"},
  "albireo":        {"titles":["Albireo couple.jpg","Albireo.jpg"], "search":"Albireo double star Cygnus"},
}

def get(u): return urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=50)
def imageinfo(title, width=1200):
    t = title if title.startswith("File:") else "File:"+title
    d = json.load(get(API+"?"+urllib.parse.urlencode({"action":"query","format":"json","prop":"imageinfo","iiprop":"url|extmetadata|mime","iiurlwidth":str(width),"titles":t})))
    for _, pg in d.get("query",{}).get("pages",{}).items():
        if "imageinfo" not in pg: return None
        ii = pg["imageinfo"][0]
        if ii.get("mime") not in ("image/jpeg","image/png"): return None
        m = ii.get("extmetadata",{})
        a = re.sub("<[^>]+>","",html.unescape(m.get("Artist",{}).get("value",""))).strip()
        l = re.sub("<[^>]+>","",html.unescape(m.get("LicenseShortName",{}).get("value",""))).strip()
        return (ii.get("thumburl") or ii.get("url"), a, l, pg.get("title",t))
    return None
def search(term, n=8):
    return [h["title"] for h in json.load(get(API+"?"+urllib.parse.urlencode({"action":"query","format":"json","list":"search","srsearch":term,"srnamespace":"6","srlimit":str(n)}))).get("query",{}).get("search",[])]

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
    dest = os.path.join(IMG, key + (".png" if url.lower().split("?")[0].endswith(".png") else ".jpg"))
    with get(url) as r, open(dest, "wb") as f: f.write(r.read())
    sz = os.path.getsize(dest)
    cred[key] = {"ok": True, "title": title[5:], "artist": a, "license": l, "bytes": sz}
    print(f"[ OK ] {key:16s} {sz//1024:5d}KB  {l:14s} | {a[:34]} | {title[5:]}")

json.dump(cred, open(CRED, "w"), ensure_ascii=False, indent=2)
print("total keys:", len(cred))
