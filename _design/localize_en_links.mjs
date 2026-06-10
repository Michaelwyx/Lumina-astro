// 给 src/content/docs/en/ 下所有 mdx 的内部文档链接加 /en 前缀;
// 但天体目录详情页 /reference/catalog/<ID>/ 保持不变(它们是共享的非本地化页面)。
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const files = execSync('find src/content/docs/en -name "*.mdx"').toString().trim().split('\n').filter(Boolean);
// 文档根前缀(这些路径有 /en 版本)
const docPrefixes = ['astronomy', 'astrophotography', 'reference', 'start'];
const linkRe = new RegExp(`(\\]\\(|href=["'])(/(?:${docPrefixes.join('|')})/[^)"'#\\s]*)`, 'g');
// 目录详情页:/reference/catalog/<ID>/,ID 以大写字母开头(M42 / NGC7000 / IC434 / LMC …)
const catalogDetail = /^\/reference\/catalog\/[A-Z][A-Za-z0-9]+\/?$/;

let changed = 0, links = 0;
for (const f of files) {
  let t = readFileSync(f, 'utf8');
  let n = 0;
  t = t.replace(linkRe, (m, pre, path) => {
    links++;
    if (path.startsWith('/en/')) return m;            // 已带 /en
    if (catalogDetail.test(path)) return m;            // 目录详情页:保持
    n++;
    return `${pre}/en${path}`;
  });
  if (n) { writeFileSync(f, t); changed++; }
}
console.log(`处理 ${files.length} 个英文页,扫描内部链接 ${links} 条,重写 ${changed} 个文件。`);
