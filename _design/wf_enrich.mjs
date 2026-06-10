export const meta = {
  name: 'catalog-enrich',
  description: '为现有天体补更充分的中文介绍 + 英文简介/介绍(英文化)',
  phases: [{ title: '补充与英文化' }],
};

const GROUPS = [
  'B33,LMC,C92,IC1396,M8,M20,NGC281,NGC2174,NGC6334,NGC7000,Sh2-155,M49,M64,M77,M83,M106,NGC247,NGC925,NGC1300,NGC2841,NGC4038,NGC4486,NGC5194,NGC7320,C106,M15,C14,M6,M44,M27,NGC40,NGC7293,C33,M1',
  'C99,SMC,IC405,IC1805,M16,M42,NGC1499,NGC3372,NGC6357,NGC7380,M31,M51,M65,M81,M101,M108,NGC253,NGC1097,NGC1365,NGC3190,NGC4038B,NGC4490,NGC6744,NGC7331,M3,M22,C50,M7,M45,M57,NGC6302,M78,C34,NGC6979',
  'IC434,C49,IC410,IC5070,M17,M43,NGC2024,NGC6188,NGC6820,Sh2-101,M33,M63,M74,M82,M104,NGC55,NGC891,NGC1232,NGC2403,NGC3628,NGC4216,NGC4565,NGC6946,C80,M13,C13,C94,M37,NGC2244,M97,NGC6826,Sh2-279,IC443',
];

const GUIDE = (ids, file) => `
你在为一个天文 wiki 的「天体目录」补充介绍并英文化。目标天体(按编号):
${ids}

## 步骤
1. Read \`src/data/objects.yaml\`,找到上述每个 id 的现有数据(name/nameEn/type/constellation/magnitude 等)。
2. 对**每个** id,产出三段文本(可用 WebSearch / WebFetch 核对距离、尺度、特征等关键事实,优先 Wikipedia/SIMBAD):
   - **description**(中文,**4–6 句、更充分**):它是什么、距离与尺度、显著特征/发现或趣味点、观测或拍摄看点。严谨、有信息量、不堆砌。
   - **summaryEn**(英文一句话,≤90 字符):对应卡片简介。
   - **descriptionEn**(英文,4–6 句):与 description 对应的英文版。
3. 用 Write 写出一个 **JSON 对象**(不是数组)到 \`${file}\`,形如:
   { "M42": { "description": "……", "summaryEn": "…", "descriptionEn": "…" }, "M31": { … }, … }
   只含 JSON,无代码围栏、无其它文字。覆盖你负责的**全部** id。

## 注意
- 专有名词/编号(M42、NGC、Hα、O III 等)保持原样。中文用规范术语;英文用地道天文英语。
- JSON 字符串内若需引号,用中文「」或转义,确保 JSON 合法可解析。
- 数值(距离光年、视星等、角尺寸)力求准确。
`;

const STATUS = {
  type: 'object', additionalProperties: false,
  required: ['file', 'written', 'count'],
  properties: { file: { type: 'string' }, written: { type: 'boolean' }, count: { type: 'number' }, note: { type: 'string' } },
};

phase('补充与英文化');
const results = await parallel(
  GROUPS.map((ids, i) => () =>
    agent(GUIDE(ids, `src/data/_enrich_${i + 1}.json`), {
      label: `enrich-${i + 1}`, phase: '补充与英文化', schema: STATUS, agentType: 'general-purpose',
    })
  )
);
return { results };
