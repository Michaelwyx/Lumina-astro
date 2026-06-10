// 为 objects.yaml 中缺图的天体批量抓取 Wikipedia 词条首图(Commons 自由图),
// 过滤掉过小/黑白图,下载并归一化到 ~820px,更新 credits.json 与 objects.yaml 的 image 字段。
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const UA = 'AstroWikiBuilder/1.0 (wangyixu21@gmail.com)';
const IMG = 'src/assets/images';
const CRED = 'src/data/credits.json';
const YAML = 'src/data/objects.yaml';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function jget(url) {
  for (let i = 0; i < 5; i++) {
    try { const r = await fetch(url, { headers: { 'User-Agent': UA } }); if (r.ok) return await r.json(); } catch (e) {}
    await sleep(700);
  }
  return null;
}
async function bget(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error('http ' + r.status);
  return Buffer.from(await r.arrayBuffer());
}

// Wikipedia 词条首图(缩略图,始终为 jpg/png,避免 TIFF/SVG 被过滤)
async function leadImage(title) {
  const u = 'https://en.wikipedia.org/w/api.php?' + new URLSearchParams({
    action: 'query', format: 'json', titles: title, prop: 'pageimages',
    piprop: 'thumbnail', pithumbsize: '900', redirects: '1',
  });
  const d = await jget(u);
  const pages = d?.query?.pages || {};
  for (const k in pages) { const o = pages[k].thumbnail; if (o?.source) return o.source; }
  return null;
}
// 由 upload.wikimedia URL 反查 Commons 文件标题 -> 署名/许可
function fileTitleFromUrl(url) {
  const m = decodeURIComponent(url).match(/\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/]+)/);
  return m ? 'File:' + m[1] : null;
}
async function credit(fileTitle) {
  if (!fileTitle) return { artist: 'Wikimedia Commons', license: '' };
  const u = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
    action: 'query', format: 'json', prop: 'imageinfo', iiprop: 'extmetadata', titles: fileTitle,
  });
  const d = await jget(u);
  const pages = d?.query?.pages || {};
  for (const k in pages) {
    const m = pages[k].imageinfo?.[0]?.extmetadata || {};
    const strip = (v) => (v ? v.value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '');
    let a = strip(m.Artist).split(/Acknowledge|Image processing|Credit:|Image:/i).filter(Boolean)[0] || 'Wikimedia Commons';
    if (a.length > 80) a = a.slice(0, 78).replace(/\s+\S*$/, '') + '…';
    return { artist: a, license: strip(m.LicenseShortName) };
  }
  return { artist: 'Wikimedia Commons', license: '' };
}
async function sat(buf) {
  const { data } = await sharp(buf).resize(48, 48, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let s = 0; for (let i = 0; i < data.length; i += 3) { const mx = Math.max(data[i], data[i + 1], data[i + 2]), mn = Math.min(data[i], data[i + 1], data[i + 2]); s += mx ? (mx - mn) / mx : 0; }
  return s / (data.length / 3);
}

const yaml = readFileSync(YAML, 'utf8');
const cred = JSON.parse(readFileSync(CRED, 'utf8'));
// 解析每个 block 的 id / nameEn / 是否有 image
const blocks = yaml.split(/(?=^- id:)/m);
const todo = [];
for (const b of blocks) {
  const id = (b.match(/^- id:\s*(\S+)/) || [])[1];
  if (!id) continue;
  if (/\n {2}image:/.test(b)) continue;            // 已有图
  const nameEn = (b.match(/\n {2}nameEn:\s*(.+)/) || [])[1]?.trim();
  todo.push({ id, nameEn });
}
console.log('缺图天体:', todo.length);

const found = {}; // id -> key
let ok = 0, miss = 0;
async function work(item) {
  await sleep(150);
  const { id, nameEn } = item;
  const key = id.toLowerCase();
  const titles = id.match(/^M\d+$/) ? ['Messier ' + id.slice(1), nameEn] : [nameEn, id];
  for (const t of titles) {
    if (!t) continue;
    try {
      const url = await leadImage(t);
      if (!url || !/\.(jpe?g|png)$/i.test(url.split('?')[0])) continue;
      const buf = await bget(url);
      if (buf.length < 12000) continue;
      const meta = await sharp(buf).metadata();
      if ((meta.width || 0) < 220) continue;
      if ((await sat(buf)) < 0.025) continue;       // 跳过基本黑白
      const out = await sharp(buf).resize(820, null, { withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer();
      writeFileSync(`${IMG}/${key}.jpg`, out);
      const c = await credit(fileTitleFromUrl(url));
      cred[key] = { ok: true, title: t, artist: c.artist, license: c.license };
      found[id] = key; ok++;
      return;
    } catch (e) {}
  }
  miss++;
}

// 并发 5
const queue = todo.slice();
async function runner() { while (queue.length) { await work(queue.shift()); } }
await Promise.all(Array.from({ length: 2 }, runner));
console.log(`下载 ${ok},未找到 ${miss}`);

// 写回 credits
writeFileSync(CRED, JSON.stringify(cred, null, 2));
// 写回 objects.yaml:为成功的 id 在 focal 行(或 summary 行)后插入 image
let out = blocks.map((b) => {
  const id = (b.match(/^- id:\s*(\S+)/) || [])[1];
  if (!id || !found[id] || /\n {2}image:/.test(b)) return b;
  if (/\n {2}focal:[^\n]*\n/.test(b)) return b.replace(/(\n {2}focal:[^\n]*\n)/, `$1  image: ${found[id]}\n`);
  return b.replace(/(\n {2}summary:[^\n]*\n)/, `$1  image: ${found[id]}\n`);
}).join('');
writeFileSync(YAML, out);
console.log('objects.yaml 已更新,新增图:', Object.keys(found).length);
