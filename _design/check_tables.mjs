import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
const files = execSync('find src/content/docs -name "*.mdx"').toString().trim().split('\n');
const sepRe = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/;
const cols = (line) => {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').length;
};
let bad = 0;
for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n');
  for (let i = 1; i < lines.length; i++) {
    if (sepRe.test(lines[i]) && lines[i].includes('--')) {
      const headerCols = cols(lines[i - 1]);
      const sepCols = cols(lines[i]);
      // 仅当上一行像表头(含 |)时才比较
      if (lines[i - 1].includes('|') && headerCols !== sepCols) {
        bad++;
        console.log(`${f.replace('src/content/docs/','')}:${i+1}  表头 ${headerCols} 列 vs 分隔 ${sepCols} 列`);
        console.log(`   H: ${lines[i-1].trim().slice(0,80)}`);
        console.log(`   S: ${lines[i].trim()}`);
      }
    }
  }
}
console.log(bad ? `\n共 ${bad} 处列数不匹配的表格` : '\n✓ 所有表格列数匹配');
