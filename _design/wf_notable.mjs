export const meta = {
  name: 'notable-objects-cards',
  description: '把「常见深空天体导览」改为每天体一图一介绍(ObjectEntry 卡片,去表格),再翻译英文版',
  phases: [{ title: '改写中文' }, { title: '翻译英文' }],
};

const ZH = 'src/content/docs/astronomy/deep-sky/notable-objects.mdx';
const EN = 'src/content/docs/en/astronomy/deep-sky/notable-objects.mdx';

const MAP = `
图键 → 天体(用 <ObjectEntry img="键" ...>,只用这些键):
星系:m31-andromeda=仙女座星系 M31 | m33-triangulum=三角座星系 M33 | m81-bode=波德星系 M81 | m82-cigar=雪茄星系 M82 | m51-whirlpool=涡状星系 M51(+伴星系 NGC 5195)| m104-sombrero=草帽星系 M104 | m101-pinwheel=风车星系 M101 | m64-blackeye=黑眼星系 M64 | leo-triplet=狮子三重奏(M65/M66/NGC 3628)| ngc253-sculptor=玉夫座星系 NGC 253 | centaurus-a=半人马 A(NGC 5128)| lmc=大麦哲伦云 LMC
发射星云:m42-orion=猎户座大星云 M42 | m8-lagoon=礁湖星云 M8 | m20-trifid=三叶星云 M20 | eagle-pillars=鹰状星云 M16(创生之柱)| ngc7000-namerica=北美洲星云 NGC 7000 | rosette=玫瑰星云 NGC 2237/2244 | heart-nebula=心脏星云 IC 1805 | carina=船底座星云 NGC 3372
行星状星云:m57-ring=环状星云 M57 | m27-dumbbell=哑铃星云 M27 | helix=螺旋星云 NGC 7293 | m97-owl=猫头鹰星云 M97
暗 / 反射星云:horsehead=马头星云 IC 434 / B33 | flame-nebula=火焰星云 NGC 2024 | rho-ophiuchi=ρ 蛇夫座云
超新星遗迹:m1-crab=蟹状星云 M1 | veil=面纱星云 NGC 6960/6992
星团:m45-pleiades=昴星团 M45 | m13-hercules=武仙座大球状星团 M13 | omega-cen=半人马 ω NGC 5139 | 47tuc=杜鹃座 47 NGC 104 | double-cluster=英仙座双星团 NGC 869/884
`;

const ZH_PROMPT = `
你在改写中文天文 wiki 的「常见深空天体导览」页(${ZH})。当前它用表格列天体,**现在改成:每个天体一张图 + 一段介绍,不要用表格**。

## 步骤
1. Read ${ZH}(里面已有每个天体的星座/距离/视星等/类型等数据,直接沿用)。
2. Write 整体覆盖:保留 frontmatter(title/difficulty/pillar/sidebar 不变,description 可微调);开头保留一句导览说明并链接 /reference/catalog/(完整可筛选数据)。
3. 仍按类型用 \`##\` 分组(星系 / 发射星云 / 行星状星云 / 暗与反射星云 / 超新星遗迹 / 星团),每组开头可写一两句类型概述。
4. **每个天体写成一个 ObjectEntry 卡片**(不要表格):
   \`import ObjectEntry from '@/components/ObjectEntry.astro';\`
   \`<ObjectEntry img="键" name="中文名 + 编号(+英文名)" facts="星座 · 约 N 光年 · mag X · 类型 · 季节 · 半球">\`
   \`介绍段落(2–4 句):它是什么、有何特征、发现/命名或趣味点、观测/拍摄建议。\`
   \`</ObjectEntry>\`
   - facts 用「 · 」分隔的关键事实(星座、距离、视星等、类型、最佳季节/半球),数据沿用原表(必要时按 Wikipedia 核对)。
   - 介绍要言之有物、严谨,**不用比喻浮夸**;术语首次标英文。
5. 覆盖原页所有天体(见下方映射),**只用列出的图键**,每个天体配其对应图。
6. 结尾保留/更新「## 参考资料」。不写一级标题,不用 LaTeX,无工具调用标记。

${MAP}
`;

const EN_PROMPT = (forLang) => `
你在把刚改写好的中文页 ${ZH} 翻译成英文,写到 ${EN}。
1. Read ${ZH}(已是 ObjectEntry 卡片式新版)。
2. 逐一翻译为地道天文英语,Write 到 ${EN}。
3. 严格保持结构:frontmatter 的 title/description 译成英文,其余字段(difficulty/pillar/sidebar)原样;import 行原样;每个 <ObjectEntry> 的 img 原样,name 与 facts 译成英文(facts 仍用「 · 」分隔:Constellation · ~N ly · mag X · type · season · hemisphere),卡片内介绍段落译成英文。
4. \`## 参考资料\` → \`## References\`,URL 原样、说明译成英文。专有名词/编号(M31、NGC、Hα 等)保留。
5. **内部链接**:文档链接加 /en 前缀(如 /reference/catalog/ → /en/reference/catalog/);外部链接原样。无工具调用标记。
`;

const STATUS = {
  type: 'object', additionalProperties: false,
  required: ['path', 'written'],
  properties: { path: { type: 'string' }, written: { type: 'boolean' }, count: { type: 'number' }, note: { type: 'string' } },
};

phase('改写中文');
const zh = await agent(ZH_PROMPT, { label: 'notable-objects(zh)', phase: '改写中文', schema: STATUS, agentType: 'general-purpose' });
log(`中文改写:${zh && zh.written ? '完成' : '失败'}`);

phase('翻译英文');
const en = await agent(EN_PROMPT(), { label: 'notable-objects(en)', phase: '翻译英文', schema: STATUS, agentType: 'general-purpose' });
log(`英文翻译:${en && en.written ? '完成' : '失败'}`);

return { zh, en };
