// 读取新增目标(_more_*.json),抓彩色图,把拿到好图且未重复的【追加】到 objects.yaml(含中英介绍)。
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const UA = 'AstroWikiBuilder/1.0 (wangyixu21@gmail.com)';
const IMG = 'src/assets/images';
const CRED = 'src/data/credits.json';
const API = 'https://commons.wikimedia.org/w/api.php';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function jget(url) { for (let i = 0; i < 6; i++) { try { const r = await fetch(url, { headers: { 'User-Agent': UA } }); if (r.ok) return await r.json(); } catch (e) {} await sleep(900); } return null; }
async function bget(url) { const r = await fetch(url, { headers: { 'User-Agent': UA } }); if (!r.ok) throw new Error('http'); return Buffer.from(await r.arrayBuffer()); }
async function search(term, n = 8) { const d = await jget(API + '?' + new URLSearchParams({ action: 'query', format: 'json', list: 'search', srsearch: term, srnamespace: '6', srlimit: String(n) })); return (d?.query?.search || []).map((h) => h.title); }
async function info(title, width) {
  const d = await jget(API + '?' + new URLSearchParams({ action: 'query', format: 'json', prop: 'imageinfo', iiprop: 'url|extmetadata|mime', iiurlwidth: String(width), titles: title }));
  for (const k in (d?.query?.pages || {})) {
    const ii = d.query.pages[k].imageinfo?.[0];
    if (!ii || !['image/jpeg', 'image/png'].includes(ii.mime)) return null;
    const m = ii.extmetadata || {}; const strip = (v) => (v ? v.value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '');
    let a = strip(m.Artist).split(/Acknowledge|Image processing|Credit:|Image:/i).filter(Boolean)[0] || 'Wikimedia Commons';
    if (a.length > 80) a = a.slice(0, 78).replace(/\s+\S*$/, '') + '…';
    return { url: ii.thumburl || ii.url, artist: a, license: strip(m.LicenseShortName) };
  }
  return null;
}
async function sat(buf) { const { data } = await sharp(buf).resize(48, 48, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true }); let s = 0; for (let i = 0; i < data.length; i += 3) { const mx = Math.max(data[i], data[i + 1], data[i + 2]), mn = Math.min(data[i], data[i + 1], data[i + 2]); s += mx ? (mx - mn) / mx : 0; } return s / (data.length / 3); }

const yaml = readFileSync('src/data/objects.yaml', 'utf8');
const existing = new Set([...yaml.matchAll(/^- id:\s*(\S+)/gm)].map((m) => m[1]));
let targets = [];
for (const f of ['src/data/_more_neb.json', 'src/data/_more_gal.json']) if (existsSync(f)) { try { targets = targets.concat(JSON.parse(readFileSync(f, 'utf8'))); } catch (e) { console.log('parse fail', f); } }
const seen = new Set();
targets = targets.filter((t) => t && t.id && !existing.has(t.id) && !seen.has(t.id) && seen.add(t.id));
console.log('新增候选(去重去已有后):', targets.length);

const cred = JSON.parse(readFileSync(CRED, 'utf8'));
const kept = [];
let ok = 0, drop = 0;
async function pick(t) {
  const key = t.id.toLowerCase().replace(/[^a-z0-9]/g, '');
  const terms = [t.imageQuery, t.nameEn].filter(Boolean);
  const seenT = new Set(); const cands = [];
  for (const term of terms) {
    for (const title of await search(term)) {
      if (seenT.has(title)) continue; seenT.add(title);
      if (/\.svg/i.test(title) || /map|chart|diagram|location|finder/i.test(title)) continue;
      const meta = await info(title, 600); if (!meta?.url) continue;
      try { const buf = await bget(meta.url); if (buf.length < 20000) continue; const m = await sharp(buf).metadata(); if ((m.width || 0) < 480) continue; cands.push({ s: await sat(buf), title, meta }); } catch (e) {}
      if (cands.length >= 4) break;
    }
    if (cands.length >= 3) break;
  }
  cands.sort((a, b) => b.s - a.s);
  const best = cands.find((c) => c.s >= 0.11); if (!best) return null;
  const full = await info(best.title, 980); const buf = await bget((full || best.meta).url);
  writeFileSync(`${IMG}/${key}.jpg`, await sharp(buf).resize(900, null, { withoutEnlargement: true }).jpeg({ quality: 84 }).toBuffer());
  cred[key] = { ok: true, title: best.title.slice(5), artist: (full || best.meta).artist, license: (full || best.meta).license };
  return key;
}
const queue = targets.slice();
async function runner() { while (queue.length) { const t = queue.shift(); await sleep(250); let key; try { key = await pick(t); } catch (e) {} if (key) { t._img = key; kept.push(t); ok++; } else drop++; } }
await Promise.all(Array.from({ length: 1 }, runner));
console.log(`新增成功 ${ok} | 丢弃无好图 ${drop}`);

const q = (s) => JSON.stringify(String(s));
function entry(t) {
  const L = [
    `- id: ${t.id}`, `  name: ${q(t.name)}`, `  nameEn: ${q(t.nameEn)}`, `  catalog: ${t.catalog || 'Other'}`,
    `  type: ${t.type}`, `  typeLabel: ${q(t.typeLabel)}`, `  constellation: ${q(t.constellation)}`,
    `  ra: ${q(t.ra)}`, `  dec: ${Number.isFinite(t.dec) ? t.dec : 0}`,
    `  decLabel: ${q(t.decLabel || (t.dec >= 0 ? '+' + t.dec + '°' : '−' + Math.abs(t.dec) + '°'))}`,
    `  magnitude: ${t.magnitude == null ? 'null' : t.magnitude}`,
    `  hemisphere: ${['north', 'south', 'both'].includes(t.hemisphere) ? t.hemisphere : (t.dec > 20 ? 'north' : t.dec < -20 ? 'south' : 'both')}`,
    `  season: ${['spring', 'summer', 'autumn', 'winter', 'all'].includes(t.season) ? t.season : 'all'}`,
    `  difficulty: ${['beginner', 'intermediate', 'advanced'].includes(t.difficulty) ? t.difficulty : 'intermediate'}`,
    `  summary: ${q(t.summary)}`,
  ];
  if (t.summaryEn) L.push(`  summaryEn: ${q(t.summaryEn)}`);
  if (t.description) L.push(`  description: ${q(t.description)}`);
  if (t.descriptionEn) L.push(`  descriptionEn: ${q(t.descriptionEn)}`);
  if (t.focal) L.push(`  focal: ${q(t.focal)}`);
  L.push(`  image: ${t._img}`);
  return L.join('\n');
}
writeFileSync('src/data/objects.yaml', yaml.replace(/\n+$/, '') + '\n' + kept.map(entry).join('\n') + '\n');
writeFileSync(CRED, JSON.stringify(cred, null, 2));
console.log('已追加', kept.length, '个新天体;现共', existing.size + kept.length);
