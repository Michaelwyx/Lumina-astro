export const meta = {
  name: 'overview-replain',
  description: '概览页:删掉引言钩子,把引入正文改写得平实、克制',
  phases: [{ title: '改写概览' }],
};

const DIRS = [
  'astronomy/foundations', 'astronomy/solar-system', 'astronomy/deep-sky', 'astronomy/observing',
  'astrophotography/fundamentals', 'astrophotography/capture', 'astrophotography/processing',
];

function prompt(dir) {
  return `
改写两个 section 概览页,使其语言**平实、克制、客观**。文件:
- \`src/content/docs/${dir}/overview.mdx\`(中文)
- \`src/content/docs/en/${dir}/overview.mdx\`(英文)

## 对每个文件做且只做这些改动
1. **删除开头的引言钩子**:即正文里以 \`>\` 开头的引用块(blockquote),以及紧随其后、专门承接/解释那句引言的句子,全部删掉。
2. 把引言之后的引入正文,改写为 **1–2 句平实、客观的介绍**:直接说明本章涵盖哪些内容、在学习路径中的位置即可。
   - **不要**比喻、排比、感叹、名人名言、设问等修辞;不要浮夸辞藻;不要"想象一下/带着…去看…"之类的煽情。
   - 像一段严谨的百科条目导语:陈述事实,简洁。
3. **保持不变**:YAML frontmatter 原样;\`import ... from '@astrojs/starlight/components';\` 原样;\`## 本章涵盖\` / \`## What this section covers\` 这一行及其下方的整个 \`<CardGrid>…</CardGrid>\`(所有 LinkCard、href、title、description)**一字不改**。
4. 中文文件写中文,英文文件写英文(地道、平实的英文)。

用 Write 覆盖写回这两个文件。输出仍是合法 MDX。
`;
}

const STATUS = {
  type: 'object', additionalProperties: false,
  required: ['dir', 'wroteZh', 'wroteEn'],
  properties: { dir: { type: 'string' }, wroteZh: { type: 'boolean' }, wroteEn: { type: 'boolean' }, note: { type: 'string' } },
};

phase('改写概览');
const results = await parallel(
  DIRS.map((dir) => () =>
    agent(prompt(dir), { label: `replain:${dir.split('/')[1]}`, phase: '改写概览', schema: STATUS, agentType: 'general-purpose' })
  )
);
return { results };
