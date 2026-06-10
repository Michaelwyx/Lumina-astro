export const meta = {
  name: 'wiki-deepsky-expand',
  description: '深空板块:新增「著名恒星/常见深空天体」两页 + 为现有星团/星云/星系页补「代表目标」小节',
  phases: [{ title: '新增与扩充' }],
};

const ROOT = 'src/content/docs';

const GUIDE = `
你在为一个严谨的中文「天文 & 天文摄影」技术 wiki 写/改**一个**页面(MDX),目标:全面、准确、可查证。基于 Astro + Starlight。

## 流程
1. **先检索开源资料**:WebSearch + WebFetch(优先中/英 Wikipedia,恒星/天体条目;距离、星等、光谱型、形态等数据以 Wikipedia/SIMBAD 为准),抓 2–5 个来源逐项查证。
2. 用 Read 读目标文件(保留 frontmatter 的 title/difficulty/pillar/sidebar,仅重写 description)。用 Write 写出完整 MDX。只改这一个文件,不运行构建。
3. 结尾加「## 参考资料」3–6 条(标题+链接+半句说明)。

## 写作规范(严谨技术风格)
- 客观严谨,小节标题用中性名词短语,不用比喻/感叹号/营销腔。术语首次标英文,如「视星等(apparent magnitude)」。
- 公式禁用 LaTeX/$$,用行内代码。**全面、不限篇幅**,信息用表格/列表组织。
- **表格列数严格匹配**(表头 N 列 → 分隔行 N 个「---」),表格前后留空行。
- **禁止出现工具调用标记**(如 </content>、</invoke>、antml:)。正文不写一级标题、不手写难度徽章。
- 适当用 Aside(\`import { Aside } from '@astrojs/starlight/components';\`),标题中性。
- **不要链接 AstroBin**。数据核对可提 SIMBAD;实拍参考改为站内〔[天体目录](/reference/catalog/)〕。

## 天体/恒星条目必备字段
介绍每个天体/恒星时,尽量给出:**所在星座、赤经赤纬或大致位置、距离(光年 ly / 秒差距 pc)、视星等、类型或光谱型、物理特征(大小/年龄/成员数等)、肉眼/小镜可见性、最佳观测季节**。可用表格汇总 + 简短文字。

## 配图(<Fig>,只用下列 key)
\`import Fig from '@/components/Fig.astro';\` → \`<Fig name="KEY" alt="..." caption="客观说明" />\`;两图并排 \`<div class="cols2"><Fig/><Fig/></div>\`。
可用 KEY:
深空天体: m31-andromeda, m33-triangulum, m81-bode, m82-cigar, m51-whirlpool, m104-sombrero, m101-pinwheel, m64-blackeye, leo-triplet, lmc, m42-orion, m8-lagoon, m20-trifid, ngc7000-namerica, rosette, heart-nebula, carina, eagle-pillars, flame-nebula, rho-ophiuchi, m57-ring, m27-dumbbell, helix, horsehead, m1-crab, veil, m45-pleiades, m13-hercules, omega-cen, 47tuc
恒星/示意: betelgeuse(参宿四 SPHERE), sirius(天狼A/B), star-sizes(恒星大小比较), fig-hr-real(赫罗图), fig-magnitude, milkyway, startrails
**只用上面列出的 key,不要编造。**

## 站内链接(绝对路径+结尾斜杠)
/astronomy/deep-sky/stellar-physics/ , .../bright-stars/ , .../variable-multiple-stars/ , .../star-clusters/ , .../nebulae/ , .../galaxies/ , .../notable-objects/
/astronomy/foundations/magnitude/ , .../constellations/ , .../celestial-coordinates/
/reference/catalog/ , /reference/glossary/ , /astronomy/observing/hemisphere-visibility/
`;

