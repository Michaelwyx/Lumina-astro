#!/usr/bin/env python3
"""用 Commons 搜索接口为指定 key 找图(取 srsearch 命中里第一张合规缩略图)。"""
import json, os, re, html, urllib.parse, urllib.request

UA = "AstroWikiBuilder/1.0 (wangyixu21@gmail.com)"
OUT = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "images")
API = "https://commons.wikimedia.org/w/api.php"

# key -> 搜索词(限定 namespace 6 文件)
SEARCH = {
    "ngc7000-namerica": 'North America Nebula NGC 7000',
    "alma":             'ALMA antennas Chajnantor plateau ESO',
    "startrails":       'star trails La Silla ESO telescope',
    "saturn":           'Saturn Cassini natural color full disk',
}

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    return urllib.request.urlopen(req, timeout=40)

def search_titles(term, n=8):
    p = {"action": "query", "format": "json", "list": "search",
         "srsearch": term, "srnamespace": "6", "srlimit": str(n)}
    data = json.load(get(API + "?" + urllib.parse.urlencode(p)))
    return [h["title"] for h in data.get("query", {}).get("search", [])]

def imageinfo(title):
    p = {"action": "query", "format": "json", "prop": "imageinfo",
         "iiprop": "url|extmetadata|mime|size", "iiurlwidth": "1280", "titles": title}
    data = json.load(get(API + "?" + urllib.parse.urlencode(p)))
    pages = data.get("query", {}).get("pages", {})
    for _, page in pages.items():
        if "imageinfo" not in page:
            return None
        ii = page["imageinfo"][0]
        if ii.get("mime") not in ("image/jpeg", "image/png"):
            return None
        meta = ii.get("extmetadata", {})
        artist = re.sub("<[^>]+>", "", html.unescape(meta.get("Artist", {}).get("value", ""))).strip()
        lic = re.sub("<[^>]+>", "", html.unescape(meta.get("LicenseShortName", {}).get("value", ""))).strip()
        return (ii.get("thumburl") or ii.get("url"), artist, lic, title)
    return None

# 载入已有 credits 以合并
cred_path = os.path.join(OUT, "_credits.json")
credits = json.load(open(cred_path)) if os.path.exists(cred_path) else {}

for key, term in SEARCH.items():
    chosen = None
    for t in search_titles(term):
        info = imageinfo(t)
        if info and info[0]:
            chosen = info; break
    if not chosen:
        print(f"[MISS] {key}: search '{term}' found nothing usable"); continue
    thumburl, artist, lic, title = chosen
    dest = os.path.join(OUT, key + ".jpg")
    with get(thumburl) as r, open(dest, "wb") as f:
        f.write(r.read())
    size = os.path.getsize(dest)
    credits[key] = {"ok": True, "title": title[5:], "artist": artist, "license": lic, "bytes": size}
    print(f"[ OK ] {key:16s} {size//1024:5d}KB  {lic:14s} | {artist[:46]} | {title[5:]}")

json.dump(credits, open(cred_path, "w"), ensure_ascii=False, indent=2)
print("done")
