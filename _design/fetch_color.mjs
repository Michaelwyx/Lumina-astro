// 为指定 key 抓"彩色"版本:下载候选图,用 sharp 算饱和度,保留首个明显彩色(sat≥0.18)的。
import sharp from 'sharp';
import { writeFileSync, readFileSync } from 'node:fs';

const UA = 'AstroWikiBuilder/1.0 (wangyixu21@gmail.com)';
const IMG = 'src/assets/images';
const CRED = 'src/data/credits.json';
const API = 'https://commons.wikimedia.org/w/api.php';

const JOBS = {
  'heart-nebula': 'Heart Nebula color',
  'rosette': 'Rosette Nebula color',
  'leo-triplet': 'Leo Triplet color',
};

async function api(params) {
  const url = API + '?' + new URLSearchParams(params).toString();
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  return r.json();
}
async function search(term, n = 14) {
  const d = await api({ action: 'query', format: 'json', list: 'search', srsearch: term, srnamespace: '6', srlimit: String(n) });
  return (d.query?.search || []).map((h) => h.title);
}
async function info(title, width = 1200) {
  const d = await api({ action: 'query', format: 'json', prop: 'imageinfo', iiprop: 'url|extmetadata|mime', iiurlwidth: String(width), titles: title });
  const pages = d.query?.pages || {};
  for (const k in pages) {
    const ii = pages[k].imageinfo?.[0];
    if (!ii || !['image/jpeg', 'image/png'].includes(ii.mime)) return null;
    const m = ii.extmetadata || {};
    const strip = (v) => (v ? v.value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '');
    let artist = strip(m.Artist).split(/Acknowledge|Image processing/i)[0].trim();
    if (artist.length > 90) artist = artist.slice(0, 88).replace(/\s+\S*$/, '') + '…';
    return { url: ii.thumburl || ii.url, artist, license: strip(m.LicenseShortName), title: (pages[k].title || title).slice(5) };
  }
  return null;
}
async function satOf(buf) {
  const { data } = await sharp(buf).resize(64, 64, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let s = 0; const n = data.length / 3;
  for (let i = 0; i < data.length; i += 3) { const mx = Math.max(data[i], data[i + 1], data[i + 2]), mn = Math.min(data[i], data[i + 1], data[i + 2]); s += mx ? (mx - mn) / mx : 0; }
  return s / n;
}

const cred = JSON.parse(readFileSync(CRED, 'utf8'));
for (const [key, term] of Object.entries(JOBS)) {
  const cands = [];
  for (const title of await search(term)) {
    const meta = await info(title);
    if (!meta?.url) continue;
    try {
      const buf = Buffer.from(await (await fetch(meta.url, { headers: { 'User-Agent': UA } })).arrayBuffer());
      if (buf.length < 40000) continue;
      const sat = await satOf(buf);
      cands.push({ sat, buf, meta });
      console.log(`   ${key}: ${(sat * 100).toFixed(0)}%  ${meta.title}`);
    } catch (e) { /* skip */ }
  }
  cands.sort((a, b) => b.sat - a.sat);
  const best = cands[0];
  if (best && best.sat >= 0.15) {
    const ext = best.meta.url.toLowerCase().split('?')[0].endsWith('.png') ? '.png' : '.jpg';
    writeFileSync(`${IMG}/${key}${ext}`, best.buf);
    cred[key] = { ok: true, title: best.meta.title, artist: best.meta.artist, license: best.meta.license };
    console.log(`[ OK ] ${key.padEnd(14)} sat ${(best.sat * 100).toFixed(0)}%  ${best.meta.license} | ${best.meta.artist.slice(0, 30)} | ${best.meta.title}`);
  } else {
    console.log(`[MISS] ${key} — 最高饱和仅 ${best ? (best.sat * 100).toFixed(0) + '%' : 'N/A'}`);
  }
}
writeFileSync(CRED, JSON.stringify(cred, null, 2));
console.log('done');