const TASKS = {
  'astronomy/deep-sky/bright-stars': {
    mode: 'new',
    title: '著名恒星与恒星命名',
    spec: `写一页「著名恒星与恒星命名」。两大块:
(1) **恒星命名系统**(全面):Bayer 拜耳命名(希腊字母+星座属格,按亮度大致排序有例外,如 α/β/π¹π²)、Flamsteed 数字编号、变星命名(Argelander:R–Z、RR–ZZ、AA–QZ、之后 V335…)、IAU 批准的专有名(proper names,如 Sirius/Vega/Betelgeuse)、星表编号(HD、HIP、HR/BSC、Gaia DR3、SAO、Bonner Durchmusterung)、双星/聚星命名(如 α Cen A/B、ADS、WDS)。各系统给例子并说明覆盖范围。
(2) **全天最亮恒星表**(按视星等,约 25 颗):列 专有名 / Bayer 名 / 星座 / 视星等 / 距离(ly) / 光谱型 / 简评。涵盖 天狼、老人星、南门二(α Cen)、大角、织女、五车二、参宿七、南河三、水委一、参宿四、马腹一、河鼓二(牛郎)、十字架二、毕宿五、心宿二、角宿一、北河三、北落师门、天津四、十字架三、轩辕十四 等。
(3) **值得观测的典型恒星**(逐一介绍位置/距离/光谱型/特征):天狼(及其白矮星伴星 Sirius B)、参宿四(红超巨星、2019–2020 大变暗事件)、心宿二(红超巨星+ρ Oph 云)、织女(历史零等标准、未来北极星)、北极星(勾陈一、造父变星、当前天极指示)、老人星与南门二(南天)、大陵五 Algol(食变星)、刍藁增二 Mira(长周期变星)、开阳/辅(Mizar/Alcor 目视双星)、参宿七 Rigel。强调与天文摄影相关的点(北极星与极轴对准、恒星颜色与光谱型)。
末尾连到 /astronomy/deep-sky/stellar-physics/(物理)与 /astronomy/deep-sky/variable-multiple-stars/(变星双星)、/astronomy/foundations/constellations/(命名)。`,
    figs: 'betelgeuse、sirius、star-sizes(并排)、fig-hr-real(光谱型/赫罗图)、rho-ophiuchi(心宿二区)、m45-pleiades 可选。',
  },
  'astronomy/deep-sky/notable-objects': {
    mode: 'new',
    title: '常见深空天体导览',
    spec: `写一页「常见深空天体导览」——业余观测/摄影中最常拍的代表目标,**按类型分小节**,每个目标给:编号(M/NGC/IC)+ 俗名(中英)+ 所在星座 + 距离 + 视星等 + 物理特征 + 最佳观测季节/半球。每类用一张汇总表 + 配图 + 简短文字。开头说明本页是导览,完整可筛选数据见〔[天体目录](/reference/catalog/)〕。覆盖:
- **星系**:仙女 M31、三角 M33、波德 M81 与雪茄 M82、涡状 M51、草帽 M104、风车 M101、黑眼 M64、狮子三重奏(M65/M66/NGC3628)、玉夫 NGC253、大麦哲伦云 LMC、半人马 A(NGC5128,可不用图)。
- **发射星云/恒星形成区**:猎户 M42、礁湖 M8、三叶 M20、鹰状 M16(创生之柱)、北美 NGC7000、玫瑰 Rosette、心脏 IC1805、船底 NGC3372。
- **行星状星云**:环状 M57、哑铃 M27、螺旋 Helix(NGC7293)、猫头鹰 M97。
- **暗/反射星云**:马头(IC434/B33)、火焰 NGC2024、ρ 蛇夫云。
- **超新星遗迹**:蟹状 M1、面纱 NGC6960。
- **星团**:昴星团 M45、武仙 M13、半人马 ω、杜鹃 47、英仙双星团。
每个目标距离/星等用 Wikipedia/SIMBAD 数据。`,
    figs: '大量使用:m31-andromeda、m33-triangulum、m81-bode、m82-cigar、m51-whirlpool、m104-sombrero、m101-pinwheel、m64-blackeye、leo-triplet、m42-orion、m8-lagoon、m20-trifid、eagle-pillars、ngc7000-namerica、rosette、heart-nebula、carina、m57-ring、m27-dumbbell、helix、horsehead、flame-nebula、rho-ophiuchi、m1-crab、veil、m45-pleiades、m13-hercules、omega-cen、47tuc(按类型用 cols2 并排,挑代表性的配)。',
  },

  // ── 现有页:保留全部内容,新增「## 常见目标」小节 ──
  'astronomy/deep-sky/star-clusters': {
    mode: 'enhance',
    addSection: `在「## 参考资料」之前插入新小节 \`## 常见目标\`:用表格列出代表星团(疏散:昴星团 M45、毕星团 Hyades、蜂巢 M44、英仙双星团 NGC869/884;球状:武仙 M13、半人马 ω NGC5139、杜鹃 47 NGC104、M22),给 星座/距离/视星等/类型/特征,配 1–2 张 <Fig>(m45-pleiades、omega-cen 或 m13-hercules、47tuc),并一句话连到 /astronomy/deep-sky/notable-objects/ 与 /reference/catalog/。`,
    figs: 'm45-pleiades、omega-cen、m13-hercules、47tuc 中选 1–2 张。',
  },
  'astronomy/deep-sky/nebulae': {
    mode: 'enhance',
    addSection: `在「## 参考资料」之前插入新小节 \`## 常见目标\`:用表格按类型列出代表星云(发射:M42、M8、M20、M16、NGC7000、Rosette、Carina;行星状:M57、M27、Helix;暗/反射:马头、火焰;超新星遗迹:M1、面纱),给 星座/距离/视星等/类型/特征,配 1–2 张 <Fig>(从 m42-orion、rosette、m27-dumbbell、m1-crab、veil、helix 中选),连到 /astronomy/deep-sky/notable-objects/ 与 /reference/catalog/。`,
    figs: 'm42-orion、rosette、m27-dumbbell、m1-crab、veil、helix 中选 1–2 张。',
  },
  'astronomy/deep-sky/galaxies': {
    mode: 'enhance',
    addSection: `在「## 参考资料」之前插入新小节 \`## 常见目标\`:用表格列出代表星系(仙女 M31、三角 M33、波德 M81、雪茄 M82、涡状 M51、草帽 M104、风车 M101、黑眼 M64、狮子三重奏、玉夫 NGC253、LMC),给 星座/距离/视星等/类型(形态)/特征,配 1–2 张 <Fig>(从 m31-andromeda、m81-bode、m82-cigar、m101-pinwheel、m64-blackeye、leo-triplet 中选),连到 /astronomy/deep-sky/notable-objects/ 与 /reference/catalog/。`,
    figs: 'm31-andromeda、m81-bode、m82-cigar、m101-pinwheel、m64-blackeye、leo-triplet 中选 1–2 张。',
  },
};

