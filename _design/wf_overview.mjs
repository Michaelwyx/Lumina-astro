export const meta = {
  name: 'section-overviews',
  description: '为每个 section 生成引入式概览页(钩子 + 本章涵盖 + 导航),中英双语',
  phases: [{ title: '生成概览页' }],
};

const SECTIONS = [
  { dir: 'astronomy/foundations', zh: '天文基础', en: 'Foundations',
    theme: '认识天球、坐标、时间、星座、视运动与星等——一切观测与拍摄的语言基础。',
    pages: [['celestial-coordinates', '天球与坐标系'], ['time-systems', '时间系统'], ['constellations', '星图与星座'], ['apparent-motion', '天体的视运动'], ['magnitude', '星等系统']] },
  { dir: 'astronomy/solar-system', zh: '太阳系', en: 'The Solar System',
    theme: '我们的恒星、卫星、行星与小天体——离我们最近、最易上手观测的天体。',
    pages: [['sun', '太阳'], ['moon', '月球'], ['planets', '行星'], ['small-bodies', '矮行星 · 彗星 · 流星']] },
  { dir: 'astronomy/deep-sky', zh: '恒星与深空', en: 'Stars & the Deep Sky',
    theme: '从恒星的物理与命名,到星团、星云、星系——深空摄影的主要题材。',
    pages: [['stellar-physics', '恒星物理与赫罗图'], ['bright-stars', '著名恒星与恒星命名'], ['variable-multiple-stars', '双星 · 聚星 · 变星'], ['star-clusters', '星团'], ['nebulae', '星云'], ['galaxies', '星系'], ['notable-objects', '常见深空天体导览']] },
  { dir: 'astronomy/observing', zh: '观测天文学', en: 'Observing',
    theme: '大气、可见性、选址与目视技巧——如何在真实夜空下高效地看与拍。',
    pages: [['conditions', '大气与观测条件'], ['hemisphere-visibility', '半球可见性原理'], ['planning', '选址与观测计划'], ['visual-techniques', '目视观测技巧']] },
  { dir: 'astrophotography/fundamentals', zh: '摄影基础', en: 'Imaging Fundamentals',
    theme: '光学、曝光、传感器与信噪比——理解器材与成像背后的原理。',
    pages: [['optics', '光学基础'], ['exposure', '曝光、增益与 ISO'], ['sensors', '传感器:CMOS / CCD / 单色 / OSC'], ['snr', '噪声与信噪比:为什么要叠加']] },
  { dir: 'astrophotography/capture', zh: '拍摄技术', en: 'Capture',
    theme: '从星野广角到深空、行星与窄带——不同题材的实拍方法。',
    pages: [['widefield', '星野与广角'], ['dso-basics', '深空 DSO 拍摄'], ['planetary', '行星 · 月球 · 太阳'], ['narrowband', '窄带成像']] },
  { dir: 'astrophotography/processing', zh: '后期处理', en: 'Processing',
    theme: '从预处理叠加到完整后期流程与关键技术——把原始数据变成成片。',
    pages: [['stacking', '预处理与叠加'], ['workflow', '后期处理流程'], ['techniques', '关键后期技术']] },
];

function prompt(s) {
  const zhLinks = s.pages.map(([slug, t]) => `  - /${s.dir}/${slug}/  →  ${t}`).join('\n');
  return `
你在为一个中文为主、含英文版的天文/天文摄影 wiki(Astro + Starlight)生成一个 **section 概览页**。本 section:
- 名称(中):${s.zh}    名称(英):${s.en}
- 主题:${s.theme}
- 目录路径:${s.dir}
- 本 section 包含的页面(zh 路径 → 标题):
${zhLinks}
(英文版页面在 /en/${s.dir}/<slug>/;英文标题可读取 src/content/docs/en/${s.dir}/<slug>.mdx 的 frontmatter title,或准确翻译。)

## 任务
用 Write 写出两个文件:
1. \`src/content/docs/${s.dir}/overview.mdx\`(中文)
2. \`src/content/docs/en/${s.dir}/overview.mdx\`(英文)

## 每个文件的结构
\`\`\`mdx
---
title: ${s.zh} · 概览              # 英文版用 "${s.en} · Overview"
description: <一句话,≤60字/≤120 chars>
sidebar:
  label: 概览                      # 英文版 "Overview"
  order: 0
---

import { LinkCard, CardGrid } from '@astrojs/starlight/components';

> <一句**贴切、有格调、不俗套**的引入钩子:可以是名人对该主题的思考名言(注明出处)、一个简短的历史/科学小故事,或一段哲学思考/人生感悟。1–3 句。>

<1–2 段引入正文:为什么这部分重要、它在整个学习路径中的位置、读完能获得什么。生动但严谨,不浮夸、不堆砌比喻。>

## 本章涵盖                         # 英文版 "What this section covers"

<CardGrid>
  <LinkCard title="<页面标题>" href="/${s.dir}/<slug>/" description="<该页一句话简介,≤40字>" />
  ... 每个页面一个 LinkCard(英文版 href 前加 /en,标题/简介用英文)...
</CardGrid>
\`\`\`

## 要求
- 钩子务必**不落俗套**:避免康德"头顶的星空"等被用滥的句子;可用屈原《天问》、张若虚、苏轼、Carl Sagan、van Gogh、Galileo、Kepler 等,或自拟有思想的引子,但要贴合本 section 主题。中英文各自选用合适的引子(不必互译)。
- LinkCard 覆盖**上面列出的全部页面**,href 必须与给定路径一致(英文加 /en 前缀)。
- description(页面简介)请简短准确,可参考标题推断;若不确定可读取对应页面 frontmatter 的 description。
- 输出合法 MDX:frontmatter 用引号包裹含冒号的 title/description;正文不要出现裸露的 < 后跟数字。
- 不要加图片(避免引用不存在的图)。
`;
}

const STATUS = {
  type: 'object', additionalProperties: false,
  required: ['section', 'wroteZh', 'wroteEn'],
  properties: { section: { type: 'string' }, wroteZh: { type: 'boolean' }, wroteEn: { type: 'boolean' }, note: { type: 'string' } },
};

phase('生成概览页');
const results = await parallel(
  SECTIONS.map((s) => () =>
    agent(prompt(s), { label: `overview:${s.dir.split('/')[1]}`, phase: '生成概览页', schema: STATUS, agentType: 'general-purpose' })
  )
);
return { results };
