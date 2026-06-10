// 读取精选目标(_targets_*.json),为每个目标抓取 Commons 上的高质量【彩色】照片,
// 仅保留拿到好图的目标,重建 src/data/objects.yaml(含 description)。
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const UA = 'AstroWikiBuilder/1.0 (wangyixu21@gmail.com)';
const IMG = 'src/assets/images';
const CRED = 'src/data/credits.json';
const API = 'https://commons.wikimedia.org/w/api.php';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function jget(url) {
  for (let i = 0; i < 4; i++) { try { const r = await fetch(url, { headers: { 'User-Agent': UA } }); if (r.ok) return await r.json(); } catch (e) {} await sleep(500); }
  return null;
}
async function bget(url) { const r = await fetch(url, { headers: { 'User-Agent': UA } }); if (!r.ok) throw new Error('http ' + r.status); return Buffer.from(await r.arrayBuffer()); }
async function search(term, n = 8) {
  const d = await jget(API + '?' + new URLSearchParams({ action: 'query', format: 'json', list: 'search', srsearch: term, srnamespace: '6', srlimit: String(n) }));
  return (d?.query?.search || []).map((h) => h.title);
}
async function info(title, width) {
  const d = await jget(API + '?' + new URLSearchParams({ action: 'query', format: 'json', prop: 'imageinfo', iiprop: 'url|extmetadata|mime', iiurlwidth: String(width), titles: title }));
  const pages = d?.query?.pages || {};
  for (const k in pages) {
    const ii = pages[k].imageinfo?.[0];
    if (!ii || !['image/jpeg', 'image/png'].includes(ii.mime)) return null;
    const m = ii.extmetadata || {};
    const strip = (v) => (v ? v.value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '');
    let a = strip(m.Artist).split(/Acknowledge|Image processing|Credit:|Image:/i).filter(Boolean)[0] || 'Wikimedia Commons';
    if (a.length > 80) a = a.slice(0, 78).replace(/\s+\S*$/, '') + '…';
    return { url: ii.thumburl || ii.url, artist: a, license: strip(m.LicenseShortName) };
  }
  return null;
}
async function sat(buf) {
  const { data } = await sharp(buf).resize(48, 48, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let s = 0; for (let i = 0; i < data.length; i += 3) { const mx = Math.max(data[i], data[i + 1], data[i + 2]), mn = Math.min(data[i], data[i + 1], data[i + 2]); s += mx ? (mx - mn) / mx : 0; }
  return s / (data.length / 3);
}

// 现有"优质描述键"映射(id -> key),复用不重抓
const existingYaml = existsSync('src/data/objects.yaml') ? readFileSync('src/data/objects.yaml', 'utf8') : '';
const goodKey = {};
for (const b of existingYaml.split(/(?=^- id:)/m)) {
  const id = (b.match(/^- id:\s*(\S+)/) || [])[1];
  const key = (b.match(/\n {2}image:\s*(\S+)/) || [])[1];
  if (id && key && !/^[mc]\d+$/i.test(key) && existsSync(`${IMG}/${key}.jpg`)) goodKey[id] = key; // 仅复用人工精选的描述键
}

// 载入精选目标
let targets = [];
for (const f of ['src/data/_targets_neb.json', 'src/data/_targets_gal.json']) {
  if (existsSync(f)) { try { targets = targets.concat(JSON.parse(readFileSync(f, 'utf8'))); } catch (e) { console.log('解析失败', f, e.message); } }
}
// 去重(按 id)
const seen = new Set(); targets = targets.filter((t) => t && t.id && !seen.has(t.id) && seen.add(t.id));
console.log('精选目标:', targets.length, '| 可复用已有图:', Object.keys(goodKey).length);

const cred = JSON.parse(readFileSync(CRED, 'utf8'));
const kept = [];
let fetched = 0, reused = 0, dropped = 0;

async function pickImage(t) {
  const key = t.id.toLowerCase().replace(/[^a-z0-9]/g, '');
  const terms = [t.imageQuery, t.nameEn, `${t.nameEn} ${t.typeLabel?.includes('星系') ? 'galaxy' : 'nebula'}`].filter(Boolean);
  const seenT = new Set();
  const cands = [];
  for (const term of terms) {
    for (const title of await search(term)) {
      if (seenT.has(title)) continue; seenT.add(title);
      if (/\.svg/i.test(title) || /map|chart|diagram|location|finder/i.test(title)) continue;
      const meta = await info(title, 600);
      if (!meta?.url) continue;
      try {
        const buf = await bget(meta.url);
        if (buf.length < 20000) continue;
        const m = await sharp(buf).metadata();
        if ((m.width || 0) < 480) continue;
        const s = await sat(buf);
        cands.push({ s, title, meta });
      } catch (e) {}
      if (cands.length >= 8) break;
    }
    if (cands.length >= 5) break;
  }
  cands.sort((a, b) => b.s - a.s);
  const best = cands.find((c) => c.s >= 0.11);
  if (!best) return null;
  const full = await info(best.title, 980);
  const buf = await bget((full || best.meta).url);
  const out = await sharp(buf).resize(900, null, { withoutEnlargement: true }).jpeg({ quality: 84 }).toBuffer();
  writeFileSync(`${IMG}/${key}.jpg`, out);
  cred[key] = { ok: true, title: best.title.slice(5), artist: (full || best.meta).artist, license: (full || best.meta).license };
  return key;
}

const queue = targets.slice();
async function runner() {
  while (queue.length) {
    const t = queue.shift();
    await sleep(120);
    let key = goodKey[t.id];
    if (key) { reused++; }
    else { try { key = await pickImage(t); } catch (e) {} if (key) fetched++; }
    if (key) { t._img = key; kept.push(t); } else { dropped++; }
  }
}
await Promise.all(Array.from({ length: 3 }, runner));
console.log(`保留 ${kept.length}(复用 ${reused} / 新抓 ${fetched})| 丢弃无好图 ${dropped}`);

// 生成 objects.yaml
const q = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
function entry(t) {
  const lines = [
    `- id: ${t.id}`,
    `  name: ${q(t.name)}`,
    `  nameEn: ${q(t.nameEn)}`,
    `  catalog: ${t.catalog || 'Other'}`,
    `  type: ${t.type}`,
    `  typeLabel: ${q(t.typeLabel)}`,
    `  constellation: ${q(t.constellation)}`,
    `  ra: ${q(t.ra)}`,
    `  dec: ${Number.isFinite(t.dec) ? t.dec : 0}`,
    `  decLabel: ${q(t.decLabel || (t.dec >= 0 ? '+' + t.dec + '°' : '−' + Math.abs(t.dec) + '°'))}`,
    `  magnitude: ${t.magnitude == null ? 'null' : t.magnitude}`,
    `  hemisphere: ${['north', 'south', 'both'].includes(t.hemisphere) ? t.hemisphere : (t.dec > 20 ? 'north' : t.dec < -20 ? 'south' : 'both')}`,
    `  season: ${['spring', 'summer', 'autumn', 'winter', 'all'].includes(t.season) ? t.season : 'all'}`,
    `  difficulty: ${['beginner', 'intermediate', 'advanced'].includes(t.difficulty) ? t.difficulty : 'intermediate'}`,
    `  summary: ${q(t.summary)}`,
  ];
  if (t.description) lines.push(`  description: ${q(t.description)}`);
  if (t.focal) lines.push(`  focal: ${q(t.focal)}`);
  lines.push(`  image: ${t._img}`);
  return lines.join('\n');
}
// 排序:类型分组,再按 id
kept.sort((a, b) => (a.type || '').localeCompare(b.type || '') || String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
const header = '# 精选天体目录 —— 视觉效果突出、热门天文摄影目标(参考 AstroBin / Telescope Live)。\n# 每个天体含较完整介绍与彩色配图。坐标/星等为近似值,以 SIMBAD 为准。\n';
writeFileSync('src/data/objects.yaml', header + '\n' + kept.map(entry).join('\n') + '\n');
writeFileSync(CRED, JSON.stringify(cred, null, 2));
console.log('objects.yaml 已重建,共', kept.length, '个天体');
