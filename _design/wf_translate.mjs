export const meta = {
  name: 'wiki-translate-en',
  description: '把中文内容页逐页翻译为英文,写入 /en/ 镜像(保留结构/组件/表格/配图)',
  phases: [{ title: '翻译为英文' }],
};

const ROOT = 'src/content/docs';

const GUIDE = `
你在把一个中文「天文 & 天文摄影」技术 wiki 的**一个**页面翻译成**英文**(MDX),写入 /en/ 镜像。
基于 Astro + Starlight。译文要**准确、地道、术语规范**(天文专业英语)。

## 流程
1. Read 源文件(中文)。
2. 翻译为英文。
3. Write 到目标英文文件路径(en/ 镜像)。只写这一个文件,不运行构建,不改其它文件。

## 严格保持结构(逐一对应,不增删内容)
- **Frontmatter**:把 \`title\`、\`description\`、\`tagline\`(若有)译成简洁英文;**其余字段原样保留**(difficulty / pillar / sidebar / order / season / prerequisites / template / hero 的非文本字段等)。hero 里的 \`alt\`/\`text\`(按钮文字)译成英文,\`link\`/\`icon\`/\`file\`/\`variant\` 原样。
- **组件 import 行**原样保留(如 \`import Fig from '@/components/Fig.astro';\`、\`import { Aside } from '@astrojs/starlight/components';\`、diagrams 组件)。
- **配图** \`<Fig name="KEY" ... />\`:\`name\` 原样,\`alt\`/\`caption\` 译成英文。
- **Aside / Card / LinkCard / Steps / 概念图组件**:\`type\`/\`icon\`/\`href\`/\`name\` 原样,\`title\`/\`description\`/正文文字译成英文。
- **表格**:逐格翻译内容,**保持列数与分隔行 --- 完全一致**,表格前后留空行。
- **标题层级、列表、代码、公式**(行内代码/代码块)结构不变;公式与代码内容原样,不要翻译变量。
- 专有名词/编号保持:M42、NGC 7000、RA/Dec、Hα/OIII/SII、Bayer 字母、人名、软件名、地名等不音译。
- 「## 参考资料」标题译为「## References」;**参考链接的 URL 原样**,把每条后面的中文说明译成英文。
- **内部链接保持与源文件完全一致**(不要改路径,稍后由脚本统一加 /en 前缀)。
- 不得出现任何工具调用标记(</content>、</invoke>、antml: 等)。正文不写一级标题。

## 质量
- 用规范天文英语(如 right ascension / declination / globular cluster / narrowband / light pollution / signal-to-noise ratio)。
- 数值、单位、符号(如 23.44°、″、ly、pc、mag/arcsec²)原样保留。
- 译文长度应与原文相当(全面,不要缩写省略)。
`;

const STATUS = {
  type: 'object', additionalProperties: false,
  required: ['src', 'dest', 'written'],
  properties: {
    src: { type: 'string' }, dest: { type: 'string' },
    written: { type: 'boolean' }, note: { type: 'string' },
  },
};

// 翻译目标(相对 docs,不含 .mdx、不含 en/);index 单独手工处理(hero 图相对路径)
const ALL = [
  'astronomy/cosmology/overview',
  'astronomy/deep-sky/bright-stars', 'astronomy/deep-sky/galaxies', 'astronomy/deep-sky/nebulae',
  'astronomy/deep-sky/notable-objects', 'astronomy/deep-sky/star-clusters',
  'astronomy/deep-sky/stellar-physics', 'astronomy/deep-sky/variable-multiple-stars',
  'astronomy/foundations/apparent-motion', 'astronomy/foundations/celestial-coordinates',
  'astronomy/foundations/constellations', 'astronomy/foundations/magnitude', 'astronomy/foundations/time-systems',
  'astronomy/observing/conditions', 'astronomy/observing/hemisphere-visibility',
  'astronomy/observing/planning', 'astronomy/observing/visual-techniques',
  'astronomy/solar-system/moon', 'astronomy/solar-system/planets',
  'astronomy/solar-system/small-bodies', 'astronomy/solar-system/sun',
  'astrophotography/calibration/calibration-frames',
  'astrophotography/capture/dso-basics', 'astrophotography/capture/narrowband',
  'astrophotography/capture/planetary', 'astrophotography/capture/widefield',
  'astrophotography/fundamentals/exposure', 'astrophotography/fundamentals/optics',
  'astrophotography/fundamentals/sensors', 'astrophotography/fundamentals/snr',
  'astrophotography/processing/stacking', 'astrophotography/processing/techniques',
  'astrophotography/processing/workflow',
  'astrophotography/remote-platforms/overview', 'astrophotography/remote-platforms/platforms-comparison',
  'reference/catalog', 'reference/glossary', 'reference/learning-paths',
  'reference/observatories', 'reference/resources', 'reference/software',
  'start',
];
// 支持用 args 传子集(可选);否则翻译全部
const targets = Array.isArray(args) && args.length ? args : ALL;

function prompt(path) {
  const src = `${ROOT}/${path}.mdx`;
  const dest = `${ROOT}/en/${path}.mdx`;
  return [
    GUIDE,
    `\n# 任务:翻译 \`${src}\` → 写入 \`${dest}\``,
    `\n步骤:Read 源文件 → 翻译成英文(严格保持上述结构)→ Write 到目标路径(会自动创建目录)→ 结构化报告。`,
  ].join('\n');
}

phase('翻译为英文');
log(`翻译 ${targets.length} 页 → /en/`);
const results = await parallel(
  targets.map((path) => () =>
    agent(prompt(path), { label: 'en/' + path.split('/').slice(-1)[0], phase: '翻译为英文', schema: STATUS, agentType: 'general-purpose' })
  )
);
return { processed: targets.length, written: results.filter(Boolean).filter((r) => r.written).length, results };