const STATUS = {
  type: 'object', additionalProperties: false,
  required: ['path', 'written', 'note'],
  properties: {
    path: { type: 'string' }, written: { type: 'boolean' },
    sources: { type: 'array', items: { type: 'string' } },
    figsUsed: { type: 'array', items: { type: 'string' } },
    note: { type: 'string' },
  },
};

const targets = Array.isArray(args) && args.length ? args : Object.keys(TASKS);

function prompt(path) {
  const t = TASKS[path];
  if (t.mode === 'new') {
    return [GUIDE,
      `\n# 任务:研究并写新页 \`${ROOT}/${path}.mdx\`(标题:${t.title})`,
      `\n## 内容要求\n${t.spec}`,
      `\n## 配图\n${t.figs}`,
      `\n先 WebSearch + WebFetch 查证(优先 Wikipedia/SIMBAD)→ Read 目标(现为占位骨架,保留 frontmatter)→ Write 完整 MDX(严谨全面、表格列数匹配、结尾「## 参考资料」)→ 结构化报告。`,
    ].join('\n');
  }
  return [GUIDE,
    `\n# 任务:为现有页 \`${ROOT}/${path}.mdx\` 增补「常见目标」小节`,
    `\n## 要求\n先 Read 该文件,**完整保留现有所有内容与结构不变**。${t.addSection}\n查证目标的距离/星等等数据(WebSearch/WebFetch,Wikipedia/SIMBAD)。把更新后的完整文件用 Write 写回(可在「## 参考资料」补充新来源)。`,
    `\n## 可用配图\n${t.figs}`,
    `\n注意:不得删改原有正文;只新增一个「## 常见目标」小节并(如需)补参考。表格列数严格匹配。`,
  ].join('\n');
}

phase('新增与扩充');
log(`深空板块:${targets.length} 个任务`);
const results = await parallel(
  targets.map((path) => () =>
    agent(prompt(path), { label: path.split('/').pop(), phase: '新增与扩充', schema: STATUS, agentType: 'general-purpose' })
  )
);
return { processed: targets.length, written: results.filter(Boolean).filter((r) => r.written).length, results };
